// import React, { useMemo, useState } from "react";
// import TableContainer from "../../components/Common/TableContainer";
// import Breadcrumbs from "../../components/Common/Breadcrumb";
// import {
//   Card,
//   CardBody,
//   Container,
//   Dropdown,
//   DropdownToggle,
//   DropdownMenu,
//   DropdownItem,
//   Button,
//   Row,
//   Col,
// } from "reactstrap";
// import { FaChevronDown, FaFilter, FaUserTag, FaBoxes } from "react-icons/fa";
// import { FiEdit2, FiTrash2, FiRefreshCw } from "react-icons/fi";
// import LeadDetailModal from "../../components/Modals/LeadDetailModal";
// import { useNavigate } from "react-router-dom";

// const ClientLeads = () => {
//   const navigate = useNavigate();
//   const [clientDropdownOpen, setClientDropdownOpen] = useState(false);
//   const [vendorDropdownOpen, setVendorDropdownOpen] = useState(false);
//   const [selectedClient, setSelectedClient] = useState("Choose Client...");
//   const [selectedVendor, setSelectedVendor] = useState("Choose Vendor...");
//   const [searchText, setSearchText] = useState("");
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedLead, setSelectedLead] = useState(null);

//   const toggleClientDropdown = () => setClientDropdownOpen((prev) => !prev);
//   const toggleVendorDropdown = () => setVendorDropdownOpen((prev) => !prev);

//   const handleRowClick = (row) => {
//     setSelectedLead(row.original);
//     setIsModalOpen(true);
//   };

//   const handleEdit = (lead) => {
//     navigate("/add-lead", { state: { editData: lead } });
//   };

//   const leadsData = useMemo(
//     () => [
//       {
//         id: 1,
//         campaignType: "Callback - Final Expense",
//         agentName: "Default",
//         firstName: "Default",
//         lastName: "Default",
//         phoneNumber: "Default",
//         date: "2025-04-21",
//         state: "AK",
//         address: "123 Main St",
//         city: "Anchorage",
//         zipCode: "99501",
//         app: "Yes",
//         smoke: "No",
//         partABStatus: "Yes",
//         supplement: "No",
//         callBack: "Yes",
//         localAgentName: "Agent Smith",
//         recordingLink1: "https://example.com/recording1",
//         recordingLink2: "https://example.com/recording2",
//         custom1: "Custom data",
//         reason: "Accept",
//         status: "Pending",
//       },
//       // Add more leads if needed
//     ],
//     []
//   );

//   const filteredLeads = useMemo(() => {
//     return leadsData.filter((lead) =>
//       Object.values(lead).some((val) =>
//         String(val).toLowerCase().includes(searchText.toLowerCase())
//       )
//     );
//   }, [leadsData, searchText]);

