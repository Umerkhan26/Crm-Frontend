// import React, { useMemo, useState, useEffect, useRef } from "react";
// import TableContainer from "../../components/Common/TableContainer";
// import Breadcrumbs from "../../components/Common/Breadcrumb";
// import {
//   Card,
//   CardBody,
//   Container,
//   Row,
//   Col,
//   Button,
//   Badge,
//   Spinner,
// } from "reactstrap";
// import { FiEdit2, FiFilter, FiTrash2 } from "react-icons/fi";
// import { FaList, FaUserPlus, FaUserSlash } from "react-icons/fa";
// import { MdFilterAltOff } from "react-icons/md";
// import LeadFilterModal from "../../components/Modals/LeadFilterModal";
// import {
//   fetchAllLeads,
//   deleteLead,
//   assignLeadToUser,
// } from "../../services/leadService";
// import { useNavigate } from "react-router-dom";
// import "react-confirm-alert/src/react-confirm-alert.css";
// import LeadDetailModal from "../../components/Modals/LeadDetailModal";
// import useDeleteConfirmation from "../../components/Modals/DeleteConfirmation";
// import { debounce } from "lodash";
// import { getAllUsers } from "../../services/auth";
// import { toast } from "react-toastify";

// const MasterLead = () => {
//   const navigate = useNavigate();
//   const { confirmDelete } = useDeleteConfirmation();

//   const [searchText, setSearchText] = useState("");
//   const [searchLoading, setSearchLoading] = useState(false);
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [activeFilter, setActiveFilter] = useState("all");
//   const [showFilterModal, setShowFilterModal] = useState(false);
//   const [leads, setLeads] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedLead, setSelectedLead] = useState(null);
//   const [error, setError] = useState(null);
//   const [selectedAgent, setSelectedAgent] = useState("");
//   const [users, setUsers] = useState([]);
//   const [showAssignControls, setShowAssignControls] = useState(false);
//   const [pagination, setPagination] = useState({
//     currentPage: 1,
//     totalPages: 1,
//     totalItems: 0,
//     pageSize: 10,
//   });
//   const searchInputRef = useRef(null);

//   useEffect(() => {
//     const hasCheckedLeads = leads.some((lead) => lead.checked);
//     setShowAssignControls(hasCheckedLeads);
//   }, [leads]);

//   const handleRowClick = (row) => {
//     setSelectedLead(row.original);
//     setIsModalOpen(true);
//   };

//   const fetchLeads = async (currentPage, pageSize, search) => {
//     try {
//       setLoading(true);
//       setSearchLoading(true);

//       const response = await fetchAllLeads(currentPage, pageSize, search);

//       console.log("Lead response", response);

//       const leads = response.data.map((lead) => ({
//         ...lead,
//         checked: false,
//       }));

//       setLeads(leads);
//       setPagination((prev) => ({
//         ...prev,
//         totalPages: response.totalPages,
//         totalItems: response.totalItems,
//         currentPage: response.currentPage,
//       }));
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//       setSearchLoading(false);
//     }
//   };

//   const debouncedFetchLeads = useMemo(() => debounce(fetchLeads, 500), []);

//   useEffect(() => {
//     debouncedFetchLeads(
//       pagination.currentPage,
//       pagination.pageSize,
//       searchText
//     );

//     return () => debouncedFetchLeads.cancel();
//   }, [pagination.currentPage, pagination.pageSize, searchText]);

//   const handleSearchInput = (e) => {
//     setSearchText(e.target.value);
//     setPagination((prev) => ({ ...prev, currentPage: 1 }));
//   };

//   const handleEdit = (lead) => {
//     navigate("/add-lead", {
//       state: {
//         editData: {
//           ...lead,
//           campaignType: lead.campaignName || lead.campaignType,
//         },
//       },
//     });
//   };

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const response = await getAllUsers({ page: 1, limit: 100 });
//         setUsers(response.data || []); // Adjust this if your response structure is different
//       } catch (error) {
//         console.error("Failed to fetch users:", error);
//       }
//     };

