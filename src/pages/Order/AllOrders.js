// import React, { useEffect, useMemo, useState, useRef } from "react";
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
//   Badge,
//   ButtonGroup,
//   Input,
//   Spinner,
// } from "reactstrap";
// import {
//   FaFilter,
//   FaUserTag,
//   FaBoxes,
//   FaPlus,
//   FaFileImport,
//   FaUnlock,
//   FaLock,
//   FaList,
//   FaFolderOpen,
//   FaCheckCircle,
//   FaBan,
//   FaTrash,
// } from "react-icons/fa";
// import * as XLSX from "xlsx";
// import { FiEdit2 } from "react-icons/fi";
// import AddLeadModal from "../../components/Modals/AddLeadModal";
// import ImportLeadsModal from "../../components/Modals/ImportLeadsModal";
// import ColumnMappingModal from "../../components/Modals/ColumnMappingModal";
// import { useLocation, useNavigate } from "react-router-dom";
// import {
//   deleteOrder,
//   fetchAllOrders,
//   setOrderBlockStatus,
//   fetchCampaigns,
// } from "../../services/orderService";
// import { toast } from "react-toastify";
// import Swal from "sweetalert2";
// import useDeleteConfirmation from "../../components/Modals/DeleteConfirmation";
// import { debounce } from "lodash";

// const Allorders = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [excelColumns, setExcelColumns] = useState([]);
//   const [excelFile, setExcelFile] = useState(null);
//   const { confirmDelete } = useDeleteConfirmation();
//   const [vendorDropdownOpen, setVendorDropdownOpen] = useState(false);
//   const [campaignDropdownOpen, setCampaignDropdownOpen] = useState(false);
//   const [selectedVendor, setSelectedVendor] = useState("Choose Vendor...");
//   const [selectedCampaign, setSelectedCampaign] =
//     useState("Choose Campaign...");
//   const [activeFilter, setActiveFilter] = useState("all");
//   const [modalOpen, setModalOpen] = useState(false);
//   const [importModalOpen, setImportModalOpen] = useState(false);
//   const [mappingModalOpen, setMappingModalOpen] = useState(false);
//   const [ordersData, setOrdersData] = useState([]);
//   const [campaignOptions, setCampaignOptions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchLoading, setSearchLoading] = useState(false);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [searchText, setSearchText] = useState("");
//   const [pagination, setPagination] = useState({
//     currentPage: 1,
//     totalPages: 1,
//     totalItems: 0,
//     pageSize: 10,
//   });
//   const searchInputRef = useRef(null);

//   const toggleModal = (order = null) => {
//     setSelectedOrder(order);
//     setModalOpen(!modalOpen);
//   };
//   const toggleImportModal = () => setImportModalOpen(!importModalOpen);
//   const toggleMappingModal = () => setMappingModalOpen(!mappingModalOpen);
//   const toggleVendorDropdown = () => setVendorDropdownOpen((prev) => !prev);
//   const toggleCampaignDropdown = () => setCampaignDropdownOpen((prev) => !prev);

//   // Fetch campaigns
//   useEffect(() => {
//     const loadCampaigns = async () => {
//       try {
//         const campaigns = await fetchCampaigns();
//         setCampaignOptions(campaigns);
//       } catch (error) {
//         console.error("Failed to load campaigns", error);
//         toast.error("Failed to load campaigns");
//       }
//     };
//     loadCampaigns();
//   }, []);

//   useEffect(() => {
//     const queryParams = new URLSearchParams(location.search);
//     const campaignId = queryParams.get("campaign");

//     if (!campaignId) {
//       setSelectedCampaign("Choose Campaign...");
//     } else {
//       const campaign = campaignOptions.find((c) => c.value == campaignId);
//       setSelectedCampaign(campaign ? campaign.label : "Choose Campaign...");
//     }
//   }, [location.search, campaignOptions]);

//   // Debounced fetch function for orders
//   const debouncedFetchOrders = debounce(async (page, limit, search) => {
//     try {
//       setLoading(true);
//       setSearchLoading(true);

//       const response = await fetchAllOrders(page, limit, search);
//       setOrdersData(response.data);
//       setPagination((prev) => ({
//         ...prev,
//         totalPages: response.totalPages,
//         totalItems: response.totalItems,
//         currentPage: response.currentPage,
//       }));
//     } catch (error) {
//       console.error("Failed to load orders", error);
//       toast.error("Failed to load orders");
//     } finally {
//       setLoading(false);
//       setSearchLoading(false);
//     }
//   }, 500);

//   useEffect(() => {
//     debouncedFetchOrders(
//       pagination.currentPage,
//       pagination.pageSize,
//       searchText
//     );
//     return () => debouncedFetchOrders.cancel();
//   }, [pagination.currentPage, pagination.pageSize, searchText]);

