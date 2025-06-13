// import { Badge, Button, Card, CardBody, Container } from "reactstrap";
// import Breadcrumbs from "../../components/Common/Breadcrumb";
// import TableContainer from "../../components/Common/TableContainer";
// import { FaTrash } from "react-icons/fa";
// import { FiEdit2 } from "react-icons/fi";
// import { useMemo, useEffect, useState } from "react";
// import { API_URL } from "../../services/auth";
// import { useNavigate } from "react-router-dom";
// import { deleteRole } from "../../services/roleService";
// import useDeleteConfirmation from "../../components/Modals/DeleteConfirmation";

// const AllRole = () => {
//   const [roles, setRoles] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchText, setSearchText] = useState("");
//   const [deletingId, setDeletingId] = useState(null);
//   const { confirmDelete } = useDeleteConfirmation();

//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchRoles = async () => {
//       try {
//         const response = await fetch(`${API_URL}/all`);

//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         const data = await response.json();
//         setRoles(data.roles);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRoles();
//   }, []);

//   const handleEdit = (role) => {
//     navigate("/create-role", { state: { role } });
//   };

//   const handleDelete = (id) => {
//     confirmDelete(
//       async () => {
//         const response = await deleteRole(id);
//         if (!response.success)
//           throw new Error(response.message || "Failed to delete role.");
//       },
//       () => {
//         setRoles((prevRoles) => prevRoles.filter((role) => role.id !== id));
//       },
//       "role"
//     );
//   };

//   const breadcrumbItems = [
//     { title: "Dashboard", link: "/" },
//     { title: "Role", link: "#" },
//     { title: "All Roles", link: "#" },
//   ];

//   const columns = useMemo(() => [
//     {
//       Header: "ID",
//       accessor: (_row, i) => i + 1,
//       disableFilters: true,
//     },
//     {
//       Header: "Role Name",
//       accessor: "name",
//       disableFilters: true,
//     },
//     {
//       Header: "Permissions",
//       accessor: "Permissions",
//       disableFilters: true,
//       Cell: ({ value }) => {
//         const [showAll, setShowAll] = useState(false);
//         const visiblePermissions = showAll ? value : value?.slice(0, 3) || [];
//         const remainingCount = value?.length - 3 || 0;

//         return (
//           <div style={{ maxWidth: "auto" }}>
//             {visiblePermissions.length > 0 ? (
//               <>
//                 {visiblePermissions.map((permission) => (
//                   <Badge
//                     color="secondary"
//                     className="me-1 mb-1"
//                     key={permission.id}
//                     style={{ whiteSpace: "nowrap" }}
//                   >
//                     {permission.name}
//                   </Badge>
//                 ))}
//                 {remainingCount > 0 && (
//                   <Button
//                     color="link"
//                     size="sm"
//                     className="p-0 ms-1 text-secondary"
//                     onClick={() => setShowAll(!showAll)}
//                     style={{ whiteSpace: "nowrap" }} // Prevent button text wrapping
//                   >
//                     {showAll ? "Show Less" : `+${remainingCount} more`}
//                   </Button>
//                 )}
//               </>
//             ) : (
//               <Badge color="secondary">No permissions</Badge>
//             )}
//           </div>
//         );
//       },
//     },
//     {
//       Header: "Status",
//       accessor: "status",
//       disableFilters: true,
//       Cell: () => <Badge color="success">Active</Badge>,
//     },
//     {
//       Header: "Action",
//       disableFilters: true,
//       Cell: ({ row }) => (
//         <div className="d-flex gap-2">
//           <Button
//             color="primary"
//             size="sm"
//             className="px-2 py-1"
//             onClick={() => handleEdit(row.original)}
//           >
//             <FiEdit2 size={14} />
//           </Button>
//           <Button
//             color="danger"
//             size="sm"
//             className="px-2 py-1"
//             onClick={() => handleDelete(row.original.id)}
//             disabled={deletingId === row.original.id}
//           >
//             {deletingId === row.original.id ? (
//               <span
//                 className="spinner-border spinner-border-sm"
//                 role="status"
//                 aria-hidden="true"
//               />
//             ) : (
//               <FaTrash size={14} />
//             )}
//           </Button>
//         </div>
//       ),
//     },
//   ]);

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error}</div>;

//   return (
//     <>
//       <div className="page-content">
//         <Container fluid>
//           <Breadcrumbs title="All ROLES" breadcrumbItems={breadcrumbItems} />

