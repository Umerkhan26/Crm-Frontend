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
// import {
//   getNotes,
//   addNote,
//   getReminders,
//   addReminder,
//   deleteNote,
//   deleteReminder,
// } from "../../services/noteService";
// import { getEmailTemplates } from "../../services/emailTemplateService";
// import { sendEmailToLead } from "../../services/emailService";
// import { toast } from "react-toastify";
// import { FaTrash } from "react-icons/fa";
// import useDeleteConfirmation from "./DeleteConfirmation";

// const LeadDetailModal = ({ isOpen, toggle, leadData }) => {
//   const [activeTab, setActiveTab] = useState("details");
//   const { confirmDelete } = useDeleteConfirmation();
//   const [deletingNoteId, setDeletingNoteId] = useState(null);
//   const [deletingReminderId, setDeletingReminderId] = useState(null);
//   const [notes, setNotes] = useState("");
//   const [reminder, setReminder] = useState({
//     title: "",
//     description: "",
//     datetime: new Date().toISOString().slice(0, 16),
//   });
//   const [allNotes, setAllNotes] = useState([]);
//   const [reminders, setReminders] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [emailTemplates, setEmailTemplates] = useState([]);
//   const [selectedTemplate, setSelectedTemplate] = useState("");
//   const [emailSending, setEmailSending] = useState(false);

//   useEffect(() => {
//     if (isOpen && leadData?.id) {
//       console.log("LeadDetailModal leadData:", leadData);
//       fetchNotes();
//       fetchReminders();
//       fetchEmailTemplates();
//     }
//   }, [isOpen, leadData]);

//   const fetchReminders = async () => {
//     try {
//       const response = await getReminders(leadData.id, "lead");
//       setReminders(response.reminders || []);
//     } catch (err) {
//       console.error("Error fetching reminders:", err);
//       toast.error(err.message || "Failed to fetch reminders");
//     }
//   };

//   const fetchNotes = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const response = await getNotes(leadData.id, "lead");

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

//       if (activeTab === "reminder") {
//         const reminderData = {
//           content: reminder.description,
//           reminderType: reminder.title,
//           reminderDate: reminder.datetime,
//           notebleId: leadData.id,
//           notebleType: "lead",
//         };

//         // 👇 Log the reminderData to the console before sending
//         console.log("Submitting Reminder:", reminderData);

//         await addReminder(reminderData);
//         setReminder({
//           title: "",
//           description: "",
//           datetime: new Date().toISOString().slice(0, 16),
//         });
//         await fetchReminders();
//       } else {
//         const noteData = {
//           content: notes,
//           type: "comment",
//           notebleId: leadData.id,
//           notebleType: "lead",
//         };

//         await addNote(noteData);
//         setNotes("");
//         await fetchNotes();
//       }
//     } catch (err) {
//       setError(err.message || "Failed to submit");
//       toast.error(err.message || "Submission failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSendEmail = async () => {
//     if (!selectedTemplate) {
//       setError("Please select an email template");
//       return;
//     }
//     if (!leadData?.fullLeadData?.email) {
//       setError("Lead does not have an email address");
//       toast.error("Lead does not have an email address");
//       return;
//     }

//     try {
//       setEmailSending(true);
//       setError(null);
//       const response = await sendEmailToLead(leadData.id, selectedTemplate);
//       toast.success(response.message || "Email sent successfully");
//       setSelectedTemplate("");
//     } catch (err) {
//       setError(err.message || "Failed to send email");
//       toast.error(err.message || "Failed to send email");
//     } finally {
//       setEmailSending(false);
//     }
//   };

//   const handleDeleteNote = (noteId) => {
//     confirmDelete(
//       async () => {
//         setDeletingNoteId(noteId);
//         const token = localStorage.getItem("token");
//         await deleteNote(noteId, token);
//         setAllNotes((prev) => prev.filter((note) => note.id !== noteId));
//       },
//       () => setDeletingNoteId(null),
//       "note"
//     );
//   };

//   const handleDeleteReminder = (reminderId) => {
//     confirmDelete(
//       async () => {
//         setDeletingReminderId(reminderId);
//         const token = localStorage.getItem("token");
//         await deleteReminder(reminderId, token);
//         setReminders((prev) =>
//           prev.filter((reminder) => reminder.id !== reminderId)
//         );
//       },
//       () => setDeletingReminderId(null),
//       "reminder"
//     );
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

