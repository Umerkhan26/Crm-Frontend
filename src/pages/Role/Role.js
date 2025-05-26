// import React, { useState, useEffect } from "react";
// import {
//   Container,
//   Card,
//   CardBody,
//   Form,
//   FormGroup,
//   Label,
//   Input,
//   Button,
//   Alert,
//   Badge,
//   Row,
//   Col,
//   CardHeader,
// } from "reactstrap";
// import Breadcrumbs from "../../components/Common/Breadcrumb";
// import { toast } from "react-toastify";
// import { createRole, getAllPermissions } from "../../services/roleService";

// // Permission structure
// const componentPermissions = {
//   Dashboard: {
//     view: false,
//     analytics: false,
//     orders: false,
//   },
//   Users: {
//     view: false,
//     create: false,
//     edit: false,
//     delete: false,
//   },
//   Campaigns: {
//     view: false,
//     create: false,
//     edit: false,
//     delete: false,
//   },
//   Orders: {
//     view: false,
//     create: false,
//     edit: false,
//     delete: false,
//     openOrders: false,
//     completeOrders: false,
//     blockedOrders: false,
//     addLeads: false,
//     importLeads: false,
//   },
//   Leads: {
//     view: false,
//     create: false,
//     edit: false,
//     delete: false,
//     allLeads: false,
//     masterLeads: false,
//     acceptReject: false,
//   },
//   ClientLead: {
//     view: false,
//     create: false,
//     edit: false,
//     delete: false,
//     stateFilter: false,
//   },
//   Referrals: {
//     view: false,
//     create: false,
//     manage: false,
//   },
//   Settings: {
//     view: false,
//     edit: false,
//     permissions: false,
//     EmailTemplates: {
//       view: false,
//       edit: false,
//     },
//     EmailAction: {
//       view: false,
//       edit: false,
//       adminNotifications: false,
//       clientNotifications: false,
//     },
//     Notifications: {
//       view: false,
//       manage: false,
//     },
//     ActivityLogs: {
//       view: false,
//       filter: false,
//       export: false,
//       delete: false,
//     },
//     SystemSettings: {
//       view: false,
//       edit: false,
//       companyInfo: false,
//       appearance: false,
//     },
//   },
// };

// // Mapping from frontend dot notation to backend colon notation
// const permissionMap = {
//   "Users.view": "user:get",
//   "Users.create": "user:create",
//   "Users.edit": "user:update",
//   "Users.delete": "user:delete",

//   // Campaigns
//   "Campaigns.view": "campaign:get",
//   "Campaigns.create": "campaign:create",
//   "Campaigns.edit": "campaign:update",
//   "Campaigns.delete": "campaign:delete",

//   // Orders
//   "Orders.view": "order:get",
//   "Orders.create": "order:create",
//   "Orders.edit": "order:update",
//   "Orders.delete": "order:delete",
// };

// const CreateRole = () => {
//   const [newRoleName, setNewRoleName] = useState("");
//   const [newRolePermissions, setNewRolePermissions] = useState(
//     JSON.parse(JSON.stringify(componentPermissions))
//   );
//   const [permissionsList, setPermissionsList] = useState([]);
//   const [success, setSuccess] = useState(false);
//   const [error, setError] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   // Fetch permissions from backend on component mount
//   useEffect(() => {
//     const fetchPermissions = async () => {
//       try {
//         const result = await getAllPermissions();
//         const permissions = result.data;
//         console.log("All permissions:", permissions);
//         if (!Array.isArray(permissions)) throw new Error("Invalid data format");
//         setPermissionsList(permissions);
//       } catch (err) {
//         console.error("Error fetching permissions:", err);
//         setError("Failed to load permissions. Please try again.");
//         toast.error("Failed to load permissions");
//       }
//     };

//     fetchPermissions();
//   }, []);

//   const handlePermissionToggle = (section, permissionPath) => {
//     const updated = { ...newRolePermissions };
//     let ref = updated[section];

