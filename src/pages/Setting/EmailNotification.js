// import {
//   Card,
//   CardBody,
//   Container,
//   Row,
//   Col,
//   FormGroup,
//   Label,
//   Input,
//   Dropdown,
//   DropdownToggle,
//   DropdownMenu,
//   DropdownItem,
//   Badge,
// } from "reactstrap";
// import Breadcrumb from "../../components/Common/Breadcrumb";
// import { useEffect, useState } from "react";
// import {
//   fetchEmailPermissions,
//   updateEmailPermission,
// } from "../../services/emailService";
// import { getAllRoles } from "../../services/roleService";
// import { toast } from "react-toastify";

// const EmailNotification = () => {
//   const breadcrumbItems = [
//     { title: "Dashboard", link: "/" },
//     { title: "Settings", link: "#" },
//     { title: "Email Notification", link: "#" },
//   ];

//   const [emailPermissions, setEmailPermissions] = useState([]);
//   const [roles, setRoles] = useState([]);
//   const [selectedRole, setSelectedRole] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [permissions, setPermissions] = useState({});

//   useEffect(() => {
//     const loadData = async () => {
//       setLoading(true);
//       try {
//         const rolesResponse = await getAllRoles();
//         const rolesData = Array.isArray(rolesResponse.data)
//           ? rolesResponse.data
//           : [];
//         setRoles(rolesData);

//         const permissionsData = await fetchEmailPermissions();

//         // ✅ Parse allowedRoles if it's a JSON string
//         const fixedPermissionsData = permissionsData.map((perm) => ({
//           ...perm,
//           allowedRoles:
//             typeof perm.allowedRoles === "string"
//               ? JSON.parse(perm.allowedRoles)
//               : perm.allowedRoles,
//         }));

//         setEmailPermissions(fixedPermissionsData);

//         // ✅ Use fixedPermissionsData here:
//         const initialPermissions = {};
//         rolesData.forEach((role) => {
//           initialPermissions[role.id] = {};
//           fixedPermissionsData.forEach((perm) => {
//             initialPermissions[role.id][perm.id] = {
//               canSend: perm.canSend || false,
//               allowedRoles: Array.isArray(perm.allowedRoles)
//                 ? perm.allowedRoles
//                 : [],
//             };
//           });
//         });
//         setPermissions(initialPermissions);

//         if (rolesData.length > 0) {
//           setSelectedRole(rolesData[0].id);
//         }
//       } catch (error) {
//         console.error("Failed to load data:", error);
//         toast.error("Failed to load permissions data");
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadData();
//   }, []);

//   const toggleDropdown = () => setDropdownOpen((prev) => !prev);

//   const handleRoleSelect = (roleId) => {
//     setSelectedRole(roleId);
//     setDropdownOpen(false);

//     setPermissions((prev) => {
//       const updatedPermissions = { ...prev };

//       // Initialize if not exists
//       if (!updatedPermissions[roleId]) {
//         updatedPermissions[roleId] = {};
//       }

//       // Find the selected role object
//       const selectedRoleObj = Array.isArray(roles)
//         ? roles.find((r) => r.id === roleId)
//         : null;

//       // Update all permissions for this role
//       emailPermissions.forEach((perm) => {
//         updatedPermissions[roleId][perm.id] = {
//           canSend: updatedPermissions[roleId][perm.id]?.canSend || false,
//           allowedRoles: [
//             ...(Array.isArray(updatedPermissions[roleId][perm.id]?.allowedRoles)
//               ? updatedPermissions[roleId][perm.id].allowedRoles
//               : []),
//             ...(selectedRoleObj ? [selectedRoleObj] : []),
//           ].filter((r) => r), // Ensure no undefined values
//         };
//       });

//       return updatedPermissions;
//     });
//   };

//   const handleToggle = (permissionId) => {
//     if (!selectedRole) return;

//     setPermissions((prev) => ({
//       ...prev,
//       [selectedRole]: {
//         ...prev[selectedRole],
//         [permissionId]: {
//           ...prev[selectedRole][permissionId],
//           canSend: !prev[selectedRole][permissionId].canSend,
//         },
//       },
//     }));
//   };

