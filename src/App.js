import React, { Component } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
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

//Fake backend
import fakeBackend from "./helpers/AuthType/fakeBackend";
import AppRoute from "./routes/route";
import { ToastContainer } from "react-toastify";
import { isTokenExpired } from "./utils/auth";

// Activating fake backend
fakeBackend();

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.getLayout = this.getLayout.bind(this);
  }

  componentDidMount() {
    this.tokenCheckInterval = setInterval(() => {
      const token = localStorage.getItem("token");
      if (token && isTokenExpired(token)) {
        localStorage.clear(); // Clear session
        this.setState({ shouldLogout: true });
      }
    }, 60000); // Check every minute
  }

  componentWillUnmount() {
    clearInterval(this.tokenCheckInterval);
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
    if (this.state.shouldLogout) {
      return <Navigate to="/login" replace />;
    }

    const Layout = this.getLayout();
    return (
      <React.Fragment>
        {/* <Router>
					<Routes>
						{publicRoutes.map((route, idx) => (
							<AppRoute
								path={route.path}
								layout={NonAuthLayout}
								component={route.component}
								key={idx}
								isAuthProtected={false}
							/>
						))}

						{authProtectedRoutes.map((route, idx) => (
							<AppRoute
								path={route.path}
								layout={Layout}
								component={route.component}
								key={idx}
								isAuthProtected={true}
							/>
						))}
					</Routes>
				</Router> */}
        <ToastContainer position="top-right" autoClose={3000} />
        <Routes>
          {publicRoutes.map((route, idx) => (
            <Route
              path={route.path}
              element={<NonAuthLayout>{route.component}</NonAuthLayout>}
              key={idx}
              exact={true}
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
              exact={true}
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

export default connect(mapStateToProps, null)(App);

// import React, { useEffect, useState, useMemo } from "react";
// import { Routes, Route, Navigate } from "react-router-dom";
// import { useSelector } from "react-redux";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "react-toastify/dist/ReactToastify.css";

// // Import Routes
// import { authProtectedRoutes, publicRoutes } from "./routes";

// // Layouts
// import VerticalLayout from "./components/VerticalLayout/";
// import HorizontalLayout from "./components/HorizontalLayout/";
// import NonAuthLayout from "./components/NonAuthLayout";

// // Styles and utilities
// import "./assets/scss/theme.scss";
// import { ToastContainer } from "react-toastify";
// import { isTokenExpired } from "./utils/auth";
// import AppRoute from "./routes/route";

// // Activate fake backend
// import fakeBackend from "./helpers/AuthType/fakeBackend";
// fakeBackend();

// const App = () => {
//   const layoutType = useSelector((state) => state.Layout.layoutType);
//   const [shouldLogout, setShouldLogout] = useState(false);

//   // Determine layout component
//   const Layout = useMemo(() => {
//     return layoutType === "horizontal" ? HorizontalLayout : VerticalLayout;
//   }, [layoutType]);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       const token = localStorage.getItem("token");
//       if (token && isTokenExpired(token)) {
//         localStorage.clear();
//         setShouldLogout(true);
//       }
//     }, 60000);

//     return () => clearInterval(interval);
//   }, []);

//   if (shouldLogout) {
//     return <Navigate to="/login" replace />;
//   }

//   return (
//     <React.Fragment>
//       <ToastContainer position="top-right" autoClose={3000} />
//       <Routes>
//         {publicRoutes.map((route, idx) => (
//           <Route
//             path={route.path}
//             element={<NonAuthLayout>{route.component}</NonAuthLayout>}
//             key={idx}
//             exact={true}
//           />
//         ))}

//         {authProtectedRoutes.map((route, idx) => (
//           <Route
//             path={route.path}
//             element={
//               <AppRoute>
//                 <Layout>{route.component}</Layout>
//               </AppRoute>
//             }
//             key={idx}
//             exact={true}
//           />
//         ))}
//       </Routes>
//     </React.Fragment>
//   );
// };

// export default App;
