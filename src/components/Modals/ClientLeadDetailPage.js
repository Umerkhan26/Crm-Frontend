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

// const handleSendEmail = async () => {
//   if (!selectedTemplate) {
//     toast.error("Please select an email template");
//     return;
//   }
//   try {
//     setLoading(true);
//     const response = await sendEmailToLead(leadData.id, selectedTemplate);
//     console.log("email sendddd", response);
//     toast.success(response.message || "Email sent successfully!");
//   } catch (err) {
//     toast.error(err.message || "Failed to send email");
//   } finally {
//     setLoading(false);
//   }
// };
// const fetchNotes = async () => {
//   try {
//     setLoading(true);
//     setError(null);
//     const response = await getNotes(leadData.id, "client_lead");
//     setAllNotes(response.notes || []);
//   } catch (err) {
//     setError(err.message || "Failed to fetch notes");
//     console.error("Error fetching notes:", err);
//   } finally {
//     setLoading(false);
//   }
// };

// const fetchEmailTemplates = async () => {
//   try {
//     setError(null);
//     const templates = await getEmailTemplates();
//     setEmailTemplates(templates);
//   } catch (err) {
//     setError(err.message || "Failed to fetch email templates");
//   }
// };

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
// import { sendEmailToLead } from "../../services/emailService"; // Import the new service
// import { toast } from "react-toastify"; // Import toast for notifications

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
//   const [emailSending, setEmailSending] = useState(false); // State for email sending status

//   useEffect(() => {
//     if (isOpen && leadData?.id) {
//       fetchNotes();
//       fetchEmailTemplates();
//     }
//   }, [isOpen, leadData]);

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

// const handleSendEmail = async () => {
//   if (!selectedTemplate) {
//     setError("Please select an email template");
//     return;
//   }

//   try {
//     setEmailSending(true);
//     setError(null);
//     const response = await sendEmailToLead(leadData.id, selectedTemplate);
//     toast.success(response.message || "Email sent successfully");
//     setSelectedTemplate(""); // Reset template selection
//   } catch (err) {
//     setError(err.message || "Failed to send email");
//     toast.error(err.message || "Failed to send email");
//   } finally {
//     setEmailSending(false);
//   }
// };

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
//               disabled={emailSending || !selectedTemplate}
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

// export default ClientLeadModal;

// import React, { useState, useEffect } from "react";
// import { useParams, useLocation, useNavigate } from "react-router-dom";
// import {
//   Container,
//   Card,
//   CardBody,
//   Spinner,
//   Badge,
//   Button,
//   Row,
//   Col,
//   Table,
//   Alert,
//   Form,
//   FormGroup,
//   Label,
//   Input,
//   Modal,
//   ModalHeader,
//   ModalBody,
//   ModalFooter,
//   Nav,
//   NavItem,
//   NavLink,
//   TabContent,
//   TabPane,
// } from "reactstrap";
// import Breadcrumbs from "../Common/Breadcrumb";
// import { toast } from "react-toastify";
// import { getNotes, addNote, deleteNote } from "../../services/noteService";
// import { sendEmailToLead } from "../../services/emailService";
// import {
//   getAllClientLeads,
//   getClientLeadActivitiesByLeadId,
// } from "../../services/ClientleadService";
// import { deleteLeadActivityById } from "../../services/leadService";
// import { FaTrash } from "react-icons/fa";
// import useDeleteConfirmation from "./DeleteConfirmation";
// import { useSelector } from "react-redux";
// import { hasAnyPermission } from "../../utils/permissions";
// import {
//   getEmailTemplates,
//   updateEmailTemplate,
// } from "../../services/emailTemplateService";
// import {
//   EditorState,
//   ContentState,
//   convertFromHTML,
//   convertToRaw,
// } from "draft-js";
// import { Editor } from "react-draft-wysiwyg";
// import draftToHtml from "draftjs-to-html";
// import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

// const ClientLeadDetailPage = () => {
//   const { leadId } = useParams();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const queryParams = new URLSearchParams(location.search);
//   const orderId = queryParams.get("orderId");
//   const { confirmDelete } = useDeleteConfirmation();
//   const currentUser = useSelector((state) => state.Login?.user);
//   const isAdmin = hasAnyPermission(currentUser, ["user:get"]);
//   const [lead, setLead] = useState(null);
//   const [activeTab, setActiveTab] = useState("details");
//   const [notes, setNotes] = useState([]);
//   const [newNote, setNewNote] = useState("");
//   const [reminder, setReminder] = useState({
//     title: "",
//     description: "",
//     datetime: new Date().toISOString().slice(0, 16),
//   });
//   const [allNotes, setAllNotes] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [notesLoading, setNotesLoading] = useState(false);
//   const [addingNote, setAddingNote] = useState(false);
//   const [error, setError] = useState(null);
//   const [emailTemplates, setEmailTemplates] = useState([]);
//   const [selectedTemplate, setSelectedTemplate] = useState("");
//   const [selectedTemplateId, setSelectedTemplateId] = useState(null);
//   const [editorState, setEditorState] = useState(EditorState.createEmpty());
//   const [emailSending, setEmailSending] = useState(false);
//   const [templateSaving, setTemplateSaving] = useState(false);
//   const [noteModalOpen, setNoteModalOpen] = useState(false);
//   const [reminderModalOpen, setReminderModalOpen] = useState(false);
//   const [deletingNoteId, setDeletingNoteId] = useState(null);
//   const [activities, setActivities] = useState([]);
//   const [activitiesLoading, setActivitiesLoading] = useState(false);
//   const [activitiesError, setActivitiesError] = useState(null);
//   const [deletingActivityId, setDeletingActivityId] = useState(null);
//   const [reminders, setReminders] = useState([]);
//   useEffect(() => {
//     const fetchLeadDetails = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         if (!leadId) {
//           throw new Error("Lead ID is missing");
//         }

