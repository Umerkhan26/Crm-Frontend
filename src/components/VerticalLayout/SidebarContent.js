// import React, { useEffect, useRef, useState } from "react";
// import MetisMenu from "metismenujs";
// import { Link } from "react-router-dom";
// import { withTranslation } from "react-i18next";
// import { connect } from "react-redux";
// import {
//   changeLayout,
//   changeLayoutWidth,
//   changeSidebarTheme,
//   changeSidebarType,
//   changePreloader,
// } from "../../store/actions";
// import withRouter from "../Common/withRouter";
// import ModalWrapper from "../Modals/ModalWrapper";
// import SendReferral from "../../pages/Referrals/SendReferrals";

// const SidebarContent = (props) => {
//   const [pathName, setPathName] = useState(props.router.location.pathname);
//   const metisRef = useRef(null);
//   useEffect(() => {
//     const initMenuWithDelay = () => {
//       if (metisRef.current) {
//         metisRef.current.dispose();
//       }
//       metisRef.current = new MetisMenu("#side-menu");

//       // Check if we're coming from a campaign context
//       const fromCampaignContext = sessionStorage.getItem("fromCampaignContext");
//       const fromCampaignLink = sessionStorage.getItem("fromCampaignLink");

//       if (
//         fromCampaignContext ||
//         fromCampaignLink ||
//         (props.router.location.pathname === "/order-index" &&
//           props.router.location.search.includes("campaign="))
//       ) {
//         // Find the campaigns menu element
//         const campaignsMenu = document.getElementById("campaigns-menu");
//         if (campaignsMenu) {
//           // Manually activate the menu hierarchy
//           activateParentDropdown(campaignsMenu);
//         }

//         // Clear the flags
//         sessionStorage.removeItem("fromCampaignContext");
//         sessionStorage.removeItem("fromCampaignLink");
//       } else {
//         // Normal menu activation
//         const ul = document.getElementById("side-menu");
//         if (!ul) return;

//         const items = ul.getElementsByTagName("a");
//         let matchingMenuItem = null;

//         for (let i = 0; i < items.length; ++i) {
//           if (items[i].pathname === window.location.pathname) {
//             matchingMenuItem = items[i];
//             break;
//           }
//         }

//         if (matchingMenuItem) {
//           activateParentDropdown(matchingMenuItem);
//         }
//       }
//     };

//     const timer = setTimeout(initMenuWithDelay, 300);
//     return () => clearTimeout(timer);
//   }, [props.router.location.pathname, props.router.location.search]);

//   useEffect(() => {
//     if (props.router.location.pathname !== pathName) {
//       setPathName(props.router.location.pathname);
//       setTimeout(() => {
//         initMenu();
//       }, 100);
//       window.scrollTo({ top: 0, behavior: "smooth" });
//     }
//   }, [props.router.location.pathname]);

//   const initMenu = () => {
//     if (metisRef.current) {
//       metisRef.current.dispose();
//     }
//     metisRef.current = new MetisMenu("#side-menu");

//     const ul = document.getElementById("side-menu");
//     if (!ul) return;

//     const items = ul.getElementsByTagName("a");
//     let matchingMenuItem = null;

//     for (let i = 0; i < items.length; ++i) {
//       if (items[i].pathname === window.location.pathname) {
//         matchingMenuItem = items[i];
//         break;
//       }
//     }

//     if (matchingMenuItem) {
//       activateParentDropdown(matchingMenuItem);
//     }
//   };

//   const activateParentDropdown = (item) => {
//     item.classList.add("active");
//     const parent = item.parentElement;

//     if (parent) {
//       parent.classList.add("mm-active");
//       const parent2 = parent.parentElement;

//       if (parent2) {
//         parent2.classList.add("mm-show");

//         const parent3 = parent2.parentElement;

//         if (parent3) {
//           parent3.classList.add("mm-active"); // li
//           parent3.childNodes[0].classList.add("mm-active"); //a
//           const parent4 = parent3.parentElement;
//           if (parent4) {
//             parent4.classList.add("mm-active");
//           }
//         }
//       }
//       return false;
//     }
//     return false;
//   };

//   const handleSubmit = (formData) => {
//     console.log("Form submitted:", formData);
//     // Handle form submission
//   };