//     fetchUsers();
//   }, []);

//   const handleDelete = async (leadId) => {
//     const deleteFn = async () => {
//       await deleteLead(leadId);
//       setLeads((prevLeads) => prevLeads.filter((lead) => lead.id !== leadId));
//     };

//     confirmDelete(deleteFn, null, "lead");
//   };

//   const handleCheckboxChange = (id) => {
//     setLeads((prevLeads) =>
//       prevLeads.map((lead) =>
//         lead.id === id ? { ...lead, checked: !lead.checked } : lead
//       )
//     );
//   };

//   const handleAssign = async () => {
//     if (!selectedAgent) {
//       toast.warning("Please select a user before assigning.");
//       return;
//     }

//     try {
//       const leadIds = leads
//         .filter((lead) => lead.checked)
//         .map((lead) => lead.id);

//       if (leadIds.length === 0) {
//         toast.warning("Please select at least one lead to assign.");
//         return;
//       }

//       // Assign and collect responses
//       const responses = await Promise.all(
//         leadIds.map((leadId) => assignLeadToUser(leadId, selectedAgent))
//       );

//       // Console each response
//       responses.forEach((res, index) => {
//         console.log(`Lead ID ${leadIds[index]} assignment response:`, res);
//       });

//       toast.success("Leads assigned successfully!");

//       fetchLeads(
//         pagination.currentPage,
//         pagination.pageSize,
//         searchText,
//         activeFilter === "all" ? undefined : activeFilter
//       );

//       setLeads((prevLeads) =>
//         prevLeads.map((lead) => ({ ...lead, checked: false }))
//       );
//       setSelectedAgent("");
//     } catch (error) {
//       console.error("Assignment failed:", error);
//       toast.error(error.message || "Failed to assign leads.");
//     }
//   };

//   const handlePageChange = (newPage) => {
//     setPagination((prev) => ({ ...prev, currentPage: newPage }));
//   };

//   const handlePageSizeChange = (newSize) => {
//     setPagination((prev) => ({
//       ...prev,
//       pageSize: newSize,
//       currentPage: 1,
//     }));
//   };

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
//         Header: "Status",
//         accessor: "status",
//         disableFilters: true,
//         Cell: ({ row, value }) => (
//           <div
//             style={{ cursor: "pointer" }}
//             onClick={() => handleRowClick(row)}
//           >
//             <Badge color={value === "Active"}>{value}</Badge>
//           </div>
//         ),
//         width: 100,
//       },
//       {
//         Header: "Action",
//         disableFilters: true,
//         width: 120,
//         Cell: ({ row }) => (
//           <div className="d-flex gap-2">
//             <Button
//               color="primary"
//               size="sm"
//               className="px-2"
//               onClick={(e) => {
//                 e.stopPropagation();
//                 handleEdit(row.original);
//               }}
//               title="Edit"
//             >
//               <FiEdit2 size={14} />
//             </Button>
//             <Button
//               color="danger"
//               size="sm"
//               className="px-2"
//               onClick={(e) => {
//                 e.stopPropagation();
//                 handleDelete(row.original.id);
//               }}
//               title="Delete"
//             >
//               <FiTrash2 size={14} />
//             </Button>
//           </div>
//         ),
//       },
//       {
//         Header: "Check",
//         disableFilters: true,
//         width: 60,
//         Cell: ({ row }) => (
//           <div>
//             <input
//               type="checkbox"
//               checked={row.original.checked}
//               onChange={(e) => {
//                 e.stopPropagation();
//                 handleCheckboxChange(row.original.id);
//               }}
//               style={{ width: "16px", height: "16px", cursor: "pointer" }}
//             />
//           </div>
//         ),
//       },
//     ],
//     [leads]
//   );