//         const response = await getAllClientLeads(1, 10, orderId);
//         console.log("clientlead response", response);
//         const leads = Array.isArray(response.data) ? response.data : [];
//         const leadData = leads.find((lead) => lead.id === parseInt(leadId));

//         if (!leadData) {
//           throw new Error("Lead not found");
//         }

//         leadData.leadData =
//           typeof leadData.leadData === "string"
//             ? JSON.parse(leadData.leadData)
//             : leadData.leadData || {};
//         setLead(leadData);

//         // Fetch notes
//         setNotesLoading(true);
//         const notesResponse = await getNotes(leadId, "client_lead");
//         setAllNotes(notesResponse.notes || []);
//         setNotes(
//           notesResponse.notes?.filter((note) => note.type === "comment") || []
//         );
//         setReminders(
//           notesResponse.notes?.filter((note) => note.type === "reminder") || []
//         );

//         const templates = await getEmailTemplates();
//         setEmailTemplates(templates);

//         if (isAdmin) {
//           setActivitiesLoading(true);
//           try {
//             // Add a query parameter to indicate this is a client lead
//             // For client leads - pass true as the second parameter
//             const activities = await getClientLeadActivitiesByLeadId(leadId);

//             console.log("ClientLead activities:", activities);
//             setActivities(Array.isArray(activities) ? activities : []);
//           } catch (err) {
//             setActivitiesError(err.message || "Failed to fetch activities");
//             console.error("Activities fetch error:", err);
//           } finally {
//             setActivitiesLoading(false);
//           }
//         }
//       } catch (err) {
//         setError(err.message || "Failed to fetch lead details");
//         toast.error(err.message || "Failed to load lead details");
//       } finally {
//         setLoading(false);
//         setNotesLoading(false);
//       }
//     };

//     fetchLeadDetails();
//   }, [leadId, orderId, isAdmin]);

//   const handleAddNote = async () => {
//     if (!newNote.trim()) {
//       toast.warn("Note cannot be empty");
//       return;
//     }

//     try {
//       setAddingNote(true);
//       const noteData = {
//         content: newNote,
//         type: "comment",
//         notebleId: parseInt(leadId),
//         notebleType: "client_lead",
//       };

//       console.log("Attempting to add note with data:", noteData);
//       const response = await addNote(noteData);
//       console.log("Add note response:", response); // Debug log

//       const addedNote = response.note || response.data || response;

//       if (addedNote) {
//         setAllNotes((prev) => [...prev, addedNote]);
//         setNotes((prev) => [...prev, addedNote]);
//         setNewNote("");
//         toast.success("Note added successfully");

//         // Optimistically add activity (for admins)
//         if (isAdmin) {
//           const newActivity = {
//             id: `temp-${Date.now()}`,
//             action: "note_added",
//             details: newNote,
//             clientLeadId: parseInt(leadId),
//             performedBy: currentUser.id,
//             performedByUser: {
//               firstname: currentUser.firstname,
//               lastname: currentUser.lastname,
//               email: currentUser.email,
//             },
//             createdAt: new Date().toISOString(),
//             ClientLead: { orderId: lead.orderId || "N/A" },
//           };
//           setActivities((prev) => [...prev, newActivity]);

//           // Refetch activities to sync with server
//           try {
//             setActivitiesLoading(true);
//             const activities = await getClientLeadActivitiesByLeadId(leadId);
//             console.log("Refetched activities after note:", activities);
//             setActivities(Array.isArray(activities) ? activities : []);
//           } catch (err) {
//             setActivitiesError(err.message || "Failed to fetch activities");
//           } finally {
//             setActivitiesLoading(false);
//           }
//         }
//       }
//     } catch (error) {
//       toast.error("Failed to add note");
//       console.error("Error adding note:", error);
//     } finally {
//       setAddingNote(false);
//       setNoteModalOpen(false);
//     }
//   };

//   const handleAddReminder = async () => {
//     if (!reminder.title.trim() || !reminder.description.trim()) {
//       toast.warn("All fields are required for reminder");
//       return;
//     }

//     try {
//       setAddingNote(true);
//       const noteData = {
//         content: reminder.description,
//         type: "reminder",
//         title: reminder.title,
//         datetime: reminder.datetime,
//         notebleId: parseInt(leadId),
//         notebleType: "client_lead",
//       };

//       const response = await addNote(noteData);
//       const addedReminder = response.note || response.data || response;

//       if (addedReminder) {
//         setAllNotes((prev) => [...prev, addedReminder]);
//         setReminders((prev) => [...prev, addedReminder]); // Add to reminders state

//         setReminder({
//           title: "",
//           description: "",
//           datetime: new Date().toISOString().slice(0, 16),
//         });
//         toast.success("Reminder added successfully");

