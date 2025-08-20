// import React, { useMemo, useEffect, useState, useCallback } from "react";
// import { Container, Card, CardBody, Spinner, Button } from "reactstrap";
// import { FiTrash2 } from "react-icons/fi";
// import TableContainer from "../../components/Common/TableContainer";
// import Breadcrumbs from "../../components/Common/Breadcrumb";
// import { fetchSales, deleteSaleById } from "../../services/productService";
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";

// const Sale = () => {
//   const [sales, setSales] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [pagination, setPagination] = useState({
//     pageIndex: 1,
//     pageSize: 10,
//     totalRecords: 0,
//   });

//   const navigate = useNavigate();

//   const getSales = useCallback(async () => {
//     setIsLoading(true);
//     try {
//       const response = await fetchSales({
//         page: pagination.pageIndex,
//         limit: pagination.pageSize,
//       });

//       console.log("Fetched sales data:", response);

//       const records = Array.isArray(response) ? response : [];
//       setSales(records);
//       setPagination((prev) => ({
//         ...prev,
//         totalRecords: records.length,
//       }));
//     } catch (error) {
//       console.error("Failed to fetch sales:", error.message);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [pagination.pageIndex, pagination.pageSize]);

//   useEffect(() => {
//     getSales();
//   }, [getSales]);

//   const handlePageChange = (newPage) => {
//     setPagination((prev) => ({ ...prev, pageIndex: newPage }));
//   };

//   const handlePageSizeChange = (newSize) => {
//     setPagination((prev) => ({
//       ...prev,
//       pageSize: newSize,
//       pageIndex: 1,
//     }));
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this sale?")) return;

//     try {
//       await deleteSaleById(id);
//       toast.success("Sale deleted successfully");
//       getSales(); // Refresh after delete
//     } catch (error) {
//       console.error("Delete error:", error.message);
//       toast.error(`Failed to delete sale: ${error.message}`);
//     }
//   };

//   const navigateToSale = (id) => {
//     navigate(`/sale-details/${id}`);
//   };
//   const renderClickableCell = (row, value, formatter) => {
//     return (
//       <div
//         style={{ cursor: "pointer" }}
//         onClick={() => navigateToSale(row.original.id)}
//       >
//         {formatter ? formatter(value) : value || "N/A"}
//       </div>
//     );
//   };

//   const columns = useMemo(
//     () => [
//       {
//         Header: "Product Type",
//         accessor: "productType",
//         disableFilters: true,
//         Cell: ({ row, value }) => renderClickableCell(row, value),
//       },
//       {
//         Header: "Price",
//         accessor: "price",
//         disableFilters: true,
//         Cell: ({ row, value }) =>
//           renderClickableCell(
//             row,
//             value,
//             (v) => `$${parseFloat(v || 0).toFixed(2)}`
//           ),
//       },
//       {
//         Header: "Status",
//         accessor: "status",
//         disableFilters: true,
//         Cell: ({ row, value }) =>
//           renderClickableCell(row, value, (v) => (
//             <span
//               className={`badge text-uppercase ${
//                 v === "converted"
//                   ? "bg-success"
//                   : v === "pending"
//                   ? "bg-warning"
//                   : "bg-danger"
//               }`}
//             >
//               {v}
//             </span>
//           )),
//       },
//       {
//         Header: "Lead Campaign",
//         accessor: "Lead.campaignName",
//         disableFilters: true,
//         Cell: ({ row, value }) => renderClickableCell(row, value),
//       },
//       {
//         Header: "Created By",
//         accessor: "User.firstname",
//         disableFilters: true,
//         Cell: ({ row, value }) => renderClickableCell(row, value),
//       },
//       {
//         Header: "Conversion Date",
//         accessor: "conversionDate",
//         disableFilters: true,
//         Cell: ({ row, value }) =>
//           renderClickableCell(row, value, (v) =>
//             v ? new Date(v).toLocaleDateString() : "N/A"
//           ),
//       },
//       {
//         Header: "Action",
//         disableFilters: true,
//         Cell: ({ row }) => (
//           <div className="d-flex gap-2">
//             <Button
//               color="danger"
//               size="sm"
//               className="px-2 py-1"
//               onClick={(e) => {
//                 e.stopPropagation(); // prevent row click
//                 handleDelete(row.original.id);
//               }}
//               title="Delete"
//             >
//               <FiTrash2 size={14} />
//             </Button>
//           </div>
//         ),
//       },
//     ],
//     []
//   );

