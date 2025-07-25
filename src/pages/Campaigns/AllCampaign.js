// import React, { useState, useEffect } from "react";
// import Breadcrumbs from "../../components/Common/Breadcrumb";
// import {
//   Card,
//   CardBody,
//   Container,
//   Input,
//   Row,
//   Col,
//   Dropdown,
//   DropdownToggle,
//   DropdownMenu,
//   DropdownItem,
//   Button,
// } from "reactstrap";
// import { FiEdit2 } from "react-icons/fi";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import { deleteCampaign, fetchCampaigns } from "../../services/campaignService";
// import { FaTrash } from "react-icons/fa";
// import { fetchAllOrders } from "../../services/orderService";
// import useDeleteConfirmation from "../../components/Modals/DeleteConfirmation";

// const AllCampaigns = () => {
//   const [entriesPerPage, setEntriesPerPage] = useState(10);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [searchText, setSearchText] = useState("");
//   const [campaigns, setCampaigns] = useState([]);
//   const [totalItems, setTotalItems] = useState(0);
//   const [totalPages, setTotalPages] = useState(1);
//   const navigate = useNavigate();
//   const [orders, setOrders] = useState([]);
//   const { confirmDelete } = useDeleteConfirmation();

//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         // Load Orders
//         const ordersData = await fetchAllOrders();
//         setOrders(ordersData.data || []);

//         // Load Campaigns with pagination
//         const campaignsData = await fetchCampaigns({
//           page: currentPage,
//           limit: entriesPerPage,
//         });
//         setCampaigns(campaignsData.data);
//         setTotalItems(campaignsData.totalItems);
//         setTotalPages(campaignsData.totalPages);
//       } catch (error) {
//         console.error("Error loading data:", error);
//         toast.error("Failed to load campaigns");
//       }
//     };

//     loadData();
//   }, [currentPage, entriesPerPage]);

//   const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);

//   const handlePageChange = (page) => {
//     if (page >= 1 && page <= totalPages) {
//       setCurrentPage(page);
//     }
//   };

//   const handlePageInputChange = (event) => {
//     const page = event.target.value ? Number(event.target.value) : 1;
//     if (page >= 1 && page <= totalPages) {
//       setCurrentPage(page);
//     }
//   };

//   const isCampaignLinked = (campaignId) => {
//     if (!Array.isArray(orders)) return false;
//     return orders.some((order) => order.campaign_id === campaignId);
//   };

//   const handleEdit = (campaign) => {
//     const editData = {
//       id: campaign.id,
//       name: campaign.campaignName,
//       columns:
//         campaign.parsedFields.map((field) => ({
//           name: field.col_name,
//           slug: field.col_slug,
//           type: field.col_type,
//           defaultValue: field.default_value,
//           options: field.options ? field.options.join(" | ") : " | ",
//         })) || [],
//     };

//     navigate("/create-campaign", { state: { editData } });
//   };

//   const filteredData = campaigns.filter(
//     (campaign) =>
//       campaign?.campaignName &&
//       campaign.campaignName.toLowerCase().includes(searchText.toLowerCase())
//   );

//   const handleDelete = async (campaignId) => {
//     const isLinkedToOrder = orders.some(
//       (order) => order.campaign_id === campaignId
//     );

//     if (isLinkedToOrder) {
//       toast.error("Cannot delete: Campaign is linked to an order.");
//       return;
//     }

//     const deleteFn = () => deleteCampaign(campaignId);
//     const onSuccess = async () => {
//       setCampaigns((prev) => prev.filter((c) => c.id !== campaignId));
//       setTotalItems((prev) => prev - 1);
//       const newTotalPages = Math.ceil((totalItems - 1) / entriesPerPage);
//       setTotalPages(newTotalPages);
//       if (campaigns.length === 1 && currentPage > 1) {
//         setCurrentPage((prev) => prev - 1);
//       } else if (campaigns.length === 1 && currentPage === 1) {
//         setCampaigns([]);
//       }
//     };

//     confirmDelete(deleteFn, onSuccess, "campaign");
//   };

//   const breadcrumbItems = [
//     { title: "Campaigns", link: "/" },
//     { title: "All Campaigns", link: "#" },
//   ];

//   const formatColumns = (fields) => {
//     if (!Array.isArray(fields)) return <span>No columns</span>;

