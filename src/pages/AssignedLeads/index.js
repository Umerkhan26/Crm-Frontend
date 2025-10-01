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