//   const breadcrumbItems = [
//     { title: "Dashboard", link: "/" },
//     { title: "Sales", link: "#" },
//   ];

//   return (
//     <div className="page-content">
//       <Container fluid>
//         <Breadcrumbs title="Sales" breadcrumbItems={breadcrumbItems} />
//         <Card>
//           <CardBody>
//             {isLoading ? (
//               <div className="text-center py-5">
//                 <Spinner color="primary" />
//               </div>
//             ) : (
//               <TableContainer
//                 columns={columns}
//                 data={sales}
//                 isPagination={true}
//                 iscustomPageSize={false}
//                 isBordered={false}
//                 customPageSize={pagination.pageSize}
//                 pagination={{
//                   pageIndex: pagination.pageIndex,
//                   pageSize: pagination.pageSize,
//                   totalRecords: pagination.totalRecords,
//                 }}
//                 onPageChange={handlePageChange}
//                 onPageSizeChange={handlePageSizeChange}
//                 className="custom-table"
//               />
//             )}
//           </CardBody>
//         </Card>
//       </Container>
//     </div>
//   );
// };

// export default Sale;

// import React, { useMemo, useEffect, useState, useCallback } from "react";
// import { Container, Card, CardBody, Spinner, Button } from "reactstrap";
// import { FiTrash2 } from "react-icons/fi";
// import TableContainer from "../../components/Common/TableContainer";
// import Breadcrumbs from "../../components/Common/Breadcrumb";
// import {
//   fetchSales,
//   deleteSaleById,
//   fetchSaleById,
// } from "../../services/productService";
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";
// import { hasAnyPermission, isAdmin } from "../../utils/permissions";

// const Sale = () => {
//   const [sales, setSales] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [pagination, setPagination] = useState({
//     pageIndex: 1,
//     pageSize: 10,
//     totalRecords: 0,
//   });

//   const currentUser = useSelector((state) => state.Login?.user);

//   const navigate = useNavigate();

//   const getSales = useCallback(async () => {
//     setIsLoading(true);
//     try {
//       if (!currentUser) {
//         toast.error("User information not available");
//         setSales([]);
//         return;
//       }

//       let response;

//       const hasGetAllPermission = hasAnyPermission(currentUser, [
//         "PRODUCT_SALE_GET_ALL",
//       ]);
//       const hasGetByIdPermission = hasAnyPermission(currentUser, [
//         "PRODUCT_SALE_GET_BY_ID",
//       ]);

//       if (isAdmin(currentUser) || hasGetAllPermission) {
//         response = await fetchSales({
//           page: pagination.pageIndex,
//           limit: pagination.pageSize,
//         });
//       } else if (hasGetByIdPermission) {
//         if (!currentUser.id) {
//           throw new Error("User ID not available");
//         }

//         // Fetch sale by user ID
//         response = await fetchSaleById(currentUser.id);

//         // Handle case when no sale is found for this user
//         if (!response) {
//           toast.info("No sales found for your account");
//           response = [];
//         } else {
//           // Convert to array for table compatibility
//           response = [response];
//         }
//       } else {
//         toast.error("You don't have permission to view sales");
//         response = [];
//       }