//   const leadFields = leadData?.fullLeadData
//     ? Object.entries(leadData.fullLeadData).filter(
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
//         {/* <Nav tabs className="mb-3">
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
//         </Nav> */}

//         <Nav tabs className="mb-3">
//           {["details", "notes", "reminder"]
//             .concat(leadData?.fullLeadData?.email ? ["email"] : [])
//             .map((tab) => (
//               <NavItem key={tab}>
//                 <NavLink
//                   className={`fw-bold text-dark ${
//                     activeTab === tab
//                       ? "active bg-light border rounded-top"
//                       : ""
//                   }`}
//                   onClick={() => setActiveTab(tab)}
//                   style={{
//                     cursor: "pointer",
//                     fontSize: "0.8rem",
//                     padding: "6px 8px",
//                   }}
//                 >
//                   {tab === "details"
//                     ? "Lead Details"
//                     : tab.charAt(0).toUpperCase() + tab.slice(1)}
//                 </NavLink>
//               </NavItem>
//             ))}
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
//           {/* Lead Details Tab */}
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
//               ) : allNotes.filter((note) => note.type === "comment").length ===
//                 0 ? (
//                 <p>No notes yet.</p>
//               ) : (
//                 allNotes
//                   .filter((note) => note.type === "comment")
//                   .map((note) => (
//                     <div
//                       key={note.id}
//                       className="mb-2 p-2 border rounded"
//                       style={{ fontSize: "0.8rem" }}
//                     >
//                       <div className="d-flex justify-content-between align-items-start">
//                         <div style={{ flex: "1 1 auto" }}>
//                           <div className="d-flex justify-content-between align-items-center">
//                             <strong style={{ fontSize: "0.85rem" }}>
//                               {note.creator?.firstname || "System"}
//                             </strong>
//                           </div>
//                           <p className="mt-1 mb-0">{note.content}</p>
//                         </div>
//                         <div
//                           className="d-flex align-items-center"
//                           style={{ gap: "10px" }}
//                         >
//                           <small
//                             className="text-muted"
//                             style={{ whiteSpace: "nowrap" }}
//                           >
//                             {formatDate(note.createdAt)}
//                           </small>
//                           <Button
//                             color="danger"
//                             size="sm"
//                             onClick={() => handleDeleteNote(note.id)}
//                             disabled={deletingNoteId === note.id}
//                             title="Delete note"
//                             style={{ padding: "2px 6px" }}
//                           >
//                             {deletingNoteId === note.id ? (
//                               <Spinner size="sm" />
//                             ) : (
//                               <FaTrash />
//                             )}
//                           </Button>
//                         </div>
//                       </div>
//                     </div>
//                   ))
//               )}
//             </div>
//           </TabPane>

//           {/* Reminder Tab */}
//           <TabPane tabId="reminder">
//             <FormGroup style={{ marginBottom: "6px", fontSize: "0.8rem" }}>
//               <Label style={{ fontSize: "0.8rem" }}>Reminder Type *</Label>
//               <Input
//                 type="text"
//                 placeholder="Enter reminder type (e.g. Follow-up)"
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
//                 placeholder="Enter reminder details..."
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
//               <Label style={{ fontSize: "0.8rem" }}>Reminder Date / Time</Label>
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

//               {loading && reminders.length === 0 ? (
//                 <Spinner />
//               ) : reminders.length === 0 ? (
//                 <p>No reminders yet.</p>
//               ) : (
//                 reminders.map((note) => (
//                   <div
//                     key={note.id}
//                     className="mb-2 p-2 border rounded"
//                     style={{ fontSize: "0.8rem" }}
//                   >
//                     <div className="d-flex justify-content-between align-items-start">
//                       <div style={{ flex: "1 1 auto" }}>
//                         <div className="d-flex justify-content-between align-items-center">
//                           <strong style={{ fontSize: "0.85rem" }}>
//                             {note.reminderType || "Untitled"}
//                           </strong>
//                           <Badge
//                             color="info"
//                             style={{
//                               fontSize: "0.7rem",
//                               padding: "2px 6px",
//                               marginRight: "15px",
//                             }}
//                           >
//                             {note.reminderDate
//                               ? formatDate(note.reminderDate)
//                               : "No date"}
//                           </Badge>
//                         </div>
//                         <p className="mt-1 mb-0">{note.content}</p>
//                         <small className="text-muted">
//                           Created by {note.creator?.firstname || "System"} on{" "}
//                           {formatDate(note.createdAt)}
//                         </small>
//                       </div>
//                       <Button
//                         color="danger"
//                         size="sm"
//                         onClick={() => handleDeleteReminder(note.id)}
//                         disabled={deletingReminderId === note.id}
//                         title="Delete reminder"
//                         style={{ padding: "2px 6px" }}
//                       >
//                         {deletingReminderId === note.id ? (
//                           <Spinner size="sm" />
//                         ) : (
//                           <FaTrash />
//                         )}
//                       </Button>
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>
//           </TabPane>

