import React, { useMemo, useState } from "react";
import TableContainer from "../../components/Common/TableContainer";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { Card, CardBody, Container, Row, Col, Button, Badge } from "reactstrap";
import { FiEdit2, FiFilter, FiTrash2 } from "react-icons/fi";
import { FaList, FaUserPlus, FaUserSlash } from "react-icons/fa";
import { MdFilterAltOff } from "react-icons/md";
import LeadFilterModal from "../../components/Modals/LeadFilterModal";

const MasterLead = () => {
  const [searchText, setSearchText] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [leads, setLeads] = useState([
    {
      id: 1,
      agentName: "Default",
      firstName: "Default",
      lastName: "Default",
      state: "AK",
      phoneNumber: "Default",
      checked: false,
      status: "Active",
    },
    {
      id: 2,
      agentName: "Default",
      firstName: "Default",
      lastName: "Default",
      state: "AK",
      phoneNumber: "Default",
      checked: false,
      status: "Unassigned",
    },
    {
      id: 3,
      agentName: "Default",
      firstName: "Default",
      lastName: "Default",
      state: "AK",
      phoneNumber: "Default",
      checked: false,
      status: "Assigned",
    },
    {
      id: 4,
      agentName: "gg",
      firstName: "Default",
      lastName: "Default",
      state: "AK",
      phoneNumber: "Default",
      checked: false,
      status: "Active",
    },
    {
      id: 5,
      agentName: "gg",
      firstName: "Default",
      lastName: "Default",
      state: "AK",
      phoneNumber: "Default",
      checked: false,
      status: "Unassigned",
    },
  ]);

  const filteredLeads = useMemo(() => {
    let filtered = leads;

    if (searchText) {
      filtered = filtered.filter((lead) =>
        Object.values(lead).some((val) =>
          String(val).toLowerCase().includes(searchText.toLowerCase())
        )
      );
    }

    switch (activeFilter) {
      case "unassigned":
        return filtered.filter((lead) => lead.status === "Unassigned");
      case "assigned":
        return filtered.filter((lead) => lead.status === "Assigned");
      default:
        return filtered;
    }
  }, [leads, searchText, activeFilter]);

  const handleEdit = (id) => {
    console.log("Edit lead with id:", id);
  };

  const handleDelete = (id) => {
    console.log("Delete lead with id:", id);
  };

  const handleCheckboxChange = (id) => {
    setLeads((prevLeads) =>
      prevLeads.map((lead) =>
        lead.id === id ? { ...lead, checked: !lead.checked } : lead
      )
    );
  };

  const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);

  const columns = useMemo(
    () => [
      {
        Header: "Agent Name",
        accessor: "agentName",
        disableFilters: true,
        width: 120,
      },
      {
        Header: "First Name",
        accessor: "firstName",
        disableFilters: true,
        width: 120,
      },
      {
        Header: "Last Name",
        accessor: "lastName",
        disableFilters: true,
        width: 120,
      },
      {
        Header: "State",
        accessor: "state",
        disableFilters: true,
        width: 80,
      },
      {
        Header: "Phone Number",
        accessor: "phoneNumber",
        disableFilters: true,
        width: 150,
      },
      {
        Header: "Status",
        accessor: "status",
        disableFilters: true,
        Cell: ({ value }) => (
          <Badge
            color={
              value === "Active"
                ? "success"
                : value === "Assigned"
                ? "primary"
                : "secondary"
            }
          >
            {value}
          </Badge>
        ),
        width: 100,
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
              onClick={() => handleEdit(row.original.id)}
              title="Edit"
            >
              <FiEdit2 size={14} />
            </Button>
            <Button
              color="danger"
              size="sm"
              className="px-2"
              onClick={() => handleDelete(row.original.id)}
              title="Delete"
            >
              <FiTrash2 size={14} />
            </Button>
          </div>
        ),
      },
      {
        Header: "Check",
        disableFilters: true,
        width: 100,
        Cell: ({ row }) => (
          <input
            type="checkbox"
            checked={row.original.checked}
            onChange={() => handleCheckboxChange(row.original.id)}
            style={{
              width: "16px",
              height: "16px",
              cursor: "pointer",
            }}
          />
        ),
      },
    ],
    []
  );

  const breadcrumbItems = [
    { title: "Dashboard", link: "/" },
    { title: "Leads", link: "/AllLeads" },
    { title: "MasterLead", link: "#" },
  ];

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs
          title="ALL MASTER LEADS"
          breadcrumbItems={breadcrumbItems}
        />

        <Card>
          <CardBody>
            {/* Filter Buttons Row */}
            <Row className="mb-3">
              <Col md={12}>
                <div className="d-flex w-100 gap-2">
                  <Button
                    color={activeFilter === "all" ? "primary" : "light"}
                    onClick={() => setActiveFilter("all")}
                    className="flex-fill d-flex align-items-center justify-content-center gap-2"
                  >
                    <FaList /> All Leads
                  </Button>
                  <Button
                    color={activeFilter === "unassigned" ? "primary" : "light"}
                    onClick={() => setActiveFilter("unassigned")}
                    className="flex-fill d-flex align-items-center justify-content-center gap-2"
                  >
                    <FaUserSlash /> Unassigned
                  </Button>
                  <Button
                    color={activeFilter === "assigned" ? "primary" : "light"}
                    onClick={() => setActiveFilter("assigned")}
                    className="flex-fill d-flex align-items-center justify-content-center gap-2"
                  >
                    <FaUserPlus /> Assigned
                  </Button>
                </div>
              </Col>
            </Row>

            {/* Date Range Filter */}
            <Row className="mb-3 align-items-end">
              {/* Action Icons */}
              <Col md="auto">
                <Button
                  color="primary"
                  size="sm"
                  className="d-flex align-items-center gap-1"
                  onClick={() => setShowFilterModal(true)}
                >
                  <FiFilter size={30} />
                </Button>
              </Col>
              <Col md="auto">
                <Button
                  color="danger"
                  size="sm"
                  className="d-flex align-items-center gap-1"
                >
                  <MdFilterAltOff size={30} />
                </Button>
              </Col>

              {/* Start Date */}
              <Col md={3}>
                <label htmlFor="startDate" className="form-label">
                  Start Date
                </label>
                <input
                  type="date"
                  className="form-control"
                  id="startDate"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </Col>

              {/* End Date */}
              <Col md={3}>
                <label htmlFor="endDate" className="form-label">
                  End Date
                </label>
                <input
                  type="date"
                  className="form-control"
                  id="endDate"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </Col>
            </Row>

            {/* Search and entries controls */}
            <Row className="mb-3">
              <Col md={6}>
                <div className="d-flex align-items-center">
                  <span className="me-2">Show</span>
                  <select
                    className="form-select form-select-sm"
                    style={{ width: "80px" }}
                  >
                    <option>10</option>
                    <option>25</option>
                    <option>50</option>
                    <option>100</option>
                  </select>
                  <span className="ms-2">entries</span>
                </div>
              </Col>
              <Col md={6} className="text-end">
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="Search..."
                  style={{ width: "auto", display: "inline-block" }}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </Col>
            </Row>

            {/* Table */}
            <TableContainer
              columns={columns}
              data={filteredLeads}
              isPagination={false}
              iscustomPageSize={false}
              isBordered={false}
              customPageSize={10}
              className="custom-table"
            />
          </CardBody>
        </Card>
      </Container>

      <LeadFilterModal
        isOpen={showFilterModal}
        toggle={() => setShowFilterModal(false)}
      />
    </div>
  );
};

export default MasterLead;