//       const records = Array.isArray(response) ? response : [];
//       setSales(records);
//       setPagination((prev) => ({
//         ...prev,
//         totalRecords: records.length,
//       }));
//     } catch (error) {
//       console.error("Failed to fetch sales:", error.message);
//       toast.error(error.message);
//       setSales([]);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [pagination.pageIndex, pagination.pageSize, currentUser]);
//   useEffect(() => {
//     getSales();
//   }, [getSales]);

//   const handlePageChange = (newPage) => {
//     setPagination((prev) => ({ ...prev, pageIndex: newPage }));
//   };

//   const handlePageSizeChange = (newSize) => {
//     setPagination((prev) => ({
//       ...prev,
//       pageSize: newSize,
//       pageIndex: 1,
//     }));
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this sale?")) return;

//     try {
//       await deleteSaleById(id);
//       toast.success("Sale deleted successfully");
//       getSales(); // Refresh after delete
//     } catch (error) {
//       console.error("Delete error:", error.message);
//       toast.error(`Failed to delete sale: ${error.message}`);
//     }
//   };

//   const navigateToSale = (id) => {
//     navigate(`/sale-details/${id}`);
//   };
//   const renderClickableCell = (row, value, formatter) => {
//     return (
//       <div
//         style={{ cursor: "pointer" }}
//         onClick={() => navigateToSale(row.original.id)}
//       >
//         {formatter ? formatter(value) : value || "N/A"}
//       </div>
//     );
//   };

//   const columns = useMemo(
//     () => [
//       {
//         Header: "Product Type",
//         accessor: "productType",
//         disableFilters: true,
//         Cell: ({ row, value }) => renderClickableCell(row, value),
//       },
//       {
//         Header: "Price",
//         accessor: "price",
//         disableFilters: true,
//         Cell: ({ row, value }) =>
//           renderClickableCell(
//             row,
//             value,
//             (v) => `$${parseFloat(v || 0).toFixed(2)}`
//           ),
//       },
//       {
//         Header: "Status",
//         accessor: "status",
//         disableFilters: true,
//         Cell: ({ row, value }) =>
//           renderClickableCell(row, value, (v) => (
//             <span
//               className={`badge text-uppercase ${
//                 v === "converted"
//                   ? "bg-success"
//                   : v === "pending"
//                   ? "bg-warning"
//                   : "bg-danger"
//               }`}
//             >
//               {v}
//             </span>
//           )),
//       },
//       {
//         Header: "Lead Campaign",
//         accessor: "Lead.campaignName",
//         disableFilters: true,
//         Cell: ({ row, value }) => renderClickableCell(row, value),
//       },
//       {
//         Header: "Created By",
//         accessor: "User.firstname",
//         disableFilters: true,
//         Cell: ({ row, value }) => renderClickableCell(row, value),
//       },
//       {
//         Header: "Conversion Date",
//         accessor: "conversionDate",
//         disableFilters: true,
//         Cell: ({ row, value }) =>
//           renderClickableCell(row, value, (v) =>
//             v ? new Date(v).toLocaleDateString() : "N/A"
//           ),
//       },
//       {
//         Header: "Action",
//         disableFilters: true,
//         Cell: ({ row }) => (
//           <div className="d-flex gap-2">
//             <Button
//               color="danger"
//               size="sm"
//               className="px-2 py-1"
//               onClick={(e) => {
//                 e.stopPropagation(); // prevent row click
//                 handleDelete(row.original.id);
//               }}
//               title="Delete"
//             >
//               <FiTrash2 size={14} />
//             </Button>
//           </div>
//         ),
//       },
//     ],
//     []
//   );

//   const breadcrumbItems = [
//     { title: "Dashboard", link: "/" },
//     { title: "Sales", link: "#" },
//   ];

