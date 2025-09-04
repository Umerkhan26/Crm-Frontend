import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  Container,
  Card,
  CardBody,
  Spinner,
  Badge,
  Button,
  Row,
  Col,
  Table,
  Alert,
  Form,
  FormGroup,
  Label,
  Input,
  ModalFooter,
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { toast } from "react-toastify";
import {
  getLeadsByCampaignAndAssignee,
  fetchLeadsByAssigneeId,
  updateLeadStatus,
  getLeadActivitiesByLeadId,
  deleteLeadActivityById,
} from "../../services/leadService";
import {
  getNotes,
  addNote,
  addReminder,
  getReminders,
  deleteNote,
  deleteReminder,
} from "../../services/noteService";
import { useSelector } from "react-redux";
import { hasAnyPermission } from "../../utils/permissions";
import { FaTrash } from "react-icons/fa";
import useDeleteConfirmation from "../../components/Modals/DeleteConfirmation";

const validateStatus = (status) => {
  const validStatuses = [
    "pending",
    "to_call",
    "most_interested",
    "sold",
    "not_interested",
  ];
  return validStatuses.includes(status?.toLowerCase())
    ? status.toLowerCase()
    : "pending";
};

const getStatusBadgeColor = (status) => {
  switch (validateStatus(status)) {
    case "pending":
      return "warning";
    case "to_call":
      return "info";
    case "most_interested":
      return "primary";
    case "sold":
      return "success";
    case "not_interested":
      return "secondary";
    default:
      return "secondary";
  }
};

