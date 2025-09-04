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
//   Spinner,
// } from "reactstrap";
// import { FiEdit2 } from "react-icons/fi";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import { deleteCampaign, fetchCampaigns } from "../../services/campaignService";
// import { FaTrash } from "react-icons/fa";
// import useDeleteConfirmation from "../../components/Modals/DeleteConfirmation";
// import { useSelector } from "react-redux";

// const AllCampaigns = () => {
//   const [entriesPerPage, setEntriesPerPage] = useState(10);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [searchText, setSearchText] = useState("");
//   const [campaigns, setCampaigns] = useState([]);
//   const [totalItems, setTotalItems] = useState(0);
//   const [totalPages, setTotalPages] = useState(1);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();
//   const { confirmDelete } = useDeleteConfirmation();

//   const user = useSelector((state) => {
//     if (state.auth?.user) return state.auth.user;
//     const storedUser = localStorage.getItem("authUser");
//     return storedUser ? JSON.parse(storedUser) : null;
//   });

//   useEffect(() => {
//     const loadData = async () => {
//       setLoading(true);
//       try {
//         const campaignsData = await fetchCampaigns({
//           page: currentPage,
//           limit: entriesPerPage,
//         });

//         let filteredCampaigns = [];

//         if (campaignsData.data?.length) {
//           if (!user?.role?.Permissions) {
//             filteredCampaigns = [];
//           } else {
//             const specificPermissions = user.role.Permissions.filter(
//               (perm) =>
//                 perm.name === "getCampaignById" &&
//                 perm.resourceType?.startsWith("campaign-")
//             );

//             if (specificPermissions.length > 0) {
//               const allowedCampaignIds = specificPermissions.map((perm) =>
//                 parseInt(perm.resourceId)
//               );
//               filteredCampaigns = campaignsData.data.filter((campaign) =>
//                 allowedCampaignIds.includes(parseInt(campaign.id))
//               );
//             } else if (
//               user.role.Permissions.some((perm) => perm.name === "campaign:get")
//             ) {
//               filteredCampaigns = campaignsData.data;
//             }
//           }
//         }

//         setCampaigns(filteredCampaigns);
//         setTotalItems(filteredCampaigns.length);
//         setTotalPages(Math.ceil(filteredCampaigns.length / entriesPerPage));
//       } catch (error) {
//         console.error("Error loading data:", error);
//         toast.error("Failed to load campaigns");
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadData();
//   }, [currentPage, entriesPerPage, user?.id]);

//   const toggleDropdown = () => setDropdownOpen((prev) => !prev);

//   const handlePageChange = (page) => {
//     if (page >= 1 && page <= totalPages) setCurrentPage(page);
//   };

//   const handlePageInputChange = (e) => {
//     const page = e.target.value ? Number(e.target.value) : 1;
//     if (page >= 1 && page <= totalPages) setCurrentPage(page);
//   };

//   const handleEdit = (campaign) => {
//     const editData = {
//       id: campaign.id,
//       name: campaign.campaignName,
//       columns: campaign.parsedFields.map((field) => ({
//         name: field.col_name,
//         slug: field.col_slug,
//         type: field.col_type,
//         defaultValue: field.default_value,
//         options: field.options?.join(" | ") || " | ",
//       })),
//     };
//     navigate("/create-campaign", { state: { editData } });
//   };

//   const handleDelete = async (campaign) => {
//     if (campaign.isLinkedToOrder) {
//       toast.error("Cannot delete: Campaign is linked to an order.");
//       return;
//     }

//     confirmDelete(
//       () => deleteCampaign(campaign.id),
//       async () => {
//         setCampaigns((prev) => prev.filter((c) => c.id !== campaign.id));
//         const newTotal = totalItems - 1;
//         setTotalItems(newTotal);
//         const newTotalPages = Math.ceil(newTotal / entriesPerPage);
//         setTotalPages(newTotalPages);
//         if (campaigns.length === 1 && currentPage > 1) {
//           setCurrentPage((prev) => prev - 1);
//         } else if (campaigns.length === 1 && currentPage === 1) {
//           setCampaigns([]);
//         }
//       },
//       "campaign"
//     );
//   };

