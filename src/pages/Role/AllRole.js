import { Badge, Button, Card, CardBody, Container } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import TableContainer from "../../components/Common/TableContainer";
import { FaTrash } from "react-icons/fa";
import { FiEdit2 } from "react-icons/fi";
import { useMemo, useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../services/auth";
import { useNavigate } from "react-router-dom";

const AllRole = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch(`${API_URL}/all`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setRoles(data.roles);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);

  const handleEdit = (role) => {
    navigate("/create-role", {
      state: {
        role: {
          id: role.id,
          name: role.name,
          Permissions: role.Permissions,
        },
      },
    });
  };
  const breadcrumbItems = [
    { title: "Dashboard", link: "/" },
    { title: "All Roles", link: "#" },
  ];

  const columns = useMemo(() => [
    {
      Header: "ID",
      accessor: (_row, i) => i + 1,
      disableFilters: true,
      width: 70,
    },
    {
      Header: "Role Name",
      accessor: "name",
      disableFilters: true,
      width: 120,
    },

    {
      Header: "Permissions",
      accessor: "Permissions",
      disableFilters: true,
      Cell: ({ value }) => (
        <div style={{ maxWidth: "300px" }}>
          {value && value.length > 0 ? (
            value.map((permission) => (
              <Badge color="info" className="me-1 mb-1" key={permission.id}>
                {permission.name}
              </Badge>
            ))
          ) : (
            <Badge color="secondary">No permissions</Badge>
          )}
        </div>
      ),
    },
    {
      Header: "Status",
      accessor: "status",
      disableFilters: true,
      Cell: () => <Badge color="success">Active</Badge>,
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
  ]);

  const handleDelete = async (roleId) => {
    if (window.confirm("Are you sure you want to delete this role?")) {
      try {
        await axios.delete(`/api/roles/${roleId}`);
        setRoles(roles.filter((role) => role.id !== roleId));
      } catch (err) {
        console.error("Error deleting role:", err);
        alert("Failed to delete role");
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="All ROLES" breadcrumbItems={breadcrumbItems} />

          <Card>
            <CardBody>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="d-flex align-items-center">
                  <span className="me-2">Show</span>
                  <select
                    className="form-select form-select-sm"
                    style={{ width: "80px" }}
                  >
                    <option>10</option>
                    <option>25</option>
                    <option>50</option>
                    <option>100</option>
                  </select>
                  <span className="ms-2">entries</span>
                </div>
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
                iscustomPageSize={true}
                isBordered={false}
                customPageSize={20}
                className="custom-table"
              />
            </CardBody>
          </Card>
        </Container>
      </div>
    </>
  );
};

export default AllRole;