//     for (let i = 0; i < permissionPath.length - 1; i++) {
//       ref = ref[permissionPath[i]];
//     }

//     const last = permissionPath[permissionPath.length - 1];
//     ref[last] = !ref[last];

//     setNewRolePermissions(updated);
//   };

//   const handleSelectAll = (section, permissions) => {
//     const updated = { ...newRolePermissions };

//     const toggleAll = (obj, value) => {
//       for (let key in obj) {
//         if (typeof obj[key] === "object") {
//           toggleAll(obj[key], value);
//         } else {
//           obj[key] = value;
//         }
//       }
//     };

//     const sectionData = updated[section];
//     const allSelected = areAllSelected(sectionData);

//     toggleAll(sectionData, !allSelected);
//     setNewRolePermissions(updated);
//   };

//   const areAllSelected = (permissions) => {
//     const checkAll = (obj) =>
//       Object.values(obj).every((val) =>
//         typeof val === "object" ? checkAll(val) : val
//       );
//     return checkAll(permissions);
//   };

//   const countPermissions = (permissions) => {
//     const countSelected = (obj) =>
//       Object.values(obj).reduce((acc, val) => {
//         if (typeof val === "object") {
//           return acc + countSelected(val);
//         }
//         return acc + (val ? 1 : 0);
//       }, 0);
//     return countSelected(permissions);
//   };

//   const totalPermissions = countPermissions(componentPermissions); // Total possible permissions

//   const flattenPermissions = (permissions) => {
//     const result = [];

//     const traverse = (obj, path = []) => {
//       Object.entries(obj).forEach(([key, value]) => {
//         const currentPath = [...path, key];

//         if (typeof value === "object") {
//           traverse(value, currentPath);
//         } else if (value === true) {
//           const permissionString = currentPath.join(".");
//           const mappedName =
//             permissionMap[permissionString] || permissionString;
//           const permission = permissionsList.find((p) => p.name === mappedName);
//           if (permission) {
//             result.push(permission.id);
//           } else {
//             console.warn(
//               `Permission "${permissionString}" (mapped to "${mappedName}") not found in permissionsList`
//             );
//           }
//         }
//       });
//     };

//     traverse(permissions);
//     console.log("Generated permissionIds:", result);
//     return result;
//   };

//   const handleAddRole = async (e) => {
//     e.preventDefault();
//     if (!newRoleName.trim()) {
//       setError("Role name is required");
//       return;
//     }

//     if (permissionsList.length === 0) {
//       setError("Permissions data not loaded. Please refresh and try again.");
//       return;
//     }

//     setIsLoading(true);
//     setError("");

//     try {
//       const permissionIds = flattenPermissions(newRolePermissions);
//       if (permissionIds.length === 0) {
//         setError("At least one permission must be selected");
//         setIsLoading(false);
//         return;
//       }

//       const payload = { name: newRoleName, permissions: permissionIds };
//       await createRole(payload);
//       console.log("Role Name:", newRoleName);
//       console.log("Selected Permissions Object:", newRolePermissions);
//       console.log("Mapped Permission IDs:", permissionIds);
//       setNewRoleName("");
//       setNewRolePermissions(JSON.parse(JSON.stringify(componentPermissions)));
//       setSuccess(true);
//       toast.success("Role created successfully!");
//     } catch (error) {
//       setError(error.message);
//       toast.error(`Error creating role: ${error.message}`);
//     } finally {
//       setIsLoading(false);
//       setTimeout(() => setSuccess(false), 3000);
//     }
//   };

//   const renderPermissions = (section, permissions, path = []) => {
//     return Object.entries(permissions).map(([key, value]) => {
//       const currentPath = [...path, key];
//       const checkboxId = `${section}-${currentPath.join("-")}`;

//       if (typeof value === "object") {
//         return (
//           <div key={checkboxId} className="ml-3 mb-2 border-left pl-3">
//             <Label className="font-weight-bold d-block text-muted mb-2">
//               {key.replace(/([A-Z])/g, " $1")}
//             </Label>
//             <Row>{renderPermissions(section, value, currentPath)}</Row>
//           </div>
//         );
//       }

