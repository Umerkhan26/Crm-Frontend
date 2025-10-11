import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Container,
  Card,
  CardBody,
  Row,
  Col,
  Spinner,
  Badge,
  Button,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Table,
  Alert,
} from "reactstrap";
import { getUserById } from "../../services/auth";
import {
  fetchLeadStatusSummary,
  getLeadsByCampaignAndAssignee,
  getLeadActivitiesByLeadId,
  fetchLeadsByAssigneeId,
  deleteLeadActivityById,
} from "../../services/leadService";
import { fetchCampaigns } from "../../services/campaignService";
import { toast } from "react-toastify";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { format } from "date-fns";
import { getLeadReportByUser } from "../../services/reportService";
import useDeleteConfirmation from "../../components/Modals/DeleteConfirmation";
import { FaTrash } from "react-icons/fa";
import { hasAnyPermission } from "../../utils/permissions";
import { useSelector } from "react-redux";

const UserReportsPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activityLoading, setActivityLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("daily");
  const [activities, setActivities] = useState([]);
  const [activitiesLoading, setActivitiesLoading] = useState(false);
  const [activitiesError, setActivitiesError] = useState(null);
  const [deletingActivityId, setDeletingActivityId] = useState(null);
  const { confirmDelete } = useDeleteConfirmation();
  const currentUser = useSelector((state) => state.Login?.user);
  const isAdmin = hasAnyPermission(currentUser, ["user:get"]);

  const [reportsData, setReportsData] = useState({
    daily: {},
    weekly: {},
    monthly: {},
    campaignWise: [],
    leadActivity: [],
  });
  const [activityData, setActivityData] = useState({
    daily: null,
    weekly: null,
    monthly: null,
  });
  const [campaigns, setCampaigns] = useState([]);
  const [summary, setSummary] = useState({
    totalLeads: 0,
    totalCalls: 0,
    totalSales: 0,
    conversionRate: 0,
  });

  // Define the expected status keys to ensure consistent structure
  const statusKeys = [
    "pending",
    "to_call",
    "most_interested",
    "sold",
    "not_interested",
  ];

  const fetchLeadActivities = async () => {
    try {
      setActivitiesLoading(true);
      setActivitiesError(null);

      const activitiesResponse = await getLeadActivitiesByLeadId(userId);

      const fetchedActivities = Array.isArray(activitiesResponse)
        ? activitiesResponse
        : activitiesResponse.data || activitiesResponse.activities || [];

      setActivities(fetchedActivities);
    } catch (err) {
      console.error("Error fetching activities:", err);
      setActivitiesError(err.message || "Failed to fetch activities");
    } finally {
      setActivitiesLoading(false);
    }
  };

  // Add this function to handle activity deletion
  const handleDeleteActivity = (activityId) => {
    confirmDelete(
      async () => {
        setDeletingActivityId(activityId);
        const token = localStorage.getItem("token");
        await deleteLeadActivityById(activityId, token);
        setActivities((prev) =>
          prev.filter((activity) => activity.id !== activityId)
        );
        toast.success("Activity deleted successfully");
        await fetchLeadActivities();
      },
      () => setDeletingActivityId(null),
      "activity"
    );
  };

  // Fetch user details
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        const response = await getUserById(userId);
        let userData =
          response.data?.find((u) => u.id === parseInt(userId)) ||
          response.user ||
          response.data ||
          response;

        if (!userData) {
          throw new Error("User data not found");
        }
        setUser(userData);
      } catch (err) {
        toast.error(err.message || "Failed to fetch user details");
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [userId, navigate]);

  // Fetch campaigns
  useEffect(() => {
    const loadCampaigns = async () => {
      try {
        const res = await fetchCampaigns({ page: 1, limit: 1000 });
        const allCampaigns = res.data || [];
        setCampaigns(allCampaigns);
      } catch (err) {
        console.error("Failed to load campaigns:", err.message);
      }
    };
    loadCampaigns();
  }, []);

  // Fetch activity data and status breakdown when tab changes or user loads
  useEffect(() => {
    const fetchActivityData = async () => {
      if (!user) return;

      try {
        setActivityLoading(true);

        let period = "daily";
        switch (activeTab) {
          case "weekly":
            period = "weekly";
            break;
          case "monthly":
            period = "monthly";
            break;
          default:
            period = "daily";
        }

        // Only fetch if not already cached
        if (!activityData[period]) {
          const activityReport = await getLeadReportByUser(userId, period);
          const reportData = activityReport?.data || activityReport;

          const statusHistory = reportData?.statusChangeHistory || [];

          const latestStatusPerLead = {};
          statusHistory.forEach((item) => {
            latestStatusPerLead[item.leadId] =
              item.newStatus?.toLowerCase() || "pending";
          });

          // ✅ Count status changes
          const statusCounts = {
            pending: 0,
            to_call: 0,
            most_interested: 0,
            sold: 0,
            not_interested: 0,
          };

          Object.values(latestStatusPerLead).forEach((status) => {
            if (statusCounts.hasOwnProperty(status)) {
              statusCounts[status]++;
            }
          });

          statusHistory.forEach((item) => {
            const key = item.newStatus?.toLowerCase() || "pending";
            if (statusCounts.hasOwnProperty(key)) {
              statusCounts[key]++;
            }
          });

          // ✅ Calculate summary
          const totalLeads = Object.values(statusCounts).reduce(
            (sum, count) => sum + count,
            0
          );
          const totalCalls =
            (statusCounts.to_call || 0) +
            (statusCounts.most_interested || 0) +
            (statusCounts.sold || 0);
          const totalSales = statusCounts.sold || 0;
          const conversionRate =
            totalCalls > 0 ? ((totalSales / totalCalls) * 100).toFixed(2) : 0;

          // ✅ Update all relevant state
          setActivityData((prev) => ({
            ...prev,
            [period]: activityReport,
          }));

          setReportsData((prev) => ({
            ...prev,
            [period]: statusCounts,
          }));

          setSummary({
            totalLeads,
            totalCalls,
            totalSales,
            conversionRate,
          });
        }
      } catch (err) {
        console.error(`Failed to fetch ${activeTab} activity data:`, err);
        toast.error(`Failed to load ${activeTab} activity data`);

        const defaultCounts = {
          pending: 0,
          to_call: 0,
          most_interested: 0,
          sold: 0,
          not_interested: 0,
        };

        setReportsData((prev) => ({
          ...prev,
          [activeTab]: defaultCounts,
        }));
      } finally {
        setActivityLoading(false);
      }
    };

    if (["daily", "weekly", "monthly"].includes(activeTab)) {
      fetchActivityData();
    }
  }, [activeTab, user, userId]);

  // Process status summary data to ensure consistent structure
  const processStatusData = (statusData) => {
    console.log("Processing status data input:", statusData);

    // If statusData is already in the correct format with status counts, return it
    if (
      typeof statusData === "object" &&
      statusData !== null &&
      !Array.isArray(statusData)
    ) {
      // Check if this looks like our status counts object
      const hasStatusKeys = statusKeys.some((key) => key in statusData);

      if (hasStatusKeys) {
        // Ensure all status keys are present with default value 0
        const processed = {};
        statusKeys.forEach((key) => {
          processed[key] = statusData[key] || 0;
        });
        console.log("Processed status data (has keys):", processed);
        return processed;
      } else {
        // If it doesn't have our status keys, check if it might be nested
        console.log(
          "Status data doesn't contain expected keys, checking for nested structure"
        );
      }
    }

    // If we can't process the data, create default structure
    const defaultData = {};
    statusKeys.forEach((key) => {
      defaultData[key] = 0;
    });
    console.log("Returning default data structure:", defaultData);
    return defaultData;
  };

  useEffect(() => {
    const fetchStatusSummaryData = async () => {
      if (!user) return;

      try {
        setLoading(true);

        const statusSummary = await fetchLeadStatusSummary(userId);
        console.log("Raw API response:", statusSummary);

        const statusCounts =
          statusSummary.statusCounts ||
          statusSummary.data?.statusCounts ||
          statusSummary.data ||
          statusSummary;

        console.log("Extracted status counts:", statusCounts);

        const summaryData = processStatusData(statusCounts);
        console.log("Processed summary data:", summaryData);

        // Calculate summary from status counts
        const totalLeads = Object.values(summaryData).reduce(
          (sum, count) => sum + count,
          0
        );
        const totalCalls = summaryData.to_call || 0;
        const totalSales = summaryData.sold || 0;
        const conversionRate =
          totalCalls > 0 ? ((totalSales / totalCalls) * 100).toFixed(2) : 0;

        console.log("Calculated totals:", {
          totalLeads,
          totalCalls,
          totalSales,
          conversionRate,
        });

        setSummary({
          totalLeads,
          totalCalls,
          totalSales,
          conversionRate,
        });

        // Set the processed data for all time periods
        setReportsData((prev) => ({
          ...prev,
          daily: summaryData,
          weekly: summaryData,
          monthly: summaryData,
        }));

        await fetchAdditionalData();
      } catch (err) {
        console.error("Failed to fetch status summary:", err);
        toast.error("Failed to load reports data");

        // Set default data on error
        const defaultData = processStatusData({});
        setReportsData((prev) => ({
          ...prev,
          daily: defaultData,
          weekly: defaultData,
          monthly: defaultData,
        }));
      } finally {
        setLoading(false);
      }
    };

    const fetchAdditionalData = async () => {
      try {
        if (!campaigns.length) return;

        const campaignWiseData = [];

        // Loop through all campaigns
        for (const campaign of campaigns) {
          if (!campaign.name) continue; // Skip if no name

          const response = await getLeadsByCampaignAndAssignee(
            campaign.name,
            userId
          );

          const data = Array.isArray(response) ? response : response.data || [];

          // Map to expected structure
          const mapped = data.map((item) => ({
            campaignName: item.campaignName || campaign.name,
            total: item.total || 0,
            pending: item.pending || 0,
            to_call: item.to_call || 0,
            most_interested: item.most_interested || 0,
            sold: item.sold || 0,
            not_interested: item.not_interested || 0,
          }));

          campaignWiseData.push(...mapped);
        }

        console.log("Campaign-wise API response:", campaignWiseData);

        // Fetch lead activity separately if needed
        const leadsResponse = await fetchLeadsByAssigneeId(userId, "all");
        const leads = Array.isArray(leadsResponse)
          ? leadsResponse
          : leadsResponse.data || [];

        const leadActivity = leads
          .sort(
            (a, b) =>
              new Date(b.updated_at || b.created_at) -
              new Date(a.updated_at || a.created_at)
          )
          .slice(0, 50)
          .map((lead) => ({
            id: lead.id,
            campaignName: lead.campaignName || lead.campaign?.name || "Unknown",
            customerName:
              `${lead.leadData?.first_name || lead.first_name || ""} ${
                lead.leadData?.last_name || lead.last_name || ""
              }`.trim() || "Unknown",
            phone: lead.leadData?.phone_number || lead.phone_number || "N/A",
            previousStatus: lead.previousStatus,
            currentStatus: lead.status,
            action: getActionDescription(lead),
            actionTime: lead.updated_at || lead.created_at,
          }));

        setReportsData((prev) => ({
          ...prev,
          campaignWise: campaignWiseData,
          leadActivity,
        }));
      } catch (err) {
        console.error("Failed to fetch campaign-wise data:", err);
        toast.error("Failed to load campaign-wise data");
      }
    };

    fetchStatusSummaryData();
  }, [user, userId]);

  // Helper function to render activity data
  const renderActivityData = (period) => {
    const data = activityData[period];

    if (!data) {
      return (
        <Alert color="info">
          No activity data available for {period} period
        </Alert>
      );
    }

    return (
      <Row>
        <Col md={6}>
          <Card className="bg-light mb-3">
            <CardBody>
              <h6>Activity Summary</h6>
              <p>
                <strong>Total Activities:</strong> {data.totalActivities}
              </p>
              <p>
                <strong>Leads Worked On:</strong> {data.totalLeadsWorkedOn}
              </p>
              <p>
                <strong>Notes Added:</strong> {data.totalNotes}
              </p>
              <p>
                <strong>Reminders Set:</strong> {data.totalReminders}
              </p>
              <p>
                <strong>Last Activity:</strong>{" "}
                {format(new Date(data.lastActivityAt), "PPpp")}
              </p>
            </CardBody>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <CardBody>
              <h6>Leads Worked On</h6>
              {data.leads && data.leads.length > 0 ? (
                <ul className="list-unstyled">
                  {data.leads.map((lead) => (
                    <li key={lead.id} className="mb-2">
                      <Badge color="primary" className="me-2">
                        #{lead.id}
                      </Badge>
                      {lead.name}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted">
                  No leads worked on during this period
                </p>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    );
  };

  const getActionDescription = (lead) => {
    const status = lead.status?.toLowerCase().replace(/\s+/g, "_") || "pending";
    switch (status) {
      case "sold":
        return "Converted to Sale";
      case "most_interested":
        return "Marked as Most Interested";
      case "to_call":
        return "Scheduled for Call";
      case "not_interested":
        return "Marked as Not Interested";
      default:
        return "Status Updated";
    }
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
      case "not_interested":
        return "secondary";
      default:
        return "secondary";
    }
  };

  const formatStatusKey = (status) => {
    return status.replace(/_/g, " ").toUpperCase();
  };

  // Helper function to render status table rows
  const renderStatusTableRows = (statusData) => {
    return statusKeys.map((status) => (
      <tr key={status}>
        <td>
          <Badge color={getStatusBadgeColor(status)}>
            {formatStatusKey(status)}
          </Badge>
        </td>
        <td>{statusData[status] || 0}</td>
        <td>
          {summary.totalLeads > 0
            ? (((statusData[status] || 0) / summary.totalLeads) * 100).toFixed(
                1
              )
            : 0}
          %
        </td>
      </tr>
    ));
  };

  const breadcrumbItems = [
    { title: "Dashboard", link: "/" },
    { title: "Users", link: "/allUsers" },
    { title: "User Details", link: `/user-details/${userId}` },
    { title: "Reports", link: "#" },
  ];

  if (loading && !user) {
    return (
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="User Reports" breadcrumbItems={breadcrumbItems} />
          <Card>
            <CardBody className="text-center py-5">
              <Spinner color="primary" />
              <div className="mt-2">Loading user reports...</div>
            </CardBody>
          </Card>
        </Container>
      </div>
    );
  }

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs title="User Reports" breadcrumbItems={breadcrumbItems} />

        {/* Header Section */}
        <Card className="mb-4">
          <CardBody>
            <Row className="align-items-center">
              <Col md={6}>
                <h4 className="mb-1">
                  {user?.firstname} {user?.lastname} - Performance Reports
                </h4>
                <p className="text-muted mb-0">
                  {user?.role?.name} • {user?.email}
                </p>
              </Col>
              <Col md={6} className="text-end">
                <Button
                  color="primary"
                  onClick={() => navigate(`/user-details/${userId}`)}
                >
                  <i className="mdi mdi-arrow-left me-1"></i>
                  Back to User Details
                </Button>
              </Col>
            </Row>
          </CardBody>
        </Card>

        {/* Summary Cards */}
        <Row className="mb-4">
          <Col xl={3} md={6}>
            <Card className="card-hover">
              <CardBody>
                <div className="d-flex align-items-center">
                  <div className="flex-grow-1">
                    <h4 className="mb-0">{summary.totalLeads}</h4>
                    <p className="text-muted mb-0">Total Leads</p>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="avatar-sm rounded-circle bg-primary bg-soft text-center">
                      <i className="mdi mdi-account-multiple-outline font-size-24 text-primary"></i>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col xl={3} md={6}>
            <Card className="card-hover">
              <CardBody>
                <div className="d-flex align-items-center">
                  <div className="flex-grow-1">
                    <h4 className="mb-0">{summary.totalCalls}</h4>
                    <p className="text-muted mb-0">Calls Made</p>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="avatar-sm rounded-circle bg-success bg-soft text-center">
                      <i className="mdi mdi-phone-outline font-size-24 text-success"></i>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col xl={3} md={6}>
            <Card className="card-hover">
              <CardBody>
                <div className="d-flex align-items-center">
                  <div className="flex-grow-1">
                    <h4 className="mb-0">{summary.totalSales}</h4>
                    <p className="text-muted mb-0">Total Sales</p>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="avatar-sm rounded-circle bg-info bg-soft text-center">
                      <i className="mdi mdi-chart-bar font-size-24 text-info"></i>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col xl={3} md={6}>
            <Card className="card-hover">
              <CardBody>
                <div className="d-flex align-items-center">
                  <div className="flex-grow-1">
                    <h4 className="mb-0">{summary.conversionRate}%</h4>
                    <p className="text-muted mb-0">Conversion Rate</p>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="avatar-sm rounded-circle bg-warning bg-soft text-center">
                      <i className="mdi mdi-trending-up font-size-24 text-warning"></i>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Reports Tabs */}
        <Card>
          <CardBody>
            <Nav tabs className="mb-4">
              <NavItem>
                <NavLink
                  className={activeTab === "daily" ? "active" : ""}
                  onClick={() => setActiveTab("daily")}
                >
                  Today's Work
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={activeTab === "weekly" ? "active" : ""}
                  onClick={() => setActiveTab("weekly")}
                >
                  This Week
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={activeTab === "monthly" ? "active" : ""}
                  onClick={() => setActiveTab("monthly")}
                >
                  This Month
                </NavLink>
              </NavItem>
              {/* <NavItem>
                <NavLink
                  className={activeTab === "campaign" ? "active" : ""}
                  onClick={() => setActiveTab("campaign")}
                >
                  Campaign-wise
                </NavLink>
              </NavItem> */}
              <NavItem>
                <NavLink
                  className={activeTab === "activity" ? "active" : ""}
                  onClick={() => setActiveTab("activity")}
                >
                  Recent Activity
                </NavLink>
              </NavItem>
            </Nav>

            <TabContent activeTab={activeTab}>
              {/* Daily Report Tab */}
              <TabPane tabId="daily">
                <h5>
                  Today's Performance ({format(new Date(), "MMMM d, yyyy")})
                </h5>
                {activityLoading ? (
                  <div className="text-center py-4">
                    <Spinner color="primary" />
                    <div>Loading activity data...</div>
                  </div>
                ) : (
                  <>
                    {renderActivityData("daily")}
                    <hr />
                    <h6>Status Breakdown</h6>
                    <Row>
                      <Col md={8}>
                        <Table responsive bordered>
                          <thead>
                            <tr>
                              <th>Status</th>
                              <th>Count</th>
                              <th>Percentage</th>
                            </tr>
                          </thead>
                          <tbody>
                            {renderStatusTableRows(reportsData.daily)}
                          </tbody>
                        </Table>
                      </Col>
                      <Col md={4}>
                        <Card className="bg-light">
                          <CardBody>
                            <h6>Today's Summary</h6>
                            <p>Total Leads: {summary.totalLeads}</p>
                            <p>Calls Made: {summary.totalCalls}</p>
                            <p>Sales Today: {summary.totalSales}</p>
                            <p>Conversion Rate: {summary.conversionRate}%</p>
                          </CardBody>
                        </Card>
                      </Col>
                    </Row>
                  </>
                )}
              </TabPane>

              {/* Weekly Report Tab */}
              <TabPane tabId="weekly">
                <h5>This Week's Performance</h5>
                {activityLoading ? (
                  <div className="text-center py-4">
                    <Spinner color="primary" />
                    <div>Loading activity data...</div>
                  </div>
                ) : (
                  <>
                    {renderActivityData("weekly")}
                    <hr />
                    <h6>Status Breakdown</h6>
                    <Table responsive bordered>
                      <thead>
                        <tr>
                          <th>Status</th>
                          <th>Count</th>
                          <th>Percentage</th>
                        </tr>
                      </thead>
                      <tbody>{renderStatusTableRows(reportsData.weekly)}</tbody>
                    </Table>
                  </>
                )}
              </TabPane>

              {/* Monthly Report Tab */}
              <TabPane tabId="monthly">
                <h5>This Month's Performance</h5>
                {activityLoading ? (
                  <div className="text-center py-4">
                    <Spinner color="primary" />
                    <div>Loading activity data...</div>
                  </div>
                ) : (
                  <>
                    {renderActivityData("monthly")}
                    <hr />
                    <h6>Status Breakdown</h6>
                    <Table responsive bordered>
                      <thead>
                        <tr>
                          <th>Status</th>
                          <th>Count</th>
                          <th>Percentage</th>
                        </tr>
                      </thead>
                      <tbody>
                        {renderStatusTableRows(reportsData.monthly)}
                      </tbody>
                    </Table>
                  </>
                )}
              </TabPane>

              {/* Campaign-wise Report Tab */}
              <TabPane tabId="campaign">
                <h5>Campaign-wise Performance</h5>
                {loading ? (
                  <div className="text-center py-4">
                    <Spinner color="primary" />
                  </div>
                ) : reportsData.campaignWise.length > 0 ? (
                  <div className="table-responsive">
                    <Table responsive bordered>
                      <thead>
                        <tr>
                          <th>Campaign</th>
                          <th>Total</th>
                          <th>Pending</th>
                          <th>To Call</th>
                          <th>Interested</th>
                          <th>Sold</th>
                          <th>Not Interested</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reportsData.campaignWise.map((campaign, index) => (
                          <tr key={index}>
                            <td>{campaign.campaignName}</td>
                            <td>{campaign.total}</td>
                            <td>{campaign.pending}</td>
                            <td>{campaign.to_call}</td>
                            <td>{campaign.most_interested}</td>
                            <td>
                              <Badge color="success">{campaign.sold}</Badge>
                            </td>
                            <td>{campaign.not_interested}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                ) : (
                  <Alert color="info">No campaign data available</Alert>
                )}
              </TabPane>

              {/* Recent Activity Tab */}
              <TabPane tabId="activity">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0">Recent Lead Activities</h5>
                  <Button
                    color="primary"
                    size="sm"
                    onClick={fetchLeadActivities}
                    disabled={activitiesLoading}
                  >
                    {activitiesLoading ? <Spinner size="sm" /> : "Refresh"}
                  </Button>
                </div>

                {activitiesLoading ? (
                  <div className="text-center py-4">
                    <Spinner color="primary" />
                    <div>Loading activities...</div>
                  </div>
                ) : activitiesError ? (
                  <Alert color="danger" className="py-2">
                    {activitiesError}
                  </Alert>
                ) : activities.length > 0 ? (
                  <div
                    className="table-responsive"
                    style={{ maxHeight: "500px", overflowY: "auto" }}
                  >
                    <Table responsive bordered hover>
                      <thead className="table-light">
                        <tr>
                          <th style={{ width: "10%" }}>Action</th>
                          <th style={{ width: "25%" }}>Details</th>
                          <th style={{ width: "8%" }}>Entity Id</th>
                          <th style={{ width: "15%" }}>Performed By</th>
                          <th style={{ width: "17%" }}>Email</th>
                          <th style={{ width: "15%" }}>Campaign</th>
                          <th style={{ width: "10%" }}>Created At</th>
                          {isAdmin && <th style={{ width: "5%" }}>Delete</th>}
                        </tr>
                      </thead>
                      <tbody>
                        {activities.map((activity, index) => (
                          <tr
                            key={activity.id}
                            className={index % 2 === 0 ? "table-light" : ""}
                          >
                            <td>
                              <span
                                className={`badge ${
                                  activity.action?.includes("note")
                                    ? "bg-warning text-dark"
                                    : activity.action?.includes("reminder")
                                    ? "bg-info"
                                    : activity.action?.includes("email")
                                    ? "bg-success"
                                    : "bg-secondary"
                                }`}
                                style={{
                                  textTransform: "capitalize",
                                  fontSize: "0.75rem",
                                }}
                              >
                                {activity.action?.replace(/_/g, " ") || "N/A"}
                              </span>
                            </td>
                            <td
                              title={activity.details}
                              style={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                maxWidth: "200px",
                              }}
                            >
                              {activity.details || "N/A"}
                            </td>
                            <td>{activity.entityId || "N/A"}</td>
                            <td>
                              {(activity.performedByUser?.firstname || "User") +
                                " " +
                                (activity.performedByUser?.lastname || "")}{" "}
                              <small className="text-muted">
                                #{activity.performedBy}
                              </small>
                            </td>
                            <td
                              title={activity.performedByUser?.email}
                              style={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                maxWidth: "150px",
                              }}
                            >
                              {activity.performedByUser?.email || "N/A"}
                            </td>
                            <td>{activity.Lead?.campaignName || "N/A"}</td>
                            <td>
                              {activity.createdAt
                                ? new Date(activity.createdAt).toLocaleString()
                                : "N/A"}
                            </td>
                            {isAdmin && (
                              <td>
                                <Button
                                  color="danger"
                                  size="sm"
                                  onClick={() =>
                                    handleDeleteActivity(activity.id)
                                  }
                                  disabled={deletingActivityId === activity.id}
                                  title="Delete activity"
                                  style={{ padding: "2px 6px" }}
                                >
                                  {deletingActivityId === activity.id ? (
                                    <Spinner size="sm" />
                                  ) : (
                                    <FaTrash />
                                  )}
                                </Button>
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                ) : (
                  <Alert color="info" className="py-3">
                    No activities found for this user.
                  </Alert>
                )}
              </TabPane>
            </TabContent>
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default UserReportsPage;