//     return (
//       <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
//         {fields.map((field, index) => (
//           <span
//             key={index}
//             style={{
//               backgroundColor: "#d6d8db",
//               padding: "4px 8px",
//               borderRadius: "6px",
//               fontSize: "0.6rem",
//               whiteSpace: "nowrap",
//               fontWeight: "500",
//               color: "#333",
//             }}
//           >
//             {field.col_name || "Unnamed Column"}
//           </span>
//         ))}
//       </div>
//     );
//   };

//   return (
//     <React.Fragment>
//       <div className="page-content">
//         <Container fluid>
//           <Breadcrumbs
//             title="ALL CAMPAIGNS"
//             breadcrumbItems={breadcrumbItems}
//           />
//           <Card>
//             <CardBody>
//               <div className="d-flex justify-content-end align-items-end mb-3">
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

//               <div className="table-responsive">
//                 <table className="table table-bordered table-nowrap">
//                   <thead className="table-light">
//                     <tr style={{ fontSize: "14px" }}>
//                       <th>Campaign Name</th>
//                       <th>Campaign Columns</th>
//                       <th>Options</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {filteredData.map((row) => (
//                       <tr key={row.id}>
//                         <td style={{ fontSize: "13px" }}>
//                           <button
//                             onClick={() => {
//                               sessionStorage.setItem(
//                                 "fromCampaignLink",
//                                 "true"
//                               );
//                               navigate(`/order-index?campaign=${row.id}`);
//                             }}
//                             style={{
//                               color: "blue",
//                               cursor: "pointer",
//                               background: "none",
//                               border: "none",
//                               padding: 0,
//                               font: "inherit",
//                             }}
//                           >
//                             {row.campaignName}
//                           </button>
//                         </td>
//                         <td style={{ fontSize: "12px" }}>
//                           {formatColumns(row.parsedFields || [])}
//                         </td>
//                         <td>
//                           <Button
//                             color="primary"
//                             size="sm"
//                             className="px-2 py-1 p-0 me-2"
//                             onClick={() =>
//                               !isCampaignLinked(row.id) && handleEdit(row)
//                             }
//                             disabled={isCampaignLinked(row.id)}
//                             style={{
//                               opacity: isCampaignLinked(row.id) ? 0.5 : 1,
//                               cursor: isCampaignLinked(row.id)
//                                 ? "not-allowed"
//                                 : "pointer",
//                             }}
//                             title={
//                               isCampaignLinked(row.id)
//                                 ? "Cannot edit: Campaign is linked to an order"
//                                 : "Edit campaign"
//                             }
//                           >
//                             <FiEdit2 size={14} />
//                           </Button>
//                           <Button
//                             color="danger"
//                             size="sm"
//                             className="px-2 py-1"
//                             onClick={() => handleDelete(row.id)}
//                           >
//                             <FaTrash size={14} />
//                           </Button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>

//               <Row className="justify-content-md-end justify-content-center align-items-center mt-3">
//                 <Col md={3} className="d-flex align-items-center">
//                   <span className="me-2">Show:</span>
//                   <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
//                     <DropdownToggle
//                       caret
//                       color="light"
//                       className="py-1 px-2 btn-sm"
//                     >
//                       {entriesPerPage}
//                     </DropdownToggle>
//                     <DropdownMenu>
//                       {[10, 25, 50, 100].map((size) => (
//                         <DropdownItem
//                           key={size}
//                           active={entriesPerPage === size}
//                           onClick={() => {
//                             setEntriesPerPage(size);
//                             setCurrentPage(1);
//                           }}
//                         >
//                           {size}
//                         </DropdownItem>
//                       ))}
//                     </DropdownMenu>
//                   </Dropdown>
//                   <span className="ms-2">entries</span>
//                 </Col>

//                 <Col md={6} className="d-flex justify-content-center">
//                   <div className="d-flex align-items-center gap-2">
//                     <Button
//                       color="primary"
//                       onClick={() => handlePageChange(1)}
//                       disabled={currentPage === 1}
//                       size="sm"
//                     >
//                       {"<<"}
//                     </Button>
//                     <Button
//                       color="primary"
//                       onClick={() => handlePageChange(currentPage - 1)}
//                       disabled={currentPage === 1}
//                       size="sm"
//                     >
//                       {"<"}
//                     </Button>