//   const handleSave = async () => {
//     if (!selectedRole) {
//       toast.warn("Please select a role first");
//       return;
//     }

//     setSaving(true);
//     try {
//       const rolePermissions = permissions[selectedRole];

//       // First validate all permissions
//       for (const [permissionId, permData] of Object.entries(rolePermissions)) {
//         const permission = emailPermissions.find(
//           (p) => p.id === parseInt(permissionId)
//         );
//         if (!permission) {
//           console.warn(`Permission not found for ID: ${permissionId}`);
//           continue;
//         }

//         const allowedRoles = Array.isArray(permData.allowedRoles)
//           ? permData.allowedRoles
//           : permData.canSend
//           ? [roles.find((r) => r.id === selectedRole)]
//           : [];

//         // Update each permission
//         const response = await updateEmailPermission(permission.serviceName, {
//           canSend: permData.canSend,
//           allowedRoles: allowedRoles.filter((r) => r),
//         });

//         console.log("Response from updateEmailPermission:", response);
//       }

//       toast.success("Permissions updated successfully!");

//       // Force a complete reload of all data
//       await loadData(); // Call the same function used in useEffect
//     } catch (error) {
//       console.error("Save failed:", error);
//       toast.error(`Failed to save: ${error.message}`);
//     } finally {
//       setSaving(false);
//     }
//   };

//   // Extract the data loading logic into a reusable function
//   const loadData = async () => {
//     setLoading(true);
//     try {
//       const [rolesResponse, permissionsData] = await Promise.all([
//         getAllRoles(),
//         fetchEmailPermissions(),
//       ]);

//       const rolesData = Array.isArray(rolesResponse.data)
//         ? rolesResponse.data
//         : [];
//       setRoles(rolesData);

//       const fixedPermissionsData = permissionsData.map((perm) => ({
//         ...perm,
//         allowedRoles:
//           typeof perm.allowedRoles === "string"
//             ? JSON.parse(perm.allowedRoles)
//             : perm.allowedRoles || [],
//       }));

//       setEmailPermissions(fixedPermissionsData);

//       const initialPermissions = {};
//       rolesData.forEach((role) => {
//         initialPermissions[role.id] = {};
//         fixedPermissionsData.forEach((perm) => {
//           initialPermissions[role.id][perm.id] = {
//             canSend: perm.canSend || false,
//             allowedRoles: Array.isArray(perm.allowedRoles)
//               ? perm.allowedRoles
//               : [],
//           };
//         });
//       });

//       setPermissions(initialPermissions);

//       if (rolesData.length > 0 && !selectedRole) {
//         setSelectedRole(rolesData[0].id);
//       }
//     } catch (error) {
//       console.error("Failed to load data:", error);
//       toast.error("Failed to load permissions data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Update useEffect to use the extracted function
//   useEffect(() => {
//     loadData();
//   }, []);

//   const filteredRoles = roles.filter((role) =>
//     role.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const getSelectedRoleName = () => {
//     const role = roles.find((r) => r.id === selectedRole);
//     return role ? role.name : "Select Role";
//   };

//   return (
//     <div className="page-content">
//       <Container fluid>
//         <Breadcrumb
//           title="EMAIL NOTIFICATION"
//           breadcrumbItems={breadcrumbItems}
//         />

//         <Card>
//           <CardBody>
//             <Row className="mb-4">
//               <Col md={12}>
//                 <h5 className="mb-3 fw-bold border-bottom pb-3 text-uppercase">
//                   Role Permissions
//                 </h5>

//                 <div className="d-flex align-items-center mb-4">
//                   <Label className="me-3" for="role-selector">
//                     Select Role:
//                   </Label>

