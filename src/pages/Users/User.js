import React, { useState, useEffect, useRef, useMemo } from "react";
import { useSelector } from "react-redux";
import {
  Badge,
  Card,
  CardBody,
  Container,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Spinner,
} from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import TableContainer from "../../components/Common/TableContainer";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { FaLock, FaUnlock } from "react-icons/fa";
import {
  blockOrUnblockUser as blockUnblockUserService,
  deleteUserById,
  getAllUsers,
  getUserById,
} from "../../services/auth";
import { getAllRoles } from "../../services/roleService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useDeleteConfirmation from "../../components/Modals/DeleteConfirmation";
import useBlockUnblockConfirmation from "../../components/Modals/useBlockUnblockConfirmation";
import UserDetailsModal from "../../components/Modals/UserDetailsModal";
import { debounce } from "lodash";
import { hasAnyPermission } from "../../utils/permissions";

const AllUsers = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedUserType, setSelectedUserType] = useState("All User Type");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 1,
  });

  const { confirmDelete } = useDeleteConfirmation();
  const { confirmBlockUnblock } = useBlockUnblockConfirmation();
  const searchInputRef = useRef(null);
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.Login?.user);
  const reduxPermissions = useSelector(
    (state) => state.Permissions?.permissions
  );
  const canViewAllUsers = hasAnyPermission(currentUser, ["user:get"]);
  const canViewOnlySelf =
    hasAnyPermission(currentUser, ["user:getById"]) && !canViewAllUsers;

  // Fetch data (unchanged)
  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const debouncedFetch = debounce((page, size, search) => {
      fetchData(page, size, search, !!search);
    }, 500);

    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
    debouncedFetch(pagination.currentPage, pagination.pageSize, searchText);

    return () => debouncedFetch.cancel();
  }, [pagination.currentPage, pagination.pageSize, searchText, currentUser]);

  const fetchData = async (
    currentPage,
    pageSize,
    searchText,
    isSearch = false
  ) => {
    try {
      setLoading(true);
      if (isSearch) setSearchLoading(true);

      let usersResponse;
      const [rolesResponse] = await Promise.all([
        getAllRoles({ page: 1, limit: 100, search: "" }),
      ]);

      if (canViewOnlySelf && currentUser?.id) {
        const selfResponse = await getUserById(currentUser.id);
        if (!selfResponse.user)
          throw new Error("User data not found in response");
        usersResponse = {
          success: true,
          data: [selfResponse.user],
          totalItems: 1,
          totalPages: 1,
          currentPage: 1,
        };
      } else if (!canViewOnlySelf) {
        usersResponse = await getAllUsers({
          page: currentPage,
          limit: pageSize,
          search: searchText,
        });
      } else {
        throw new Error("Insufficient permissions to fetch user data");
      }
      if (!usersResponse.success) {
        throw new Error(usersResponse.message || "Failed to fetch users");
      }

      const normalizedRoles = Array.isArray(rolesResponse.data)
        ? rolesResponse.data
        : [];
      setUsers(usersResponse.data || []);
      setPagination((prev) => ({
        ...prev,
        totalItems: usersResponse.totalItems || 0,
        totalPages: usersResponse.totalPages || 1,
        currentPage: usersResponse.currentPage || 1,
      }));
      setRoles(normalizedRoles);
    } catch (error) {
      console.error("Error in fetchData:", error.stack || error.message);
      setError(error.message);
      toast.error(error.message || "Failed to fetch users");
    } finally {
      setLoading(false);
      if (isSearch) setSearchLoading(false);
    }
  };

  const handleSearchInput = (e) => {
    setSearchText(e.target.value);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handleLoginClick = (userId) => {
    navigate(`/user-details/${userId}`);
  };

  const handleEditUser = async (userId) => {
    setLoading(true);
    try {
      const user = await getUserById(userId);
      navigate("/user-register", { state: { user } });
    } catch (err) {
      console.error("Failed to fetch user for edit:", err);
      toast.error("Failed to load user data for editing.");
    } finally {
      setLoading(false);
    }
  };

  const handleBlockOrUnblock = async (userId, isBlocked) => {
    setLoading(true);
    const action = isBlocked ? "unblock" : "block";
    const onConfirm = async () => {
      try {
        await blockUnblockUserService(userId, action);
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId
              ? {
                  ...user,
                  block: action === "block",
                  status: action === "block" ? "blocked" : "active",
                }
              : user
          )
        );
      } catch (error) {
        console.error(`Failed to ${action} user:`, error);
      }
    };
    await confirmBlockUnblock(onConfirm, null, isBlocked, "user");
    setLoading(false);
  };

  const handleDeleteUser = async (userId) => {
    setLoading(true);
    setDeletingId(userId);
    const onConfirm = async () => {
      try {
        await deleteUserById(userId);
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
        setPagination((prev) => ({
          ...prev,
          totalItems: prev.totalItems - 1,
          totalPages: Math.ceil((prev.totalItems - 1) / prev.pageSize),
        }));
      } catch (error) {
        console.error("Delete error:", error);
      }
    };
    const onCancel = () =>
      fetchData(
        pagination.currentPage,
        pagination.pageSize,
        searchText,
        !!searchText
      );
    const confirmed = await confirmDelete(onConfirm, onCancel, "user");
    if (!confirmed) {
      setDeletingId(null);
    }
    setLoading(false);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, currentPage: newPage }));
    }
  };

  const handlePageSizeChange = (newSize) => {
    setPagination((prev) => ({ ...prev, pageSize: newSize, currentPage: 1 }));
  };

  const filteredUsers = useMemo(() => {
    if (!Array.isArray(users)) return [];
    return selectedUserType === "All User Type"
      ? users
      : users.filter(
          (user) =>
            user.role?.name?.toLowerCase() === selectedUserType.toLowerCase()
        );
  }, [users, selectedUserType]);

  const columns = useMemo(
    () => [
      {
        Header: "User Image",
        accessor: "userImage",
        Cell: ({ row }) => {
          const imageUrl = row.original.userImage?.trim()
            ? row.original.userImage
            : "https://randomuser.me/api/portraits/men/1.jpg";
          return (
            <img
              src={imageUrl}
              alt="User"
              width="40"
              height="40"
              style={{
                borderRadius: "50%",
                objectFit: "cover",
                objectPosition: "top",
              }}
            />
          );
        },
        disableFilters: true,
      },
      {
        Header: "First Name",
        accessor: "firstname",
        disableFilters: true,
      },
      {
        Header: "Last Name",
        accessor: "lastname",
        disableFilters: true,
      },
      {
        Header: "Email",
        accessor: "email",
        disableFilters: true,
      },
      {
        Header: "Role",
        accessor: "role.name",
        disableFilters: true,
        Cell: ({ value }) => (
          <Badge color="success" className="text-capitalize">
            {value || "N/A"}
          </Badge>
        ),
      },
      {
        Header: "User Details",
        accessor: "loginLink",
        Cell: ({ row }) => (
          <button
            onClick={() => handleLoginClick(row.original.id)}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              margin: 0,
              color: "#0d6efd",
              cursor: loading ? "not-allowed" : "pointer",
              font: "inherit",
              opacity: loading ? 0.6 : 1,
            }}
            disabled={loading}
          >
            View Details
          </button>
        ),
        disableFilters: true,
      },
      {
        Header: "Status",
        accessor: "status",
        disableFilters: true,
        Cell: ({ value }) => (
          <span
            className={`badge ${
              value === "blocked" ? "bg-danger" : "bg-success"
            }`}
          >
            {value === "blocked" ? "Blocked" : "Active"}
          </span>
        ),
      },
      {
        Header: "Action",
        id: "actions",
        Cell: ({ row }) => {
          const canUpdate =
            (currentUser?.id === row.original.id &&
              hasAnyPermission(
                currentUser,
                ["user:updateById"],
                reduxPermissions
              )) ||
            hasAnyPermission(currentUser, ["user:update"], reduxPermissions);
          const canDelete =
            (currentUser?.id === row.original.id &&
              hasAnyPermission(
                currentUser,
                ["user:deleteById"],
                reduxPermissions
              )) ||
            hasAnyPermission(currentUser, ["user:delete"], reduxPermissions);
          const canBlock =
            (currentUser?.id === row.original.id &&
              hasAnyPermission(
                currentUser,
                ["user:blockById"],
                reduxPermissions
              )) ||
            hasAnyPermission(currentUser, ["user:block"], reduxPermissions);

          return (
            <div className="d-flex">
              {canUpdate && (
                <button
                  className="btn btn-sm btn-primary me-2"
                  title="Edit"
                  onClick={() => handleEditUser(row.original.id)}
                  disabled={loading || deletingId === row.original.id}
                  style={{
                    opacity:
                      loading || deletingId === row.original.id ? 0.6 : 1,
                  }}
                >
                  <FiEdit2 size={14} />
                </button>
              )}
              {canBlock && (
                <button
                  className={`btn btn-sm ${
                    row.original.status === "blocked"
                      ? "btn-danger"
                      : "btn-secondary"
                  } me-2`}
                  title={
                    row.original.status === "blocked"
                      ? "Unblock User"
                      : "Block User"
                  }
                  onClick={() =>
                    handleBlockOrUnblock(
                      row.original.id,
                      row.original.status === "blocked"
                    )
                  }
                  disabled={loading || deletingId === row.original.id}
                  style={{
                    opacity:
                      loading || deletingId === row.original.id ? 0.6 : 1,
                  }}
                >
                  {row.original.status === "blocked" ? (
                    <FaLock size={14} />
                  ) : (
                    <FaUnlock size={14} />
                  )}
                </button>
              )}
              {canDelete && (
                <button
                  className="btn btn-sm btn-danger"
                  title="Delete"
                  onClick={() => handleDeleteUser(row.original.id)}
                  disabled={loading || deletingId === row.original.id}
                  style={{
                    opacity:
                      loading || deletingId === row.original.id ? 0.6 : 1,
                  }}
                >
                  {deletingId === row.original.id ? (
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                    />
                  ) : (
                    <FiTrash2 size={14} />
                  )}
                </button>
              )}
            </div>
          );
        },
        disableFilters: true,
      },
    ],
    [loading, deletingId, reduxPermissions] // Updated dependency
  );

  if (error) {
    return (
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title={canViewOnlySelf ? "MY PROFILE" : "ALL USER"}
            breadcrumbItems={[
              { title: "Dashboard", link: "/" },
              { title: canViewOnlySelf ? "My Profile" : "Users", link: "#" },
              { title: canViewOnlySelf ? "Profile" : "All Users", link: "#" },
            ]}
          />
          <Card>
            <CardBody>
              <div className="alert alert-danger">{error}</div>
            </CardBody>
          </Card>
        </Container>
      </div>
    );
  }

  return (
    <div className="page-content" style={{ position: "relative" }}>
      <Container fluid>
        <Breadcrumbs
          title={canViewOnlySelf ? "MY PROFILE" : "ALL USER"}
          breadcrumbItems={[
            { title: "Dashboard", link: "/" },
            { title: canViewOnlySelf ? "My Profile" : "Users", link: "#" },
            { title: canViewOnlySelf ? "Profile" : "All Users", link: "#" },
          ]}
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

            {!canViewOnlySelf && (
              <div
                className="mb-3 d-flex justify-content-between align-items-center"
                style={{ opacity: loading ? 0.6 : 1 }}
              >
                <Dropdown
                  isOpen={dropdownOpen}
                  toggle={() => setDropdownOpen((prev) => !prev)}
                  disabled={loading}
                >
                  <DropdownToggle
                    caret
                    style={{
                      width: "200px",
                      backgroundColor: "#f8f9fa",
                      borderColor: "#dee2e6",
                      color: "#495057",
                      textAlign: "left",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    {selectedUserType}
                  </DropdownToggle>
                  <DropdownMenu
                    style={{ maxHeight: "200px", overflowY: "auto" }}
                  >
                    <DropdownItem
                      onClick={() => setSelectedUserType("All User Type")}
                    >
                      All User Type
                    </DropdownItem>
                    {roles.map((role) => (
                      <DropdownItem
                        key={role.id}
                        onClick={() => setSelectedUserType(role.name)}
                      >
                        {role.name}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
                <div className="w-25 position-relative">
                  <input
                    ref={searchInputRef}
                    type="text"
                    className="form-control"
                    placeholder="Search users..."
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
            )}

            <TableContainer
              columns={columns}
              data={filteredUsers}
              isPagination={true}
              iscustomPageSize={false}
              isBordered={false}
              customPageSize={pagination.pageSize}
              pagination={pagination}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              className="custom-header-css"
            />
          </CardBody>
        </Card>
      </Container>

      <UserDetailsModal
        isOpen={isModalOpen}
        toggle={() => setIsModalOpen((prev) => !prev)}
        user={selectedUser}
      />
    </div>
  );
};

export default AllUsers;