//         // Optimistically add activity (for admins)
//         if (isAdmin) {
//           const newActivity = {
//             id: `temp-${Date.now()}`,
//             action: "reminder_added",
//             details: reminder.description,
//             clientLeadId: parseInt(leadId),
//             performedBy: currentUser.id,
//             performedByUser: {
//               firstname: currentUser.firstname,
//               lastname: currentUser.lastname,
//               email: currentUser.email,
//             },
//             createdAt: new Date().toISOString(),
//             ClientLead: { orderId: lead.orderId || "N/A" },
//           };
//           setActivities((prev) => [...prev, newActivity]);

//           // Refetch activities to sync with server
//           try {
//             setActivitiesLoading(true);
//             const activitiesData = await getClientLeadActivitiesByLeadId(
//               leadId
//             );

//             console.log("ClientLead activities:", activitiesData);
//             setActivities(Array.isArray(activitiesData) ? activitiesData : []);
//           } catch (err) {
//             setActivitiesError(err.message || "Failed to fetch activities");
//             console.error("Activities fetch error:", err);
//           } finally {
//             setActivitiesLoading(false);
//           }
//         }
//       }
//     } catch (error) {
//       toast.error("Failed to add reminder");
//       console.error("Error adding reminder:", error);
//     } finally {
//       setAddingNote(false);
//       setReminderModalOpen(false);
//     }
//   };

//   const handleDeleteActivity = (activityId) => {
//     confirmDelete(
//       async () => {
//         setDeletingActivityId(activityId);
//         const token = localStorage.getItem("token");
//         if (!token) {
//           throw new Error("Authentication token missing");
//         }
//         await deleteLeadActivityById(activityId, token);
//         setActivities((prev) =>
//           prev.filter((activity) => activity.id !== activityId)
//         );
//         toast.success("Activity deleted successfully");
//       },
//       () => setDeletingActivityId(null),
//       "activity"
//     );
//   };

//   const handleTemplateChange = (e) => {
//     const templateServiceName = e.target.value;
//     setSelectedTemplate(templateServiceName);

//     if (templateServiceName) {
//       try {
//         const template = emailTemplates.find(
//           (t) => t.serviceName === templateServiceName
//         );
//         if (template && template.bodyTemplate) {
//           const blocksFromHTML = convertFromHTML(template.bodyTemplate);
//           const contentState = ContentState.createFromBlockArray(
//             blocksFromHTML.contentBlocks,
//             blocksFromHTML.entityMap
//           );
//           setEditorState(EditorState.createWithContent(contentState));
//           setSelectedTemplateId(template.id);
//         } else {
//           setEditorState(EditorState.createEmpty());
//           setSelectedTemplateId(null);
//           setError(template ? "Template has no content" : "Template not found");
//           toast.error(
//             template ? "Template has no content" : "Template not found"
//           );
//         }
//       } catch (err) {
//         setError(err.message || "Failed to load template content");
//         toast.error(err.message || "Failed to load template content");
//         setEditorState(EditorState.createEmpty());
//         setSelectedTemplateId(null);
//       }
//     } else {
//       setEditorState(EditorState.createEmpty());
//       setSelectedTemplateId(null);
//     }
//   };

//   const handleSendEmail = async () => {
//     if (!selectedTemplate) {
//       setError("Please select an email template");
//       toast.error("Please select an email template");
//       return;
//     }

//     try {
//       setEmailSending(true);
//       setError(null);

//       const response = await sendEmailToLead(
//         parseInt(leadId),
//         selectedTemplate,
//         lead.leadData
//       );

//       toast.success(response.message || "Email sent successfully");
//       setSelectedTemplate("");
//       setEditorState(EditorState.createEmpty());
//       setSelectedTemplateId(null);

//       // Optimistically add activity (for admins)
//       if (isAdmin) {
//         const newActivity = {
//           id: `temp-${Date.now()}`,
//           action: "email_sent",
//           details: `Email sent using template "${selectedTemplate}"`,
//           clientLeadId: parseInt(leadId),
//           performedBy: currentUser.id,
//           performedByUser: {
//             firstname: currentUser.firstname,
//             lastname: currentUser.lastname,
//             email: currentUser.email,
//           },
//           createdAt: new Date().toISOString(),
//           ClientLead: { orderId: lead.orderId || "N/A" },
//         };
//         setActivities((prev) => [...prev, newActivity]);

//         // Refetch activities to sync with server
//         try {
//           setActivitiesLoading(true);
//           const activitiesData = await getClientLeadActivitiesByLeadId(leadId);

//           console.log("ClientLead activities:", activitiesData);
//           setActivities(Array.isArray(activitiesData) ? activitiesData : []);
//         } catch (err) {
//           setActivitiesError(err.message || "Failed to fetch activities");
//           console.error("Activities fetch error:", err);
//         } finally {
//           setActivitiesLoading(false);
//         }
//       }
//     } catch (err) {
//       setError(err.message || "Failed to send email");
//       toast.error(err.message || "Failed to send email");
//     } finally {
//       setEmailSending(false);
//     }
//   };

//   const handleSaveTemplate = async () => {
//     if (!selectedTemplate || !selectedTemplateId) {
//       setError("Please select a template to save");
//       toast.error("Please select a template to save");
//       return;
//     }

