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
  FaLock,
  FaList,
  FaFolderOpen,
  FaCheckCircle,
  FaBan,
  FaTrash,
} from "react-icons/fa";
import { FiEdit2 } from "react-icons/fi";
import AddLeadModal from "../../components/Modals/AddLeadModal";
import ImportLeadsModal from "../../components/Modals/ImportLeadsModal";
import { useLocation, useNavigate } from "react-router-dom";
import {
  deleteOrder,
  fetchAllOrders,
  setOrderBlockStatus,
} from "../../services/orderService";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import useDeleteConfirmation from "../../components/Modals/DeleteConfirmation";
import useBlockUnblockConfirmation from "../../components/Modals/useBlockUnblockConfirmation";

const Allorders = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { confirmBlockUnblock } = useBlockUnblockConfirmation();
  const { confirmDelete } = useDeleteConfirmation();
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
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    pageSize: 10,
  });

  const toggleModal = (order = null) => {
    setSelectedOrder(order);
    setModalOpen(!modalOpen);
  };
  const toggleImportModal = () => setImportModalOpen(!importModalOpen);
  const toggleCategoryDropdown = () => setCategoryDropdownOpen((prev) => !prev);
  const toggleVendorDropdown = () => setVendorDropdownOpen((prev) => !prev);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const campaignId = queryParams.get("campaign");

    if (!campaignId) {
      setSelectedCampaign(null);
      setActiveFilter("all");
    } else {
      setSelectedCampaign(campaignId);
    }
  }, [location.search]);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const response = await fetchAllOrders(
          pagination.currentPage,
          pagination.pageSize
        );
        setOrdersData(response.data);
        setPagination((prev) => ({
          ...prev,
          totalPages: response.totalPages,
          totalItems: response.totalItems,
        }));
        console.log("All order", response);
      } catch (error) {
        console.error("Failed to load orders", error);
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, [pagination.currentPage, pagination.pageSize]);

  const handleImport = (file) => {
    console.log("Importing file:", file.name);
  };

  const handleEdit = (order) => {
    navigate("/create-order", { state: { editData: order } });
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, currentPage: newPage }));
  };

  const handlePageSizeChange = (newSize) => {
    setPagination((prev) => ({
      ...prev,
      pageSize: newSize,
      currentPage: 1,
    }));
  };

  const handleBlockUnblock = async (orderId, isBlocked) => {
    Swal.fire({
      title: `Confirm ${isBlocked ? "Unblock" : "Block"}`,
      html: `
        <style>
          .swal2-popup {
            width: 230px !important;
            height:180px !important;
            padding: 10px !important;
            font-size: 14px !important;
          }
          .swal2-title {
            font-size: 18px !important;
          }
          .swal2-html-container {
            font-size: 14px !important;
          }
          .swal2-actions {
            margin-top: 10px !important;
          }
          .swal2-confirm,
          .swal2-cancel {
            padding: 5px 10px !important;
            font-size: 14px !important;
          }
        </style>
        <p style="color: ${
          isBlocked ? "green" : "red"
        };">Are you sure you want to ${
        isBlocked ? "unblock" : "block"
      } this order?</p>
      `,
      showCancelButton: true,
      confirmButtonColor: isBlocked ? "#3085d6" : "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: `Yes, ${isBlocked ? "Unblock" : "Block"}`,
      cancelButtonText: "No, Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await setOrderBlockStatus(orderId, !isBlocked);
          toast.success(
            `Order ${isBlocked ? "unblocked" : "blocked"} successfully`
          );
          const response = await fetchAllOrders(
            pagination.currentPage,
            pagination.pageSize
          );
          setOrdersData(Array.isArray(response.data) ? response.data : []);
          setPagination((prev) => ({
            ...prev,
            totalPages: response.totalPages || 1,
            totalItems: response.totalItems || 0,
            currentPage: response.currentPage || 1,
          }));
        } catch (error) {
          toast.error(
            error.message ||
              `Failed to ${isBlocked ? "unblock" : "block"} order`
          );
        }
      }
    });
  };

  const handleDelete = async (orderId) => {
    await confirmDelete(
      async () => {
        await deleteOrder(orderId);
      },
      async () => {
        const response = await fetchAllOrders(
          pagination.currentPage,
          pagination.pageSize
        );
        setOrdersData(Array.isArray(response.data) ? response.data : []);
        setPagination((prev) => ({
          ...prev,
          totalPages: response.totalPages || 1,
          totalItems: response.totalItems || 0,
          currentPage: response.currentPage || 1,
        }));
      },
      "order"
    );
  };

  const filteredOrders = useMemo(() => {
    let filtered = Array.isArray(ordersData) ? ordersData : [];

    if (selectedCampaign) {
      filtered = filtered.filter(
        (order) => order.campaign_id == selectedCampaign
      );
    }

    switch (activeFilter) {
      case "open":
        filtered = filtered.filter((order) => !order.is_blocked);
        break;
      case "complete":
        filtered = filtered.filter(
          (order) => order.priority_level === "Onhold"
        );
        break;
      case "blocked":
        filtered = filtered.filter((order) => order.is_blocked);
        break;
      default:
        break;
    }

    return filtered.sort((a, b) => {
      const dateA = a.created_at ? new Date(a.created_at) : new Date(0);
      const dateB = b.created_at ? new Date(b.created_at) : new Date(0);
      return dateA - dateB;
    });
  }, [ordersData, activeFilter, selectedCampaign]);

  const categories = [
    "Callback -Final Expense",
    "Callback -Final Expense(Direct Mail)",
  ];
  const vendors = ["Vendor2 Secok", "Junaid Tariq"];

  const handleLeadSubmit = (leadResponse) => {
    const orderId = leadResponse.order_id;
    setOrdersData((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              remainingLeads: order.remainingLeads - 1,
            }
          : order
      )
    );
  };
  const columns = useMemo(
    () => [
      {
        Header: "Order Id",
        accessor: "",
        disableFilters: true,
        width: 60,
        Cell: ({ row }) => <div>{row.index + 1}</div>,
      },
      {
        Header: "Agent Name",
        accessor: "agent",
        disableFilters: true,
        width: 100,
        Cell: ({ row }) => (
          <div
            className="text-primary"
            style={{ cursor: "pointer" }}
            onClick={() => {
              sessionStorage.setItem("fromCampaignContext", "true");
              navigate(`/lead-index?orderId=${row.original.id}`);
            }}
          >
            {row.original.agent}
          </div>
        ),
      },
      {
        Header: "Options",
        disableFilters: true,
        Cell: (cellProps) => (
          <ButtonGroup vertical className="w-100">
            <Button
              color="primary"
              size="sm"
              className="d-flex align-items-center justify-content-center text-nowrap mb-2"
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
        width: 200,
      },
      {
        Header: "Leads Requested",
        accessor: "lead_requested",
        disableFilters: true,
        width: 40,
      },
      {
        Header: "Remaining Leads",
        accessor: "remainingLeads",
        disableFilters: true,
        width: 20,
      },
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

      {
        Header: "Priority Level",
        accessor: "priority_level",
        disableFilters: true,
        width: 60,
      },
      {
        Header: "Status",
        accessor: "is_blocked",
        disableFilters: true,
        Cell: ({ value }) => (
          <Badge color={value ? "danger" : "success"}>
            {value ? "Blocked" : "Active"}
          </Badge>
        ),
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
            <Button
              color={row.original.is_blocked ? "danger" : "secondary"}
              size="sm"
              className="px-2 py-1"
              onClick={() =>
                handleBlockUnblock(row.original.id, row.original.is_blocked)
              }
            >
              {row.original.is_blocked ? (
                <FaLock size={14} />
              ) : (
                <FaUnlock size={14} />
              )}
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
    ],
    []
  );

  const breadcrumbItems = [
    { title: "Dashboard", link: "/" },
    { title: "Orders", link: "#" },
    { title: "All Orders", link: "#" },
  ];

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="ALL ORDERS" breadcrumbItems={breadcrumbItems} />

          <Row className="mb-3">
            <Col md={12}>
              <div className="d-flex w-80 gap-2">
                <Button
                  color={activeFilter === "all" ? "primary" : "light"}
                  onClick={() => setActiveFilter("all")}
                  className="flex-fill d-flex align-items-center justify-content-center gap-2"
                  style={{
                    fontSize: "0.85rem",
                    padding: "6px 6px",
                    minHeight: "36px",
                  }}
                >
                  <FaList /> All Orders
                </Button>
                <Button
                  color={activeFilter === "open" ? "primary" : "light"}
                  onClick={() => setActiveFilter("open")}
                  className="flex-fill d-flex align-items-center justify-content-center gap-2"
                  style={{
                    fontSize: "0.85rem",
                    padding: "6px 6px",
                    minHeight: "36px",
                  }}
                >
                  <FaFolderOpen /> Open Orders
                </Button>
                <Button
                  color={activeFilter === "complete" ? "primary" : "light"}
                  onClick={() => setActiveFilter("complete")}
                  className="flex-fill d-flex align-items-center justify-content-center gap-2"
                  style={{
                    fontSize: "0.85rem",
                    padding: "6px 6px",
                    minHeight: "36px",
                  }}
                >
                  <FaCheckCircle /> Complete Orders
                </Button>
                <Button
                  color={activeFilter === "blocked" ? "primary" : "light"}
                  onClick={() => setActiveFilter("blocked")}
                  className="flex-fill d-flex align-items-center justify-content-center gap-2"
                  style={{
                    fontSize: "0.85rem",
                    padding: "6px 6px",
                    minHeight: "20px",
                  }}
                >
                  <FaBan /> Blocked Orders
                </Button>
              </div>
            </Col>
          </Row>

          <Card>
            <CardBody>
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
                        fontSize: "0.85rem",
                        padding: "6px 10px",
                        minHeight: "36px",
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
                        fontSize: "0.85rem",
                        padding: "6px 10px",
                        minHeight: "36px",
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
                isPagination={true}
                iscustomPageSize={false}
                isBordered={false}
                customPageSize={pagination.pageSize}
                className="custom-table"
                pagination={pagination}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
              />
            </CardBody>
          </Card>
        </Container>
      </div>

      <AddLeadModal
        isOpen={modalOpen}
        toggle={() => setModalOpen(!modalOpen)}
        onSubmit={handleLeadSubmit}
        selectedOrder={selectedOrder}
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