//   const breadcrumbItems = [
//     { title: "Dashboard", link: "/" },
//     { title: "Leads", link: "/AllLeads" },
//     { title: "MasterLead", link: "#" },
//   ];

//   return (
//     <div className="page-content" style={{ position: "relative" }}>
//       <Container fluid>
//         <Breadcrumbs
//           title="ALL MASTER LEADS"
//           breadcrumbItems={breadcrumbItems}
//         />
//         <Card>
//           <CardBody style={{ overflowX: "auto", position: "relative" }}>
//             {loading && (
//               <div
//                 className="d-flex justify-content-center align-items-center"
//                 style={{
//                   position: "absolute",
//                   top: 0,
//                   left: 0,
//                   right: 0,
//                   bottom: 0,
//                   backgroundColor: "rgba(255, 255, 255, 0.7)",
//                   zIndex: 10,
//                 }}
//               >
//                 <Spinner color="primary" />
//               </div>
//             )}
//             {error && <p className="text-danger">Error: {error}</p>}

//             <Row className="mb-3">
//               <Col md={12}>
//                 <div className="d-flex w-100 gap-2">
//                   <Button
//                     color={activeFilter === "all" ? "primary" : "light"}
//                     onClick={() => setActiveFilter("all")}
//                     className="flex-fill d-flex align-items-center justify-content-center gap-2"
//                   >
//                     <FaList /> All Leads
//                   </Button>
//                   <Button
//                     color={activeFilter === "unassigned" ? "primary" : "light"}
//                     onClick={() => setActiveFilter("unassigned")}
//                     className="flex-fill d-flex align-items-center justify-content-center gap-2"
//                   >
//                     <FaUserSlash /> Unassigned
//                   </Button>
//                   <Button
//                     color={activeFilter === "assigned" ? "primary" : "light"}
//                     onClick={() => setActiveFilter("assigned")}
//                     className="flex-fill d-flex align-items-center justify-content-center gap-2"
//                   >
//                     <FaUserPlus /> Assigned
//                   </Button>
//                 </div>
//               </Col>
//             </Row>

//             <Row className="mb-3 align-items-end">
//               <Col md="auto">
//                 <Button
//                   color="primary"
//                   size="sm"
//                   onClick={() => setShowFilterModal(true)}
//                 >
//                   <FiFilter size={20} />
//                 </Button>
//               </Col>
//               <Col md="auto">
//                 <Button
//                   color="danger"
//                   size="sm"
//                   onClick={() => {
//                     setStartDate("");
//                     setEndDate("");
//                     setSearchText("");
//                     setActiveFilter("all");
//                   }}
//                 >
//                   <MdFilterAltOff size={20} />
//                 </Button>
//               </Col>
//               <Col md={3}>
//                 <label htmlFor="startDate" className="form-label">
//                   Start Date
//                 </label>
//                 <input
//                   type="date"
//                   className="form-control"
//                   id="startDate"
//                   value={startDate}
//                   onChange={(e) => setStartDate(e.target.value)}
//                 />
//               </Col>
//               <Col md={3}>
//                 <label htmlFor="endDate" className="form-label">
//                   End Date
//                 </label>
//                 <input
//                   type="date"
//                   className="form-control"
//                   id="endDate"
//                   value={endDate}
//                   onChange={(e) => setEndDate(e.target.value)}
//                 />
//               </Col>
//             </Row>

//             <div className="d-flex justify-content-end mb-3">
//               <div className="w-25 position-relative">
//                 <input
//                   ref={searchInputRef}
//                   type="text"
//                   className="form-control"
//                   placeholder="Search leads..."
//                   value={searchText}
//                   onChange={handleSearchInput}
//                 />
//                 {searchLoading && (
//                   <div className="position-absolute top-50 end-0 translate-middle-y me-2">
//                     <div
//                       className="spinner-border spinner-border-sm"
//                       role="status"
//                     />
//                   </div>
//                 )}
//               </div>
//             </div>