//   return (
//     <React.Fragment>
//       <div id="sidebar-menu">
//         <ul className="metismenu list-unstyled" id="side-menu">
//           {/* <li className="menu-title">{props.t("Menu")}</li> */}

//           <li>
//             <Link to="/dashboard" className="waves-effect">
//               <i className="ri-dashboard-line"></i>
//               <span className="badge rounded-pill bg-success float-end">3</span>
//               <span className="ms-1">{props.t("Dashboard")}</span>
//             </Link>
//           </li>

//           <li>
//             <Link to="/chat" className="waves-effect">
//               <i className="ri-chat-1-line"></i>
//               <span className="ms-1">{props.t("Chat")}</span>
//             </Link>
//           </li>

//           {/* <li>
//             <Link to="/#" className="has-arrow waves-effect">
//               <i className="ri-mail-send-line"></i>
//               <span className="ms-1">{props.t("Email")}</span>
//             </Link>
//             <ul className="sub-menu">
//               <li>
//                 <Link to="/email-inbox">{props.t("Inbox")}</Link>
//               </li>
//               <li>
//                 <Link to="/email-read">{props.t("Read Email")}</Link>
//               </li>
//             </ul>
//           </li> */}

//           <li>
//             <Link to="/#" className="has-arrow waves-effect">
//               <i className="ri-shield-user-line"></i>
//               <span className="ms-1">{props.t("Role")}</span>
//             </Link>

//             <ul className="sub-menu">
//               <li>
//                 <Link to="/create-role">{props.t("Create Role")}</Link>
//               </li>
//               <li>
//                 <Link to="/role-index">{props.t("All Role")}</Link>
//               </li>
//             </ul>
//           </li>

//           {/* <li className="menu-title">{props.t("Components")}</li> */}
//           {/* {userRole === "admin" && ( */}
//           <>
//             <li>
//               <Link to="/#" className="has-arrow waves-effect">
//                 <i className="ri-user-line"></i>
//                 <span className="ms-1">{props.t("Users")}</span>
//               </Link>

//               <ul className="sub-menu">
//                 <li>
//                   <Link to="/allUsers">{props.t("All Users")}</Link>
//                 </li>
//                 <li>
//                   <Link to="/user-register">
//                     {props.t("User Registration")}
//                   </Link>
//                 </li>
//                 <li>
//                   <Link to="/all-client">{props.t("Clientele")}</Link>
//                 </li>
//               </ul>
//             </li>
//           </>
//           {/* )} */}

//           <li>
//             <Link
//               to="/#"
//               className="has-arrow waves-effect"
//               id="campaigns-menu"
//             >
//               <i className="ri-broadcast-line"></i>
//               <span className="ms-1">{props.t("Campaigns")}</span>
//             </Link>

//             <ul className="sub-menu">
//               <li>
//                 <Link to="/campaign-index">{props.t("All Campaigns")}</Link>
//               </li>
//               <li>
//                 <Link to="/create-campaign">{props.t("Create Campaigns")}</Link>
//               </li>
//             </ul>
//           </li>

//           <li>
//             <Link to="/#" className="has-arrow waves-effect">
//               <i className="ri-shopping-cart-line"></i>
//               <span className="ms-1">{props.t("Orders")}</span>
//             </Link>

//             <ul className="sub-menu">
//               <li>
//                 <Link to="/order-index">{props.t("All Orders")}</Link>
//               </li>

//               <li>
//                 <Link to="/create-order">{props.t("Create New Order")}</Link>
//               </li>
//             </ul>
//           </li>

//           <li>
//             <Link to="/#" className="has-arrow waves-effect">
//               <i className="ri-user-search-line"></i>
//               <span className="ms-1">{props.t("Leads")}</span>
//             </Link>

//             <ul className="sub-menu">
//               <li>
//                 <Link to="/master-lead-index">
//                   {props.t("Master Leads (Leads Center)")}
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/lead-index">{props.t("Client Leads")}</Link>
//               </li>
//               <li>
//                 <Link to="/add-lead">{props.t("Add Leads")}</Link>
//               </li>
//             </ul>
//           </li>