//       return (
//         <Col md={4} sm={6} xs={12} key={checkboxId} className="mb-2">
//           <FormGroup check>
//             <Input
//               type="checkbox"
//               id={checkboxId}
//               checked={value}
//               onChange={() => handlePermissionToggle(section, currentPath)}
//               disabled={isLoading}
//             />
//             <Label for={checkboxId} check className="ml-2 font-size-13">
//               {key.charAt(0).toUpperCase() +
//                 key.slice(1).replace(/([A-Z])/g, " $1")}
//             </Label>
//           </FormGroup>
//         </Col>
//       );
//     });
//   };

//   const breadcrumbItems = [
//     { title: "Dashboard", link: "/" },
//     { title: "User Permission", link: "#" },
//   ];

//   return (
//     <div className="page-content">
//       <Container fluid>
//         <Breadcrumbs
//           title="USER PERMISSION"
//           breadcrumbItems={breadcrumbItems}
//         />

//         {success && (
//           <Alert color="success" className="alert-dismissible fade show">
//             <i className="mdi mdi-check-all mr-2"></i>
//             Role created successfully!
//           </Alert>
//         )}
//         {error && (
//           <Alert color="danger" className="alert-dismissible fade show">
//             <i className="mdi mdi-block-helper mr-2"></i>
//             {error}
//           </Alert>
//         )}

//         <Row className="justify-content-center">
//           <Col lg={12}>
//             <Card className="shadow-sm">
//               <CardHeader className="bg-transparent border-bottom">
//                 <h4 className="mb-0">Create New Role</h4>
//               </CardHeader>
//               <CardBody>
//                 <Form onSubmit={handleAddRole}>
//                   <Row>
//                     <Col md={6} lg={4}>
//                       <FormGroup>
//                         <Label for="roleName" className="font-weight-500">
//                           Role Name
//                         </Label>
//                         <Input
//                           type="text"
//                           id="roleName"
//                           value={newRoleName}
//                           onChange={(e) => setNewRoleName(e.target.value)}
//                           placeholder="Enter new role name"
//                           className="form-control-sm"
//                           disabled={isLoading}
//                         />
//                       </FormGroup>
//                     </Col>
//                   </Row>

//                   <div className="d-flex justify-content-between align-items-center mb-3">
//                     <h5 className="mb-0 font-size-16">Permissions</h5>
//                     <Badge color="light" className="text-dark font-size-12">
//                       {countPermissions(newRolePermissions)} of{" "}
//                       {totalPermissions} permissions selected
//                     </Badge>
//                   </div>

//                   <div
//                     className="permissions-container border rounded p-3"
//                     style={{ maxHeight: "60vh", overflowY: "auto" }}
//                   >
//                     {Object.entries(newRolePermissions).map(
//                       ([section, permissions]) => (
//                         <div key={section} className="mb-3 border-bottom pb-3">
//                           <div className="d-flex justify-content-between align-items-center mb-2">
//                             <FormGroup check inline>
//                               <Input
//                                 type="checkbox"
//                                 id={`select-all-${section}`}
//                                 checked={areAllSelected(
//                                   newRolePermissions[section]
//                                 )}
//                                 onChange={() =>
//                                   handleSelectAll(section, permissions)
//                                 }
//                                 disabled={isLoading}
//                               />
//                               <Label
//                                 for={`select-all-${section}`}
//                                 check
//                                 className="font-weight-500 text-uppercase mb-0 ml-2"
//                               >
//                                 {section.replace(/([A-Z])/g, " $1")}
//                               </Label>
//                             </FormGroup>
//                             <small className="text-muted font-size-11">
//                               {countPermissions(newRolePermissions[section])}/
//                               {countPermissions(permissions)} selected
//                             </small>
//                           </div>

//                           <Row className="pl-3">
//                             {renderPermissions(section, permissions)}
//                           </Row>
//                         </div>
//                       )
//                     )}
//                   </div>