//   const clients = ["Client 1", "Client 2", "Client 3"];
//   const vendors = ["Vendor 1", "Vendor 2", "Vendor 3"];
//   const columns = useMemo(
//     () => [
//       {
//         Header: "Agent Name",
//         accessor: "agentName",
//         disableFilters: true,
//         width: 120,
//         Cell: ({ row, value }) => (
//           <div
//             style={{ cursor: "pointer" }}
//             onClick={() => handleRowClick(row)}
//           >
//             {value}
//           </div>
//         ),
//       },
//       {
//         Header: "First Name",
//         accessor: "firstName",
//         disableFilters: true,
//         width: 120,
//         Cell: ({ row, value }) => (
//           <div
//             style={{ cursor: "pointer" }}
//             onClick={() => handleRowClick(row)}
//           >
//             {value}
//           </div>
//         ),
//       },
//       {
//         Header: "Last Name",
//         accessor: "lastName",
//         disableFilters: true,
//         width: 120,
//         Cell: ({ row, value }) => (
//           <div
//             style={{ cursor: "pointer" }}
//             onClick={() => handleRowClick(row)}
//           >
//             {value}
//           </div>
//         ),
//       },
//       {
//         Header: "State",
//         accessor: "state",
//         disableFilters: true,
//         width: 80,
//         Cell: ({ row, value }) => (
//           <div
//             style={{ cursor: "pointer" }}
//             onClick={() => handleRowClick(row)}
//           >
//             {value}
//           </div>
//         ),
//       },
//       {
//         Header: "Phone Number",
//         accessor: "phoneNumber",
//         disableFilters: true,
//         width: 150,
//         Cell: ({ row, value }) => (
//           <div
//             style={{ cursor: "pointer" }}
//             onClick={() => handleRowClick(row)}
//           >
//             {value}
//           </div>
//         ),
//       },
//       {
//         Header: "Reason",
//         accessor: "reason",
//         disableFilters: true,
//         width: 100,
//         Cell: ({ row, value }) => (
//           <div
//             style={{ cursor: "pointer" }}
//             onClick={() => handleRowClick(row)}
//           >
//             {value}
//           </div>
//         ),
//       },
//       {
//         Header: "Options",
//         disableFilters: true,
//         Cell: () => (
//           <div className="d-flex gap-2">
//             <Button color="success" size="sm" className="px-3">
//               Accept
//             </Button>
//             <Button color="danger" size="sm" className="px-3">
//               Reject
//             </Button>
//           </div>
//         ),
//         width: 150,
//       },
//       {
//         Header: "Action",
//         disableFilters: true,
//         Cell: ({ row }) => (
//           <div className="d-flex gap-2">
//             <Button
//               color="primary"
//               size="sm"
//               className="px-2"
//               onClick={() => handleEdit(row.original)}
//             >
//               <FiEdit2 size={14} />
//             </Button>
//             <Button color="warning" size="sm" className="px-2">
//               <FiRefreshCw size={14} />
//             </Button>
//             <Button color="danger" size="sm" className="px-2">
//               <FiTrash2 size={14} />
//             </Button>
//           </div>
//         ),
//         width: 180,
//       },
//     ],
//     []
//   );
//   const breadcrumbItems = [
//     { title: "Dashboard", link: "/" },
//     { title: "Leads", link: "/AllLeads" },
//     { title: "Client", link: "#" },
//   ];

//   return (
//     <React.Fragment>
//       <div className="page-content">
//         <Container fluid>
//           <Breadcrumbs title="ALL CLIENT" breadcrumbItems={breadcrumbItems} />

//           <Card>
//             <CardBody>
//               {/* Client and Vendor Dropdowns */}
//               <Row className="mb-3">
//                 <Col md={5}>
//                   <Dropdown
//                     isOpen={clientDropdownOpen}
//                     toggle={toggleClientDropdown}
//                   >
//                     <DropdownToggle
//                       caret
//                       className="w-100 d-flex align-items-center justify-content-between"
//                       style={{
//                         backgroundColor: "#f8f9fa",
//                         borderColor: "#dee2e6",
//                         color: "#495057",
//                       }}
//                     >
//                       <div className="d-flex align-items-center">
//                         <FaUserTag className="me-2" />
//                         {selectedClient}
//                       </div>
//                       <FaChevronDown className="ms-2" />
//                     </DropdownToggle>
//                     <DropdownMenu className="w-100">
//                       <DropdownItem
//                         header
//                         className="d-flex align-items-center"
//                       >
//                         <FaFilter className="me-2" />
//                         Select Client
//                       </DropdownItem>
//                       {clients.map((client, index) => (
//                         <DropdownItem
//                           key={index}
//                           onClick={() => setSelectedClient(client)}
//                           active={selectedClient === client}
//                           className="d-flex align-items-center"
//                         >
//                           <FaUserTag className="me-2" />
//                           {client}
//                         </DropdownItem>
//                       ))}
//                     </DropdownMenu>
//                   </Dropdown>
//                 </Col>
//                 <Col md={5}>
//                   <Dropdown
//                     isOpen={vendorDropdownOpen}
//                     toggle={toggleVendorDropdown}
//                   >
//                     <DropdownToggle
//                       caret
//                       className="w-100 d-flex align-items-center justify-content-between"
//                       style={{
//                         backgroundColor: "#f8f9fa",
//                         borderColor: "#dee2e6",
//                         color: "#495057",
//                       }}
//                     >
//                       <div className="d-flex align-items-center">
//                         <FaBoxes className="me-2" />
//                         {selectedVendor}
//                       </div>
//                       <FaChevronDown className="ms-2" />
//                     </DropdownToggle>
//                     <DropdownMenu className="w-100">
//                       <DropdownItem
//                         header
//                         className="d-flex align-items-center"
//                       >
//                         <FaFilter className="me-2" />
//                         Select Vendor
//                       </DropdownItem>
//                       {vendors.map((vendor, index) => (
//                         <DropdownItem
//                           key={index}
//                           onClick={() => setSelectedVendor(vendor)}
//                           active={selectedVendor === vendor}
//                           className="d-flex align-items-center"
//                         >
//                           <FaBoxes className="me-2" />
//                           {vendor}
//                         </DropdownItem>
//                       ))}
//                     </DropdownMenu>
//                   </Dropdown>
//                 </Col>