//   const handleSearchInput = (e) => {
//     setSearchText(e.target.value);
//     setPagination((prev) => ({ ...prev, currentPage: 1 }));
//   };

//   const handleFileUpload = (file, data) => {
//     const workbook = XLSX.read(data, { type: "binary" });
//     const sheetName = workbook.SheetNames[0];
//     const worksheet = workbook.Sheets[sheetName];
//     const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
//     if (jsonData.length > 0) {
//       setExcelColumns(jsonData[0]);
//       setExcelFile(file);
//     }
//   };

//   const handleMappingComplete = (response) => {
//     const { imported, skipped } = response;
//     toast.success(
//       `${imported} leads imported successfully. Skipped: ${skipped.length}`
//     );
//     setOrdersData((prevOrders) =>
//       prevOrders.map((order) =>
//         order.id === selectedOrder.id
//           ? {
//               ...order,
//               remainingLeads: order.remainingLeads - imported,
//             }
//           : order
//       )
//     );
//   };

//   const handleEdit = (order) => {
//     navigate("/create-order", { state: { editData: order } });
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

//   const handleBlockUnblock = async (orderId, isBlocked) => {
//     Swal.fire({
//       title: `Confirm ${isBlocked ? "Unblock" : "Block"}`,
//       html: `
//         <style>
//           .swal2-popup {
//             width: 230px !important;
//             height:180px !important;
//             padding: 10px !important;
//             font-size: 14px !important;
//           }
//           .swal2-title {
//             font-size: 18px !important;
//           }
//           .swal2-html-container {
//             fontSize: 14px !important;
//           }
//           .swal2-actions {
//             margin-top: 10px !important;
//           }
//           .swal2-confirm,
//           .swal2-cancel {
//             padding: 5px 10px !important;
//             font-size: 14px !important;
//           }
//         </style>
//         <p style="color: ${
//           isBlocked ? "green" : "red"
//         };">Are you sure you want to ${
//         isBlocked ? "unblock" : "block"
//       } this order?</p>
//       `,
//       showCancelButton: true,
//       confirmButtonColor: isBlocked ? "#3085d6" : "#d33",
//       cancelButtonColor: "#6c757d",
//       confirmButtonText: `Yes, ${isBlocked ? "Unblock" : "Block"}`,
//       cancelButtonText: "No, Cancel",
//     }).then(async (result) => {
//       if (result.isConfirmed) {
//         try {
//           await setOrderBlockStatus(orderId, !isBlocked);
//           toast.success(
//             `Order ${isBlocked ? "unblocked" : "blocked"} successfully`
//           );
//           await debouncedFetchOrders(
//             pagination.currentPage,
//             pagination.pageSize,
//             searchText
//           );
//         } catch (error) {
//           toast.error(
//             error.message ||
//               `Failed to ${isBlocked ? "unblock" : "block"} order`
//           );
//         }
//       }
//     });
//   };

//   const handleDelete = async (orderId) => {
//     await confirmDelete(
//       async () => {
//         await deleteOrder(orderId);
//       },
//       async () => {
//         await debouncedFetchOrders(
//           pagination.currentPage,
//           pagination.pageSize,
//           searchText
//         );
//       },
//       "order"
//     );
//   };

//   const filteredOrders = useMemo(() => {
//     let filtered = Array.isArray(ordersData) ? ordersData : [];

//     // Filter by selected campaign
//     if (selectedCampaign !== "Choose Campaign...") {
//       const campaign = campaignOptions.find(
//         (c) => c.label === selectedCampaign
//       );
//       if (campaign) {
//         filtered = filtered.filter(
//           (order) => order.campaign_id == campaign.value
//         );
//       }
//     }

//     switch (activeFilter) {
//       case "open":
//         filtered = filtered.filter((order) => !order.is_blocked);
//         break;
//       case "complete":
//         filtered = filtered.filter(
//           (order) => order.priority_level === "Onhold"
//         );
//         break;
//       case "blocked":
//         filtered = filtered.filter((order) => order.is_blocked);
//         break;
//       default:
//         break;
//     }

//     return filtered.sort((a, b) => {
//       const dateA = a.created_at ? new Date(a.created_at) : new Date(0);
//       const dateB = b.created_at ? new Date(b.created_at) : new Date(0);
//       return dateA - dateB;
//     });
//   }, [ordersData, activeFilter, selectedCampaign, campaignOptions]);

//   const vendors = ["Vendor2 Secok", "Junaid Tariq"];

//   const handleLeadSubmit = (leadResponse) => {
//     const orderId = leadResponse.order_id;
//     setOrdersData((prevOrders) =>
//       prevOrders.map((order) =>
//         order.id === orderId
//           ? {
//               ...order,
//               remainingLeads: order.remainingLeads - 1,
//             }
//           : order
//       )
//     );
//   };

