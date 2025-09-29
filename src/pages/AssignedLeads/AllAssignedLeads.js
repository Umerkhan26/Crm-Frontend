import React, { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardBody,
  Spinner,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button,
  Col,
  Row,
} from "reactstrap";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchCampaigns } from "../../services/campaignService";
import { fetchLeadsByAssigneeId } from "../../services/leadService";
import TableContainer from "../../components/Common/TableContainer";
import UserLeadDetailModal from "../../components/Modals/UserLeadDetailModal";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_green.css";
import { format } from "date-fns";

const CompactUserLeads = ({ userId }) => {
  const [state, setState] = useState({
    leads: [],
    loading: true,
    allowedCampaigns: [],
    error: null,
    isModalOpen: false,
    selectedLead: null,
  });
  const [dateFilter, setDateFilter] = useState("today");
  const [customDateRange, setCustomDateRange] = useState({
    start: null,
    end: null,
  });
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);

  const user = useSelector((state) => {
    if (state.auth?.user) return state.auth.user;
    const storedUser = localStorage.getItem("authUser");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const getBackendFilterType = (frontendFilter) => {
    switch (frontendFilter) {
      case "today":
        return "daily";
      case "weekend":
        return "weekly";
      case "month":
        return "monthly";
      case "custom":
        return "custom";
      default:
        return "daily";
    }
  };

  useEffect(() => {
    const loadCampaigns = async () => {
      try {
        const res = await fetchCampaigns({ page: 1, limit: 100 });
        const allCampaigns = res.data || [];

        let allowedCampaigns = [];
        if (user?.role?.Permissions) {
          const specificPermissions = user.role.Permissions.filter(
            (perm) =>
              perm.name === "getCampaignById" &&
              perm.resourceType?.startsWith("campaign-")
          );

          if (specificPermissions.length > 0) {
            const allowedCampaignIds = specificPermissions.map((perm) =>
              parseInt(perm.resourceId)
            );
            allowedCampaigns = allCampaigns.filter((campaign) =>
              allowedCampaignIds.includes(parseInt(campaign.id))
            );
          } else if (
            user.role.Permissions.some((perm) => perm.name === "campaign:get")
          ) {
            allowedCampaigns = allCampaigns;
          }
        }

        setState((prev) => ({
          ...prev,
          allowedCampaigns,
        }));
      } catch (err) {
        console.error("Failed to load campaigns:", err.message);
        setState((prev) => ({ ...prev, error: err.message }));
      }
    };

    loadCampaigns();
  }, [user?.id]);

  useEffect(() => {
    const loadLeads = async () => {
      if (!userId || state.allowedCampaigns.length === 0) {
        setState((prev) => ({ ...prev, loading: false, leads: [] }));
        return;
      }

      try {
        setState((prev) => ({ ...prev, loading: true }));
        const backendFilterType = getBackendFilterType(dateFilter);
        let startDate, endDate;

        if (
          dateFilter === "custom" &&
          customDateRange.start &&
          customDateRange.end
        ) {
          startDate = format(customDateRange.start, "yyyy-MM-dd");
          endDate = format(customDateRange.end, "yyyy-MM-dd");
        }

        const leads = await fetchLeadsByAssigneeId(
          userId,
          backendFilterType,
          startDate,
          endDate
        );

        const allowedCampaignNames = state.allowedCampaigns.map(
          (c) => c.campaignName
        );
        const filteredLeads = leads.data.filter((lead) =>
          allowedCampaignNames.includes(lead.campaignName)
        );

        const mappedLeads = filteredLeads.map((lead) => {
          let assignees = [];

          try {
            assignees =
              typeof lead.assignees === "string"
                ? JSON.parse(lead.assignees)
                : Array.isArray(lead.assignees)
                ? lead.assignees
                : [];
          } catch (e) {
            console.warn(
              "Failed to parse assignees for lead ID",
              lead.id,
              lead.assignees
            );
          }

          const userAssignee = assignees.find(
            (a) => parseInt(a.userId || a.id) === parseInt(userId)
          );

          return {
            ...lead,
            assignees,
            status: userAssignee?.status || "pending",
            fullLeadData:
              typeof lead.leadData === "string"
                ? JSON.parse(lead.leadData)
                : lead.leadData || {},
          };
        });

        setState((prev) => ({
          ...prev,
          leads: mappedLeads,
          loading: false,
        }));
      } catch (err) {
        console.error("Failed to load leads:", err.message);
        setState((prev) => ({
          ...prev,
          error: err.message,
          loading: false,
        }));
      }
    };

    loadLeads();
  }, [userId, state.allowedCampaigns, dateFilter, customDateRange]);

  const handleRowClick = (row) => {
    setState((prev) => ({
      ...prev,
      selectedLead: row.original,
      isModalOpen: true,
    }));
  };

  const toggleModal = () => {
    setState((prev) => ({
      ...prev,
      isModalOpen: !prev.isModalOpen,
      selectedLead: null,
    }));
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "pending":
        return "warning";
      case "to_call":
        return "info";
      case "most_interested":
        return "primary";
      case "sold":
        return "success";
      default:
        return "secondary";
    }
  };

  const columns = useMemo(
    () => [
      {
        Header: "Agent Name",
        accessor: "leadData.agent_name",
        disableFilters: true,
        Cell: ({ row }) => {
          const leadData =
            typeof row.original.leadData === "string"
              ? JSON.parse(row.original.leadData)
              : row.original.leadData || {};
          return (
            <div
              style={{ cursor: "pointer" }}
              onClick={() => handleRowClick(row)}
            >
              {leadData.agent_name || leadData.agentName || "N/A"}
            </div>
          );
        },
      },
      {
        Header: "First Name",
        accessor: "leadData.first_name",
        disableFilters: true,
        Cell: ({ row }) => {
          const leadData =
            typeof row.original.leadData === "string"
              ? JSON.parse(row.original.leadData)
              : row.original.leadData || {};
          return (
            <div
              style={{ cursor: "pointer" }}
              onClick={() => handleRowClick(row)}
            >
              {leadData.first_name || leadData.firstName || "N/A"}
            </div>
          );
        },
      },
      {
        Header: "Last Name",
        accessor: "leadData.last_name",
        disableFilters: true,
        Cell: ({ row }) => {
          const leadData =
            typeof row.original.leadData === "string"
              ? JSON.parse(row.original.leadData)
              : row.original.leadData || {};
          return (
            <div
              style={{ cursor: "pointer" }}
              onClick={() => handleRowClick(row)}
            >
              {leadData.last_name || leadData.lastName || "N/A"}
            </div>
          );
        },
      },
      {
        Header: "Phone",
        accessor: "leadData.phone_number",
        disableFilters: true,
        Cell: ({ row }) => {
          const [copied, setCopied] = useState(false);
          const leadData =
            typeof row.original.leadData === "string"
              ? JSON.parse(row.original.leadData)
              : row.original.leadData || {};
          const phone = leadData.phone_number || leadData.phoneNumber || "N/A";

          const handleClick = async (e) => {
            e.stopPropagation();
            if (phone && phone !== "N/A") {
              try {
                await navigator.clipboard.writeText(phone);
                setCopied(true);
                setTimeout(() => setCopied(false), 1000);
              } catch (err) {
                console.error("Clipboard copy failed:", err);
              }
            }
          };

          return (
            <div
              title={copied ? "Copied!" : "Click to copy"}
              onClick={handleClick}
              style={{
                cursor: "pointer",
                color: copied ? "blue" : "inherit",
                fontWeight: copied ? "bold" : "normal",
              }}
            >
              {phone}
            </div>
          );
        },
      },
      {
        Header: "State",
        accessor: "leadData.state",
        disableFilters: true,
        Cell: ({ row }) => {
          const leadData =
            typeof row.original.leadData === "string"
              ? JSON.parse(row.original.leadData)
              : row.original.leadData || {};
          return (
            <div
              style={{ cursor: "pointer" }}
              onClick={() => handleRowClick(row)}
            >
              {leadData.state || "N/A"}
            </div>
          );
        },
      },
      {
        Header: "Status",
        accessor: "status",
        disableFilters: true,
        Cell: ({ row }) => {
          const status = row.original.status || "pending";
          return (
            <span
              className={`badge bg-${getStatusBadgeColor(status)}`}
              style={{ textTransform: "capitalize" }}
            >
              {status.replace(/_/g, " ")}
            </span>
          );
        },
      },
    ],
    []
  );

  const displayedLeads = [...state.leads]
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 3);

  const toggleDateDropdown = () => setDateDropdownOpen((prev) => !prev);

  if (state.allowedCampaigns.length === 0 && !state.loading) {
    return (
      <Card>
        <CardBody>
          <div className="text-center">
            <p>No campaigns assigned to your account</p>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardBody>
        <Row className="mb-3">
          <Col md={6}>
            <h5 className="card-title mb-0">My Assigned Leads</h5>
          </Col>
          <Col md={6} className="text-end">
            <div className="d-flex justify-content-end align-items-center">
              <Dropdown
                isOpen={dateDropdownOpen}
                toggle={toggleDateDropdown}
                className="me-2"
              >
                <DropdownToggle caret color="light">
                  {dateFilter === "today"
                    ? "Today"
                    : dateFilter === "weekend"
                    ? "This Week"
                    : dateFilter === "month"
                    ? "This Month"
                    : "Custom Range"}
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem
                    onClick={() => {
                      setDateFilter("today");
                    }}
                  >
                    Today
                  </DropdownItem>
                  <DropdownItem
                    onClick={() => {
                      setDateFilter("weekend");
                    }}
                  >
                    This Week
                  </DropdownItem>
                  <DropdownItem
                    onClick={() => {
                      setDateFilter("month");
                    }}
                  >
                    This Month
                  </DropdownItem>
                  <DropdownItem
                    onClick={() => {
                      setDateFilter("custom");
                    }}
                  >
                    Custom Range
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
              {dateFilter === "custom" && (
                <div className="d-flex align-items-center">
                  <div className="d-flex me-2">
                    <Flatpickr
                      value={customDateRange.start}
                      onChange={([date]) =>
                        setCustomDateRange((prev) => ({
                          ...prev,
                          start: date,
                        }))
                      }
                      options={{
                        dateFormat: "Y-m-d",
                        maxDate: customDateRange.end || new Date(),
                      }}
                      placeholder="Start Date"
                      className="form-control"
                      style={{ width: "120px" }}
                    />
                    <span className="mx-2">to</span>
                    <Flatpickr
                      value={customDateRange.end}
                      onChange={([date]) =>
                        setCustomDateRange((prev) => ({ ...prev, end: date }))
                      }
                      options={{
                        dateFormat: "Y-m-d",
                        minDate: customDateRange.start,
                        maxDate: new Date(),
                      }}
                      placeholder="End Date"
                      className="form-control"
                      style={{ width: "120px" }}
                    />
                  </div>
                  <Button
                    color="primary"
                    size="sm"
                    onClick={() => {
                      if (customDateRange.start && customDateRange.end) {
                        // Trigger useEffect by updating state
                        setCustomDateRange({ ...customDateRange });
                      }
                    }}
                    disabled={!customDateRange.start || !customDateRange.end}
                  >
                    Apply
                  </Button>
                </div>
              )}
            </div>
          </Col>
        </Row>

        {state.loading ? (
          <div className="text-center">
            <Spinner color="primary" />
          </div>
        ) : state.error ? (
          <div className="text-danger">{state.error}</div>
        ) : displayedLeads.length === 0 ? (
          <p>No leads assigned to you</p>
        ) : (
          <>
            <TableContainer
              columns={columns}
              data={displayedLeads}
              isPagination={false}
              isBordered={false}
              className="table-sm table-centered table-nowrap mb-0 custom-table"
              iscustomPageSize={false}
            />
            <UserLeadDetailModal
              isOpen={state.isModalOpen}
              toggle={toggleModal}
              leadData={state.selectedLead}
            />
            <div className="text-center mt-3">
              <Link
                to="/assigned-leads"
                className="btn btn-primary btn-sm"
                style={{
                  borderRadius: "20px",
                  padding: "5px 20px",
                  fontWeight: "500",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = "0 4px 8px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "0 2px 5px rgba(0,0,0,0.1)";
                }}
              >
                View All Leads ({state.leads.length})
              </Link>
            </div>
          </>
        )}
      </CardBody>
    </Card>
  );
};

export default CompactUserLeads;
