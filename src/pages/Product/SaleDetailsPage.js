// // src/views/Sales/SaleDetails.js
// import React, { useEffect, useState } from "react";
// import {
//   Container,
//   Card,
//   CardBody,
//   Spinner,
//   Row,
//   Col,
//   Badge,
//   Button,
//   Table,
// } from "reactstrap";
// import { useParams, useNavigate } from "react-router-dom";
// import Breadcrumbs from "../../components/Common/Breadcrumb";
// import { toast } from "react-toastify";
// import { fetchSaleById } from "../../services/productService";

// const SaleDetails = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [sale, setSale] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     if (isNaN(Number(id))) {
//       toast.error("Invalid sale ID");
//       navigate("/all-sales");
//       return;
//     }

//     const getSaleDetails = async () => {
//       setIsLoading(true);
//       try {
//         const saleData = await fetchSaleById(id);
//         setSale(saleData);
//       } catch (error) {
//         console.error("Failed to fetch sale details:", error.message);
//         toast.error(error.message);
//         navigate("/all-sales");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     getSaleDetails();
//   }, [id, navigate]);

//   const breadcrumbItems = [
//     { title: "Dashboard", link: "/" },
//     { title: "Sales", link: "/all-sales" },
//     { title: "Sale Details", link: "#" },
//   ];

//   const formatDate = (date) => (date ? new Date(date).toLocaleString() : "N/A");

//   if (isLoading) {
//     return (
//       <div className="page-content">
//         <Container fluid>
//           <div className="text-center py-5">
//             <Spinner color="primary" />
//           </div>
//         </Container>
//       </div>
//     );
//   }

//   if (!sale) {
//     return (
//       <div className="page-content">
//         <Container fluid>
//           <Card>
//             <CardBody>
//               <div className="text-center py-5">
//                 <h4>Sale not found</h4>
//               </div>
//             </CardBody>
//           </Card>
//         </Container>
//       </div>
//     );
//   }

//   return (
//     <div className="page-content">
//       <Container fluid>
//         <Breadcrumbs title="Sale Details" breadcrumbItems={breadcrumbItems} />
//         <Card>
//           <CardBody>
//             <h5 className="mb-3">Sale Information</h5>
//             <Row>
//               {/* Basic Info */}
//               <Col md={6}>
//                 <Table size="sm" bordered responsive hover>
//                   <tbody>
//                     <tr>
//                       <th>ID</th>
//                       <td>{sale.id}</td>
//                     </tr>
//                     <tr>
//                       <th>Status</th>
//                       <td>
//                         <Badge
//                           color={
//                             sale.status === "converted"
//                               ? "success"
//                               : sale.status === "pending"
//                               ? "warning"
//                               : "danger"
//                           }
//                           className="text-uppercase"
//                         >
//                           {sale.status}
//                         </Badge>
//                       </td>
//                     </tr>
//                     <tr>
//                       <th>Price</th>
//                       <td>${parseFloat(sale.price || 0).toFixed(2)}</td>
//                     </tr>
//                     <tr>
//                       <th>Product Type</th>
//                       <td>{sale.productType || "N/A"}</td>
//                     </tr>
//                     <tr>
//                       <th>Notes</th>
//                       <td>{sale.notes || "N/A"}</td>
//                     </tr>
//                   </tbody>
//                 </Table>
//               </Col>

//               {/* Related Info */}
//               <Col md={6}>
//                 <Table size="sm" bordered responsive hover>
//                   <tbody>
//                     <tr>
//                       <th>Lead Campaign</th>
//                       <td>{sale.Lead?.campaignName || "N/A"}</td>
//                     </tr>
//                     <tr>
//                       <th>Created By</th>
//                       <td>
//                         {sale.User
//                           ? `${sale.User.firstname || ""} ${
//                               sale.User.lastname || ""
//                             }`
//                           : "N/A"}
//                       </td>
//                     </tr>
//                     <tr>
//                       <th>User Email</th>
//                       <td>{sale.User?.email || "N/A"}</td>
//                     </tr>
//                     <tr>
//                       <th>Conversion Date</th>
//                       <td>{formatDate(sale.conversionDate)}</td>
//                     </tr>
//                     <tr>
//                       <th>Created At</th>
//                       <td>{formatDate(sale.createdAt)}</td>
//                     </tr>
//                     <tr>
//                       <th>Updated At</th>
//                       <td>{formatDate(sale.updatedAt)}</td>
//                     </tr>
//                   </tbody>
//                 </Table>
//               </Col>
//             </Row>

//             <div className="mt-4">
//               <Button
//                 color="secondary"
//                 size="sm"
//                 onClick={() => navigate("/all-sales")}
//               >
//                 Back to Sales
//               </Button>
//             </div>
//           </CardBody>
//         </Card>
//       </Container>
//     </div>
//   );
// };

// export default SaleDetails;

// src/views/Sales/SaleDetails.js

// import React, { useEffect, useState } from "react";
// import {
//   Container,
//   Card,
//   CardBody,
//   Spinner,
//   Row,
//   Col,
//   Badge,
//   Button,
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
// } from "reactstrap";
// import { useParams, useNavigate } from "react-router-dom";
// import Breadcrumbs from "../../components/Common/Breadcrumb";
// import { toast } from "react-toastify";
// import { fetchSaleById } from "../../services/productService";
// import {
//   getNotes,
//   addNote,
//   addReminder,
//   getReminders,
//   deleteReminder,
//   deleteNote,
// } from "../../services/noteService";
// import { useSelector } from "react-redux";
// import { FaTrash } from "react-icons/fa";
// import { hasAnyPermission } from "../../utils/permissions";
// import useDeleteConfirmation from "../../components/Modals/DeleteConfirmation";

// const SaleDetails = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { confirmDelete } = useDeleteConfirmation();
//   const [sale, setSale] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [notes, setNotes] = useState([]);
//   const [notesLoading, setNotesLoading] = useState(false);
//   const [newNote, setNewNote] = useState("");
//   const [addingNote, setAddingNote] = useState(false);
//   const [deletingNoteId, setDeletingNoteId] = useState(null);
// const [reminders, setReminders] = useState([]);
// const [reminderLoading, setReminderLoading] = useState(false);
// const [reminderContent, setReminderContent] = useState("");
// const [reminderType, setReminderType] = useState("");
// const [reminderDate, setReminderDate] = useState("");
//   const [noteModalOpen, setNoteModalOpen] = useState(false);
//   const [reminderModalOpen, setReminderModalOpen] = useState(false);
//   const [deletingReminderId, setDeletingReminderId] = useState(null);
//   const currentUser = useSelector((state) => state.Login?.user);

//   useEffect(() => {
//     if (isNaN(Number(id))) {
//       toast.error("Invalid sale ID");
//       navigate("/all-sales");
//       return;
//     }

//   const getSaleDetails = async () => {
//     setIsLoading(true);
//     try {
//       console.log(`Fetching sale details for ID: ${id}`);
//       const saleData = await fetchSaleById(id);
//       console.log("Sale data received:", saleData);
//       setSale(saleData);

//       const leadId = saleData?.leadId; // get lead ID linked to the sale
//       if (!leadId) {
//         throw new Error("No leadId found for this sale");
//       }

//       // Fetch notes for this sale's lead
//       try {
//         console.log(`Fetching notes for lead ID: ${leadId}`);
//         setNotesLoading(true);
//         const notesResponse = await getNotes(leadId, "lead"); // ✅ use leadId + "lead"
//         const fetchedNotes =
//           notesResponse.notes || notesResponse.data || notesResponse || [];
//         setNotes(fetchedNotes);
//       } catch (notesError) {
//         console.error("Error fetching notes:", notesError);
//         toast.error(`Failed to load notes: ${notesError.message}`);
//         setNotes([]);
//       } finally {
//         setNotesLoading(false);
//       }

//       // Fetch reminders for this sale's lead
//       try {
//         console.log(`Fetching reminders for lead ID: ${leadId}`);
//         setReminderLoading(true);
//         const remindersResponse = await getReminders(leadId, "lead"); // ✅ use leadId + "lead"
//         const fetchedReminders =
//           remindersResponse.reminders ||
//           remindersResponse.data ||
//           remindersResponse ||
//           [];
//         setReminders(fetchedReminders);
//       } catch (remindersError) {
//         console.error("Error fetching reminders:", remindersError);
//         toast.error(`Failed to load reminders: ${remindersError.message}`);
//         setReminders([]);
//       } finally {
//         setReminderLoading(false);
//       }
//     } catch (error) {
//       console.error("Error in getSaleDetails:", error);
//       toast.error(`Failed to fetch sale details: ${error.message}`);
//       navigate("/all-sales");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   getSaleDetails();
// }, [id, navigate]);

//   const breadcrumbItems = [
//     { title: "Dashboard", link: "/" },
//     { title: "Sales", link: "/all-sales" },
//     { title: "Sale Details", link: "#" },
//   ];

//   const formatDate = (date) => (date ? new Date(date).toLocaleString() : "N/A");

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
//         notebleId: id,
//         notebleType: "sale",
//       };

//       console.log("Submitting Note:", noteData);

//       const response = await addNote(noteData);

//       const addedNote = response.note || response.data || response;
//       if (addedNote) {
//         setNotes((prev) => [...prev, addedNote]);
//         setNewNote("");
//         setNoteModalOpen(false);
//         toast.success("Note added successfully");
//       }
//     } catch (error) {
//       toast.error("Failed to add note");
//       console.error("Error adding note:", error);
//     } finally {
//       setAddingNote(false);
//     }
//   };

// const handleAddReminder = async () => {
//   if (!reminderContent || !reminderType || !reminderDate) {
//     toast.warn("All fields are required for reminder");
//     return;
//   }

//   try {
//     const parsedReminderDate = new Date(reminderDate);
//     if (isNaN(parsedReminderDate)) {
//       toast.error("Invalid reminder date");
//       return;
//     }

//     const reminderData = {
//       content: reminderContent,
//       reminderType,
//       reminderDate: parsedReminderDate,
//       notebleId: id, // fixed spelling
//       notebleType: "sale", // fixed spelling
//     };

//     console.log("Submitting Reminder:", reminderData);

//     const response = await addReminder(reminderData);

//     const newReminder = response.reminder || response.data || response;
//     if (newReminder) {
//       setReminders((prev) => [...prev, newReminder]);
//       setReminderContent("");
//       setReminderType("");
//       setReminderDate("");
//       setReminderModalOpen(false);
//       toast.success("Reminder added successfully");
//     }
//   } catch (error) {
//     toast.error("Failed to add reminder");
//     console.error("Error adding reminder:", error);
//   }
// };

//   const handleDeleteNote = async (noteId) => {
//     console.log("Deleting note with ID:", noteId, notes);
//     const token = localStorage.getItem("token");

//     await confirmDelete(
//       async () => {
//         await deleteNote(noteId, token);
//       },
//       () => {
//         setNotes((prev) => prev.filter((note) => note.id !== noteId));
//       },
//       "note"
//     );
//   };

// const handleDeleteReminder = async (reminderId) => {
//   const token = localStorage.getItem("token");

//   await confirmDelete(
//     async () => {
//       await deleteReminder(reminderId, token);
//     },
//     () => {
//       setReminders((prev) =>
//         prev.filter((reminder) => reminder.id !== reminderId)
//       );
//     },
//     "reminder"
//   );
// };

//   if (isLoading) {
//     return (
//       <div className="page-content">
//         <Container fluid>
//           <div className="text-center py-5">
//             <Spinner color="primary" />
//           </div>
//         </Container>
//       </div>
//     );
//   }

//   if (!sale) {
//     return (
//       <div className="page-content">
//         <Container fluid>
//           <Card>
//             <CardBody>
//               <div className="text-center py-5">
//                 <h4>Sale not found</h4>
//               </div>
//             </CardBody>
//           </Card>
//         </Container>
//       </div>
//     );
//   }

