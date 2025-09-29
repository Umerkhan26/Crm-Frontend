import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { logoutUserSuccess } from "../store/actions";
import { isTokenExpired } from "./auth";

const TokenExpiryHandler = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const interval = setInterval(() => {
      const token = localStorage.getItem("token");
      if (token && isTokenExpired(token)) {
        localStorage.clear();
        dispatch(logoutUserSuccess());
        window.location.href = "/login"; // Force redirect
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [dispatch]);

  return null;
};

export default TokenExpiryHandler;
