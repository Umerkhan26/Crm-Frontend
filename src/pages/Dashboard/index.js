// import React, { Component, useState } from "react";
// import { Container, Row, Col } from "reactstrap";

// //Import Breadcrumb
// import Breadcrumbs from "../../components/Common/Breadcrumb";

// //Import Components
// import MiniWidgets from "./MiniWidgets";
// import RevenueAnalytics from "./RevenueAnalytics";
// import SalesAnalytics from "./SalesAnalytics";
// import EarningReports from "./EarningReports";
// import Sources from "./Sources";
// import RecentlyActivity from "./RecentlyActivity";
// import RevenueByLocations from "./RevenueByLocations";
// import ChatBox from "./ChatBox";
// import LatestTransactions from "./LatestTransactions";
// import UserLeads from "../AssignedLeads/AssignedLeads";

// const Dashboard = () => {
//   const [breadcrumbItems] = useState([
//     { title: "Eraxon", link: "/" },
//     { title: "Dashboard", link: "#" },
//   ]);

//   const [reports] = useState([
//     {
//       icon: "ri-stack-line",
//       title: "Orders",
//       value: "1452",
//       rate: "2.4%",
//       desc: "From previous period",
//     },
//     {
//       icon: "ri-store-2-line",
//       title: "Vendors",
//       value: "2",
//       rate: "2.4%",
//       desc: "From previous period",
//     },
//     {
//       icon: "ri-briefcase-4-line",
//       title: "Clients",
//       value: "6",
//       rate: "2.4%",
//       desc: "From previous period",
//     },
//     {
//       icon: "ri-briefcase-4-line",
//       title: "Total Leads",
//       value: "0",
//       rate: "2.4%",
//       desc: "From previous period",
//     },
//   ]);

//   const userId = localStorage.getItem("userId");
//   const userRole = localStorage.getItem("userrole");

//   return (
//     <React.Fragment>
//       <div className="page-content">
//         <Container fluid>
//           <Breadcrumbs title="Dashboard" breadcrumbItems={breadcrumbItems} />
//           {userRole === "admin" ? (
//             // Admin dashboard
//             <>
//               <Row>
//                 <MiniWidgets reports={reports} />
//               </Row>
//               <Row>
//                 <Col md={12}>
//                   {/* Admin can see all leads or other admin-specific components */}
//                 </Col>
//               </Row>
//             </>
//           ) : (
//             // Regular user dashboard showing their assigned leads
//             <Row>
//               <Col md={12}>
//                 <UserLeads userId={userId} />
//               </Col>
//             </Row>
//           )}
//           <Row>
//             <Col xl={8}>
//               <Row>
//                 <MiniWidgets reports={reports} />
//               </Row>
//               <RevenueAnalytics />
//             </Col>
//             <Col xl={4}>
//               <SalesAnalytics />
//               <EarningReports />
//             </Col>
//           </Row>
//           <Row>
//             <RecentlyActivity userId={userId} />{" "}
//             {/* Fallback to 1 if no userId */}
//             <LatestTransactions />
//           </Row>
//           <Row>{/* <ChatBox /> */}</Row>
//         </Container>
//       </div>
//     </React.Fragment>
//   );
// };

// export default Dashboard;

import React, { useState, useEffect } from "react";
import { Container, Row, Col, Alert } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import MiniWidgets from "./MiniWidgets";
import RevenueAnalytics from "./RevenueAnalytics";
import SalesAnalytics from "./SalesAnalytics";
import EarningReports from "./EarningReports";
import RecentlyActivity from "./RecentlyActivity";
import LatestTransactions from "./LatestTransactions";
import { fetchLeadsByAssigneeId } from "../../services/leadService";
import CompactAssignedLeads from "../AssignedLeads/AllAssignedLeads";

const Dashboard = () => {
  const [breadcrumbItems] = useState([
    { title: "Eraxon", link: "/" },
    { title: "Dashboard", link: "#" },
  ]);

  const [reports] = useState([
    {
      icon: "ri-stack-line",
      title: "Orders",
      value: "1452",
      rate: "2.4%",
      desc: "From previous period",
    },
    {
      icon: "ri-store-2-line",
      title: "Vendors",
      value: "2",
      rate: "2.4%",
      desc: "From previous period",
    },
    {
      icon: "ri-briefcase-4-line",
      title: "Clients",
      value: "6",
      rate: "2.4%",
      desc: "From previous period",
    },
    {
      icon: "ri-briefcase-4-line",
      title: "Total Leads",
      value: "0",
      rate: "2.4%",
      desc: "From previous period",
    },
  ]);

  const userId = localStorage.getItem("userId");
  const userRole = localStorage.getItem("userrole");
  const user = JSON.parse(localStorage.getItem("authUser"));

  // State for leads, loading, and error
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch leads when component mounts
  const fetchLeads = async () => {
    try {
      setLoading(true);
      const response = await fetchLeadsByAssigneeId(userId);
      setLeads(response.data || []);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to load leads");
      setLeads([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchLeads();
    }
  }, [userId]);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Dashboard" breadcrumbItems={breadcrumbItems} />
          {userRole === "admin" ? (
            // Admin dashboard
            <>
              <Row>
                <MiniWidgets reports={reports} />
              </Row>
              <Row>
                <Col md={12}>
                  {/* Admin can see all leads or other admin-specific components */}
                  <p>Admin-specific content placeholder</p>
                </Col>
              </Row>
            </>
          ) : (
            // Regular user dashboard showing their assigned leads
            <Row>
              <Col md={12}>
                {loading ? (
                  <p>Loading leads...</p>
                ) : error ? (
                  <Alert color="danger">{error}</Alert>
                ) : (
                  <CompactAssignedLeads userId={userId} leads={leads} />
                )}
              </Col>
            </Row>
          )}
          <Row>
            <Col xl={8}>
              <Row>
                <MiniWidgets reports={reports} />
              </Row>
              <RevenueAnalytics />
            </Col>
            <Col xl={4}>
              <SalesAnalytics />
              <EarningReports />
            </Col>
          </Row>
          <Row>
            <RecentlyActivity userId={userId} userrole={user?.userrole} />
            <LatestTransactions />
          </Row>
          <Row>{/* <ChatBox /> */}</Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Dashboard;