//     try {
//       setTemplateSaving(true);
//       setError(null);
//       const updatedContent = draftToHtml(
//         convertToRaw(editorState.getCurrentContent())
//       );
//       const template = emailTemplates.find(
//         (t) => t.serviceName === selectedTemplate
//       );
//       await updateEmailTemplate(selectedTemplateId, {
//         name: template.name,
//         subjectTemplate: template.subjectTemplate,
//         bodyTemplate: updatedContent,
//       });
//       toast.success("Template updated successfully");
//       const templates = await getEmailTemplates();
//       setEmailTemplates(templates);
//     } catch (err) {
//       setError(err.message || "Failed to save template");
//       toast.error(err.message || "Failed to save template");
//     } finally {
//       setTemplateSaving(false);
//     }
//   };

//   const handleDeleteNote = (noteId) => {
//     confirmDelete(
//       async () => {
//         setDeletingNoteId(noteId);
//         const token = localStorage.getItem("token");
//         if (!token) {
//           throw new Error("Authentication token missing");
//         }
//         await deleteNote(noteId, token);
//         setAllNotes((prev) => prev.filter((note) => note.id !== noteId));
//         setNotes((prev) => prev.filter((note) => note.id !== noteId));
//         toast.success("Note deleted successfully");

//         // Optimistically add activity (for admins)
//         if (isAdmin) {
//           const newActivity = {
//             id: `temp-${Date.now()}`,
//             action: "note_deleted",
//             details: `Note ID ${noteId} deleted`,
//             clientLeadId: parseInt(leadId),
//             performedBy: currentUser.id,
//             performedByUser: {
//               firstname: currentUser.firstname,
//               lastname: currentUser.lastname,
//               email: currentUser.email,
//             },
//             createdAt: new Date().toISOString(),
//             ClientLead: { orderId: lead.orderId || "N/A" },
//           };
//           setActivities((prev) => [...prev, newActivity]);

//           // Refetch activities to sync with server
//           try {
//             setActivitiesLoading(true);
//             const activitiesData = await getClientLeadActivitiesByLeadId(
//               leadId
//             );

//             console.log("ClientLead activities:", activitiesData);
//             setActivities(Array.isArray(activitiesData) ? activitiesData : []);
//           } catch (err) {
//             setActivitiesError(err.message || "Failed to fetch activities");
//             console.error("Activities fetch error:", err);
//           } finally {
//             setActivitiesLoading(false);
//           }
//         }
//       },
//       () => setDeletingNoteId(null),
//       "note"
//     );
//   };

//   const formatDate = (dateString) => {
//     return dateString ? new Date(dateString).toLocaleString() : "N/A";
//   };

//   const breadcrumbItems = [
//     { title: "Dashboard", link: "/" },
//     { title: "Leads", link: "/lead-index" },
//     { title: `Client Lead #${leadId}`, link: "#" },
//   ];

//   if (loading) {
//     return (
//       <div className="page-content">
//         <Container fluid>
//           <Breadcrumbs
//             title={`Client Lead #${leadId}`}
//             breadcrumbItems={breadcrumbItems}
//           />
//           <Card>
//             <CardBody
//               className="d-flex justify-content-center align-items-center"
//               style={{ minHeight: "300px" }}
//             >
//               <Spinner color="primary" />
//             </CardBody>
//           </Card>
//         </Container>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="page-content">
//         <Container fluid>
//           <Breadcrumbs
//             title={`Client Lead #${leadId}`}
//             breadcrumbItems={breadcrumbItems}
//           />
//           <Card>
//             <CardBody>
//               <Alert color="danger">{error}</Alert>
//               <Button color="primary" onClick={() => navigate(-1)}>
//                 Go Back
//               </Button>
//             </CardBody>
//           </Card>
//         </Container>
//       </div>
//     );
//   }

//   const formatLabel = (key) =>
//     key
//       .split("_")
//       .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
//       .join(" ");

//   const leadFields = lead?.leadData
//     ? Object.entries(lead.leadData).filter(
//         ([key]) => !["reason", "status"].includes(key)
//       )
//     : [];

//   return (
//     <div className="page-content">
//       <Container fluid>
//         <Breadcrumbs
//           title={`Client Lead #${leadId}`}
//           breadcrumbItems={breadcrumbItems}
//         />
//         <Card>
//           <CardBody className="p-3">
//             <div className="d-flex justify-content-between align-items-center mb-2">
//               <h6 className="mb-0 small">Client Lead #{leadId}</h6>
//               <Button color="light" size="sm" onClick={() => navigate(-1)}>
//                 ← Back
//               </Button>
//             </div>

//             <Nav tabs className="mb-3">
//               {["details", "notes", "reminder"]
//                 .concat(lead?.leadData?.email ? ["email"] : [])
//                 .concat(isAdmin ? ["activities"] : [])
//                 .map((tab) => (
//                   <NavItem key={tab}>
//                     <NavLink
//                       className={`fw-bold text-dark ${
//                         activeTab === tab
//                           ? "active bg-light border rounded-top"
//                           : ""
//                       }`}
//                       onClick={() => setActiveTab(tab)}
//                       style={{
//                         cursor: "pointer",
//                         fontSize: "0.8rem",
//                         padding: "6px 12px",
//                       }}
//                     >
//                       {tab === "details"
//                         ? "Lead Details"
//                         : tab === "activities"
//                         ? "Activities"
//                         : tab.charAt(0).toUpperCase() + tab.slice(1)}
//                     </NavLink>
//                   </NavItem>
//                 ))}
//             </Nav>