//                 <Col md={2}>
//                   <Button
//                     color="primary"
//                     className="w-100 d-flex align-items-center justify-content-center"
//                     onClick={() => {
//                       // Handle filter logic here if needed
//                       console.log(
//                         "Filter clicked with:",
//                         selectedClient,
//                         selectedVendor
//                       );
//                     }}
//                   >
//                     <FaFilter className="me-2" />
//                     Filter
//                   </Button>
//                 </Col>
//               </Row>

//               {/* Table with search and pagination controls */}
//               <div className="d-flex justify-content-between align-items-center mb-3">
//                 <div className="d-flex align-items-center">
//                   <span className="me-2">Show</span>
//                   <select
//                     className="form-select form-select-sm"
//                     style={{ width: "80px" }}
//                   >
//                     <option>10</option>
//                     <option>25</option>
//                     <option>50</option>
//                     <option>100</option>
//                   </select>
//                   <span className="ms-2">entries</span>
//                 </div>
//                 <div>
//                   <input
//                     type="text"
//                     className="form-control"
//                     placeholder="Search..."
//                     value={searchText}
//                     onChange={(e) => setSearchText(e.target.value)}
//                   />
//                 </div>
//               </div>

//               <TableContainer
//                 columns={columns || []}
//                 data={filteredLeads || []}
//                 isPagination={false}
//                 iscustomPageSize={false}
//                 isBordered={false}
//                 customPageSize={10}
//                 className="custom-table"
//               />
//             </CardBody>
//           </Card>
//         </Container>
//       </div>

//       <LeadDetailModal
//         isOpen={isModalOpen}
//         toggle={() => setIsModalOpen(!isModalOpen)}
//         leadData={selectedLead}
//       />
//     </React.Fragment>
//   );
// };

// export default ClientLeads;

import React, { useMemo, useState, useEffect } from "react";
import TableContainer from "../../components/Common/TableContainer";
import Breadcrumbs from "../../components/Common/Breadcrumb";
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
import { FaFilter, FaUserTag, FaBoxes } from "react-icons/fa";
import { FiEdit2, FiTrash2, FiRefreshCw } from "react-icons/fi";
import LeadDetailModal from "../../components/Modals/LeadDetailModal";
import { useNavigate, useLocation } from "react-router-dom"; // Added useLocation
import { deleteLead, fetchAllLeads } from "../../services/leadService";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