//   const filteredData = campaigns.filter((c) =>
//     c.campaignName?.toLowerCase().includes(searchText.toLowerCase())
//   );

//   const breadcrumbItems = [
//     { title: "Campaigns", link: "/" },
//     { title: "All Campaigns", link: "#" },
//   ];

//   const formatColumns = (fields) => (
//     <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
//       {fields.map((field, i) => (
//         <span
//           key={i}
//           style={{
//             backgroundColor: "#d6d8db",
//             padding: "4px 8px",
//             borderRadius: "6px",
//             fontSize: "0.6rem",
//             fontWeight: "500",
//             color: "#333",
//           }}
//         >
//           {field.col_name || "Unnamed Column"}
//         </span>
//       ))}
//     </div>
//   );

//   return (
//     <div className="page-content">
//       <Container fluid>
//         <Breadcrumbs title="ALL CAMPAIGNS" breadcrumbItems={breadcrumbItems} />
//         <Card>
//           <CardBody>
//             {loading ? (
//               <div className="text-center my-5">
//                 <Spinner color="primary" />
//               </div>
//             ) : (
//               <>
//                 <div className="d-flex justify-content-end mb-3">
//                   <Input
//                     type="text"
//                     placeholder="Search..."
//                     value={searchText}
//                     onChange={(e) => setSearchText(e.target.value)}
//                   />
//                 </div>

//                 <div className="table-responsive">
//                   <table className="table table-bordered table-nowrap">
//                     <thead className="table-light">
//                       <tr style={{ fontSize: "14px" }}>
//                         <th>Campaign Name</th>
//                         <th>Campaign Columns</th>
//                         <th>Options</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {filteredData.length > 0 ? (
//                         filteredData.map((row) => (
//                           <tr key={row.id}>
//                             <td style={{ fontSize: "13px" }}>
//                               <button
//                                 onClick={() => {
//                                   sessionStorage.setItem(
//                                     "fromCampaignLink",
//                                     "true"
//                                   );
//                                   navigate(`/order-index?campaign=${row.id}`);
//                                 }}
//                                 style={{
//                                   color: "blue",
//                                   background: "none",
//                                   border: "none",
//                                   cursor: "pointer",
//                                   padding: 0,
//                                   font: "inherit",
//                                 }}
//                               >
//                                 {row.campaignName}
//                               </button>
//                             </td>
//                             <td style={{ fontSize: "12px" }}>
//                               {formatColumns(row.parsedFields || [])}
//                             </td>
//                             <td>
//                               <Button
//                                 color="primary"
//                                 size="sm"
//                                 className="me-2"
//                                 onClick={() =>
//                                   !row.isLinkedToOrder && handleEdit(row)
//                                 }
//                                 disabled={row.isLinkedToOrder}
//                                 title={
//                                   row.isLinkedToOrder
//                                     ? "Cannot edit: Linked to an order"
//                                     : "Edit"
//                                 }
//                               >
//                                 <FiEdit2 size={14} />
//                               </Button>
//                               <Button
//                                 color="danger"
//                                 size="sm"
//                                 onClick={() => handleDelete(row)}
//                                 disabled={row.isLinkedToOrder}
//                                 title={
//                                   row.isLinkedToOrder
//                                     ? "Cannot delete: Linked to an order"
//                                     : "Delete"
//                                 }
//                               >
//                                 <FaTrash size={14} />
//                               </Button>
//                             </td>
//                           </tr>
//                         ))
//                       ) : (
//                         <tr>
//                           <td colSpan="3" className="text-center">
//                             No campaigns found or no permission to view
//                           </td>
//                         </tr>
//                       )}
//                     </tbody>
//                   </table>
//                 </div>

