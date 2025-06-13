import React, { useMemo, useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Container,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Badge,
} from "reactstrap";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { FaLock, FaUnlock } from "react-icons/fa";
import { blockOrUnblockUser as blockUnblockUserService } from "../../services/auth";
import { deleteUserById, getAllUsers, getUserById } from "../../services/auth";
import TableContainer from "../../components/Common/TableContainer";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import UserDetailsModal from "../../components/Modals/UserDetailsModal";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { ClipLoader } from "react-spinners";
import useDeleteConfirmation from "../../components/Modals/DeleteConfirmation";
import { getAllRoles } from "../../services/roleService";
import useBlockUnblockConfirmation from "../../components/Modals/useBlockUnblockConfirmation";

const AllUsers = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedUserType, setSelectedUserType] = useState("All User Type");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    pageSize: 10,
  });
  const { confirmDelete } = useDeleteConfirmation();
  const navigate = useNavigate();
  const { confirmBlockUnblock } = useBlockUnblockConfirmation();
  const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);
  const toggleModal = () => setIsModalOpen((prev) => !prev);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [usersResponse, rolesResponse] = await Promise.all([
          getAllUsers({
            page: pagination.currentPage,
            limit: pagination.pageSize,
          }),
          getAllRoles({
            page: pagination.currentPage,
            limit: pagination.pageSize,
          }),
        ]);

        const normalizedRoles = Array.isArray(rolesResponse)
          ? rolesResponse
          : rolesResponse?.data || [];

        setUsers(usersResponse.data);
        setPagination((prev) => ({
          ...prev,
          totalPages: usersResponse.totalPages || 1,
          totalItems: usersResponse.totalItems || 0,
        }));
        setRoles(normalizedRoles);
      } catch (error) {
        setError(error.message);
        console.error("Error fetching users or roles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [pagination.currentPage, pagination.pageSize]);

  const handleLoginClick = async (userId) => {
    setLoading(true);
    try {
      const response = await getUserById(userId);
      const userData = response.user;
      setSelectedUser(userData);
      setIsModalOpen(true);
    } catch (err) {
      console.error("Failed to fetch user:", err);
      toast.error("Failed to fetch user details.");
    } finally {
      setLoading(false);
    }
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

  const handleBlockOrUnblock = (userId, isBlocked) => {
    const action = isBlocked ? "unblock" : "block";

    const actionFn = async () => {
      setLoading(true);
      try {
        const { message } = await blockUnblockUserService(userId, action);
        // toast.success(message);

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
        toast.error(`Failed to ${action} user: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    confirmBlockUnblock(actionFn, null, isBlocked, "user");
  };
  const handleDeleteUser = async (userId) => {
    await confirmDelete(
      async () => {
        const message = await deleteUserById(userId);
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
        setPagination((prev) => ({
          ...prev,
          totalItems: prev.totalItems - 1,
          totalPages: Math.ceil((prev.totalItems - 1) / prev.pageSize),
        }));
        return message;
      },
      null,
      "user"
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

  const filteredUsers = useMemo(() => {
    if (selectedUserType === "All User Type") return users;
    return users.filter(
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
          <Badge color={"success"} className="text-capitalize">
            {value}
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
            User Detail
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
        Cell: ({ row }) => (
          <div className="d-flex">
            <button
              className="btn btn-sm btn-primary me-2"
              title="Edit"
              onClick={() => handleEditUser(row.original.id)}
              disabled={loading}
              style={{ opacity: loading ? 0.6 : 1 }}
            >
              <FiEdit2 size={14} />
            </button>
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
              disabled={loading}
              style={{ opacity: loading ? 0.6 : 1 }}
            >
              {row.original.status === "blocked" ? (
                <FaLock size={14} />
              ) : (
                <FaUnlock size={14} />
              )}
            </button>
            <button
              className="btn btn-sm btn-danger"
              title="Delete"
              onClick={() => handleDeleteUser(row.original.id)}
              disabled={loading}
              style={{ opacity: loading ? 0.6 : 1 }}
            >
              <FiTrash2 size={14} />
            </button>
          </div>
        ),
        disableFilters: true,
      },
    ],
    [loading]
  );

  const breadcrumbItems = [
    { title: "Dashboard", link: "/" },
    { title: "User", link: "#" },
    { title: "ALL User", link: "#" },
  ];

  if (loading) {
    return (
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="ALL USER" breadcrumbItems={breadcrumbItems} />
          <Card>
            <CardBody>
              <div
                className="d-flex justify-content-center align-items-center"
                style={{ minHeight: "200px" }}
              >
                <ClipLoader
                  color="#5664d2"
                  size={50}
                  loading={loading}
                  aria-label="Loading Spinner"
                />
                <span className="ms-2">Loading users...</span>
              </div>
            </CardBody>
          </Card>
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="ALL USER" breadcrumbItems={breadcrumbItems} />
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
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="ALL USER" breadcrumbItems={breadcrumbItems} />
          <Card>
            <CardBody style={{ overflowX: "auto" }}>
              {loading && (
                <div
                  className="d-flex justify-content-center align-items-center"
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <ClipLoader
                    color="#5664d2"
                    size={40}
                    loading={loading}
                    aria-label="Loading Spinner"
                  />
                  <span className="ms-2">Processing...</span>
                </div>
              )}
              <div
                className="mb-3 d-flex justify-content-between align-items-center border-black"
                style={{ opacity: loading ? 0.6 : 1 }}
              >
                <div className="ms-auto">
                  <Dropdown
                    isOpen={dropdownOpen}
                    toggle={toggleDropdown}
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
                </div>
              </div>

              <TableContainer
                columns={columns}
                data={filteredUsers}
                isPagination={true}
                isCustomPageSize={true}
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
      </div>

      <UserDetailsModal
        isOpen={isModalOpen}
        toggle={toggleModal}
        user={selectedUser}
      />
    </React.Fragment>
  );
};

export default AllUsers;
