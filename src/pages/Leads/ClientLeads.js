import React, { useMemo, useState, useEffect } from "react";
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
  Spinner,
} from "reactstrap";
import { useLocation } from "react-router-dom";
import { FaFilter, FaUserTag, FaBoxes } from "react-icons/fa";
import { FiEdit2, FiTrash2, FiRefreshCw } from "react-icons/fi";
import ClientLeadModal from "../../components/Modals/ClientLeadModal";
import { useNavigate } from "react-router-dom";
import useDeleteConfirmation from "../../components/Modals/DeleteConfirmation";
import {
  deleteLead,
  getAllClientLeads,
  updateLeadStatus,
} from "../../services/ClientleadService";
import { toast } from "react-toastify";

const ClientLeads = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const orderId = queryParams.get("orderId");
  const [currentFilter, setCurrentFilter] = useState({
    orderId: orderId || null,
    searchText: "",
    client: "Choose Client...",
    vendor: "Choose Vendor...",
    status: "all",
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    pageSize: 10,
  });

  const navigate = useNavigate();
  const [clientDropdownOpen, setClientDropdownOpen] = useState(false);
  const [vendorDropdownOpen, setVendorDropdownOpen] = useState(false);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState("Choose Client...");
  const [selectedVendor, setSelectedVendor] = useState("Choose Vendor...");
  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { confirmDelete } = useDeleteConfirmation();

  useEffect(() => {
    const newOrderId = queryParams.get("orderId");
    setCurrentFilter((prev) => ({
      ...prev,
      orderId: newOrderId || null,
    }));
  }, [location.search]);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllClientLeads(
        pagination.currentPage,
        pagination.pageSize,
        currentFilter.orderId
      );

      console.log("ALL CLIENT LEAD", response);
      setLeads(response.data || []);
      setPagination((prev) => ({
        ...prev,
        totalPages: response.totalPages || 1,
        totalItems: response.totalItems || 0,
      }));
    } catch (err) {
      console.error("Fetch leads error:", err);
      setError(err.message);
      toast.error("Failed to fetch leads");
    } finally {
      setLoading(false);
    }
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

  useEffect(() => {
    fetchLeads();
  }, [pagination.currentPage, pagination.pageSize, currentFilter.orderId]);

  const toggleClientDropdown = () => setClientDropdownOpen((prev) => !prev);
  const toggleVendorDropdown = () => setVendorDropdownOpen((prev) => !prev);
  const toggleStatusDropdown = () => setStatusDropdownOpen((prev) => !prev);

  const handleRowClick = (row) => {
    setSelectedLead(row.original);
    setIsModalOpen(true);
  };

  const handleEdit = (lead) => {
    navigate("/add-lead", {
      state: {
        editData: {
          ...lead,
          campaignType: lead.campaignName || lead.campaignType,
          isClientLead: true,
        },
      },
    });
  };

  const handleDelete = async (id) => {
    await confirmDelete(
      () => deleteLead(id),
      () => fetchLeads(),
      "lead"
    );
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      setLoading(true);

      // Optimistically update the local state
      setLeads((prevLeads) =>
        prevLeads.map((lead) =>
          lead.id === id ? { ...lead, status: newStatus } : lead
        )
      );

      const response = await updateLeadStatus(id, newStatus);
      console.log("Update Lead Status Response:", response);
      if (response.success) {
        await fetchLeads(); // Refresh data from server to confirm
        toast.success(`Lead status updated to ${newStatus}`);
      } else {
        throw new Error(response.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      // Revert optimistic update on error
      await fetchLeads(); // Fetch latest data to revert any incorrect local changes
      toast.error(`Failed to update status: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const filteredLeads = useMemo(() => {
    let filtered = [...leads];

    if (currentFilter.orderId) {
      const orderIdNum = Number(currentFilter.orderId);
      filtered = filtered.filter((lead) => lead.orderId === orderIdNum);
    }

    if (currentFilter.status !== "all") {
      filtered = filtered.filter(
        (lead) => lead.status === currentFilter.status
      );
    }

    return filtered.filter((lead) =>
      Object.values(lead.leadData || {}).some((val) =>
        String(val).toLowerCase().includes(searchText.toLowerCase())
      )
    );
  }, [leads, searchText, currentFilter.orderId, currentFilter.status]);

  const clients = ["Client 1", "Client 2", "Client 3"];
  const vendors = ["Vendor 1", "Vendor 2", "Vendor 3"];
  const statusOptions = ["all", "pending", "accepted", "rejected"];

  const columns = useMemo(
    () => [
      {
        Header: "Agent Name",
        accessor: "leadData.agent_name",
        disableFilters: true,
        width: 120,
        Cell: ({ row, value }) => (
          <div
            style={{ cursor: "pointer" }}
            onClick={() => handleRowClick(row)}
          >
            {value}
          </div>
        ),
      },
      {
        Header: "First Name",
        accessor: "leadData.first_name",
        disableFilters: true,
        width: 120,
        Cell: ({ row, value }) => (
          <div
            style={{ cursor: "pointer" }}
            onClick={() => handleRowClick(row)}
          >
            {value}
          </div>
        ),
      },
      {
        Header: "Last Name",
        accessor: "leadData.last_name",
        disableFilters: true,
        width: 120,
        Cell: ({ row, value }) => (
          <div
            style={{ cursor: "pointer" }}
            onClick={() => handleRowClick(row)}
          >
            {value}
          </div>
        ),
      },
      {
        Header: "State",
        accessor: "leadData.state",
        disableFilters: true,
        width: 80,
        Cell: ({ row, value }) => (
          <div
            style={{ cursor: "pointer" }}
            onClick={() => handleRowClick(row)}
          >
            {value}
          </div>
        ),
      },
      {
        Header: "Phone Number",
        accessor: "leadData.phone_number",
        disableFilters: true,
        width: 150,
        Cell: ({ row, value }) => (
          <div
            style={{ cursor: "pointer" }}
            onClick={() => handleRowClick(row)}
          >
            {value}
          </div>
        ),
      },
      // {
      //   Header: "Status",
      //   accessor: "status",
      //   disableFilters: true,
      //   width: 100,
      //   Cell: ({ value }) => (
      //     <Badge
      //       color={
      //         value === "accepted"
      //           ? "success"
      //           : value === "rejected"
      //           ? "danger"
      //           : "secondary"
      //       }
      //       className="text-capitalize"
      //     >
      //       {value}
      //     </Badge>
      //   ),
      // },
      // {
      //   Header: "Options",
      //   disableFilters: true,
      //   Cell: ({ row }) => {
      //     const [isUpdating, setIsUpdating] = useState(false);
      //     const lead = row.original;

      //     const handleStatusClick = async (newStatus) => {
      //       setIsUpdating(true);
      //       try {
      //         await handleStatusUpdate(lead.id, newStatus);
      //       } catch (error) {
      //         // Error is already handled in handleStatusUpdate
      //       } finally {
      //         setIsUpdating(false);
      //       }
      //     };

      //     return (
      //       <div className="d-flex gap-2">
      //         <Button
      //           color="success"
      //           size="sm"
      //           className="px-3"
      //           disabled={isUpdating || lead.status === "accepted"}
      //           onClick={() => handleStatusClick("accepted")}
      //         >
      //           {isUpdating && lead.status === "pending" ? (
      //             <Spinner size="sm" />
      //           ) : lead.status === "accepted" ? (
      //             "Accept"
      //           ) : (
      //             "Accept"
      //           )}
      //         </Button>
      //         <Button
      //           color="danger"
      //           size="sm"
      //           className="px-3"
      //           disabled={isUpdating || lead.status === "rejected"}
      //           onClick={() => handleStatusClick("rejected")}
      //         >
      //           {isUpdating && lead.status === "pending" ? (
      //             <Spinner size="sm" />
      //           ) : lead.status === "rejected" ? (
      //             "Reject"
      //           ) : (
      //             "Reject"
      //           )}
      //         </Button>
      //       </div>
      //     );
      //   },
      //   width: 150,
      // },
      {
        Header: "Action",
        disableFilters: true,
        Cell: ({ row }) => (
          <div className="d-flex gap-2">
            <Button
              color="primary"
              size="sm"
              className="px-2"
              onClick={() => handleEdit(row.original)}
            >
              <FiEdit2 size={14} />
            </Button>
            <Button
              color="secondary"
              size="sm"
              className="px-2"
              onClick={fetchLeads}
            >
              <FiRefreshCw size={14} />
            </Button>
            <Button
              color="danger"
              size="sm"
              className="px-2"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(row.original.id);
              }}
            >
              <FiTrash2 size={14} />
            </Button>
          </div>
        ),
        width: 180,
      },
    ],
    []
  );

  const breadcrumbItems = [
    { title: "Dashboard", link: "/" },
    { title: "Leads", link: "/AllLeads" },
    {
      title: currentFilter.orderId
        ? `Order #${currentFilter.orderId} Leads`
        : "All Client Leads",
      link: "#",
    },
  ];

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="ALL CLIENT" breadcrumbItems={breadcrumbItems} />
          <Card>
            <CardBody>
              {loading && <p>Loading leads...</p>}
              {error && <p className="text-danger">Error: {error}</p>}
              {!loading && !error && filteredLeads.length === 0 && (
                <p>
                  No leads found for Order #{currentFilter.orderId || "All"}.
                </p>
              )}
              {!loading && !error && filteredLeads.length > 0 && (
                <>
                  <Row className="mb-3">
                    <Col md={4}>
                      <Dropdown
                        isOpen={clientDropdownOpen}
                        toggle={toggleClientDropdown}
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
                            {selectedClient}
                          </div>
                        </DropdownToggle>
                        <DropdownMenu className="w-100">
                          <DropdownItem
                            header
                            className="d-flex align-items-center"
                          >
                            <FaFilter className="me-2" />
                            Select Client
                          </DropdownItem>
                          {clients.map((client, index) => (
                            <DropdownItem
                              key={index}
                              onClick={() => setSelectedClient(client)}
                              active={selectedClient === client}
                              className="d-flex align-items-center"
                            >
                              <FaUserTag className="me-2" />
                              {client}
                            </DropdownItem>
                          ))}
                        </DropdownMenu>
                      </Dropdown>
                    </Col>
                    <Col md={4}>
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
                            <FaBoxes className="me-2" />
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
                              <FaBoxes className="me-2" />
                              {vendor}
                            </DropdownItem>
                          ))}
                        </DropdownMenu>
                      </Dropdown>
                    </Col>

                    <Col md={3}>
                      <Button
                        color="primary"
                        className="w-100 d-flex align-items-center justify-content-center"
                        style={{
                          fontSize: "0.85rem",
                          padding: "6px 10px",
                          minHeight: "36px",
                        }}
                        onClick={() => {
                          console.log(
                            "Filter clicked with:",
                            selectedClient,
                            selectedVendor,
                            currentFilter.status
                          );
                        }}
                      >
                        <FaFilter className="me-2" />
                        Filter
                      </Button>
                    </Col>
                  </Row>

                  <div className="d-flex justify-content-end align-items-end mb-3">
                    <div>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                      />
                    </div>
                  </div>

                  <TableContainer
                    columns={columns || []}
                    data={filteredLeads || []}
                    isPagination={true}
                    iscustomPageSize={false}
                    isBordered={false}
                    className="custom-table"
                    pagination={pagination}
                    onPageChange={handlePageChange}
                    onPageSizeChange={handlePageSizeChange}
                  />
                </>
              )}
            </CardBody>
          </Card>
        </Container>
      </div>

      <ClientLeadModal
        isOpen={isModalOpen}
        toggle={() => setIsModalOpen(!isModalOpen)}
        leadData={selectedLead}
        onStatusUpdate={handleStatusUpdate}
        refreshLeads={fetchLeads}
      />
    </React.Fragment>
  );
};

export default ClientLeads;
