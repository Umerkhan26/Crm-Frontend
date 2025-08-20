// import React, { useState, useEffect } from "react";
// import {
//   Modal,
//   ModalHeader,
//   ModalBody,
//   ModalFooter,
//   Button,
//   Nav,
//   NavItem,
//   NavLink,
//   TabContent,
//   TabPane,
//   FormGroup,
//   Label,
//   Input,
//   Row,
//   Col,
//   Badge,
//   Spinner,
// } from "reactstrap";
// import { getNotes, addNote } from "../../services/noteService";
// import { getEmailTemplates } from "../../services/emailTemplateService";
// import { sendEmailToLead } from "../../services/emailService";
// import { toast } from "react-toastify";

// const ClientLeadModal = ({ isOpen, toggle, leadData }) => {
//   const [activeTab, setActiveTab] = useState("details");
//   const [notes, setNotes] = useState("");
//   const [reminder, setReminder] = useState({
//     title: "",
//     description: "",
//     datetime: new Date().toISOString().slice(0, 16),
//   });
//   const [allNotes, setAllNotes] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [emailTemplates, setEmailTemplates] = useState([]);
//   const [selectedTemplate, setSelectedTemplate] = useState("");

//   useEffect(() => {
//     if (isOpen && leadData?.id) {
//       fetchNotes();
//       fetchEmailTemplates(); // Fetch email templates when modal opens
//     }
//   }, [isOpen, leadData]);

//   const handleSendEmail = async () => {
//     if (!selectedTemplate) {
//       toast.error("Please select an email template");
//       return;
//     }
//     try {
//       setLoading(true);
//       const response = await sendEmailToLead(leadData.id, selectedTemplate);
//       console.log("email sendddd", response);
//       toast.success(response.message || "Email sent successfully!");
//     } catch (err) {
//       toast.error(err.message || "Failed to send email");
//     } finally {
//       setLoading(false);
//     }
//   };
//   const fetchNotes = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const response = await getNotes(leadData.id, "client_lead");
//       setAllNotes(response.notes || []);
//     } catch (err) {
//       setError(err.message || "Failed to fetch notes");
//       console.error("Error fetching notes:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchEmailTemplates = async () => {
//     try {
//       setError(null);
//       const templates = await getEmailTemplates();
//       setEmailTemplates(templates);
//     } catch (err) {
//       setError(err.message || "Failed to fetch email templates");
//     }
//   };

//   const handleSubmitNote = async () => {
//     try {
//       setLoading(true);
//       const noteData = {
//         content: activeTab === "notes" ? notes : reminder.description,
//         type: activeTab === "notes" ? "comment" : "reminder",
//         notebleId: leadData.id,
//         notebleType: "client_lead",
//       };

//       if (activeTab === "reminder") {
//         noteData.title = reminder.title;
//         noteData.datetime = reminder.datetime;
//       }

//       await addNote(noteData);

//       if (activeTab === "notes") {
//         setNotes("");
//       } else {
//         setReminder({
//           title: "",
//           description: "",
//           datetime: new Date().toISOString().slice(0, 16),
//         });
//       }

//       await fetchNotes();
//     } catch (err) {
//       setError(err.message || "Failed to submit note");
//       console.error("Error submitting note:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleString();
//   };

//   const borderStyle = {
//     border: "1px solid #dee2e6",
//     padding: "0.25rem 0.5rem",
//     backgroundColor: "#f8f9fa",
//     fontSize: "0.8rem",
//   };

//   const formatLabel = (key) =>
//     key
//       .split("_")
//       .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
//       .join(" ");

//   const leadFields = leadData?.leadData
//     ? Object.entries(leadData.leadData).filter(
//         ([key]) => !["reason", "status"].includes(key)
//       )
//     : [];

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
//         Lead Detail
//       </ModalHeader>
//       <ModalBody style={{ padding: "10px" }}>
//         <Nav tabs className="mb-3">
//           {["details", "notes", "reminder", "email"].map((tab) => (
//             <NavItem key={tab}>
//               <NavLink
//                 className={`fw-bold text-dark ${
//                   activeTab === tab ? "active bg-light border rounded-top" : ""
//                 }`}
//                 onClick={() => setActiveTab(tab)}
//                 style={{
//                   cursor: "pointer",
//                   fontSize: "0.8rem",
//                   padding: "6px 8px",
//                 }}
//               >
//                 {tab === "details"
//                   ? "Lead Details"
//                   : tab.charAt(0).toUpperCase() + tab.slice(1)}
//               </NavLink>
//             </NavItem>
//           ))}
//         </Nav>

