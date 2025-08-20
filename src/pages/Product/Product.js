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
import { FiFilter } from "react-icons/fi";
import { FaList, FaUserPlus } from "react-icons/fa";
import { MdFilterAltOff } from "react-icons/md";
import LeadFilterModal from "../../components/Modals/LeadFilterModal";
import {
  fetchAllLeads,
  fetchAllLeadsWithAssignee,
  fetchUnassignedLeads,
  deleteLead,
  getAssignmentStats,
} from "../../services/leadService";
import { useNavigate } from "react-router-dom";
import "react-confirm-alert/src/react-confirm-alert.css";
import LeadDetailModal from "../../components/Modals/LeadDetailModal";
import ConvertLeadToSaleModal from "../../components/Modals/ConvertLeadToSaleModal";
import useDeleteConfirmation from "../../components/Modals/DeleteConfirmation";
import { debounce } from "lodash";
import { getAllUsers } from "../../services/auth";
import { toast } from "react-toastify";
import { convertLeadToSale, getAllSales } from "../../services/productService";
import Sale from "./Sales";

const Product = () => {
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
    sales: [],
    loading: true,
    isModalOpen: false,
    selectedLead: null,
    error: null,
    selectedAgent: "",
    assignmentStats: { assignedCount: 0, unassignedCount: 0 },
    users: [],
    showAssignControls: false,
    showConvertModal: false,
    convertingLead: null,
    convertingLeads: [],
    allChecked: false,
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

  const fetchLeads = useCallback(async () => {
    try {
      const { activeFilter, pagination, searchText } = state;
      updateState({ loading: true, searchLoading: true });

      // Fetch sales to determine which leads are converted
      const salesResponse = await getAllSales({
        page: 1,
        limit: 100, // Fetch a large limit to cover all sales
        search: "",
        productType: "",
        status: "",
      });
      const convertedLeadIds = salesResponse.data.map((sale) => sale.leadId);

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
          Object.values(lead.fullLeadData || {}).some((value) =>
            String(value).toLowerCase().includes(searchText.toLowerCase())
          )
        );
      }

      const leads = filteredLeads.map((lead) => ({
        ...lead,
        checked: false,
        isConverted: convertedLeadIds.includes(lead.id), // Mark lead as converted if its ID is in sales
      }));

      updateState({
        leads,
        loading: false,
        searchLoading: false,
        allChecked: false,
        convertingLeads: [],
        pagination: {
          ...state.pagination,
          totalPages: response.totalPages || 1,
          totalItems:
            activeFilter === "all" ? response.totalItems : leads.length,
          currentPage: response.currentPage || 1,
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

  const fetchSales = useCallback(async () => {
    try {
      updateState({ loading: true, searchLoading: true });
      const { pagination, searchText } = state;
      const response = await getAllSales({
        page: pagination.currentPage,
        limit: pagination.pageSize,
        search: searchText,
        productType: "",
        status: "",
      });

      updateState({
        sales: response.data || [],
        loading: false,
        searchLoading: false,
        pagination: {
          ...state.pagination,
          totalPages: response.totalPages || 1,
          totalItems: response.totalItems || response.data.length,
          currentPage: response.currentPage || 1,
        },
      });
    } catch (err) {
      updateState({ error: err.message, loading: false, searchLoading: false });
    }
  }, [
    state.pagination.currentPage,
    state.pagination.pageSize,
    state.searchText,
  ]);

  const fetchData = useCallback(() => {
    if (state.activeFilter === "converted") {
      fetchSales();
    } else {
      fetchLeads();
    }
  }, [state.activeFilter, fetchLeads, fetchSales]);

  const debouncedFetchData = useMemo(
    () => debounce(fetchData, 500),
    [fetchData]
  );

  useEffect(() => {
    debouncedFetchData();
    return () => debouncedFetchData.cancel();
  }, [debouncedFetchData]);

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
    if (state.activeFilter !== "converted") {
      updateState({
        selectedLead: row.original,
        isModalOpen: true,
      });
    }
  };

  const handleSearchInput = (e) => {
    updateState({
      searchText: e.target.value,
      pagination: { ...state.pagination, currentPage: 1 },
    });
  };

  const handleEdit = (data) => {
    if (state.activeFilter === "converted") {
      navigate("/edit-sale", { state: { saleData: data } });
    } else {
      navigate("/add-lead", {
        state: {
          editData: {
            ...data,
            campaignType: data.campaignName || data.campaignType,
          },
        },
      });
    }
  };

  const handleDelete = async (id) => {
    const deleteFn = async () => {
      if (state.activeFilter === "converted") {
        toast.error("Sale deletion not implemented");
      } else {
        await deleteLead(id);
        updateState({
          leads: state.leads.filter((lead) => lead.id !== id),
        });
      }
    };

    confirmDelete(
      deleteFn,
      null,
      state.activeFilter === "converted" ? "sale" : "lead"
    );
  };

  const handleConvertSubmit = async (data) => {
    try {
      const response = await convertLeadToSale(data);
      toast.success("Lead converted to sale successfully!");
      updateState({
        leads: state.leads.map((lead) =>
          lead.id === data.leadId ? { ...lead, isConverted: true } : lead
        ),
        showConvertModal: false,
        convertingLead: null,
        convertingLeads: state.convertingLeads.filter(
          (id) => id !== data.leadId
        ),
      });
      fetchData();
    } catch (error) {
      toast.error(error.message || "Failed to convert lead to sale");
      throw error;
    }
  };

  const handleCheckboxChange = (id) => {
    const lead = state.leads.find((lead) => lead.id === id);
    if (!lead || lead.isConverted) return;

    let newConvertingLeads;
    if (state.convertingLeads.includes(id)) {
      newConvertingLeads = state.convertingLeads.filter(
        (leadId) => leadId !== id
      );
    } else {
      newConvertingLeads = [...state.convertingLeads, id];
    }

    updateState({
      convertingLeads: newConvertingLeads,
      allChecked:
        newConvertingLeads.length ===
        state.leads.filter((lead) => !lead.isConverted).length,
    });
  };

  const handleCheckAllChange = () => {
    const allConverted = state.leads.every((lead) => lead.isConverted);
    if (allConverted) return;

    if (state.allChecked) {
      updateState({
        convertingLeads: [],
        allChecked: false,
      });
    } else {
      const unconvertedLeadIds = state.leads
        .filter((lead) => !lead.isConverted)
        .map((lead) => lead.id);

      updateState({
        convertingLeads: unconvertedLeadIds,
        allChecked: true,
      });
    }
  };

  const handleConvertSelected = () => {
    if (state.convertingLeads.length === 0) {
      toast.warning("Please select at least one lead to convert");
      return;
    }

    const firstLead = state.leads.find(
      (lead) => lead.id === state.convertingLeads[0]
    );
    if (firstLead) {
      updateState({
        showConvertModal: true,
        convertingLead: firstLead,
      });
    }
  };

  const handlePageChange = (newPage) => {
    updateState({
      pagination: { ...state.pagination, currentPage: newPage },
    });
  };

  const handlePageSizeChange = (newSize) => {
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
        Header: () => (
          <div className="d-flex align-items-center">
            <input
              type="checkbox"
              checked={state.allChecked}
              onChange={handleCheckAllChange}
              style={{
                width: "16px",
                height: "16px",
                cursor: "pointer",
                marginRight: "8px",
              }}
              disabled={state.leads.every((lead) => lead.isConverted)}
            />
            <span>Convert</span>
          </div>
        ),
        accessor: "convert",
        disableFilters: true,
        width: 120,
        Cell: ({ row }) => (
          <div>
            {row.original.isConverted ? (
              <span className="text-success">Converted</span>
            ) : (
              <input
                type="checkbox"
                checked={state.convertingLeads.includes(row.original.id)}
                onChange={(e) => {
                  e.stopPropagation();
                  handleCheckboxChange(row.original.id);
                }}
                style={{ width: "16px", height: "16px", cursor: "pointer" }}
              />
            )}
          </div>
        ),
      },
    ];

    return baseColumns;
  }, [state.leads, state.convertingLeads, state.allChecked]);

  const breadcrumbItems = [
    { title: "Dashboard", link: "/" },
    { title: "Product", link: "/#" },
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
    sales,
    isModalOpen,
    selectedLead,
    pagination,
    showConvertModal,
    convertingLead,
    convertingLeads,
  } = state;

  return (
    <div className="page-content" style={{ position: "relative" }}>
      <Container fluid>
        <Breadcrumbs title="ALL PRODUCT" breadcrumbItems={breadcrumbItems} />
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
                <div className="d-flex w-100 gap-2">
                  <Button
                    color={activeFilter === "all" ? "primary" : "light"}
                    onClick={() => updateState({ activeFilter: "all" })}
                    className="flex-fill d-flex align-items-center justify-content-center gap-2"
                  >
                    <FaList /> All Leads
                  </Button>
                  <Button
                    color={activeFilter === "converted" ? "primary" : "light"}
                    onClick={() => updateState({ activeFilter: "converted" })}
                    className="flex-fill d-flex align-items-center justify-content-center gap-2"
                  >
                    <FaUserPlus /> Converted To Sale
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

            <div className="d-flex justify-content-between mb-4 mt-4">
              <div>
                {activeFilter !== "converted" && convertingLeads.length > 0 && (
                  <Button
                    color="primary"
                    onClick={handleConvertSelected}
                    disabled={convertingLeads.length === 0}
                  >
                    Convert Selected ({convertingLeads.length})
                  </Button>
                )}
              </div>
              <div className="w-25 position-relative">
                <input
                  ref={searchInputRef}
                  type="text"
                  className="form-control"
                  placeholder={
                    activeFilter === "converted"
                      ? "Search Sales..."
                      : "Search Product..."
                  }
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

            {activeFilter === "converted" ? (
              <Sale
                sales={sales}
                pagination={pagination}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
                onEdit={handleEdit}
                onDelete={handleDelete}
                isLoading={loading}
              />
            ) : (
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
            )}
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
      <ConvertLeadToSaleModal
        isOpen={showConvertModal}
        toggle={() =>
          updateState({
            showConvertModal: false,
            convertingLead: null,
          })
        }
        lead={convertingLead}
        onConvert={handleConvertSubmit}
      />
    </div>
  );
};

export default Product;
