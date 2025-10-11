import React, { useMemo, useState, useEffect } from "react";
import TableContainer from "../../components/Common/TableContainer";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { useDebounce } from "use-debounce";
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
} from "reactstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { FaFilter, FaUserTag, FaBoxes } from "react-icons/fa";
import { FiEdit2, FiTrash2, FiRefreshCw } from "react-icons/fi";
import useDeleteConfirmation from "../../components/Modals/DeleteConfirmation";
import {
  deleteLead,
  getAllClientLeads,
  // updateLeadStatus,
} from "../../services/ClientleadService";
import { toast } from "react-toastify";
import { fetchVendorsAndClients } from "../../services/orderService";
import { hasAnyPermission } from "../../utils/permissions";
import { useSelector } from "react-redux";

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
  // const [clientDropdownOpen, setClientDropdownOpen] = useState(false);
  // const [vendorDropdownOpen, setVendorDropdownOpen] = useState(false);
  // const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  // const [selectedClient, setSelectedClient] = useState("Choose Client...");
  // const [selectedVendor, setSelectedVendor] = useState("Choose Vendor...");
  const [searchText, setSearchText] = useState("");
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // New states for API data
  // const [clients, setClients] = useState([]);
  // const [vendors, setVendors] = useState([]);

  const { confirmDelete } = useDeleteConfirmation();

  const currentUser = useSelector((state) => state.Login?.user);
  const reduxPermissions = useSelector(
    (state) => state.Permissions?.permissions
  );

  // Define permissions for client lead actions
  const canEditClientLead = hasAnyPermission(
    currentUser,
    ["clientLead:update"],
    reduxPermissions
  );
  const canDeleteClientLead = hasAnyPermission(
    currentUser,
    ["clientLead:delete"],
    reduxPermissions
  );

  useEffect(() => {
    const newOrderId = queryParams.get("orderId");
    setCurrentFilter((prev) => ({
      ...prev,
      orderId: newOrderId || null,
    }));
  }, [location.search]);

  // Fetch vendors and clients for dropdowns
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetchVendorsAndClients();

        if (res.success && res.data) {
          // const clientList = res.data.filter(
          //   (item) => item.userrole === "client"
          // );
          // const vendorList = res.data.filter(
          //   (item) => item.userrole === "vendor"
          // );
          // setClients(clientList);
          // setVendors(vendorList);
        }
      } catch (err) {
        console.error("Error fetching vendors/clients:", err);
        toast.error("Failed to load vendors/clients");
      }
    };
    fetchData();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllClientLeads(
        pagination.currentPage,
        pagination.pageSize,
        currentFilter.orderId,
        debouncedSearch
      );

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

  // Add a debounced version of searchText
  const [debouncedSearch] = useDebounce(searchText, 500);

  useEffect(() => {
    fetchLeads();
  }, [
    pagination.currentPage,
    pagination.pageSize,
    currentFilter.orderId,
    debouncedSearch,
  ]);

  // const toggleClientDropdown = () => setClientDropdownOpen((prev) => !prev);
  // const toggleVendorDropdown = () => setVendorDropdownOpen((prev) => !prev);
  // const toggleStatusDropdown = () => setStatusDropdownOpen((prev) => !prev);

  const handleRowClick = (row) => {
    const query = currentFilter.orderId
      ? `?orderId=${currentFilter.orderId}`
      : "";
    navigate(`/client-leads/${row.original.id}${query}`);
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

  // const handleStatusUpdate = async (id, newStatus) => {
  //   try {
  //     setLoading(true);
  //     setLeads((prevLeads) =>
  //       prevLeads.map((lead) =>
  //         lead.id === id ? { ...lead, status: newStatus } : lead
  //       )
  //     );

  //     const response = await updateLeadStatus(id, newStatus);
  //     console.log("Update Lead Status Response:", response);
  //     if (response.success) {
  //       await fetchLeads();
  //       toast.success(`Lead status updated to ${newStatus}`);
  //     } else {
  //       throw new Error(response.message || "Failed to update status");
  //     }
  //   } catch (error) {
  //     console.error("Error updating status:", error);
  //     await fetchLeads();
  //     toast.error(`Failed to update status: ${error.message}`);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

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

  // const statusOptions = ["all", "pending", "accepted", "rejected"];

  const columns = useMemo(() => {
    const baseColumns = [
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
            {value || "N/A"}
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
            {value || "N/A"}
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
            {value || "N/A"}
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
            {value || "N/A"}
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
            {value || "N/A"}
          </div>
        ),
      },
    ];

    // Add Action column only if user has any of the required permissions
    if (canEditClientLead || canDeleteClientLead) {
      baseColumns.push({
        Header: "Action",
        disableFilters: true,
        Cell: ({ row }) => (
          <div className="d-flex gap-2">
            {canEditClientLead && (
              <Button
                color="primary"
                size="sm"
                className="px-2"
                onClick={() => handleEdit(row.original)}
              >
                <FiEdit2 size={14} />
              </Button>
            )}
            <Button
              color="secondary"
              size="sm"
              className="px-2"
              onClick={fetchLeads}
            >
              <FiRefreshCw size={14} />
            </Button>
            {canDeleteClientLead && (
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
            )}
          </div>
        ),
        width: 180,
      });
    }

    return baseColumns;
  }, [canEditClientLead, canDeleteClientLead]);
  const breadcrumbItems = [
    { title: "Dashboard", link: "/" },
    { title: "Leads", link: "/lead-index" },
    {
      title: currentFilter.orderId
        ? `Order #${currentFilter.orderId} Leads`
        : "All Client Leads",
      link: "#",
    },
  ];

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs title="ALL CLIENT" breadcrumbItems={breadcrumbItems} />
        <Card>
          <CardBody>
            {/* {loading && <p>Loading leads...</p>} */}
            {/* {error && <p className="text-danger">Error: {error}</p>} */}
            {/* {!loading && !error && filteredLeads.length === 0 && (
              <p>No leads found for Order #{currentFilter.orderId || "All"}.</p>
            )} */}
            {/* {!loading && !error && filteredLeads.length > 0 && ( */}
            <>
              <Row className="mb-3">
                {/* <Col md={3}>
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
                      {clients.map((client) => {
                        const fullName = `${client.firstname} ${client.lastname}`;
                        return (
                          <DropdownItem
                            key={client.id}
                            onClick={() => setSelectedClient(fullName)}
                            active={selectedClient === fullName}
                            className="d-flex align-items-center"
                          >
                            <FaUserTag className="me-2" />
                            {fullName}
                          </DropdownItem>
                        );
                      })}
                    </DropdownMenu>
                  </Dropdown>
                </Col> */}

                {/* Vendor Dropdown */}
                {/* <Col md={3}>
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
                      {vendors.map((vendor) => {
                        const fullName = `${vendor.firstname} ${vendor.lastname}`;
                        return (
                          <DropdownItem
                            key={vendor.id}
                            onClick={() => setSelectedVendor(fullName)}
                            active={selectedVendor === fullName}
                            className="d-flex align-items-center"
                          >
                            <FaBoxes className="me-2" />
                            {fullName}
                          </DropdownItem>
                        );
                      })}
                    </DropdownMenu>
                  </Dropdown>
                </Col> */}
                {/* Filter Button */}
                {/* <Col md={2}>
                  <Button
                    color="primary"
                    className="w-100 d-flex align-items-center "
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
                </Col> */}

                {/* Search */}
                <Col>
                  <div className="d-flex justify-content-end align-items-end mb-3">
                    <div>
                      <input
                        type="text"
                        style={{
                          fontSize: "0.85rem",
                          padding: "6px 10px",
                          minHeight: "36px",
                        }}
                        className="form-control form-control-sm"
                        placeholder="Search..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                      />
                    </div>
                  </div>
                </Col>
              </Row>

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
            {/* )} */}
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default ClientLeads;
