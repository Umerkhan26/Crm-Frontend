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
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from "reactstrap";
import Breadcrumbs from "../Common/Breadcrumb";
import { toast } from "react-toastify";
import { getNotes, addNote, deleteNote } from "../../services/noteService";
import { addReminder, deleteReminder } from "../../services/noteService"; // Added reminder functions
import { sendEmailToClientLead } from "../../services/emailService";
import {
  getAllClientLeads,
  getClientLeadActivitiesByLeadId,
} from "../../services/ClientleadService";
import { deleteLeadActivityById } from "../../services/leadService";
import { FaTrash } from "react-icons/fa";
import useDeleteConfirmation from "./DeleteConfirmation";
import { useSelector } from "react-redux";
import { hasAnyPermission } from "../../utils/permissions";
import {
  EditorState,
  ContentState,
  convertFromHTML,
  convertToRaw,
} from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import {
  getEmailTemplates,
  updateEmailTemplate,
} from "../../services/emailTemplateService";

const ClientLeadDetailPage = () => {
  const { leadId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const orderId = queryParams.get("orderId");
  const { confirmDelete } = useDeleteConfirmation();
  const currentUser = useSelector((state) => state.Login?.user);
  const isAdmin = hasAnyPermission(currentUser, ["user:get"]);
  const [lead, setLead] = useState(null);
  const [activeTab, setActiveTab] = useState("details");
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [reminder, setReminder] = useState({
    title: "",
    description: "",
    datetime: new Date().toISOString().slice(0, 16),
  });
  const [allNotes, setAllNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notesLoading, setNotesLoading] = useState(false);
  const [addingNote, setAddingNote] = useState(false);
  const [error, setError] = useState(null);
  const [emailTemplates, setEmailTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [emailSending, setEmailSending] = useState(false);
  const [templateSaving, setTemplateSaving] = useState(false);
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [reminderModalOpen, setReminderModalOpen] = useState(false);
  const [deletingNoteId, setDeletingNoteId] = useState(null);
  const [activities, setActivities] = useState([]);
  const [activitiesLoading, setActivitiesLoading] = useState(false);
  const [activitiesError, setActivitiesError] = useState(null);
  const [deletingActivityId, setDeletingActivityId] = useState(null);
  const [reminders, setReminders] = useState([]);
  const [deletingReminderId, setDeletingReminderId] = useState(null);

  useEffect(() => {
    const fetchLeadDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!leadId) {
          throw new Error("Lead ID is missing");
        }

        const response = await getAllClientLeads(1, 10, orderId);
        const leads = Array.isArray(response.data) ? response.data : [];
        const leadData = leads.find((lead) => lead.id === parseInt(leadId));

        if (!leadData) {
          throw new Error("Lead not found");
        }

        leadData.leadData =
          typeof leadData.leadData === "string"
            ? JSON.parse(leadData.leadData)
            : leadData.leadData || {};
        setLead(leadData);

        // Fetch notes
        setNotesLoading(true);
        const notesResponse = await getNotes(leadId, "client_lead");
        setAllNotes(notesResponse.notes || []);
        setNotes(
          notesResponse.notes?.filter((note) => note.type === "comment") || []
        );
        setReminders(
          notesResponse.notes?.filter((note) => note.type === "reminder") || []
        );

        const templates = await getEmailTemplates();
        setEmailTemplates(templates);

        if (isAdmin) {
          setActivitiesLoading(true);
          try {
            const activities = await getClientLeadActivitiesByLeadId(leadId);
            setActivities(Array.isArray(activities) ? activities : []);
          } catch (err) {
            setActivitiesError(err.message || "Failed to fetch activities");
            console.error("Activities fetch error:", err);
          } finally {
            setActivitiesLoading(false);
          }
        }
      } catch (err) {
        setError(err.message || "Failed to fetch lead details");
        toast.error(err.message || "Failed to load lead details");
      } finally {
        setLoading(false);
        setNotesLoading(false);
      }
    };

    fetchLeadDetails();
  }, [leadId, orderId, isAdmin]);

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
        notebleId: parseInt(leadId),
        notebleType: "client_lead",
      };

      const response = await addNote(noteData);

      const addedNote = response.note || response.data || response;

      if (addedNote) {
        setAllNotes((prev) => [...prev, addedNote]);
        setNotes((prev) => [...prev, addedNote]);
        setNewNote("");
        toast.success("Note added successfully");

        if (isAdmin) {
          const newActivity = {
            id: `temp-${Date.now()}`,
            action: "note_added",
            details: newNote,
            clientLeadId: parseInt(leadId),
            performedBy: currentUser.id,
            performedByUser: {
              firstname: currentUser.firstname,
              lastname: currentUser.lastname,
              email: currentUser.email,
            },
            createdAt: new Date().toISOString(),
            ClientLead: { orderId: lead.orderId || "N/A" },
          };
          setActivities((prev) => [...prev, newActivity]);

          try {
            setActivitiesLoading(true);
            const activities = await getClientLeadActivitiesByLeadId(leadId);
            setActivities(Array.isArray(activities) ? activities : []);
          } catch (err) {
            setActivitiesError(err.message || "Failed to fetch activities");
          } finally {
            setActivitiesLoading(false);
          }
        }
      }
    } catch (error) {
      toast.error("Failed to add note");
      console.error("Error adding note:", error);
    } finally {
      setAddingNote(false);
      setNoteModalOpen(false);
    }
  };

  const handleAddReminder = async () => {
    if (!reminder.title.trim() || !reminder.description.trim()) {
      toast.warn("All fields are required for reminder");
      return;
    }

    try {
      setAddingNote(true);

      // Use addReminder API instead of addNote
      const reminderData = {
        content: reminder.description,
        reminderType: reminder.title, // Using title as reminderType
        reminderDate: new Date(reminder.datetime),
        notebleId: parseInt(leadId),
        notebleType: "client_lead",
      };

      const response = await addReminder(reminderData);
      const addedReminder = response.reminder || response.data || response;

      if (addedReminder) {
        setAllNotes((prev) => [...prev, addedReminder]);
        setReminders((prev) => [...prev, addedReminder]);

        setReminder({
          title: "",
          description: "",
          datetime: new Date().toISOString().slice(0, 16),
        });
        toast.success("Reminder added successfully");

        if (isAdmin) {
          const newActivity = {
            id: `temp-${Date.now()}`,
            action: "reminder_added",
            details: reminder.description,
            clientLeadId: parseInt(leadId),
            performedBy: currentUser.id,
            performedByUser: {
              firstname: currentUser.firstname,
              lastname: currentUser.lastname,
              email: currentUser.email,
            },
            createdAt: new Date().toISOString(),
            ClientLead: { orderId: lead.orderId || "N/A" },
          };
          setActivities((prev) => [...prev, newActivity]);

          try {
            setActivitiesLoading(true);
            const activitiesData = await getClientLeadActivitiesByLeadId(
              leadId
            );
            setActivities(Array.isArray(activitiesData) ? activitiesData : []);
          } catch (err) {
            setActivitiesError(err.message || "Failed to fetch activities");
            console.error("Activities fetch error:", err);
          } finally {
            setActivitiesLoading(false);
          }
        }
      }
    } catch (error) {
      toast.error("Failed to add reminder");
      console.error("Error adding reminder:", error);
    } finally {
      setAddingNote(false);
      setReminderModalOpen(false);
    }
  };

  const handleDeleteActivity = (activityId) => {
    confirmDelete(
      async () => {
        setDeletingActivityId(activityId);
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Authentication token missing");
        }
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
        if (!token) {
          throw new Error("Authentication token missing");
        }
        await deleteNote(noteId, token);
        setAllNotes((prev) => prev.filter((note) => note.id !== noteId));
        setNotes((prev) => prev.filter((note) => note.id !== noteId));

        if (isAdmin) {
          const newActivity = {
            id: `temp-${Date.now()}`,
            action: "note_deleted",
            details: `Note ID ${noteId} deleted`,
            clientLeadId: parseInt(leadId),
            performedBy: currentUser.id,
            performedByUser: {
              firstname: currentUser.firstname,
              lastname: currentUser.lastname,
              email: currentUser.email,
            },
            createdAt: new Date().toISOString(),
            ClientLead: { orderId: lead.orderId || "N/A" },
          };
          setActivities((prev) => [...prev, newActivity]);

          try {
            setActivitiesLoading(true);
            const activitiesData = await getClientLeadActivitiesByLeadId(
              leadId
            );
            setActivities(Array.isArray(activitiesData) ? activitiesData : []);
          } catch (err) {
            setActivitiesError(err.message || "Failed to fetch activities");
            console.error("Activities fetch error:", err);
          } finally {
            setActivitiesLoading(false);
          }
        }
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
        if (!token) {
          throw new Error("Authentication token missing");
        }
        await deleteReminder(reminderId, token);
        setAllNotes((prev) => prev.filter((note) => note.id !== reminderId));
        setReminders((prev) =>
          prev.filter((reminder) => reminder.id !== reminderId)
        );

        if (isAdmin) {
          const newActivity = {
            id: `temp-${Date.now()}`,
            action: "reminder_deleted",
            details: `Reminder ID ${reminderId} deleted`,
            clientLeadId: parseInt(leadId),
            performedBy: currentUser.id,
            performedByUser: {
              firstname: currentUser.firstname,
              lastname: currentUser.lastname,
              email: currentUser.email,
            },
            createdAt: new Date().toISOString(),
            ClientLead: { orderId: lead.orderId || "N/A" },
          };
          setActivities((prev) => [...prev, newActivity]);

          try {
            setActivitiesLoading(true);
            const activitiesData = await getClientLeadActivitiesByLeadId(
              leadId
            );

            setActivities(Array.isArray(activitiesData) ? activitiesData : []);
          } catch (err) {
            setActivitiesError(err.message || "Failed to fetch activities");
            console.error("Activities fetch error:", err);
          } finally {
            setActivitiesLoading(false);
          }
        }
      },
      () => setDeletingReminderId(null),
      "reminder"
    );
  };

  const handleTemplateChange = (e) => {
    const templateServiceName = e.target.value;
    setSelectedTemplate(templateServiceName);

    if (templateServiceName) {
      try {
        const template = emailTemplates.find(
          (t) => t.serviceName === templateServiceName
        );
        if (template && template.bodyTemplate) {
          const blocksFromHTML = convertFromHTML(template.bodyTemplate);
          const contentState = ContentState.createFromBlockArray(
            blocksFromHTML.contentBlocks,
            blocksFromHTML.entityMap
          );
          setEditorState(EditorState.createWithContent(contentState));
          setSelectedTemplateId(template.id);
        } else {
          setEditorState(EditorState.createEmpty());
          setSelectedTemplateId(null);
          setError(template ? "Template has no content" : "Template not found");
          toast.error(
            template ? "Template has no content" : "Template not found"
          );
        }
      } catch (err) {
        setError(err.message || "Failed to load template content");
        toast.error(err.message || "Failed to load template content");
        setEditorState(EditorState.createEmpty());
        setSelectedTemplateId(null);
      }
    } else {
      setEditorState(EditorState.createEmpty());
      setSelectedTemplateId(null);
    }
  };

  const handleSendEmail = async () => {
    if (!selectedTemplate) {
      setError("Please select an email template");
      toast.error("Please select an email template");
      return;
    }

    try {
      setEmailSending(true);
      setError(null);

      // Use the new API function
      const response = await sendEmailToClientLead(
        parseInt(leadId),
        selectedTemplate
      );

      toast.success(response.message || "Email sent successfully");
      setSelectedTemplate("");
      setEditorState(EditorState.createEmpty());
      setSelectedTemplateId(null);

      if (isAdmin) {
        const newActivity = {
          id: `temp-${Date.now()}`,
          action: "email_sent",
          details: `Email sent using template "${selectedTemplate}" to ${
            response.to || "client lead"
          }`,
          clientLeadId: parseInt(leadId),
          performedBy: currentUser.id,
          performedByUser: {
            firstname: currentUser.firstname,
            lastname: currentUser.lastname,
            email: currentUser.email,
          },
          createdAt: new Date().toISOString(),
          ClientLead: { orderId: lead.orderId || "N/A" },
        };
        setActivities((prev) => [...prev, newActivity]);

        try {
          setActivitiesLoading(true);
          const activitiesData = await getClientLeadActivitiesByLeadId(leadId);
          setActivities(Array.isArray(activitiesData) ? activitiesData : []);
        } catch (err) {
          setActivitiesError(err.message || "Failed to fetch activities");
          console.error("Activities fetch error:", err);
        } finally {
          setActivitiesLoading(false);
        }
      }
    } catch (err) {
      setError(err.message || "Failed to send email");
      toast.error(err.message || "Failed to send email");
    } finally {
      setEmailSending(false);
    }
  };

  const handleSaveTemplate = async () => {
    if (!selectedTemplate || !selectedTemplateId) {
      setError("Please select a template to save");
      toast.error("Please select a template to save");
      return;
    }

    try {
      setTemplateSaving(true);
      setError(null);
      const updatedContent = draftToHtml(
        convertToRaw(editorState.getCurrentContent())
      );
      const template = emailTemplates.find(
        (t) => t.serviceName === selectedTemplate
      );
      await updateEmailTemplate(selectedTemplateId, {
        name: template.name,
        subjectTemplate: template.subjectTemplate,
        bodyTemplate: updatedContent,
      });
      toast.success("Template updated successfully");
      const templates = await getEmailTemplates();
      setEmailTemplates(templates);
    } catch (err) {
      setError(err.message || "Failed to save template");
      toast.error(err.message || "Failed to save template");
    } finally {
      setTemplateSaving(false);
    }
  };

  const formatDate = (dateString) => {
    return dateString ? new Date(dateString).toLocaleString() : "N/A";
  };

  const breadcrumbItems = [
    { title: "Dashboard", link: "/" },
    { title: "Leads", link: "/lead-index" },
    { title: `Client Lead #${leadId}`, link: "#" },
  ];

  if (loading) {
    return (
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title={`Client Lead #${leadId}`}
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
            title={`Client Lead #${leadId}`}
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

  const formatLabel = (key) =>
    key
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  const leadFields = lead?.leadData
    ? Object.entries(lead.leadData).filter(
        ([key]) => !["reason", "status"].includes(key)
      )
    : [];

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs
          title={`Client Lead #${leadId}`}
          breadcrumbItems={breadcrumbItems}
        />
        <Card>
          <CardBody className="p-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="mb-0 small">Client Lead #{leadId}</h6>
              <Button color="light" size="sm" onClick={() => navigate(-1)}>
                ← Back
              </Button>
            </div>

            <Nav tabs className="mb-3">
              {["details", "notes", "reminder"]
                .concat(lead?.leadData?.email ? ["email"] : [])
                .concat(isAdmin ? ["activities"] : [])
                .map((tab) => (
                  <NavItem key={tab}>
                    <NavLink
                      className={`fw-bold text-dark ${
                        activeTab === tab
                          ? "active bg-light border rounded-top"
                          : ""
                      }`}
                      onClick={() => setActiveTab(tab)}
                      style={{
                        cursor: "pointer",
                        fontSize: "0.8rem",
                        padding: "6px 12px",
                      }}
                    >
                      {tab === "details"
                        ? "Lead Details"
                        : tab === "activities"
                        ? "Activities"
                        : tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </NavLink>
                  </NavItem>
                ))}
            </Nav>

            {error && (
              <Alert color="danger" className="py-2 px-3 small">
                {error}
              </Alert>
            )}

            <TabContent
              activeTab={activeTab}
              className="p-2 border border-top-0"
            >
              <TabPane tabId="details">
                <Row>
                  <Col md={6}>
                    <h6 className="mb-2 small">Lead Info</h6>
                    <Table bordered size="sm" className="mb-3">
                      <tbody>
                        {leadFields.map(([key, value]) => (
                          <tr key={key}>
                            <th
                              scope="row"
                              className="small"
                              style={{ width: "30%" }}
                            >
                              {formatLabel(key)}
                            </th>
                            <td className="small">{value || "N/A"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Col>
                  <Col md={6}>
                    <h6 className="mb-2 small">Status Info</h6>
                    <Table bordered size="sm" className="mb-3">
                      <tbody>
                        <tr>
                          <th className="small">Order ID</th>
                          <td className="small">{lead.orderId || "N/A"}</td>
                        </tr>
                        <tr>
                          <th className="small">Lead Created</th>
                          <td className="small">
                            {formatDate(lead.createdAt)}
                          </td>
                        </tr>
                        <tr>
                          <th className="small">Lead Updated</th>
                          <td className="small">
                            {formatDate(lead.updatedAt)}
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </Col>
                </Row>
              </TabPane>

              <TabPane tabId="notes">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h6 className="mb-0 small">Notes</h6>
                  <Button
                    color="primary"
                    size="sm"
                    onClick={() => setNoteModalOpen(true)}
                    style={{ fontSize: "0.8rem", padding: "4px 8px" }}
                  >
                    Add Note
                  </Button>
                </div>
                {notesLoading ? (
                  <div className="text-center py-2">
                    <Spinner size="sm" color="primary" /> Loading...
                  </div>
                ) : notes.length > 0 ? (
                  <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                    {notes.map((note) => (
                      <Card key={note.id} className="mb-2 border-0 bg-light">
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
                              style={{ gap: "8px" }}
                            >
                              <small
                                className="text-muted"
                                style={{ whiteSpace: "nowrap" }}
                              >
                                {formatDate(note.createdAt)}
                              </small>
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
              </TabPane>

              <TabPane tabId="reminder">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h6 className="mb-0 small">Reminders</h6>
                  <Button
                    color="primary"
                    size="sm"
                    onClick={() => setReminderModalOpen(true)}
                    style={{ fontSize: "0.8rem", padding: "4px 8px" }}
                  >
                    Add Reminder
                  </Button>
                </div>
                {notesLoading ? (
                  <div className="text-center py-2">
                    <Spinner size="sm" color="primary" /> Loading reminders...
                  </div>
                ) : reminders.length > 0 ? (
                  <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                    {reminders.map((reminderItem) => (
                      <Card
                        key={reminderItem.id}
                        className="mb-2 border-0 bg-warning-subtle"
                      >
                        <CardBody className="p-2">
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <small>{reminderItem.content}</small>
                            </div>
                            <div className="d-flex align-items-center gap-1">
                              <Badge color="info" pill className="me-1 small">
                                {reminderItem.reminderType ||
                                  reminderItem.title ||
                                  "General"}
                              </Badge>
                              <Button
                                color="danger"
                                size="sm"
                                onClick={() =>
                                  handleDeleteReminder(reminderItem.id)
                                }
                                disabled={
                                  deletingReminderId === reminderItem.id
                                }
                                title="Delete reminder"
                                style={{ padding: "2px 6px" }}
                              >
                                {deletingReminderId === reminderItem.id ? (
                                  <Spinner size="sm" />
                                ) : (
                                  <FaTrash />
                                )}
                              </Button>
                            </div>
                          </div>
                          <div className="text-muted small mt-1">
                            Due:{" "}
                            {formatDate(
                              reminderItem.reminderDate || reminderItem.datetime
                            )}{" "}
                            | Created by{" "}
                            {reminderItem.creator?.firstname || "System"}{" "}
                            {reminderItem.creator?.lastname || ""}
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
              </TabPane>

              <TabPane tabId="email">
                <h6 className="mb-2 small">Email Templates</h6>
                {notesLoading && emailTemplates.length === 0 ? (
                  <Spinner size="sm" color="primary" />
                ) : (
                  <>
                    <FormGroup>
                      <Label className="small">Select Template</Label>
                      <Input
                        type="select"
                        value={selectedTemplate}
                        onChange={handleTemplateChange}
                        className="form-select-sm"
                        style={{ fontSize: "0.8rem", padding: "4px 8px" }}
                      >
                        <option value="">-- Select Template --</option>
                        {emailTemplates.map((template) => (
                          <option
                            key={template.id}
                            value={template.serviceName}
                          >
                            {template.name}
                          </option>
                        ))}
                      </Input>
                    </FormGroup>
                    {selectedTemplate && (
                      <FormGroup>
                        <Label className="small">Edit Email Content</Label>
                        <div
                          style={{
                            border: "1px solid #dee2e6",
                            padding: "5px",
                            borderRadius: "2px",
                            minHeight: "200px",
                          }}
                        >
                          <Editor
                            editorState={editorState}
                            onEditorStateChange={setEditorState}
                            toolbar={{
                              options: [
                                "inline",
                                "blockType",
                                "fontSize",
                                "list",
                                "textAlign",
                                "link",
                                "emoji",
                                "remove",
                                "history",
                              ],
                              inline: {
                                inDropdown: true,
                                options: [
                                  "bold",
                                  "italic",
                                  "underline",
                                  "strikethrough",
                                ],
                              },
                              blockType: {
                                inDropdown: true,
                                options: [
                                  "Normal",
                                  "H1",
                                  "H2",
                                  "H3",
                                  "Blockquote",
                                ],
                              },
                              fontSize: {
                                options: [
                                  8, 9, 10, 11, 12, 14, 16, 18, 24, 30, 36, 48,
                                ],
                              },
                              list: {
                                inDropdown: true,
                                options: ["unordered", "ordered"],
                              },
                              textAlign: {
                                inDropdown: true,
                                options: ["left", "center", "right", "justify"],
                              },
                              link: {
                                inDropdown: true,
                                options: ["link", "unlink"],
                              },
                            }}
                            editorStyle={{
                              minHeight: "200px",
                              padding: "0 10px",
                            }}
                          />
                        </div>
                      </FormGroup>
                    )}
                    <Button
                      color="primary"
                      size="sm"
                      onClick={handleSendEmail}
                      disabled={
                        emailSending ||
                        !selectedTemplate ||
                        !leadId ||
                        !lead?.leadData?.email
                      }
                      style={{
                        fontSize: "0.8rem",
                        padding: "4px 10px",
                        marginRight: "10px",
                      }}
                    >
                      {emailSending ? <Spinner size="sm" /> : "Send Email"}
                    </Button>
                    {selectedTemplate && (
                      <Button
                        color="primary"
                        size="sm"
                        onClick={handleSaveTemplate}
                        disabled={templateSaving || !selectedTemplateId}
                        style={{ fontSize: "0.8rem", padding: "4px 10px" }}
                      >
                        {templateSaving ? (
                          <Spinner size="sm" />
                        ) : (
                          "Save Template"
                        )}
                      </Button>
                    )}
                  </>
                )}
              </TabPane>

              {isAdmin && (
                <TabPane tabId="activities">
                  <h6 className="mb-3 small">📜 Client Lead Activities</h6>
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
                            <th style={{ width: "5%" }}>Entity Id</th>
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
                            <th style={{ width: "15%" }}>Reference</th>
                            <th style={{ width: "12%" }}>Created At</th>
                            <th style={{ width: "5%" }}>Delete</th>
                          </tr>
                        </thead>
                        <tbody>
                          {activities.map((activity, index) => (
                            <tr
                              key={activity.id}
                              className={index % 2 === 0 ? "table-light" : ""}
                              style={{ fontSize: "0.75rem" }}
                            >
                              <td>
                                <span
                                  className={`badge ${
                                    activity.action.includes("note")
                                      ? "bg-warning text-dark"
                                      : activity.action.includes("reminder")
                                      ? "bg-info"
                                      : activity.action.includes("email")
                                      ? "bg-success"
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
                              <td>
                                {activity.clientLeadId ||
                                  activity.entityId ||
                                  "N/A"}
                              </td>
                              <td>
                                {(activity.performedByUser?.firstname ||
                                  "User") +
                                  " " +
                                  (activity.performedByUser?.lastname ||
                                    "")}{" "}
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
                              <td>
                                {activity.ClientLead?.orderId ||
                                  activity.Lead?.campaignName ||
                                  "N/A"}
                              </td>
                              <td>{formatDate(activity.createdAt)}</td>
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
                      No activities found for this client lead.
                    </Alert>
                  )}
                </TabPane>
              )}
            </TabContent>

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
                      className="form-control-sm"
                      style={{ fontSize: "0.8rem" }}
                    />
                  </FormGroup>
                  <ModalFooter>
                    <Button
                      color="primary"
                      type="submit"
                      size="sm"
                      disabled={addingNote}
                      style={{ fontSize: "0.8rem", padding: "4px 8px" }}
                    >
                      {addingNote ? <Spinner size="sm" /> : "Add Note"}
                    </Button>
                    <Button
                      color="secondary"
                      size="sm"
                      onClick={() => setNoteModalOpen(false)}
                      style={{ fontSize: "0.8rem", padding: "4px 8px" }}
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
                    handleAddReminder();
                  }}
                >
                  <FormGroup>
                    <Label for="reminderTitle">Title *</Label>
                    <Input
                      type="text"
                      id="reminderTitle"
                      placeholder="Enter title"
                      value={reminder.title}
                      onChange={(e) =>
                        setReminder({ ...reminder, title: e.target.value })
                      }
                      className="form-control-sm"
                      style={{ fontSize: "0.8rem" }}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="reminderDescription">Description</Label>
                    <Input
                      type="textarea"
                      id="reminderDescription"
                      placeholder="Description..."
                      value={reminder.description}
                      onChange={(e) =>
                        setReminder({
                          ...reminder,
                          description: e.target.value,
                        })
                      }
                      className="form-control-sm"
                      style={{ fontSize: "0.8rem" }}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="reminderDate" className="small">
                      Date / Time
                    </Label>
                    <Input
                      type="datetime-local"
                      id="reminderDate"
                      value={reminder.datetime}
                      onChange={(e) =>
                        setReminder({ ...reminder, datetime: e.target.value })
                      }
                      className="form-control-sm"
                      style={{ fontSize: "0.8rem" }}
                    />
                  </FormGroup>
                  <ModalFooter>
                    <Button
                      color="primary"
                      type="submit"
                      size="sm"
                      disabled={
                        addingNote ||
                        !reminder.title.trim() ||
                        !reminder.description.trim()
                      }
                      style={{ fontSize: "0.8rem", padding: "4px 8px" }}
                    >
                      {addingNote ? <Spinner size="sm" /> : "Add Reminder"}
                    </Button>
                    <Button
                      color="secondary"
                      size="sm"
                      onClick={() => setReminderModalOpen(false)}
                      style={{ fontSize: "0.8rem", padding: "4px 8px" }}
                    >
                      Cancel
                    </Button>
                  </ModalFooter>
                </Form>
              </ModalBody>
            </Modal>
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default ClientLeadDetailPage;