//                   <Dropdown
//                     isOpen={dropdownOpen}
//                     toggle={toggleDropdown}
//                     className="w-50"
//                   >
//                     <DropdownToggle
//                       caret
//                       className="d-flex justify-content-between align-items-center"
//                     >
//                       {getSelectedRoleName()}
//                     </DropdownToggle>
//                     <DropdownMenu
//                       className="w-100"
//                       style={{ maxHeight: "300px", overflowY: "auto" }}
//                     >
//                       <div className="px-3 py-2">
//                         <Input
//                           type="text"
//                           placeholder="Search roles..."
//                           value={searchTerm}
//                           onChange={(e) => setSearchTerm(e.target.value)}
//                           onClick={(e) => e.stopPropagation()}
//                         />
//                       </div>
//                       {filteredRoles.map((role) => (
//                         <DropdownItem
//                           key={role.id}
//                           active={selectedRole === role.id}
//                           onClick={() => handleRoleSelect(role.id)}
//                         >
//                           {role.name}
//                           {selectedRole === role.id && (
//                             <Badge color="success" className="ms-2">
//                               Active
//                             </Badge>
//                           )}
//                         </DropdownItem>
//                       ))}
//                     </DropdownMenu>
//                   </Dropdown>
//                 </div>
//               </Col>
//             </Row>

//             {selectedRole && (
//               <>
//                 <Row className="mb-3">
//                   <Col md={12}>
//                     <h5 className="fw-bold">
//                       Email Permissions for:{" "}
//                       <span className="text-primary">
//                         {getSelectedRoleName()}
//                       </span>
//                     </h5>
//                   </Col>
//                 </Row>

//                 <Row>
//                   {emailPermissions.map((perm) => (
//                     <Col md={4} key={perm.id} className="mb-3">
//                       <Card className="h-100">
//                         <CardBody className="d-flex flex-column">
//                           <div className="d-flex justify-content-between align-items-center mb-2">
//                             <h6 className="mb-0 fw-bold">{perm.serviceName}</h6>
//                             <FormGroup switch className="ms-3">
//                               <Input
//                                 type="switch"
//                                 checked={
//                                   permissions[selectedRole]?.[perm.id]
//                                     ?.canSend || false
//                                 }
//                                 onChange={() => handleToggle(perm.id)}
//                               />
//                               <Label check>
//                                 {permissions[selectedRole]?.[perm.id]
//                                   ?.canSend ? (
//                                   <span className="text-success">Enabled</span>
//                                 ) : (
//                                   <span className="text-danger">Disabled</span>
//                                 )}
//                               </Label>
//                             </FormGroup>
//                           </div>
//                           <div className="mt-2 small text-muted">
//                             <strong>Allowed Roles:</strong>{" "}
//                             {Array.isArray(
//                               permissions[selectedRole]?.[perm.id]?.allowedRoles
//                             )
//                               ? permissions[selectedRole][perm.id].allowedRoles
//                                   .map((r) => r.name)
//                                   .join(", ")
//                               : "All roles"}
//                           </div>
//                         </CardBody>
//                       </Card>
//                     </Col>
//                   ))}
//                 </Row>
//               </>
//             )}

//             <div className="mt-4 text-end">
//               <button
//                 className="btn btn-primary px-5 py-2"
//                 style={{ minWidth: "150px" }}
//                 onClick={handleSave}
//                 disabled={loading || saving || !selectedRole}
//               >
//                 {saving ? (
//                   <>
//                     <span
//                       className="spinner-border spinner-border-sm me-2"
//                       role="status"
//                       aria-hidden="true"
//                     ></span>
//                     Saving...
//                   </>
//                 ) : (
//                   "Save Changes"
//                 )}
//               </button>
//             </div>
//           </CardBody>
//         </Card>
//       </Container>
//     </div>
//   );
// };

