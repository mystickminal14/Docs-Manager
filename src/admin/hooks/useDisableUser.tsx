// src/hooks/useDisableUser.ts
import { useMutation } from "@tanstack/react-query";
import { AppContext } from "../../context/ContextApp";
import { useContext } from "react";
import { DisableUser,  } from "../services/UserService";

export interface UserIdModel {
  userId:string
}

export const useDisableUser = () => {
  const appContext = useContext(AppContext);
  if (!appContext) {
    throw new Error("useDisableUser must be used within AppContext provider");
  }

  const { showToast } = appContext;

  return useMutation({

    mutationFn: async ({ userId}: UserIdModel) => {
     
      return await DisableUser.post({userId});
    },
    onSuccess: (data) => {
      showToast("User is Active", "success");
      console.log("Upload result:", data);
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to disable user!";
      showToast(message, "error");
    },
  });
};