//           {/* Email Tab */}
//           <TabPane tabId="email">
//             <h6 style={{ fontSize: "0.9rem", marginBottom: "6px" }}>
//               Email Templates
//             </h6>
//             {loading && emailTemplates.length === 0 ? (
//               <Spinner />
//             ) : (
//               <FormGroup>
//                 <Label style={{ fontSize: "0.8rem" }}>Select Template</Label>
//                 <Input
//                   type="select"
//                   value={selectedTemplate}
//                   onChange={(e) => setSelectedTemplate(e.target.value)}
//                   style={{ fontSize: "0.8rem", padding: "4px 6px" }}
//                 >
//                   <option value="">-- Select Template --</option>
//                   {emailTemplates.map((template) => (
//                     <option key={template.id} value={template.serviceName}>
//                       {template.name}
//                     </option>
//                   ))}
//                 </Input>
//               </FormGroup>
//             )}
//             <Button
//               color="primary"
//               onClick={handleSendEmail}
//               disabled={
//                 emailSending ||
//                 !selectedTemplate ||
//                 !leadData?.id ||
//                 !leadData?.fullLeadData?.email
//               }
//               style={{ fontSize: "0.8rem", padding: "4px 10px" }}
//             >
//               {emailSending ? <Spinner size="sm" /> : "Send Email"}
//             </Button>
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

