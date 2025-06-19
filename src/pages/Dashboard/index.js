import React, { Component, useState } from "react";
import { Container, Row, Col } from "reactstrap";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

//Import Components
import MiniWidgets from "./MiniWidgets";
import RevenueAnalytics from "./RevenueAnalytics";
import SalesAnalytics from "./SalesAnalytics";
import EarningReports from "./EarningReports";
import Sources from "./Sources";
import RecentlyActivity from "./RecentlyActivity";
import RevenueByLocations from "./RevenueByLocations";
import ChatBox from "./ChatBox";
import LatestTransactions from "./LatestTransactions";

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

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Dashboard" breadcrumbItems={breadcrumbItems} />
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
            <RecentlyActivity userId={userId} />{" "}
            {/* Fallback to 1 if no userId */}
            <LatestTransactions />
          </Row>
          <Row>{/* <ChatBox /> */}</Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Dashboard;
