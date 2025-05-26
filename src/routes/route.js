// import React from "react";
// import { Navigate } from "react-router-dom";

// const AppRoute = ({
// 	component: Component,
// 	layout: Layout,
// 	isAuthProtected,
// 	...rest
// }) => (
// 		<Route
// 			{...rest}
// 			render={props => {

// 				if (isAuthProtected && !localStorage.getItem("authUser")) {
// 					return (
// 						<Navigate to={{ pathname: "/login", state: { from: props.location } }} />
// 					);
// 				}

// 				return (
// 					<Layout>
// 						<Component {...props} />
// 					</Layout>
// 				);
// 			}}
// 		/>
// 	);

// const AppRoute = (props) => {
// 	if (!localStorage.getItem("authUser")) {
// 		return (
// 		  <Navigate to={{ pathname: "/login", state: { from: props.location } }} />
// 		);
// 	  }
// 	  return (<React.Fragment>
// 		{props.children}
// 	  </React.Fragment>);
// }

// export default AppRoute;

// AppRoute.jsx

import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const AppRoute = ({ children }) => {
  const location = useLocation();
  const isAuthenticated = !!localStorage.getItem("authUser");

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default AppRoute;