//           <li>
//             <Link
//               to="/#"
//               className="has-arrow waves-effect"
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 padding: "6px 24px",
//                 color: "#6c757d",
//                 textDecoration: "none",
//                 fontSize: "14px",
//                 transition: "all 0.3s",
//               }}
//               onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
//               onMouseLeave={(e) => (e.currentTarget.style.color = "#6c757d")}
//             >
//               <div
//                 style={{ display: "flex", alignItems: "center", flexGrow: 1 }}
//               >
//                 <i className="ri-group-line"></i>
//                 <span style={{ marginLeft: "4px" }}>
//                   {props.t("Referrals")}
//                 </span>
//               </div>
//               <i
//                 // className="ri-arrow-right-s-line"
//                 style={{ fontSize: "1rem" }}
//               ></i>
//             </Link>
//             <ul className="sub-menu" style={{ paddingLeft: "0" }}>
//               <li>
//                 <ModalWrapper
//                   title="Client Referral"
//                   triggerComponent={
//                     <div
//                       style={{
//                         display: "block",
//                         padding: "6px 24px 6px 52px",
//                         color: "#6c757d",
//                         cursor: "pointer",
//                         transition: "all 0.3s",
//                         textDecoration: "none",
//                       }}
//                       onMouseEnter={(e) =>
//                         (e.currentTarget.style.color = "#fff")
//                       }
//                       onMouseLeave={(e) =>
//                         (e.currentTarget.style.color = "#6c757d")
//                       }
//                       className="waves-effect"
//                     >
//                       {props.t("Send Referral")}
//                     </div>
//                   }
//                 >
//                   <SendReferral onSubmit={handleSubmit} />
//                 </ModalWrapper>
//               </li>
//               <li>
//                 <Link
//                   to="/all-referral"
//                   style={{
//                     display: "block",
//                     padding: "6px 24px 6px 52px",
//                     color: "#6c757d",
//                     textDecoration: "none",
//                     transition: "all 0.3s",
//                   }}
//                   onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
//                   onMouseLeave={(e) =>
//                     (e.currentTarget.style.color = "#6c757d")
//                   }
//                   className="waves-effect"
//                 >
//                   {props.t("My Referrals")}
//                 </Link>
//               </li>
//             </ul>
//           </li>

//           <li>
//             <Link to="/#" className="has-arrow waves-effect">
//               <i className="ri-settings-3-line"></i>
//               <span className="ms-1">{props.t("Settings")}</span>
//             </Link>

//             <ul className="sub-menu">
//               <li>
//                 <Link to="/allEmail">{props.t("Email Template")}</Link>
//               </li>
//               <li>
//                 <Link to="/email-action">{props.t("Email Action")}</Link>
//               </li>
//               <li>
//                 <Link to="/all-notifications">{props.t("Notification")}</Link>
//               </li>

//               <li>
//                 <Link to="/all-activities">{props.t("Activity Logs")}</Link>
//               </li>
//               <li>
//                 <Link to="/settings">{props.t("System Settings")}</Link>
//               </li>
//             </ul>
//           </li>
//         </ul>
//       </div>
//     </React.Fragment>
//   );
// };

// const mapStatetoProps = (state) => {
//   return { ...state.Layout };
// };

// export default withRouter(
//   connect(mapStatetoProps, {
//     changeLayout,
//     changeSidebarTheme,
//     changeSidebarType,
//     changeLayoutWidth,
//     changePreloader,
//   })(withTranslation()(SidebarContent))
// );

import React, { useEffect, useRef } from "react";
import MetisMenu from "metismenujs";
import { Link } from "react-router-dom";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { getMenuItems } from "../../utils/permissions";
import SendReferral from "../../pages/Referrals/SendReferrals";
import MenuItemWithModal from "../Modals/MenuItemWithModal";
import {
  changeLayout,
  changeLayoutWidth,
  changePreloader,
  changeSidebarTheme,
  changeSidebarType,
} from "../../store/actions";
import withRouter from "../Common/withRouter";

