import React, { useEffect, useMemo, useState } from "react";
import TableContainer from "../../components/Common/TableContainer";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import {
  Card,
  CardBody,
  Container,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button,
  Row,
  Col,
  Badge,
  ButtonGroup,
} from "reactstrap";
import {
  FaFilter,
  FaUserTag,
  FaBoxes,
  FaPlus,
  FaFileImport,
  FaUnlock,
  FaList,
  FaFolderOpen,
  FaCheckCircle,
  FaBan,
  FaTrash,
} from "react-icons/fa";
import { FiEdit2 } from "react-icons/fi";
import AddLeadModal from "../../components/Modals/AddLeadModal";
import ImportLeadsModal from "../../components/Modals/ImportLeadsModal";
import { useNavigate } from "react-router-dom";
import { deleteOrder, fetchAllOrders } from "../../services/orderService";
import { toast } from "react-toastify";

const Allorders = () => {
  const navigate = useNavigate();
  // State for dropdowns and filters
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [vendorDropdownOpen, setVendorDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState("Choose Category...");
  const [selectedVendor, setSelectedVendor] = useState("Choose Vendor...");
  const [activeFilter, setActiveFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [ordersData, setOrdersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const toggleModal = (order = null) => {
    setSelectedOrder(order);
    setModalOpen(!modalOpen);
  };
  const toggleImportModal = () => setImportModalOpen(!importModalOpen);
  const toggleCategoryDropdown = () => setCategoryDropdownOpen((prev) => !prev);
  const toggleVendorDropdown = () => setVendorDropdownOpen((prev) => !prev);

  const handleSubmit = (formData) => {
    console.log("Form submitted:", formData);
  };

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await fetchAllOrders();
        console.log("all orders", data);
        setOrdersData(data);
      } catch (error) {
        console.error("Failed to load orders", error);
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, []);

  const handleImport = (file) => {
    console.log("Importing file:", file.name);
  };

  const handleEdit = (order) => {
    navigate("/create-order", { state: { editData: order } });
  };

  // Filter orders
  const filteredOrders = useMemo(() => {
    switch (activeFilter) {
      case "open":
        return ordersData.filter((order) => order.status === "Active");
      case "complete":
        return ordersData.filter((order) => order.status === "Completed");
      case "blocked":
        return ordersData.filter((order) => order.status === "Blocked");
      default:
        return ordersData;
    }
  }, [ordersData, activeFilter]);

  const categories = [
    "Callback -Final Expense",
    "Callback -Final Expense(Direct Mail)",
  ];
  const vendors = ["Vendor2 Secok", "Junaid Tariq"];

  const handleDelete = async (orderId) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        await deleteOrder(orderId);
        toast.success("Order deleted successfully");

        // Refresh the orders list
        const data = await fetchAllOrders();
        setOrdersData(data);
      } catch (error) {
        toast.error(error.message || "Failed to delete order");
      }
    }
  };

  const columns = useMemo(() => [
    {
      Header: "Order Id",
      accessor: "",
      disableFilters: true,
      width: 100,
      Cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      Header: "Agent Name",
      accessor: "agent",
      disableFilters: true,
      width: 120,
    },
    {
      Header: "Options",
      disableFilters: true,
      Cell: (cellProps) => (
        <ButtonGroup vertical className="w-100">
          <Button
            color="primary"
            size="sm"
            className="d-flex align-items-center justify-content-center text-nowrap  mb-2"
            onClick={() => toggleModal(cellProps.row.original)}
          >
            <FaPlus className="me-1" /> Add Lead
          </Button>
          <Button
            color="success"
            size="sm"
            className="d-flex align-items-center justify-content-center text-nowrap"
            onClick={toggleImportModal}
          >
            <FaFileImport className="me-1" /> Import
          </Button>
        </ButtonGroup>
      ),
      width: 150, // Reduced width
    },
    {
      Header: "Leads Requested",
      accessor: "lead_requested",
      disableFilters: true,
      width: 100,
    },
    {
      Header: "Remaining Leads",
      accessor: "remainingLeads",
      disableFilters: true,
      width: 100,
    },
    // {
    //   Header: "Vendor",
    //   disableFilters: true,
    //   Cell: ({ row }) => <div>{row.original.vendor}</div>,
    //   width: 120,
    // },
    {
      Header: "Notes & Area",
      accessor: "notes",
      disableFilters: true,
      Cell: ({ row }) => (
        <div
          className="text-truncate"
          style={{ maxWidth: "150px" }}
          title={row.original.notes}
        >
          {row.original.notes}
        </div>
      ),
      width: 150,
    },
    // {
    //   Header: "Status",
    //   accessor: "status",
    //   disableFilters: true,
    //   Cell: ({ value }) => (
    //     <Badge
    //       color={
    //         value === "Active"
    //         ? "success"
    //         : value === "Completed"
    //         ? "primary"
    //         : "danger"
    //       }
    //     >
    //       {value}
    //     </Badge>
    //   ),
    //   width: 100,
    // },

    {
      Header: "Status",
      accessor: "status",
      disableFilters: true,
      Cell: () => <Badge color="success">Active</Badge>,
      width: 100,
    },
    {
      Header: "Action",
      disableFilters: true,
      Cell: ({ row }) => (
        <div className="d-flex gap-2">
          <Button
            color="primary"
            size="sm"
            className="px-2 py-1"
            onClick={() => handleEdit(row.original)}
          >
            <FiEdit2 size={14} />
          </Button>
          <Button color="secondary" size="sm" className="px-2 py-1">
            <FaUnlock size={14} />
          </Button>
          <Button
            color="danger"
            size="sm"
            className="px-2 py-1"
            onClick={() => handleDelete(row.original.id)}
          >
            <FaTrash size={14} />
          </Button>
        </div>
      ),
      width: 120,
    },
  ]);

  const breadcrumbItems = [
    { title: "Orders", link: "/" },
    { title: "All Orders", link: "#" },
  ];

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="ALL ORDERS" breadcrumbItems={breadcrumbItems} />

          {/* Filter Buttons Row */}
          <Row className="mb-3">
            <Col md={12}>
              <div className="d-flex w-100 gap-2">
                <Button
                  color={activeFilter === "all" ? "primary" : "light"}
                  onClick={() => setActiveFilter("all")}
                  className="flex-fill d-flex align-items-center justify-content-center gap-2"
                >
                  <FaList /> All Orders
                </Button>
                <Button
                  color={activeFilter === "open" ? "primary" : "light"}
                  onClick={() => setActiveFilter("open")}
                  className="flex-fill d-flex align-items-center justify-content-center gap-2"
                >
                  <FaFolderOpen /> Open Orders
                </Button>
                <Button
                  color={activeFilter === "complete" ? "primary" : "light"}
                  onClick={() => setActiveFilter("complete")}
                  className="flex-fill d-flex align-items-center justify-content-center gap-2"
                >
                  <FaCheckCircle /> Complete Orders
                </Button>
                <Button
                  color={activeFilter === "blocked" ? "primary" : "light"}
                  onClick={() => setActiveFilter("blocked")}
                  className="flex-fill d-flex align-items-center justify-content-center gap-2"
                >
                  <FaBan /> Blocked Orders
                </Button>
              </div>
            </Col>
          </Row>

          <Card>
            <CardBody>
              {/* Category and Vendor Dropdowns */}
              <Row className="mb-3">
                <Col md={5}>
                  <Dropdown
                    isOpen={categoryDropdownOpen}
                    toggle={toggleCategoryDropdown}
                  >
                    <DropdownToggle
                      caret
                      className="w-100 d-flex align-items-center justify-content-between"
                      style={{
                        backgroundColor: "#f8f9fa",
                        borderColor: "#dee2e6",
                        color: "#495057",
                      }}
                    >
                      <div className="d-flex align-items-center">
                        <FaBoxes className="me-2" />
                        {selectedCategory}
                      </div>
                    </DropdownToggle>
                    <DropdownMenu className="w-100">
                      <DropdownItem
                        header
                        className="d-flex align-items-center"
                      >
                        <FaFilter className="me-2" />
                        Select Category
                      </DropdownItem>
                      {categories.map((category, index) => (
                        <DropdownItem
                          key={index}
                          onClick={() => setSelectedCategory(category)}
                          active={selectedCategory === category}
                          className="d-flex align-items-center"
                        >
                          <FaBoxes className="me-2" />
                          {category}
                        </DropdownItem>
                      ))}
                    </DropdownMenu>
                  </Dropdown>
                </Col>
                <Col md={5}>
                  <Dropdown
                    isOpen={vendorDropdownOpen}
                    toggle={toggleVendorDropdown}
                  >
                    <DropdownToggle
                      caret
                      className="w-100 d-flex align-items-center justify-content-between"
                      style={{
                        backgroundColor: "#f8f9fa",
                        borderColor: "#dee2e6",
                        color: "#495057",
                      }}
                    >
                      <div className="d-flex align-items-center">
                        <FaUserTag className="me-2" />
                        {selectedVendor}
                      </div>
                    </DropdownToggle>
                    <DropdownMenu className="w-100">
                      <DropdownItem
                        header
                        className="d-flex align-items-center"
                      >
                        <FaFilter className="me-2" />
                        Select Vendor
                      </DropdownItem>
                      {vendors.map((vendor, index) => (
                        <DropdownItem
                          key={index}
                          onClick={() => setSelectedVendor(vendor)}
                          active={selectedVendor === vendor}
                          className="d-flex align-items-center"
                        >
                          <FaUserTag className="me-2" />
                          {vendor}
                        </DropdownItem>
                      ))}
                    </DropdownMenu>
                  </Dropdown>
                </Col>
              </Row>

              <TableContainer
                columns={columns || []}
                data={filteredOrders || []}
                isPagination={false}
                iscustomPageSize={false}
                isBordered={false}
                customPageSize={10}
                className="custom-table"
              />
            </CardBody>
          </Card>
        </Container>
      </div>

      {/* Lead Form Modal */}
      <AddLeadModal
        isOpen={modalOpen}
        toggle={() => setModalOpen(!modalOpen)}
        onSubmit={(data) => console.log("Lead Submitted", data)}
        selectedOrder={selectedOrder}
        template={{
          agent: "",
          campaign_id: "",
          state: "",
          priority_level: "",
          start_date: "", // will be rendered as a date input
        }}
      />

      <ImportLeadsModal
        isOpen={importModalOpen}
        toggle={toggleImportModal}
        onImport={handleImport}
      />
    </React.Fragment>
  );
};

export default Allorders;