//         {error && (
//           <div
//             className="alert alert-danger"
//             role="alert"
//             style={{ fontSize: "0.8rem", padding: "6px 10px" }}
//           >
//             {error}
//           </div>
//         )}

//         <TabContent activeTab={activeTab} className="p-2 border border-top-0">
//           <TabPane tabId="details">
//             <div
//               style={{ border: "1px solid #dee2e6", borderRadius: "0.25rem" }}
//             >
//               <Row className="m-0">
//                 {[0, 1].map((colIndex) => (
//                   <Col
//                     key={colIndex}
//                     md={6}
//                     style={
//                       colIndex === 0 ? { borderRight: "1px solid #dee2e6" } : {}
//                     }
//                   >
//                     {leadFields
//                       .slice(
//                         colIndex === 0 ? 0 : Math.ceil(leadFields.length / 2),
//                         colIndex === 0
//                           ? Math.ceil(leadFields.length / 2)
//                           : leadFields.length
//                       )
//                       .map(([key, value]) => (
//                         <FormGroup
//                           key={key}
//                           className="p-1 border-bottom m-0"
//                           style={{ fontSize: "0.8rem" }}
//                         >
//                           <Label style={{ fontSize: "0.8rem" }}>
//                             {formatLabel(key)}
//                           </Label>
//                           <Input
//                             plaintext
//                             value={value || "N/A"}
//                             readOnly
//                             style={borderStyle}
//                           />
//                         </FormGroup>
//                       ))}
//                   </Col>
//                 ))}
//               </Row>
//             </div>
//           </TabPane>

//           {/* Notes Tab */}
//           <TabPane tabId="notes">
//             <FormGroup style={{ marginBottom: "8px" }}>
//               <Input
//                 type="textarea"
//                 placeholder="Enter your notes here..."
//                 value={notes}
//                 onChange={(e) => setNotes(e.target.value)}
//                 style={{
//                   height: "100px",
//                   border: "1px solid #dee2e6",
//                   fontSize: "0.8rem",
//                   padding: "6px",
//                 }}
//               />
//               <div
//                 className="text-end mt-1"
//                 style={{ fontSize: "0.7rem", color: "#555" }}
//               >
//                 {250 - notes.length} characters remaining
//               </div>
//             </FormGroup>

//             <Button
//               color="primary"
//               onClick={handleSubmitNote}
//               disabled={loading || !notes.trim()}
//               style={{ fontSize: "0.8rem", padding: "4px 10px" }}
//             >
//               {loading ? <Spinner size="sm" /> : "Post Note"}
//             </Button>

//             <div className="mt-3" style={{ fontSize: "0.8rem" }}>
//               <h6 style={{ fontSize: "0.9rem", marginBottom: "6px" }}>
//                 Previous Notes
//               </h6>
//               {loading && allNotes.length === 0 ? (
//                 <Spinner />
//               ) : (
//                 allNotes
//                   .filter((note) => note.type === "comment")
//                   .map((note) => (
//                     <div
//                       key={note.id}
//                       className="mb-2 p-2 border rounded"
//                       style={{ fontSize: "0.8rem" }}
//                     >
//                       <div className="d-flex justify-content-between">
//                         <strong style={{ fontSize: "0.85rem" }}>
//                           {note.creator?.firstname || "System"}
//                         </strong>
//                         <small>{formatDate(note.createdAt)}</small>
//                       </div>
//                       <p className="mt-1 mb-0">{note.content}</p>
//                     </div>
//                   ))
//               )}
//             </div>
//           </TabPane>

