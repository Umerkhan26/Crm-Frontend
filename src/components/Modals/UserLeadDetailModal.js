// import React from "react";
// import {
//   Modal,
//   ModalHeader,
//   ModalBody,
//   ModalFooter,
//   Button,
//   FormGroup,
//   Label,
//   Input,
//   Row,
//   Col,
// } from "reactstrap";

// const UserLeadDetailModal = ({ isOpen, toggle, leadData }) => {
//   // Format field names for display
//   const formatLabel = (key) =>
//     key
//       .split("_")
//       .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
//       .join(" ");

//   // Prepare lead fields, excluding certain keys if needed
//   const leadFields = leadData?.fullLeadData
//     ? Object.entries(leadData.fullLeadData).filter(
//         ([key]) => !["reason", "status"].includes(key)
//       )
//     : [];

//   // Styling for read-only inputs
//   const borderStyle = {
//     border: "1px solid #dee2e6",
//     padding: "0.25rem 0.5rem",
//     backgroundColor: "#f8f9fa",
//     fontSize: "0.8rem",
//   };

//   return (
//     <Modal
//       isOpen={isOpen}
//       toggle={toggle}
//       size="lg"
//       style={{ fontSize: "0.8rem" }}
//     >
//       <ModalHeader
//         toggle={toggle}
//         style={{
//           fontSize: "1rem",
//           padding: "8px 12px",
//         }}
//       >
//         Lead Details
//       </ModalHeader>
//       <ModalBody style={{ padding: "10px" }}>
//         {leadData ? (
//           <div style={{ border: "1px solid #dee2e6", borderRadius: "0.25rem" }}>
//             <Row className="m-0">
//               {[0, 1].map((colIndex) => (
//                 <Col
//                   key={colIndex}
//                   md={6}
//                   style={
//                     colIndex === 0 ? { borderRight: "1px solid #dee2e6" } : {}
//                   }
//                 >
//                   {leadFields
//                     .slice(
//                       colIndex === 0 ? 0 : Math.ceil(leadFields.length / 2),
//                       colIndex === 0
//                         ? Math.ceil(leadFields.length / 2)
//                         : leadFields.length
//                     )
//                     .map(([key, value]) => (
//                       <FormGroup
//                         key={key}
//                         className="p-1 border-bottom m-0"
//                         style={{ fontSize: "0.8rem" }}
//                       >
//                         <Label style={{ fontSize: "0.8rem" }}>
//                           {formatLabel(key)}
//                         </Label>
//                         <Input
//                           plaintext
//                           value={value || "N/A"}
//                           readOnly
//                           style={borderStyle}
//                         />
//                       </FormGroup>
//                     ))}
//                 </Col>
//               ))}
//             </Row>
//           </div>
//         ) : (
//           <p>No lead data available.</p>
//         )}
//       </ModalBody>
//       <ModalFooter style={{ padding: "6px 10px" }}>
//         <Button
//           color="secondary"
//           onClick={toggle}
//           style={{ fontSize: "0.8rem", padding: "4px 10px" }}
//         >
//           Close
//         </Button>
//       </ModalFooter>
//     </Modal>
//   );
// };

// export default UserLeadDetailModal;

import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  FormGroup,
  Label,
  Input,
  Row,
  Col,
  Badge,
  Spinner,
} from "reactstrap";
import { getNotes, addNote } from "../../services/noteService";
import { getEmailTemplates } from "../../services/emailTemplateService";
import { sendEmailToLead } from "../../services/emailService";
import { toast } from "react-toastify";