//                   <div className="text-center mt-4">
//                     <Button
//                       type="submit"
//                       color="primary"
//                       className="px-4 py-2"
//                       disabled={isLoading}
//                     >
//                       <i className="bx bx-save font-size-16 align-middle mr-2"></i>
//                       {isLoading ? "Creating..." : "Create Role"}
//                     </Button>
//                   </div>
//                 </Form>
//               </CardBody>
//             </Card>
//           </Col>
//         </Row>
//       </Container>
//     </div>
//   );
// };

// export default CreateRole;

import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  CardBody,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Alert,
  Badge,
  Row,
  Col,
  CardHeader,
} from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { toast } from "react-toastify";
import {
  createRole,
  getAllPermissions,
  updateRolePermissions,
} from "../../services/roleService";
import { useLocation, useNavigate } from "react-router-dom";

// Permission structure
const componentPermissions = {
  Dashboard: {
    view: false,
    analytics: false,
    orders: false,
  },
  Users: {
    view: false,
    create: false,
    edit: false,
    delete: false,
  },
  Campaigns: {
    view: false,
    create: false,
    edit: false,
    delete: false,
  },
  Orders: {
    view: false,
    create: false,
    edit: false,
    delete: false,
    openOrders: false,
    completeOrders: false,
    blockedOrders: false,
    addLeads: false,
    importLeads: false,
  },
  Leads: {
    view: false,
    create: false,
    edit: false,
    delete: false,
    allLeads: false,
    masterLeads: false,
    acceptReject: false,
  },
  ClientLead: {
    view: false,
    create: false,
    edit: false,
    delete: false,
    stateFilter: false,
  },
  Referrals: {
    view: false,
    create: false,
    manage: false,
  },
  Settings: {
    view: false,
    edit: false,
    permissions: false,
    EmailTemplates: {
      view: false,
      edit: false,
    },
    EmailAction: {
      view: false,
      edit: false,
      adminNotifications: false,
      clientNotifications: false,
    },
    Notifications: {
      view: false,
      manage: false,
    },
    ActivityLogs: {
      view: false,
      filter: false,
      export: false,
      delete: false,
    },
    SystemSettings: {
      view: false,
      edit: false,
      companyInfo: false,
      appearance: false,
    },
  },
};

// Mapping from frontend dot notation to backend colon notation
const permissionMap = {
  "Users.view": "user:get",
  "Users.create": "user:create",
  "Users.edit": "user:update",
  "Users.delete": "user:delete",
  "Campaigns.view": "campaign:get",
  "Campaigns.create": "campaign:create",
  "Campaigns.edit": "campaign:update",
  "Campaigns.delete": "campaign:delete",
  "Orders.view": "order:get",
  "Orders.create": "order:create",
  "Orders.edit": "order:update",
  "Orders.delete": "order:delete",
};