//             {error && (
//               <Alert color="danger" className="py-2 px-3 small">
//                 {error}
//               </Alert>
//             )}

//             <TabContent
//               activeTab={activeTab}
//               className="p-2 border border-top-0"
//             >
//               <TabPane tabId="details">
//                 <Row>
//                   <Col md={6}>
//                     <h6 className="mb-2 small">Lead Info</h6>
//                     <Table bordered size="sm" className="mb-3">
//                       <tbody>
//                         {leadFields.map(([key, value]) => (
//                           <tr key={key}>
//                             <th
//                               scope="row"
//                               className="small"
//                               style={{ width: "30%" }}
//                             >
//                               {formatLabel(key)}
//                             </th>
//                             <td className="small">{value || "N/A"}</td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </Table>
//                   </Col>
//                   <Col md={6}>
//                     <h6 className="mb-2 small">Status Info</h6>
//                     <Table bordered size="sm" className="mb-3">
//                       <tbody>
//                         <tr>
//                           <th className="small">Order ID</th>
//                           <td className="small">{lead.orderId || "N/A"}</td>
//                         </tr>
//                         <tr>
//                           <th className="small">Lead Created</th>
//                           <td className="small">
//                             {formatDate(lead.createdAt)}
//                           </td>
//                         </tr>
//                         <tr>
//                           <th className="small">Lead Updated</th>
//                           <td className="small">
//                             {formatDate(lead.updatedAt)}
//                           </td>
//                         </tr>
//                       </tbody>
//                     </Table>
//                   </Col>
//                 </Row>
//               </TabPane>

//               <TabPane tabId="notes">
//                 <div className="d-flex justify-content-between align-items-center mb-2">
//                   <h6 className="mb-0 small">Notes</h6>
//                   <Button
//                     color="primary"
//                     size="sm"
//                     onClick={() => setNoteModalOpen(true)}
//                     style={{ fontSize: "0.8rem", padding: "4px 8px" }}
//                   >
//                     Add Note
//                   </Button>
//                 </div>
//                 {notesLoading ? (
//                   <div className="text-center py-2">
//                     <Spinner size="sm" color="primary" /> Loading...
//                   </div>
//                 ) : notes.length > 0 ? (
//                   <div style={{ maxHeight: "200px", overflowY: "auto" }}>
//                     {notes.map((note) => (
//                       <Card key={note.id} className="mb-2 border-0 bg-light">
//                         <CardBody className="p-2">
//                           <div className="d-flex justify-content-between align-items-start">
//                             <div style={{ flex: "1 1 auto" }}>
//                               <small>{note.content}</small>
//                               <div className="text-muted small mt-1">
//                                 By {note.creator?.firstname || "N/A"}{" "}
//                                 {note.creator?.lastname || ""}
//                               </div>
//                             </div>
//                             <div
//                               className="d-flex align-items-center"
//                               style={{ gap: "8px" }}
//                             >
//                               <small
//                                 className="text-muted"
//                                 style={{ whiteSpace: "nowrap" }}
//                               >
//                                 {formatDate(note.createdAt)}
//                               </small>
//                               <Button
//                                 color="danger"
//                                 size="sm"
//                                 onClick={() => handleDeleteNote(note.id)}
//                                 disabled={deletingNoteId === note.id}
//                                 title="Delete note"
//                                 style={{ padding: "2px 6px" }}
//                               >
//                                 {deletingNoteId === note.id ? (
//                                   <Spinner size="sm" />
//                                 ) : (
//                                   <FaTrash />
//                                 )}
//                               </Button>
//                             </div>
//                           </div>
//                         </CardBody>
//                       </Card>
//                     ))}
//                   </div>
//                 ) : (
//                   <Alert color="info" className="py-2 px-3 small">
//                     No notes found.
//                   </Alert>
//                 )}
//               </TabPane>

