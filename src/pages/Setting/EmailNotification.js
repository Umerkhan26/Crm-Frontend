import {
  Card,
  CardBody,
  Container,
  Row,
  Col,
  FormGroup,
  Label,
  Input,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Badge,
} from "reactstrap";
import Breadcrumb from "../../components/Common/Breadcrumb";
import { useEffect, useState } from "react";
import {
  fetchEmailPermissions,
  updateEmailPermission,
} from "../../services/emailService";
import { getAllRoles } from "../../services/roleService";
import { toast } from "react-toastify";

const EmailNotification = () => {
  const breadcrumbItems = [
    { title: "Dashboard", link: "/" },
    { title: "Settings", link: "#" },
    { title: "Email Notification", link: "#" },
  ];

  const [emailPermissions, setEmailPermissions] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [permissions, setPermissions] = useState({});

  // const loadData = async () => {
  //   setLoading(true);
  //   try {
  //     const [rolesResponse, permissionsData] = await Promise.all([
  //       getAllRoles({ page: 1, limit: 100, search: "" }),
  //       fetchEmailPermissions(),
  //     ]);

  //     const rolesData = Array.isArray(rolesResponse.data)
  //       ? rolesResponse.data
  //       : [];
  //     setRoles(rolesData);

  //     const fixedPermissionsData = permissionsData.map((perm) => {
  //       let rolesArray =
  //         typeof perm.allowedRoles === "string"
  //           ? JSON.parse(perm.allowedRoles)
  //           : perm.allowedRoles || [];

  //       // Ensure we have role objects (not IDs)
  //       rolesArray = rolesArray
  //         .map((role) =>
  //           typeof role === "number"
  //             ? roles.find((r) => r.id === role) || null
  //             : role
  //         )
  //         .filter(Boolean);

  //       return { ...perm, allowedRoles: rolesArray };
  //     });

  //     setEmailPermissions(fixedPermissionsData);

  //     const initialPermissions = {};
  //     rolesData.forEach((role) => {
  //       initialPermissions[role.id] = {};
  //       fixedPermissionsData.forEach((perm) => {
  //         const rolePermData = fixedPermissionsData.find(
  //           (p) => p.id === perm.id
  //         );
  //         initialPermissions[role.id][perm.id] = {
  //           canSend: rolePermData.canSend || false,
  //           allowedRoles: rolePermData.allowedRoles || [],
  //         };
  //       });
  //     });
  //     setPermissions(initialPermissions);

  //     if (rolesData.length > 0 && !selectedRole) {
  //       setSelectedRole(rolesData[0].id);
  //     }
  //   } catch (error) {
  //     console.error("Failed to load data:", error);
  //     toast.error("Failed to load permissions data");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const loadData = async () => {
    setLoading(true);
    try {
      const [rolesResponse, permissionsData] = await Promise.all([
        getAllRoles({ page: 1, limit: 100, search: "" }),
        fetchEmailPermissions(),
      ]);

      const rolesData = Array.isArray(rolesResponse.data)
        ? rolesResponse.data
        : [];
      setRoles(rolesData);

      const fixedPermissionsData = permissionsData.map((perm) => {
        let rolesArray = [];
        if (
          typeof perm.allowedRoles === "string" &&
          perm.allowedRoles.trim() !== ""
        ) {
          const roleNames = perm.allowedRoles.split(",").map((r) => r.trim());
          rolesArray = roleNames
            .map((name) => roles.find((r) => r.name === name) || null)
            .filter(Boolean);
        }
        return { ...perm, allowedRoles: rolesArray };
      });

      setEmailPermissions(fixedPermissionsData);

      const initialPermissions = {};
      rolesData.forEach((role) => {
        initialPermissions[role.id] = {};
        fixedPermissionsData.forEach((perm) => {
          const rolePermData = fixedPermissionsData.find(
            (p) => p.id === perm.id
          );
          initialPermissions[role.id][perm.id] = {
            canSend: rolePermData.canSend || false,
            allowedRoles: rolePermData.allowedRoles || [],
          };
        });
      });
      setPermissions(initialPermissions);

      if (rolesData.length > 0 && !selectedRole) {
        setSelectedRole(rolesData[0].id);
      }
    } catch (error) {
      console.error("Failed to load data:", error);
      toast.error("Failed to load permissions data");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadData();
  }, []);

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  const handleRoleSelect = (roleId) => {
    if (!selectedRole) return;

    setPermissions((prev) => {
      const updatedPermissions = { ...prev };
      emailPermissions.forEach((perm) => {
        const currentAllowedRoles =
          updatedPermissions[selectedRole][perm.id]?.allowedRoles || [];
        if (!currentAllowedRoles.some((r) => r.id === roleId)) {
          updatedPermissions[selectedRole][perm.id] = {
            ...updatedPermissions[selectedRole][perm.id],
            allowedRoles: [
              ...currentAllowedRoles,
              ...roles.filter((r) => r.id === roleId),
            ],
          };
        }
      });
      return updatedPermissions;
    });
    setDropdownOpen(false);
  };

  const handleRemoveRole = (roleId, permissionId) => {
    setPermissions((prev) => {
      const updatedPermissions = { ...prev };
      emailPermissions.forEach((perm) => {
        updatedPermissions[selectedRole][perm.id] = {
          ...updatedPermissions[selectedRole][perm.id],
          allowedRoles: updatedPermissions[selectedRole][
            perm.id
          ].allowedRoles.filter((r) => r.id !== roleId),
        };
      });
      return updatedPermissions;
    });
  };

  const handleToggle = (permissionId) => {
    if (!selectedRole) return;

    setPermissions((prev) => ({
      ...prev,
      [selectedRole]: {
        ...prev[selectedRole],
        [permissionId]: {
          ...prev[selectedRole][permissionId],
          canSend: !prev[selectedRole][permissionId].canSend,
        },
      },
    }));
  };

  const handleSave = async () => {
    if (!selectedRole) {
      toast.warn("Please select a role first");
      return;
    }

    setSaving(true);
    try {
      const rolePermissions = permissions[selectedRole];

      for (const [permissionId, permData] of Object.entries(rolePermissions)) {
        const permission = emailPermissions.find(
          (p) => p.id === parseInt(permissionId)
        );
        if (!permission) continue;

        // const allowedRoles = permData.allowedRoles || [];

        const response = await updateEmailPermission(permission.serviceName, {
          canSend: permData.canSend,
          allowedRoles: permData.allowedRoles || [],
        });

        console.log("updated email ", response);
      }

      toast.success("Permissions updated successfully!");
      await loadData();
    } catch (error) {
      console.error("Save failed:", error);
      toast.error(`Failed to save: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const filteredRoles = roles.filter((role) =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSelectedRoleName = () => {
    const role = roles.find((r) => r.id === selectedRole);
    return role ? role.name : "Select Role";
  };
  return (
    <div
      className="page-content"
      style={{ height: "100vh", overflowY: "auto", paddingBottom: "80px" }}
    >
      <Container fluid>
        <Breadcrumb
          title="EMAIL NOTIFICATION"
          breadcrumbItems={breadcrumbItems}
        />

        <Card>
          <CardBody style={{ padding: "1rem" }}>
            <Row className="mb-3">
              <Col md={12}>
                <h6 className="fw-bold text-uppercase border-bottom pb-2 mb-3">
                  Role Permissions
                </h6>
                <div className="d-flex align-items-center">
                  <Label className="me-2" for="role-selector">
                    Select Role:
                  </Label>

                  <Dropdown
                    isOpen={dropdownOpen}
                    toggle={toggleDropdown}
                    className="w-50"
                  >
                    <DropdownToggle
                      caret
                      className="d-flex justify-content-between align-items-center"
                    >
                      {getSelectedRoleName()}
                    </DropdownToggle>
                    <DropdownMenu
                      className="w-100"
                      style={{ maxHeight: "250px", overflowY: "auto" }}
                    >
                      <div className="px-3 py-2">
                        <Input
                          type="text"
                          placeholder="Search roles..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      {filteredRoles.map((role) => (
                        <DropdownItem
                          key={role.id}
                          active={selectedRole === role.id}
                          onClick={() => handleRoleSelect(role.id)}
                          style={{ fontSize: "13px", padding: "6px 10px" }}
                        >
                          {role.name}
                          {selectedRole === role.id && (
                            <Badge color="success" className="ms-2">
                              Active
                            </Badge>
                          )}
                        </DropdownItem>
                      ))}
                    </DropdownMenu>
                  </Dropdown>
                </div>
              </Col>
            </Row>

            {selectedRole && (
              <>
                <Row className="mb-3">
                  <Col md={12}>
                    <h6 className="fw-bold mb-3">
                      Email Permissions for:{" "}
                      <span className="text-primary">
                        {getSelectedRoleName()}
                      </span>
                    </h6>
                  </Col>
                </Row>

                <Row>
                  {emailPermissions.map((perm) => (
                    <Col md={4} key={perm.id} className="mb-2">
                      <Card className="h-100" style={{ padding: "0.5rem" }}>
                        <CardBody className="d-flex flex-column p-2">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <h6 className="mb-0" style={{ fontSize: "13px" }}>
                              {perm.serviceName}
                            </h6>
                            <FormGroup switch className="ms-2">
                              <Input
                                type="switch"
                                checked={
                                  permissions[selectedRole]?.[perm.id]
                                    ?.canSend || false
                                }
                                onChange={() => handleToggle(perm.id)}
                              />
                              <Label check style={{ fontSize: "11px" }}>
                                {permissions[selectedRole]?.[perm.id]
                                  ?.canSend ? (
                                  <span className="text-success">Enabled</span>
                                ) : (
                                  <span className="text-danger">Disabled</span>
                                )}
                              </Label>
                            </FormGroup>
                          </div>
                          <div className=" small text-muted">
                            <strong>Allowed Roles:</strong>{" "}
                            {permissions[selectedRole]?.[perm.id]?.allowedRoles
                              ?.length > 0
                              ? permissions[selectedRole][
                                  perm.id
                                ].allowedRoles.map((r) => (
                                  <Badge
                                    key={r.id}
                                    color="secondary"
                                    className="me-2 badge bg-light text-dark"
                                    style={{
                                      cursor: "pointer",
                                      fontSize: "10px",
                                      display: "inline-flex",
                                      alignItems: "center",
                                      gap: "2px",
                                      marginTop: "8px",
                                    }}
                                    onClick={() =>
                                      handleRemoveRole(r.id, perm.id)
                                    }
                                  >
                                    {r.name}{" "}
                                    <span
                                      style={{
                                        color: "red",
                                        fontWeight: "bold",
                                        marginLeft: "2px",
                                      }}
                                    >
                                      &times;
                                    </span>
                                  </Badge>
                                ))
                              : "All roles"}
                          </div>
                        </CardBody>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </>
            )}

            <div className="mt-3 text-end">
              <button
                className="btn btn-primary px-4 py-1"
                style={{ minWidth: "130px", fontSize: "14px" }}
                onClick={handleSave}
                disabled={loading || saving || !selectedRole}
              >
                {saving ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default EmailNotification;