const CreateRole = () => {
  const [newRoleName, setNewRoleName] = useState("");
  const [newRolePermissions, setNewRolePermissions] = useState(
    JSON.parse(JSON.stringify(componentPermissions))
  );
  const [permissionsList, setPermissionsList] = useState([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [roleId, setRoleId] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Fetch permissions and populate form for edit mode
  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const result = await getAllPermissions();
        const permissions = result.data;
        if (!Array.isArray(permissions)) throw new Error("Invalid data format");
        setPermissionsList(permissions);

        // Check if editing a role
        if (location.state && location.state.role) {
          const { role } = location.state;
          setIsEditMode(true);
          setRoleId(role.id);
          setNewRoleName(role.name);

          // Map backend permissions to frontend structure
          const updatedPermissions = JSON.parse(
            JSON.stringify(componentPermissions)
          );
          role.Permissions.forEach((perm) => {
            const frontendKey = Object.keys(permissionMap).find(
              (key) => permissionMap[key] === perm.name
            );
            if (frontendKey) {
              const [section, action] = frontendKey.split(".");
              if (updatedPermissions[section]) {
                updatedPermissions[section][action] = true;
              }
            }
          });
          setNewRolePermissions(updatedPermissions);
        }
      } catch (err) {
        console.error("Error fetching permissions:", err);
        setError("Failed to load permissions. Please try again.");
        toast.error("Failed to load permissions");
      }
    };

    fetchPermissions();
  }, [location.state]);

  const handlePermissionToggle = (section, permissionPath) => {
    const updated = { ...newRolePermissions };
    let ref = updated[section];

    for (let i = 0; i < permissionPath.length - 1; i++) {
      ref = ref[permissionPath[i]];
    }

    const last = permissionPath[permissionPath.length - 1];
    ref[last] = !ref[last];

    setNewRolePermissions(updated);
  };

  const handleSelectAll = (section, permissions) => {
    const updated = { ...newRolePermissions };

    const toggleAll = (obj, value) => {
      for (let key in obj) {
        if (typeof obj[key] === "object") {
          toggleAll(obj[key], value);
        } else {
          obj[key] = value;
        }
      }
    };

    const sectionData = updated[section];
    const allSelected = areAllSelected(sectionData);

    toggleAll(sectionData, !allSelected);
    setNewRolePermissions(updated);
  };

  const areAllSelected = (permissions) => {
    const checkAll = (obj) =>
      Object.values(obj).every((val) =>
        typeof val === "object" ? checkAll(val) : val
      );
    return checkAll(permissions);
  };

  const countPermissions = (permissions) => {
    const countSelected = (obj) =>
      Object.values(obj).reduce((acc, val) => {
        if (typeof val === "object") {
          return acc + countSelected(val);
        }
        return acc + (val ? 1 : 0);
      }, 0);
    return countSelected(permissions);
  };

  const totalPermissions = countPermissions(componentPermissions);

  const flattenPermissions = (permissions) => {
    const result = [];

    const traverse = (obj, path = []) => {
      Object.entries(obj).forEach(([key, value]) => {
        const currentPath = [...path, key];

        if (typeof value === "object") {
          traverse(value, currentPath);
        } else if (value === true) {
          const permissionString = currentPath.join(".");
          const mappedName =
            permissionMap[permissionString] || permissionString;
          const permission = permissionsList.find((p) => p.name === mappedName);
          if (permission) {
            result.push(permission.id);
          } else {
            console.warn(
              `Permission "${permissionString}" (mapped to "${mappedName}") not found in permissionsList`
            );
          }
        }
      });
    };

    traverse(permissions);
    console.log("Generated permissionIds:", result);
    return result;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newRoleName.trim()) {
      setError("Role name is required");
      return;
    }

    if (permissionsList.length === 0) {
      setError("Permissions data not loaded. Please refresh and try again.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const permissionIds = flattenPermissions(newRolePermissions);
      if (permissionIds.length === 0) {
        setError("At least one permission must be selected");
        setIsLoading(false);
        return;
      }

      const payload = { name: newRoleName, permissions: permissionIds };
      if (isEditMode) {
        await updateRolePermissions(roleId, permissionIds);
        toast.success("Role permissions updated successfully!");
      } else {
        await createRole(payload);
        toast.success("Role created successfully!");
      }

      setNewRoleName("");
      setNewRolePermissions(JSON.parse(JSON.stringify(componentPermissions)));
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        if (isEditMode) navigate("/roles"); // Redirect to roles list after update
      }, 1500);
    } catch (error) {
      setError(error.message);
      toast.error(
        `Error ${isEditMode ? "updating" : "creating"} role: ${error.message}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const renderPermissions = (section, permissions, path = []) => {
    return Object.entries(permissions).map(([key, value]) => {
      const currentPath = [...path, key];
      const checkboxId = `${section}-${currentPath.join("-")}`;

      if (typeof value === "object") {
        return (
          <div key={checkboxId} className="ml-3 mb-2 border-left pl-3">
            <Label className="font-weight-bold d-block text-muted mb-2">
              {key.replace(/([A-Z])/g, " $1")}
            </Label>
            <Row>{renderPermissions(section, value, currentPath)}</Row>
          </div>
        );
      }

      return (
        <Col md={4} sm={6} xs={12} key={checkboxId} className="mb-2">
          <FormGroup check>
            <Input
              type="checkbox"
              id={checkboxId}
              checked={value}
              onChange={() => handlePermissionToggle(section, currentPath)}
              disabled={isLoading}
            />
            <Label for={checkboxId} check className="ml-2 font-size-13">
              {key.charAt(0).toUpperCase() +
                key.slice(1).replace(/([A-Z])/g, " $1")}
            </Label>
          </FormGroup>
        </Col>
      );
    });
  };

  const breadcrumbItems = [
    { title: "Dashboard", link: "/" },
    { title: isEditMode ? "Edit Role" : "Create Role", link: "#" },
  ];

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs
          title={isEditMode ? "EDIT ROLE" : "CREATE ROLE"}
          breadcrumbItems={breadcrumbItems}
        />

        {success && (
          <Alert color="success" className="alert-dismissible fade show">
            <i className="mdi mdi-check-all mr-2"></i>
            Role {isEditMode ? "updated" : "created"} successfully!
          </Alert>
        )}
        {error && (
          <Alert color="danger" className="alert-dismissible fade show">
            <i className="mdi mdi-block-helper mr-2"></i>
            {error}
          </Alert>
        )}

        <Row className="justify-content-center">
          <Col lg={12}>
            <Card className="shadow-sm">
              <CardHeader className="bg-transparent border-bottom">
                <h4 className="mb-0">
                  {isEditMode ? "Edit Role" : "Create New Role"}
                </h4>
              </CardHeader>
              <CardBody>
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6} lg={4}>
                      <FormGroup>
                        <Label for="roleName" className="font-weight-500">
                          Role Name
                        </Label>
                        <Input
                          type="text"
                          id="roleName"
                          value={newRoleName}
                          onChange={(e) => setNewRoleName(e.target.value)}
                          placeholder="Enter role name"
                          className="form-control-sm"
                          disabled={isLoading || isEditMode} // Disable name editing in edit mode
                        />
                      </FormGroup>
                    </Col>
                  </Row>

                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="mb-0 font-size-16">Permissions</h5>
                    <Badge color="light" className="text-dark font-size-12">
                      {countPermissions(newRolePermissions)} of{" "}
                      {totalPermissions} permissions selected
                    </Badge>
                  </div>

                  <div
                    className="permissions-container border rounded p-3"
                    style={{ maxHeight: "60vh", overflowY: "auto" }}
                  >
                    {Object.entries(newRolePermissions).map(
                      ([section, permissions]) => (
                        <div key={section} className="mb-3 border-bottom pb-3">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <FormGroup check inline>
                              <Input
                                type="checkbox"
                                id={`select-all-${section}`}
                                checked={areAllSelected(
                                  newRolePermissions[section]
                                )}
                                onChange={() =>
                                  handleSelectAll(section, permissions)
                                }
                                disabled={isLoading}
                              />
                              <Label
                                for={`select-all-${section}`}
                                check
                                className="font-weight-500 text-uppercase mb-0 ml-2"
                              >
                                {section.replace(/([A-Z])/g, " $1")}
                              </Label>
                            </FormGroup>
                            <small className="text-muted font-size-11">
                              {countPermissions(newRolePermissions[section])}/
                              {countPermissions(permissions)} selected
                            </small>
                          </div>
                          <Row className="pl-3">
                            {renderPermissions(section, permissions)}
                          </Row>
                        </div>
                      )
                    )}
                  </div>

                  <div className="text-center mt-4">
                    <Button
                      type="submit"
                      color="primary"
                      className="px-4 py-2"
                      disabled={isLoading}
                    >
                      <i className="bx bx-save font-size-16 align-middle mr-2"></i>
                      {isLoading
                        ? isEditMode
                          ? "Updating..."
                          : "Creating..."
                        : isEditMode
                        ? "Update Role"
                        : "Create Role"}
                    </Button>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default CreateRole;