//           {/* Reminder Tab */}
//           <TabPane tabId="reminder">
//             <FormGroup style={{ marginBottom: "6px", fontSize: "0.8rem" }}>
//               <Label style={{ fontSize: "0.8rem" }}>Title *</Label>
//               <Input
//                 type="text"
//                 placeholder="Enter title"
//                 value={reminder.title}
//                 onChange={(e) =>
//                   setReminder({ ...reminder, title: e.target.value })
//                 }
//                 style={{
//                   border: "1px solid #dee2e6",
//                   fontSize: "0.8rem",
//                   padding: "4px 6px",
//                 }}
//               />
//             </FormGroup>
//             <FormGroup style={{ marginBottom: "6px", fontSize: "0.8rem" }}>
//               <Label style={{ fontSize: "0.8rem" }}>Description</Label>
//               <Input
//                 type="textarea"
//                 placeholder="Description..."
//                 value={reminder.description}
//                 onChange={(e) =>
//                   setReminder({ ...reminder, description: e.target.value })
//                 }
//                 style={{
//                   border: "1px solid #dee2e6",
//                   height: "80px",
//                   fontSize: "0.8rem",
//                   padding: "6px",
//                 }}
//               />
//             </FormGroup>
//             <FormGroup style={{ marginBottom: "8px", fontSize: "0.8rem" }}>
//               <Label style={{ fontSize: "0.8rem" }}>Date / Time</Label>
//               <Input
//                 type="datetime-local"
//                 value={reminder.datetime}
//                 onChange={(e) =>
//                   setReminder({ ...reminder, datetime: e.target.value })
//                 }
//                 style={{
//                   border: "1px solid #dee2e6",
//                   fontSize: "0.8rem",
//                   padding: "4px 6px",
//                 }}
//               />
//             </FormGroup>

//             <Button
//               color="primary"
//               onClick={handleSubmitNote}
//               disabled={
//                 loading ||
//                 !reminder.title.trim() ||
//                 !reminder.description.trim()
//               }
//               style={{ fontSize: "0.8rem", padding: "4px 10px" }}
//             >
//               {loading ? <Spinner size="sm" /> : "Set Reminder"}
//             </Button>

//             <div className="mt-3" style={{ fontSize: "0.8rem" }}>
//               <h6 style={{ fontSize: "0.9rem", marginBottom: "6px" }}>
//                 Upcoming Reminders
//               </h6>
//               {loading && allNotes.length === 0 ? (
//                 <Spinner />
//               ) : (
//                 allNotes
//                   .filter((note) => note.type === "reminder")
//                   .map((note) => (
//                     <div
//                       key={note.id}
//                       className="mb-2 p-2 border rounded"
//                       style={{ fontSize: "0.8rem" }}
//                     >
//                       <div className="d-flex justify-content-between">
//                         <strong style={{ fontSize: "0.85rem" }}>
//                           {note.title}
//                         </strong>
//                         <Badge
//                           color="info"
//                           style={{
//                             fontSize: "0.7rem",
//                             padding: "2px 6px",
//                           }}
//                         >
//                           {note.datetime
//                             ? formatDate(note.datetime)
//                             : "No date"}
//                         </Badge>
//                       </div>
//                       <p className="mt-1 mb-0">{note.content}</p>
//                       <small className="text-muted">
//                         Created by {note.creator?.firstname || "System"} on{" "}
//                         {formatDate(note.createdAt)}
//                       </small>
//                     </div>
//                   ))
//               )}
//             </div>
//           </TabPane>
//         </TabContent>

//         <TabContent activeTab={activeTab} className="p-2 border border-top-0">
//           <TabPane tabId="email">
//             <h6 style={{ fontSize: "0.9rem", marginBottom: "6px" }}>
//               Email Templates
//             </h6>
//             {loading && emailTemplates.length === 0 ? (
//               <Spinner />
//             ) : (
//               <>
//                 <FormGroup>
//                   <Label style={{ fontSize: "0.8rem" }}>Select Template</Label>
//                   <Input
//                     type="select"
//                     value={selectedTemplate}
//                     onChange={(e) => setSelectedTemplate(e.target.value)}
//                     style={{ fontSize: "0.8rem", padding: "4px 6px" }}
//                   >
//                     <option value="">-- Select Template --</option>
//                     {emailTemplates.map((template) => (
//                       <option
//                         key={template.serviceName}
//                         value={template.serviceName}
//                       >
//                         {template.name}
//                       </option>
//                     ))}
//                   </Input>
//                 </FormGroup>
//                 <Button
//                   color="primary"
//                   onClick={handleSendEmail}
//                   disabled={loading || !selectedTemplate}
//                 >
//                   {loading ? <Spinner size="sm" /> : "Send Email"}
//                 </Button>
//               </>
//             )}
//           </TabPane>
//         </TabContent>
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