//             {showAssignControls && (
//               <div className="mb-3" style={{ maxWidth: "100%" }}>
//                 <div className="d-flex flex-column">
//                   <label
//                     className="form-label"
//                     style={{
//                       fontSize: "16px",
//                       fontWeight: "900",
//                       marginBottom: "8px",
//                     }}
//                   >
//                     Users *
//                   </label>
//                   <select
//                     className="form-select"
//                     style={{
//                       width: "400px",
//                       height: "40px",
//                       fontSize: "14px",
//                       padding: "0.375rem 0.75rem",
//                     }}
//                     value={selectedAgent}
//                     onChange={(e) => setSelectedAgent(e.target.value)}
//                   >
//                     <option value="">Select User</option>
//                     {users.map((user) => (
//                       <option key={user.id} value={user.id}>
//                         {user.firstname} {user.lastname}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//                 <Button
//                   color="primary"
//                   onClick={handleAssign}
//                   disabled={!selectedAgent}
//                   style={{
//                     marginTop: "10px",
//                     height: "40px",
//                     fontSize: "14px",
//                     fontWeight: "500",
//                     width: "120px", // Decreased button width
//                     alignSelf: "start", // Aligns button to the left
//                   }}
//                 >
//                   Assign
//                 </Button>
//               </div>
//             )}

//             <TableContainer
//               columns={columns}
//               data={leads}
//               isPagination={true}
//               iscustomPageSize={false}
//               isBordered={false}
//               customPageSize={pagination.pageSize}
//               pagination={pagination}
//               onPageChange={handlePageChange}
//               onPageSizeChange={handlePageSizeChange}
//               className="custom-table"
//             />
//           </CardBody>
//         </Card>
//       </Container>

//       <LeadFilterModal
//         isOpen={showFilterModal}
//         toggle={() => setShowFilterModal(false)}
//       />
//       <LeadDetailModal
//         isOpen={isModalOpen}
//         toggle={() => setIsModalOpen(!isModalOpen)}
//         leadData={selectedLead}
//       />
//     </div>
//   );
// };

// export default MasterLead;

import React, { useMemo, useState, useEffect, useRef } from "react";
import TableContainer from "../../components/Common/TableContainer";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import {
  Card,
  CardBody,
  Container,
  Row,
  Col,
  Button,
  Badge,
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
} from "../../services/leadService";
import { useNavigate } from "react-router-dom";
import "react-confirm-alert/src/react-confirm-alert.css";
import LeadDetailModal from "../../components/Modals/LeadDetailModal";
import useDeleteConfirmation from "../../components/Modals/DeleteConfirmation";
import { debounce } from "lodash";
import { getAllUsers } from "../../services/auth";
import { toast } from "react-toastify";