//   return (
//     <div className="page-content">
//       <Container fluid>
//         <Breadcrumbs title="Sale Details" breadcrumbItems={breadcrumbItems} />
//         <Card>
//           <CardBody>
//             <h5 className="mb-3">Sale Information</h5>
//             <Row>
//               {/* Basic Info */}
//               <Col md={6}>
//                 <Table size="sm" bordered responsive hover>
//                   <tbody>
//                     <tr>
//                       <th>ID</th>
//                       <td>{sale.id}</td>
//                     </tr>
//                     <tr>
//                       <th>Status</th>
//                       <td>
//                         <Badge
//                           color={
//                             sale.status === "converted"
//                               ? "success"
//                               : sale.status === "pending"
//                               ? "warning"
//                               : "danger"
//                           }
//                           className="text-uppercase"
//                         >
//                           {sale.status}
//                         </Badge>
//                       </td>
//                     </tr>
//                     <tr>
//                       <th>Price</th>
//                       <td>${parseFloat(sale.price || 0).toFixed(2)}</td>
//                     </tr>
//                     <tr>
//                       <th>Product Type</th>
//                       <td>{sale.productType || "N/A"}</td>
//                     </tr>
//                     <tr>
//                       <th>Notes</th>
//                       <td>{sale.notes || "N/A"}</td>
//                     </tr>
//                   </tbody>
//                 </Table>
//               </Col>

//               {/* Related Info */}
//               <Col md={6}>
//                 <Table size="sm" bordered responsive hover>
//                   <tbody>
//                     <tr>
//                       <th>Lead Campaign</th>
//                       <td>{sale.Lead?.campaignName || "N/A"}</td>
//                     </tr>
//                     <tr>
//                       <th>Created By</th>
//                       <td>
//                         {sale.User
//                           ? `${sale.User.firstname || ""} ${
//                               sale.User.lastname || ""
//                             }`
//                           : "N/A"}
//                       </td>
//                     </tr>
//                     <tr>
//                       <th>User Email</th>
//                       <td>{sale.User?.email || "N/A"}</td>
//                     </tr>
//                     <tr>
//                       <th>Conversion Date</th>
//                       <td>{formatDate(sale.conversionDate)}</td>
//                     </tr>
//                     <tr>
//                       <th>Created At</th>
//                       <td>{formatDate(sale.createdAt)}</td>
//                     </tr>
//                     <tr>
//                       <th>Updated At</th>
//                       <td>{formatDate(sale.updatedAt)}</td>
//                     </tr>
//                   </tbody>
//                 </Table>
//               </Col>
//             </Row>

//             {/* Notes Section */}
//             <div className="mt-4">
//               <div className="d-flex justify-content-between align-items-center mb-2">
//                 <h5>Notes</h5>
//                 <Button
//                   color="primary"
//                   size="sm"
//                   onClick={() => setNoteModalOpen(true)}
//                 >
//                   Add Note
//                 </Button>
//               </div>
//               {notesLoading ? (
//                 <div className="text-center py-2">
//                   <Spinner size="sm" color="primary" /> Loading notes...
//                 </div>
//               ) : notes.length > 0 ? (
//                 <div style={{ maxHeight: "200px", overflowY: "auto" }}>
//                   {notes.map((note, index) => (
//                     <Card
//                       key={note.id || index}
//                       className="mb-2 border-0 bg-light"
//                     >
//                       <CardBody className="p-2">
//                         <div className="d-flex justify-content-between align-items-start">
//                           <div style={{ flex: "1 1 auto" }}>
//                             <small>{note.content}</small>
//                             <div className="text-muted small mt-1">
//                               By {note.creator?.firstname || "System"}{" "}
//                               {note.creator?.lastname || ""}
//                             </div>
//                           </div>
//                           <div
//                             className="d-flex align-items-center"
//                             style={{ gap: "10px" }}
//                           >
//                             <small
//                               className="text-muted"
//                               style={{ whiteSpace: "nowrap" }}
//                             >
//                               {formatDate(note.createdAt)}
//                             </small>
//                             {hasAnyPermission(currentUser, ["note:delete"]) && (
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
//                             )}
//                           </div>
//                         </div>
//                       </CardBody>
//                     </Card>
//                   ))}
//                 </div>
//               ) : (
//                 <Alert color="info" className="py-2 px-3 small">
//                   No notes found for this sale.
//                 </Alert>
//               )}
//             </div>

//             {/* Reminders Section */}
// <div className="mt-4">
//   <div className="d-flex justify-content-between align-items-center mb-2">
//     <h5>Reminders</h5>
//     <Button
//       color="primary"
//       size="sm"
//       onClick={() => setReminderModalOpen(true)}
//     >
//       Add Reminder
//     </Button>
//   </div>
//   {reminderLoading ? (
//     <div className="text-center py-2">
//       <Spinner size="sm" color="info" /> Loading reminders...
//     </div>
//   ) : reminders.length > 0 ? (
//     <div style={{ maxHeight: "200px", overflowY: "auto" }}>
//       {reminders.map((reminder, index) => (
//         <Card
//           key={reminder.id || index}
//           className="mb-2 border-0 bg-warning-subtle"
//         >
//           <CardBody className="p-2">
//             <div className="d-flex justify-content-between align-items-start">
//               <div style={{ flex: "1 1 auto" }}>
//                 <div
//                   className="d-flex justify-content-between align-items-center"
//                   style={{ marginRight: "15px" }}
//                 >
//                   <small>{reminder.content}</small>
//                   <Badge color="info" pill>
//                     {reminder.reminderType || "General"}
//                   </Badge>
//                 </div>
//                 <div className="text-muted small mt-1">
//                   By {reminder.creator?.firstname || "System"}{" "}
//                   {reminder.creator?.lastname || ""}
//                 </div>
//               </div>
//               <div
//                 className="d-flex align-items-center"
//                 style={{ gap: "10px" }}
//               >
//                 <small
//                   className="text-muted"
//                   style={{ whiteSpace: "nowrap" }}
//                 >
//                   Due: {formatDate(reminder.reminderDate)}
//                 </small>
//                 {hasAnyPermission(currentUser, [
//                   "reminder:delete",
//                 ]) && (
//                   <Button
//                     color="danger"
//                     size="sm"
//                     onClick={() =>
//                       handleDeleteReminder(reminder.id)
//                     }
//                     disabled={deletingReminderId === reminder.id}
//                     title="Delete reminder"
//                     style={{ padding: "2px 6px" }}
//                   >
//                     {deletingReminderId === reminder.id ? (
//                       <Spinner size="sm" />
//                     ) : (
//                       <FaTrash />
//                     )}
//                   </Button>
//                 )}
//               </div>
//             </div>
//           </CardBody>
//         </Card>
//       ))}
//     </div>
//   ) : (
//     <Alert color="info" className="py-2 px-3 small">
//       No reminders found for this sale.
//     </Alert>
//   )}
// </div>
//     <div className="mt-4">
//       <Button
//         color="secondary"
//         size="sm"
//         onClick={() => navigate("/all-sales")}
//       >
//         Back to Sales
//       </Button>
//     </div>
//   </CardBody>
// </Card>

//         {/* Add Note Modal */}
//         <Modal isOpen={noteModalOpen} toggle={() => setNoteModalOpen(false)}>
//           <ModalHeader toggle={() => setNoteModalOpen(false)}>
//             Add Note
//           </ModalHeader>
//           <ModalBody>
//             <Form>
//               <FormGroup>
//                 <Label for="newNote">Note Content</Label>
//                 <Input
//                   type="textarea"
//                   id="newNote"
//                   rows={3}
//                   value={newNote}
//                   onChange={(e) => setNewNote(e.target.value)}
//                   placeholder="Enter your note here..."
//                 />
//               </FormGroup>
//             </Form>
//           </ModalBody>
//           <ModalFooter>
//             <Button color="secondary" onClick={() => setNoteModalOpen(false)}>
//               Cancel
//             </Button>
//             <Button
//               color="primary"
//               onClick={handleAddNote}
//               disabled={addingNote}
//             >
//               {addingNote ? "Adding..." : "Add Note"}
//             </Button>
//           </ModalFooter>
//         </Modal>

//         {/* Add Reminder Modal */}
// <Modal
//   isOpen={reminderModalOpen}
//   toggle={() => setReminderModalOpen(false)}
// >
//   <ModalHeader toggle={() => setReminderModalOpen(false)}>
//     Add Reminder
//   </ModalHeader>
//   <ModalBody>
//     <Form>
//       <FormGroup>
//         <Label for="reminderContent">Reminder Content</Label>
//         <Input
//           type="textarea"
//           id="reminderContent"
//           rows={2}
//           value={reminderContent}
//           onChange={(e) => setReminderContent(e.target.value)}
//           placeholder="What should be reminded?"
//         />
//       </FormGroup>
//       <FormGroup>
//         <Label for="reminderType">Reminder Type</Label>
//         <Input
//           type="text"
//           id="reminderType"
//           name="reminderType"
//           placeholder="Enter reminder type"
//           value={reminderType}
//           onChange={(e) => setReminderType(e.target.value)}
//         />
//       </FormGroup>

//       <FormGroup>
//         <Label for="reminderDate">Due Date</Label>
//         <Input
//           type="datetime-local"
//           id="reminderDate"
//           value={reminderDate}
//           onChange={(e) => setReminderDate(e.target.value)}
//         />
//       </FormGroup>
//     </Form>
//   </ModalBody>
//   <ModalFooter>
//     <Button
//       color="secondary"
//       onClick={() => setReminderModalOpen(false)}
//     >
//       Cancel
//     </Button>
//     <Button color="primary" onClick={handleAddReminder}>
//       Add Reminder
//     </Button>
//   </ModalFooter>
// </Modal>
//       </Container>
//     </div>
//   );
// };

// export default SaleDetails;

// src/views/SaleDetails.js
// import React, { useEffect, useState } from "react";
// import {
//   Container,
//   Card,
//   CardBody,
//   Spinner,
//   Row,
//   Col,
//   Badge,
//   Button,
//   Table,
//   Alert,
//   Modal,
//   ModalHeader,
//   ModalBody,
//   ModalFooter,
// } from "reactstrap";
// import { useParams, useNavigate } from "react-router-dom";
// import { FiPrinter, FiDownload, FiMail } from "react-icons/fi";
// import Breadcrumbs from "../../components/Common/Breadcrumb";
// import { toast } from "react-toastify";
// import {
//   fetchInvoiceByLeadId,
//   fetchSaleById,
// } from "../../services/productService";
// import { getNotes, addNote, deleteNote } from "../../services/noteService";
// import { useSelector } from "react-redux";
// import { FaTrash } from "react-icons/fa";
// import useDeleteConfirmation from "../../components/Modals/DeleteConfirmation";

// const SaleDetails = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { confirmDelete } = useDeleteConfirmation();
//   const [sale, setSale] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [notes, setNotes] = useState([]);
//   const [notesLoading, setNotesLoading] = useState(false);
//   const [newNote, setNewNote] = useState("");
//   const [addingNote, setAddingNote] = useState(false);
//   const [invoice, setInvoice] = useState(null);
//   const [invoiceLoading, setInvoiceLoading] = useState(false);
//   const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
//   const [noteModalOpen, setNoteModalOpen] = useState(false);
//   const currentUser = useSelector((state) => state.Login?.user);

//   useEffect(() => {
//     if (isNaN(Number(id))) {
//       toast.error("Invalid sale ID");
//       navigate("/all-sales");
//       return;
//     }

//     const getSaleDetails = async () => {
//       setIsLoading(true);
//       try {
//         const saleData = await fetchSaleById(id);
//         setSale(saleData);

//         // Fetch notes if leadId exists
//         if (saleData?.leadId) {
//           try {
//             setNotesLoading(true);
//             const notesResponse = await getNotes(saleData.leadId, "lead");
//             const fetchedNotes =
//               notesResponse.notes || notesResponse.data || notesResponse || [];
//             setNotes(fetchedNotes);
//           } catch (notesError) {
//             console.error("Error fetching notes:", notesError);
//             toast.error(`Failed to load notes: ${notesError.message}`);
//             setNotes([]);
//           } finally {
//             setNotesLoading(false);
//           }
//         }
//       } catch (error) {
//         console.error("Error in getSaleDetails:", error);
//         toast.error(`Failed to fetch sale details: ${error.message}`);
//         navigate("/all-sales");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     getSaleDetails();
//   }, [id, navigate]);

