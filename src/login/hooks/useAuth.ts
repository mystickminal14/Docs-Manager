import { useContext } from "react";
import { AppContext } from "../../context/ContextApp";

export const useAuth = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAuth must be used within AppContext provider");
  }
  return {
    user: context.user,
    logout: context.logout,
  };
};