// export default EmailNotification;

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

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const rolesResponse = await getAllRoles({
          page: 1,
          limit: 100,
          search: "",
        });
        const rolesData = Array.isArray(rolesResponse.data)
          ? rolesResponse.data
          : [];
        setRoles(rolesData);

        const permissionsData = await fetchEmailPermissions();

        const fixedPermissionsData = permissionsData.map((perm) => ({
          ...perm,
          allowedRoles:
            typeof perm.allowedRoles === "string"
              ? JSON.parse(perm.allowedRoles)
              : perm.allowedRoles || [],
        }));

        setEmailPermissions(fixedPermissionsData);

        const initialPermissions = {};
        rolesData.forEach((role) => {
          initialPermissions[role.id] = {};
          fixedPermissionsData.forEach((perm) => {
            initialPermissions[role.id][perm.id] = {
              canSend: perm.canSend || false,
              allowedRoles: Array.isArray(perm.allowedRoles)
                ? perm.allowedRoles
                : [],
            };
          });
        });
        setPermissions(initialPermissions);

        if (rolesData.length > 0) {
          setSelectedRole(rolesData[0].id);
        }
      } catch (error) {
        console.error("Failed to load data:", error);
        toast.error("Failed to load permissions data");
      } finally {
        setLoading(false);
      }
    };

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
          // Keep allowedRoles unchanged
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
        if (!permission) {
          console.warn(`Permission not found for ID: ${permissionId}`);
          continue;
        }

        // Always send the current allowedRoles, regardless of canSend
        const allowedRoles = permData.allowedRoles || [];

        const response = await updateEmailPermission(permission.serviceName, {
          canSend: permData.canSend,
          allowedRoles: allowedRoles,
        });

        console.log("Updating permission:", {
          serviceName: permission.serviceName,
          canSend: permData.canSend,
          allowedRoles,
        });
        console.log(
          "Response from updateEmailPermission:",
          JSON.stringify(response, null, 2)
        );
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

  const loadData = async () => {
    setLoading(true);
    try {
      const [rolesResponse, permissionsData] = await Promise.all([
        getAllRoles(),
        fetchEmailPermissions(),
      ]);

      const rolesData = Array.isArray(rolesResponse.data)
        ? rolesResponse.data
        : [];
      setRoles(rolesData);

      const fixedPermissionsData = permissionsData.map((perm) => ({
        ...perm,
        allowedRoles:
          typeof perm.allowedRoles === "string"
            ? JSON.parse(perm.allowedRoles)
            : perm.allowedRoles || [],
      }));

      setEmailPermissions(fixedPermissionsData);

      const initialPermissions = {};
      rolesData.forEach((role) => {
        initialPermissions[role.id] = {};
        fixedPermissionsData.forEach((perm) => {
          initialPermissions[role.id][perm.id] = {
            canSend: perm.canSend || false,
            allowedRoles: Array.isArray(perm.allowedRoles)
              ? perm.allowedRoles
              : [],
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

  const filteredRoles = roles.filter((role) =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSelectedRoleName = () => {
    const role = roles.find((r) => r.id === selectedRole);
    return role ? role.name : "Select Role";
  };

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumb
          title="EMAIL NOTIFICATION"
          breadcrumbItems={breadcrumbItems}
        />

        <Card>
          <CardBody>
            <Row className="mb-4">
              <Col md={12}>
                <h5 className="mb-3 fw-bold border-bottom pb-3 text-uppercase">
                  Role Permissions
                </h5>

                <div className="d-flex align-items-center mb-4">
                  <Label className="me-3" for="role-selector">
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
                      style={{ maxHeight: "300px", overflowY: "auto" }}
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
                    <h5 className="fw-bold">
                      Email Permissions for:{" "}
                      <span className="text-primary">
                        {getSelectedRoleName()}
                      </span>
                    </h5>
                  </Col>
                </Row>

                <Row>
                  {emailPermissions.map((perm) => (
                    <Col md={4} key={perm.id} className="mb-3">
                      <Card className="h-100">
                        <CardBody className="d-flex flex-column">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <h6 className="mb-0 fw-bold">{perm.serviceName}</h6>
                            <FormGroup switch className="ms-3">
                              <Input
                                type="switch"
                                checked={
                                  permissions[selectedRole]?.[perm.id]
                                    ?.canSend || false
                                }
                                onChange={() => handleToggle(perm.id)}
                              />
                              <Label check>
                                {permissions[selectedRole]?.[perm.id]
                                  ?.canSend ? (
                                  <span className="text-success">Enabled</span>
                                ) : (
                                  <span className="text-danger">Disabled</span>
                                )}
                              </Label>
                            </FormGroup>
                          </div>
                          <div className="mt-2 small text-muted">
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
                                      gap: "4px",
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

            <div className="mt-4 text-end">
              <button
                className="btn btn-primary px-5 py-2"
                style={{ minWidth: "150px" }}
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