const MasterLead = () => {
  const navigate = useNavigate();
  const { confirmDelete } = useDeleteConfirmation();
  const [searchText, setSearchText] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [error, setError] = useState(null);
  const [selectedAgent, setSelectedAgent] = useState("");
  const [users, setUsers] = useState([]);
  const [showAssignControls, setShowAssignControls] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    pageSize: 10,
  });
  const searchInputRef = useRef(null);

  useEffect(() => {
    const hasCheckedLeads = leads.some((lead) => lead.checked);
    setShowAssignControls(hasCheckedLeads);
  }, [leads]);

  const handleRowClick = (row) => {
    setSelectedLead(row.original);
    setIsModalOpen(true);
  };

  const fetchLeads = async (currentPage, pageSize, search) => {
    try {
      setLoading(true);
      setSearchLoading(true);

      let response;
      if (activeFilter === "assigned") {
        response = await fetchAllLeadsWithAssignee();
      } else if (activeFilter === "unassigned") {
        response = await fetchUnassignedLeads();
      } else {
        response = await fetchAllLeads(currentPage, pageSize, search);
      }

      console.log("Lead response", response);

      let filteredLeads = response.data;
      if (
        (activeFilter === "assigned" || activeFilter === "unassigned") &&
        search
      ) {
        filteredLeads = response.data.filter((lead) =>
          Object.values(lead.fullLeadData).some((value) =>
            String(value).toLowerCase().includes(search.toLowerCase())
          )
        );
      }

      const leads = filteredLeads.map((lead) => ({
        ...lead,
        checked: false,
      }));

      setLeads(leads);
      setPagination((prev) => ({
        ...prev,
        totalPages: response.totalPages,
        totalItems: activeFilter === "all" ? response.totalItems : leads.length,
        currentPage: response.currentPage,
      }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setSearchLoading(false);
    }
  };

  const debouncedFetchLeads = useMemo(
    () => debounce(fetchLeads, 500),
    [activeFilter]
  );

  useEffect(() => {
    debouncedFetchLeads(
      pagination.currentPage,
      pagination.pageSize,
      searchText
    );

    return () => debouncedFetchLeads.cancel();
  }, [pagination.currentPage, pagination.pageSize, searchText, activeFilter]);

  const handleSearchInput = (e) => {
    setSearchText(e.target.value);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
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

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllUsers({ page: 1, limit: 100 });
        setUsers(response.data || []);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (leadId) => {
    const deleteFn = async () => {
      await deleteLead(leadId);
      setLeads((prevLeads) => prevLeads.filter((lead) => lead.id !== leadId));
    };

    confirmDelete(deleteFn, null, "lead");
  };

  const handleCheckboxChange = (id) => {
    setLeads((prevLeads) =>
      prevLeads.map((lead) =>
        lead.id === id ? { ...lead, checked: !lead.checked } : lead
      )
    );
  };

  const handleAssign = async () => {
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

      const responses = await Promise.all(
        leadIds.map((leadId) => assignLeadToUser(leadId, selectedAgent))
      );

      responses.forEach((res, index) => {
        console.log(`Lead ID ${leadIds[index]} assignment response:`, res);
      });

      toast.success("Leads assigned successfully!");

      fetchLeads(pagination.currentPage, pagination.pageSize, searchText);

      setLeads((prevLeads) =>
        prevLeads.map((lead) => ({ ...lead, checked: false }))
      );
      setSelectedAgent("");
    } catch (error) {
      console.error("Assignment failed:", error);
      toast.error(error.message || "Failed to assign leads.");
    }
  };

  const handlePageChange = (newPage) => {
    if (activeFilter === "assigned" || activeFilter === "unassigned") return;
    setPagination((prev) => ({ ...prev, currentPage: newPage }));
  };

  const handlePageSizeChange = (newSize) => {
    if (activeFilter === "assigned" || activeFilter === "unassigned") return;
    setPagination((prev) => ({
      ...prev,
      pageSize: newSize,
      currentPage: 1,
    }));
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
        Header: "Check",
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
  }, [leads]);

  const breadcrumbItems = [
    { title: "Dashboard", link: "/" },
    { title: "Leads", link: "/AllLeads" },
    { title: "MasterLead", link: "#" },
  ];

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

            <Row className="mb-3 align-items-end">
              <Col md="auto">
                <Button
                  color="primary"
                  size="sm"
                  onClick={() => setShowFilterModal(true)}
                >
                  <FiFilter size={20} />
                </Button>
              </Col>
              <Col md="auto">
                <Button
                  color="danger"
                  size="sm"
                  onClick={() => {
                    setStartDate("");
                    setEndDate("");
                    setSearchText("");
                    setActiveFilter("all");
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
                  onChange={(e) => setStartDate(e.target.value)}
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
                  onChange={(e) => setEndDate(e.target.value)}
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
                    onChange={(e) => setSelectedAgent(e.target.value)}
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
        toggle={() => setShowFilterModal(false)}
      />
      <LeadDetailModal
        isOpen={isModalOpen}
        toggle={() => setIsModalOpen(!isModalOpen)}
        leadData={selectedLead}
      />
    </div>
  );
};

export default MasterLead;
