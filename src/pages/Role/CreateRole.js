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
// import {
//   createRole,
//   getAllPermissions,
//   updateRolePermissions,
// } from "../../services/roleService";
// import { useLocation, useNavigate } from "react-router-dom";

// // Permission structure
// const componentPermissions = {
//   Dashboard: {
//     view: false,
//     analytics: false,
//     orders: false,
//   },
//   Users: {
//     viewOn: false,
//     view: false,
//     create: false,
//     edit: false,
//     delete: false,
//     updateStatus: false,
//   },
//   Campaigns: {
//     view: false,
//     create: false,
//     edit: false,
//     delete: false,
//     specific: {},
//   },
//   Orders: {
//     view: false,
//     create: false,
//     edit: false,
//     delete: false,
//     updateStatus: false,
//   },
//   Leads: {
//     view: false,
//     create: false,
//     edit: false,
//     delete: false,
//     viewByAssignee: false,
//     acceptReject: false,
//     viewByCampaign: false,
//     assignUser: false,
//     viewAssignedUsers: false,
//     viewAssignmentStats: false,
//     viewUnassignedUsers: false,
//     updateStatus: false,
//     getStatusSummary: false,
//     getByCampaignAndAssignee: false,
//   },
//   ClientLead: {
//     view: false,
//     create: false,
//     edit: false,
//     delete: false,
//     getByOrder: false,
//     getById: false,
//     updateStatus: false,
//   },
//   Products: {
//     // Sales-related product permissions
//     convertLead: false, // PRODUCT_CONVERT_LEAD
//     getAllSales: false, // PRODUCT_SALE_GET_ALL
//     getById: false, // PRODUCT_SALE_GET_BY_ID
//     updateSale: false, // PRODUCT_SALE_UPDATE
//     deleteSale: false, // PRODUCT_SALE_DELETE

//     // Product management permissions
//     create: false, // PRODUCT_CREATE
//     getAll: false, // PRODUCT_GET_ALL
//     update: false, // PRODUCT_UPDATE
//     delete: false, // PRODUCT_DELETE
//   },

//   Notes: {
//     create: false,
//     view: false,
//     delete: false,
//   },

//   Reminders: {
//     create: false,
//     view: false,
//     delete: false,
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
//   // Users
//   "Users.view": "user:get",
//   "Users.create": "user:create",
//   "Users.edit": "user:update",
//   "Users.delete": "user:delete",
//   "Users.updateStatus": "user:updateStatus",
//   "Users.viewOn": "user:getById",

//   // Campaigns
//   "Campaigns.view": "campaign:get",
//   "Campaigns.create": "campaign:create",
//   "Campaigns.edit": "campaign:update",
//   "Campaigns.delete": "campaign:delete",
//   "Campaigns.getById": "getCampaignById",

//   // Orders
//   "Orders.view": "order:get",
//   "Orders.create": "order:create",
//   "Orders.edit": "order:update",
//   "Orders.delete": "order:delete",
//   "Orders.updateStatus": "order:updateStatus",

//   // Leads
//   "Leads.view": "lead:getAll",
//   "Leads.create": "lead:create",
//   "Leads.edit": "lead:update",
//   "Leads.delete": "lead:delete",
//   "Leads.viewByAssignee": "lead:getByAssignee",
//   "Leads.viewByCampaign": "lead:getByCampaign",
//   "Leads.assignUser": "lead:assign",
//   "Leads.viewAssignedUsers": "lead:view_assigned_users",
//   "Leads.viewAssignmentStats": "lead:view_assignment_stats",
//   "Leads.viewUnassignedUsers": "lead:view_unassigned_users",
//   "Leads.updateStatus": "lead:update_status",
//   "Leads.getStatusSummary": "lead:get_status_summary",
//   "Leads.getByCampaignAndAssignee": "lead:get_by_campaign_and_assignee",