//                 {filteredData.length > 0 && (
//                   <Row className="align-items-center mt-3">
//                     <Col md={3} className="d-flex align-items-center">
//                       <span className="me-2">Show:</span>
//                       <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
//                         <DropdownToggle
//                           caret
//                           color="light"
//                           className="py-1 px-2"
//                         >
//                           {entriesPerPage}
//                         </DropdownToggle>
//                         <DropdownMenu>
//                           {[10, 25, 50, 100].map((size) => (
//                             <DropdownItem
//                               key={size}
//                               active={entriesPerPage === size}
//                               onClick={() => {
//                                 setEntriesPerPage(size);
//                                 setCurrentPage(1);
//                               }}
//                             >
//                               {size}
//                             </DropdownItem>
//                           ))}
//                         </DropdownMenu>
//                       </Dropdown>
//                       <span className="ms-2">entries</span>
//                     </Col>

//                     <Col md={6} className="d-flex justify-content-center">
//                       <div className="d-flex align-items-center gap-2">
//                         <Button
//                           color="primary"
//                           onClick={() => handlePageChange(1)}
//                           disabled={currentPage === 1}
//                           size="sm"
//                         >
//                           {"<<"}
//                         </Button>
//                         <Button
//                           color="primary"
//                           onClick={() => handlePageChange(currentPage - 1)}
//                           disabled={currentPage === 1}
//                           size="sm"
//                         >
//                           {"<"}
//                         </Button>

//                         <Input
//                           type="number"
//                           min={1}
//                           max={totalPages}
//                           value={currentPage}
//                           onChange={handlePageInputChange}
//                           style={{ width: "60px" }}
//                           bsSize="sm"
//                         />
//                         <span>of {totalPages}</span>

//                         <Button
//                           color="primary"
//                           onClick={() => handlePageChange(currentPage + 1)}
//                           disabled={currentPage === totalPages}
//                           size="sm"
//                         >
//                           {">"}
//                         </Button>
//                         <Button
//                           color="primary"
//                           onClick={() => handlePageChange(totalPages)}
//                           disabled={currentPage === totalPages}
//                           size="sm"
//                         >
//                           {">>"}
//                         </Button>
//                       </div>
//                     </Col>

