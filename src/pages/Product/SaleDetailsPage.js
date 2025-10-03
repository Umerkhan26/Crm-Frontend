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

  // const handleViewInvoice = async () => {
  //   if (!sale?.leadId) {
  //     toast.error("No lead associated with this sale");
  //     return;
  //   }

  //   try {
  //     setInvoiceLoading(true);
  //     const invoiceData = await fetchInvoiceByLeadId(sale.leadId);
  //     console.log("Invoice data:", JSON.stringify(invoiceData, null, 2)); // Debug log
  //     if (!invoiceData.success || !invoiceData.data) {
  //       throw new Error("Invalid invoice data received");
  //     }
  //     setInvoice(invoiceData.data);
  //     setInvoiceModalOpen(true);
  //   } catch (error) {
  //     console.error("Error in handleViewInvoice:", error);
  //     toast.error(`Failed to fetch invoice: ${error.message}`);
  //   } finally {
  //     setInvoiceLoading(false);
  //   }
  // };

  const handleViewInvoice = async () => {
    if (!sale?.leadId) {
      toast.error("No lead associated with this sale");
      return;
    }

    try {
      setInvoiceLoading(true);
      const invoiceData = await fetchInvoiceByLeadId(sale.leadId);

      if (!invoiceData.success || !invoiceData.data) {
        throw new Error("Invalid invoice data received");
      }

      // Parse leadData if it's a string, otherwise use as-is
      let parsedInvoiceData = { ...invoiceData.data };

      if (parsedInvoiceData.lead?.leadData) {
        if (typeof parsedInvoiceData.lead.leadData === "string") {
          try {
            parsedInvoiceData.lead.leadData = JSON.parse(
              parsedInvoiceData.lead.leadData
            );
          } catch (parseError) {
            console.warn(
              "Failed to parse leadData as JSON, using as string:",
              parseError
            );
          }
        }
        // If it's already an object, leave it as-is
      }

      // Also handle sale data if needed
      if (parsedInvoiceData.sale?.Lead?.leadData) {
        if (typeof parsedInvoiceData.sale.Lead.leadData === "string") {
          try {
            parsedInvoiceData.sale.Lead.leadData = JSON.parse(
              parsedInvoiceData.sale.Lead.leadData
            );
          } catch (parseError) {
            console.warn(
              "Failed to parse sale.Lead.leadData as JSON:",
              parseError
            );
          }
        }
      }

      setInvoice(parsedInvoiceData);
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
                        {/* {JSON.parse(invoice.lead.leadData).first_name || "N/A"}{" "}
                        {JSON.parse(invoice.lead.leadData).last_name || "N/A"} */}
                        {invoice.lead.leadData.first_name || "N/A"}{" "}
                        {invoice.lead.leadData.last_name || "N/A"}
                      </p>
                      <p style={{ fontSize: "10px", marginBottom: "2px" }}>
                        {invoice.lead?.leadData
                          ? // ? JSON.parse(invoice.lead.leadData).phone_number ||
                            //   "+932233443443"
                            invoice.lead.leadData.phone_number ||
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
                          ? // ? JSON.parse(invoice.lead.leadData).email ||
                            invoice.lead.leadData.email ||
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
