import React from "react";
import { Navigate } from "react-router-dom";

import Login from "../pages/Authentication/Login";
import Logout from "../pages/Authentication/Logout";
import Register from "../pages/Authentication/Register";
import ForgetPwd from "../pages/Authentication/ForgetPassword";
import AuthLockScreen from "../pages/Authentication/AuthLockScreen";

// Dashboard
import Dashboard from "../pages/Dashboard/index";

// Pages Calendar
import Calendar from "../pages/Calendar/Calendar";

// Pages Component
import Chat from "../pages/Chat/Chat";

//Email
import EmailInbox from "../pages/Email/email-inbox";
import EmailRead from "../pages/Email/email-read";

// Charts
import ChartApex from "../pages/Charts/Apexcharts";
import ChartjsChart from "../pages/Charts/ChartjsChart";
import SparklineChart from "../pages/Charts/SparklineChart";
import ChartsKnob from "../pages/Charts/jquery-knob";

import Maintenance from "../pages/Utility/Maintenance";
import CommingSoon from "../pages/Utility/CommingSoon";
import Error404 from "../pages/Utility/Error404";
import Error500 from "../pages/Utility/Error500";

//Tables
import BasicTables from "../pages/Tables/BasicTables";
import DatatableTables from "../pages/Tables/DatatableTables";
import ResponsiveTables from "../pages/Tables/ResponsiveTables";

// Inner Authentication
import Login1 from "../pages/AuthenticationInner/Login";
import Register1 from "../pages/AuthenticationInner/Register";
import ForgetPwd1 from "../pages/AuthenticationInner/ForgetPassword";
import AllUsers from "../pages/Users/User";
import AllClient from "../pages/Users/Client";
import CreateCampaign from "../pages/Campaigns/CreateCampaign";
import AllCampaigns from "../pages/Campaigns/AllCampaign";
import NewOrder from "../pages/Order/CreateOrder";
import Allorders from "../pages/Order/AllOrders";
import AddLeads from "../pages/Leads/AddLeads";
import ClientLeads from "../pages/Leads/ClientLeads";
import MasterLead from "../pages/Leads/MasterLead";
import MyReferrals from "../pages/Referrals/MyReferral";
import EmailTemplate from "../pages/Setting/EmailTemplete";
import EmailNotification from "../pages/Setting/EmailNotification";
import Notification from "../pages/Setting/Notification";
import ActivityLog from "../pages/Setting/ActivityLog";
import SystemSettingsForm from "../pages/Setting/SystemSettingsForm";
import RegisterUser from "../pages/Users/Regestration Form";
import AllRole from "../pages/Role/AllRole";
import CreateRole from "../pages/Role/CreateRole";
// import Product from "../pages/Product/Product";
import AssignedLeads from "../pages/AssignedLeads";
import UserDetailsPage from "../pages/Users/UserDetailsPage";
// import NewProductSale from "../pages/Product/CreateProduct";
import NewProduct from "../pages/Product/CreateProduct";
import AllProducts from "../pages/Product/AllProducts";
import Sale from "../pages/Product/Sales";
// import LeadDetailModal from "../components/Modals/LeadDetailModal";
// import LeadDetailPage from "../pages/AssignedLeads/AssignedLeadDetailPage";
import AssignedLeadDetailPage from "../pages/AssignedLeads/AssignedLeadDetailPage";
import SaleDetails from "../pages/Product/SaleDetailsPage";
import ClientLeadDetailPage from "../components/Modals/ClientLeadDetailPage";
import MasterLeadDetailPage from "../components/Modals/LeadDetailPage";

