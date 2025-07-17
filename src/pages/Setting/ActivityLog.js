import { Card, CardBody, Container, Row, Col } from "reactstrap";
import Breadcrumb from "../../components/Common/Breadcrumb";
import { useMemo, useState, useEffect } from "react";
import { FiTrash2, FiFilter, FiRefreshCw } from "react-icons/fi";
import TableContainer from "../../components/Common/TableContainer";
import Select from "react-select";
import {
  getActivitiesByUserId,
  deleteActivityById,
} from "../../services/activityService";
import useDeleteConfirmation from "../../components/Modals/DeleteConfirmation";

const ActivityLog = () => {
  const { confirmDelete } = useDeleteConfirmation();
  const userId = parseInt(localStorage.getItem("userId"), 10);
  const [searchText, setSearchText] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const breadcrumbItems = [
    { title: "Dashboard", link: "/" },
    { title: "Settings", link: "#" },
    { title: "Activity Log", link: "#" },
  ];

  // Fetch activities
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const data = await getActivitiesByUserId(userId);
        console.log("📦 Raw Activity Data:", data);

        const authUserString = localStorage.getItem("authUser");
        let fullName = "Unknown";
        if (authUserString) {
          const authUser = JSON.parse(authUserString);
          if (authUser.firstname && authUser.lastname) {
            fullName =
              authUser.firstname.charAt(0).toUpperCase() +
              authUser.firstname.slice(1) +
              " " +
              authUser.lastname.charAt(0).toUpperCase() +
              authUser.lastname.slice(1);
          }
        }

        const updatedActivities = data.map((activity) => ({
          ...activity,
          username: fullName,
        }));

        console.log("✅ Updated Activities:");

        setActivities(updatedActivities);
        setError(null);
      } catch (err) {
        setError(err.message);
      }
    };

    if (userId) {
      fetchActivities();
    } else {
      setError("No user ID provided in localStorage");
    }
  }, [userId]);

  const handleDeleteActivity = (id) => {
    confirmDelete(
      () => deleteActivityById(id),
      () =>
        setActivities((prev) => prev.filter((activity) => activity.id !== id)),
      "Activity log"
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })} ${date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })}`;
  };

  const getRole = (activity) => {
    if (activity.role) return activity.role;
    const details =
      activity.details?.toLowerCase() || activity.action?.toLowerCase() || "";
    if (details.includes("admin")) return "Admin";
    if (details.includes("vendor")) return "Vendor";
    if (details.includes("client") || details.includes("order"))
      return "Client";
    return "Unknown";
  };

  // Columns for the table
  const columns = useMemo(
    () => [
      {
        Header: "Full Name",
        accessor: "username",
        disableFilters: true,
        width: 120,
        Cell: ({ value }) => (
          <span
            className="text-nowrap text-truncate d-block"
            style={{ maxWidth: "120px" }}
          >
            {value || "Unknown"}
          </span>
        ),
      },
      {
        Header: "Activity Log",
        accessor: "details",
        disableFilters: true,
        width: 200,
        Cell: ({ row }) => (
          <div
            className="d-flex align-items-start"
            style={{ alignItems: "flex-start" }}
          >
            <span
              className="text-truncate"
              style={{
                maxWidth: "200px",
                display: "inline-block",
                whiteSpace: "normal",
              }}
            >
              {row.original.details || row.original.action}
            </span>
          </div>
        ),
      },
      {
        Header: "Time",
        accessor: "created_at",
        disableFilters: true,
        width: 150,
        Cell: ({ value }) => (
          <span className="text-nowrap">{formatDate(value)}</span>
        ),
      },
      {
        Header: "Action",
        disableFilters: true,
        Cell: ({ row }) => (
          <div className="d-flex gap-2">
            <button
              className="btn btn-danger btn-sm px-2"
              onClick={() => handleDeleteActivity(row.original.id)}
            >
              <FiTrash2 size={14} />
            </button>
          </div>
        ),
        width: 80,
      },
    ],
    []
  );

  // Get unique clients and vendors for dropdowns
  const clientOptions = useMemo(() => {
    const uniqueClients = new Set();
    activities.forEach((activity) => {
      const role = getRole(activity);
      if (role === "Client" || role === "Admin") {
        uniqueClients.add(activity.username || "Unknown");
      }
    });
    return Array.from(uniqueClients).map((client) => ({
      value: client,
      label: client,
    }));
  }, [activities]);

  const vendorOptions = useMemo(() => {
    const uniqueVendors = new Set();
    activities.forEach((activity) => {
      if (getRole(activity) === "Vendor") {
        uniqueVendors.add(activity.username || "Unknown");
      }
    });
    return Array.from(uniqueVendors).map((vendor) => ({
      value: vendor,
      label: vendor,
    }));
  }, [activities]);

  // Filter activities
  const filteredActivities = useMemo(() => {
    let filtered = activities.filter((activity) =>
      Object.values(activity).some((val) =>
        String(val).toLowerCase().includes(searchText.toLowerCase())
      )
    );

    if (selectedClient) {
      filtered = filtered.filter(
        (activity) =>
          (activity.username || "Unknown").toLowerCase() ===
          selectedClient.value.toLowerCase()
      );
    }

    if (selectedVendor) {
      filtered = filtered.filter(
        (activity) =>
          (activity.username || "Unknown").toLowerCase() ===
          selectedVendor.value.toLowerCase()
      );
    }

    if (startDate) {
      const start = new Date(startDate);
      filtered = filtered.filter(
        (activity) => new Date(activity.created_at) >= start
      );
    }

    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      filtered = filtered.filter(
        (activity) => new Date(activity.created_at) <= end
      );
    }

    return filtered.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
  }, [
    activities,
    searchText,
    selectedClient,
    selectedVendor,
    startDate,
    endDate,
  ]);

  const handleResetFilters = () => {
    setSelectedClient(null);
    setSelectedVendor(null);
    setStartDate("");
    setEndDate("");
    setSearchText("");
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumb title="ACTIVITY LOG" breadcrumbItems={breadcrumbItems} />
        <Card className="shadow-sm">
          <CardBody className="p-3 p-md-4">
            {/* Success and Error Display */}
            {successMessage && (
              <div className="alert alert-success mb-3">{successMessage}</div>
            )}
            {error && <div className="alert alert-danger mb-3">{error}</div>}

            {/* Mobile Filter Toggle Button */}
            <div className="d-md-none mb-3">
              <button
                className="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center"
                onClick={toggleFilters}
              >
                <FiFilter className="me-2" />
                {showFilters ? "Hide Filters" : "Show Filters"}
              </button>
            </div>

            {/* Filter Controls Section */}
            <Row
              className={`mb-3 g-3 align-items-center ${
                showFilters ? "d-flex" : "d-none d-md-flex"
              }`}
            >
              <Col xs={12} md={6} lg={2}>
                <div>
                  <label className="form-label">Select Client</label>
                  <Select
                    options={clientOptions}
                    value={selectedClient}
                    onChange={setSelectedClient}
                    isSearchable
                    placeholder="All Clients"
                    className="react-select-container"
                    classNamePrefix="react-select"
                    styles={{
                      control: (provided) => ({
                        ...provided,
                        minHeight: "38px",
                        height: "38px",
                      }),
                    }}
                  />
                </div>
              </Col>
              <Col xs={12} md={6} lg={2}>
                <div>
                  <label className="form-label">Select Vendor</label>
                  <Select
                    options={vendorOptions}
                    value={selectedVendor}
                    onChange={setSelectedVendor}
                    isSearchable
                    placeholder="All Vendors"
                    className="react-select-container"
                    classNamePrefix="react-select"
                    styles={{
                      control: (provided) => ({
                        ...provided,
                        minHeight: "38px",
                        height: "38px",
                      }),
                    }}
                  />
                </div>
              </Col>
              <Col xs={12} md={12} lg={4}>
                <div>
                  <label className="form-label">Date Range</label>
                  <div className="d-flex flex-wrap flex-md-nowrap align-items-center">
                    <input
                      type="date"
                      className="form-control me-2 mb-2 mb-md-0"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      placeholder="Start date"
                    />
                    <span className="me-2 d-none d-md-block">to</span>
                    <input
                      type="date"
                      className="form-control me-2 mb-2 mb-md-0"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      placeholder="End date"
                    />
                    <button
                      className="btn btn-primary d-flex align-items-center justify-content-center"
                      onClick={handleResetFilters}
                      style={{
                        height: "38px",
                        minWidth: "120px",
                      }}
                    >
                      <FiRefreshCw className="me-2" size={16} />
                      Reset
                    </button>
                  </div>
                </div>
              </Col>
            </Row>

            {/* Table Controls Section */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-3 gap-2">
              <div className="d-flex align-items-center">
                <span className="me-2">Show</span>
                <select
                  className="form-select form-select-sm"
                  style={{ width: "80px" }}
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span className="ms-2">entries</span>
              </div>
              <div
                className="d-flex align-items-center position-relative"
                style={{ width: "250px" }}
              >
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search activities..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </div>
            </div>

            {/* Table Section */}
            <div className="table-responsive">
              {activities.length === 0 && !error ? (
                <p className="text-muted">No activity logs found.</p>
              ) : (
                <TableContainer
                  columns={columns}
                  data={filteredActivities}
                  isPagination={true}
                  iscustomPageSize={true}
                  isBordered={false}
                  customPageSize={pageSize}
                  className="custom-table"
                  theadClassName="table-light"
                />
              )}
            </div>
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default ActivityLog;