//                     <Col md={3} className="text-md-end">
//                       <span>Total: {totalItems} items</span>
//                     </Col>
//                   </Row>
//                 )}
//               </>
//             )}
//           </CardBody>
//         </Card>
//       </Container>
//     </div>
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
  Spinner,
} from "reactstrap";
import { FiEdit2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { deleteCampaign, fetchCampaigns } from "../../services/campaignService";
import { FaTrash } from "react-icons/fa";
import useDeleteConfirmation from "../../components/Modals/DeleteConfirmation";
import { useSelector } from "react-redux";
import { hasAnyPermission } from "../../utils/permissions";
import { useDebounce } from "use-debounce";

const AllCampaigns = () => {
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [campaigns, setCampaigns] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { confirmDelete } = useDeleteConfirmation();

  const user = useSelector((state) => {
    if (state.auth?.user) return state.auth.user;
    const storedUser = localStorage.getItem("authUser");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [debouncedSearch] = useDebounce(searchText, 400);

  const reduxPermissions = useSelector(
    (state) => state.Permissions?.permissions
  );

  // useEffect(() => {
  //   const loadData = async () => {
  //     setLoading(true);
  //     try {
  //       const campaignsData = await fetchCampaigns({
  //         page: currentPage,
  //         limit: entriesPerPage,
  //         search: debouncedSearch,
  //       });

  //       let filteredCampaigns = [];

  //       if (campaignsData.data?.length && user?.role?.Permissions) {
  //         const isAdmin = user.role.name === "Admin";

  //         if (isAdmin) {
  //           // Admin sees all campaigns
  //           filteredCampaigns = campaignsData.data;
  //         } else {
  //           // Non-admin users: Check specific permissions
  //           const specificPermissions = user.role.Permissions.filter(
  //             (perm) =>
  //               perm.name === "getCampaignById" &&
  //               perm.resourceType?.startsWith("campaign-")
  //           );

  //           const allowedCampaignIds = specificPermissions.map((perm) =>
  //             parseInt(perm.resourceId)
  //           );

  //           // Check if user has general campaign:get permission
  //           const hasGeneralPermission = user.role.Permissions.some(
  //             (perm) => perm.name === "campaign:get"
  //           );

  //           // Check if user has campaign:create permission
  //           const hasCreatePermission = user.role.Permissions.some(
  //             (perm) => perm.name === "campaign:create"
  //           );

  //           if (hasGeneralPermission && allowedCampaignIds.length === 0) {
  //             // User has full access (but not Admin)
  //             filteredCampaigns = campaignsData.data;
  //           } else if (hasGeneralPermission && allowedCampaignIds.length > 0) {
  //             // User has general permission BUT also has specific restrictions
  //             filteredCampaigns = campaignsData.data.filter((campaign) =>
  //               allowedCampaignIds.includes(parseInt(campaign.id))
  //             );
  //           } else if (allowedCampaignIds.length > 0) {
  //             // User only has specific campaign permissions
  //             filteredCampaigns = campaignsData.data.filter((campaign) =>
  //               allowedCampaignIds.includes(parseInt(campaign.id))
  //             );
  //           }

  //           // Add campaigns created by the user (if they have create permission)
  //           if (hasCreatePermission) {
  //             const userCreatedCampaigns = campaignsData.data.filter(
  //               (campaign) => campaign.createdBy === user.id
  //             );
  //             filteredCampaigns = [
  //               ...filteredCampaigns,
  //               ...userCreatedCampaigns.filter(
  //                 (campaign) =>
  //                   !filteredCampaigns.some((c) => c.id === campaign.id)
  //               ),
  //             ];
  //           }
  //         }
  //       }

  //       setCampaigns(filteredCampaigns);
  //       setTotalItems(filteredCampaigns.length);
  //       setTotalPages(Math.ceil(filteredCampaigns.length / entriesPerPage));
  //     } catch (error) {
  //       console.error("Error loading data:", error);
  //       toast.error("Failed to load campaigns");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   loadData();
  // }, [
  //   currentPage,
  //   entriesPerPage,
  //   debouncedSearch,
  //   user?.id,
  //   user?.role?.name,
  // ]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const campaignsData = await fetchCampaigns({
          page: currentPage,
          limit: entriesPerPage,
          search: debouncedSearch,
        });

        let filteredCampaigns = [];

        if (user?.role?.Permissions) {
          const isAdmin = user.role.name === "Admin";

          if (isAdmin) {
            filteredCampaigns = campaignsData.data || [];
          } else {
            const specificPermissions = user.role.Permissions.filter(
              (perm) =>
                perm.name === "getCampaignById" &&
                perm.resourceType?.startsWith("campaign-")
            );

            const allowedCampaignIds = specificPermissions.map((perm) =>
              parseInt(perm.resourceId)
            );

            const hasGeneralPermission = user.role.Permissions.some(
              (perm) => perm.name === "campaign:get"
            );

            const hasCreatePermission = user.role.Permissions.some(
              (perm) => perm.name === "campaign:create"
            );

            if (hasGeneralPermission && allowedCampaignIds.length === 0) {
              filteredCampaigns = campaignsData.data || [];
            } else if (hasGeneralPermission && allowedCampaignIds.length > 0) {
              filteredCampaigns = (campaignsData.data || []).filter(
                (campaign) => allowedCampaignIds.includes(parseInt(campaign.id))
              );
            } else if (allowedCampaignIds.length > 0) {
              filteredCampaigns = (campaignsData.data || []).filter(
                (campaign) => allowedCampaignIds.includes(parseInt(campaign.id))
              );
            }

            if (hasCreatePermission) {
              const userCreatedCampaigns = (campaignsData.data || []).filter(
                (campaign) => campaign.createdBy === user.id
              );
              filteredCampaigns = [
                ...filteredCampaigns,
                ...userCreatedCampaigns.filter(
                  (campaign) =>
                    !filteredCampaigns.some((c) => c.id === campaign.id)
                ),
              ];
            }
          }
        }

        setCampaigns(filteredCampaigns);
        setTotalItems(filteredCampaigns.length);
        setTotalPages(Math.ceil(filteredCampaigns.length / entriesPerPage));
      } catch (error) {
        console.error("Error loading data:", error);

        // ✅ Instead of toaster, just show empty table
        setCampaigns([]);
        setTotalItems(0);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [
    currentPage,
    entriesPerPage,
    debouncedSearch,
    user?.id,
    user?.role?.name,
  ]);

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handlePageInputChange = (e) => {
    const page = e.target.value ? Number(e.target.value) : 1;
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

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

  const handleDelete = async (campaign) => {
    if (campaign.isLinkedToOrder) {
      toast.error("Cannot delete: Campaign is linked to an order.");
      return;
    }

    confirmDelete(
      () => deleteCampaign(campaign.id),
      async () => {
        setCampaigns((prev) => prev.filter((c) => c.id !== campaign.id));
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

  // const filteredData = campaigns.filter((c) =>
  //   c.campaignName?.toLowerCase().includes(searchText.toLowerCase())
  // );

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
            {loading ? (
              <div className="text-center my-5">
                <Spinner color="primary" />
              </div>
            ) : (
              <>
                <div className="d-flex justify-content-end mb-3">
                  <div style={{ width: "250px" }}>
                    <Input
                      type="text"
                      placeholder="Search..."
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                    />
                  </div>
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
                      {campaigns.length > 0 ? (
                        campaigns.map((row) => (
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
                            {/* <td>
                              <Button
                                color="primary"
                                size="sm"
                                className="me-2"
                                onClick={() =>
                                  !row.isLinkedToOrder && handleEdit(row)
                                }
                                disabled={row.isLinkedToOrder}
                                title={
                                  row.isLinkedToOrder
                                    ? "Cannot edit: Linked to an order"
                                    : "Edit"
                                }
                              >
                                <FiEdit2 size={14} />
                              </Button>
                              <Button
                                color="danger"
                                size="sm"
                                onClick={() => handleDelete(row)}
                                disabled={row.isLinkedToOrder}
                                title={
                                  row.isLinkedToOrder
                                    ? "Cannot delete: Linked to an order"
                                    : "Delete"
                                }
                              >
                                <FaTrash size={14} />
                              </Button>
                            </td> */}

                            <td>
                              {(() => {
                                const canUpdate =
                                  (user?.id === row.createdBy &&
                                    hasAnyPermission(
                                      user,
                                      ["campaign:updateById"],
                                      reduxPermissions
                                    )) ||
                                  hasAnyPermission(
                                    user,
                                    ["campaign:update"],
                                    reduxPermissions
                                  );

                                const canDelete =
                                  (user?.id === row.createdBy &&
                                    hasAnyPermission(
                                      user,
                                      ["campaign:deleteById"],
                                      reduxPermissions
                                    )) ||
                                  hasAnyPermission(
                                    user,
                                    ["campaign:delete"],
                                    reduxPermissions
                                  );

                                return (
                                  <div className="d-flex">
                                    {canUpdate && (
                                      <Button
                                        color="primary"
                                        size="sm"
                                        className="me-2"
                                        onClick={() => {
                                          console.log("Edit clicked for:", row);
                                          console.log(
                                            "row.isLinkedToOrder:",
                                            row.isLinkedToOrder
                                          );
                                          if (!row.isLinkedToOrder) {
                                            handleEdit(row);
                                          }
                                        }}
                                        disabled={row.isLinkedToOrder}
                                        title={
                                          row.isLinkedToOrder
                                            ? "Cannot edit: Linked to an order"
                                            : "Edit"
                                        }
                                      >
                                        <FiEdit2 size={14} />
                                      </Button>
                                    )}

                                    {canDelete && (
                                      <Button
                                        color="danger"
                                        size="sm"
                                        onClick={() => handleDelete(row)}
                                        disabled={row.isLinkedToOrder}
                                        title={
                                          row.isLinkedToOrder
                                            ? "Cannot delete: Linked to an order"
                                            : "Delete"
                                        }
                                      >
                                        <FaTrash size={14} />
                                      </Button>
                                    )}
                                  </div>
                                );
                              })()}
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

                {campaigns.length > 0 && (
                  <Row className="align-items-center mt-3">
                    <Col md={3} className="d-flex align-items-center">
                      <span className="me-2">Show:</span>
                      <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
                        <DropdownToggle
                          caret
                          color="light"
                          className="py-1 px-2"
                        >
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
              </>
            )}
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default AllCampaigns;