//   // ClientLead
//   "ClientLead.view": "clientLead:getAll",
//   "ClientLead.create": "clientLead:create",
//   "ClientLead.edit": "clientLead:update",
//   "ClientLead.delete": "clientLead:delete",
//   "ClientLead.getByOrder": "clientLead:getByOrder",
//   "ClientLead.getById": "clientLead:getById",
//   "ClientLead.updateStatus": "clientLead:updateStatus",
//   // Product Sales-related permissions
//   "Products.convertLead": "PRODUCT_CONVERT_LEAD",
//   "Products.getAllSales": "PRODUCT_SALE_GET_ALL",
//   "Products.getById": "PRODUCT_SALE_GET_BY_ID",
//   "Products.updateSale": "PRODUCT_SALE_UPDATE",
//   "Products.deleteSale": "PRODUCT_SALE_DELETE",

//   // Product Management-related permissions
//   "Products.create": "PRODUCT_CREATE",
//   "Products.getAll": "PRODUCT_GET_ALL",
//   "Products.update": "PRODUCT_UPDATE",
//   "Products.delete": "PRODUCT_DELETE",

//   // Notes
//   "Notes.create": "note:create",
//   "Notes.view": "note:view",
//   "Notes.delete": "note:delete",

//   // Remainder
//   "Reminders.create": "reminder:create",
//   "Reminders.view": "reminder:view",
//   "Reminders.delete": "reminder:delete",
// };

// const CreateRole = () => {
//   const [newRoleName, setNewRoleName] = useState("");
//   const [newRolePermissions, setNewRolePermissions] = useState(
//     JSON.parse(JSON.stringify(componentPermissions))
//   );
//   const [permissionsList, setPermissionsList] = useState([]);
//   const [campaignSpecificPermissions, setCampaignSpecificPermissions] =
//     useState([]);
//   const [success, setSuccess] = useState(false);
//   const [error, setError] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [roleId, setRoleId] = useState(null);
//   const location = useLocation();
//   const navigate = useNavigate();

//   // Fetch permissions and populate form for edit mode
//   useEffect(() => {
//     const fetchPermissions = async () => {
//       try {
//         const result = await getAllPermissions();
//         const permissions = result.data || result;
//         if (!Array.isArray(permissions)) throw new Error("Invalid data format");

//         setPermissionsList(permissions);

//         const campaignPerms = permissions
//           .filter(
//             (permission) =>
//               permission.name === "getCampaignById" &&
//               permission.resourceType &&
//               permission.resourceType.startsWith("campaign-")
//           )
//           .map((permission) => ({
//             ...permission,
//             displayName: permission.resourceType.replace("campaign-", ""),
//             resourceId: permission.resourceId,
//           }));
//         setCampaignSpecificPermissions(campaignPerms);

//         // Check if editing a role
//         if (location.state && location.state.role) {
//           const { role } = location.state;
//           setIsEditMode(true);
//           setRoleId(role.id);
//           setNewRoleName(role.name);

//           const updatedPermissions = JSON.parse(
//             JSON.stringify(componentPermissions)
//           );

//           // Initialize all campaign-specific permissions as false first
//           campaignSpecificPermissions.forEach((perm) => {
//             updatedPermissions.Campaigns.specific[perm.id] = false;
//           });

//           // Then set only the ones that are actually assigned
//           role.Permissions.forEach((perm) => {
//             // Handle campaign-specific permissions
//             if (campaignPerms.some((p) => p.id === perm.id)) {
//               updatedPermissions.Campaigns.specific[perm.id] = true;
//               return;
//             }
//             // Handle standard permissions
//             const frontendKey = Object.keys(permissionMap).find(
//               (key) => permissionMap[key] === perm.name
//             );
//             if (frontendKey) {
//               const [section, action] = frontendKey.split(".");
//               if (updatedPermissions[section]) {
//                 updatedPermissions[section][action] = true;
//               }
//             }
//           });

//           setNewRolePermissions(updatedPermissions);
//         }
//       } catch (err) {
//         console.error("Error fetching permissions:", err);
//         setError("Failed to load permissions. Please try again.");
//         toast.error("Failed to load permissions");
//       }
//     };