//   return (
//     <div className="page-content">
//       <Container fluid>
//         <Breadcrumbs title="Sales" breadcrumbItems={breadcrumbItems} />
//         <Card>
//           <CardBody>
//             {isLoading ? (
//               <div className="text-center py-5">
//                 <Spinner color="primary" />
//               </div>
//             ) : (
//               <TableContainer
//                 columns={columns}
//                 data={sales}
//                 isPagination={true}
//                 iscustomPageSize={false}
//                 isBordered={false}
//                 customPageSize={pagination.pageSize}
//                 pagination={{
//                   pageIndex: pagination.pageIndex,
//                   pageSize: pagination.pageSize,
//                   totalRecords: pagination.totalRecords,
//                 }}
//                 onPageChange={handlePageChange}
//                 onPageSizeChange={handlePageSizeChange}
//                 className="custom-table"
//               />
//             )}
//           </CardBody>
//         </Card>
//       </Container>
//     </div>
//   );
// };

// export default Sale;

// src/pages/Sales/index.js

// import React, { useMemo, useEffect, useState, useCallback } from "react";
// import { Container, Card, CardBody, Spinner, Button, Badge } from "reactstrap";
// import { FiTrash2 } from "react-icons/fi";
// import TableContainer from "../../components/Common/TableContainer";
// import Breadcrumbs from "../../components/Common/Breadcrumb";
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";
// import { deleteSaleById, getAllSales } from "../../services/productService";
// import { isAdmin } from "../../utils/permissions";

// const Sale = () => {
//   const [sales, setSales] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [pagination, setPagination] = useState({
//     pageIndex: 1,
//     pageSize: 10,
//     totalRecords: 0,
//   });
//   const [isAdminUser, setIsAdminUser] = useState(false);

//   const navigate = useNavigate();

//   useEffect(() => {
//     const user = JSON.parse(localStorage.getItem("authUser"));
//     setIsAdminUser(isAdmin(user));
//   }, []);

//   const getSales = useCallback(async () => {
//     setIsLoading(true);
//     try {
//       const response = await getAllSales({
//         page: pagination.pageIndex,
//         limit: pagination.pageSize,
//       });

//       console.log("Fetched sales data:", response);

//       // Normalize the response data
//       let records = [];
//       if (Array.isArray(response)) {
//         records = response;
//       } else if (response && Array.isArray(response.data)) {
//         records = response.data;
//       } else if (response && response.success && Array.isArray(response.data)) {
//         records = response.data;
//       }

//       setSales(records);
//       setPagination((prev) => ({
//         ...prev,
//         totalRecords: records.length,
//         // If API returns total count, use that instead:
//         // totalRecords: response.totalCount || records.length,
//       }));
//     } catch (error) {
//       console.error("Failed to fetch sales:", error.message);
//       toast.error(`Failed to fetch sales: ${error.message}`);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [pagination.pageIndex, pagination.pageSize, isAdminUser]);

//   useEffect(() => {
//     getSales();
//   }, [getSales]);

//   const handlePageChange = (newPage) => {
//     setPagination((prev) => ({ ...prev, pageIndex: newPage }));
//   };

//   const handlePageSizeChange = (newSize) => {
//     setPagination((prev) => ({
//       ...prev,
//       pageSize: newSize,
//       pageIndex: 1,
//     }));
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this sale?")) return;

//     try {
//       await deleteSaleById(id);
//       toast.success("Sale deleted successfully");
//       getSales(); // Refresh after delete
//     } catch (error) {
//       console.error("Delete error:", error.message);
//       toast.error(`Failed to delete sale: ${error.message}`);
//     }
//   };

//   const navigateToSale = (id) => {
//     navigate(`/sale-details/${id}`);
//   };

//   const renderClickableCell = (row, value, formatter) => {
//     return (
//       <div
//         style={{ cursor: "pointer" }}
//         onClick={() => navigateToSale(row.original.id)}
//       >
//         {formatter ? formatter(value) : value || "N/A"}
//       </div>
//     );
//   };