const authProtectedRoutes = [
  // Tables
  { path: "/basic-tables", component: <BasicTables /> },
  { path: "/datatable-table", component: <DatatableTables /> },
  {
    path: "/allUsers",
    component: <AllUsers />,
    requiredPermissions: ["user:get", "user:getById"],
  },

  {
    path: "/user-details/:userId",
    component: <UserDetailsPage />,
    requiredPermissions: ["user:get", "user:getById"],
  },
  {
    path: "/user-register",
    component: <RegisterUser />,
    requiredPermissions: ["user:create"],
  },
  {
    path: "/all-client",
    component: <AllClient />,
    requiredPermissions: ["user:get"],
  },
  // Campaigns
  {
    path: "/create-campaign",
    component: <CreateCampaign />,
    requiredPermissions: ["campaign:create"],
  },
  {
    path: "/campaign-index",
    component: <AllCampaigns />,
    requiredPermissions: ["campaign:get"],
  },
  // Orders
  {
    path: "/create-order",
    component: <NewOrder />,
    requiredPermissions: ["order:create"],
  },
  {
    path: "/order-index",
    component: <Allorders />,
    requiredPermissions: ["order:get"],
  },
  // Leads
  {
    path: "/add-lead",
    component: <AddLeads />,
    requiredPermissions: ["lead:create"],
  },
  {
    path: "/lead-index",
    component: <ClientLeads />,
    requiredPermissions: ["clientLead:getAll"],
  },

  {
    path: "/client-leads/:leadId",
    component: <ClientLeadDetailPage />,
    requiredPermissions: ["clientLead:view"],
    exact: true,
  },
  {
    path: "/master-lead-index",
    component: <MasterLead />,
    requiredPermissions: ["lead:getAll"],
  },

  {
    path: "/master-leads/:leadId",
    component: <MasterLeadDetailPage />,
    requiredPermissions: ["lead:view"],
    exact: true,
  },

  // {
  //   path: "/master-leads/:leadId",
  //   component: <MasterLeadDetailPage />,
  // },

  {
    path: "/user-details/:userId",
    component: <UserDetailsPage />,
    requiredPermissions: ["user:get"],
    exact: true,
  },
  {
    path: "/assigned-leads",
    component: <AssignedLeads />,
    requiredPermissions: ["assignedLead:getByAssignee"],
    exact: true,
  },
  {
    path: "/leads/:leadId",
    component: <AssignedLeadDetailPage />,
    requiredPermissions: ["note:view"],
    exact: true,
  },

  {
    path: "/create-product",
    component: <NewProduct />,
    requiredPermissions: ["PRODUCT_CREATE"],
  },
  {
    path: "/all-products",
    component: <AllProducts />,
    requiredPermissions: ["PRODUCT_GET_ALL"],
  },

  {
    path: "/all-sales",
    component: <Sale />,
    requiredPermissions: [
      "SALE_GET_ALL",
      "SALE_GET_BY_ID",
      "SALE_GET_BY_ASSIGNEE",
    ],
  },
  {
    path: "/sale-details/:id",
    component: <SaleDetails />,
    requiredPermissions: ["PRODUCT_SALE_GET_ALL", "PRODUCT_"],
  },
  { path: "/all-referral", component: <MyReferrals /> },
  { path: "/allEmail", component: <EmailTemplate /> },
  { path: "/email-action", component: <EmailNotification /> },
  { path: "/all-notifications", component: <Notification /> },
  { path: "/all-activities", component: <ActivityLog /> },
  { path: "/settings", component: <SystemSettingsForm /> },

  {
    path: "/create-role",
    component: <CreateRole />,
    requiredPermissions: [], // Handled by sidebar
  },
  {
    path: "/role-index",
    component: <AllRole />,
    requiredPermissions: [], // Handled by sidebar
  },

  { path: "/responsive-table", component: <ResponsiveTables /> },

  //Charts
  { path: "/apex-charts", component: <ChartApex /> },
  { path: "/chartjs", component: <ChartjsChart /> },
  { path: "/charts-sparkline", component: <SparklineChart /> },
  { path: "/charts-knob", component: <ChartsKnob /> },

  //Email
  { path: "/email-inbox", component: <EmailInbox /> },
  { path: "/email-read", component: <EmailRead /> },

  //chat
  { path: "/chat", component: <Chat /> },

  //calendar
  { path: "/calendar", component: <Calendar /> },

  { path: "/dashboard", component: <Dashboard /> },

  // this route should be at the end of all other routes
  { path: "/", exact: true, component: <Navigate to="/dashboard" /> },
];

const publicRoutes = [
  { path: "/logout", component: <Logout /> },
  { path: "/login", component: <Login /> },
  { path: "/forgot-password", component: <ForgetPwd /> },
  { path: "/register", component: <Register /> },
  { path: "/lock-screen", component: <AuthLockScreen /> },

  // Authentication Inner
  { path: "/auth-login", component: <Login1 /> },
  { path: "/auth-register", component: <Register1 /> },
  { path: "/auth-recoverpw", component: <ForgetPwd1 /> },

  { path: "/maintenance", component: <Maintenance /> },
  { path: "/comingsoon", component: <CommingSoon /> },
  { path: "/404", component: <Error404 /> },
  { path: "/500", component: <Error500 /> },
];

export { authProtectedRoutes, publicRoutes };
