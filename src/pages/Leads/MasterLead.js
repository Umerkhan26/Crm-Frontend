import React, {
  useMemo,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import TableContainer from "../../components/Common/TableContainer";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import {
  Card,
  CardBody,
  Container,
  Row,
  Col,
  Button,
  Spinner,
} from "reactstrap";
import { FiEdit2, FiFilter, FiTrash2 } from "react-icons/fi";
import { FaList, FaUserPlus, FaUserSlash } from "react-icons/fa";
import { MdFilterAltOff } from "react-icons/md";
import LeadFilterModal from "../../components/Modals/LeadFilterModal";
import {
  fetchAllLeads,
  fetchAllLeadsWithAssignee,
  fetchUnassignedLeads,
  deleteLead,
  assignLeadToUser,
  getAssignmentStats,
} from "../../services/leadService";
import { useNavigate } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import LeadDetailModal from "../../components/Modals/LeadDetailModal";
import useDeleteConfirmation from "../../components/Modals/DeleteConfirmation";
import { debounce } from "lodash";
import { getAllUsers } from "../../services/auth";
import { toast } from "react-toastify";

const MasterLead = () => {
  const navigate = useNavigate();
  const { confirmDelete } = useDeleteConfirmation();
  const [state, setState] = useState({
    searchText: "",
    searchLoading: false,
    startDate: "",
    endDate: "",
    activeFilter: "all",
    showFilterModal: false,
    leads: [],
    loading: true,
    isModalOpen: false,
    selectedLead: null,
    error: null,
    selectedAgent: "",
    assignmentStats: { assignedCount: 0, unassignedCount: 0 },
    users: [],
    showAssignControls: false,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      pageSize: 10,
    },
  });

  const searchInputRef = useRef(null);

  const updateState = (newState) => {
    setState((prev) => ({ ...prev, ...newState }));
  };

  const fetchData = useCallback(async () => {
    try {
      const { activeFilter, pagination, searchText } = state;
      updateState({ loading: true, searchLoading: true });

      let response;
      if (activeFilter === "assigned") {
        response = await fetchAllLeadsWithAssignee();
      } else if (activeFilter === "unassigned") {
        response = await fetchUnassignedLeads();
      } else {
        response = await fetchAllLeads(
          pagination.currentPage,
          pagination.pageSize,
          searchText
        );
      }

      let filteredLeads = response.data;
      if (
        (activeFilter === "assigned" || activeFilter === "unassigned") &&
        searchText
      ) {
        filteredLeads = response.data.filter((lead) =>
          Object.values(lead.fullLeadData).some((value) =>
            String(value).toLowerCase().includes(searchText.toLowerCase())
          )
        );
      }

      const leads = filteredLeads.map((lead) => ({
        ...lead,
        checked: false,
      }));

      updateState({
        leads,
        loading: false,
        searchLoading: false,
        pagination: {
          ...state.pagination,
          totalPages: response.totalPages,
          totalItems:
            activeFilter === "all" ? response.totalItems : leads.length,
          currentPage: response.currentPage,
        },
      });
    } catch (err) {
      updateState({ error: err.message, loading: false, searchLoading: false });
    }
  }, [
    state.activeFilter,
    state.pagination.currentPage,
    state.pagination.pageSize,
    state.searchText,
  ]);

  const debouncedFetchData = useMemo(
    () => debounce(fetchData, 500),
    [fetchData]
  );

  useEffect(() => {
    debouncedFetchData();
    return () => debouncedFetchData.cancel();
  }, [debouncedFetchData]);

  useEffect(() => {
    const hasCheckedLeads = state.leads.some((lead) => lead.checked);
    updateState({ showAssignControls: hasCheckedLeads });
  }, [state.leads]);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [stats, usersResponse] = await Promise.all([
          getAssignmentStats(),
          getAllUsers({ page: 1, limit: 100 }),
        ]);

        updateState({
          assignmentStats: stats,
          users: usersResponse.data || [],
        });
      } catch (err) {
        console.error("Error loading initial data:", err.message);
      }
    };

    loadInitialData();
  }, []);

  const handleRowClick = (row) => {
    updateState({
      selectedLead: row.original,
      isModalOpen: true,
    });
  };

  const handleSearchInput = (e) => {
    updateState({
      searchText: e.target.value,
      pagination: { ...state.pagination, currentPage: 1 },
    });
  };

  const handleEdit = (lead) => {
    navigate("/add-lead", {
      state: {
        editData: {
          ...lead,
          campaignType: lead.campaignName || lead.campaignType,
        },
      },
    });
  };

  const handleDelete = async (leadId) => {
    const deleteFn = async () => {
      await deleteLead(leadId);
      updateState({
        leads: state.leads.filter((lead) => lead.id !== leadId),
      });
    };

    confirmDelete(deleteFn, null, "lead");
  };

  const confirmCheckAll = (isCheckAll, newCheckedState, isUncheck) => {
    const message = isUncheck
      ? `Are you sure you want to deselect all ${state.leads.length} lead(s)?`
      : `Are you sure you want to select ${
          isCheckAll ? "all" : newCheckedState.length
        } lead(s) for assignment?`;

    confirmAlert({
      title: isUncheck ? "Confirm Deselection" : "Confirm Selection",
      message,
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            updateState({
              leads: state.leads.map((lead) => ({
                ...lead,
                checked: isCheckAll
                  ? !isUncheck
                  : newCheckedState.includes(lead.id),
              })),
            });
          },
        },
        {
          label: "No",
          onClick: () => {
            if (isCheckAll) {
              document.getElementById("checkAll").checked = isUncheck;
            }
          },
        },
      ],
    });
  };

  const handleCheckboxChange = (id, isCheckAll = false) => {
    if (isCheckAll) {
      const allChecked = state.leads.every((lead) => lead.checked);
      const isUncheck = allChecked;
      if (isUncheck && state.leads.some((lead) => lead.checked)) {
        confirmCheckAll(true, false, true);
      } else if (!allChecked) {
        confirmCheckAll(true, true, false);
      }
    } else {
      const newLeads = state.leads.map((lead) =>
        lead.id === id ? { ...lead, checked: !lead.checked } : lead
      );
      const newCheckedLeads = newLeads
        .filter((lead) => lead.checked)
        .map((lead) => lead.id);
      if (newCheckedLeads.length > 1) {
        confirmCheckAll(false, newCheckedLeads, false);
      } else {
        updateState({ leads: newLeads });
      }
    }
  };

  const handleAssign = async () => {
    const { selectedAgent, leads } = state;

    if (!selectedAgent) {
      toast.warning("Please select a user before assigning.");
      return;
    }

    try {
      const leadIds = leads
        .filter((lead) => lead.checked)
        .map((lead) => lead.id);

      if (leadIds.length === 0) {
        toast.warning("Please select at least one lead to assign.");
        return;
      }

      await Promise.all(
        leadIds.map((leadId) => assignLeadToUser(leadId, selectedAgent))
      );

      toast.success("Leads assigned successfully!");

      fetchData();
      updateState({
        leads: leads.map((lead) => ({ ...lead, checked: false })),
        selectedAgent: "",
      });
    } catch (error) {
      console.error("Assignment failed:", error);
      toast.error(error.message || "Failed to assign leads.");
    }
  };

  const handlePageChange = (newPage) => {
    if (
      state.activeFilter === "assigned" ||
      state.activeFilter === "unassigned"
    )
      return;
    updateState({
      pagination: { ...state.pagination, currentPage: newPage },
    });
  };

  const handlePageSizeChange = (newSize) => {
    if (
      state.activeFilter === "assigned" ||
      state.activeFilter === "unassigned"
    )
      return;
    updateState({
      pagination: {
        ...state.pagination,
        pageSize: newSize,
        currentPage: 1,
      },
    });
  };

  const columns = useMemo(() => {
    const baseColumns = [
      {
        Header: "Agent Name",
        accessor: "agentName",
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
        accessor: "firstName",
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
        accessor: "lastName",
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
        accessor: "state",
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
        accessor: "phoneNumber",
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
      {
        Header: "Assigned To",
        accessor: "assignedTo",
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
        Header: "Action",
        disableFilters: true,
        width: 120,
        Cell: ({ row }) => (
          <div className="d-flex gap-2">
            <Button
              color="primary"
              size="sm"
              className="px-2"
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(row.original);
              }}
              title="Edit"
            >
              <FiEdit2 size={14} />
            </Button>
            <Button
              color="danger"
              size="sm"
              className="px-2"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(row.original.id);
              }}
              title="Delete"
            >
              <FiTrash2 size={14} />
            </Button>
          </div>
        ),
      },
      {
        Header: () => (
          <div>
            <input
              type="checkbox"
              id="checkAll"
              onChange={() => handleCheckboxChange(null, true)}
              style={{ width: "16px", height: "16px", cursor: "pointer" }}
            />
          </div>
        ),
        accessor: "check",
        disableFilters: true,
        width: 60,
        Cell: ({ row }) => (
          <div>
            <input
              type="checkbox"
              checked={row.original.checked}
              onChange={(e) => {
                e.stopPropagation();
                handleCheckboxChange(row.original.id);
              }}
              style={{ width: "16px", height: "16px", cursor: "pointer" }}
            />
          </div>
        ),
      },
    ];

    return baseColumns;
  }, [state.leads]);

  const breadcrumbItems = [
    { title: "Dashboard", link: "/" },
    { title: "Leads", link: "/AllLeads" },
    { title: "MasterLead", link: "#" },
  ];

  const {
    loading,
    error,
    searchLoading,
    searchText,
    startDate,
    endDate,
    activeFilter,
    showFilterModal,
    leads,
    isModalOpen,
    selectedLead,
    assignmentStats,
    users,
    showAssignControls,
    selectedAgent,
    pagination,
  } = state;

  return (
    <div className="page-content" style={{ position: "relative" }}>
      <Container fluid>
        <Breadcrumbs
          title="ALL MASTER LEADS"
          breadcrumbItems={breadcrumbItems}
        />
        <Card>
          <CardBody style={{ overflowX: "auto", position: "relative" }}>
            {loading && (
              <div
                className="d-flex justify-content-center align-items-center"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "rgba(255, 255, 255, 0.7)",
                  zIndex: 10,
                }}
              >
                <Spinner color="primary" />
              </div>
            )}
            {error && <p className="text-danger">Error: {error}</p>}

            <Row className="mb-3">
              <Col md={12}>
                <div className="d-flex flex-wrap justify-content-between mb-2">
                  <div>
                    <strong>Assigned Leads:</strong>{" "}
                    {assignmentStats.assignedCount}
                  </div>
                  <div>
                    <strong>Unassigned Leads:</strong>{" "}
                    {assignmentStats.unassignedCount}
                  </div>
                </div>
                <div className="d-flex w-100 gap-2">
                  <Button
                    color={activeFilter === "all" ? "primary" : "light"}
                    onClick={() => updateState({ activeFilter: "all" })}
                    className="flex-fill d-flex align-items-center justify-content-center gap-2"
                  >
                    <FaList /> All Leads
                  </Button>
                  <Button
                    color={activeFilter === "unassigned" ? "primary" : "light"}
                    onClick={() => updateState({ activeFilter: "unassigned" })}
                    className="flex-fill d-flex align-items-center justify-content-center gap-2"
                  >
                    <FaUserSlash /> Unassigned
                  </Button>
                  <Button
                    color={activeFilter === "assigned" ? "primary" : "light"}
                    onClick={() => updateState({ activeFilter: "assigned" })}
                    className="flex-fill d-flex align-items-center justify-content-center gap-2"
                  >
                    <FaUserPlus /> Assigned
                  </Button>
                </div>
              </Col>
            </Row>

            <Row className="mb-3 align-items-end">
              <Col md="auto">
                <Button
                  color="primary"
                  size="sm"
                  onClick={() => updateState({ showFilterModal: true })}
                >
                  <FiFilter size={20} />
                </Button>
              </Col>
              <Col md="auto">
                <Button
                  color="danger"
                  size="sm"
                  onClick={() => {
                    updateState({
                      startDate: "",
                      endDate: "",
                      searchText: "",
                      activeFilter: "all",
                    });
                  }}
                >
                  <MdFilterAltOff size={20} />
                </Button>
              </Col>
              <Col md={3}>
                <label htmlFor="startDate" className="form-label">
                  Start Date
                </label>
                <input
                  type="date"
                  className="form-control"
                  id="startDate"
                  value={startDate}
                  onChange={(e) => updateState({ startDate: e.target.value })}
                />
              </Col>
              <Col md={3}>
                <label htmlFor="endDate" className="form-label">
                  End Date
                </label>
                <input
                  type="date"
                  className="form-control"
                  id="endDate"
                  value={endDate}
                  onChange={(e) => updateState({ endDate: e.target.value })}
                />
              </Col>
            </Row>

            <div className="d-flex justify-content-end mb-3">
              <div className="w-25 position-relative">
                <input
                  ref={searchInputRef}
                  type="text"
                  className="form-control"
                  placeholder="Search leads..."
                  value={searchText}
                  onChange={handleSearchInput}
                />
                {searchLoading && (
                  <div className="position-absolute top-50 end-0 translate-middle-y me-2">
                    <div
                      className="spinner-border spinner-border-sm"
                      role="status"
                    />
                  </div>
                )}
              </div>
            </div>

            {showAssignControls && (
              <div className="mb-3" style={{ maxWidth: "100%" }}>
                <div className="d-flex flex-column">
                  <label
                    className="form-label"
                    style={{
                      fontSize: "16px",
                      fontWeight: "900",
                      marginBottom: "8px",
                    }}
                  >
                    Users *
                  </label>
                  <select
                    className="form-select"
                    style={{
                      width: "400px",
                      height: "40px",
                      fontSize: "14px",
                      padding: "0.375rem 0.75rem",
                    }}
                    value={selectedAgent}
                    onChange={(e) =>
                      updateState({ selectedAgent: e.target.value })
                    }
                  >
                    <option value="">Select User</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.firstname} {user.lastname}
                      </option>
                    ))}
                  </select>
                </div>
                <Button
                  color="primary"
                  onClick={handleAssign}
                  disabled={!selectedAgent}
                  style={{
                    marginTop: "10px",
                    height: "40px",
                    fontSize: "14px",
                    fontWeight: "500",
                    width: "120px",
                    alignSelf: "start",
                  }}
                >
                  Assign
                </Button>
              </div>
            )}

            <TableContainer
              columns={columns}
              data={leads}
              isPagination={activeFilter === "all"}
              iscustomPageSize={false}
              isBordered={false}
              customPageSize={pagination.pageSize}
              pagination={pagination}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              className="custom-table"
            />
          </CardBody>
        </Card>
      </Container>

      <LeadFilterModal
        isOpen={showFilterModal}
        toggle={() => updateState({ showFilterModal: false })}
      />
      <LeadDetailModal
        isOpen={isModalOpen}
        toggle={() => updateState({ isModalOpen: !isModalOpen })}
        leadData={selectedLead}
      />
    </div>
  );
};

export default MasterLead;