// export default ClientLeadModal;

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
import { sendEmailToLead } from "../../services/emailService"; // Import the new service
import { toast } from "react-toastify"; // Import toast for notifications

const ClientLeadModal = ({ isOpen, toggle, leadData }) => {
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
  const [emailSending, setEmailSending] = useState(false); // State for email sending status

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
      const response = await getNotes(leadData.id, "client_lead");
      setAllNotes(response.notes || []);
    } catch (err) {
      setError(err.message || "Failed to fetch notes");
      console.error("Error fetching notes:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmailTemplates = async () => {
    try {
      setError(null);
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
        notebleType: "client_lead",
      };

      if (activeTab === "reminder") {
        noteData.title = reminder.title;
        noteData.datetime = reminder.datetime;
      }

      await addNote(noteData);

      if (activeTab === "notes") {
        setNotes("");
      } else {
        setReminder({
          title: "",
          description: "",
          datetime: new Date().toISOString().slice(0, 16),
        });
      }

      await fetchNotes();
    } catch (err) {
      setError(err.message || "Failed to submit note");
      console.error("Error submitting note:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmail = async () => {
    if (!selectedTemplate) {
      setError("Please select an email template");
      return;
    }

    try {
      setEmailSending(true);
      setError(null);
      const response = await sendEmailToLead(leadData.id, selectedTemplate);
      toast.success(response.message || "Email sent successfully");
      setSelectedTemplate(""); // Reset template selection
    } catch (err) {
      setError(err.message || "Failed to send email");
      toast.error(err.message || "Failed to send email");
    } finally {
      setEmailSending(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const borderStyle = {
    border: "1px solid #dee2e6",
    padding: "0.25rem 0.5rem",
    backgroundColor: "#f8f9fa",
    fontSize: "0.8rem",
  };

  const formatLabel = (key) =>
    key
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  const leadFields = leadData?.leadData
    ? Object.entries(leadData.leadData).filter(
        ([key]) => !["reason", "status"].includes(key)
      )
    : [];

  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      size="lg"
      style={{ fontSize: "0.8rem" }}
    >
      <ModalHeader
        toggle={toggle}
        style={{
          fontSize: "1rem",
          padding: "8px 12px",
        }}
      >
        Lead Detail
      </ModalHeader>
      <ModalBody style={{ padding: "10px" }}>
        <Nav tabs className="mb-3">
          {["details", "notes", "reminder", "email"].map((tab) => (
            <NavItem key={tab}>
              <NavLink
                className={`fw-bold text-dark ${
                  activeTab === tab ? "active bg-light border rounded-top" : ""
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
          <div
            className="alert alert-danger"
            role="alert"
            style={{ fontSize: "0.8rem", padding: "6px 10px" }}
          >
            {error}
          </div>
        )}

        <TabContent activeTab={activeTab} className="p-2 border border-top-0">
          {/* Lead Details Tab */}
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
                        <FormGroup
                          key={key}
                          className="p-1 border-bottom m-0"
                          style={{ fontSize: "0.8rem" }}
                        >
                          <Label style={{ fontSize: "0.8rem" }}>
                            {formatLabel(key)}
                          </Label>
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

          {/* Notes Tab */}
          <TabPane tabId="notes">
            <FormGroup style={{ marginBottom: "8px" }}>
              <Input
                type="textarea"
                placeholder="Enter your notes here..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                style={{
                  height: "100px",
                  border: "1px solid #dee2e6",
                  fontSize: "0.8rem",
                  padding: "6px",
                }}
              />
              <div
                className="text-end mt-1"
                style={{ fontSize: "0.7rem", color: "#555" }}
              >
                {250 - notes.length} characters remaining
              </div>
            </FormGroup>

            <Button
              color="primary"
              onClick={handleSubmitNote}
              disabled={loading || !notes.trim()}
              style={{ fontSize: "0.8rem", padding: "4px 10px" }}
            >
              {loading ? <Spinner size="sm" /> : "Post Note"}
            </Button>

            <div className="mt-3" style={{ fontSize: "0.8rem" }}>
              <h6 style={{ fontSize: "0.9rem", marginBottom: "6px" }}>
                Previous Notes
              </h6>
              {loading && allNotes.length === 0 ? (
                <Spinner />
              ) : (
                allNotes
                  .filter((note) => note.type === "comment")
                  .map((note) => (
                    <div
                      key={note.id}
                      className="mb-2 p-2 border rounded"
                      style={{ fontSize: "0.8rem" }}
                    >
                      <div className="d-flex justify-content-between">
                        <strong style={{ fontSize: "0.85rem" }}>
                          {note.creator?.firstname || "System"}
                        </strong>
                        <small>{formatDate(note.createdAt)}</small>
                      </div>
                      <p className="mt-1 mb-0">{note.content}</p>
                    </div>
                  ))
              )}
            </div>
          </TabPane>

          {/* Reminder Tab */}
          <TabPane tabId="reminder">
            <FormGroup style={{ marginBottom: "6px", fontSize: "0.8rem" }}>
              <Label style={{ fontSize: "0.8rem" }}>Title *</Label>
              <Input
                type="text"
                placeholder="Enter title"
                value={reminder.title}
                onChange={(e) =>
                  setReminder({ ...reminder, title: e.target.value })
                }
                style={{
                  border: "1px solid #dee2e6",
                  fontSize: "0.8rem",
                  padding: "4px 6px",
                }}
              />
            </FormGroup>
            <FormGroup style={{ marginBottom: "6px", fontSize: "0.8rem" }}>
              <Label style={{ fontSize: "0.8rem" }}>Description</Label>
              <Input
                type="textarea"
                placeholder="Description..."
                value={reminder.description}
                onChange={(e) =>
                  setReminder({ ...reminder, description: e.target.value })
                }
                style={{
                  border: "1px solid #dee2e6",
                  height: "80px",
                  fontSize: "0.8rem",
                  padding: "6px",
                }}
              />
            </FormGroup>
            <FormGroup style={{ marginBottom: "8px", fontSize: "0.8rem" }}>
              <Label style={{ fontSize: "0.8rem" }}>Date / Time</Label>
              <Input
                type="datetime-local"
                value={reminder.datetime}
                onChange={(e) =>
                  setReminder({ ...reminder, datetime: e.target.value })
                }
                style={{
                  border: "1px solid #dee2e6",
                  fontSize: "0.8rem",
                  padding: "4px 6px",
                }}
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
              style={{ fontSize: "0.8rem", padding: "4px 10px" }}
            >
              {loading ? <Spinner size="sm" /> : "Set Reminder"}
            </Button>

            <div className="mt-3" style={{ fontSize: "0.8rem" }}>
              <h6 style={{ fontSize: "0.9rem", marginBottom: "6px" }}>
                Upcoming Reminders
              </h6>
              {loading && allNotes.length === 0 ? (
                <Spinner />
              ) : (
                allNotes
                  .filter((note) => note.type === "reminder")
                  .map((note) => (
                    <div
                      key={note.id}
                      className="mb-2 p-2 border rounded"
                      style={{ fontSize: "0.8rem" }}
                    >
                      <div className="d-flex justify-content-between">
                        <strong style={{ fontSize: "0.85rem" }}>
                          {note.title}
                        </strong>
                        <Badge
                          color="info"
                          style={{
                            fontSize: "0.7rem",
                            padding: "2px 6px",
                          }}
                        >
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

          {/* Email Tab */}
          <TabPane tabId="email">
            <h6 style={{ fontSize: "0.9rem", marginBottom: "6px" }}>
              Email Templates
            </h6>
            {loading && emailTemplates.length === 0 ? (
              <Spinner />
            ) : (
              <FormGroup>
                <Label style={{ fontSize: "0.8rem" }}>Select Template</Label>
                <Input
                  type="select"
                  value={selectedTemplate}
                  onChange={(e) => setSelectedTemplate(e.target.value)}
                  style={{ fontSize: "0.8rem", padding: "4px 6px" }}
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
              style={{ fontSize: "0.8rem", padding: "4px 10px" }}
            >
              {emailSending ? <Spinner size="sm" /> : "Send Email"}
            </Button>
          </TabPane>
        </TabContent>
      </ModalBody>
      <ModalFooter style={{ padding: "6px 10px" }}>
        <Button
          color="secondary"
          onClick={toggle}
          style={{ fontSize: "0.8rem", padding: "4px 10px" }}
        >
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ClientLeadModal;