//   const handleViewInvoice = async () => {
//     if (!sale?.leadId) {
//       toast.error("No lead associated with this sale");
//       return;
//     }

//     try {
//       setInvoiceLoading(true);
//       const invoiceData = await fetchInvoiceByLeadId(sale.leadId);
//       console.log("invoice data", invoiceData);
//       setInvoice(invoiceData.data); // ✅ only store the actual invoice object
//       setInvoiceModalOpen(true);
//     } catch (error) {
//       toast.error(`Failed to fetch invoice: ${error.message}`);
//     } finally {
//       setInvoiceLoading(false);
//     }
//   };

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
//         notebleId: id,
//         notebleType: "sale",
//       };

//       const response = await addNote(noteData);
//       const addedNote = response.note || response.data || response;

//       if (addedNote) {
//         setNotes((prev) => [...prev, addedNote]);
//         setNewNote("");
//         setNoteModalOpen(false);
//         toast.success("Note added successfully");
//       }
//     } catch (error) {
//       toast.error("Failed to add note");
//       console.error("Error adding note:", error);
//     } finally {
//       setAddingNote(false);
//     }
//   };

//   const handleDeleteNote = async (noteId) => {
//     await confirmDelete(
//       async () => {
//         await deleteNote(noteId);
//       },
//       () => {
//         setNotes((prev) => prev.filter((note) => note.id !== noteId));
//       },
//       "note"
//     );
//   };

//   const handlePrintInvoice = () => {
//     const printWindow = window.open("", "_blank");
//     printWindow.document.write(`
//       <html>
//         <head>
//           <title>Invoice ${invoice?.invoiceNumber}</title>
//           <style>
//             body { font-family: Arial, sans-serif; margin: 20px; }
//             .invoice-header { border-bottom: 2px solid #eee; padding-bottom: 20px; margin-bottom: 20px; }
//             .invoice-products { margin-bottom: 30px; }
//             .invoice-footer { border-top: 2px solid #eee; padding-top: 20px; margin-top: 20px; }
//             table { width: 100%; border-collapse: collapse; }
//             th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
//             .text-end { text-align: right; }
//           </style>
//         </head>
//         <body>
//           ${document.querySelector(".invoice-container").outerHTML}
//         </body>
//       </html>
//     `);
//     printWindow.document.close();
//     printWindow.focus();
//     setTimeout(() => {
//       printWindow.print();
//       printWindow.close();
//     }, 500);
//   };

//   const formatDate = (date) => (date ? new Date(date).toLocaleString() : "N/A");

//   const breadcrumbItems = [
//     { title: "Dashboard", link: "/" },
//     { title: "Sales", link: "/all-sales" },
//     { title: "Sale Details", link: "#" },
//   ];

//   if (isLoading) {
//     return (
//       <div className="page-content">
//         <Container fluid>
//           <div className="text-center py-5">
//             <Spinner color="primary" />
//           </div>
//         </Container>
//       </div>
//     );
//   }

//   if (!sale) {
//     return (
//       <div className="page-content">
//         <Container fluid>
//           <Card>
//             <CardBody>
//               <div className="text-center py-5">
//                 <h4>Sale not found</h4>
//               </div>
//             </CardBody>
//           </Card>
//         </Container>
//       </div>
//     );
//   }

//   return (
//     <div className="page-content">
//       <Container fluid>
//         <Breadcrumbs title="Sale Details" breadcrumbItems={breadcrumbItems} />
//         <Card>
//           <CardBody>
//             <h5 className="mb-3">Sale Information</h5>
//             <Row>
//               <Col md={6}>
//                 <Table size="sm" bordered responsive hover>
//                   <tbody>
//                     <tr>
//                       <th>ID</th>
//                       <td>{sale.id}</td>
//                     </tr>
//                     <tr>
//                       <th>Status</th>
//                       <td>
//                         <Badge
//                           color={
//                             sale.status === "converted"
//                               ? "success"
//                               : sale.status === "pending"
//                               ? "warning"
//                               : "danger"
//                           }
//                           className="text-uppercase"
//                         >
//                           {sale.status}
//                         </Badge>
//                       </td>
//                     </tr>
//                     <tr>
//                       <th>Price</th>
//                       <td>${parseFloat(sale.price || 0).toFixed(2)}</td>
//                     </tr>
//                     <tr>
//                       <th>Product Type</th>
//                       <td>{sale.productType || "N/A"}</td>
//                     </tr>
//                     <tr>
//                       <th>Notes</th>
//                       <td>{sale.notes || "N/A"}</td>
//                     </tr>
//                   </tbody>
//                 </Table>
//               </Col>

//               <Col md={6}>
//                 <Table size="sm" bordered responsive hover>
//                   <tbody>
//                     <tr>
//                       <th>Lead Campaign</th>
//                       <td>{sale.Lead?.campaignName || "N/A"}</td>
//                     </tr>
//                     <tr>
//                       <th>Created By</th>
//                       <td>
//                         {sale.User
//                           ? `${sale.User.firstname || ""} ${
//                               sale.User.lastname || ""
//                             }`
//                           : "N/A"}
//                       </td>
//                     </tr>
//                     <tr>
//                       <th>Conversion Date</th>
//                       <td>{formatDate(sale.conversionDate)}</td>
//                     </tr>
//                     <tr>
//                       <th>Created At</th>
//                       <td>{formatDate(sale.createdAt)}</td>
//                     </tr>
//                   </tbody>
//                 </Table>
//               </Col>
//             </Row>

//             {/* Invoice Button */}
//             <div className="mt-3">
//               <Button
//                 color="info"
//                 onClick={handleViewInvoice}
//                 disabled={invoiceLoading}
//               >
//                 {invoiceLoading ? (
//                   <>
//                     <Spinner size="sm" /> Loading Invoice...
//                   </>
//                 ) : (
//                   "View Invoice"
//                 )}
//               </Button>
//             </div>

//             {/* Notes Section */}
//             <div className="mt-4">
//               <div className="d-flex justify-content-between align-items-center mb-2">
//                 <h5>Notes</h5>
//                 <Button
//                   color="primary"
//                   size="sm"
//                   onClick={() => setNoteModalOpen(true)}
//                 >
//                   Add Note
//                 </Button>
//               </div>
//               {notesLoading ? (
//                 <div className="text-center py-2">
//                   <Spinner size="sm" color="primary" /> Loading notes...
//                 </div>
//               ) : notes.length > 0 ? (
//                 <div style={{ maxHeight: "200px", overflowY: "auto" }}>
//                   {notes.map((note, index) => (
//                     <Card
//                       key={note.id || index}
//                       className="mb-2 border-0 bg-light"
//                     >
//                       <CardBody className="p-2">
//                         <div className="d-flex justify-content-between align-items-start">
//                           <div style={{ flex: "1 1 auto" }}>
//                             <small>{note.content}</small>
//                             <div className="text-muted small mt-1">
//                               By {note.creator?.firstname || "System"}{" "}
//                               {note.creator?.lastname || ""}
//                             </div>
//                           </div>
//                           <div
//                             className="d-flex align-items-center"
//                             style={{ gap: "10px" }}
//                           >
//                             <small
//                               className="text-muted"
//                               style={{ whiteSpace: "nowrap" }}
//                             >
//                               {formatDate(note.createdAt)}
//                             </small>
//                             <Button
//                               color="danger"
//                               size="sm"
//                               onClick={() => handleDeleteNote(note.id)}
//                               title="Delete note"
//                               style={{ padding: "2px 6px" }}
//                             >
//                               <FaTrash size={14} />
//                             </Button>
//                           </div>
//                         </div>
//                       </CardBody>
//                     </Card>
//                   ))}
//                 </div>
//               ) : (
//                 <Alert color="info" className="py-2 px-3 small">
//                   No notes found for this sale.
//                 </Alert>
//               )}
//             </div>

//             <div className="mt-4">
//               <Button
//                 color="secondary"
//                 size="sm"
//                 onClick={() => navigate("/all-sales")}
//               >
//                 Back to Sales
//               </Button>
//             </div>
//           </CardBody>
//         </Card>

//         <Modal
//           isOpen={invoiceModalOpen}
//           toggle={() => setInvoiceModalOpen(false)}
//           size="lg"
//         >
//           <ModalHeader toggle={() => setInvoiceModalOpen(false)}>
//             Invoice #{invoice?.invoiceNumber || "Loading..."}
//           </ModalHeader>
//           <ModalBody>
//             {invoice ? (
//               (() => {
//                 // Parse leadData JSON safely
//                 const parsedLeadData = invoice?.lead?.leadData
//                   ? JSON.parse(invoice.lead.leadData)
//                   : {};

//                 return (
//                   <div className="invoice-container">
//                     {/* Header */}
//                     <div className="invoice-header mb-4">
//                       <Row>
//                         <Col md={6}>
//                           <h4>INVOICE</h4>
//                           <p className="mb-1">
//                             <strong>Invoice #:</strong> {invoice.invoiceNumber}
//                           </p>
//                           <p className="mb-1">
//                             <strong>Date:</strong>{" "}
//                             {new Date(invoice.date).toLocaleDateString()}
//                           </p>
//                         </Col>
//                         <Col md={6} className="text-end">
//                           <h5>Billed To</h5>
//                           <p className="mb-1">
//                             {parsedLeadData.first_name || ""}{" "}
//                             {parsedLeadData.last_name || ""}
//                           </p>
//                           <p className="mb-1">
//                             {parsedLeadData.email || "N/A"}
//                           </p>
//                           <p className="mb-1">
//                             {parsedLeadData.phone_number || "N/A"}
//                           </p>
//                         </Col>
//                       </Row>
//                     </div>

//                     {/* Products */}
//                     <div className="invoice-products mb-4">
//                       <Table bordered>
//                         <thead>
//                           <tr>
//                             <th>Product</th>
//                             <th>Description</th>
//                             <th className="text-end">Price</th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {invoice.products?.length > 0 ? (
//                             invoice.products.map((product, index) => (
//                               <tr key={index}>
//                                 <td>{product.productType}</td>
//                                 <td>{product.notes || "N/A"}</td>
//                                 <td className="text-end">
//                                   ${parseFloat(product.price || 0).toFixed(2)}
//                                 </td>
//                               </tr>
//                             ))
//                           ) : (
//                             <tr>
//                               <td colSpan="3" className="text-center">
//                                 No products found
//                               </td>
//                             </tr>
//                           )}
//                         </tbody>
//                         <tfoot>
//                           <tr>
//                             <td colSpan="2" className="text-end">
//                               <strong>Total:</strong>
//                             </td>
//                             <td className="text-end">
//                               <strong>
//                                 $
//                                 {parseFloat(invoice.totalAmount || 0).toFixed(
//                                   2
//                                 )}
//                               </strong>
//                             </td>
//                           </tr>
//                         </tfoot>
//                       </Table>
//                     </div>

//                     {/* Footer */}
//                     <div className="invoice-footer">
//                       <Row>
//                         <Col md={6}>
//                           <h5>Sales Representative</h5>
//                           <p className="mb-1">
//                             {invoice.assignee?.firstname || ""}{" "}
//                             {invoice.assignee?.lastname || ""}
//                           </p>
//                           <p className="mb-1">
//                             {invoice.assignee?.email || "N/A"}
//                           </p>
//                         </Col>
//                         <Col md={6}>
//                           <h5>Campaign</h5>
//                           <p className="mb-1">
//                             {invoice.campaign?.campaignName || "N/A"}
//                           </p>
//                         </Col>
//                       </Row>
//                     </div>
//                   </div>
//                 );
//               })()
//             ) : (
//               <div className="text-center py-4">
//                 <Spinner color="primary" />
//               </div>
//             )}
//           </ModalBody>
//           <ModalFooter>
//             <Button
//               color="secondary"
//               onClick={() => setInvoiceModalOpen(false)}
//             >
//               Close
//             </Button>
//             <Button color="primary" onClick={handlePrintInvoice}>
//               <FiPrinter className="me-1" /> Print
//             </Button>
//             <Button color="success">
//               <FiDownload className="me-1" /> Download
//             </Button>
//             <Button color="info">
//               <FiMail className="me-1" /> Email
//             </Button>
//           </ModalFooter>
//         </Modal>

