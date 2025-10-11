import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Card,
  CardBody,
  Spinner,
  Badge,
  Button,
  Row,
  Col,
  Table,
  Alert,
} from "reactstrap";
import { getUserById } from "../../services/auth";
import {
  fetchCampaigns,
  getCampaignById,
} from "../../services/campaignService";
import { toast } from "react-toastify";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { useSelector } from "react-redux";
import { hasAnyPermission } from "../../utils/permissions";

const UserDetailsPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [campaignLoading, setCampaignLoading] = useState(false);
  const [error, setError] = useState(null);
  const currentUser = useSelector((state) => state.Login?.user);

  const fetchUserCampaigns = async (userData) => {
    try {
      setCampaignLoading(true);
      let permissions = [];
      if (Array.isArray(userData?.role?.Permissions)) {
        permissions = userData.role.Permissions;
      } else if (userData?.permissions) {
        permissions = Array.isArray(userData.permissions)
          ? userData.permissions
          : [];
      }

      const campaignPermissions = permissions.filter(
        (perm) => perm.name === "getCampaignById" && perm.resourceId
      );
      let fetchedCampaigns = [];

      if (campaignPermissions.length > 0) {
        const campaignPromises = campaignPermissions.map((perm) =>
          getCampaignById(perm.resourceId)
            .then((response) => {
              let campaign = response.data || response.campaign || response;
              if (Array.isArray(campaign)) campaign = campaign[0];
              if (!campaign) return null;
              return {
                ...campaign,
                id: campaign.id || perm.resourceId,
                accessType: "Specific",
              };
            })
            .catch((err) => {
              toast.error(`Failed to load campaign ${perm.resourceId}`);
              return null;
            })
        );
        fetchedCampaigns = (await Promise.all(campaignPromises)).filter(
          (c) => c !== null
        );
      }

      const hasGeneralCampaignAccess = permissions.some(
        (perm) =>
          perm.name === "campaign:get" || perm.name === "getCampaignById"
      );

      if (fetchedCampaigns.length === 0 && hasGeneralCampaignAccess) {
        const response = await fetchCampaigns({ page: 1, limit: 1000 });
        const allCampaigns =
          response.data?.data ||
          response.data ||
          response.campaigns ||
          response ||
          [];
        fetchedCampaigns = allCampaigns.map((campaign) => ({
          ...campaign,
          accessType: "General",
        }));
      }

      const formattedCampaigns = fetchedCampaigns.map((campaign) => {
        const campaignData = campaign.data || campaign.campaign || campaign;
        return {
          id: campaignData.id || campaign.id,
          campaignName:
            campaignData.campaignName ||
            campaignData.name ||
            campaignData.title ||
            `Campaign ${campaignData.id}`,
          accessType: campaign.accessType || "Specific",
        };
      });
      setCampaigns(formattedCampaigns);
    } catch (err) {
      toast.error("Failed to load user campaigns");
      setCampaigns([]);
    } finally {
      setCampaignLoading(false);
    }
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true);

        // Check if user has permission to view user details
        const canViewAll = hasAnyPermission(currentUser, ["user:get"]);
        const canViewSelf = hasAnyPermission(currentUser, ["user:getById"]);

        // Allow access if user has either permission
        if (!canViewAll && !canViewSelf) {
          throw new Error("You don't have permission to view this page");
        }

        // If user only has getById permission, they can only view their own profile
        if (
          canViewSelf &&
          !canViewAll &&
          currentUser?.id !== parseInt(userId)
        ) {
          throw new Error("You can only view your own profile");
        }

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
        await fetchUserCampaigns(userData);
      } catch (err) {
        setError(err.message || "Failed to fetch user details");
        toast.error(err.message || "Failed to load user details");
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [userId, currentUser, navigate]);

  const handleCampaignClick = (campaign) => {
    if (!campaign?.campaignName) {
      toast.error("This campaign has no name available");
      return;
    }

    // Check userrole and navigate accordingly
    if (user.userrole === "vendor" || user.userrole === "client") {
      // Navigate to orders with specific orders for vendor/client
      navigate(
        `/order-index?campaign=${encodeURIComponent(
          campaign.campaignName
        )}&filterUserId=${userId}&filterRole=${user.userrole}`
      );
    } else {
      // Navigate to assigned leads for others (e.g., admin)
      navigate(
        `/assigned-leads?campaign=${encodeURIComponent(
          campaign.campaignName
        )}&userId=${userId}`
      );
    }
  };

  const breadcrumbItems = [
    { title: "Dashboard", link: "/" },
    { title: "Users", link: "/allUsers" },
    { title: "User Details", link: "#" },
  ];

  if (error) {
    return (
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="User Details" breadcrumbItems={breadcrumbItems} />
          <Card>
            <CardBody>
              <Alert color="danger">{error}</Alert>

              <Button color="primary" onClick={() => navigate(-1)}>
                Go Back
              </Button>
            </CardBody>
          </Card>
        </Container>
      </div>
    );
  }

  if (loading || !user) {
    return (
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="User Details" breadcrumbItems={breadcrumbItems} />
          <Card>
            <CardBody
              className="d-flex justify-content-center align-items-center"
              style={{ minHeight: "300px" }}
            >
              <Spinner color="primary" />
            </CardBody>
          </Card>
        </Container>
      </div>
    );
  }

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs title="User Details" breadcrumbItems={breadcrumbItems} />
        <Card className="mb-4">
          <CardBody>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">
                {user.firstname} {user.lastname}
                <Badge
                  color={user.status === "blocked" ? "danger" : "success"}
                  className="ms-2"
                >
                  {user.status === "blocked" ? "Blocked" : "Active"}
                </Badge>
              </h5>
              <Button color="primary" size="sm" onClick={() => navigate(-1)}>
                Back to Users
              </Button>
            </div>
            <Row>
              <Col md={3} className="text-center">
                <img
                  src={
                    user.userImage ||
                    "https://randomuser.me/api/portraits/men/1.jpg"
                  }
                  alt="User"
                  className="rounded-circle img-thumbnail mb-3"
                  style={{
                    width: "120px",
                    height: "120px",
                    objectFit: "cover",
                  }}
                />
                <h6>{user.role?.name || "No Role"}</h6>
              </Col>
              <Col md={9}>
                <Row>
                  <Col md={6}>
                    <Table bordered size="sm">
                      <tbody>
                        <tr>
                          <th width="30%">ID</th>
                          <td>{user.id}</td>
                        </tr>
                        <tr>
                          <th>Email</th>
                          <td>{user.email}</td>
                        </tr>
                        <tr>
                          <th>Phone</th>
                          <td>{user.phone || "N/A"}</td>
                        </tr>
                        <tr>
                          <th>Address</th>
                          <td>{user.address || "N/A"}</td>
                        </tr>
                      </tbody>
                    </Table>
                  </Col>
                  <Col md={6}>
                    <Table bordered size="sm">
                      <tbody>
                        <tr>
                          <th width="30%">Branch</th>
                          <td>{user.branchname || "N/A"}</td>
                        </tr>
                        <tr>
                          <th>Created</th>
                          <td>
                            {new Date(user.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                        <tr>
                          <th>Last Updated</th>
                          <td>
                            {new Date(user.updated_at).toLocaleDateString()}
                          </td>
                        </tr>
                        <tr>
                          <th>Last Login</th>
                          <td>
                            {user.last_login
                              ? new Date(user.last_login).toLocaleString()
                              : "Never"}
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </Col>
                </Row>
              </Col>
            </Row>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">Campaign Access</h5>
              {currentUser?.role?.name?.toLowerCase() === "admin" &&
                (!user?.userrole || user?.userrole.trim() === "") && (
                  <Button
                    color="primary"
                    size="sm"
                    className="me-2"
                    onClick={() => navigate(`/user-reports/${userId}`)}
                  >
                    <i className="mdi mdi-chart-bar me-1"></i>
                    Reports
                  </Button>
                )}
            </div>
            {campaignLoading ? (
              <div className="text-center py-3">
                <Spinner color="primary" size="sm" /> Loading campaigns...
              </div>
            ) : campaigns.length > 0 ? (
              <div className="table-responsive">
                <Table bordered hover size="sm">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Campaign Name</th>
                      <th>Access Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {campaigns.map((campaign, index) => (
                      <tr key={campaign.id}>
                        <td>{index + 1}</td>
                        <td>
                          <Button
                            color="link"
                            size="sm"
                            className="p-0 text-start"
                            onClick={() => handleCampaignClick(campaign)}
                          >
                            {campaign.campaignName}
                          </Button>
                        </td>
                        <td>
                          <Badge
                            color={
                              campaign.accessType === "Specific"
                                ? "info"
                                : "success"
                            }
                          >
                            {campaign.accessType}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            ) : (
              <Alert color="info" className="mb-0">
                {user?.role?.Permissions?.length > 0 ? (
                  <>
                    <p>
                      This user has permissions but no campaign access or the
                      campaigns couldn't be loaded.
                    </p>
                    <div className="mt-2">
                      <strong>Campaign Permissions:</strong>
                      <ul className="mb-0">
                        {user.role.Permissions.filter(
                          (p) =>
                            p.name.includes("campaign") ||
                            p.name.includes("Campaign")
                        ).map((p, index) => (
                          <li key={index}>
                            {p.name}{" "}
                            {p.resourceId
                              ? `(Resource ID: ${p.resourceId})`
                              : ""}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                ) : (
                  "This user has no permissions assigned."
                )}
              </Alert>
            )}
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default UserDetailsPage;
