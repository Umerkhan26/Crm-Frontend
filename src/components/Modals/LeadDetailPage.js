// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
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
// import { fetchAllLeads } from "../../services/leadService";
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

// const MasterLeadDetailPage = () => {
//   const { leadId } = useParams();
//   const navigate = useNavigate();
//   const { confirmDelete } = useDeleteConfirmation();
//   const currentUser = useSelector((state) => state.Login?.user);
//   // const isAdmin = hasAnyPermission(currentUser, ["user:get"]);
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
//   const [reminders, setReminders] = useState([]);

//   useEffect(() => {
//     const fetchLeadDetails = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         if (!leadId) {
//           throw new Error("Lead ID is missing");
//         }

//         const response = await fetchAllLeads(1, 10, "");
//         const leads = Array.isArray(response.data) ? response.data : [];
//         const leadData = leads.find((lead) => lead.id === parseInt(leadId));

//         if (!leadData) {
//           throw new Error("Lead not found");
//         }

//         const leadDataParsed =
//           typeof leadData.leadData === "string"
//             ? JSON.parse(leadData.leadData)
//             : leadData.leadData || {};
//         setLead({
//           ...leadData,
//           leadData: leadDataParsed,
//           assignedTo: leadData.assignees?.length
//             ? leadData.assignees
//                 .map((a) => `${a.firstname} ${a.lastname}`)
//                 .join(", ")
//             : "Unassigned",
//         });

//         // Fetch notes
//         setNotesLoading(true);
//         const notesResponse = await getNotes(leadId, "lead");
//         setAllNotes(notesResponse.notes || []);
//         setNotes(
//           notesResponse.notes?.filter((note) => note.type === "comment") || []
//         );
//         setReminders(
//           notesResponse.notes?.filter((note) => note.type === "reminder") || []
//         );

//         // Fetch email templates
//         const templates = await getEmailTemplates();
//         setEmailTemplates(templates);
//       } catch (err) {
//         setError(err.message || "Failed to fetch lead details");
//         toast.error(err.message || "Failed to load lead details");
//       } finally {
//         setLoading(false);
//         setNotesLoading(false);
//       }
//     };

//     fetchLeadDetails();
//   }, [leadId]);

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
//         notebleType: "lead",
//       };

//       const response = await addNote(noteData);
//       const addedNote = response.note || response.data || response;

//       if (addedNote) {
//         setAllNotes((prev) => [...prev, addedNote]);
//         setNotes((prev) => [...prev, addedNote]);
//         setNewNote("");
//         toast.success("Note added successfully");
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
//         notebleType: "lead",
//       };

//       const response = await addNote(noteData);
//       const addedReminder = response.note || response.data || response;

//       if (addedReminder) {
//         setAllNotes((prev) => [...prev, addedReminder]);
//         setReminders((prev) => [...prev, addedReminder]);
//         setReminder({
//           title: "",
//           description: "",
//           datetime: new Date().toISOString().slice(0, 16),
//         });
//         toast.success("Reminder added successfully");
//       }
//     } catch (error) {
//       toast.error("Failed to add reminder");
//       console.error("Error adding reminder:", error);
//     } finally {
//       setAddingNote(false);
//       setReminderModalOpen(false);
//     }
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
//     { title: "Leads", link: "/master-lead-index" },
//     { title: `Master Lead #${leadId}`, link: "#" },
//   ];

//   if (loading) {
//     return (
//       <div className="page-content">
//         <Container fluid>
//           <Breadcrumbs
//             title={`Master Lead #${leadId}`}
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
//             title={`Master Lead #${leadId}`}
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
//           title={`Master Lead #${leadId}`}
//           breadcrumbItems={breadcrumbItems}
//         />
//         <Card>
//           <CardBody className="p-3">
//             <div className="d-flex justify-content-between align-items-center mb-2">
//               <h6 className="mb-0 small">Master Lead #{leadId}</h6>
//               <Button color="light" size="sm" onClick={() => navigate(-1)}>
//                 ← Back
//               </Button>
//             </div>

//             <Nav tabs className="mb-3">
//               {["details", "notes", "reminder"]
//                 .concat(lead?.leadData?.email ? ["email"] : [])
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
//                           <th className="small">Campaign Name</th>
//                           <td className="small">
//                             {lead.campaignName || "N/A"}
//                           </td>
//                         </tr>
//                         <tr>
//                           <th className="small">Assigned To</th>
//                           <td className="small">{lead.assignedTo || "N/A"}</td>
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