//         {/* Add Note Modal */}
//         <Modal isOpen={noteModalOpen} toggle={() => setNoteModalOpen(false)}>
//           <ModalHeader toggle={() => setNoteModalOpen(false)}>
//             Add Note
//           </ModalHeader>
//           <ModalBody>
//             <textarea
//               className="form-control"
//               rows={3}
//               value={newNote}
//               onChange={(e) => setNewNote(e.target.value)}
//               placeholder="Enter your note here..."
//             />
//           </ModalBody>
//           <ModalFooter>
//             <Button color="secondary" onClick={() => setNoteModalOpen(false)}>
//               Cancel
//             </Button>
//             <Button
//               color="primary"
//               onClick={handleAddNote}
//               disabled={addingNote}
//             >
//               {addingNote ? "Adding..." : "Add Note"}
//             </Button>
//           </ModalFooter>
//         </Modal>
//       </Container>
//     </div>
//   );
// };

// export default SaleDetails;

// import React, { useEffect, useState } from "react";
// import {
//   Container,
//   Card,
//   CardBody,
//   Spinner,
//   Row,
//   Col,
//   Badge,
//   Button,
//   Table,
//   Alert,
//   Modal,
//   ModalHeader,
//   ModalBody,
//   ModalFooter,
//   Form,
//   FormGroup,
//   Label,
//   Input,
// } from "reactstrap";
// import { useParams, useNavigate } from "react-router-dom";
// import { FiDownload } from "react-icons/fi";
// import Breadcrumbs from "../../components/Common/Breadcrumb";
// import { toast } from "react-toastify";
// import {
//   fetchInvoiceByLeadId,
//   fetchSaleById,
// } from "../../services/productService";
// import {
//   getNotes,
//   addNote,
//   deleteNote,
//   getReminders,
//   addReminder,
//   deleteReminder,
// } from "../../services/noteService";
// import { useSelector } from "react-redux";
// import { FaTrash } from "react-icons/fa";
// import useDeleteConfirmation from "../../components/Modals/DeleteConfirmation";
// import logo from "../../assets/images/Picture2.png";
// import { jsPDF } from "jspdf";
// import autoTable from "jspdf-autotable";
// import "jspdf-autotable";
// import { hasAnyPermission } from "../../utils/permissions";

// const SaleDetails = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { confirmDelete } = useDeleteConfirmation();
//   const [sale, setSale] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [notes, setNotes] = useState([]);
//   const [notesLoading, setNotesLoading] = useState(false);
//   const [newNote, setNewNote] = useState("");
//   const [addingNote, setAddingNote] = useState(false);
//   const [invoice, setInvoice] = useState(null);
//   const [reminders, setReminders] = useState([]);
//   const [reminderLoading, setReminderLoading] = useState(false);
//   const [reminderContent, setReminderContent] = useState("");
//   const [reminderType, setReminderType] = useState("");
//   const [reminderDate, setReminderDate] = useState("");
//   const [invoiceLoading, setInvoiceLoading] = useState(false);
//   const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
//   const [noteModalOpen, setNoteModalOpen] = useState(false);
//   const [reminderModalOpen, setReminderModalOpen] = useState(false);
//   const [deletingReminderId, setDeletingReminderId] = useState(null);
//   const currentUser = useSelector((state) => state.Login?.user);

//   useEffect(() => {
//     if (isNaN(Number(id))) {
//       toast.error("Invalid sale ID");
//       navigate("/all-sales");
//       return;
//     }

//     const getSaleDetails = async () => {
//       setIsLoading(true);
//       try {
//         console.log(`Fetching sale details for ID: ${id}`);
//         const saleData = await fetchSaleById(id);
//         console.log("Sale data received:", saleData);
//         setSale(saleData);

//         const leadId = saleData?.leadId; // get lead ID linked to the sale
//         if (!leadId) {
//           throw new Error("No leadId found for this sale");
//         }

//         // Fetch notes for this sale's lead
//         try {
//           console.log(`Fetching notes for lead ID: ${leadId}`);
//           setNotesLoading(true);
//           const notesResponse = await getNotes(leadId, "lead"); // ✅ use leadId + "lead"
//           const fetchedNotes =
//             notesResponse.notes || notesResponse.data || notesResponse || [];
//           setNotes(fetchedNotes);
//         } catch (notesError) {
//           console.error("Error fetching notes:", notesError);
//           toast.error(`Failed to load notes: ${notesError.message}`);
//           setNotes([]);
//         } finally {
//           setNotesLoading(false);
//         }

//         // Fetch reminders for this sale's lead
//         try {
//           console.log(`Fetching reminders for lead ID: ${leadId}`);
//           setReminderLoading(true);
//           const remindersResponse = await getReminders(leadId, "lead"); // ✅ use leadId + "lead"
//           const fetchedReminders =
//             remindersResponse.reminders ||
//             remindersResponse.data ||
//             remindersResponse ||
//             [];
//           setReminders(fetchedReminders);
//         } catch (remindersError) {
//           console.error("Error fetching reminders:", remindersError);
//           toast.error(`Failed to load reminders: ${remindersError.message}`);
//           setReminders([]);
//         } finally {
//           setReminderLoading(false);
//         }
//       } catch (error) {
//         console.error("Error in getSaleDetails:", error);
//         toast.error(`Failed to fetch sale details: ${error.message}`);
//         navigate("/all-sales");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     getSaleDetails();
//   }, [id, navigate]);

//   const handleViewInvoice = async () => {
//     if (!sale?.leadId) {
//       toast.error("No lead associated with this sale");
//       return;
//     }

//     try {
//       setInvoiceLoading(true);
//       const invoiceData = await fetchInvoiceByLeadId(sale.leadId);
//       setInvoice(invoiceData.data);
//       setInvoiceModalOpen(true);
//     } catch (error) {
//       toast.error(`Failed to fetch invoice: ${error.message}`);
//     } finally {
//       setInvoiceLoading(false);
//     }
//   };

//   const handleDownloadInvoice = () => {
//     if (!invoice) return;

//     const doc = new jsPDF();

//     // Add logo
//     const imgData = logo; // This should be a base64 encoded image or URL
//     doc.addImage(imgData, "PNG", 10, 10, 30, 10);

//     // Add company info
//     doc.setFontSize(10);
//     doc.text("Global Web Builders", 50, 15);
//     doc.setFontSize(8);
//     doc.text("26 Broadway 3rd Floor, New York, NY 10004", 50, 20);
//     doc.text("www.globalwebbuilders.com", 50, 25);

//     // Add invoice title and number
//     doc.setFontSize(14);
//     doc.text("INVOICE", 160, 15, { align: "right" });
//     doc.setFontSize(10);
//     doc.text(`#${invoice.invoiceNumber}`, 160, 20, { align: "right" });

//     // Add invoice details
//     doc.setFontSize(8);
//     doc.text(`Date: ${formatDate(invoice.date)}`, 160, 30, { align: "right" });
//     doc.text(`Payment Terms: Prepaid`, 160, 35, { align: "right" });
//     doc.text(`Due Date: ${formatDate(invoice.date)}`, 160, 40, {
//       align: "right",
//     });

//     // Add customer info
//     doc.setFontSize(10);
//     doc.text("Bill To:", 15, 45);
//     doc.setFontSize(8);
//     const leadData = JSON.parse(invoice.lead.leadData);
//     doc.text(
//       `${leadData.first_name || "N/A"} ${leadData.last_name || "N/A"}`,
//       15,
//       50
//     );
//     doc.text("+932233443443", 15, 55);
//     doc.text("www.x-tremesteelfoundationrepair.com", 15, 60);
//     doc.text("Paul@x-tremesteelfoundationrepair.com", 15, 65);

//     // Add table header
//     autoTable(doc, {
//       startY: 70,
//       head: [["Item", "Quantity", "Rate", "Amount"]],
//       body: [
//         [
//           invoice.sale.productType,
//           "1",
//           `$${invoice.sale.price.toFixed(2)}`,
//           `$${invoice.sale.price.toFixed(2)}`,
//         ],
//       ],
//       headStyles: {
//         fillColor: [58, 58, 58],
//         textColor: 255,
//       },
//       margin: { top: 70 },
//     });

//     // Add totals
//     const finalY = doc.lastAutoTable.finalY + 10;
//     doc.setFontSize(8);
//     doc.text(`Subtotal: $${invoice.sale.price.toFixed(2)}`, 160, finalY, {
//       align: "right",
//     });
//     doc.text(`Tax (0%): $0.00`, 160, finalY + 5, { align: "right" });
//     doc.text(`Total: $${invoice.sale.price.toFixed(2)}`, 160, finalY + 10, {
//       align: "right",
//     });
//     doc.text(
//       `Amount Received: $${invoice.sale.price.toFixed(2)}`,
//       160,
//       finalY + 15,
//       { align: "right" }
//     );

//     // Add notes
//     doc.setFontSize(8);
//     doc.text("Notes:", 15, finalY + 25);
//     doc.text(
//       "If you have any questions about this invoice, please contact us at",
//       15,
//       finalY + 30
//     );
//     doc.text("contact@globalwebbuilders.com", 15, finalY + 35);

//     // Add PAID stamp if applicable
//     if (invoice.success) {
//       doc.setFontSize(18);
//       doc.setTextColor(255, 0, 0);
//       doc.text("PAID", 100, finalY + 50, { align: "center" });
//     }

//     // Save the PDF
//     doc.save(`invoice_${invoice.invoiceNumber}.pdf`);
//   };

//   const handleAddReminder = async () => {
//     if (!reminderContent || !reminderType || !reminderDate) {
//       toast.warn("All fields are required for reminder");
//       return;
//     }

//     try {
//       const parsedReminderDate = new Date(reminderDate);
//       if (isNaN(parsedReminderDate)) {
//         toast.error("Invalid reminder date");
//         return;
//       }

//       const reminderData = {
//         content: reminderContent,
//         reminderType,
//         reminderDate: parsedReminderDate,
//         notebleId: sale.leadId,
//         notebleType: "lead",
//       };

//       console.log("Submitting Reminder:", reminderData);

//       const response = await addReminder(reminderData);

//       const newReminder = response.reminder || response.data || response;
//       if (newReminder) {
//         setReminders((prev) => [...prev, newReminder]);
//         setReminderContent("");
//         setReminderType("");
//         setReminderDate("");
//         setReminderModalOpen(false);
//         toast.success("Reminder added successfully");
//       }
//     } catch (error) {
//       toast.error("Failed to add reminder");
//       console.error("Error adding reminder:", error);
//     }
//   };

//   const handleAddNote = async () => {
//     if (!newNote.trim()) return toast.error("Note cannot be empty");

//     try {
//       setAddingNote(true);
//       const noteData = {
//         content: newNote,
//         type: "comment",
//         notebleId: sale.leadId,
//         notebleType: "lead",
//       };

//       const response = await addNote(noteData);
//       const addedNote = response.note || response.data || response;
//       if (addedNote) {
//         setNotes((prev) => [...prev, addedNote]);
//         setNewNote("");
//         setNoteModalOpen(false);
//         toast.success("Note added successfully");
//       }
//     } catch (error) {
//       toast.error("Failed to add note");
//     } finally {
//       setAddingNote(false);
//     }
//   };

//   const handleDeleteNote = async (noteId) => {
//     await confirmDelete(
//       async () => {
//         await deleteNote(noteId);
//       },
//       () => {
//         setNotes((prev) => prev.filter((note) => note.id !== noteId));
//       },
//       "note"
//     );
//   };

//   const handleDeleteReminder = async (reminderId) => {
//     const token = localStorage.getItem("token");

//     await confirmDelete(
//       async () => {
//         await deleteReminder(reminderId, token);
//       },
//       () => {
//         setReminders((prev) =>
//           prev.filter((reminder) => reminder.id !== reminderId)
//         );
//       },
//       "reminder"
//     );
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     });
//   };

