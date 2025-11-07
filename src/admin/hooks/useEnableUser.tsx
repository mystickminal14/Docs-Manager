// src/hooks/useEnableUser.ts
import { useMutation } from "@tanstack/react-query";
import { AppContext } from "../../context/ContextApp";
import { useContext } from "react";
import { EnableUser } from "../services/UserService";

export interface UserIdModel {
  userId:string
}

export const useEnableUser = () => {
  const appContext = useContext(AppContext);
  if (!appContext) {
    throw new Error("useEnableUser must be used within AppContext provider");
  }

  const { showToast } = appContext;

  return useMutation({
    mutationFn: async ({ userId}: UserIdModel) => {
     
      return await EnableUser.post({userId});
    },
    onSuccess: (data) => {
      showToast("User is Active", "success");
      console.log("Upload result:", data);
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "File to enable user!";
      showToast(message, "error");
    },
  });
};