//               <TabPane tabId="reminder">
//                 <div className="d-flex justify-content-between align-items-center mb-2">
//                   <h6 className="mb-0 small">Reminders</h6>
//                   <Button
//                     color="primary"
//                     size="sm"
//                     onClick={() => setReminderModalOpen(true)}
//                     style={{ fontSize: "0.8rem", padding: "4px 8px" }}
//                   >
//                     Add Reminder
//                   </Button>
//                 </div>
//                 {notesLoading ? (
//                   <div className="text-center py-2">
//                     <Spinner size="sm" color="primary" /> Loading reminders...
//                   </div>
//                 ) : allNotes.filter((note) => note.type === "reminder").length >
//                   0 ? (
//                   <div style={{ maxHeight: "200px", overflowY: "auto" }}>
//                     {allNotes
//                       .filter((note) => note.type === "reminder")
//                       .map((note) => (
//                         <Card
//                           key={note.id}
//                           className="mb-2 border-0 bg-warning-subtle"
//                         >
//                           <CardBody className="p-2">
//                             <div className="d-flex justify-content-between align-items-center">
//                               <div>
//                                 <small>{note.content}</small>
//                               </div>
//                               <div className="d-flex align-items-center gap-1">
//                                 <Badge color="info" pill className="me-1 small">
//                                   {note.title || "General"}
//                                 </Badge>
//                                 <Button
//                                   color="danger"
//                                   size="sm"
//                                   onClick={() => handleDeleteNote(note.id)}
//                                   disabled={deletingNoteId === note.id}
//                                   title="Delete reminder"
//                                   style={{ padding: "2px 6px" }}
//                                 >
//                                   {deletingNoteId === note.id ? (
//                                     <Spinner size="sm" />
//                                   ) : (
//                                     <FaTrash />
//                                   )}
//                                 </Button>
//                               </div>
//                             </div>
//                             <div className="text-muted small mt-1">
//                               Due: {formatDate(note.datetime)} | Created by{" "}
//                               {note.creator?.firstname || "System"}{" "}
//                               {note.creator?.lastname || ""}
//                             </div>
//                           </CardBody>
//                         </Card>
//                       ))}
//                   </div>
//                 ) : (
//                   <Alert color="info" className="py-2 px-3 small">
//                     No reminders found.
//                   </Alert>
//                 )}
//               </TabPane>

//               <TabPane tabId="email">
//                 <h6 className="mb-2 small">Email Templates</h6>
//                 {notesLoading && emailTemplates.length === 0 ? (
//                   <Spinner size="sm" color="primary" />
//                 ) : (
//                   <>
//                     <FormGroup>
//                       <Label className="small">Select Template</Label>
//                       <Input
//                         type="select"
//                         value={selectedTemplate}
//                         onChange={handleTemplateChange}
//                         className="form-select-sm"
//                         style={{ fontSize: "0.8rem", padding: "4px 8px" }}
//                       >
//                         <option value="">-- Select Template --</option>
//                         {emailTemplates.map((template) => (
//                           <option
//                             key={template.id}
//                             value={template.serviceName}
//                           >
//                             {template.name}
//                           </option>
//                         ))}
//                       </Input>
//                     </FormGroup>
//                     {selectedTemplate && (
//                       <FormGroup>
//                         <Label className="small">Edit Email Content</Label>
//                         <div
//                           style={{
//                             border: "1px solid #dee2e6",
//                             padding: "5px",
//                             borderRadius: "2px",
//                             minHeight: "200px",
//                           }}
//                         >
//                           <Editor
//                             editorState={editorState}
//                             onEditorStateChange={setEditorState}
//                             toolbar={{
//                               options: [
//                                 "inline",
//                                 "blockType",
//                                 "fontSize",
//                                 "list",
//                                 "textAlign",
//                                 "link",
//                                 "emoji",
//                                 "remove",
//                                 "history",
//                               ],
//                               inline: {
//                                 inDropdown: true,
//                                 options: [
//                                   "bold",
//                                   "italic",
//                                   "underline",
//                                   "strikethrough",
//                                 ],
//                               },
//                               blockType: {
//                                 inDropdown: true,
//                                 options: [
//                                   "Normal",
//                                   "H1",
//                                   "H2",
//                                   "H3",
//                                   "Blockquote",
//                                 ],
//                               },
//                               fontSize: {
//                                 options: [
//                                   8, 9, 10, 11, 12, 14, 16, 18, 24, 30, 36, 48,
//                                 ],
//                               },
//                               list: {
//                                 inDropdown: true,
//                                 options: ["unordered", "ordered"],
//                               },
//                               textAlign: {
//                                 inDropdown: true,
//                                 options: ["left", "center", "right", "justify"],
//                               },
//                               link: {
//                                 inDropdown: true,
//                                 options: ["link", "unlink"],
//                               },
//                             }}
//                             editorStyle={{
//                               minHeight: "200px",
//                               padding: "0 10px",
//                             }}
//                           />
//                         </div>
//                       </FormGroup>
//                     )}
//                     <Button
//                       color="primary"
//                       size="sm"
//                       onClick={handleSendEmail}
//                       disabled={
//                         emailSending ||
//                         !selectedTemplate ||
//                         !leadId ||
//                         !lead?.leadData?.email
//                       }
//                       style={{
//                         fontSize: "0.8rem",
//                         padding: "4px 10px",
//                         marginRight: "10px",
//                       }}
//                     >
//                       {emailSending ? <Spinner size="sm" /> : "Send Email"}
//                     </Button>
//                     {selectedTemplate && (
//                       <Button
//                         color="primary"
//                         size="sm"
//                         onClick={handleSaveTemplate}
//                         disabled={templateSaving || !selectedTemplateId}
//                         style={{ fontSize: "0.8rem", padding: "4px 10px" }}
//                       >
//                         {templateSaving ? (
//                           <Spinner size="sm" />
//                         ) : (
//                           "Save Template"
//                         )}
//                       </Button>
//                     )}
//                   </>
//                 )}
//               </TabPane>

