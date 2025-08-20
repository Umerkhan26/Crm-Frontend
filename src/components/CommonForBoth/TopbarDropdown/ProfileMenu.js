import React, { useState, useEffect } from "react";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

// i18n
import { withTranslation } from "react-i18next";
import { useSelector } from "react-redux";

const ProfileMenu = ({ t }) => {
  const [menu, setMenu] = useState(false);

  const user = useSelector((state) => state.Login.user);

  const username = user?.email
    ? user.email.split("@")[0].charAt(0).toUpperCase() +
      user.email.split("@")[0].slice(1)
    : "Admin";

  const userImage = user?.userImage || "/default-avatar.png";

  const toggle = () => setMenu((prev) => !prev);
  return (
    <React.Fragment>
      <Dropdown
        isOpen={menu}
        toggle={toggle}
        className="d-inline-block user-dropdown"
      >
        <DropdownToggle
          tag="button"
          className="btn header-item waves-effect"
          id="page-header-user-dropdown"
        >
          <img
            className="rounded-circle header-profile-user me-1"
            src={userImage}
            alt="Header Avatar"
            style={{
              width: "42px",
              height: "42px",
              objectFit: "cover",
              objectPosition: "top",
            }}
          />
          <span className="d-none d-xl-inline-block ms-1 text-transform">
            {username}
          </span>
          <i className="mdi mdi-chevron-down d-none ms-1 d-xl-inline-block"></i>
        </DropdownToggle>
        <DropdownMenu className="dropdown-menu-end">
          <DropdownItem href="#">
            <i className="ri-user-line align-middle me-1"></i> {t("Profile")}
          </DropdownItem>
          <DropdownItem href="#">
            <i className="ri-wallet-2-line align-middle me-1"></i>{" "}
            {t("My Wallet")}
          </DropdownItem>
          <DropdownItem className="d-block" href="#">
            <span className="badge badge-success float-end mt-1">11</span>
            <i className="ri-settings-2-line align-middle me-1"></i>{" "}
            {t("Settings")}
          </DropdownItem>
          <DropdownItem href="#">
            <i className="ri-lock-unlock-line align-middle me-1"></i>{" "}
            {t("Lock screen")}
          </DropdownItem>
          <DropdownItem divider />
          <DropdownItem className="text-danger" href="/logout">
            <i className="ri-shut-down-line align-middle me-1 text-danger"></i>{" "}
            {t("Logout")}
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  );
};

export default withTranslation()(ProfileMenu);
