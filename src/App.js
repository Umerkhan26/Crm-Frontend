import React, { Component } from "react";
import { Routes, Route } from "react-router-dom";
import { connect } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";

// Import Routes
import { authProtectedRoutes, publicRoutes } from "./routes";

// layouts
import VerticalLayout from "./components/VerticalLayout/";
import HorizontalLayout from "./components/HorizontalLayout/";
import NonAuthLayout from "./components/NonAuthLayout";

// Import scss
import "./assets/scss/theme.scss";

// Fake backend
import fakeBackend from "./helpers/AuthType/fakeBackend";
import AppRoute from "./routes/route";
import { toast, ToastContainer } from "react-toastify";
import TokenExpiryHandler from "./utils/TokenExpiryHandler";
import { loginUserSuccessful } from "./store/actions";
import { setPermissions } from "./store/Permission/permissionsSlice";

// Activating fake backend
fakeBackend();

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.getLayout = this.getLayout.bind(this);
  }

  componentDidMount() {
    const authUser = localStorage.getItem("authUser");
    if (authUser) {
      const user = JSON.parse(authUser);
      this.props.loginUserSuccessful({
        user,
        token: localStorage.getItem("token"),
      });

      const roleId = user?.role?.id;
      if (roleId) {
        const permissions = JSON.parse(
          localStorage.getItem(`rolePermissions_${roleId}`) || "[]"
        );
        this.props.setPermissions(permissions);
      }
    }

    window.addEventListener("storage", this.handleStorageChange);
  }

  handleStorageChange = (event) => {
    if (event.key.startsWith("permissionsUpdated_")) {
      const updatedRoleId = event.key.split("_")[1];
      const authUser = localStorage.getItem("authUser");
      if (authUser) {
        const user = JSON.parse(authUser);
        if (user.role?.id === parseInt(updatedRoleId, 10)) {
          const permissions = JSON.parse(
            localStorage.getItem(`rolePermissions_${updatedRoleId}`) || "[]"
          );
          this.props.setPermissions(permissions);
          toast.info("Your permissions have been updated");
        }
      }
    }
  };

  componentWillUnmount() {
    window.removeEventListener("storage", this.handleStorageChange);
  }

  /**
   * Returns the layout
   */
  getLayout = () => {
    let layoutCls = VerticalLayout;

    switch (this.props.layout.layoutType) {
      case "horizontal":
        layoutCls = HorizontalLayout;
        break;
      default:
        layoutCls = VerticalLayout;
        break;
    }
    return layoutCls;
  };

  render() {
    const Layout = this.getLayout();

    return (
      <React.Fragment>
        {/* Token expiry watcher */}
        <TokenExpiryHandler />
        <ToastContainer position="top-right" autoClose={3000} />
        <Routes>
          {publicRoutes.map((route, idx) => (
            <Route
              path={route.path}
              element={<NonAuthLayout>{route.component}</NonAuthLayout>}
              key={idx}
            />
          ))}

          {authProtectedRoutes.map((route, idx) => (
            <Route
              path={route.path}
              element={
                <AppRoute>
                  <Layout>{route.component}</Layout>
                </AppRoute>
              }
              key={idx}
            />
          ))}
        </Routes>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    layout: state.Layout,
  };
};

const mapDispatchToProps = {
  loginUserSuccessful,
  setPermissions,
};

export default connect(mapStateToProps, mapDispatchToProps, null)(App);