//   const columns = useMemo(
//     () => [
//       {
//         Header: "Product Type",
//         accessor: "productType",
//         disableFilters: true,
//         Cell: ({ row, value }) => renderClickableCell(row, value),
//       },
//       {
//         Header: "Price",
//         accessor: "price",
//         disableFilters: true,
//         Cell: ({ row, value }) =>
//           renderClickableCell(
//             row,
//             value,
//             (v) => `$${parseFloat(v || 0).toFixed(2)}`
//           ),
//       },
//       {
//         Header: "Status",
//         accessor: "status",
//         disableFilters: true,
//         Cell: ({ row, value }) =>
//           renderClickableCell(row, value, (v) => (
//             <Badge
//               className={`text-uppercase ${
//                 v === "converted"
//                   ? "bg-success"
//                   : v === "pending"
//                   ? "bg-warning"
//                   : "bg-danger"
//               }`}
//             >
//               {v}
//             </Badge>
//           )),
//       },
//       ...(isAdminUser
//         ? [
//             {
//               Header: "Lead Campaign",
//               accessor: "Lead.campaignName",
//               disableFilters: true,
//               Cell: ({ row, value }) => renderClickableCell(row, value),
//             },
//             {
//               Header: "Created By",
//               accessor: "User.firstname",
//               disableFilters: true,
//               Cell: ({ row, value }) => renderClickableCell(row, value),
//             },
//           ]
//         : []),
//       {
//         Header: "Conversion Date",
//         accessor: "conversionDate",
//         disableFilters: true,
//         Cell: ({ row, value }) =>
//           renderClickableCell(row, value, (v) =>
//             v ? new Date(v).toLocaleDateString() : "N/A"
//           ),
//       },
//       {
//         Header: "Action",
//         disableFilters: true,
//         Cell: ({ row }) => (
//           <div className="d-flex gap-2">
//             <Button
//               color="danger"
//               size="sm"
//               className="px-2 py-1"
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
//     ],
//     [isAdminUser]
//   );

//   const breadcrumbItems = [
//     { title: "Dashboard", link: "/" },
//     { title: "Sales", link: "#" },
//   ];

//   return (
//     <div className="page-content">
//       <Container fluid>
//         <Breadcrumbs title="Sales" breadcrumbItems={breadcrumbItems} />
//         <Card>
//           <CardBody>
//             {isLoading ? (
//               <div className="text-center py-5">
//                 <Spinner color="primary" />
//               </div>
//             ) : (
//               <TableContainer
//                 columns={columns}
//                 data={sales}
//                 isPagination={true}
//                 iscustomPageSize={false}
//                 isBordered={false}
//                 customPageSize={pagination.pageSize}
//                 pagination={{
//                   pageIndex: pagination.pageIndex,
//                   pageSize: pagination.pageSize,
//                   totalRecords: pagination.totalRecords,
//                 }}
//                 onPageChange={handlePageChange}
//                 onPageSizeChange={handlePageSizeChange}
//                 className="custom-table"
//               />
//             )}
//           </CardBody>
//         </Card>
//       </Container>
//     </div>
//   );
// };

// export default Sale;

import React, { useMemo, useEffect, useState, useCallback } from "react";
import {
  Container,
  Card,
  CardBody,
  Spinner,
  Button,
  Badge,
  UncontrolledTooltip,
} from "reactstrap";
import { FiTrash2 } from "react-icons/fi";
import TableContainer from "../../components/Common/TableContainer";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { deleteSaleById, getAllSales } from "../../services/productService";
import { isAdmin } from "../../utils/permissions";