const AssignedLeadDetailPage = () => {
  const { leadId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { confirmDelete } = useDeleteConfirmation();
  const queryParams = new URLSearchParams(location.search);
  const userId = queryParams.get("userId");
  const campaignName = queryParams.get("campaign");
  const [deletingNoteId, setDeletingNoteId] = useState(null);
  const [lead, setLead] = useState(null);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [notesLoading, setNotesLoading] = useState(false);
  const [addingNote, setAddingNote] = useState(false);
  const [error, setError] = useState(null);
  const [currentStatus, setCurrentStatus] = useState("pending");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [reminders, setReminders] = useState([]);
  const [reminderLoading, setReminderLoading] = useState(false);
  const [reminderError, setReminderError] = useState(null);
  const [reminderContent, setReminderContent] = useState("");
  const [reminderType, setReminderType] = useState("");
  const [reminderDate, setReminderDate] = useState("");
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [reminderModalOpen, setReminderModalOpen] = useState(false);
  const [activities, setActivities] = useState([]);
  const [activitiesLoading, setActivitiesLoading] = useState(false);
  const [activitiesError, setActivitiesError] = useState(null);
  const [deletingActivityId, setDeletingActivityId] = useState(null);
  const currentUser = useSelector((state) => state.Login?.user);
  const targetUserId = userId || currentUser?.id;
  const isAdmin = hasAnyPermission(currentUser, ["user:get"]);
  const [deletingReminderId, setDeletingReminderId] = useState(null);

  useEffect(() => {
    const fetchLeadDetails = async () => {
      try {
        setLoading(true);

        if (!leadId) {
          throw new Error("Lead ID is missing");
        }

        const canView = hasAnyPermission(currentUser, ["note:view"]);
        if (!canView) {
          throw new Error("You don't have permission to view this lead");
        }

        if (!targetUserId) {
          throw new Error("User ID is missing");
        }

        let leadData;
        let leads;

        if (campaignName) {
          const response = await getLeadsByCampaignAndAssignee(
            campaignName,
            targetUserId
          );
          leads = Array.isArray(response) ? response : response.data || [];
          leadData = leads.find((lead) => lead.id === parseInt(leadId));
        }

        if (!leadData) {
          const response = await fetchLeadsByAssigneeId(targetUserId);
          leads = Array.isArray(response) ? response : response.data || [];
          leadData = leads.find((lead) => lead.id === parseInt(leadId));
        }

        if (!leadData) {
          throw new Error("Lead not found");
        }

        // Parse lead data
        leadData.leadData =
          typeof leadData.leadData === "string"
            ? JSON.parse(leadData.leadData)
            : leadData.leadData || {};
        leadData.assignees =
          typeof leadData.assignees === "string"
            ? JSON.parse(leadData.assignees)
            : leadData.assignees || [];

        const status = validateStatus(
          leadData.status ||
            leadData.assignees.find((a) => a.userId === targetUserId)?.status
        );
        setCurrentStatus(status);
        setIsDisabled(leadData.status_updated || false);
        setLead(leadData);

        // Fetch notes
        setNotesLoading(true);
        const notesResponse = await getNotes(leadId, "lead");
        const fetchedNotes =
          notesResponse.notes || notesResponse.data || notesResponse || [];
        setNotes(fetchedNotes);

        // Fetch reminders
        setReminderLoading(true);
        const remindersResponse = await getReminders(leadId, "lead");
        const fetchedReminders =
          remindersResponse.reminders ||
          remindersResponse.data ||
          remindersResponse ||
          [];
        setReminders(fetchedReminders);

        // Fetch lead activities
        setActivitiesLoading(true);
        const activitiesResponse = await getLeadActivitiesByLeadId(leadId);
        console.log("Lead activity", activitiesResponse);

        const fetchedActivities = Array.isArray(activitiesResponse)
          ? activitiesResponse
          : activitiesResponse.data || activitiesResponse.activities || [];

        setActivities(fetchedActivities);
      } catch (err) {
        console.error("Error fetching lead details:", err);
        setError(err.message || "Failed to fetch lead details");
        setActivitiesError(err.message || "Failed to fetch activities");
        toast.error(err.message || "Failed to load lead details");
      } finally {
        setLoading(false);
        setNotesLoading(false);
        setReminderLoading(false);
        setActivitiesLoading(false);
      }
    };

    fetchLeadDetails();
  }, [leadId, targetUserId, campaignName, currentUser]);

  const handleAddNote = async () => {
    if (!newNote.trim()) {
      toast.warn("Note cannot be empty");
      return;
    }

    try {
      setAddingNote(true);

      const noteData = {
        content: newNote,
        type: "comment",
        notebleId: leadId,
        notebleType: "lead",
        userId: currentUser.id,
      };

      console.log("Submitting Note:", noteData);

      const response = await addNote(noteData);
      const addedNote = response.note || response.data || response;

      if (addedNote) {
        // Update notes state
        setNotes((prev) => [...prev, addedNote]);

        // Optimistically add activity
        const newActivity = {
          id: `temp-${Date.now()}`, // Temporary ID until server confirms
          action: "note_added",
          details: newNote,
          leadId: leadId,
          performedBy: currentUser.id,
          performedByUser: {
            firstname: currentUser.firstname,
            lastname: currentUser.lastname,
            email: currentUser.email,
          },
          createdAt: new Date().toISOString(),
          Lead: { campaignName: lead.campaignName },
        };

        setActivities((prev) => [...prev, newActivity]);

        // Clear input
        setNewNote("");
        toast.success("Note added successfully");

        // Optionally refetch activities to sync with server
        try {
          setActivitiesLoading(true);
          const activitiesResponse = await getLeadActivitiesByLeadId(leadId);
          console.log("Lead Activity", activitiesResponse);
          const fetchedActivities =
            activitiesResponse.data || activitiesResponse.activities || [];
          setActivities(fetchedActivities);
        } catch (err) {
          console.error("Error refetching activities:", err);
          setActivitiesError(err.message || "Failed to fetch activities");
        } finally {
          setActivitiesLoading(false);
        }
      }
    } catch (error) {
      toast.error("Failed to add note");
      console.error("Error adding note:", error);
    } finally {
      setAddingNote(false);
    }
  };

  const handleAddReminder = async ({ content, reminderType, reminderDate }) => {
    try {
      const parsedReminderDate = new Date(reminderDate);

      if (isNaN(parsedReminderDate)) {
        throw new Error("Invalid reminder date");
      }

      const response = await addReminder({
        content,
        reminderType,
        reminderDate: parsedReminderDate,
        notebleId: leadId,
        notebleType: "lead",
      });

      const newReminder = response.reminder || response.data || response;
      if (newReminder) {
        // Update reminders state
        setReminders((prev) => [...prev, newReminder]);

        // Optimistically add activity
        const newActivity = {
          id: `temp-${Date.now()}`, // Temporary ID
          action: "reminder_added",
          details: content,
          leadId: leadId,
          performedBy: currentUser.id,
          performedByUser: {
            firstname: currentUser.firstname,
            lastname: currentUser.lastname,
            email: currentUser.email,
          },
          createdAt: new Date().toISOString(),
          Lead: { campaignName: lead.campaignName },
        };

        setActivities((prev) => [...prev, newActivity]);

        toast.success("Reminder added successfully");

        // Optionally refetch activities to sync with server
        try {
          setActivitiesLoading(true);
          const activitiesResponse = await getLeadActivitiesByLeadId(leadId);
          console.log("Lead activity", activitiesResponse);
          const fetchedActivities =
            activitiesResponse.data || activitiesResponse.activities || [];
          setActivities(fetchedActivities);
        } catch (err) {
          console.error("Error refetching activities:", err);
          setActivitiesError(err.message || "Failed to fetch activities");
        } finally {
          setActivitiesLoading(false);
        }
      }
    } catch (error) {
      toast.error("Failed to add reminder");
      console.error("Error adding reminder:", error);
    }
  };
  const handleStatusChange = async (e) => {
    const newStatus = validateStatus(e.target.value);
    const previousStatus = currentStatus;
    setCurrentStatus(newStatus);
    setIsUpdating(true);

    try {
      const result = await updateLeadStatus(
        leadId,
        targetUserId,
        newStatus,
        true
      );

      if (!result.success) {
        throw new Error(result.message || "Status update failed");
      }

      setLead((prev) => ({
        ...prev,
        status: newStatus,
        status_updated: true,
        assignees: prev.assignees.map((a) =>
          a.userId === targetUserId
            ? { ...a, status: newStatus, status_updated: true }
            : a
        ),
      }));

      setIsDisabled(true);
      toast.success("Lead status updated successfully");
    } catch (error) {
      console.error("Status update failed:", error);
      setCurrentStatus(previousStatus);
      toast.error(`Status update failed: ${error.message}`);
    } finally {
      setIsUpdating(false);
      setIsEditing(false);
    }
  };

  const handleDeleteActivity = (activityId) => {
    confirmDelete(
      async () => {
        setDeletingActivityId(activityId);
        const token = localStorage.getItem("token");
        await deleteLeadActivityById(activityId, token);
        setActivities((prev) =>
          prev.filter((activity) => activity.id !== activityId)
        );
      },
      () => setDeletingActivityId(null),
      "activity"
    );
  };

  const handleDeleteNote = (noteId) => {
    confirmDelete(
      async () => {
        setDeletingNoteId(noteId);
        const token = localStorage.getItem("token");
        await deleteNote(noteId, token);
        setNotes((prev) => prev.filter((note) => note.id !== noteId));
      },
      () => setDeletingNoteId(null),
      "note"
    );
  };

  const handleDeleteReminder = (reminderId) => {
    confirmDelete(
      async () => {
        setDeletingReminderId(reminderId);
        const token = localStorage.getItem("token");
        await deleteReminder(reminderId, token);
        setReminders((prev) =>
          prev.filter((reminder) => reminder.id !== reminderId)
        );
      },
      () => setDeletingReminderId(null),
      "reminder"
    );
  };

  const breadcrumbItems = [
    { title: "Dashboard", link: "/" },
    ...(isAdmin
      ? [
          { title: "Users", link: "/allUsers" },
          { title: "User Details", link: `/user-details/${targetUserId}` },
        ]
      : []),
    {
      title: "Leads",
      link: `/assigned-leads${
        campaignName ? `?campaign=${encodeURIComponent(campaignName)}` : ""
      }${isAdmin && targetUserId ? `&userId=${targetUserId}` : ""}`,
    },
    { title: `Lead #${leadId}`, link: "#" },
  ];

  const formatDate = (date) => (date ? new Date(date).toLocaleString() : "N/A");
  if (loading) {
    return (
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title={`Lead #${leadId}`}
            breadcrumbItems={breadcrumbItems}
          />
          <Card>
            <CardBody
              className="d-flex justify-content-center align-items-center"
              style={{ minHeight: "300px" }}
            >
              <Spinner color="primary" />
            </CardBody>
          </Card>
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title={`Lead #${leadId}`}
            breadcrumbItems={breadcrumbItems}
          />
          <Card>
            <CardBody>
              <Alert color="danger">{error}</Alert>
              <Button color="primary" onClick={() => navigate(-1)}>
                Go Back
              </Button>
            </CardBody>
          </Card>
        </Container>
      </div>
    );
  }

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs
          title={`Lead #${leadId}`}
          breadcrumbItems={breadcrumbItems}
        />
        <Card>
          <CardBody className="p-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="mb-0">
                Lead #{leadId}{" "}
                {/* <div className="d-flex align-items-center ms-2">
                  {isUpdating ? (
                    <Spinner size="sm" />
                  ) : isEditing || !isDisabled ? (
                    <select
                      value={currentStatus}
                      onChange={handleStatusChange}
                      className={`form-select form-select-sm bg-${getStatusBadgeColor(
                        currentStatus
                      )}`}
                      style={{
                        color: "white",
                        textTransform: "capitalize",
                        border: "none",
                        cursor: "pointer",
                        width: "140px",
                      }}
                      autoFocus
                    >
                      {[
                        "pending",
                        "to_call",
                        "most_interested",
                        "sold",
                        "not_interested",
                      ].map((status) => (
                        <option
                          key={status}
                          value={status}
                          className={`bg-${getStatusBadgeColor(status)}`}
                        >
                          {status.replace(/_/g, " ")}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <Badge
                      color={getStatusBadgeColor(currentStatus)}
                      style={{
                        textTransform: "capitalize",
                        cursor: "pointer",
                        padding: "5px 10px",
                      }}
                      onClick={() => setIsEditing(true)}
                    >
                      {currentStatus.replace(/_/g, " ")}
                    </Badge>
                  )}
                  {isDisabled && !isEditing && (
                    <i
                      className="mdi mdi-pencil-outline ms-2"
                      style={{ cursor: "pointer", fontSize: "16px" }}
                      onClick={() => setIsEditing(true)}
                    />
                  )}
                </div> */}
              </h6>
              <Button color="light" size="sm" onClick={() => navigate(-1)}>
                ← Back
              </Button>
            </div>
            <Row>
              <Col md={6}>
                <h6 className="mb-2">Lead Info</h6>
                <Table bordered size="sm" className="mb-3">
                  <tbody>
                    <tr>
                      <th scope="row">First</th>
                      <td>{lead.leadData?.first_name || "N/A"}</td>
                    </tr>
                    <tr>
                      <th>Last</th>
                      <td>{lead.leadData?.last_name || "N/A"}</td>
                    </tr>
                    <tr>
                      <th>Phone</th>
                      <td>{lead.leadData?.phone_number || "N/A"}</td>
                    </tr>
                    <tr>
                      <th>State</th>
                      <td>{lead.leadData?.state || "N/A"}</td>
                    </tr>
                  </tbody>
                </Table>
              </Col>
              <Col md={6}>
                <h6 className="mb-2">Status Info</h6>
                <Table bordered size="sm" className="mb-3">
                  <tbody>
                    <tr>
                      <th>Status</th>
                      <td>
                        <Badge
                          color={getStatusBadgeColor(currentStatus)}
                          className="text-capitalize"
                        >
                          {currentStatus.replace(/_/g, " ") || "Pending"}
                        </Badge>
                      </td>
                    </tr>
                    <tr>
                      <th>Campaign</th>
                      <td>{lead.campaignName || "N/A"}</td>
                    </tr>
                    <tr>
                      <th>Assigned To</th>
                      <td>
                        {lead.assignees?.find((a) => a.userId === targetUserId)
                          ?.firstname || "N/A"}{" "}
                        {lead.assignees?.find((a) => a.userId === targetUserId)
                          ?.lastname || ""}
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </Col>
            </Row>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h6 className="mt-3 mb-2">Notes</h6>
              <Button
                color="primary"
                size="sm"
                onClick={() => setNoteModalOpen(true)}
              >
                Add Note
              </Button>
            </div>

            {notesLoading ? (
              <div className="text-center py-2">
                <Spinner size="sm" color="primary" /> Loading...
              </div>
            ) : notes.length > 0 ? (
              <div style={{ maxHeight: "180px", overflowY: "auto" }}>
                {notes
                  .filter((note) => note.type === "comment")
                  .map((note, index) => (
                    <Card
                      key={note.id || index}
                      className="mb-2 border-0 bg-light"
                    >
                      <CardBody className="p-2">
                        <div className="d-flex justify-content-between align-items-start">
                          <div style={{ flex: "1 1 auto" }}>
                            <small>{note.content}</small>
                            <div className="text-muted small mt-1">
                              By {note.creator?.firstname || "N/A"}{" "}
                              {note.creator?.lastname || ""}
                            </div>
                          </div>
                          <div
                            className="d-flex align-items-center"
                            style={{ gap: "10px" }}
                          >
                            <small
                              className="text-muted"
                              style={{ whiteSpace: "nowrap" }}
                            >
                              {note.createdAt
                                ? new Date(note.createdAt).toLocaleString()
                                : "Unknown"}
                            </small>
                            {hasAnyPermission(currentUser, ["note:delete"]) && (
                              <Button
                                color="danger"
                                size="sm"
                                onClick={() => handleDeleteNote(note.id)}
                                disabled={deletingNoteId === note.id}
                                title="Delete note"
                                style={{ padding: "2px 6px" }}
                              >
                                {deletingNoteId === note.id ? (
                                  <Spinner size="sm" />
                                ) : (
                                  <FaTrash />
                                )}
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  ))}
              </div>
            ) : (
              <Alert color="info" className="py-2 px-3 small">
                No notes found.
              </Alert>
            )}

            <div
              className="mt-2"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h6 className="mt-4 mb-2">Reminders</h6>
              <Button
                color="primary"
                size="sm"
                onClick={() => setReminderModalOpen(true)}
              >
                Add Reminder
              </Button>
            </div>

            {reminderLoading ? (
              <div className="text-center py-2">
                <Spinner size="sm" color="info" /> Loading reminders...
              </div>
            ) : reminderError ? (
              <Alert color="danger" className="py-2 px-3 small">
                {reminderError}
              </Alert>
            ) : reminders.length > 0 ? (
              <div style={{ maxHeight: "180px", overflowY: "auto" }}>
                {reminders.map((reminder, index) => (
                  <Card key={index} className="mb-2 border-0 bg-warning-subtle">
                    <CardBody className="p-2">
                      <div className="d-flex justify-content-between align-items-center">
                        {/* Left side */}
                        <div>
                          <small>{reminder.content}</small>
                        </div>

                        {/* Right side */}
                        <div className="d-flex align-items-center gap-1">
                          <Badge color="info" pill className="me-1">
                            {reminder.reminderType || "General"}
                          </Badge>
                          {hasAnyPermission(currentUser, [
                            "reminder:delete",
                          ]) && (
                            <Button
                              color="danger"
                              size="sm"
                              onClick={() => handleDeleteReminder(reminder.id)}
                              disabled={deletingReminderId === reminder.id}
                              title="Delete reminder"
                              style={{
                                padding: "0 4px",
                                lineHeight: "1",
                                height: "18px",
                                fontSize: "0.7rem",
                              }}
                            >
                              {deletingReminderId === reminder.id ? (
                                <Spinner size="sm" />
                              ) : (
                                <FaTrash style={{ fontSize: "0.65rem" }} />
                              )}
                            </Button>
                          )}
                        </div>
                      </div>

                      <div className="text-muted small mt-1">
                        Due: {formatDate(reminder.reminderDate)} | Created by{" "}
                        {reminder.creator?.firstname || "System"}{" "}
                        {reminder.creator?.lastname || ""}
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            ) : (
              <Alert color="info" className="py-2 px-3 small">
                No reminders found.
              </Alert>
            )}

            <Modal
              isOpen={noteModalOpen}
              toggle={() => setNoteModalOpen(!noteModalOpen)}
            >
              <ModalHeader toggle={() => setNoteModalOpen(false)}>
                Add Note
              </ModalHeader>
              <ModalBody>
                <Form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleAddNote();
                    setNoteModalOpen(false);
                  }}
                >
                  <FormGroup>
                    <Label for="newNote">Note</Label>
                    <Input
                      type="textarea"
                      id="newNote"
                      rows={3}
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      placeholder="Type a short note..."
                    />
                  </FormGroup>
                  <ModalFooter>
                    <Button color="primary" type="submit" disabled={addingNote}>
                      {addingNote ? "Adding..." : "Add Note"}
                    </Button>
                    <Button
                      color="secondary"
                      onClick={() => setNoteModalOpen(false)}
                    >
                      Cancel
                    </Button>
                  </ModalFooter>
                </Form>
              </ModalBody>
            </Modal>

            <Modal
              isOpen={reminderModalOpen}
              toggle={() => setReminderModalOpen(!reminderModalOpen)}
            >
              <ModalHeader toggle={() => setReminderModalOpen(false)}>
                Add Reminder
              </ModalHeader>
              <ModalBody>
                <Form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!reminderContent || !reminderType || !reminderDate) {
                      toast.warn("All fields are required for reminder");
                      return;
                    }

                    handleAddReminder({
                      content: reminderContent,
                      reminderType,
                      reminderDate,
                    });

                    // Reset and close modal
                    setReminderContent("");
                    setReminderType("");
                    setReminderDate("");
                    setReminderModalOpen(false);
                  }}
                >
                  <FormGroup>
                    <Label for="reminderContent">Content</Label>
                    <Input
                      type="textarea"
                      id="reminderContent"
                      value={reminderContent}
                      onChange={(e) => setReminderContent(e.target.value)}
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label for="reminderType">Reminder Type</Label>
                    <Input
                      type="text"
                      id="reminderType"
                      name="reminderType"
                      placeholder="Enter reminder type"
                      value={reminderType}
                      onChange={(e) => setReminderType(e.target.value)}
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label for="reminderDate">Date</Label>
                    <Input
                      type="datetime-local"
                      id="reminderDate"
                      value={reminderDate}
                      onChange={(e) => setReminderDate(e.target.value)}
                    />
                  </FormGroup>

                  <ModalFooter>
                    <Button color="primary" type="submit">
                      Add Reminder
                    </Button>
                    <Button
                      color="secondary"
                      onClick={() => setReminderModalOpen(false)}
                    >
                      Cancel
                    </Button>
                  </ModalFooter>
                </Form>
              </ModalBody>
            </Modal>

            {isAdmin && (
              <div className="mt-4">
                <h6 className="mb-3">📜 Lead Activities</h6>

                {activitiesLoading ? (
                  <div className="text-center py-3">
                    <Spinner size="sm" color="info" /> Loading activities...
                  </div>
                ) : activitiesError ? (
                  <Alert color="danger" className="py-2 px-3 small mb-0">
                    {activitiesError}
                  </Alert>
                ) : activities.length > 0 ? (
                  <div style={{ maxHeight: "350px", overflowY: "auto" }}>
                    <Table
                      bordered
                      hover
                      responsive
                      size="sm"
                      className="mb-0"
                      style={{ fontSize: "0.75rem" }}
                    >
                      <thead className="table-light">
                        <tr>
                          <th style={{ width: "8%" }}>Action</th>
                          <th
                            style={{
                              width: "25%",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            Details
                          </th>
                          <th style={{ width: "5%" }}>Lead ID</th>
                          <th style={{ width: "15%" }}>Performed By</th>
                          <th
                            style={{
                              width: "18%",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            Email
                          </th>
                          <th style={{ width: "15%" }}>Campaign</th>
                          <th style={{ width: "12%" }}>Created At</th>
                          <th style={{ width: "5%" }}>Delete</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activities.map((activity, index) => (
                          <tr
                            key={activity.id}
                            className={index % 2 === 0 ? "table-light" : ""}
                            style={{ fontSize: "0.75rem" }} // Smaller font for rows
                          >
                            <td>
                              <span
                                className={`badge ${
                                  activity.action.includes("note")
                                    ? "bg-warning text-dark"
                                    : activity.action.includes("reminder")
                                    ? "bg-info"
                                    : "bg-secondary"
                                }`}
                                style={{ textTransform: "capitalize" }}
                              >
                                {activity.action.replace(/_/g, " ")}
                              </span>
                            </td>
                            <td
                              title={activity.details}
                              style={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {activity.details || "N/A"}
                            </td>
                            <td>{activity.leadId || "N/A"}</td>
                            <td>
                              {(activity.performedByUser?.firstname || "User") +
                                " " +
                                (activity.performedByUser?.lastname || "")}{" "}
                              <small className="text-muted">
                                #{activity.performedBy}
                              </small>
                            </td>
                            <td
                              title={activity.performedByUser?.email}
                              style={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {activity.performedByUser?.email || "N/A"}
                            </td>
                            <td>{activity.Lead?.campaignName || "N/A"}</td>
                            <td>
                              {activity.createdAt
                                ? new Date(activity.createdAt).toLocaleString()
                                : "N/A"}
                            </td>
                            <td>
                              <Button
                                color="danger"
                                size="sm"
                                onClick={() =>
                                  handleDeleteActivity(activity.id)
                                }
                                disabled={deletingActivityId === activity.id}
                                title="Delete activity"
                              >
                                {deletingActivityId === activity.id ? (
                                  <Spinner size="sm" />
                                ) : (
                                  <FaTrash />
                                )}
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                ) : (
                  <Alert color="info" className="py-2 px-3 small mb-0">
                    No activities found for this lead.
                  </Alert>
                )}
              </div>
            )}
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default AssignedLeadDetailPage;