//   const columns = useMemo(
//     () => [
//       {
//         Header: "Order Id",
//         accessor: "",
//         disableFilters: true,
//         width: 20,
//         Cell: ({ row }) => <div>{row.index + 1}</div>,
//       },
//       {
//         Header: "Agent Name",
//         accessor: "agent",
//         disableFilters: true,
//         width: 100,
//         Cell: ({ row }) => (
//           <div
//             className="text-primary"
//             style={{ cursor: "pointer" }}
//             onClick={() => {
//               sessionStorage.setItem("fromOrderLink", "true");
//               navigate(`/lead-index?orderId=${row.original.id}`);
//             }}
//           >
//             {row.original.agent}
//           </div>
//         ),
//       },
//       {
//         Header: "Options",
//         disableFilters: true,
//         Cell: (cellProps) => (
//           <ButtonGroup vertical className="w-100">
//             <Button
//               color="primary"
//               size="sm"
//               className="d-flex align-items-center justify-content-center text-nowrap mb-2"
//               onClick={() => toggleModal(cellProps.row.original)}
//             >
//               <FaPlus className="me-1" /> Add Lead
//             </Button>
//             <Button
//               color="success"
//               size="sm"
//               className="d-flex align-items-center justify-content-center text-nowrap"
//               onClick={() => {
//                 setSelectedOrder(cellProps.row.original);
//                 toggleImportModal();
//               }}
//             >
//               <FaFileImport className="me-1" /> Import
//             </Button>
//           </ButtonGroup>
//         ),
//         width: 200,
//       },
//       {
//         Header: "Leads Requested",
//         accessor: "lead_requested",
//         disableFilters: true,
//         width: 40,
//       },
//       {
//         Header: "Remaining Leads",
//         accessor: "remainingLeads",
//         disableFilters: true,
//         width: 20,
//       },
//       {
//         Header: "Notes & Area",
//         accessor: "notes",
//         disableFilters: true,
//         Cell: ({ row }) => (
//           <div
//             className="text-truncate"
//             style={{ maxWidth: "150px" }}
//             title={row.original.notes}
//           >
//             {row.original.notes}
//           </div>
//         ),
//         width: 150,
//       },
//       {
//         Header: "Priority Level",
//         accessor: "priority_level",
//         disableFilters: true,
//         width: 60,
//       },
//       {
//         Header: "Status",
//         accessor: "is_blocked",
//         disableFilters: true,
//         Cell: ({ value }) => (
//           <Badge color={value ? "danger" : "success"}>
//             {value ? "Blocked" : "Active"}
//           </Badge>
//         ),
//         width: 100,
//       },
//       {
//         Header: "Action",
//         disableFilters: true,
//         Cell: ({ row }) => (
//           <div className="d-flex gap-2">
//             <Button
//               color="primary"
//               size="sm"
//               className="px-2 py-1"
//               onClick={() => handleEdit(row.original)}
//             >
//               <FiEdit2 size={14} />
//             </Button>
//             <Button
//               color={row.original.is_blocked ? "danger" : "secondary"}
//               size="sm"
//               className="px-2 py-1"
//               onClick={() =>
//                 handleBlockUnblock(row.original.id, row.original.is_blocked)
//               }
//             >
//               {row.original.is_blocked ? (
//                 <FaLock size={14} />
//               ) : (
//                 <FaUnlock size={14} />
//               )}
//             </Button>
//             <Button
//               color="danger"
//               size="sm"
//               className="px-2 py-1"
//               onClick={() => handleDelete(row.original.id)}
//             >
//               <FaTrash size={14} />
//             </Button>
//           </div>
//         ),
//         width: 120,
//       },
//     ],
//     [campaignOptions]
//   );

//   const breadcrumbItems = [
//     { title: "Dashboard", link: "/" },
//     { title: "Orders", link: "#" },
//     { title: "All Orders", link: "#" },
//   ];

