import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { apiError } from "../store/actions";

const TokenExpiryHandler = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if token exists in localStorage
    const token = localStorage.getItem("token");
    const authUser = localStorage.getItem("authUser");

    if (!token || !authUser) {
      // If no token or user data, clear localStorage and redirect to login
      localStorage.removeItem("authUser");
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("rolePermissions");
      dispatch(apiError("No session found"));
      navigate("/login", { replace: true });
    }
  }, [dispatch, navigate]);

  return null; // This component doesn't render anything
};

export default TokenExpiryHandler;