// export default MasterLeadDetailPage;

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import { sendEmailToLead } from "../../services/emailService";
import { fetchAllLeads } from "../../services/leadService";
import { FaTrash } from "react-icons/fa";
import useDeleteConfirmation from "./DeleteConfirmation";
import { useSelector } from "react-redux";
import { hasAnyPermission } from "../../utils/permissions";
import {
  getEmailTemplates,
  updateEmailTemplate,
} from "../../services/emailTemplateService";
import {
  EditorState,
  ContentState,
  convertFromHTML,
  convertToRaw,
} from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const MasterLeadDetailPage = () => {
  const { leadId } = useParams();
  const navigate = useNavigate();
  const { confirmDelete } = useDeleteConfirmation();
  const currentUser = useSelector((state) => state.Login?.user);
  // const isAdmin = hasAnyPermission(currentUser, ["user:get"]);
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

        const response = await fetchAllLeads(1, 10, "");
        const leads = Array.isArray(response.data) ? response.data : [];
        const leadData = leads.find((lead) => lead.id === parseInt(leadId));

        if (!leadData) {
          throw new Error("Lead not found");
        }

        const leadDataParsed =
          typeof leadData.leadData === "string"
            ? JSON.parse(leadData.leadData)
            : leadData.leadData || {};
        setLead({
          ...leadData,
          leadData: leadDataParsed,
          assignedTo: leadData.assignees?.length
            ? leadData.assignees
                .map((a) => `${a.firstname} ${a.lastname}`)
                .join(", ")
            : "Unassigned",
        });

        // Fetch notes
        setNotesLoading(true);
        const notesResponse = await getNotes(leadId, "lead");
        setAllNotes(notesResponse.notes || []);
        setNotes(
          notesResponse.notes?.filter((note) => note.type === "comment") || []
        );
        setReminders(
          notesResponse.notes?.filter((note) => note.type === "reminder") || []
        );

        // Fetch email templates
        const templates = await getEmailTemplates();
        setEmailTemplates(templates);
      } catch (err) {
        setError(err.message || "Failed to fetch lead details");
        toast.error(err.message || "Failed to load lead details");
      } finally {
        setLoading(false);
        setNotesLoading(false);
      }
    };

    fetchLeadDetails();
  }, [leadId]);

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
        notebleType: "lead",
      };

      const response = await addNote(noteData);
      const addedNote = response.note || response.data || response;

      if (addedNote) {
        setAllNotes((prev) => [...prev, addedNote]);
        setNotes((prev) => [...prev, addedNote]);
        setNewNote("");
        toast.success("Note added successfully");
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
        notebleType: "lead",
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
      }
    } catch (error) {
      toast.error("Failed to add reminder");
      console.error("Error adding reminder:", error);
    } finally {
      setAddingNote(false);
      setReminderModalOpen(false);
    }
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

      const response = await sendEmailToLead(
        parseInt(leadId),
        selectedTemplate,
        lead.leadData
      );

      toast.success(response.message || "Email sent successfully");
      setSelectedTemplate("");
      setEditorState(EditorState.createEmpty());
      setSelectedTemplateId(null);
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
      },
      () => setDeletingReminderId(null),
      "reminder"
    );
  };

  const formatDate = (dateString) => {
    return dateString ? new Date(dateString).toLocaleString() : "N/A";
  };

  const breadcrumbItems = [
    { title: "Dashboard", link: "/" },
    { title: "Leads", link: "/master-lead-index" },
    { title: `Master Lead #${leadId}`, link: "#" },
  ];

  if (loading) {
    return (
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title={`Master Lead #${leadId}`}
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
            title={`Master Lead #${leadId}`}
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
          title={`Master Lead #${leadId}`}
          breadcrumbItems={breadcrumbItems}
        />
        <Card>
          <CardBody className="p-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="mb-0 small">Master Lead #{leadId}</h6>
              <Button color="light" size="sm" onClick={() => navigate(-1)}>
                ← Back
              </Button>
            </div>

            <Nav tabs className="mb-3">
              {["details", "notes", "reminder"]
                .concat(lead?.leadData?.email ? ["email"] : [])
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
                          <th className="small">Campaign Name</th>
                          <td className="small">
                            {lead.campaignName || "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <th className="small">Assigned To</th>
                          <td className="small">{lead.assignedTo || "N/A"}</td>
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

export default MasterLeadDetailPage;