//   return (
//     <React.Fragment>
//       <div className="page-content">
//         <Container fluid>
//           <Breadcrumbs title="ALL ORDERS" breadcrumbItems={breadcrumbItems} />
//           <Row className="mb-3">
//             <Col md={12}>
//               <div className="d-flex w-80 gap-2">
//                 <Button
//                   color={activeFilter === "all" ? "primary" : "light"}
//                   onClick={() => setActiveFilter("all")}
//                   className="flex-fill d-flex align-items-center justify-content-center gap-2"
//                   style={{
//                     fontSize: "0.85rem",
//                     padding: "6px 6px",
//                     minHeight: "36px",
//                   }}
//                 >
//                   <FaList /> All Orders
//                 </Button>
//                 <Button
//                   color={activeFilter === "open" ? "primary" : "light"}
//                   onClick={() => setActiveFilter("open")}
//                   className="flex-fill d-flex align-items-center justify-content-center gap-2"
//                   style={{
//                     fontSize: "0.85rem",
//                     padding: "6px 6px",
//                     minHeight: "36px",
//                   }}
//                 >
//                   <FaFolderOpen /> Open Orders
//                 </Button>
//                 <Button
//                   color={activeFilter === "complete" ? "primary" : "light"}
//                   onClick={() => setActiveFilter("complete")}
//                   className="flex-fill d-flex align-items-center justify-content-center gap-2"
//                   style={{
//                     fontSize: "0.85rem",
//                     padding: "6px 6px",
//                     minHeight: "36px",
//                   }}
//                 >
//                   <FaCheckCircle /> Complete Orders
//                 </Button>
//                 <Button
//                   color={activeFilter === "blocked" ? "primary" : "light"}
//                   onClick={() => setActiveFilter("blocked")}
//                   className="flex-fill d-flex align-items-center justify-content-center gap-2"
//                   style={{
//                     fontSize: "0.85rem",
//                     padding: "6px 6px",
//                     minHeight: "20px",
//                   }}
//                 >
//                   <FaBan /> Blocked Orders
//                 </Button>
//               </div>
//             </Col>
//           </Row>
//           <Card>
//             <CardBody>
//               <Row className="mb-3">
//                 <Col md={4}>
//                   <Dropdown
//                     isOpen={campaignDropdownOpen}
//                     toggle={toggleCampaignDropdown}
//                   >
//                     <DropdownToggle
//                       caret
//                       className="w-100 d-flex align-items-center justify-content-between"
//                       style={{
//                         backgroundColor: "#f8f9fa",
//                         borderColor: "#dee2e6",
//                         color: "#495057",
//                         fontSize: "0.85rem",
//                         padding: "6px 10px",
//                         minHeight: "36px",
//                       }}
//                     >
//                       <div className="d-flex align-items-center">
//                         <FaBoxes className="me-2" />
//                         {selectedCampaign}
//                       </div>
//                     </DropdownToggle>
//                     <DropdownMenu className="w-100">
//                       <DropdownItem
//                         header
//                         className="d-flex align-items-center"
//                       >
//                         <FaFilter className="me-2" />
//                         Select Campaign
//                       </DropdownItem>
//                       <DropdownItem
//                         onClick={() =>
//                           setSelectedCampaign("Choose Campaign...")
//                         }
//                         active={selectedCampaign === "Choose Campaign..."}
//                         className="d-flex align-items-center"
//                       >
//                         Choose Campaign...
//                       </DropdownItem>
//                       {campaignOptions.map((campaign, index) => (
//                         <DropdownItem
//                           key={index}
//                           onClick={() => setSelectedCampaign(campaign.label)}
//                           active={selectedCampaign === campaign.label}
//                           className="d-flex align-items-center"
//                         >
//                           {campaign.label}
//                         </DropdownItem>
//                       ))}
//                     </DropdownMenu>
//                   </Dropdown>
//                 </Col>
//                 <Col md={4}>
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
//                         fontSize: "0.85rem",
//                         padding: "6px 10px",
//                         minHeight: "36px",
//                       }}
//                     >
//                       <div className="d-flex align-items-center">
//                         <FaUserTag className="me-2" />
//                         {selectedVendor}
//                       </div>
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
//                           <FaUserTag className="me-2" />
//                           {vendor}
//                         </DropdownItem>
//                       ))}
//                     </DropdownMenu>
//                   </Dropdown>
//                 </Col>

//                 <Col md={3}>
//                   <div className="position-relative">
//                     <Input
//                       innerRef={searchInputRef}
//                       type="text"
//                       className="form-control"
//                       placeholder="Search order..."
//                       value={searchText}
//                       onChange={handleSearchInput}
//                     />
//                     {searchLoading && (
//                       <div className="position-absolute top-50 end-0 translate-middle-y me-2">
//                         <Spinner size="sm" />
//                       </div>
//                     )}
//                   </div>
//                 </Col>
//               </Row>
//               {loading ? (
//                 <div className="text-center py-5">
//                   <Spinner color="primary" />
//                 </div>
//               ) : (
//                 <TableContainer
//                   columns={columns || []}
//                   data={filteredOrders || []}
//                   isPagination={true}
//                   iscustomPageSize={false}
//                   isBordered={false}
//                   customPageSize={pagination.pageSize}
//                   className="custom-table"
//                   pagination={pagination}
//                   onPageChange={handlePageChange}
//                   onPageSizeChange={handlePageSizeChange}
//                 />
//               )}
//             </CardBody>
//           </Card>
//         </Container>
//       </div>
//       <AddLeadModal
//         isOpen={modalOpen}
//         toggle={() => setModalOpen(!modalOpen)}
//         onSubmit={handleLeadSubmit}
//         selectedOrder={selectedOrder}
//       />
//       <ImportLeadsModal
//         isOpen={importModalOpen}
//         toggle={toggleImportModal}
//         onFileUpload={handleFileUpload}
//         onMapping={(file) => {
//           setExcelFile(file);
//           toggleImportModal();
//           toggleMappingModal();
//         }}
//         selectedOrder={selectedOrder}
//       />
//       <ColumnMappingModal
//         isOpen={mappingModalOpen}
//         toggle={toggleMappingModal}
//         onImport={handleMappingComplete}
//         selectedOrder={selectedOrder}
//         excelColumns={excelColumns}
//         selectedFile={excelFile}
//       />
//     </React.Fragment>
//   );
// };