//               {isAdmin && (
//                 <TabPane tabId="activities">
//                   <h6 className="mb-3 small">📜 Client Lead Activities</h6>
//                   {activitiesLoading ? (
//                     <div className="text-center py-3">
//                       <Spinner size="sm" color="info" /> Loading activities...
//                     </div>
//                   ) : activitiesError ? (
//                     <Alert color="danger" className="py-2 px-3 small mb-0">
//                       {activitiesError}
//                     </Alert>
//                   ) : activities.length > 0 ? (
//                     <div style={{ maxHeight: "350px", overflowY: "auto" }}>
//                       <Table
//                         bordered
//                         hover
//                         responsive
//                         size="sm"
//                         className="mb-0"
//                         style={{ fontSize: "0.75rem" }}
//                       >
//                         <thead className="table-light">
//                           <tr>
//                             <th style={{ width: "8%" }}>Action</th>
//                             <th
//                               style={{
//                                 width: "25%",
//                                 whiteSpace: "nowrap",
//                                 overflow: "hidden",
//                                 textOverflow: "ellipsis",
//                               }}
//                             >
//                               Details
//                             </th>
//                             <th style={{ width: "5%" }}>Lead ID</th>
//                             <th style={{ width: "15%" }}>Performed By</th>
//                             <th
//                               style={{
//                                 width: "18%",
//                                 whiteSpace: "nowrap",
//                                 overflow: "hidden",
//                                 textOverflow: "ellipsis",
//                               }}
//                             >
//                               Email
//                             </th>
//                             <th style={{ width: "15%" }}>Reference</th>
//                             <th style={{ width: "12%" }}>Created At</th>
//                             <th style={{ width: "5%" }}>Delete</th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {activities.map((activity, index) => (
//                             <tr
//                               key={activity.id}
//                               className={index % 2 === 0 ? "table-light" : ""}
//                               style={{ fontSize: "0.75rem" }}
//                             >
//                               <td>
//                                 <span
//                                   className={`badge ${
//                                     activity.action.includes("note")
//                                       ? "bg-warning text-dark"
//                                       : activity.action.includes("reminder")
//                                       ? "bg-info"
//                                       : activity.action.includes("email")
//                                       ? "bg-success"
//                                       : "bg-secondary"
//                                   }`}
//                                   style={{ textTransform: "capitalize" }}
//                                 >
//                                   {activity.action.replace(/_/g, " ")}
//                                 </span>
//                               </td>
//                               <td
//                                 title={activity.details}
//                                 style={{
//                                   whiteSpace: "nowrap",
//                                   overflow: "hidden",
//                                   textOverflow: "ellipsis",
//                                 }}
//                               >
//                                 {activity.details || "N/A"}
//                               </td>
//                               <td>
//                                 {activity.clientLeadId ||
//                                   activity.leadId ||
//                                   "N/A"}
//                               </td>
//                               <td>
//                                 {(activity.performedByUser?.firstname ||
//                                   "User") +
//                                   " " +
//                                   (activity.performedByUser?.lastname ||
//                                     "")}{" "}
//                                 <small className="text-muted">
//                                   #{activity.performedBy}
//                                 </small>
//                               </td>
//                               <td
//                                 title={activity.performedByUser?.email}
//                                 style={{
//                                   whiteSpace: "nowrap",
//                                   overflow: "hidden",
//                                   textOverflow: "ellipsis",
//                                 }}
//                               >
//                                 {activity.performedByUser?.email || "N/A"}
//                               </td>
//                               <td>
//                                 {activity.ClientLead?.orderId ||
//                                   activity.Lead?.campaignName ||
//                                   "N/A"}
//                               </td>
//                               <td>{formatDate(activity.createdAt)}</td>
//                               <td>
//                                 <Button
//                                   color="danger"
//                                   size="sm"
//                                   onClick={() =>
//                                     handleDeleteActivity(activity.id)
//                                   }
//                                   disabled={deletingActivityId === activity.id}
//                                   title="Delete activity"
//                                 >
//                                   {deletingActivityId === activity.id ? (
//                                     <Spinner size="sm" />
//                                   ) : (
//                                     <FaTrash />
//                                   )}
//                                 </Button>
//                               </td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </Table>
//                     </div>
//                   ) : (
//                     <Alert color="info" className="py-2 px-3 small mb-0">
//                       No activities found for this client lead.
//                     </Alert>
//                   )}
//                 </TabPane>
//               )}
//             </TabContent>

//             <Modal
//               isOpen={noteModalOpen}
//               toggle={() => setNoteModalOpen(!noteModalOpen)}
//             >
//               <ModalHeader toggle={() => setNoteModalOpen(false)}>
//                 Add Note
//               </ModalHeader>
//               <ModalBody>
//                 <Form
//                   onSubmit={(e) => {
//                     e.preventDefault();
//                     handleAddNote();
//                   }}
//                 >
//                   <FormGroup>
//                     <Label for="newNote">Note</Label>
//                     <Input
//                       type="textarea"
//                       id="newNote"
//                       rows={3}
//                       value={newNote}
//                       onChange={(e) => setNewNote(e.target.value)}
//                       placeholder="Type a short note..."
//                       className="form-control-sm"
//                       style={{ fontSize: "0.8rem" }}
//                     />
//                   </FormGroup>
//                   <ModalFooter>
//                     <Button
//                       color="primary"
//                       type="submit"
//                       size="sm"
//                       disabled={addingNote}
//                       style={{ fontSize: "0.8rem", padding: "4px 8px" }}
//                     >
//                       {addingNote ? <Spinner size="sm" /> : "Add Note"}
//                     </Button>
//                     <Button
//                       color="secondary"
//                       size="sm"
//                       onClick={() => setNoteModalOpen(false)}
//                       style={{ fontSize: "0.8rem", padding: "4px 8px" }}
//                     >
//                       Cancel
//                     </Button>
//                   </ModalFooter>
//                 </Form>
//               </ModalBody>
//             </Modal>

