import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Card,
  CardBody,
  Row,
  Col,
  Spinner,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Badge,
  Button,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  Dropdown,
} from "reactstrap";
import { useSelector } from "react-redux";
import { fetchCampaigns } from "../../services/campaignService";
import {
  updateLeadStatus,
  fetchLeadStatusSummary,
  getLeadsByCampaignAndAssignee,
  fetchLeadsByAssigneeId,
} from "../../services/leadService";
import TableContainer from "../../components/Common/TableContainer";
import { toast } from "react-toastify";
import ConvertToSaleModal from "./ConvertToSaleModal";

import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_green.css";
import { hasAnyPermission } from "../../utils/permissions";
import { format } from "date-fns";

const UserLeads = ({ userId }) => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(search);
  const urlCampaign = queryParams.get("campaign");
  const urlUserId = queryParams.get("userId");
  const [saleModalOpen, setSaleModalOpen] = useState(false);
  const [pendingSale, setPendingSale] = useState(null);
  const [campaignNameToIdMap, setCampaignNameToIdMap] = useState({});

  const [state, setState] = useState({
    leads: [],
    statusCounts: {
      pending: 0,
      to_call: 0,
      most_interested: 0,
      sold: 0,
      not_interested: 0,
    },
    loading: true,
    selectedCampaign: urlCampaign || "",
    campaigns: [],
    allowedCampaigns: [],
    error: null,
    activeTab: "all",
    fromUserDetails: !!urlUserId,
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    pageSize: 10,
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
  const targetUserId =
    userId || urlUserId || (user?.id ? String(user.id) : null);
  const isAdmin = hasAnyPermission(user, ["user:get"]);

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
        return "all";
    }
  };
  const loadData = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      let leads = [];
      let statusCounts = state.statusCounts;

      // Convert frontend date filter to backend parameters
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

      if (urlCampaign) {
        // Load leads for specific campaign
        const response = await getLeadsByCampaignAndAssignee(
          urlCampaign,
          parseInt(targetUserId)
        );
        leads = Array.isArray(response) ? response : [];

        // Calculate status counts from the leads data
        statusCounts = {
          pending: leads.filter((l) => validateStatus(l.status) === "pending")
            .length,
          to_call: leads.filter((l) => validateStatus(l.status) === "to_call")
            .length,
          most_interested: leads.filter(
            (l) => validateStatus(l.status) === "most_interested"
          ).length,
          sold: leads.filter((l) => validateStatus(l.status) === "sold").length,
          not_interested: leads.filter(
            (l) => validateStatus(l.status) === "not_interested"
          ).length,
        };
      } else {
        // First get the status summary
        const summaryResponse = await fetchLeadStatusSummary(targetUserId);
        statusCounts = summaryResponse.statusCounts;

        // Then get the leads with pagination and filtering
        const response = await fetchLeadsByAssigneeId(
          targetUserId,
          backendFilterType,
          startDate,
          endDate,
          pagination.currentPage,
          pagination.pageSize
        );

        console.log("asssss", response);

        // Update pagination from response
        setPagination((prev) => ({
          ...prev,
          totalPages: response.totalPages || 1,
          totalItems: response.totalItems || 0,
        }));

        leads = response.data || [];

        // Filter leads to only include those assigned to the target user
        leads = leads.filter((lead) => {
          if (Number(lead.assigneeId) === Number(targetUserId)) return true;
          try {
            const assignees =
              typeof lead.assignees === "string"
                ? JSON.parse(lead.assignees)
                : lead.assignees || [];
            return assignees.some(
              (a) => Number(a.userId) === Number(targetUserId)
            );
          } catch {
            return false;
          }
        });

        // Apply campaign filter if selected
        if (state.selectedCampaign) {
          leads = leads.filter(
            (lead) => lead.campaignName === state.selectedCampaign
          );
        }
      }

      // Process all leads to extract the proper status and assignment info
      const mappedLeads = leads
        .map((lead) => {
          try {
            const leadData =
              typeof lead.leadData === "string"
                ? JSON.parse(lead.leadData)
                : lead.leadData || {};
            const assignees =
              typeof lead.assignees === "string"
                ? JSON.parse(lead.assignees)
                : Array.isArray(lead.assignees)
                ? lead.assignees
                : [];
            let status = lead.status ? validateStatus(lead.status) : "pending";

            // Find the user's specific assignment
            const userAssignment =
              assignees.find(
                (a) => Number(a.userId) === Number(targetUserId)
              ) || {};

            if (userAssignment?.status) {
              status = validateStatus(userAssignment.status);
            }

            return {
              ...lead,
              leadData,
              assignees,
              status, // Prioritize user-specific status
              status_updated: userAssignment.status_updated || false,
              assigneeId: userAssignment.userId || lead.assigneeId,
            };
          } catch (error) {
            console.error("Error processing lead:", lead.id, error);
            return null;
          }
        })
        .filter((lead) => lead !== null);
      console.log("Processed leads:", mappedLeads);
      console.log("Final status counts:", statusCounts);
      // Update state with the processed data
      setState((prev) => ({
        ...prev,
        leads: mappedLeads,
        statusCounts,
        loading: false,
      }));
    } catch (err) {
      console.error("Failed to load data:", err.message);
      toast.error("Failed to load leads data");
      setState((prev) => ({
        ...prev,
        error: err.message,
        loading: false,
      }));
    }
  }, [
    urlCampaign,
    userId,
    urlUserId,
    targetUserId,
    state.selectedCampaign,
    dateFilter,
    customDateRange,
    pagination.currentPage,
    pagination.pageSize,
  ]);
  const validateStatus = (status) => {
    if (!status) return "pending";

    const normalizedStatus = status.toLowerCase().trim().replace(/\s+/g, "_");

    const validStatuses = [
      "pending",
      "to_call",
      "most_interested",
      "sold",
      "not_interested",
      "seld", // Add any other status variations you encounter
    ];

    // Try to match common variations
    if (normalizedStatus === "seld") return "sold";
    if (normalizedStatus === "not_interested") return "not_interested";

    return validStatuses.includes(normalizedStatus)
      ? normalizedStatus
      : "pending";
  };
  const getStatusBadgeColor = (status) => {
    switch (validateStatus(status)) {
      case "pending":
        return "warning";
      case "to_call":
        return "info";
      case "most_interested":
        return "primary";
      case "sold":
        return "success";
      case "not_interested":
        return "secondary";
      default:
        return "secondary";
    }
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, currentPage: newPage }));
  };

  const handlePageSizeChange = (newSize) => {
    setPagination((prev) => ({ ...prev, pageSize: newSize, currentPage: 1 }));
  };

  const toggleTab = (tab) => {
    if (state.activeTab !== tab) {
      setState((prev) => ({ ...prev, activeTab: tab }));
    }
  };

  useEffect(() => {
    const loadCampaigns = async () => {
      try {
        const res = await fetchCampaigns({ page: 1, limit: 100 });
        const allCampaigns = res.data || [];
        const map = {};
        allCampaigns.forEach((campaign) => {
          map[campaign.campaignName] = campaign.id;
        });
        setCampaignNameToIdMap(map);

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

        if (urlCampaign) {
          allowedCampaigns = allowedCampaigns.filter(
            (c) => c.campaignName === urlCampaign
          );
        }

        setState((prev) => ({
          ...prev,
          campaigns: allCampaigns,
          allowedCampaigns,
          selectedCampaign:
            urlCampaign ||
            (allowedCampaigns.length > 0
              ? allowedCampaigns[0].campaignName
              : ""),
        }));
      } catch (err) {
        console.error("Failed to load campaigns:", err.message);
        toast.error("Failed to load campaigns");
        setState((prev) => ({ ...prev, error: err.message }));
      }
    };

    loadCampaigns();
  }, [user?.id, urlCampaign]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCampaignChange = (e) => {
    setState((prev) => ({ ...prev, selectedCampaign: e.target.value }));
  };

  const handleRowClick = (row) => {
    const campaignName = row.original.campaignName;
    const query = campaignName
      ? `?campaign=${encodeURIComponent(campaignName)}${
          isAdmin ? `&userId=${targetUserId}` : ""
        }`
      : isAdmin
      ? `?userId=${targetUserId}`
      : "";
    navigate(`/leads/${row.original.id}${query}`);
  };

  const filteredLeads = useMemo(() => {
    if (state.activeTab === "all") {
      return state.leads;
    }
    return state.leads.filter((lead) => lead.status === state.activeTab);
  }, [state.leads, state.activeTab]);
  const toggleDateDropdown = () => setDateDropdownOpen((prev) => !prev);

  const columns = useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id",
        disableFilters: true,
        Cell: ({ row }) => row.index + 1,
        width: 50,
      },
      {
        Header: "Campaign",
        accessor: "campaignName",
        disableFilters: true,
        Cell: ({ value }) => value || "N/A",
      },
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
        Cell: ({ row }) => (
          <div
            style={{ cursor: "pointer" }}
            onClick={() => handleRowClick(row)}
          >
            {row.original.leadData.first_name || "N/A"}
          </div>
        ),
      },
      {
        Header: "Last Name",
        accessor: "leadData.last_name",
        disableFilters: true,
        Cell: ({ row }) => (
          <div
            style={{ cursor: "pointer" }}
            onClick={() => handleRowClick(row)}
          >
            {row.original.leadData.last_name || "N/A"}
          </div>
        ),
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
        Header: "Phone",
        accessor: "leadData.phone_number",
        disableFilters: true,
        Cell: ({ row }) => {
          const [copied, setCopied] = useState(false);
          const phone = row.original.leadData.phone_number || "N/A";

          const handleClick = async (e) => {
            e.stopPropagation();
            if (phone && phone !== "N/A") {
              try {
                await navigator.clipboard.writeText(phone);
                setCopied(true);
                setTimeout(() => setCopied(false), 1000);
              } catch (err) {
                console.error("Copy failed", err);
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
        Header: "Status",
        accessor: "status",
        disableFilters: true,
        Cell: ({ row }) => {
          const targetUserId =
            urlUserId || userId || (user?.id ? String(user.id) : null);
          const leadStatus = validateStatus(row.original.status);
          const [currentStatus, setCurrentStatus] = useState(leadStatus);
          const [isUpdating, setIsUpdating] = useState(false);

          // Determine if this lead should be editable
          const isEditable =
            !row.original.status_updated &&
            state.activeTab === "all" &&
            currentStatus !== "sold";

          // Sync currentStatus with leadStatus whenever it changes
          useEffect(() => {
            setCurrentStatus(leadStatus);
          }, [leadStatus]);

          const handleStatusChange = async (e) => {
            const newStatus = validateStatus(e.target.value);
            const previousStatus = currentStatus;

            // Block any changes to sold leads
            if (currentStatus === "sold") {
              toast.warning("Sold leads cannot be modified");
              return;
            }

            // Special handling for sold status
            if (newStatus === "sold") {
              const campaignName = row.original.campaignName;
              const campaignId = campaignNameToIdMap[campaignName];

              if (!campaignId) {
                toast.error(`Could not find ID for campaign: ${campaignName}`);
                return;
              }

              setSaleModalOpen(true);
              setPendingSale({
                leadId: row.original.id,
                campaignId,
                targetUserId,
                previousStatus,
              });
              return;
            }

            // For non-sold status changes
            setCurrentStatus(newStatus);
            setIsUpdating(true);

            try {
              const result = await updateLeadStatus(
                row.original.id,
                targetUserId,
                newStatus,
                true
              );

              if (!result.success) {
                throw new Error(result.message || "Status update failed");
              }

              // Update local state
              setState((prev) => {
                const updatedLeads = prev.leads.map((lead) => {
                  if (lead.id === row.original.id) {
                    const updatedAssignees = Array.isArray(lead.assignees)
                      ? lead.assignees.map((a) =>
                          a.userId === targetUserId
                            ? { ...a, status: newStatus, status_updated: true }
                            : a
                        )
                      : [
                          {
                            userId: targetUserId,
                            status: newStatus,
                            status_updated: true,
                          },
                        ];
                    return {
                      ...lead,
                      assignees: updatedAssignees,
                      status: newStatus,
                      status_updated: true,
                    };
                  }
                  return lead;
                });

                return {
                  ...prev,
                  leads: updatedLeads,
                  statusCounts: {
                    ...prev.statusCounts,
                    [previousStatus]: Math.max(
                      0,
                      (prev.statusCounts[previousStatus] || 0) - 1
                    ),
                    [newStatus]: (prev.statusCounts[newStatus] || 0) + 1,
                  },
                };
              });

              await loadData();
            } catch (error) {
              setCurrentStatus(previousStatus);
              toast.error(`Status update failed: ${error.message}`);
            } finally {
              setIsUpdating(false);
            }
          };

          return (
            <div
              className="d-flex align-items-center"
              onClick={(e) => e.stopPropagation()}
            >
              {isUpdating ? (
                <Spinner size="sm" />
              ) : isEditable ? (
                // Editable dropdown with all status options
                <select
                  value={currentStatus}
                  onChange={handleStatusChange}
                  className={`form-select form-select-sm bg-${getStatusBadgeColor(
                    currentStatus
                  )}`}
                  style={{
                    color: "white",
                    textTransform: "capitalize",
                    border: "none",
                    cursor: "pointer",
                    width: "140px",
                  }}
                >
                  {[
                    "pending",
                    "to_call",
                    "most_interested",
                    "sold",
                    "not_interested",
                  ].map((status) => (
                    <option
                      key={status}
                      value={status}
                      className={`bg-${getStatusBadgeColor(status)}`}
                      disabled={
                        status === "sold" && currentStatus !== "sold"
                          ? false
                          : false
                      }
                    >
                      {status.replace(/_/g, " ")}
                    </option>
                  ))}
                </select>
              ) : (
                // Non-editable badge display
                <Badge
                  color={getStatusBadgeColor(currentStatus)}
                  style={{
                    textTransform: "capitalize",
                    padding: "7px 10px",
                    minWidth: "140px",
                    display: "inline-block",
                    textAlign: "center",
                  }}
                  title={
                    currentStatus === "sold"
                      ? "This lead is sold and cannot be modified"
                      : ""
                  }
                >
                  {currentStatus.replace(/_/g, " ")}
                </Badge>
              )}
            </div>
          );
        },
      },
    ],
    [userId, urlUserId, loadData, state.activeTab]
  );

  if (state.allowedCampaigns.length === 0 && !state.loading) {
    return (
      <Card>
        <CardBody>
          <div className="text-center">
            <h5>No campaigns assigned</h5>
            <p>Please contact your administrator to get access to campaigns</p>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <>
      <Card style={{ backgroundColor: "#fff" }}>
        <CardBody>
          <Row className="mb-3">
            <Col md={6}>
              <h5>
                {state.fromUserDetails ? (
                  <Button
                    color="link"
                    onClick={() =>
                      navigate(`/user-details/${urlUserId || userId}`)
                    }
                    className="ps-0"
                  >
                    <i className="mdi mdi-arrow-left"></i> Back to User
                  </Button>
                ) : (
                  "My Assigned Leads"
                )}
              </h5>
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
                        loadData();
                      }}
                    >
                      Today
                    </DropdownItem>
                    <DropdownItem
                      onClick={() => {
                        setDateFilter("weekend");
                        loadData();
                      }}
                    >
                      This Week
                    </DropdownItem>
                    <DropdownItem
                      onClick={() => {
                        setDateFilter("month");
                        loadData();
                      }}
                    >
                      This Month
                    </DropdownItem>
                    <DropdownItem onClick={() => setDateFilter("custom")}>
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
                      onClick={() => loadData()}
                      disabled={!customDateRange.start || !customDateRange.end}
                    >
                      Apply
                    </Button>
                  </div>
                )}
                {!urlCampaign && (
                  <div className="ms-2" style={{ minWidth: "180px" }}>
                    <select
                      className="form-control"
                      value={state.selectedCampaign}
                      onChange={handleCampaignChange}
                      disabled={
                        state.loading || state.allowedCampaigns.length === 0
                      }
                    >
                      <option value="">All Campaigns</option>
                      {state.allowedCampaigns.map((campaign) => (
                        <option key={campaign.id} value={campaign.campaignName}>
                          {campaign.campaignName}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </Col>
          </Row>
          <Nav tabs className="mb-3">
            <NavItem>
              <NavLink
                className={state.activeTab === "all" ? "active" : ""}
                onClick={() => toggleTab("all")}
              >
                All <Badge color="primary">{state.leads.length}</Badge>
              </NavLink>
            </NavItem>
            {Object.entries(state.statusCounts).map(([status, count]) => (
              <NavItem key={status}>
                <NavLink
                  className={state.activeTab === status ? "active" : ""}
                  onClick={() => toggleTab(status)}
                >
                  {status.replace(/_/g, " ")}{" "}
                  <Badge color="primary">{count}</Badge>
                </NavLink>
              </NavItem>
            ))}
          </Nav>
          <TabContent activeTab={state.activeTab}>
            {["all", ...Object.keys(state.statusCounts)].map((tab) => (
              <TabPane key={tab} tabId={tab}>
                {state.loading ? (
                  <div className="text-center py-5">
                    <Spinner color="primary" />
                  </div>
                ) : state.error ? (
                  <div className="text-danger text-center py-5">
                    {state.error}
                  </div>
                ) : (
                  <TableContainer
                    columns={columns}
                    data={filteredLeads}
                    isPagination={true}
                    isBordered={false}
                    className="table-sm"
                    iscustomPageSize={false}
                    pagination={pagination}
                    onPageChange={handlePageChange}
                    onPageSizeChange={handlePageSizeChange}
                  />
                )}
              </TabPane>
            ))}
          </TabContent>
        </CardBody>
      </Card>
      <ConvertToSaleModal
        isOpen={saleModalOpen}
        toggle={() => setSaleModalOpen(false)}
        leadId={pendingSale?.leadId}
        campaignId={pendingSale?.campaignId}
        assigneeId={pendingSale?.targetUserId}
        products={state.products}
        onSubmit={({ leadId, newStatus = "sold" }) => {
          // Update both the lead status AND the assignee's status
          setState((prev) => ({
            ...prev,
            leads: prev.leads.map((lead) => {
              if (lead.id === leadId) {
                // Update the assignees array
                const updatedAssignees = Array.isArray(lead.assignees)
                  ? lead.assignees.map((a) =>
                      a.userId === pendingSale.targetUserId
                        ? { ...a, status: newStatus, status_updated: true }
                        : a
                    )
                  : [
                      {
                        userId: pendingSale.targetUserId,
                        status: newStatus,
                        status_updated: true,
                      },
                    ];

                return {
                  ...lead,
                  assignees: updatedAssignees,
                  status: newStatus,
                  status_updated: true,
                };
              }
              return lead;
            }),
            statusCounts: {
              ...prev.statusCounts,
              sold: (prev.statusCounts.sold || 0) + 1,
              [pendingSale.previousStatus]: Math.max(
                0,
                (prev.statusCounts[pendingSale.previousStatus] || 0) - 1
              ),
            },
          }));

          // Then refresh data
          loadData().catch((err) => {
            console.error("Failed to refresh data:", err);
            toast.error("Lead was converted but failed to refresh data");
          });

          toast.success("Lead status updated to sold");
          setSaleModalOpen(false);
          setPendingSale(null);
        }}
      />
    </>
  );
};

export default UserLeads;