// export default Allorders;

import React, { useEffect, useMemo, useState, useRef } from "react";
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
  Badge,
  ButtonGroup,
  Input,
  Spinner,
} from "reactstrap";
import {
  FaFilter,
  FaUserTag,
  FaBoxes,
  FaPlus,
  FaFileImport,
  FaUnlock,
  FaLock,
  FaList,
  FaFolderOpen,
  FaCheckCircle,
  FaBan,
  FaTrash,
} from "react-icons/fa";
import * as XLSX from "xlsx";
import { FiEdit2 } from "react-icons/fi";
import AddLeadModal from "../../components/Modals/AddLeadModal";
import ImportLeadsModal from "../../components/Modals/ImportLeadsModal";
import ColumnMappingModal from "../../components/Modals/ColumnMappingModal";
import { useLocation, useNavigate } from "react-router-dom";
import {
  deleteOrder,
  fetchAllOrders,
  setOrderBlockStatus,
  fetchCampaigns,
  fetchOrdersByVendorId, // New import
  fetchOrdersByClientId, // New import
} from "../../services/orderService";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import useDeleteConfirmation from "../../components/Modals/DeleteConfirmation";
import { debounce } from "lodash";

const Allorders = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [excelColumns, setExcelColumns] = useState([]);
  const [excelFile, setExcelFile] = useState(null);
  const { confirmDelete } = useDeleteConfirmation();
  const [vendorDropdownOpen, setVendorDropdownOpen] = useState(false);
  const [campaignDropdownOpen, setCampaignDropdownOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState("Choose Vendor...");
  const [selectedCampaign, setSelectedCampaign] =
    useState("Choose Campaign...");
  const [activeFilter, setActiveFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [mappingModalOpen, setMappingModalOpen] = useState(false);
  const [ordersData, setOrdersData] = useState([]);
  const [campaignOptions, setCampaignOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    pageSize: 10,
  });
  const searchInputRef = useRef(null);

  // Get user role and ID from localStorage (assuming stored after login)
  const user = JSON.parse(localStorage.getItem("authUser")) || {};
  const userRole = user.userrole || "admin"; // Default to admin if not found
  const userId = user.id;

  const toggleModal = (order = null) => {
    setSelectedOrder(order);
    setModalOpen(!modalOpen);
  };
  const toggleImportModal = () => setImportModalOpen(!importModalOpen);
  const toggleMappingModal = () => setMappingModalOpen(!mappingModalOpen);
  const toggleVendorDropdown = () => setVendorDropdownOpen((prev) => !prev);
  const toggleCampaignDropdown = () => setCampaignDropdownOpen((prev) => !prev);

  // Fetch campaigns
  useEffect(() => {
    const loadCampaigns = async () => {
      try {
        const campaigns = await fetchCampaigns();
        setCampaignOptions(campaigns);
      } catch (error) {
        console.error("Failed to load campaigns", error);
        toast.error("Failed to load campaigns");
      }
    };
    loadCampaigns();
  }, []);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const campaignId = queryParams.get("campaign");

    if (!campaignId) {
      setSelectedCampaign("Choose Campaign...");
    } else {
      const campaign = campaignOptions.find((c) => c.value == campaignId);
      setSelectedCampaign(campaign ? campaign.label : "Choose Campaign...");
    }
  }, [location.search, campaignOptions]);

  // Debounced fetch function for orders, now dynamic based on user role
  const debouncedFetchOrders = debounce(async (page, limit, search) => {
    try {
      setLoading(true);
      setSearchLoading(true);

      let fetchFunction;
      if (userRole === "admin") {
        fetchFunction = fetchAllOrders;
      } else if (userRole === "vendor") {
        fetchFunction = (p, l, s) => fetchOrdersByVendorId(userId, p, l, s);
      } else if (userRole === "client") {
        fetchFunction = (p, l, s) => fetchOrdersByClientId(userId, p, l, s);
      } else {
        throw new Error("Unknown user role");
      }

      const response = await fetchFunction(page, limit, search);
      setOrdersData(response.data);
      setPagination((prev) => ({
        ...prev,
        totalPages: response.totalPages,
        totalItems: response.totalItems,
        currentPage: response.currentPage,
      }));
    } catch (error) {
      console.error("Failed to load orders", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
      setSearchLoading(false);
    }
  }, 500);

  useEffect(() => {
    debouncedFetchOrders(
      pagination.currentPage,
      pagination.pageSize,
      searchText
    );
    return () => debouncedFetchOrders.cancel();
  }, [
    pagination.currentPage,
    pagination.pageSize,
    searchText,
    userRole,
    userId,
  ]);

  const handleSearchInput = (e) => {
    setSearchText(e.target.value);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handleFileUpload = (file, data) => {
    const workbook = XLSX.read(data, { type: "binary" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    if (jsonData.length > 0) {
      setExcelColumns(jsonData[0]);
      setExcelFile(file);
    }
  };

  const handleMappingComplete = (response) => {
    const { imported, skipped } = response;
    toast.success(
      `${imported} leads imported successfully. Skipped: ${skipped.length}`
    );
    setOrdersData((prevOrders) =>
      prevOrders.map((order) =>
        order.id === selectedOrder.id
          ? {
              ...order,
              remainingLeads: order.remainingLeads - imported,
            }
          : order
      )
    );
  };

  const handleEdit = (order) => {
    navigate("/create-order", { state: { editData: order } });
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, currentPage: newPage }));
  };

  const handlePageSizeChange = (newSize) => {
    setPagination((prev) => ({
      ...prev,
      pageSize: newSize,
      currentPage: 1,
    }));
  };

  const handleBlockUnblock = async (orderId, isBlocked) => {
    Swal.fire({
      title: `Confirm ${isBlocked ? "Unblock" : "Block"}`,
      html: `
        <style>
          .swal2-popup {
            width: 230px !important;
            height:180px !important;
            padding: 10px !important;
            font-size: 14px !important;
          }
          .swal2-title {
            font-size: 18px !important;
          }
          .swal2-html-container {
            fontSize: 14px !important;
          }
          .swal2-actions {
            margin-top: 10px !important;
          }
          .swal2-confirm,
          .swal2-cancel {
            padding: 5px 10px !important;
            font-size: 14px !important;
          }
        </style>
        <p style="color: ${
          isBlocked ? "green" : "red"
        };">Are you sure you want to ${
        isBlocked ? "unblock" : "block"
      } this order?</p>
      `,
      showCancelButton: true,
      confirmButtonColor: isBlocked ? "#3085d6" : "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: `Yes, ${isBlocked ? "Unblock" : "Block"}`,
      cancelButtonText: "No, Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await setOrderBlockStatus(orderId, !isBlocked);
          toast.success(
            `Order ${isBlocked ? "unblocked" : "blocked"} successfully`
          );
          await debouncedFetchOrders(
            pagination.currentPage,
            pagination.pageSize,
            searchText
          );
        } catch (error) {
          toast.error(
            error.message ||
              `Failed to ${isBlocked ? "unblock" : "block"} order`
          );
        }
      }
    });
  };

  const handleDelete = async (orderId) => {
    await confirmDelete(
      async () => {
        await deleteOrder(orderId);
      },
      async () => {
        await debouncedFetchOrders(
          pagination.currentPage,
          pagination.pageSize,
          searchText
        );
      },
      "order"
    );
  };

  const filteredOrders = useMemo(() => {
    let filtered = Array.isArray(ordersData) ? ordersData : [];

    // Filter by selected campaign
    if (selectedCampaign !== "Choose Campaign...") {
      const campaign = campaignOptions.find(
        (c) => c.label === selectedCampaign
      );
      if (campaign) {
        filtered = filtered.filter(
          (order) => order.campaign_id == campaign.value
        );
      }
    }

    switch (activeFilter) {
      case "open":
        filtered = filtered.filter((order) => !order.is_blocked);
        break;
      case "complete":
        filtered = filtered.filter(
          (order) => order.priority_level === "Onhold"
        );
        break;
      case "blocked":
        filtered = filtered.filter((order) => order.is_blocked);
        break;
      default:
        break;
    }

    return filtered.sort((a, b) => {
      const dateA = a.created_at ? new Date(a.created_at) : new Date(0);
      const dateB = b.created_at ? new Date(b.created_at) : new Date(0);
      return dateA - dateB;
    });
  }, [ordersData, activeFilter, selectedCampaign, campaignOptions]);

  const vendors = ["Vendor2 Secok", "Junaid Tariq"];

  const handleLeadSubmit = (leadResponse) => {
    const orderId = leadResponse.order_id;
    setOrdersData((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              remainingLeads: order.remainingLeads - 1,
            }
          : order
      )
    );
  };

  const columns = useMemo(
    () => [
      {
        Header: "Order Id",
        accessor: "",
        disableFilters: true,
        width: 20,
        Cell: ({ row }) => <div>{row.index + 1}</div>,
      },
      {
        Header: "Agent Name",
        accessor: "agent",
        disableFilters: true,
        width: 100,
        Cell: ({ row }) => (
          <div
            className="text-primary"
            style={{ cursor: "pointer" }}
            onClick={() => {
              sessionStorage.setItem("fromOrderLink", "true");
              navigate(`/lead-index?orderId=${row.original.id}`);
            }}
          >
            {row.original.agent}
          </div>
        ),
      },

      {
        Header: "Options",
        disableFilters: true,
        Cell: (cellProps) => (
          <ButtonGroup vertical className="w-100">
            <Button
              color="primary"
              size="sm"
              className="d-flex align-items-center justify-content-center text-nowrap mb-2"
              onClick={() => toggleModal(cellProps.row.original)}
            >
              <FaPlus className="me-1" /> Add Lead
            </Button>
            <Button
              color="success"
              size="sm"
              className="d-flex align-items-center justify-content-center text-nowrap"
              onClick={() => {
                setSelectedOrder(cellProps.row.original);
                toggleImportModal();
              }}
            >
              <FaFileImport className="me-1" /> Import
            </Button>
          </ButtonGroup>
        ),
        width: 200,
      },
      {
        Header: "Leads Requested",
        accessor: "lead_requested",
        disableFilters: true,
        width: 40,
      },
      {
        Header: "Remaining Leads",
        accessor: "remainingLeads",
        disableFilters: true,
        width: 20,
      },
      {
        Header: "Notes & Area",
        accessor: "notes",
        disableFilters: true,
        Cell: ({ row }) => (
          <div
            className="text-truncate"
            style={{ maxWidth: "150px" }}
            title={row.original.notes}
          >
            {row.original.notes}
          </div>
        ),
        width: 150,
      },
      {
        Header: "Priority Level",
        accessor: "priority_level",
        disableFilters: true,
        width: 60,
      },

      {
        Header: "Status",
        accessor: "is_blocked",
        disableFilters: true,
        Cell: ({ value }) => (
          <Badge color={value ? "danger" : "success"}>
            {value ? "Blocked" : "Active"}
          </Badge>
        ),
        width: 100,
      },
      {
        Header: "Action",
        disableFilters: true,
        Cell: ({ row }) => (
          <div className="d-flex gap-2">
            <Button
              color="primary"
              size="sm"
              className="px-2 py-1"
              onClick={() => handleEdit(row.original)}
            >
              <FiEdit2 size={14} />
            </Button>
            <Button
              color={row.original.is_blocked ? "danger" : "secondary"}
              size="sm"
              className="px-2 py-1"
              onClick={() =>
                handleBlockUnblock(row.original.id, row.original.is_blocked)
              }
            >
              {row.original.is_blocked ? (
                <FaLock size={14} />
              ) : (
                <FaUnlock size={14} />
              )}
            </Button>
            <Button
              color="danger"
              size="sm"
              className="px-2 py-1"
              onClick={() => handleDelete(row.original.id)}
            >
              <FaTrash size={14} />
            </Button>
          </div>
        ),
        width: 120,
      },
    ],
    [campaignOptions]
  );

  const breadcrumbItems = [
    { title: "Dashboard", link: "/" },
    { title: "Orders", link: "#" },
    { title: "All Orders", link: "#" },
  ];

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="ALL ORDERS" breadcrumbItems={breadcrumbItems} />
          <Row className="mb-3">
            <Col md={12}>
              <div className="d-flex w-80 gap-2">
                <Button
                  color={activeFilter === "all" ? "primary" : "light"}
                  onClick={() => setActiveFilter("all")}
                  className="flex-fill d-flex align-items-center justify-content-center gap-2"
                  style={{
                    fontSize: "0.85rem",
                    padding: "6px 6px",
                    minHeight: "36px",
                  }}
                >
                  <FaList /> All Orders
                </Button>
                <Button
                  color={activeFilter === "open" ? "primary" : "light"}
                  onClick={() => setActiveFilter("open")}
                  className="flex-fill d-flex align-items-center justify-content-center gap-2"
                  style={{
                    fontSize: "0.85rem",
                    padding: "6px 6px",
                    minHeight: "36px",
                  }}
                >
                  <FaFolderOpen /> Open Orders
                </Button>
                <Button
                  color={activeFilter === "complete" ? "primary" : "light"}
                  onClick={() => setActiveFilter("complete")}
                  className="flex-fill d-flex align-items-center justify-content-center gap-2"
                  style={{
                    fontSize: "0.85rem",
                    padding: "6px 6px",
                    minHeight: "36px",
                  }}
                >
                  <FaCheckCircle /> Complete Orders
                </Button>
                <Button
                  color={activeFilter === "blocked" ? "primary" : "light"}
                  onClick={() => setActiveFilter("blocked")}
                  className="flex-fill d-flex align-items-center justify-content-center gap-2"
                  style={{
                    fontSize: "0.85rem",
                    padding: "6px 6px",
                    minHeight: "20px",
                  }}
                >
                  <FaBan /> Blocked Orders
                </Button>
              </div>
            </Col>
          </Row>
          <Card>
            <CardBody>
              <Row className="mb-3">
                <Col md={4}>
                  <Dropdown
                    isOpen={campaignDropdownOpen}
                    toggle={toggleCampaignDropdown}
                  >
                    <DropdownToggle
                      caret
                      className="w-100 d-flex align-items-center justify-content-between"
                      style={{
                        backgroundColor: "#f8f9fa",
                        borderColor: "#dee2e6",
                        color: "#495057",
                        fontSize: "0.85rem",
                        padding: "6px 10px",
                        minHeight: "36px",
                      }}
                    >
                      <div className="d-flex align-items-center">
                        <FaBoxes className="me-2" />
                        {selectedCampaign}
                      </div>
                    </DropdownToggle>
                    <DropdownMenu className="w-100">
                      <DropdownItem
                        header
                        className="d-flex align-items-center"
                      >
                        <FaFilter className="me-2" />
                        Select Campaign
                      </DropdownItem>
                      <DropdownItem
                        onClick={() =>
                          setSelectedCampaign("Choose Campaign...")
                        }
                        active={selectedCampaign === "Choose Campaign..."}
                        className="d-flex align-items-center"
                      >
                        Choose Campaign...
                      </DropdownItem>
                      {campaignOptions.map((campaign, index) => (
                        <DropdownItem
                          key={index}
                          onClick={() => setSelectedCampaign(campaign.label)}
                          active={selectedCampaign === campaign.label}
                          className="d-flex align-items-center"
                        >
                          {campaign.label}
                        </DropdownItem>
                      ))}
                    </DropdownMenu>
                  </Dropdown>
                </Col>
                <Col md={4}>
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
                        fontSize: "0.85rem",
                        padding: "6px 10px",
                        minHeight: "36px",
                      }}
                    >
                      <div className="d-flex align-items-center">
                        <FaUserTag className="me-2" />
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
                          <FaUserTag className="me-2" />
                          {vendor}
                        </DropdownItem>
                      ))}
                    </DropdownMenu>
                  </Dropdown>
                </Col>

                <Col md={3}>
                  <div className="position-relative">
                    <Input
                      innerRef={searchInputRef}
                      type="text"
                      className="form-control"
                      placeholder="Search order..."
                      value={searchText}
                      onChange={handleSearchInput}
                    />
                    {searchLoading && (
                      <div className="position-absolute top-50 end-0 translate-middle-y me-2">
                        <Spinner size="sm" />
                      </div>
                    )}
                  </div>
                </Col>
              </Row>
              {loading ? (
                <div className="text-center py-5">
                  <Spinner color="primary" />
                </div>
              ) : (
                <TableContainer
                  columns={columns || []}
                  data={filteredOrders || []}
                  isPagination={true}
                  iscustomPageSize={false}
                  isBordered={false}
                  customPageSize={pagination.pageSize}
                  className="custom-table"
                  pagination={pagination}
                  onPageChange={handlePageChange}
                  onPageSizeChange={handlePageSizeChange}
                />
              )}
            </CardBody>
          </Card>
        </Container>
      </div>
      <AddLeadModal
        isOpen={modalOpen}
        toggle={() => setModalOpen(!modalOpen)}
        onSubmit={handleLeadSubmit}
        selectedOrder={selectedOrder}
      />
      <ImportLeadsModal
        isOpen={importModalOpen}
        toggle={toggleImportModal}
        onFileUpload={handleFileUpload}
        onMapping={(file) => {
          setExcelFile(file);
          toggleImportModal();
          toggleMappingModal();
        }}
        selectedOrder={selectedOrder}
      />
      <ColumnMappingModal
        isOpen={mappingModalOpen}
        toggle={toggleMappingModal}
        onImport={handleMappingComplete}
        selectedOrder={selectedOrder}
        excelColumns={excelColumns}
        selectedFile={excelFile}
      />
    </React.Fragment>
  );
};

export default Allorders;