//             <Modal
//               isOpen={reminderModalOpen}
//               toggle={() => setReminderModalOpen(!reminderModalOpen)}
//             >
//               <ModalHeader toggle={() => setReminderModalOpen(false)}>
//                 Add Reminder
//               </ModalHeader>
//               <ModalBody>
//                 <Form
//                   onSubmit={(e) => {
//                     e.preventDefault();
//                     handleAddReminder();
//                   }}
//                 >
//                   <FormGroup>
//                     <Label for="reminderTitle">Title *</Label>
//                     <Input
//                       type="text"
//                       id="reminderTitle"
//                       placeholder="Enter title"
//                       value={reminder.title}
//                       onChange={(e) =>
//                         setReminder({ ...reminder, title: e.target.value })
//                       }
//                       className="form-control-sm"
//                       style={{ fontSize: "0.8rem" }}
//                     />
//                   </FormGroup>
//                   <FormGroup>
//                     <Label for="reminderDescription">Description</Label>
//                     <Input
//                       type="textarea"
//                       id="reminderDescription"
//                       placeholder="Description..."
//                       value={reminder.description}
//                       onChange={(e) =>
//                         setReminder({
//                           ...reminder,
//                           description: e.target.value,
//                         })
//                       }
//                       className="form-control-sm"
//                       style={{ fontSize: "0.8rem" }}
//                     />
//                   </FormGroup>
//                   <FormGroup>
//                     <Label for="reminderDate" className="small">
//                       Date / Time
//                     </Label>
//                     <Input
//                       type="datetime-local"
//                       id="reminderDate"
//                       value={reminder.datetime}
//                       onChange={(e) =>
//                         setReminder({ ...reminder, datetime: e.target.value })
//                       }
//                       className="form-control-sm"
//                       style={{ fontSize: "0.8rem" }}
//                     />
//                   </FormGroup>
//                   <ModalFooter>
//                     <Button
//                       color="primary"
//                       type="submit"
//                       size="sm"
//                       disabled={
//                         addingNote ||
//                         !reminder.title.trim() ||
//                         !reminder.description.trim()
//                       }
//                       style={{ fontSize: "0.8rem", padding: "4px 8px" }}
//                     >
//                       {addingNote ? <Spinner size="sm" /> : "Add Reminder"}
//                     </Button>
//                     <Button
//                       color="secondary"
//                       size="sm"
//                       onClick={() => setReminderModalOpen(false)}
//                       style={{ fontSize: "0.8rem", padding: "4px 8px" }}
//                     >
//                       Cancel
//                     </Button>
//                   </ModalFooter>
//                 </Form>
//               </ModalBody>
//             </Modal>
//           </CardBody>
//         </Card>
//       </Container>
//     </div>
//   );
// };

// export default ClientLeadDetailPage;

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
import { sendEmailToClientLead } from "../../services/emailService"; // Updated import
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

  useEffect(() => {
    const fetchLeadDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!leadId) {
          throw new Error("Lead ID is missing");
        }

        const response = await getAllClientLeads(1, 10, orderId);
        console.log("clientlead response", response);
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
            console.log("ClientLead activities:", activities);
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

      console.log("Attempting to add note with data:", noteData);
      const response = await addNote(noteData);
      console.log("Add note response:", response);

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
            console.log("Refetched activities after note:", activities);
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
      const noteData = {
        content: reminder.description,
        type: "reminder",
        title: reminder.title,
        datetime: reminder.datetime,
        notebleId: parseInt(leadId),
        notebleType: "client_lead",
      };

      const response = await addNote(noteData);
      const addedReminder = response.note || response.data || response;

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
            console.log("ClientLead activities:", activitiesData);
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
        toast.success("Activity deleted successfully");
      },
      () => setDeletingActivityId(null),
      "activity"
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
          console.log("ClientLead activities:", activitiesData);
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
        toast.success("Note deleted successfully");

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
            console.log("ClientLead activities:", activitiesData);
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
                ) : allNotes.filter((note) => note.type === "reminder").length >
                  0 ? (
                  <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                    {allNotes
                      .filter((note) => note.type === "reminder")
                      .map((note) => (
                        <Card
                          key={note.id}
                          className="mb-2 border-0 bg-warning-subtle"
                        >
                          <CardBody className="p-2">
                            <div className="d-flex justify-content-between align-items-center">
                              <div>
                                <small>{note.content}</small>
                              </div>
                              <div className="d-flex align-items-center gap-1">
                                <Badge color="info" pill className="me-1 small">
                                  {note.title || "General"}
                                </Badge>
                                <Button
                                  color="danger"
                                  size="sm"
                                  onClick={() => handleDeleteNote(note.id)}
                                  disabled={deletingNoteId === note.id}
                                  title="Delete reminder"
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
                            <div className="text-muted small mt-1">
                              Due: {formatDate(note.datetime)} | Created by{" "}
                              {note.creator?.firstname || "System"}{" "}
                              {note.creator?.lastname || ""}
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
                                  activity.leadId ||
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