//   const breadcrumbItems = [
//     { title: "Dashboard", link: "/" },
//     { title: "Sales", link: "/all-sales" },
//     { title: "Sale Details", link: "#" },
//   ];

//   if (isLoading) {
//     return (
//       <div className="page-content">
//         <Container fluid>
//           <div className="text-center py-5">
//             <Spinner color="primary" />
//           </div>
//         </Container>
//       </div>
//     );
//   }

//   if (!sale) {
//     return (
//       <div className="page-content">
//         <Container fluid>
//           <Card>
//             <CardBody>
//               <div className="text-center py-5">
//                 <h4>Sale not found</h4>
//               </div>
//             </CardBody>
//           </Card>
//         </Container>
//       </div>
//     );
//   }

//   return (
//     <div className="page-content">
//       <Container fluid>
//         <Breadcrumbs title="Sale Details" breadcrumbItems={breadcrumbItems} />
//         <Card>
//           <CardBody>
//             <h5 className="mb-3">Sale Information</h5>
//             <Row>
//               <Col md={6}>
//                 <Table size="sm" bordered responsive hover>
//                   <tbody>
//                     <tr>
//                       <th>ID</th>
//                       <td>{sale.id}</td>
//                     </tr>
//                     <tr>
//                       <th>Status</th>
//                       <td>
//                         <Badge
//                           color={
//                             sale.status === "converted"
//                               ? "success"
//                               : sale.status === "pending"
//                               ? "warning"
//                               : "danger"
//                           }
//                           className="text-uppercase"
//                         >
//                           {sale.status}
//                         </Badge>
//                       </td>
//                     </tr>
//                     <tr>
//                       <th>Price</th>
//                       <td>${parseFloat(sale.price || 0).toFixed(2)}</td>
//                     </tr>
//                     <tr>
//                       <th>Product Type</th>
//                       <td>{sale.productType || "N/A"}</td>
//                     </tr>
//                     <tr>
//                       <th>Notes</th>
//                       <td>{sale.notes || "N/A"}</td>
//                     </tr>
//                   </tbody>
//                 </Table>
//               </Col>
//               <Col md={6}>
//                 <Table size="sm" bordered responsive hover>
//                   <tbody>
//                     <tr>
//                       <th>Lead Campaign</th>
//                       <td>{sale.Lead?.campaignName || "N/A"}</td>
//                     </tr>
//                     <tr>
//                       <th>Created By</th>
//                       <td>
//                         {sale.User
//                           ? `${sale.User.firstname || ""} ${
//                               sale.User.lastname || ""
//                             }`
//                           : "N/A"}
//                       </td>
//                     </tr>
//                     <tr>
//                       <th>Conversion Date</th>
//                       <td>{formatDate(sale.conversionDate)}</td>
//                     </tr>
//                     <tr>
//                       <th>Created At</th>
//                       <td>{formatDate(sale.createdAt)}</td>
//                     </tr>
//                   </tbody>
//                 </Table>
//               </Col>
//             </Row>
//             <div className="mt-3">
//               <Button
//                 color="primary"
//                 onClick={handleViewInvoice}
//                 disabled={invoiceLoading}
//               >
//                 {invoiceLoading ? (
//                   <>
//                     <Spinner size="sm" /> Loading Invoice...
//                   </>
//                 ) : (
//                   "Generate Invoice"
//                 )}
//               </Button>
//             </div>
//             <div className="mt-4">
//               <div className="d-flex justify-content-between align-items-center mb-2">
//                 <h5>Notes</h5>
//                 <Button
//                   color="primary"
//                   size="sm"
//                   onClick={() => setNoteModalOpen(true)}
//                 >
//                   Add Note
//                 </Button>
//               </div>
//               {notesLoading ? (
//                 <div className="text-center py-2">
//                   <Spinner size="sm" color="primary" /> Loading notes...
//                 </div>
//               ) : notes.length > 0 ? (
//                 <div style={{ maxHeight: "200px", overflowY: "auto" }}>
//                   {notes.map((note, index) => (
//                     <Card
//                       key={note.id || index}
//                       className="mb-2 border-0 bg-light"
//                     >
//                       <CardBody className="p-2">
//                         <div className="d-flex justify-content-between align-items-start">
//                           <div style={{ flex: "1 1 auto" }}>
//                             <small>{note.content}</small>
//                             <div className="text-muted small mt-1">
//                               By {note.creator?.firstname || "System"}{" "}
//                               {note.creator?.lastname || ""}
//                             </div>
//                           </div>
//                           <div
//                             className="d-flex align-items-center"
//                             style={{ gap: "10px" }}
//                           >
//                             <small
//                               className="text-muted"
//                               style={{ whiteSpace: "nowrap" }}
//                             >
//                               {formatDate(note.createdAt)}
//                             </small>
//                             <Button
//                               color="danger"
//                               size="sm"
//                               onClick={() => handleDeleteNote(note.id)}
//                               title="Delete note"
//                               style={{ padding: "2px 6px" }}
//                             >
//                               <FaTrash size={14} />
//                             </Button>
//                           </div>
//                         </div>
//                       </CardBody>
//                     </Card>
//                   ))}
//                 </div>
//               ) : (
//                 <Alert color="info" className="py-2 px-3 small">
//                   No notes found for this sale.
//                 </Alert>
//               )}
//             </div>

//             <div className="mt-4">
//               <div className="d-flex justify-content-between align-items-center mb-2">
//                 <h5>Reminders</h5>
//                 <Button
//                   color="primary"
//                   size="sm"
//                   onClick={() => setReminderModalOpen(true)}
//                 >
//                   Add Reminder
//                 </Button>
//               </div>
//               {reminderLoading ? (
//                 <div className="text-center py-2">
//                   <Spinner size="sm" color="info" /> Loading reminders...
//                 </div>
//               ) : reminders.length > 0 ? (
//                 <div style={{ maxHeight: "200px", overflowY: "auto" }}>
//                   {reminders.map((reminder, index) => (
//                     <Card
//                       key={reminder.id || index}
//                       className="mb-2 border-0 bg-warning-subtle"
//                     >
//                       <CardBody className="p-2">
//                         <div className="d-flex justify-content-between align-items-start">
//                           <div style={{ flex: "1 1 auto" }}>
//                             <div
//                               className="d-flex justify-content-between align-items-center"
//                               style={{ marginRight: "15px" }}
//                             >
//                               <small>{reminder.content}</small>
//                               <Badge color="info" pill>
//                                 {reminder.reminderType || "General"}
//                               </Badge>
//                             </div>
//                             <div className="text-muted small mt-1">
//                               By {reminder.creator?.firstname || "System"}{" "}
//                               {reminder.creator?.lastname || ""}
//                             </div>
//                           </div>
//                           <div
//                             className="d-flex align-items-center"
//                             style={{ gap: "10px" }}
//                           >
//                             <small
//                               className="text-muted"
//                               style={{ whiteSpace: "nowrap" }}
//                             >
//                               Due: {formatDate(reminder.reminderDate)}
//                             </small>
//                             {hasAnyPermission(currentUser, [
//                               "reminder:delete",
//                             ]) && (
//                               <Button
//                                 color="danger"
//                                 size="sm"
//                                 onClick={() =>
//                                   handleDeleteReminder(reminder.id)
//                                 }
//                                 disabled={deletingReminderId === reminder.id}
//                                 title="Delete reminder"
//                                 style={{ padding: "2px 6px" }}
//                               >
//                                 {deletingReminderId === reminder.id ? (
//                                   <Spinner size="sm" />
//                                 ) : (
//                                   <FaTrash />
//                                 )}
//                               </Button>
//                             )}
//                           </div>
//                         </div>
//                       </CardBody>
//                     </Card>
//                   ))}
//                 </div>
//               ) : (
//                 <Alert color="info" className="py-2 px-3 small">
//                   No reminders found for this sale.
//                 </Alert>
//               )}
//             </div>
//             <div className="mt-4">
//               <Button
//                 color="secondary"
//                 size="sm"
//                 onClick={() => navigate("/all-sales")}
//               >
//                 Back to Sales
//               </Button>
//             </div>
//           </CardBody>
//         </Card>

//         <Modal
//           isOpen={invoiceModalOpen}
//           toggle={() => setInvoiceModalOpen(false)}
//           size="md"
//         >
//           <ModalHeader toggle={() => setInvoiceModalOpen(false)}>
//             Invoice #{invoice?.invoiceNumber || "Loading..."}
//           </ModalHeader>

//           <ModalBody className="p-2">
//             {invoice ? (
//               <div className="invoice-container">
//                 {/* HEADER */}
// <div
//   className="invoice-header mb-2"
//   style={{ padding: "2px 0" }}
// >
//   <Row>
//     {/* LEFT */}
//     <Col xs={6}>
//       <img
//         src={logo}
//         alt="Logo"
//         style={{
//           width: "60px",
//           height: "auto",
//           marginBottom: "10px",
//         }}
//       />
//       <p
//         style={{
//           fontSize: "12px",
//           fontWeight: "bold",
//           marginBottom: "2px",
//         }}
//       >
//         Global Web Builders
//       </p>
//       <p style={{ fontSize: "10px", marginBottom: "5px" }}>
//         26 Broadway 3rd Floor, New York, NY 10004
//       </p>
//       <p
//         style={{
//           fontSize: "10px",
//           color: "#007BFF",
//           marginBottom: "10px",
//         }}
//       >
//         www.globalwebbuilders.com
//       </p>

//       <p
//         style={{
//           fontSize: "10px",
//           fontWeight: "bold",
//           marginBottom: "2px",
//         }}
//       >
//         Bill To:
//       </p>
//       <p style={{ fontSize: "10px", marginBottom: "2px" }}>
//         {JSON.parse(invoice.lead.leadData).first_name || "N/A"}{" "}
//         {JSON.parse(invoice.lead.leadData).last_name || "N/A"}
//       </p>
//       <p style={{ fontSize: "10px", marginBottom: "2px" }}>
//         +932233443443
//       </p>
//       <p
//         style={{
//           fontSize: "10px",
//           color: "#007BFF",
//           marginBottom: "2px",
//         }}
//       >
//         www.x-tremesteelfoundationrepair.com
//       </p>
//       <p style={{ fontSize: "10px", marginBottom: "0" }}>
//         Paul@x-tremesteelfoundationrepair.com
//       </p>
//     </Col>

//                     {/* RIGHT */}
//                     <Col xs={6} className="text-end">
//                       <h4 style={{ marginBottom: "5px" }}>INVOICE</h4>
//                       <p
//                         style={{
//                           fontSize: "10px",
//                           color: "gray",
//                           marginBottom: "15px",
//                         }}
//                       >
//                         #{invoice.invoiceNumber}
//                       </p>

//                       <p style={{ fontSize: "10px", marginBottom: "3px" }}>
//                         <strong>Date:</strong> {formatDate(invoice.date)}
//                       </p>
//                       <p style={{ fontSize: "10px", marginBottom: "3px" }}>
//                         <strong>Payment Terms:</strong> Prepaid
//                       </p>
//                       <p style={{ fontSize: "10px", marginBottom: "15px" }}>
//                         <strong>Due Date:</strong> {formatDate(invoice.date)}
//                       </p>

//                       <div
//                         style={{
//                           backgroundColor: "#f6f6f6",
//                           padding: "5px 10px",
//                           borderRadius: "5px",
//                           display: "inline-block",
//                         }}
//                       >
//                         <strong
//                           style={{ fontSize: "10px", marginRight: "10px" }}
//                         >
//                           Balance Due
//                         </strong>
//                         <span style={{ fontSize: "12px", fontWeight: "bold" }}>
//                           $0.00
//                         </span>
//                       </div>
//                     </Col>
//                   </Row>
//                 </div>