const Sale = () => {
  const [sales, setSales] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 10,
    totalRecords: 0,
  });
  const [isAdminUser, setIsAdminUser] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("authUser") || "{}");
    setIsAdminUser(isAdmin(user));
  }, []);

  const getSales = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getAllSales({
        page: pagination.pageIndex,
        limit: pagination.pageSize,
      });

      console.log("Raw API response:", JSON.stringify(response, null, 2));

      // Handle both direct array and object with data property
      let records = [];
      let totalItems = 0;
      if (Array.isArray(response)) {
        records = response;
        totalItems = response.length;
      } else if (response.data && Array.isArray(response.data)) {
        records = response.data;
        totalItems = response.totalItems || response.data.length;
      } else {
        throw new Error("Unexpected API response format");
      }

      console.log(
        "Initial records:",
        records.length,
        JSON.stringify(records, null, 2)
      );

      const processedRecords = records.map((sale, index) => {
        let parsedProducts = null;
        let parsedLeadData = {
          first_name: "N/A",
          last_name: "N/A",
          state: "N/A",
          phone_number: "N/A",
          email: "N/A",
        };
        try {
          if (sale.products && typeof sale.products === "string") {
            parsedProducts = JSON.parse(sale.products);
          }
          if (sale.Lead?.leadData && typeof sale.Lead.leadData === "string") {
            parsedLeadData = {
              ...parsedLeadData,
              ...JSON.parse(sale.Lead.leadData),
            };
          }
        } catch (error) {
          console.error(
            `Error parsing JSON for sale ID ${sale.id || index}:`,
            error
          );
          toast.warn(`Invalid data format for sale ID ${sale.id || index}`);
        }
        return {
          ...sale,
          parsedProducts: Array.isArray(parsedProducts) ? parsedProducts : null,
          parsedLeadData,
        };
      });

      console.log(
        "Processed records:",
        JSON.stringify(processedRecords, null, 2)
      );
      setSales(processedRecords);
      setPagination((prev) => ({
        ...prev,
        totalRecords: totalItems,
      }));
    } catch (error) {
      console.error("Failed to fetch sales:", error.message);
      toast.error(`Failed to fetch sales: ${error.message}`);
      setSales([]);
    } finally {
      setIsLoading(false);
      console.log("isLoading set to:", false);
    }
  }, [pagination.pageIndex, pagination.pageSize, isAdminUser]);

  useEffect(() => {
    getSales();
  }, [getSales]);

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, pageIndex: newPage }));
  };

  const handlePageSizeChange = (newSize) => {
    setPagination((prev) => ({
      ...prev,
      pageSize: newSize,
      pageIndex: 1,
    }));
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this sale?")) return;
    try {
      await deleteSaleById(id);
      toast.success("Sale deleted successfully");
      getSales();
    } catch (error) {
      console.error("Delete error:", error.message);
      toast.error(`Failed to delete sale: ${error.message}`);
    }
  };

  const navigateToSale = (id) => {
    navigate(`/sale-details/${id}`);
  };

  const renderClickableCell = (row, value, formatter) => {
    try {
      return (
        <div
          style={{ cursor: "pointer" }}
          onClick={() => navigateToSale(row.original.id)}
        >
          {formatter ? formatter(value) : value || "N/A"}
        </div>
      );
    } catch (error) {
      console.error(
        `Error rendering cell for sale ID ${row.original.id}:`,
        error
      );
      return <div>Error</div>;
    }
  };

  const columns = useMemo(
    () => [
      {
        Header: "Customer",
        accessor: "parsedLeadData",
        disableFilters: true,
        Cell: ({ row, value }) =>
          renderClickableCell(row, value, (v) =>
            v
              ? `${v.first_name || "N/A"} ${v.last_name || "N/A"}`
              : "Unknown Customer"
          ),
      },
      {
        Header: "Product(s)",
        accessor: "productType",
        disableFilters: true,
        Cell: ({ row }) => {
          try {
            const { parsedProducts, productType } = row.original;
            let displayValue = productType || "N/A";
            let tooltipContent = productType || "N/A";
            if (parsedProducts && Array.isArray(parsedProducts)) {
              displayValue = `${parsedProducts.length} Product${
                parsedProducts.length > 1 ? "s" : ""
              }`;
              tooltipContent = parsedProducts
                .map(
                  (p) =>
                    `${p.productType || "N/A"} ($${parseFloat(
                      p.price || 0
                    ).toFixed(2)})`
                )
                .join(", ");
            }
            return (
              <>
                <div
                  id={`products-${row.original.id}`}
                  style={{ cursor: "pointer" }}
                  onClick={() => navigateToSale(row.original.id)}
                >
                  {displayValue}
                </div>
                <UncontrolledTooltip target={`products-${row.original.id}`}>
                  {tooltipContent}
                </UncontrolledTooltip>
              </>
            );
          } catch (error) {
            console.error(
              `Error rendering products for sale ID ${row.original.id}:`,
              error
            );
            return <div>Error</div>;
          }
        },
      },
      {
        Header: "Total Price",
        accessor: "price",
        disableFilters: true,
        Cell: ({ row }) => {
          try {
            const { parsedProducts, price } = row.original;
            let totalPrice = price || 0;
            if (parsedProducts && Array.isArray(parsedProducts)) {
              totalPrice = parsedProducts.reduce(
                (sum, p) => sum + (parseFloat(p.price) || 0),
                0
              );
            }
            return renderClickableCell(
              row,
              totalPrice,
              (v) => `$${parseFloat(v || 0).toFixed(2)}`
            );
          } catch (error) {
            console.error(
              `Error rendering price for sale ID ${row.original.id}:`,
              error
            );
            return <div>Error</div>;
          }
        },
      },
      {
        Header: "Status",
        accessor: "status",
        disableFilters: true,
        Cell: ({ row, value }) =>
          renderClickableCell(row, value, (v) => (
            <Badge
              className={`text-uppercase ${
                v === "converted"
                  ? "bg-success"
                  : v === "pending"
                  ? "bg-warning"
                  : "bg-danger"
              }`}
            >
              {v || "N/A"}
            </Badge>
          )),
      },
      ...(isAdminUser
        ? [
            {
              Header: "Campaign",
              accessor: "Lead.campaignName",
              disableFilters: true,
              Cell: ({ row, value }) =>
                renderClickableCell(row, value || "N/A"),
            },
            {
              Header: "Created By",
              accessor: "User.firstname",
              disableFilters: true,
              Cell: ({ row, value }) =>
                renderClickableCell(row, value || "N/A"),
            },
            {
              Header: "State",
              accessor: "parsedLeadData.state",
              disableFilters: true,
              Cell: ({ row, value }) =>
                renderClickableCell(row, value || "N/A"),
            },
          ]
        : []),
      {
        Header: "Conversion Date",
        accessor: "conversionDate",
        disableFilters: true,
        Cell: ({ row, value }) =>
          renderClickableCell(row, value, (v) =>
            v ? new Date(v).toLocaleDateString() : "N/A"
          ),
      },
      {
        Header: "Action",
        disableFilters: true,
        Cell: ({ row }) => (
          <div className="d-flex gap-2">
            <Button
              color="danger"
              size="sm"
              className="px-2 py-1"
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
    ],
    [isAdminUser]
  );

  const breadcrumbItems = [
    { title: "Dashboard", link: "/" },
    { title: "Sales", link: "#" },
  ];

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs title="Sales" breadcrumbItems={breadcrumbItems} />
        <Card>
          <CardBody>
            {isLoading ? (
              <div className="text-center py-5">
                <Spinner color="primary" />
                <p>Loading sales...</p>
              </div>
            ) : sales.length === 0 ? (
              <div className="text-center py-5">
                <h4>No sales data available</h4>
                <p>
                  Check back later or contact support if this is unexpected.
                </p>
              </div>
            ) : (
              <>
                <TableContainer
                  columns={columns}
                  data={sales}
                  isPagination={true}
                  iscustomPageSize={false}
                  isBordered={false}
                  customPageSize={pagination.pageSize}
                  pagination={{
                    pageIndex: pagination.pageIndex,
                    pageSize: pagination.pageSize,
                    totalRecords: pagination.totalRecords,
                  }}
                  onPageChange={handlePageChange}
                  onPageSizeChange={handlePageSizeChange}
                  className="custom-table"
                />
              </>
            )}
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default Sale;
