import { Badge, Button, Card, CardBody, Container, Spinner } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import TableContainer from "../../components/Common/TableContainer";
import { FaTrash } from "react-icons/fa";
import { FiEdit2 } from "react-icons/fi";
import { useMemo, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { deleteRole, getAllRoles } from "../../services/roleService";
import useDeleteConfirmation from "../../components/Modals/DeleteConfirmation";
import { debounce } from "lodash";

const AllRole = () => {
  // State management
  const [allRoles, setAllRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 1,
  });

  const { confirmDelete } = useDeleteConfirmation();
  const searchInputRef = useRef(null);
  const navigate = useNavigate();

  const fetchRoles = async (currentPage, pageSize, searchText) => {
    try {
      setLoading(true);
      setSearchLoading(true);
      const response = await getAllRoles({
        page: currentPage,
        limit: pageSize,
        search: searchText,
      });

      if (!response.success) {
        throw new Error(response.message || "Failed to fetch roles");
      }

      setAllRoles(response.data || []);
      setPagination((prev) => ({
        ...prev,
        totalItems: response.totalItems,
        totalPages: response.totalPages,
        currentPage: response.currentPage,
      }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setSearchLoading(false);
    }
  };

  useEffect(() => {
    const debouncedFetch = debounce(fetchRoles, 500);
    debouncedFetch(pagination.currentPage, pagination.pageSize, searchText);
    return () => debouncedFetch.cancel();
  }, [pagination.currentPage, pagination.pageSize, searchText]);

  const handleSearchInput = (e) => {
    setSearchText(e.target.value);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handleEdit = (role) => {
    navigate("/create-role", { state: { role } });
  };

  const handleDelete = (id) => {
    setDeletingId(id);
    confirmDelete(
      async () => {
        try {
          const response = await deleteRole(id);
          if (!response.success) {
            throw new Error(response.message || "Failed to delete role.");
          }
          return true;
        } catch (error) {
          console.error("Delete error:", error);
          return false;
        } finally {
          setDeletingId(null);
        }
      },
      () => {
        fetchRoles(pagination.currentPage, pagination.pageSize, searchText);
      },
      "role"
    );
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

  const columns = useMemo(
    () => [
      {
        Header: "ID",
        accessor: (_row, i) =>
          (pagination.currentPage - 1) * pagination.pageSize + i + 1,
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
          const visiblePermissions = showAll ? value : value?.slice(0, 5) || [];
          const remainingCount = value?.length - 5 || 0;

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
    [pagination.currentPage, pagination.pageSize, deletingId]
  );

  const breadcrumbItems = [
    { title: "Dashboard", link: "/" },
    { title: "Role", link: "#" },
    { title: "All Roles", link: "#" },
  ];

  if (error) {
    return (
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="All ROLES" breadcrumbItems={breadcrumbItems} />
          <Card>
            <CardBody>
              <div className="alert alert-danger">Error: {error}</div>
            </CardBody>
          </Card>
        </Container>
      </div>
    );
  }

  return (
    <div className="page-content" style={{ position: "relative" }}>
      <Container fluid>
        <Breadcrumbs title="All ROLES" breadcrumbItems={breadcrumbItems} />
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
            <div
              className="d-flex justify-content-between align-items-center mb-3"
              style={{ opacity: loading ? 0.6 : 1 }}
            >
              <h4 className="card-title mb-0">Role Management</h4>
              <div className="w-25 position-relative">
                <input
                  ref={searchInputRef}
                  type="text"
                  className="form-control"
                  placeholder="Search roles..."
                  onChange={handleSearchInput}
                  value={searchText}
                />
                {searchLoading && (
                  <div className="position-absolute top-50 end-0 translate-middle-y me-2">
                    <div
                      className="spinner-border spinner-border-sm"
                      role="status"
                    >
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <TableContainer
              columns={columns || []}
              data={allRoles || []}
              isPagination={true}
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
    </div>
  );
};

export default AllRole;