//                     <div className="mx-2 d-flex align-items-center">
//                       <span className="me-2">Page</span>
//                       <Input
//                         type="number"
//                         min={1}
//                         max={totalPages}
//                         value={currentPage}
//                         onChange={handlePageInputChange}
//                         style={{ width: "60px" }}
//                         bsSize="sm"
//                       />
//                       <span className="ms-2">of {totalPages}</span>
//                     </div>

//                     <Button
//                       color="primary"
//                       onClick={() => handlePageChange(currentPage + 1)}
//                       disabled={currentPage === totalPages || totalPages === 0}
//                       size="sm"
//                     >
//                       {">"}
//                     </Button>
//                     <Button
//                       color="primary"
//                       onClick={() => handlePageChange(totalPages)}
//                       disabled={currentPage === totalPages || totalPages === 0}
//                       size="sm"
//                     >
//                       {">>"}
//                     </Button>
//                   </div>
//                 </Col>

//                 <Col md={3} className="text-md-end">
//                   <span>Total: {totalItems} items</span>
//                 </Col>
//               </Row>
//             </CardBody>
//           </Card>
//         </Container>
//       </div>
//     </React.Fragment>
//   );
// };

// export default AllCampaigns;

import React, { useState, useEffect } from "react";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import {
  Card,
  CardBody,
  Container,
  Input,
  Row,
  Col,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button,
} from "reactstrap";
import { FiEdit2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { deleteCampaign, fetchCampaigns } from "../../services/campaignService";
import { FaTrash } from "react-icons/fa";
import { fetchAllOrders } from "../../services/orderService";
import useDeleteConfirmation from "../../components/Modals/DeleteConfirmation";
import { useSelector } from "react-redux";

const AllCampaigns = () => {
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [campaigns, setCampaigns] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const { confirmDelete } = useDeleteConfirmation();

  const user = useSelector((state) => {
    if (state.auth?.user) return state.auth.user;
    const storedUser = localStorage.getItem("authUser");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const ordersData = await fetchAllOrders();
        setOrders(ordersData.data || []);

        const campaignsData = await fetchCampaigns({
          page: currentPage,
          limit: entriesPerPage,
        });

        let filteredCampaigns = [];

        if (campaignsData.data?.length) {
          if (!user?.role?.Permissions) {
            filteredCampaigns = [];
          } else {
            const specificPermissions = user.role.Permissions.filter((perm) =>
              perm.resourceType?.startsWith("campaign-")
            );

            if (specificPermissions.length > 0) {
              const allowedCampaignIds = specificPermissions.map((perm) =>
                parseInt(perm.resourceId)
              );
              filteredCampaigns = campaignsData.data.filter((campaign) =>
                allowedCampaignIds.includes(parseInt(campaign.id))
              );
            } else if (
              user.role.Permissions.some((perm) => perm.name === "campaign:get")
            ) {
              filteredCampaigns = campaignsData.data;
            }
          }
        }

        setCampaigns(filteredCampaigns);
        setTotalItems(filteredCampaigns.length);
        setTotalPages(Math.ceil(filteredCampaigns.length / entriesPerPage));
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Failed to load campaigns");
      }
    };

    loadData();
  }, [currentPage, entriesPerPage, user]);

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handlePageInputChange = (e) => {
    const page = e.target.value ? Number(e.target.value) : 1;
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const isCampaignLinked = (campaignId) =>
    orders.some((order) => order.campaign_id === campaignId);

  const handleEdit = (campaign) => {
    const editData = {
      id: campaign.id,
      name: campaign.campaignName,
      columns: campaign.parsedFields.map((field) => ({
        name: field.col_name,
        slug: field.col_slug,
        type: field.col_type,
        defaultValue: field.default_value,
        options: field.options?.join(" | ") || " | ",
      })),
    };
    navigate("/create-campaign", { state: { editData } });
  };

  const handleDelete = async (campaignId) => {
    if (isCampaignLinked(campaignId)) {
      toast.error("Cannot delete: Campaign is linked to an order.");
      return;
    }

    confirmDelete(
      () => deleteCampaign(campaignId),
      async () => {
        setCampaigns((prev) => prev.filter((c) => c.id !== campaignId));
        const newTotal = totalItems - 1;
        setTotalItems(newTotal);
        const newTotalPages = Math.ceil(newTotal / entriesPerPage);
        setTotalPages(newTotalPages);
        if (campaigns.length === 1 && currentPage > 1) {
          setCurrentPage((prev) => prev - 1);
        } else if (campaigns.length === 1 && currentPage === 1) {
          setCampaigns([]);
        }
      },
      "campaign"
    );
  };

  const filteredData = campaigns.filter((c) =>
    c.campaignName?.toLowerCase().includes(searchText.toLowerCase())
  );

  const breadcrumbItems = [
    { title: "Campaigns", link: "/" },
    { title: "All Campaigns", link: "#" },
  ];

  const formatColumns = (fields) => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
      {fields.map((field, i) => (
        <span
          key={i}
          style={{
            backgroundColor: "#d6d8db",
            padding: "4px 8px",
            borderRadius: "6px",
            fontSize: "0.6rem",
            fontWeight: "500",
            color: "#333",
          }}
        >
          {field.col_name || "Unnamed Column"}
        </span>
      ))}
    </div>
  );

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs title="ALL CAMPAIGNS" breadcrumbItems={breadcrumbItems} />
        <Card>
          <CardBody>
            <div className="d-flex justify-content-end mb-3">
              <Input
                type="text"
                placeholder="Search..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>

            <div className="table-responsive">
              <table className="table table-bordered table-nowrap">
                <thead className="table-light">
                  <tr style={{ fontSize: "14px" }}>
                    <th>Campaign Name</th>
                    <th>Campaign Columns</th>
                    <th>Options</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.length > 0 ? (
                    filteredData.map((row) => (
                      <tr key={row.id}>
                        <td style={{ fontSize: "13px" }}>
                          <button
                            onClick={() => {
                              sessionStorage.setItem(
                                "fromCampaignLink",
                                "true"
                              );
                              navigate(`/order-index?campaign=${row.id}`);
                            }}
                            style={{
                              color: "blue",
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              padding: 0,
                              font: "inherit",
                            }}
                          >
                            {row.campaignName}
                          </button>
                        </td>
                        <td style={{ fontSize: "12px" }}>
                          {formatColumns(row.parsedFields || [])}
                        </td>
                        <td>
                          <Button
                            color="primary"
                            size="sm"
                            className="me-2"
                            onClick={() =>
                              !isCampaignLinked(row.id) && handleEdit(row)
                            }
                            disabled={isCampaignLinked(row.id)}
                            title={
                              isCampaignLinked(row.id)
                                ? "Cannot edit: Linked to an order"
                                : "Edit"
                            }
                          >
                            <FiEdit2 size={14} />
                          </Button>
                          <Button
                            color="danger"
                            size="sm"
                            onClick={() => handleDelete(row.id)}
                          >
                            <FaTrash size={14} />
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-center">
                        No campaigns found or no permission to view
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {filteredData.length > 0 && (
              <Row className="align-items-center mt-3">
                <Col md={3} className="d-flex align-items-center">
                  <span className="me-2">Show:</span>
                  <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
                    <DropdownToggle caret color="light" className="py-1 px-2">
                      {entriesPerPage}
                    </DropdownToggle>
                    <DropdownMenu>
                      {[10, 25, 50, 100].map((size) => (
                        <DropdownItem
                          key={size}
                          active={entriesPerPage === size}
                          onClick={() => {
                            setEntriesPerPage(size);
                            setCurrentPage(1);
                          }}
                        >
                          {size}
                        </DropdownItem>
                      ))}
                    </DropdownMenu>
                  </Dropdown>
                  <span className="ms-2">entries</span>
                </Col>

                <Col md={6} className="d-flex justify-content-center">
                  <div className="d-flex align-items-center gap-2">
                    <Button
                      color="primary"
                      onClick={() => handlePageChange(1)}
                      disabled={currentPage === 1}
                      size="sm"
                    >
                      {"<<"}
                    </Button>
                    <Button
                      color="primary"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      size="sm"
                    >
                      {"<"}
                    </Button>

                    <Input
                      type="number"
                      min={1}
                      max={totalPages}
                      value={currentPage}
                      onChange={handlePageInputChange}
                      style={{ width: "60px" }}
                      bsSize="sm"
                    />
                    <span>of {totalPages}</span>

                    <Button
                      color="primary"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      size="sm"
                    >
                      {">"}
                    </Button>
                    <Button
                      color="primary"
                      onClick={() => handlePageChange(totalPages)}
                      disabled={currentPage === totalPages}
                      size="sm"
                    >
                      {">>"}
                    </Button>
                  </div>
                </Col>

                <Col md={3} className="text-md-end">
                  <span>Total: {totalItems} items</span>
                </Col>
              </Row>
            )}
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default AllCampaigns;