// export default LeadDetailModal;

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
import {
  getNotes,
  addNote,
  getReminders,
  addReminder,
  deleteNote,
  deleteReminder,
} from "../../services/noteService";
import {
  getEmailTemplates,
  updateEmailTemplate,
} from "../../services/emailTemplateService";
import { sendEmailToLead } from "../../services/emailService";
import { toast } from "react-toastify";
import { FaTrash } from "react-icons/fa";
import useDeleteConfirmation from "./DeleteConfirmation";
import {
  EditorState,
  ContentState,
  convertFromHTML,
  convertToRaw,
} from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const LeadDetailModal = ({ isOpen, toggle, leadData }) => {
  const [activeTab, setActiveTab] = useState("details");
  const { confirmDelete } = useDeleteConfirmation();
  const [deletingNoteId, setDeletingNoteId] = useState(null);
  const [deletingReminderId, setDeletingReminderId] = useState(null);
  const [notes, setNotes] = useState("");
  const [reminder, setReminder] = useState({
    title: "",
    description: "",
    datetime: new Date().toISOString().slice(0, 16),
  });
  const [allNotes, setAllNotes] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [emailTemplates, setEmailTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [emailSending, setEmailSending] = useState(false);
  const [templateSaving, setTemplateSaving] = useState(false);

  useEffect(() => {
    if (isOpen && leadData?.id) {
      console.log("LeadDetailModal leadData:", leadData);
      fetchNotes();
      fetchReminders();
      fetchEmailTemplates();
    }
  }, [isOpen, leadData]);

  const fetchReminders = async () => {
    try {
      const response = await getReminders(leadData.id, "lead");
      setReminders(response.reminders || []);
    } catch (err) {
      console.error("Error fetching reminders:", err);
      toast.error(err.message || "Failed to fetch reminders");
    }
  };

  const fetchNotes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getNotes(leadData.id, "lead");
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
      console.log("Fetched email templates:", templates);
      setEmailTemplates(templates);
    } catch (err) {
      setError(err.message || "Failed to fetch email templates");
      console.error("Error fetching email templates:", err);
    }
  };

  const handleTemplateChange = (e) => {
    const templateServiceName = e.target.value;
    console.log(
      "Template serviceName from dropdown:",
      templateServiceName,
      typeof templateServiceName
    );
    setSelectedTemplate(templateServiceName);

    if (templateServiceName) {
      try {
        const template = emailTemplates.find(
          (t) => t.serviceName === templateServiceName
        );
        console.log("Selected template:", template);
        if (template && template.bodyTemplate) {
          try {
            const blocksFromHTML = convertFromHTML(template.bodyTemplate);
            const contentState = ContentState.createFromBlockArray(
              blocksFromHTML.contentBlocks,
              blocksFromHTML.entityMap
            );
            setEditorState(EditorState.createWithContent(contentState));
            setSelectedTemplateId(template.id);
            console.log("Editor state updated with template content");
          } catch (htmlError) {
            console.error("Error parsing template HTML:", htmlError);
            setEditorState(EditorState.createEmpty());
            setError("Invalid template content format");
            toast.error("Invalid template content format");
          }
        } else {
          console.log(
            "No bodyTemplate found or template not found, resetting editor"
          );
          setEditorState(EditorState.createEmpty());
          setSelectedTemplateId(null);
          if (!template) {
            setError("Template not found");
            toast.error("Template not found");
          } else {
            setError("Template has no content");
            toast.error("Template has no content");
          }
        }
      } catch (err) {
        console.error("Error in handleTemplateChange:", err);
        setError(err.message || "Failed to load template content");
        toast.error(err.message || "Failed to load template content");
        setEditorState(EditorState.createEmpty());
        setSelectedTemplateId(null);
      }
    } else {
      console.log("No template selected, resetting editor");
      setEditorState(EditorState.createEmpty());
      setSelectedTemplateId(null);
    }
  };

  const handleSubmitNote = async () => {
    try {
      setLoading(true);
      if (activeTab === "reminder") {
        const reminderData = {
          content: reminder.description,
          reminderType: reminder.title,
          reminderDate: reminder.datetime,
          notebleId: leadData.id,
          notebleType: "lead",
        };
        console.log("Submitting Reminder:", reminderData);
        await addReminder(reminderData);
        setReminder({
          title: "",
          description: "",
          datetime: new Date().toISOString().slice(0, 16),
        });
        await fetchReminders();
      } else {
        const noteData = {
          content: notes,
          type: "comment",
          notebleId: leadData.id,
          notebleType: "lead",
        };
        await addNote(noteData);
        setNotes("");
        await fetchNotes();
      }
    } catch (err) {
      setError(err.message || "Failed to submit");
      toast.error(err.message || "Submission failed");
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
      setError("Lead does not have an email address");
      toast.error("Lead does not have an email address");
      return;
    }

    try {
      setEmailSending(true);
      setError(null);
      const emailContent = draftToHtml(
        convertToRaw(editorState.getCurrentContent())
      );
      console.log("Sending email with content:", emailContent);
      await sendEmailToLead(leadData.id, selectedTemplate, emailContent);
      toast.success("Email sent successfully");
      setSelectedTemplate("");
      setSelectedTemplateId(null);
      setEditorState(EditorState.createEmpty());
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
      console.log("Saving template with content:", updatedContent);
      const template = emailTemplates.find(
        (t) => t.serviceName === selectedTemplate
      );
      await updateEmailTemplate(selectedTemplateId, {
        name: template.name,
        subjectTemplate: template.subjectTemplate,
        bodyTemplate: updatedContent,
      });
      toast.success("Template updated successfully");
      await fetchEmailTemplates();
    } catch (err) {
      setError(err.message || "Failed to save template");
      toast.error(err.message || "Failed to save template");
    } finally {
      setTemplateSaving(false);
    }
  };

  const handleDeleteNote = (noteId) => {
    confirmDelete(
      async () => {
        setDeletingNoteId(noteId);
        const token = localStorage.getItem("token");
        await deleteNote(noteId, token);
        setAllNotes((prev) => prev.filter((note) => note.id !== noteId));
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

  const leadFields = leadData?.fullLeadData
    ? Object.entries(leadData.fullLeadData).filter(
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
          <div
            className="alert alert-danger"
            role="alert"
            style={{ fontSize: "0.8rem", padding: "6px 10px" }}
          >
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
              ) : allNotes.filter((note) => note.type === "comment").length ===
                0 ? (
                <p>No notes yet.</p>
              ) : (
                allNotes
                  .filter((note) => note.type === "comment")
                  .map((note) => (
                    <div
                      key={note.id}
                      className="mb-2 p-2 border rounded"
                      style={{ fontSize: "0.8rem" }}
                    >
                      <div className="d-flex justify-content-between align-items-start">
                        <div style={{ flex: "1 1 auto" }}>
                          <div className="d-flex justify-content-between align-items-center">
                            <strong style={{ fontSize: "0.85rem" }}>
                              {note.creator?.firstname || "System"}
                            </strong>
                          </div>
                          <p className="mt-1 mb-0">{note.content}</p>
                        </div>
                        <div
                          className="d-flex align-items-center"
                          style={{ gap: "10px" }}
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
                    </div>
                  ))
              )}
            </div>
          </TabPane>

          <TabPane tabId="reminder">
            <FormGroup style={{ marginBottom: "6px", fontSize: "0.8rem" }}>
              <Label style={{ fontSize: "0.8rem" }}>Reminder Type *</Label>
              <Input
                type="text"
                placeholder="Enter reminder type (e.g. Follow-up)"
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
                placeholder="Enter reminder details..."
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
              <Label style={{ fontSize: "0.8rem" }}>Reminder Date / Time</Label>
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

              {loading && reminders.length === 0 ? (
                <Spinner />
              ) : reminders.length === 0 ? (
                <p>No reminders yet.</p>
              ) : (
                reminders.map((note) => (
                  <div
                    key={note.id}
                    className="mb-2 p-2 border rounded"
                    style={{ fontSize: "0.8rem" }}
                  >
                    <div className="d-flex justify-content-between align-items-start">
                      <div style={{ flex: "1 1 auto" }}>
                        <div className="d-flex justify-content-between align-items-center">
                          <strong style={{ fontSize: "0.85rem" }}>
                            {note.reminderType || "Untitled"}
                          </strong>
                          <Badge
                            color="info"
                            style={{
                              fontSize: "0.7rem",
                              padding: "2px 6px",
                              marginRight: "15px",
                            }}
                          >
                            {note.reminderDate
                              ? formatDate(note.reminderDate)
                              : "No date"}
                          </Badge>
                        </div>
                        <p className="mt-1 mb-0">{note.content}</p>
                        <small className="text-muted">
                          Created by {note.creator?.firstname || "System"} on{" "}
                          {formatDate(note.createdAt)}
                        </small>
                      </div>
                      <Button
                        color="danger"
                        size="sm"
                        onClick={() => handleDeleteReminder(note.id)}
                        disabled={deletingReminderId === note.id}
                        title="Delete reminder"
                        style={{ padding: "2px 6px" }}
                      >
                        {deletingReminderId === note.id ? (
                          <Spinner size="sm" />
                        ) : (
                          <FaTrash />
                        )}
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabPane>

          <TabPane tabId="email">
            <h6 style={{ fontSize: "0.9rem", marginBottom: "6px" }}>
              Email Templates
            </h6>
            {loading && emailTemplates.length === 0 ? (
              <Spinner />
            ) : (
              <>
                <FormGroup>
                  <Label style={{ fontSize: "0.8rem" }}>Select Template</Label>
                  <Input
                    type="select"
                    value={selectedTemplate}
                    onChange={handleTemplateChange}
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
                {selectedTemplate && (
                  <FormGroup>
                    <Label style={{ fontSize: "0.8rem" }}>
                      Edit Email Content
                    </Label>
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
                            options: ["Normal", "H1", "H2", "H3", "Blockquote"],
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
                  onClick={handleSendEmail}
                  disabled={
                    emailSending ||
                    !selectedTemplate ||
                    !leadData?.id ||
                    !leadData?.fullLeadData?.email
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
                    onClick={handleSaveTemplate}
                    disabled={templateSaving || !selectedTemplateId}
                    style={{ fontSize: "0.8rem", padding: "4px 10px" }}
                  >
                    {templateSaving ? <Spinner size="sm" /> : "Save Template"}
                  </Button>
                )}
              </>
            )}
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

export default LeadDetailModal;