//                 {/* DETAILS */}
//                 <div className="invoice-details mb-4">
//                   <Table bordered={false} size="sm" style={{ width: "100%" }}>
//                     <thead>
//                       <tr
//                         style={{
//                           backgroundColor: "#3a3a3a",
//                           color: "white",
//                           fontWeight: "bold",
//                           fontSize: "12px",
//                         }}
//                       >
//                         <th style={{ padding: "8px", color: "white" }}>Item</th>
//                         <th
//                           style={{
//                             padding: "8px",
//                             textAlign: "center",
//                             color: "white",
//                           }}
//                         >
//                           Quantity
//                         </th>
//                         <th
//                           style={{
//                             padding: "8px",
//                             textAlign: "right",
//                             color: "white",
//                           }}
//                         >
//                           Rate
//                         </th>
//                         <th
//                           style={{
//                             padding: "8px",
//                             textAlign: "right",
//                             color: "white",
//                           }}
//                         >
//                           Amount
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       <tr>
//                         <td style={{ fontWeight: "bold", fontSize: "11px" }}>
//                           {invoice.sale.productType}
//                         </td>
//                         <td style={{ textAlign: "center" }}>1</td>
//                         <td style={{ textAlign: "right" }}>
//                           ${invoice.sale.price.toFixed(2)}
//                         </td>
//                         <td style={{ textAlign: "right" }}>
//                           ${invoice.sale.price.toFixed(2)}
//                         </td>
//                       </tr>
//                     </tbody>
//                   </Table>
//                 </div>

//                 <div style={{ marginTop: "30px" }}>
//                   <div style={{ display: "flex", justifyContent: "flex-end" }}>
//                     <table>
//                       <tbody>
//                         <tr>
//                           <td
//                             style={{
//                               textAlign: "right",
//                               fontSize: "11px",
//                               paddingRight: "10px",
//                             }}
//                           >
//                             <strong>Subtotal:</strong>
//                           </td>
//                           <td style={{ textAlign: "right" }}>
//                             ${invoice.sale.price.toFixed(2)}
//                           </td>
//                         </tr>
//                         <tr>
//                           <td
//                             style={{
//                               textAlign: "right",
//                               fontSize: "11px",
//                               paddingRight: "10px",
//                             }}
//                           >
//                             <strong>Tax (0%):</strong>
//                           </td>
//                           <td style={{ textAlign: "right" }}>$0.00</td>
//                         </tr>
//                         <tr>
//                           <td
//                             style={{
//                               textAlign: "right",
//                               fontSize: "11px",
//                               paddingRight: "10px",
//                             }}
//                           >
//                             <strong>Total:</strong>
//                           </td>
//                           <td style={{ textAlign: "right" }}>
//                             ${invoice.sale.price.toFixed(2)}
//                           </td>
//                         </tr>
//                         <tr>
//                           <td
//                             style={{
//                               textAlign: "right",
//                               fontSize: "11px",
//                               paddingRight: "10px",
//                             }}
//                           >
//                             <strong>Amount Received:</strong>
//                           </td>
//                           <td style={{ textAlign: "right" }}>
//                             ${invoice.sale.price.toFixed(2)}
//                           </td>
//                         </tr>
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>

//                 {/* FOOTER */}
//                 <div style={{ marginTop: "30px" }}>
//                   <p style={{ fontSize: "10px", fontWeight: "bold" }}>Notes:</p>
//                   <p style={{ fontSize: "10px", marginBottom: "5px" }}>
//                     If you have any questions about this invoice, please contact
//                     us at
//                   </p>
//                   <p style={{ fontSize: "10px", color: "#007BFF" }}>
//                     contact@globalwebbuilders.com
//                   </p>

//                   {invoice.success && (
//                     <div
//                       style={{
//                         border: "3px solid red",
//                         color: "red",
//                         fontWeight: "bold",
//                         padding: "5px 15px",
//                         display: "inline-block",
//                         borderRadius: "5px",
//                         fontSize: "18px",
//                         marginTop: "10px",
//                       }}
//                     >
//                       PAID
//                     </div>
//                   )}
//                 </div>
//               </div>
//             ) : null}
//           </ModalBody>

//           <ModalFooter className="justify-content-between">
//             <Button
//               color="secondary"
//               onClick={() => setInvoiceModalOpen(false)}
//               size="sm"
//             >
//               Close
//             </Button>
//             <div>
//               <Button
//                 color="primary"
//                 size="sm"
//                 className="me-2"
//                 onClick={handleDownloadInvoice}
//               >
//                 <FiDownload className="me-1" /> Download
//               </Button>
//             </div>
//           </ModalFooter>
//         </Modal>
//         <Modal
//           isOpen={reminderModalOpen}
//           toggle={() => setReminderModalOpen(false)}
//         >
//           <ModalHeader toggle={() => setReminderModalOpen(false)}>
//             Add Reminder
//           </ModalHeader>
//           <ModalBody>
//             <Form>
//               <FormGroup>
//                 <Label for="reminderContent">Reminder Content</Label>
//                 <Input
//                   type="textarea"
//                   id="reminderContent"
//                   rows={2}
//                   value={reminderContent}
//                   onChange={(e) => setReminderContent(e.target.value)}
//                   placeholder="What should be reminded?"
//                 />
//               </FormGroup>
//               <FormGroup>
//                 <Label for="reminderType">Reminder Type</Label>
//                 <Input
//                   type="text"
//                   id="reminderType"
//                   name="reminderType"
//                   placeholder="Enter reminder type"
//                   value={reminderType}
//                   onChange={(e) => setReminderType(e.target.value)}
//                 />
//               </FormGroup>

//               <FormGroup>
//                 <Label for="reminderDate">Due Date</Label>
//                 <Input
//                   type="datetime-local"
//                   id="reminderDate"
//                   value={reminderDate}
//                   onChange={(e) => setReminderDate(e.target.value)}
//                 />
//               </FormGroup>
//             </Form>
//           </ModalBody>
//           <ModalFooter>
//             <Button
//               color="secondary"
//               onClick={() => setReminderModalOpen(false)}
//             >
//               Cancel
//             </Button>
//             <Button color="primary" onClick={handleAddReminder}>
//               Add Reminder
//             </Button>
//           </ModalFooter>
//         </Modal>
//         <Modal isOpen={noteModalOpen} toggle={() => setNoteModalOpen(false)}>
//           <ModalHeader toggle={() => setNoteModalOpen(false)}>
//             Add Note
//           </ModalHeader>
//           <ModalBody>
//             <textarea
//               className="form-control"
//               rows={3}
//               value={newNote}
//               onChange={(e) => setNewNote(e.target.value)}
//               placeholder="Enter your note here..."
//             />
//           </ModalBody>
//           <ModalFooter>
//             <Button color="secondary" onClick={() => setNoteModalOpen(false)}>
//               Cancel
//             </Button>
//             <Button
//               color="primary"
//               onClick={handleAddNote}
//               disabled={addingNote}
//             >
//               {addingNote ? "Adding..." : "Add Note"}
//             </Button>
//           </ModalFooter>
//         </Modal>
//       </Container>
//     </div>
//   );
// };

// export default SaleDetails;

