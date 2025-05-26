import { Card, CardBody, Container, Row, Col } from "reactstrap";
import Breadcrumb from "../../components/Common/Breadcrumb";
import { useMemo, useState } from "react";
import { FiTrash2, FiFilter, FiRefreshCw, FiSearch } from "react-icons/fi";
import TableContainer from "../../components/Common/TableContainer";
import Select from "react-select";

const ActivityLog = () => {
  const [searchText, setSearchText] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const breadcrumbItems = [
    { title: "Dashboard", link: "/" },
    { title: "Settings", link: "#" },
    { title: "Activity Log", link: "#" },
  ];

  const columns = useMemo(
    () => [
      {
        Header: "Full Name",
        accessor: "fullName",
        disableFilters: true,
        width: 120,
        Cell: ({ value }) => (
          <span
            className="text-nowrap text-truncate d-block"
            style={{ maxWidth: "120px" }}
          >
            {value}
          </span>
        ),
      },
      {
        Header: "Activity Log",
        accessor: "activityLog",
        disableFilters: true,
        width: 300,
        Cell: ({ value }) => (
          <span className="text-truncate d-block" style={{ maxWidth: "300px" }}>
            {value}
          </span>
        ),
      },
      {
        Header: "Time",
        accessor: "time",
        disableFilters: true,
        width: 100,
        Cell: ({ value }) => <span className="text-nowrap">{value}</span>,
      },
      {
        Header: "Action",
        disableFilters: true,
        Cell: ({ row }) => (
          <div className="d-flex gap-2">
            <button className="btn btn-danger btn-sm px-2">
              <FiTrash2 size={14} />
            </button>
          </div>
        ),
        width: 80,
      },
    ],
    []
  );

  const activityData = useMemo(
    () => [
      {
        id: 1,
        fullName: "admin crm",
        activityLog: "User Login [email: admin@eraxon.com, Role: Admin]",
        time: "4 hours ago",
        date: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        role: "Admin",
      },
      {
        id: 2,
        fullName: "admin crm",
        activityLog: "User Login [email: admin@eraxon.com, Role: Admin]",
        time: "17 hours ago",
        date: new Date(Date.now() - 17 * 60 * 60 * 1000).toISOString(),
        role: "Admin",
      },
      {
        id: 3,
        fullName: "john doe",
        activityLog: "User Logout [email: john.doe@eraxon.com, Role: Vendor]",
        time: "1 day ago",
        date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        role: "Vendor",
      },
      {
        id: 4,
        fullName: "admin crm",
        activityLog: "User Login [email: admin@eraxon.com, Role: Admin]",
        time: "4 days ago",
        date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        role: "Admin",
      },
      {
        id: 5,
        fullName: "jane smith",
        activityLog:
          "Order Created [email: jane.smith@eraxon.com, Role: Client]",
        time: "5 days ago",
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        role: "Client",
      },
      {
        id: 6,
        fullName: "admin crm",
        activityLog: "User Login [email: admin@eraxon.com, Role: Admin]",
        time: "6 days ago",
        date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        role: "Admin",
      },
      {
        id: 7,
        fullName: "mike brown",
        activityLog:
          "Activity Updated [email: mike.brown@eraxon.com, Role: Vendor]",
        time: "1 week ago",
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        role: "Vendor",
      },
      {
        id: 8,
        fullName: "admin crm",
        activityLog: "User Login [email: admin@eraxon.com, Role: Admin]",
        time: "1 week ago",
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        role: "Admin",
      },
      {
        id: 9,
        fullName: "sarah lee",
        activityLog:
          "Order Completed [email: sarah.lee@eraxon.com, Role: Client]",
        time: "8 days ago",
        date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        role: "Client",
      },
      {
        id: 10,
        fullName: "admin crm",
        activityLog: "User Logout [email: admin@eraxon.com, Role: Admin]",
        time: "9 days ago",
        date: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
        role: "Admin",
      },
      {
        id: 11,
        fullName: "david kim",
        activityLog:
          "Activity Created [email: david.kim@eraxon.com, Role: Vendor]",
        time: "10 days ago",
        date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        role: "Vendor",
      },
      {
        id: 12,
        fullName: "admin crm",
        activityLog: "User Login [email: admin@eraxon.com, Role: Admin]",
        time: "11 days ago",
        date: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
        role: "Admin",
      },
      {
        id: 13,
        fullName: "emily chen",
        activityLog:
          "Order Cancelled [email: emily.chen@eraxon.com, Role: Client]",
        time: "12 days ago",
        date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
        role: "Client",
      },
      {
        id: 14,
        fullName: "admin crm",
        activityLog: "User Logout [email: admin@eraxon.com, Role: Admin]",
        time: "13 days ago",
        date: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString(),
        role: "Admin",
      },
      {
        id: 15,
        fullName: "peter wong",
        activityLog:
          "Activity Rejected [email: peter.wong@eraxon.com, Role: Vendor]",
        time: "2 weeks ago",
        date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        role: "Vendor",
      },
    ],
    []
  );

  // Get unique clients and vendors for dropdowns
  const clientOptions = useMemo(() => {
    const uniqueClients = new Set();
    activityData.forEach((activity) => {
      if (activity.role === "Client" || activity.role === "Admin") {
        uniqueClients.add(activity.fullName);
      }
    });
    return Array.from(uniqueClients).map((client) => ({
      value: client,
      label: client,
    }));
  }, [activityData]);

  const vendorOptions = useMemo(() => {
    const uniqueVendors = new Set();
    activityData.forEach((activity) => {
      if (activity.role === "Vendor") {
        uniqueVendors.add(activity.fullName);
      }
    });
    return Array.from(uniqueVendors).map((vendor) => ({
      value: vendor,
      label: vendor,
    }));
  }, [activityData]);

  const filteredActivities = useMemo(() => {
    let filtered = activityData.filter((activity) =>
      Object.values(activity).some((val) =>
        String(val).toLowerCase().includes(searchText.toLowerCase())
      )
    );

    // Apply client filter if selected
    if (selectedClient) {
      filtered = filtered.filter(
        (activity) =>
          activity.fullName.toLowerCase() === selectedClient.value.toLowerCase()
      );
    }

    // Apply vendor filter if selected
    if (selectedVendor) {
      filtered = filtered.filter(
        (activity) =>
          activity.fullName.toLowerCase() === selectedVendor.value.toLowerCase()
      );
    }

    // Apply date range filter if selected
    if (startDate) {
      const start = new Date(startDate);
      filtered = filtered.filter(
        (activity) => new Date(activity.date) >= start
      );
    }

    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // Include entire end day
      filtered = filtered.filter((activity) => new Date(activity.date) <= end);
    }

    // Sort filtered data in descending order by date
    return filtered.sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });
  }, [
    activityData,
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
                <FiSearch className="position-absolute ms-3" size={16} />
                <input
                  type="text"
                  className="form-control ps-5"
                  placeholder="Search activities..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </div>
            </div>

            {/* Table Section */}
            <div className="table-responsive">
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
            </div>
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default ActivityLog;