//     fetchPermissions();
//   }, [location.state]);

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
//         if (key === "specific") continue; // Skip specific permissions
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
//       Object.entries(obj).every(([key, val]) => {
//         if (key === "specific") return true; // Skip specific permissions
//         return typeof val === "object" ? checkAll(val) : val;
//       });
//     return checkAll(permissions);
//   };

//   const countPermissions = (permissions) => {
//     const countSelected = (obj) =>
//       Object.entries(obj).reduce((acc, [key, val]) => {
//         if (key === "specific") {
//           return acc + Object.values(val).filter((v) => v).length;
//         }
//         return (
//           acc + (typeof val === "object" ? countSelected(val) : val ? 1 : 0)
//         );
//       }, 0);
//     return countSelected(permissions);
//   };

//   const totalPermissions = countPermissions(componentPermissions);

//   const flattenPermissions = (permissions) => {
//     const result = [];

//     if (permissions.Campaigns?.specific) {
//       Object.entries(permissions.Campaigns.specific).forEach(
//         ([id, isSelected]) => {
//           if (isSelected) {
//             result.push(parseInt(id));
//           }
//         }
//       );
//     }

//     const traverse = (obj, path = []) => {
//       Object.entries(obj).forEach(([key, value]) => {
//         const currentPath = [...path, key];