const UserLeadDetailModal = ({ isOpen, toggle, leadData }) => {
  const [activeTab, setActiveTab] = useState("details");
  const [notes, setNotes] = useState("");
  const [reminder, setReminder] = useState({
    title: "",
    description: "",
    datetime: new Date().toISOString().slice(0, 16),
  });
  const [allNotes, setAllNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [emailTemplates, setEmailTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [emailSending, setEmailSending] = useState(false);

  useEffect(() => {
    if (isOpen && leadData?.id) {
      fetchNotes();
      fetchEmailTemplates();
    }
  }, [isOpen, leadData]);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getNotes(leadData.id, "lead");
      setAllNotes(response.notes || []);
    } catch (err) {
      setError(err.message || "Failed to fetch notes");
    } finally {
      setLoading(false);
    }
  };

  const fetchEmailTemplates = async () => {
    try {
      const templates = await getEmailTemplates();
      setEmailTemplates(templates);
    } catch (err) {
      setError(err.message || "Failed to fetch email templates");
    }
  };

  const handleSubmitNote = async () => {
    try {
      setLoading(true);
      const noteData = {
        content: activeTab === "notes" ? notes : reminder.description,
        type: activeTab === "notes" ? "comment" : "reminder",
        notebleId: leadData.id,
        notebleType: "lead",
      };

      if (activeTab === "reminder") {
        noteData.title = reminder.title;
        noteData.datetime = reminder.datetime;
      }

      await addNote(noteData);
      if (activeTab === "notes") setNotes("");
      else {
        setReminder({
          title: "",
          description: "",
          datetime: new Date().toISOString().slice(0, 16),
        });
      }

      await fetchNotes();
    } catch (err) {
      setError(err.message || "Failed to submit note");
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmail = async () => {
    if (!selectedTemplate) {
      setError("Please select an email template");
      return;
    }
    if (!leadData?.fullLeadData?.email) {
      toast.error("Lead does not have an email address");
      return;
    }

    try {
      setEmailSending(true);
      const response = await sendEmailToLead(leadData.id, selectedTemplate);
      toast.success(response.message || "Email sent successfully");
      setSelectedTemplate("");
    } catch (err) {
      toast.error(err.message || "Failed to send email");
    } finally {
      setEmailSending(false);
    }
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleString();
  const formatLabel = (key) =>
    key
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  const leadFields = leadData?.fullLeadData
    ? Object.entries(leadData.fullLeadData).filter(
        ([key]) => !["reason", "status"].includes(key)
      )
    : [];

  const borderStyle = {
    border: "1px solid #dee2e6",
    padding: "0.25rem 0.5rem",
    backgroundColor: "#f8f9fa",
    fontSize: "0.8rem",
  };

  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      size="lg"
      style={{ fontSize: "0.8rem" }}
    >
      <ModalHeader
        toggle={toggle}
        style={{ fontSize: "1rem", padding: "8px 12px" }}
      >
        Lead Details
      </ModalHeader>
      <ModalBody style={{ padding: "10px" }}>
        <Nav tabs className="mb-3">
          {["details", "notes", "reminder"]
            .concat(leadData?.fullLeadData?.email ? ["email"] : [])
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
                    padding: "6px 8px",
                  }}
                >
                  {tab === "details"
                    ? "Lead Details"
                    : tab.charAt(0).toUpperCase() + tab.slice(1)}
                </NavLink>
              </NavItem>
            ))}
        </Nav>

        {error && (
          <div className="alert alert-danger" style={{ fontSize: "0.8rem" }}>
            {error}
          </div>
        )}

        <TabContent activeTab={activeTab} className="p-2 border border-top-0">
          <TabPane tabId="details">
            <div
              style={{ border: "1px solid #dee2e6", borderRadius: "0.25rem" }}
            >
              <Row className="m-0">
                {[0, 1].map((colIndex) => (
                  <Col
                    key={colIndex}
                    md={6}
                    style={
                      colIndex === 0 ? { borderRight: "1px solid #dee2e6" } : {}
                    }
                  >
                    {leadFields
                      .slice(
                        colIndex === 0 ? 0 : Math.ceil(leadFields.length / 2),
                        colIndex === 0
                          ? Math.ceil(leadFields.length / 2)
                          : leadFields.length
                      )
                      .map(([key, value]) => (
                        <FormGroup key={key} className="p-1 border-bottom m-0">
                          <Label>{formatLabel(key)}</Label>
                          <Input
                            plaintext
                            value={value || "N/A"}
                            readOnly
                            style={borderStyle}
                          />
                        </FormGroup>
                      ))}
                  </Col>
                ))}
              </Row>
            </div>
          </TabPane>

          <TabPane tabId="notes">
            <FormGroup>
              <Input
                type="textarea"
                placeholder="Enter your notes here..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                style={{ height: "100px", fontSize: "0.8rem", padding: "6px" }}
              />
              <div className="text-end mt-1" style={{ fontSize: "0.7rem" }}>
                {250 - notes.length} characters remaining
              </div>
            </FormGroup>
            <Button
              color="primary"
              onClick={handleSubmitNote}
              disabled={loading || !notes.trim()}
              style={{ fontSize: "0.8rem" }}
            >
              {loading ? <Spinner size="sm" /> : "Post Note"}
            </Button>

            <div className="mt-3">
              <h6>Previous Notes</h6>
              {loading && allNotes.length === 0 ? (
                <Spinner />
              ) : (
                allNotes
                  .filter((note) => note.type === "comment")
                  .map((note) => (
                    <div key={note.id} className="mb-2 p-2 border rounded">
                      <div className="d-flex justify-content-between">
                        <strong>{note.creator?.firstname || "System"}</strong>
                        <small>{formatDate(note.createdAt)}</small>
                      </div>
                      <p className="mt-1 mb-0">{note.content}</p>
                    </div>
                  ))
              )}
            </div>
          </TabPane>

          <TabPane tabId="reminder">
            <FormGroup>
              <Label>Title *</Label>
              <Input
                type="text"
                value={reminder.title}
                onChange={(e) =>
                  setReminder({ ...reminder, title: e.target.value })
                }
              />
            </FormGroup>
            <FormGroup>
              <Label>Description</Label>
              <Input
                type="textarea"
                value={reminder.description}
                onChange={(e) =>
                  setReminder({ ...reminder, description: e.target.value })
                }
              />
            </FormGroup>
            <FormGroup>
              <Label>Date / Time</Label>
              <Input
                type="datetime-local"
                value={reminder.datetime}
                onChange={(e) =>
                  setReminder({ ...reminder, datetime: e.target.value })
                }
              />
            </FormGroup>
            <Button
              color="primary"
              onClick={handleSubmitNote}
              disabled={
                loading ||
                !reminder.title.trim() ||
                !reminder.description.trim()
              }
            >
              {loading ? <Spinner size="sm" /> : "Set Reminder"}
            </Button>

            <div className="mt-3">
              <h6>Upcoming Reminders</h6>
              {loading && allNotes.length === 0 ? (
                <Spinner />
              ) : (
                allNotes
                  .filter((note) => note.type === "reminder")
                  .map((note) => (
                    <div key={note.id} className="mb-2 p-2 border rounded">
                      <div className="d-flex justify-content-between">
                        <strong>{note.title}</strong>
                        <Badge color="info">
                          {note.datetime
                            ? formatDate(note.datetime)
                            : "No date"}
                        </Badge>
                      </div>
                      <p className="mt-1 mb-0">{note.content}</p>
                      <small className="text-muted">
                        Created by {note.creator?.firstname || "System"} on{" "}
                        {formatDate(note.createdAt)}
                      </small>
                    </div>
                  ))
              )}
            </div>
          </TabPane>

          <TabPane tabId="email">
            <h6>Email Templates</h6>
            {loading && emailTemplates.length === 0 ? (
              <Spinner />
            ) : (
              <FormGroup>
                <Label>Select Template</Label>
                <Input
                  type="select"
                  value={selectedTemplate}
                  onChange={(e) => setSelectedTemplate(e.target.value)}
                >
                  <option value="">-- Select Template --</option>
                  {emailTemplates.map((template) => (
                    <option key={template.id} value={template.serviceName}>
                      {template.name}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            )}
            <Button
              color="primary"
              onClick={handleSendEmail}
              disabled={emailSending || !selectedTemplate}
            >
              {emailSending ? <Spinner size="sm" /> : "Send Email"}
            </Button>
          </TabPane>
        </TabContent>
      </ModalBody>
      <ModalFooter style={{ padding: "6px 10px" }}>
        <Button color="secondary" onClick={toggle}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default UserLeadDetailModal;