const ClientLeads = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Added for refresh
  const [clientDropdownOpen, setClientDropdownOpen] = useState(false);
  const [vendorDropdownOpen, setVendorDropdownOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState("Choose Client...");
  const [selectedVendor, setSelectedVendor] = useState("Choose Vendor...");
  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const toggleClientDropdown = () => setClientDropdownOpen((prev) => !prev);
  const toggleVendorDropdown = () => setVendorDropdownOpen((prev) => !prev);

  const handleRowClick = (row) => {
    setSelectedLead(row.original);
    setIsModalOpen(true);
  };

  const handleEdit = (lead) => {
    navigate("/add-lead", {
      state: {
        editData: {
          ...lead,
          campaignType: lead.campaignName || lead.campaignType, // Map to campaignType
          leadData: {
            agent_name: lead.agentName,
            first_name: lead.firstName,
            last_name: lead.lastName,
            state: lead.state,
            phone_number: lead.phoneNumber,
            reason: lead.reason,
            date: lead.date, // Include date if needed
          },
        },
      },
    });
  };

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const data = await fetchAllLeads();
      console.log("all leads", data);
      setLeads(data);
    } catch (err) {
      setError(err.message);
      toast.error(`Error fetching leads: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Fetch leads on mount and when refresh is triggered
  useEffect(() => {
    fetchLeads();
  }, [location.state?.refresh]);

  const handleDelete = async (leadId) => {
    confirmAlert({
      title: "Confirm Deletion",
      message: "Are you sure you want to delete this lead?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            try {
              await deleteLead(leadId);
              const updatedLeads = leads.filter((lead) => lead.id !== leadId);
              setLeads(updatedLeads);
              toast.success("Lead deleted successfully");
            } catch (error) {
              toast.error(`Error deleting lead: ${error.message}`);
            }
          },
        },
        { label: "No" },
      ],
      closeOnEscape: true,
      closeOnClickOutside: true,
    });
  };

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) =>
      Object.values(lead).some((val) =>
        String(val || "")
          .toLowerCase()
          .includes(searchText.toLowerCase())
      )
    );
  }, [leads, searchText]);

  const clients = ["Client 1", "Client 2", "Client 3"];
  const vendors = ["Vendor 1", "Vendor 2", "Vendor 3"];
  const columns = useMemo(
    () => [
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
            {value || "N/A"}
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
            {value || "N/A"}
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
            {value || "N/A"}
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
            {value || "N/A"}
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
            {value || "N/A"}
          </div>
        ),
      },
      {
        Header: "Reason",
        accessor: "reason",
        disableFilters: true,
        width: 100,
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
        Header: "Options",
        disableFilters: true,
        Cell: () => (
          <div className="d-flex gap-2">
            <Button color="success" size="sm" className="px-3">
              Accept
            </Button>
            <Button color="danger" size="sm" className="px-3">
              Reject
            </Button>
          </div>
        ),
        width: 150,
      },
      {
        Header: "Action",
        disableFilters: true,
        Cell: ({ row }) => (
          <div className="d-flex gap-2">
            <Button
              color="primary"
              size="sm"
              className="px-2"
              onClick={() => handleEdit(row.original)}
            >
              <FiEdit2 size={14} />
            </Button>
            <Button
              color="warning"
              size="sm"
              className="px-2"
              onClick={fetchLeads}
            >
              <FiRefreshCw size={14} />
            </Button>
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
          </div>
        ),
        width: 180,
      },
    ],
    []
  );

  const breadcrumbItems = [
    { title: "Dashboard", link: "/" },
    { title: "Leads", link: "/AllLeads" },
    { title: "Client", link: "#" },
  ];

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="ALL CLIENT" breadcrumbItems={breadcrumbItems} />
          <Card>
            <CardBody>
              {loading && <p>Loading leads...</p>}
              {error && <p className="text-danger">Error: {error}</p>}
              {!loading && !error && (
                <>
                  <Row className="mb-3">
                    <Col md={5}>
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
                          {clients.map((client, index) => (
                            <DropdownItem
                              key={index}
                              onClick={() => setSelectedClient(client)}
                              active={selectedClient === client}
                              className="d-flex align-items-center"
                            >
                              <FaUserTag className="me-2" />
                              {client}
                            </DropdownItem>
                          ))}
                        </DropdownMenu>
                      </Dropdown>
                    </Col>
                    <Col md={5}>
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
                          {vendors.map((vendor, index) => (
                            <DropdownItem
                              key={index}
                              onClick={() => setSelectedVendor(vendor)}
                              active={selectedVendor === vendor}
                              className="d-flex align-items-center"
                            >
                              <FaBoxes className="me-2" />
                              {vendor}
                            </DropdownItem>
                          ))}
                        </DropdownMenu>
                      </Dropdown>
                    </Col>
                    <Col md={2}>
                      <Button
                        color="primary"
                        className="w-100 d-flex align-items-center justify-content-center"
                        onClick={fetchLeads} // Refresh leads on filter click
                      >
                        <FaFilter className="me-2" />
                        Filter
                      </Button>
                    </Col>
                  </Row>
                  <div className="d-flex justify-content-between align-items-center mb-3">
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
                    <div>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                      />
                    </div>
                  </div>
                  <TableContainer
                    columns={columns}
                    data={filteredLeads}
                    isPagination={false}
                    isCustomPageSize={false}
                    isBordered={false}
                    customPageSize={10}
                    className="custom-table"
                  />
                </>
              )}
            </CardBody>
          </Card>
        </Container>
      </div>
      <LeadDetailModal
        isOpen={isModalOpen}
        toggle={() => setIsModalOpen(!isModalOpen)}
        leadData={selectedLead}
      />
    </React.Fragment>
  );
};

export default ClientLeads;
