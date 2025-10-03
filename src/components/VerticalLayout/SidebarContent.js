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

  const handleSubmit = (formData) => {};

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
