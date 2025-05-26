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
import { FaUnlock } from "react-icons/fa";
import { deleteUserById, getAllUsers, getUserById } from "../../services/auth";
import TableContainer from "../../components/Common/TableContainer";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import UserDetailsModal from "../../components/Modals/UserDetailsModal";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AllUsers = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedUserType, setSelectedUserType] = useState("All User Type");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();

  const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);
  const toggleModal = () => setIsModalOpen((prev) => !prev);

  // const hasPermission = (actionName) => {
  //   const currentUser = JSON.parse(localStorage.getItem("authUser"));
  //   return currentUser?.role?.permissions?.some(
  //     (perm) => perm.name === actionName
  //   );
  // };
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await getAllUsers();
        setUsers(usersData);
        console.log("all user", usersData);
      } catch (error) {
        setError(error.message);
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleLoginClick = async (userId) => {
    try {
      const response = await getUserById(userId);
      const userData = response.user;
      setSelectedUser(userData);
      setIsModalOpen(true);
      console.log("Specific user details", userData);
    } catch (err) {
      console.error("Failed to fetch user:", err);
    }
  };

  const handleEditUser = async (userId) => {
    // if (!hasPermission("user:update")) {
    //   toast.error("You do not have permission to edit users.");
    //   return;
    // }
    try {
      const user = await getUserById(userId);
      console.log("User data for edit:", user);
      toast.success("User Edited successfully");
      navigate("/user-register", { state: { user } });
    } catch (err) {
      console.error("Failed to fetch user for edit:", err);
      toast.error("Failed to load user data for editing.");
    }
  };

  const handleDeleteUser = async (userId) => {
    // if (!hasPermission("user:delete")) {
    //   toast.error("You do not have permission to delete users.");
    //   return;
    // }
    try {
      const message = await deleteUserById(userId);
      console.log("deleting user", message);
      toast.success(message);
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    } catch (error) {
      toast.error("Failed to delete user: " + error.message);
    }
  };

  const filteredUsers = useMemo(() => {
    if (selectedUserType === "All User Type") return users;
    return users.filter(
      (user) => user.userrole === selectedUserType.toLowerCase()
    );
  }, [users, selectedUserType]);

  const columns = useMemo(
    () => [
      {
        Header: "UserImage",
        accessor: "useruimage",
        Cell: () => (
          <img
            src={"https://randomuser.me/api/portraits/men/1.jpg"}
            alt="User"
            width="40"
            height="40"
            style={{ borderRadius: "50%" }}
          />
        ),
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
          <Badge
            color={
              value === "admin"
                ? "primary"
                : value === "vendor"
                ? "success"
                : "info"
            }
            className="text-capitalize"
          >
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
              cursor: "pointer",
              font: "inherit",
            }}
          >
            User Detail
          </button>
        ),
        disableFilters: true,
      },
      {
        Header: "Status",
        accessor: "block",
        disableFilters: true,
        Cell: ({ value }) => (
          <span className={`badge ${value ? "bg-danger" : "bg-success"}`}>
            {value ? "Blocked" : "Active"}
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
              // disabled={!hasPermission("edit_user")}
            >
              <FiEdit2 size={14} />
            </button>
            <button
              className="btn btn-sm btn-secondary me-2"
              title="Unlock"
              onClick={() => console.log("Unlock user:", row.original.id)}
            >
              <FaUnlock size={14} />
            </button>
            <button
              className="btn btn-sm btn-danger"
              title="Delete"
              onClick={() => handleDeleteUser(row.original.id)}
            >
              <FiTrash2 size={14} />
            </button>
          </div>
        ),
        disableFilters: true,
      },
    ],
    []
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
              <div className="text-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p>Loading users...</p>
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
            <CardBody>
              <div className="mb-3 d-flex align-items-center border-black">
                <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
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
                    style={{
                      width: "200px",
                      backgroundColor: "#f8f9fa",
                      borderColor: "#dee2e6",
                    }}
                  >
                    {["All User Type", "Vendor", "Client", "Admin"].map(
                      (type) => (
                        <DropdownItem
                          key={type}
                          onClick={() => setSelectedUserType(type)}
                          style={{
                            backgroundColor:
                              selectedUserType === type
                                ? "#e9ecef"
                                : "transparent",
                          }}
                        >
                          {type}
                        </DropdownItem>
                      )
                    )}
                  </DropdownMenu>
                </Dropdown>
              </div>

              <TableContainer
                columns={columns}
                data={filteredUsers}
                isPagination
                iscustomPageSize
                isBordered={false}
                customPageSize={10}
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