// SaleDetails.tsx
import React, { useEffect, useState } from "react";
import {
  Container,
  Card,
  CardBody,
  Spinner,
  Row,
  Col,
  Badge,
  Button,
  Table,
  Alert,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import { useParams, useNavigate } from "react-router-dom";
import { FiDownload } from "react-icons/fi";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { toast } from "react-toastify";
import {
  fetchInvoiceByLeadId,
  fetchSaleById,
} from "../../services/productService";
import {
  getNotes,
  addNote,
  deleteNote,
  getReminders,
  addReminder,
  deleteReminder,
} from "../../services/noteService";
import { useSelector } from "react-redux";
import { FaTrash } from "react-icons/fa";
import useDeleteConfirmation from "../../components/Modals/DeleteConfirmation";
import logo from "../../assets/images/Picture2.png";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import "jspdf-autotable";
import { hasAnyPermission } from "../../utils/permissions";

const SaleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { confirmDelete } = useDeleteConfirmation();
  const [sale, setSale] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notes, setNotes] = useState([]);
  const [notesLoading, setNotesLoading] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [addingNote, setAddingNote] = useState(false);
  const [invoice, setInvoice] = useState(null);
  const [reminders, setReminders] = useState([]);
  const [reminderLoading, setReminderLoading] = useState(false);
  const [reminderContent, setReminderContent] = useState("");
  const [reminderType, setReminderType] = useState("");
  const [reminderDate, setReminderDate] = useState("");
  const [invoiceLoading, setInvoiceLoading] = useState(false);
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [reminderModalOpen, setReminderModalOpen] = useState(false);
  const [deletingReminderId, setDeletingReminderId] = useState(null);
  const currentUser = useSelector((state) => state.Login?.user);

  useEffect(() => {
    if (isNaN(Number(id))) {
      toast.error("Invalid sale ID");
      navigate("/all-sales");
      return;
    }

    const getSaleDetails = async () => {
      setIsLoading(true);
      try {
        const saleData = await fetchSaleById(id);
        let parsedProducts = null;
        let parsedLeadData = {
          first_name: "N/A",
          last_name: "N/A",
          state: "N/A",
          phone_number: "N/A",
          email: "N/A",
        };
        try {
          if (saleData.products && typeof saleData.products === "string") {
            parsedProducts = JSON.parse(saleData.products);
          } else if (saleData.products === null) {
            parsedProducts = [
              {
                productType: saleData.productType || "N/A",
                price: saleData.price || 0,
                notes: saleData.notes || "N/A",
              },
            ];
          }
          if (saleData.Lead?.leadData) {
            parsedLeadData = {
              ...parsedLeadData,
              ...JSON.parse(saleData.Lead.leadData),
            };
          }
        } catch (error) {
          console.error(`Error parsing JSON for sale ID ${id}:`, error);
          toast.warn("Invalid data format in sale details");
        }
        setSale({ ...saleData, parsedProducts, parsedLeadData });

        const leadId = saleData?.leadId;
        if (!leadId) {
          throw new Error("No leadId found for this sale");
        }

        setNotesLoading(true);
        try {
          const notesResponse = await getNotes(leadId, "lead");
          setNotes(
            notesResponse.notes || notesResponse.data || notesResponse || []
          );
        } catch (error) {
          console.error("Error fetching notes:", error);
          toast.error(`Failed to load notes: ${error.message}`);
          setNotes([]);
        } finally {
          setNotesLoading(false);
        }

        setReminderLoading(true);
        try {
          const remindersResponse = await getReminders(leadId, "lead");
          setReminders(
            remindersResponse.reminders ||
              remindersResponse.data ||
              remindersResponse ||
              []
          );
        } catch (error) {
          console.error("Error fetching reminders:", error);
          toast.error(`Failed to load reminders: ${error.message}`);
          setReminders([]);
        } finally {
          setReminderLoading(false);
        }
      } catch (error) {
        console.error("Error in getSaleDetails:", error);
        toast.error(`Failed to fetch sale details: ${error.message}`);
        navigate("/all-sales");
      } finally {
        setIsLoading(false);
      }
    };

    getSaleDetails();
  }, [id, navigate]);

  const handleViewInvoice = async () => {
    if (!sale?.leadId) {
      toast.error("No lead associated with this sale");
      return;
    }

    try {
      setInvoiceLoading(true);
      const invoiceData = await fetchInvoiceByLeadId(sale.leadId);
      console.log("Invoice data:", JSON.stringify(invoiceData, null, 2)); // Debug log
      if (!invoiceData.success || !invoiceData.data) {
        throw new Error("Invalid invoice data received");
      }
      setInvoice(invoiceData.data);
      setInvoiceModalOpen(true);
    } catch (error) {
      console.error("Error in handleViewInvoice:", error);
      toast.error(`Failed to fetch invoice: ${error.message}`);
    } finally {
      setInvoiceLoading(false);
    }
  };

  const handleDownloadInvoice = () => {
    if (!invoice) {
      toast.error("No invoice data available");
      return;
    }

    try {
      const doc = new jsPDF("p", "mm", "a4");
      doc.internal.pageSize.height = 235; // override height
      // Set default styles
      doc.setFont("helvetica");
      doc.setTextColor(0, 0, 0);

      // Company info (left side)
      if (logo) {
        doc.addImage(logo, "PNG", 15, 1, 35, 0);
      }

      // Global Web Builders info
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Global Web Builders", 15, 40);

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("26 Broadway 3rd Floor, New York, NY 10004", 15, 45);

      doc.setTextColor(0, 0, 255);
      doc.text("www.globalwebbuilders.com", 15, 50);
      doc.setTextColor(0, 0, 0);

      // Right side invoice details
      doc.setFontSize(16);
      doc.setFont("helvetica");
      doc.text("INVOICE", 200, 20, { align: "right" });

      const invoiceNumber = invoice.invoiceNumber || "INV-000";
      doc.setFontSize(10);
      doc.setTextColor(128, 128, 128); // Gray color
      doc.text(`#${invoiceNumber}`, 200, 25, { align: "right" });
      doc.setTextColor(0, 0, 0);

      // Date information
      const invoiceDate = invoice.date ? formatDate(invoice.date) : "N/A";
      doc.setFontSize(10);
      doc.text(`Date: ${invoiceDate}`, 200, 35, { align: "right" });
      doc.text("Payment Terms: Prepaid", 200, 40, { align: "right" });
      doc.text(`Due Date: ${invoiceDate}`, 200, 45, { align: "right" });

      // Balance Due box
      doc.setFillColor(246, 246, 246); // #f6f6f6
      doc.roundedRect(150, 50, 55, 12, 3, 3, "F");
      doc.setFontSize(10);
      doc.text("Balance Due", 155, 57);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("$0.00", 200, 57, { align: "right" });

      // First horizontal line
      doc.setDrawColor(200, 200, 200);
      doc.line(15, 65, 195, 65);

      // Bill To section
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("Bill To:", 15, 75);
      doc.setFont("helvetica", "normal");

      let leadData = {
        first_name: "N/A",
        last_name: "N/A",
        phone_number: "N/A",
        email: "N/A",
        website: "www.x-tremesleefoundationspair.com",
      };

      try {
        if (invoice.lead?.leadData) {
          leadData = {
            ...leadData,
            ...JSON.parse(invoice.lead.leadData),
          };
        }
      } catch (e) {
        console.error("Error parsing lead data:", e);
      }

      doc.text(
        `${leadData.first_name} ${leadData.last_name}`.substring(0, 50),
        15,
        80
      );
      doc.text(String(leadData.phone_number).substring(0, 20), 15, 85);
      doc.setTextColor(0, 0, 255);
      doc.text(leadData.website.substring(0, 50), 15, 90);
      doc.text(String(leadData.email).substring(0, 50), 15, 95);
      doc.setTextColor(0, 0, 0);

      // Second horizontal line
      doc.line(15, 100, 195, 100);

      // Table header
      doc.setFillColor(58, 58, 58);
      doc.rect(15, 102, 180, 8, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.text("Item", 20, 107);
      doc.text("Quantity", 100, 107, { align: "center" });
      doc.text("Rate", 140, 107, { align: "right" });
      doc.text("Amount", 180, 107, { align: "right" });
      const products = (
        invoice.sale?.parsedProducts || [
          { productType: "New Product", price: 3344.0 },
          { productType: "dwfwf", price: 344.0 },
        ]
      ).map((p) => ({
        productType: String(p.productType || "N/A").substring(0, 50),
        price: parseFloat(p.price) || 0,
      }));

      let y = 115;
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);

      products.forEach((product) => {
        doc.text(product.productType, 20, y);
        doc.text("1", 100, y, { align: "center" });
        doc.text(`$${product.price.toFixed(2)}`, 140, y, { align: "right" });
        doc.text(`$${product.price.toFixed(2)}`, 180, y, { align: "right" });

        y += 7;
      });

      // Totals section
      const total = products.reduce((sum, p) => sum + p.price, 0);
      y += 10;

      doc.setFontSize(10);
      doc.text("Subtotal:", 140, y, { align: "right" });
      doc.text(`$${total.toFixed(2)}`, 180, y, { align: "right" });
      y += 7;

      doc.text("Tax (0%):", 140, y, { align: "right" });
      doc.text("$0.00", 180, y, { align: "right" });
      y += 7;

      doc.text("Total:", 140, y, { align: "right" });
      doc.text(`$${total.toFixed(2)}`, 180, y, { align: "right" });
      y += 7;

      doc.text("Amount Received:", 140, y, { align: "right" });
      doc.text(`$${total.toFixed(2)}`, 180, y, { align: "right" });
      y += 5; // Reduced space before Notes

      // Notes section
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("Notes:", 15, y + 20); // Added 20 units top margin

      doc.setFont("helvetica", "normal");
      doc.text(
        "If you have any questions about this invoice, please contact us at",
        15,
        y + 25
      );

      doc.setTextColor(0, 0, 255);
      doc.text("contact@globalwebbuilders.com", 15, y + 30);

      // Paid stamp (only if invoice is marked as paid) positioned as in the image
      if (invoice.success) {
        doc.setTextColor(255, 0, 0);
        doc.setFontSize(40);
        doc.setFont("helvetica", "bold");
        doc.text("PAID", 190, 194, { align: "right" });
      }

      doc.save(`invoice_${invoiceNumber}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate invoice PDF. Please check the data.");
    }
  };
  const handleAddReminder = async () => {
    if (!reminderContent || !reminderType || !reminderDate) {
      toast.warn("All fields are required for reminder");
      return;
    }

    try {
      const parsedReminderDate = new Date(reminderDate);
      if (isNaN(parsedReminderDate)) {
        toast.error("Invalid reminder date");
        return;
      }

      const reminderData = {
        content: reminderContent,
        reminderType,
        reminderDate: parsedReminderDate,
        notebleId: sale.leadId,
        notebleType: "lead",
      };

      const response = await addReminder(reminderData);
      const newReminder = response.reminder || response.data || response;
      if (newReminder) {
        setReminders((prev) => [...prev, newReminder]);
        setReminderContent("");
        setReminderType("");
        setReminderDate("");
        setReminderModalOpen(false);
        toast.success("Reminder added successfully");
      }
    } catch (error) {
      toast.error("Failed to add reminder");
      console.error("Error adding reminder:", error);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return toast.error("Note cannot be empty");

    try {
      setAddingNote(true);
      const noteData = {
        content: newNote,
        type: "comment",
        notebleId: sale.leadId,
        notebleType: "lead",
      };

      const response = await addNote(noteData);
      const addedNote = response.note || response.data || response;
      if (addedNote) {
        setNotes((prev) => [...prev, addedNote]);
        setNewNote("");
        setNoteModalOpen(false);
        toast.success("Note added successfully");
      }
    } catch (error) {
      toast.error("Failed to add note");
      console.error("Error adding note:", error);
    } finally {
      setAddingNote(false);
    }
  };

  const handleDeleteNote = async (noteId) => {
    await confirmDelete(
      async () => {
        await deleteNote(noteId);
      },
      () => {
        setNotes((prev) => prev.filter((note) => note.id !== noteId));
      },
      "note"
    );
  };

  const handleDeleteReminder = async (reminderId) => {
    await confirmDelete(
      async () => {
        await deleteReminder(reminderId);
      },
      () => {
        setReminders((prev) =>
          prev.filter((reminder) => reminder.id !== reminderId)
        );
      },
      "reminder"
    );
  };

  const formatDate = (dateString) => {
    return dateString
      ? new Date(dateString).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "N/A";
  };

  const breadcrumbItems = [
    { title: "Dashboard", link: "/" },
    { title: "Sales", link: "/all-sales" },
    { title: "Sale Details", link: "#" },
  ];

  if (isLoading) {
    return (
      <div className="page-content">
        <Container fluid>
          <div className="text-center py-5">
            <Spinner color="primary" />
          </div>
        </Container>
      </div>
    );
  }

  if (!sale) {
    return (
      <div className="page-content">
        <Container fluid>
          <Card>
            <CardBody>
              <div className="text-center py-5">
                <h4>Sale not found</h4>
              </div>
            </CardBody>
          </Card>
        </Container>
      </div>
    );
  }

  const products = sale.parsedProducts || [
    {
      productType: sale.productType || "N/A",
      price: sale.price || 0,
      notes: sale.notes || "N/A",
    },
  ];
  const totalPrice = products.reduce(
    (sum, p) => sum + (parseFloat(p.price) || 0),
    0
  );

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs title="Sale Details" breadcrumbItems={breadcrumbItems} />
        <Card>
          <CardBody>
            <h5 className="mb-3">Sale Information</h5>
            <Row>
              <Col md={6}>
                <Table size="sm" bordered responsive hover>
                  <tbody>
                    <tr>
                      <th>ID</th>
                      <td>{sale.id}</td>
                    </tr>
                    <tr>
                      <th>Status</th>
                      <td>
                        <Badge
                          color={
                            sale.status === "converted"
                              ? "success"
                              : sale.status === "pending"
                              ? "warning"
                              : "danger"
                          }
                          className="text-uppercase"
                        >
                          {sale.status || "N/A"}
                        </Badge>
                      </td>
                    </tr>
                    <tr>
                      <th>Total Price</th>
                      <td>${parseFloat(totalPrice || 0).toFixed(2)}</td>
                    </tr>
                    <tr>
                      <th>Customer</th>
                      <td>
                        {sale.parsedLeadData
                          ? `${sale.parsedLeadData.first_name || "N/A"} ${
                              sale.parsedLeadData.last_name || "N/A"
                            }`
                          : "Unknown Customer"}
                      </td>
                    </tr>
                    <tr>
                      <th>Phone</th>
                      <td>{sale.parsedLeadData?.phone_number || "N/A"}</td>
                    </tr>
                    <tr>
                      <th>Email</th>
                      <td>{sale.parsedLeadData?.email || "N/A"}</td>
                    </tr>
                  </tbody>
                </Table>
              </Col>
              <Col md={6}>
                <Table size="sm" bordered responsive hover>
                  <tbody>
                    <tr>
                      <th>Lead Campaign</th>
                      <td>{sale.Lead?.campaignName || "N/A"}</td>
                    </tr>
                    <tr>
                      <th> Lead Created </th>
                      <td>{sale.User?.firstname || "N/A"}</td>
                    </tr>
                    <tr>
                      <th>State</th>
                      <td>{sale.parsedLeadData?.state || "N/A"}</td>
                    </tr>
                    <tr>
                      <th>Conversion Date</th>
                      <td>{formatDate(sale.conversionDate)}</td>
                    </tr>
                    <tr>
                      <th>Created At</th>
                      <td>{formatDate(sale.createdAt)}</td>
                    </tr>
                  </tbody>
                </Table>
              </Col>
            </Row>
            <h5 className="mt-4 mb-3">Products</h5>
            <Table size="sm" bordered responsive hover>
              <thead>
                <tr>
                  <th>Product Type</th>
                  <th>Price</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <tr key={index}>
                    <td>{product.productType || "N/A"}</td>
                    <td>${parseFloat(product.price || 0).toFixed(2)}</td>
                    <td>{product.notes || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <div className="mt-3">
              <Button
                color="primary"
                onClick={handleViewInvoice}
                disabled={invoiceLoading}
              >
                {invoiceLoading ? (
                  <>
                    <Spinner size="sm" /> Loading Invoice...
                  </>
                ) : (
                  "Generate Invoice"
                )}
              </Button>
            </div>
            <div className="mt-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h5>Notes</h5>
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
                  <Spinner size="sm" color="primary" /> Loading notes...
                </div>
              ) : notes.length > 0 ? (
                <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                  {notes.map((note, index) => (
                    <Card
                      key={note.id || index}
                      className="mb-2 border-0 bg-light"
                    >
                      <CardBody className="p-2">
                        <div className="d-flex justify-content-between align-items-start">
                          <div style={{ flex: "1 1 auto" }}>
                            <small>{note.content}</small>
                            <div className="text-muted small mt-1">
                              By {note.creator?.firstname || "System"}{" "}
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
                              {formatDate(note.createdAt)}
                            </small>
                            <Button
                              color="danger"
                              size="sm"
                              onClick={() => handleDeleteNote(note.id)}
                              title="Delete note"
                              style={{ padding: "2px 6px" }}
                            >
                              <FaTrash size={14} />
                            </Button>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              ) : (
                <Alert color="info" className="py-2 px-3 small">
                  No notes found for this sale.
                </Alert>
              )}
            </div>
            <div className="mt-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h5>Reminders</h5>
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
              ) : reminders.length > 0 ? (
                <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                  {reminders.map((reminder, index) => (
                    <Card
                      key={reminder.id || index}
                      className="mb-2 border-0 bg-warning-subtle"
                    >
                      <CardBody className="p-2">
                        <div className="d-flex justify-content-between align-items-start">
                          <div style={{ flex: "1 1 auto" }}>
                            <div
                              className="d-flex justify-content-between align-items-center"
                              style={{ marginRight: "15px" }}
                            >
                              <small>{reminder.content}</small>
                              <Badge color="info" pill>
                                {reminder.reminderType || "General"}
                              </Badge>
                            </div>
                            <div className="text-muted small mt-1">
                              By {reminder.creator?.firstname || "System"}{" "}
                              {reminder.creator?.lastname || ""}
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
                              Due: {formatDate(reminder.reminderDate)}
                            </small>
                            {hasAnyPermission(currentUser, [
                              "reminder:delete",
                            ]) && (
                              <Button
                                color="danger"
                                size="sm"
                                onClick={() =>
                                  handleDeleteReminder(reminder.id)
                                }
                                disabled={deletingReminderId === reminder.id}
                                title="Delete reminder"
                                style={{ padding: "2px 6px" }}
                              >
                                {deletingReminderId === reminder.id ? (
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
                  No reminders found for this sale.
                </Alert>
              )}
            </div>
            <div className="mt-4">
              <Button
                color="secondary"
                size="sm"
                onClick={() => navigate("/all-sales")}
              >
                Back to Sales
              </Button>
            </div>
          </CardBody>
        </Card>

        <Modal
          isOpen={invoiceModalOpen}
          toggle={() => setInvoiceModalOpen(false)}
          size="md"
        >
          <ModalHeader toggle={() => setInvoiceModalOpen(false)}>
            Invoice #{invoice?.invoiceNumber || "Loading..."}
          </ModalHeader>
          <ModalBody className="p-2">
            {invoice ? (
              <div className="invoice-container">
                {/* HEADER */}
                <div
                  className="invoice-header mb-2"
                  style={{ padding: "2px 0" }}
                >
                  <Row>
                    {/* LEFT */}
                    <Col xs={6}>
                      <img
                        src={logo}
                        alt="Logo"
                        style={{
                          width: "60px",
                          height: "auto",
                          marginBottom: "10px",
                        }}
                      />
                      <p
                        style={{
                          fontSize: "12px",
                          fontWeight: "bold",
                          marginBottom: "2px",
                        }}
                      >
                        Global Web Builders
                      </p>
                      <p style={{ fontSize: "10px", marginBottom: "5px" }}>
                        26 Broadway 3rd Floor, New York, NY 10004
                      </p>
                      <p
                        style={{
                          fontSize: "10px",
                          color: "#007BFF",
                          marginBottom: "10px",
                        }}
                      >
                        www.globalwebbuilders.com
                      </p>

                      <p
                        style={{
                          fontSize: "10px",
                          fontWeight: "bold",
                          marginBottom: "2px",
                        }}
                      >
                        Bill To:
                      </p>
                      <p style={{ fontSize: "10px", marginBottom: "2px" }}>
                        {JSON.parse(invoice.lead.leadData).first_name || "N/A"}{" "}
                        {JSON.parse(invoice.lead.leadData).last_name || "N/A"}
                      </p>
                      <p style={{ fontSize: "10px", marginBottom: "2px" }}>
                        {invoice.lead?.leadData
                          ? JSON.parse(invoice.lead.leadData).phone_number ||
                            "+932233443443"
                          : "+932233443443"}
                      </p>
                      <p
                        style={{
                          fontSize: "10px",
                          color: "#007BFF",
                          marginBottom: "2px",
                        }}
                      >
                        www.x-tremesteelfoundationrepair.com
                      </p>
                      <p style={{ fontSize: "10px", marginBottom: "0" }}>
                        {invoice.lead?.leadData
                          ? JSON.parse(invoice.lead.leadData).email ||
                            "Paul@x-tremesteelfoundationrepair.com"
                          : "Paul@x-tremesteelfoundationrepair.com"}
                      </p>
                    </Col>

                    {/* RIGHT */}
                    <Col xs={6} className="text-end">
                      <h4 style={{ marginBottom: "5px" }}>INVOICE</h4>
                      <p
                        style={{
                          fontSize: "10px",
                          color: "gray",
                          marginBottom: "15px",
                        }}
                      >
                        #{invoice.invoiceNumber}
                      </p>

                      <p style={{ fontSize: "10px", marginBottom: "3px" }}>
                        <strong>Date:</strong> {formatDate(invoice.date)}
                      </p>
                      <p style={{ fontSize: "10px", marginBottom: "3px" }}>
                        <strong>Payment Terms:</strong> Prepaid
                      </p>
                      <p style={{ fontSize: "10px", marginBottom: "15px" }}>
                        <strong>Due Date:</strong> {formatDate(invoice.date)}
                      </p>

                      <div
                        style={{
                          backgroundColor: "#f6f6f6",
                          padding: "5px 10px",
                          borderRadius: "5px",
                          display: "inline-block",
                        }}
                      >
                        <strong
                          style={{ fontSize: "10px", marginRight: "10px" }}
                        >
                          Balance Due
                        </strong>
                        <span style={{ fontSize: "12px", fontWeight: "bold" }}>
                          $0.00
                        </span>
                      </div>
                    </Col>
                  </Row>
                </div>
                <div className="invoice-details mb-4">
                  <Table bordered={false} size="sm" style={{ width: "100%" }}>
                    <thead>
                      <tr
                        style={{
                          backgroundColor: "#3a3a3a",
                          color: "white",
                          fontWeight: "bold",
                          fontSize: "12px",
                        }}
                      >
                        <th style={{ padding: "8px", color: "white" }}>Item</th>
                        <th
                          style={{
                            padding: "8px",
                            textAlign: "center",
                            color: "white",
                          }}
                        >
                          Quantity
                        </th>
                        <th
                          style={{
                            padding: "8px",
                            textAlign: "right",
                            color: "white",
                          }}
                        >
                          Rate
                        </th>
                        <th
                          style={{
                            padding: "8px",
                            textAlign: "right",
                            color: "white",
                          }}
                        >
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product, index) => (
                        <tr key={index}>
                          <td style={{ fontWeight: "bold", fontSize: "11px" }}>
                            {product.productType || "N/A"}
                          </td>
                          <td style={{ textAlign: "center" }}>1</td>
                          <td style={{ textAlign: "right" }}>
                            ${parseFloat(product.price || 0).toFixed(2)}
                          </td>
                          <td style={{ textAlign: "right" }}>
                            ${parseFloat(product.price || 0).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
                <div style={{ marginTop: "30px" }}>
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <table style={{ borderCollapse: "collapse" }}>
                      <tbody>
                        <tr>
                          <td
                            style={{
                              textAlign: "right",
                              fontSize: "11px",
                              paddingRight: "10px",
                              fontWeight: 700,
                              fontFamily: "Arial, sans-serif",
                              paddingBottom: "6px",
                            }}
                          >
                            Subtotal:
                          </td>

                          <td
                            style={{
                              textAlign: "right",
                              paddingBottom: "6px",
                            }}
                          >
                            ${totalPrice.toFixed(2)}
                          </td>
                        </tr>

                        <tr>
                          <td
                            style={{
                              textAlign: "right",
                              fontSize: "11px",
                              paddingRight: "10px",
                              fontWeight: "bold",
                              fontFamily: "Arial, sans-serif",
                              paddingBottom: "6px",
                            }}
                          >
                            Tax (0%):
                          </td>
                          <td
                            style={{
                              textAlign: "right",
                              paddingBottom: "6px",
                            }}
                          >
                            $0.00
                          </td>
                        </tr>

                        <tr>
                          <td
                            style={{
                              textAlign: "right",
                              fontSize: "11px",
                              paddingRight: "10px",
                              fontWeight: "bold",
                              fontFamily: "Arial, sans-serif",
                              paddingBottom: "6px",
                            }}
                          >
                            Total:
                          </td>
                          <td
                            style={{
                              textAlign: "right",
                              paddingBottom: "6px",
                            }}
                          >
                            ${totalPrice.toFixed(2)}
                          </td>
                        </tr>

                        <tr>
                          <td
                            style={{
                              textAlign: "right",
                              fontSize: "11px",
                              paddingRight: "10px",
                              fontFamily: "Arial, sans-serif",
                              fontWeight: "bold",
                            }}
                          >
                            Amount Received:
                          </td>
                          <td style={{ textAlign: "right" }}>
                            ${totalPrice.toFixed(2)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div
                  style={{
                    marginTop: "30px",
                    display: "flex",
                    alignItems: "flex-start",
                  }}
                >
                  {/* Notes Section */}
                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        fontSize: "10px",
                        fontWeight: "bold",
                        marginBottom: "2px",
                      }}
                    >
                      Notes:
                    </p>
                    <p style={{ fontSize: "10px", margin: "0 0 2px 0" }}>
                      If you have any questions about this invoice, please
                      contact us at
                    </p>
                    <p
                      style={{
                        fontSize: "10px",
                        color: "#007BFF",
                        margin: "0",
                      }}
                    >
                      contact@globalwebbuilders.com
                    </p>
                  </div>

                  {/* Paid Section */}
                  {invoice.success && (
                    <div
                      style={{
                        border: "3px solid red",
                        color: "red",
                        fontWeight: "bold",
                        padding: "5px 15px",
                        borderRadius: "5px",
                        fontSize: "18px",
                        marginLeft: "auto",
                        alignSelf: "flex-start",
                      }}
                    >
                      PAID
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center">
                <p>No invoice data available</p>
              </div>
            )}
          </ModalBody>
          <ModalFooter className="justify-content-between">
            <Button
              color="secondary"
              onClick={() => setInvoiceModalOpen(false)}
              size="sm"
            >
              Close
            </Button>
            <div>
              <Button
                color="primary"
                size="sm"
                className="me-2"
                onClick={handleDownloadInvoice}
                disabled={!invoice}
              >
                <FiDownload className="me-1" /> Download
              </Button>
            </div>
          </ModalFooter>
        </Modal>
        <Modal
          isOpen={reminderModalOpen}
          toggle={() => setReminderModalOpen(false)}
        >
          <ModalHeader toggle={() => setReminderModalOpen(false)}>
            Add Reminder
          </ModalHeader>
          <ModalBody>
            <Form>
              <FormGroup>
                <Label for="reminderContent">Reminder Content</Label>
                <Input
                  type="textarea"
                  id="reminderContent"
                  rows={2}
                  value={reminderContent}
                  onChange={(e) => setReminderContent(e.target.value)}
                  placeholder="What should be reminded?"
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
                <Label for="reminderDate">Due Date</Label>
                <Input
                  type="datetime-local"
                  id="reminderDate"
                  value={reminderDate}
                  onChange={(e) => setReminderDate(e.target.value)}
                />
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button
              color="secondary"
              onClick={() => setReminderModalOpen(false)}
            >
              Cancel
            </Button>
            <Button color="primary" onClick={handleAddReminder}>
              Add Reminder
            </Button>
          </ModalFooter>
        </Modal>
        <Modal isOpen={noteModalOpen} toggle={() => setNoteModalOpen(false)}>
          <ModalHeader toggle={() => setNoteModalOpen(false)}>
            Add Note
          </ModalHeader>
          <ModalBody>
            <textarea
              className="form-control"
              rows={3}
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Enter your note here..."
            />
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={() => setNoteModalOpen(false)}>
              Cancel
            </Button>
            <Button
              color="primary"
              onClick={handleAddNote}
              disabled={addingNote}
            >
              {addingNote ? "Adding..." : "Add Note"}
            </Button>
          </ModalFooter>
        </Modal>
      </Container>
    </div>
  );
};

export default SaleDetails;
