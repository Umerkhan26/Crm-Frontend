// components/TokenExpiryHandler.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isTokenExpired } from "../utils/auth";

const TokenExpiryHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      const token = localStorage.getItem("token");
      if (token && isTokenExpired(token)) {
        localStorage.clear();
        navigate("/login", { replace: true });
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [navigate]);

  return null;
};

export default TokenExpiryHandler;