//           <Card>
//             <CardBody>
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
//                 columns={columns}
//                 data={roles}
//                 isPagination={true}
//                 iscustomPageSize={true}
//                 isBordered={false}
//                 customPageSize={20}
//                 className="custom-table"
//               />
//             </CardBody>
//           </Card>
//         </Container>
//       </div>
//     </>
//   );
// };

// export default AllRole;

import { Badge, Button, Card, CardBody, Container } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import TableContainer from "../../components/Common/TableContainer";
import { FaTrash } from "react-icons/fa";
import { FiEdit2 } from "react-icons/fi";
import { useMemo, useEffect, useState } from "react";
import { API_URL } from "../../services/auth";
import { useNavigate } from "react-router-dom";
import { deleteRole, getAllRoles } from "../../services/roleService";
import useDeleteConfirmation from "../../components/Modals/DeleteConfirmation";

const AllRole = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const { confirmDelete } = useDeleteConfirmation();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setLoading(true);
        const response = await getAllRoles({
          page: currentPage,
          limit: pageSize,
        });

        if (!response.success) {
          throw new Error(response.message || "Failed to fetch roles");
        }

        console.log("API Response:", response); // Debug the response
        setRoles(response.data);
        setTotalItems(response.totalItems); // Ensure this is set
        setTotalPages(response.totalPages); // Ensure this is set
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, [currentPage, pageSize]);

  const handleEdit = (role) => {
    navigate("/create-role", { state: { role } });
  };

  const handleDelete = (id) => {
    confirmDelete(
      async () => {
        const response = await deleteRole(id);
        if (!response.success)
          throw new Error(response.message || "Failed to delete role.");
      },
      () => {
        setRoles((prevRoles) => prevRoles.filter((role) => role.id !== id));
        // Adjust totalItems and totalPages after deletion
        setTotalItems((prev) => prev - 1);
        setTotalPages(Math.ceil((totalItems - 1) / pageSize));
      },
      "role"
    );
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (e) => {
    setPageSize(parseInt(e.target.value));
    setCurrentPage(1); // Reset to first page when page size changes
  };

  const breadcrumbItems = [
    { title: "Dashboard", link: "/" },
    { title: "Role", link: "#" },
    { title: "All Roles", link: "#" },
  ];

  const columns = useMemo(
    () => [
      {
        Header: "ID",
        accessor: (_row, i) => (currentPage - 1) * pageSize + i + 1, // Adjust ID based on page
        disableFilters: true,
      },
      {
        Header: "Role Name",
        accessor: "name",
        disableFilters: true,
      },
      {
        Header: "Permissions",
        accessor: "Permissions",
        disableFilters: true,
        Cell: ({ value }) => {
          const [showAll, setShowAll] = useState(false);
          const visiblePermissions = showAll ? value : value?.slice(0, 3) || [];
          const remainingCount = value?.length - 3 || 0;

          return (
            <div style={{ maxWidth: "auto" }}>
              {visiblePermissions.length > 0 ? (
                <>
                  {visiblePermissions.map((permission) => (
                    <Badge
                      color="secondary"
                      className="me-1 mb-1"
                      key={permission.id}
                      style={{ whiteSpace: "nowrap" }}
                    >
                      {permission.name}
                    </Badge>
                  ))}
                  {remainingCount > 0 && (
                    <Button
                      color="link"
                      size="sm"
                      className="p-0 ms-1 text-secondary"
                      onClick={() => setShowAll(!showAll)}
                      style={{ whiteSpace: "nowrap" }}
                    >
                      {showAll ? "Show Less" : `+${remainingCount} more`}
                    </Button>
                  )}
                </>
              ) : (
                <Badge color="secondary">No permissions</Badge>
              )}
            </div>
          );
        },
      },
      {
        Header: "Status",
        accessor: "status",
        disableFilters: true,
        Cell: () => <Badge color="success">Active</Badge>,
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
              color="danger"
              size="sm"
              className="px-2 py-1"
              onClick={() => handleDelete(row.original.id)}
              disabled={deletingId === row.original.id}
            >
              {deletingId === row.original.id ? (
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                />
              ) : (
                <FaTrash size={14} />
              )}
            </Button>
          </div>
        ),
      },
    ],
    [currentPage, pageSize, deletingId]
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs title="All ROLES" breadcrumbItems={breadcrumbItems} />
        <Card>
          <CardBody>
            <div className="d-flex justify-content-end align-items-center mb-3">
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
              data={roles}
              isPagination={true}
              isCustomPageSize={true}
              isBordered={false}
              customPageSize={pageSize}
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={handlePageChange}
              className="custom-table"
              totalItems={totalItems}
            />
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default AllRole;