const SidebarContent = (props) => {
  const metisRef = useRef(null);
  const { user, router } = props;
  const menuItems = getMenuItems(user);

  useEffect(() => {
    const initMenu = () => {
      if (metisRef.current) {
        metisRef.current.dispose();
      }
      metisRef.current = new MetisMenu("#side-menu");

      const { pathname, search } = router.location;
      const queryParams = new URLSearchParams(search);
      const campaignId = queryParams.get("campaign");
      const orderId = queryParams.get("orderId");

      const ul = document.getElementById("side-menu");
      if (!ul) return;

      let matchingMenuItem = null;
      const items = ul.getElementsByTagName("a");

      // Check if navigating to assigned-leads with query params
      if (
        pathname.includes("/assigned-leads") &&
        (campaignId || queryParams.get("userId"))
      ) {
        matchingMenuItem = document.querySelector('a[href="/assigned-leads"]');
        sessionStorage.setItem("fromAssignedLeadsLink", "true");
      } else if (campaignId && pathname.includes("/order-index")) {
        matchingMenuItem = document.querySelector("#campaigns-menu a");
        sessionStorage.setItem("fromCampaignLink", "true");
      } else if (orderId && pathname.includes("/lead-index")) {
        matchingMenuItem = document.querySelector("#orders-menu a");
        sessionStorage.setItem("fromOrderLink", "true");
      } else {
        // Normal menu activation based on pathname
        for (let i = 0; i < items.length; ++i) {
          if (items[i].pathname === pathname) {
            matchingMenuItem = items[i];
            break;
          }
        }
      }

      if (matchingMenuItem) {
        activateParentDropdown(matchingMenuItem);
      }

      // Clear sessionStorage flags after activation
      sessionStorage.removeItem("fromAssignedLeadsLink");
      sessionStorage.removeItem("fromCampaignLink");
      sessionStorage.removeItem("fromOrderLink");
    };

    initMenu();

    return () => {
      if (metisRef.current) {
        metisRef.current.dispose();
      }
    };
  }, [router.location.pathname, router.location.search]);

  const activateParentDropdown = (item) => {
    item.classList.add("active");
    const parent = item.parentElement;

    if (parent) {
      parent.classList.add("mm-active");
      const parent2 = parent.parentElement;

      if (parent2) {
        parent2.classList.add("mm-show");
        const parent3 = parent2.parentElement;

        if (parent3) {
          parent3.classList.add("mm-active");
          parent3.childNodes[0].classList.add("mm-active");
          const parent4 = parent3.parentElement;
          if (parent4) {
            parent4.classList.add("mm-active");
          }
        }
      }
    }
  };

  const handleSubmit = (formData) => {
    console.log("Form submitted:", formData);
  };

  const renderMenuItems = () => {
    return menuItems.map((item, index) => {
      const menuId = item.title.toLowerCase().replace(/\s+/g, "-") + "-menu";
      if (item.subItems) {
        return (
          <li key={index}>
            <Link to="/#" className="has-arrow waves-effect" id={menuId}>
              <i className={item.icon}></i>
              <span className="ms-1">{props.t(item.title)}</span>
            </Link>
            <ul className="sub-menu">
              {item.subItems.map((subItem, subIndex) => {
                if (subItem.modal) {
                  return (
                    <li key={subIndex}>
                      <MenuItemWithModal
                        title={props.t(subItem.title)}
                        modalTitle="Client Referral"
                        ModalContent={<SendReferral onSubmit={handleSubmit} />}
                      />
                    </li>
                  );
                }
                return (
                  <li key={subIndex}>
                    <Link to={subItem.path}>{props.t(subItem.title)}</Link>
                  </li>
                );
              })}
            </ul>
          </li>
        );
      }
      return (
        <li key={index}>
          <Link to={item.path} className="waves-effect">
            <i className={item.icon}></i>
            <span className="ms-1">{props.t(item.title)}</span>
          </Link>
        </li>
      );
    });
  };

  return (
    <React.Fragment>
      <div id="sidebar-menu">
        <ul className="metismenu list-unstyled" id="side-menu">
          {renderMenuItems()}
        </ul>
      </div>
    </React.Fragment>
  );
};

const mapStatetoProps = (state) => {
  return {
    ...state.Layout,
    user: state.Login.user,
  };
};

export default withRouter(
  connect(mapStatetoProps, {
    changeLayout,
    changeSidebarTheme,
    changeSidebarType,
    changeLayoutWidth,
    changePreloader,
  })(withTranslation()(SidebarContent))
);