//         if (key === "specific" && typeof value === "object") {
//           // Handle campaign-specific permissions
//           Object.entries(value).forEach(([id, isSelected]) => {
//             if (isSelected) {
//               result.push(parseInt(id));
//             }
//           });
//           return;
//         }

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

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!newRoleName.trim()) {
//       setError("Role name is required");
//       return;
//     }

//     setIsLoading(true);
//     setError("");

//     try {
//       const permissionIds = [
//         ...new Set(flattenPermissions(newRolePermissions)),
//       ];

//       console.log("Submitting with permission IDs:", permissionIds);

//       if (isEditMode) {
//         const response = await updateRolePermissions(roleId, permissionIds);
//         toast.success("Role permissions updated successfully!");
//         navigate("/role-index");
//         console.log("Updated role data", response);
//         localStorage.setItem("rolePermissions", JSON.stringify(permissionIds));
//         localStorage.setItem("permissionsUpdated", Date.now().toString());
//       } else {
//         const response = await createRole({
//           name: newRoleName,
//           permissions: permissionIds,
//         });

//         console.log("Role Created ", response);
//         toast.success("Role created successfully!");
//         setNewRoleName("");
//         setNewRolePermissions(JSON.parse(JSON.stringify(componentPermissions)));
//         setSuccess(true);
//       }
//     } catch (error) {
//       console.error("Submission error:", error);
//       setError(error.response?.data?.message || error.message);
//       toast.error(error.response?.data?.message || "Failed to update role");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const renderPermissions = (section, permissions, path = []) => {
//     // Special handling for Campaigns section
//     if (section === "Campaigns") {
//       return (
//         <>
//           {/* Render the standard campaign permissions */}
//           {Object.entries(permissions).map(([key, value]) => {
//             if (key === "specific") return null; // We'll handle this separately

//             const currentPath = [...path, key];
//             const checkboxId = `${section}-${currentPath.join("-")}`;

//             return (
//               <Col md={4} sm={6} xs={12} key={checkboxId} className="mb-2">
//                 <FormGroup check>
//                   <Input
//                     type="checkbox"
//                     id={checkboxId}
//                     checked={value}
//                     onChange={() =>
//                       handlePermissionToggle(section, currentPath)
//                     }
//                     disabled={isLoading}
//                   />
//                   <Label for={checkboxId} check className="ml-2 font-size-13">
//                     {key.charAt(0).toUpperCase() +
//                       key.slice(1).replace(/([A-Z])/g, " $1")}
//                   </Label>
//                 </FormGroup>
//               </Col>
//             );
//           })}

//           {/* Render the campaign-specific permissions dropdown */}
//           {campaignSpecificPermissions.length > 0 && (
//             <Col md={12} className="mb-3 mt-2">
//               <Label className="font-weight-bold d-block mb-2">
//                 Campaign-Specific Access
//               </Label>
//               <FormGroup check inline className="mb-2">
//                 <Input
//                   type="checkbox"
//                   id="select-all-campaigns"
//                   checked={
//                     Object.values(newRolePermissions.Campaigns.specific).every(
//                       Boolean
//                     ) && campaignSpecificPermissions.length > 0
//                   }
//                   onChange={() => {
//                     const updated = { ...newRolePermissions };
//                     const allSelected = Object.values(
//                       updated.Campaigns.specific
//                     ).every(Boolean);

//                     campaignSpecificPermissions.forEach((perm) => {
//                       updated.Campaigns.specific[perm.id] = !allSelected;
//                     });

//                     setNewRolePermissions(updated);
//                   }}
//                   disabled={
//                     isLoading || campaignSpecificPermissions.length === 0
//                   }
//                 />
//                 <Label
//                   for="select-all-campaigns"
//                   check
//                   className="ml-2 font-size-13"
//                 >
//                   Select All Campaigns
//                 </Label>
//               </FormGroup>
//               <Row>
//                 {campaignSpecificPermissions.map((perm) => (
//                   <Col md={4} sm={6} xs={12} key={perm.id} className="mb-2">
//                     <FormGroup check>
//                       <Input
//                         type="checkbox"
//                         id={`campaign-${perm.id}`}
//                         checked={
//                           newRolePermissions.Campaigns.specific[perm.id] ||
//                           false
//                         }
//                         onChange={() => {
//                           const updated = { ...newRolePermissions };
//                           updated.Campaigns.specific[perm.id] =
//                             !updated.Campaigns.specific[perm.id];
//                           setNewRolePermissions(updated);
//                         }}
//                         disabled={isLoading}
//                       />
//                       <Label
//                         for={`campaign-${perm.id}`}
//                         check
//                         className="ml-2 font-size-13"
//                       >
//                         {perm.displayName}
//                       </Label>
//                     </FormGroup>
//                   </Col>
//                 ))}
//               </Row>
//             </Col>
//           )}
//         </>
//       );
//     }

//     // Default rendering for other sections
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
//     { title: isEditMode ? "Edit Role" : "Create Role", link: "#" },
//   ];

//   return (
//     <div className="page-content">
//       <Container fluid>
//         <Breadcrumbs
//           title={isEditMode ? "EDIT ROLE" : "CREATE ROLE"}
//           breadcrumbItems={breadcrumbItems}
//         />

//         {success && (
//           <Alert color="success" className="alert-dismissible fade show">
//             <i className="mdi mdi-check-all mr-2"></i>
//             Role {isEditMode ? "updated" : "created"} successfully!
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
//                 <h4 className="mb-0">
//                   {isEditMode ? "Edit Role" : "Create New Role"}
//                 </h4>
//               </CardHeader>
//               <CardBody>
//                 <Form onSubmit={handleSubmit}>
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
//                           placeholder="Enter role name"
//                           className="form-control-sm"
//                           disabled={isLoading || isEditMode}
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
//                       {isLoading
//                         ? isEditMode
//                           ? "Updating..."
//                           : "Creating..."
//                         : isEditMode
//                         ? "Update Role"
//                         : "Create Role"}
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
    viewOn: false,
    view: false,
    create: false,
    edit: false,
    delete: false,
    updateStatus: false,
  },
  Campaigns: {
    view: false,
    create: false,
    edit: false,
    delete: false,
    specific: {},
  },
  Orders: {
    view: false,
    create: false,
    edit: false,
    delete: false,
    updateStatus: false,
  },
  Leads: {
    view: false,
    create: false,
    edit: false,
    delete: false,
    viewByAssignee: false,
    acceptReject: false,
    viewByCampaign: false,
    assignUser: false,
    viewAssignedUsers: false,
    viewAssignmentStats: false,
    viewUnassignedUsers: false,
    updateStatus: false,
    getStatusSummary: false,
    getByCampaignAndAssignee: false,
  },
  ClientLead: {
    view: false,
    create: false,
    edit: false,
    delete: false,
    getByOrder: false,
    getById: false,
    updateStatus: false,
  },
  Products: {
    convertLead: false,
    getAllSales: false,
    getById: false,
    updateSale: false,
    deleteSale: false,
    create: false,
    getAll: false,
    update: false,
    delete: false,
  },
  Notes: {
    create: false,
    view: false,
    delete: false,
  },
  Reminders: {
    create: false,
    view: false,
    delete: false,
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

const permissionMap = {
  "Users.view": "user:get",
  "Users.create": "user:create",
  "Users.edit": "user:update",
  "Users.delete": "user:delete",
  "Users.updateStatus": "user:updateStatus",
  "Users.viewOn": "user:getById",
  "Campaigns.view": "campaign:get",
  "Campaigns.create": "campaign:create",
  "Campaigns.edit": "campaign:update",
  "Campaigns.delete": "campaign:delete",
  "Campaigns.getById": "getCampaignById",
  "Orders.view": "order:get",
  "Orders.create": "order:create",
  "Orders.edit": "order:update",
  "Orders.delete": "order:delete",
  "Orders.updateStatus": "order:updateStatus",
  "Leads.view": "lead:getAll",
  "Leads.create": "lead:create",
  "Leads.edit": "lead:update",
  "Leads.delete": "lead:delete",
  "Leads.viewByAssignee": "lead:getByAssignee",
  "Leads.viewByCampaign": "lead:getByCampaign",
  "Leads.assignUser": "lead:assign",
  "Leads.viewAssignedUsers": "lead:view_assigned_users",
  "Leads.viewAssignmentStats": "lead:view_assignment_stats",
  "Leads.viewUnassignedUsers": "lead:view_unassigned_users",
  "Leads.updateStatus": "lead:update_status",
  "Leads.getStatusSummary": "lead:get_status_summary",
  "Leads.getByCampaignAndAssignee": "lead:get_by_campaign_and_assignee",
  "ClientLead.view": "clientLead:getAll",
  "ClientLead.create": "clientLead:create",
  "ClientLead.edit": "clientLead:update",
  "ClientLead.delete": "clientLead:delete",
  "ClientLead.getByOrder": "clientLead:getByOrder",
  "ClientLead.getById": "clientLead:getById",
  "ClientLead.updateStatus": "clientLead:updateStatus",
  "Products.convertLead": "PRODUCT_CONVERT_LEAD",
  "Products.getAllSales": "PRODUCT_SALE_GET_ALL",
  "Products.getById": "PRODUCT_SALE_GET_BY_ID",
  "Products.updateSale": "PRODUCT_SALE_UPDATE",
  "Products.deleteSale": "PRODUCT_SALE_DELETE",
  "Products.create": "PRODUCT_CREATE",
  "Products.getAll": "PRODUCT_GET_ALL",
  "Products.update": "PRODUCT_UPDATE",
  "Products.delete": "PRODUCT_DELETE",
  "Notes.create": "note:create",
  "Notes.view": "note:view",
  "Notes.delete": "note:delete",
  "Reminders.create": "reminder:create",
  "Reminders.view": "reminder:view",
  "Reminders.delete": "reminder:delete",
};

const CreateRole = () => {
  const [state, setState] = useState({
    newRoleName: "",
    newRolePermissions: JSON.parse(JSON.stringify(componentPermissions)),
    permissionsList: [],
    campaignSpecificPermissions: [],
    success: false,
    error: "",
    isLoading: false,
    isEditMode: false,
    roleId: null,
  });

  const location = useLocation();
  const navigate = useNavigate();

  const updateState = (updates) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        updateState({ isLoading: true });
        const result = await getAllPermissions();
        const permissions = result.data || result;

        if (!Array.isArray(permissions)) {
          throw new Error("Invalid data format");
        }

        const campaignPerms = permissions
          .filter(
            (permission) =>
              permission.name === "getCampaignById" &&
              permission.resourceType &&
              permission.resourceType.startsWith("campaign-")
          )
          .map((permission) => ({
            ...permission,
            displayName: permission.resourceType.replace("campaign-", ""),
            resourceId: permission.resourceId,
          }));

        if (location.state?.role) {
          const { role } = location.state;
          const updatedPermissions = initializeRolePermissions(
            role.Permissions,
            campaignPerms
          );

          updateState({
            isEditMode: true,
            roleId: role.id,
            newRoleName: role.name,
            newRolePermissions: updatedPermissions,
          });
        }

        updateState({
          permissionsList: permissions,
          campaignSpecificPermissions: campaignPerms,
          isLoading: false,
        });
      } catch (err) {
        console.error("Error fetching permissions:", err);
        updateState({
          error: "Failed to load permissions. Please try again.",
          isLoading: false,
        });
        toast.error("Failed to load permissions");
      }
    };

    fetchPermissions();
  }, [location.state]);

  const initializeRolePermissions = (rolePermissions, campaignPerms) => {
    const updatedPermissions = JSON.parse(JSON.stringify(componentPermissions));

    campaignPerms.forEach((perm) => {
      updatedPermissions.Campaigns.specific[perm.id] = false;
    });

    rolePermissions.forEach((perm) => {
      if (campaignPerms.some((p) => p.id === perm.id)) {
        updatedPermissions.Campaigns.specific[perm.id] = true;
        return;
      }

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

    return updatedPermissions;
  };

  const handlePermissionToggle = (section, permissionPath) => {
    const updated = { ...state.newRolePermissions };
    let ref = updated[section];

    for (let i = 0; i < permissionPath.length - 1; i++) {
      ref = ref[permissionPath[i]];
    }

    const last = permissionPath[permissionPath.length - 1];
    ref[last] = !ref[last];

    updateState({ newRolePermissions: updated });
  };

  const handleSelectAll = (section, permissions) => {
    const updated = { ...state.newRolePermissions };
    const toggleAll = (obj, value) => {
      for (let key in obj) {
        if (key === "specific") continue;
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
    updateState({ newRolePermissions: updated });
  };

  const areAllSelected = (permissions) => {
    const checkAll = (obj) =>
      Object.entries(obj).every(([key, val]) => {
        if (key === "specific") return true;
        return typeof val === "object" ? checkAll(val) : val;
      });
    return checkAll(permissions);
  };

  const countPermissions = (permissions) => {
    const countSelected = (obj) =>
      Object.entries(obj).reduce((acc, [key, val]) => {
        if (key === "specific") {
          return acc + Object.values(val).filter((v) => v).length;
        }
        return (
          acc + (typeof val === "object" ? countSelected(val) : val ? 1 : 0)
        );
      }, 0);
    return countSelected(permissions);
  };

  const totalPermissions = countPermissions(componentPermissions);

  const flattenPermissions = (permissions) => {
    const result = [];

    if (permissions.Campaigns?.specific) {
      Object.entries(permissions.Campaigns.specific).forEach(
        ([id, isSelected]) => {
          if (isSelected) {
            result.push(parseInt(id));
          }
        }
      );
    }

    const traverse = (obj, path = []) => {
      Object.entries(obj).forEach(([key, value]) => {
        const currentPath = [...path, key];

        if (key === "specific") return;

        if (typeof value === "object") {
          traverse(value, currentPath);
        } else if (value === true) {
          const permissionString = currentPath.join(".");
          const mappedName =
            permissionMap[permissionString] || permissionString;
          const permission = state.permissionsList.find(
            (p) => p.name === mappedName
          );

          if (permission) {
            result.push(permission.id);
          } else {
            console.warn(`Permission not found: ${permissionString}`);
          }
        }
      });
    };

    traverse(permissions);
    return [...new Set(result)];
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (!state.newRoleName.trim()) {
  //     updateState({ error: "Role name is required" });
  //     return;
  //   }

  //   updateState({ isLoading: true, error: "" });

  //   try {
  //     const permissionIds = flattenPermissions(state.newRolePermissions);

  //     if (state.isEditMode) {
  //       await updateRolePermissions(state.roleId, permissionIds);
  //       toast.success("Role permissions updated successfully!");

  //       navigate("/role-index");
  //     } else {
  //       await createRole({
  //         name: state.newRoleName,
  //         permissions: permissionIds,
  //       });

  //       toast.success("Role created successfully!");
  //       updateState({
  //         newRoleName: "",
  //         newRolePermissions: JSON.parse(JSON.stringify(componentPermissions)),
  //         success: true,
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Submission error:", error);
  //     const errorMsg = error.response?.data?.message || error.message;
  //     updateState({ error: errorMsg });
  //     toast.error(errorMsg);
  //   } finally {
  //     updateState({ isLoading: false });
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!state.newRoleName.trim()) {
      updateState({ error: "Role name is required" });
      return;
    }

    updateState({ isLoading: true, error: "" });

    try {
      const permissionIds = flattenPermissions(state.newRolePermissions);

      if (state.isEditMode) {
        await updateRolePermissions(state.roleId, permissionIds);
        toast.success("Role permissions updated successfully!");
        // Store permissions with role-specific key
        localStorage.setItem(
          `rolePermissions_${state.roleId}`,
          JSON.stringify(permissionIds)
        );
        localStorage.setItem(
          `permissionsUpdated_${state.roleId}`,
          Date.now().toString()
        );
        navigate("/role-index");
      } else {
        const response = await createRole({
          name: state.newRoleName,
          permissions: permissionIds,
        });
        toast.success("Role created successfully!");
        updateState({
          newRoleName: "",
          newRolePermissions: JSON.parse(JSON.stringify(componentPermissions)),
          success: true,
        });
        // No localStorage update for new roles since no users have it yet
      }
    } catch (error) {
      console.error("Submission error:", error);
      const errorMsg = error.response?.data?.message || error.message;
      updateState({ error: errorMsg });
      toast.error(errorMsg);
    } finally {
      updateState({ isLoading: false });
    }
  };
  const renderPermissions = (section, permissions, path = []) => {
    if (section === "Campaigns") {
      return (
        <>
          {Object.entries(permissions).map(([key, value]) => {
            if (key === "specific") return null;

            const currentPath = [...path, key];
            const checkboxId = `${section}-${currentPath.join("-")}`;

            return (
              <Col md={4} sm={6} xs={12} key={checkboxId} className="mb-2">
                <FormGroup check>
                  <Input
                    type="checkbox"
                    id={checkboxId}
                    checked={value}
                    onChange={() =>
                      handlePermissionToggle(section, currentPath)
                    }
                    disabled={state.isLoading}
                  />
                  <Label for={checkboxId} check className="ml-2 font-size-13">
                    {key.charAt(0).toUpperCase() +
                      key.slice(1).replace(/([A-Z])/g, " $1")}
                  </Label>
                </FormGroup>
              </Col>
            );
          })}

          {state.campaignSpecificPermissions.length > 0 && (
            <Col md={12} className="mb-3 mt-2">
              <Label className="font-weight-bold d-block mb-2">
                Campaign-Specific Access
              </Label>
              <FormGroup check inline className="mb-2">
                <Input
                  type="checkbox"
                  id="select-all-campaigns"
                  checked={
                    Object.values(
                      state.newRolePermissions.Campaigns.specific
                    ).every(Boolean) &&
                    state.campaignSpecificPermissions.length > 0
                  }
                  onChange={() => {
                    const updated = { ...state.newRolePermissions };
                    const allSelected = Object.values(
                      updated.Campaigns.specific
                    ).every(Boolean);

                    state.campaignSpecificPermissions.forEach((perm) => {
                      updated.Campaigns.specific[perm.id] = !allSelected;
                    });

                    updateState({ newRolePermissions: updated });
                  }}
                  disabled={
                    state.isLoading ||
                    state.campaignSpecificPermissions.length === 0
                  }
                />
                <Label
                  for="select-all-campaigns"
                  check
                  className="ml-2 font-size-13"
                >
                  Select All Campaigns
                </Label>
              </FormGroup>
              <Row>
                {state.campaignSpecificPermissions.map((perm) => (
                  <Col md={4} sm={6} xs={12} key={perm.id} className="mb-2">
                    <FormGroup check>
                      <Input
                        type="checkbox"
                        id={`campaign-${perm.id}`}
                        checked={
                          state.newRolePermissions.Campaigns.specific[
                            perm.id
                          ] || false
                        }
                        onChange={() => {
                          const updated = { ...state.newRolePermissions };
                          updated.Campaigns.specific[perm.id] =
                            !updated.Campaigns.specific[perm.id];
                          updateState({ newRolePermissions: updated });
                        }}
                        disabled={state.isLoading}
                      />
                      <Label
                        for={`campaign-${perm.id}`}
                        check
                        className="ml-2 font-size-13"
                      >
                        {perm.displayName}
                      </Label>
                    </FormGroup>
                  </Col>
                ))}
              </Row>
            </Col>
          )}
        </>
      );
    }

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
              disabled={state.isLoading}
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

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs
          title={state.isEditMode ? "EDIT ROLE" : "CREATE ROLE"}
          breadcrumbItems={[
            { title: "Dashboard", link: "/" },
            {
              title: state.isEditMode ? "Edit Role" : "Create Role",
              link: "#",
            },
          ]}
        />

        {state.success && (
          <Alert color="success" className="alert-dismissible fade show">
            <i className="mdi mdi-check-all mr-2"></i>
            Role {state.isEditMode ? "updated" : "created"} successfully!
          </Alert>
        )}

        {state.error && (
          <Alert color="danger" className="alert-dismissible fade show">
            <i className="mdi mdi-block-helper mr-2"></i>
            {state.error}
          </Alert>
        )}

        <Row className="justify-content-center">
          <Col lg={12}>
            <Card className="shadow-sm">
              <CardHeader className="bg-transparent border-bottom">
                <h4 className="mb-0">
                  {state.isEditMode ? "Edit Role" : "Create New Role"}
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
                          value={state.newRoleName}
                          onChange={(e) =>
                            updateState({ newRoleName: e.target.value })
                          }
                          placeholder="Enter role name"
                          className="form-control-sm"
                          disabled={state.isLoading || state.isEditMode}
                        />
                      </FormGroup>
                    </Col>
                  </Row>

                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="mb-0 font-size-16">Permissions</h5>
                    <Badge color="light" className="text-dark font-size-12">
                      {countPermissions(state.newRolePermissions)} of{" "}
                      {totalPermissions} permissions selected
                    </Badge>
                  </div>

                  <div
                    className="permissions-container border rounded p-3"
                    style={{ maxHeight: "60vh", overflowY: "auto" }}
                  >
                    {Object.entries(state.newRolePermissions).map(
                      ([section, permissions]) => (
                        <div key={section} className="mb-3 border-bottom pb-3">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <FormGroup check inline>
                              <Input
                                type="checkbox"
                                id={`select-all-${section}`}
                                checked={areAllSelected(
                                  state.newRolePermissions[section]
                                )}
                                onChange={() =>
                                  handleSelectAll(section, permissions)
                                }
                                disabled={state.isLoading}
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
                              {countPermissions(
                                state.newRolePermissions[section]
                              )}
                              /{countPermissions(permissions)} selected
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
                      disabled={state.isLoading}
                    >
                      <i className="bx bx-save font-size-16 align-middle mr-2"></i>
                      {state.isLoading
                        ? state.isEditMode
                          ? "Updating..."
                          : "Creating..."
                        : state.isEditMode
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
