// // src/pages/AssignedLeads/index.js
// import React from "react";
// import { Container } from "reactstrap";
// import Breadcrumbs from "../../components/Common/Breadcrumb";
// import UserLeads from "./AssignedLeads";

// const AssignedLeads = () => {
//   return (
//     <React.Fragment>
//       <div className="page-content">
//         <Container fluid>
//           <Breadcrumbs
//             title="Assigned Leads"
//             breadcrumbItems={[
//               { title: "Eraxon", link: "/" },
//               { title: "Leads", link: "#" },
//               { title: "Assigned Leads", link: "/assigned-leads" },
//             ]}
//           />
//           <UserLeads userId={Number(localStorage.getItem("userId"))} />
//         </Container>
//       </div>
//     </React.Fragment>
//   );
// };

// export default AssignedLeads;

// import React from "react";
// import { Container } from "reactstrap";
// import { useParams, useLocation } from "react-router-dom";
// import Breadcrumbs from "../../components/Common/Breadcrumb";
// import UserLeads from "./AssignedLeads";

// const AssignedLeads = () => {
//   const { userId } = useParams();
//   const location = useLocation();
//   const queryParams = new URLSearchParams(location.search);
//   const campaignName = queryParams.get("campaign");
//   const urlUserId = queryParams.get("userId");

//   // Determine breadcrumbs based on route
//   const getBreadcrumbItems = () => {
//     const items = [
//       { title: "Dashbaord", link: "#" },
//       { title: "Users", link: "/allUsers" },
//     ];

//     if (urlUserId) {
//       items.push(
//         { title: "User Details", link: `/user-details/${urlUserId}` },
//         { title: "Leads", link: "#" }
//       );
//     } else {
//       items.push({ title: "Leads", link: "#" });
//     }

//     if (campaignName) {
//       items.push({ title: decodeURIComponent(campaignName), link: "#" });
//     }

//     return items;
//   };

//   return (
//     <div className="page-content">
//       <Container fluid>
//         <Breadcrumbs
//           title={
//             campaignName
//               ? `${decodeURIComponent(campaignName)} Leads`
//               : "All Assigned Leads"
//           }
//           breadcrumbItems={getBreadcrumbItems()}
//         />

//         <UserLeads
//           userId={userId || urlUserId || null}
//           campaignName={campaignName ? decodeURIComponent(campaignName) : null}
//         />
//       </Container>
//     </div>
//   );
// };

// export default AssignedLeads;

// import React from "react";
// import { Container } from "reactstrap";
// import { useParams, useLocation } from "react-router-dom";
// import Breadcrumbs from "../../components/Common/Breadcrumb";
// import UserLeads from "./AssignedLeads";

// const AssignedLeads = () => {
//   const { userId } = useParams();
//   const location = useLocation();
//   const queryParams = new URLSearchParams(location.search);
//   const campaignName = queryParams.get("campaign");
//   const urlUserId = queryParams.get("userId");

//   const getBreadcrumbItems = () => {
//     const items = [
//       { title: "Dashboard", link: "#" },
//       { title: "Users", link: "/all-users" },
//     ];

//     if (urlUserId) {
//       items.push(
//         { title: "User Details", link: `/user-details/${urlUserId}` },
//         { title: "Leads", link: "#" }
//       );
//     } else {
//       items.push({ title: "Leads", link: "#" });
//     }

//     if (campaignName) {
//       items.push({ title: decodeURIComponent(campaignName), link: "#" });
//     }

//     return items;
//   };

//   return (
//     <div className="page-content">
//       <Container fluid>
//         <Breadcrumbs
//           title={
//             campaignName
//               ? `${decodeURIComponent(campaignName)} Leads`
//               : "All Assigned Leads"
//           }
//           breadcrumbItems={getBreadcrumbItems()}
//         />
//         <UserLeads userId={userId || urlUserId || null} />
//       </Container>
//     </div>
//   );
// };

// export default AssignedLeads;

import React from "react";
import { Container } from "reactstrap";
import { useParams, useLocation } from "react-router-dom";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import UserLeads from "./AssignedLeads";
import { useSelector } from "react-redux";
import { hasAnyPermission } from "../../utils/permissions";

const AssignedLeads = () => {
  const { userId } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const campaignName = queryParams.get("campaign");
  const urlUserId = queryParams.get("userId");
  const currentUser = useSelector((state) => state.Login?.user);
  const isAdmin = hasAnyPermission(currentUser, ["user:get"]);

  const getBreadcrumbItems = () => {
    const items = [{ title: "Dashboard", link: "/" }];

    if (isAdmin && urlUserId) {
      items.push(
        { title: "Users", link: "/allUsers" },
        { title: "User Details", link: `/user-details/${urlUserId}` },
        { title: "Leads", link: "#" }
      );
    } else {
      items.push(
        { title: "Leads", link: "#" },
        { title: "Assigned Leads", link: "#" }
      );
    }

    if (campaignName) {
      items.push({ title: decodeURIComponent(campaignName), link: "#" });
    }

    return items;
  };

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs
          title={
            campaignName
              ? `${decodeURIComponent(campaignName)} Leads`
              : "All Assigned Leads"
          }
          breadcrumbItems={getBreadcrumbItems()}
        />
        <UserLeads userId={userId || urlUserId || null} />
      </Container>
    </div>
  );
};

export default AssignedLeads;
