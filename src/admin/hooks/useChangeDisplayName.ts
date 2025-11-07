// src/hooks/useDisableUser.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AppContext } from "../../context/ContextApp";
import { useContext } from "react";
import { displayNameUrl,  } from "../services/UserService";
import { FILE_CACHE_KEY } from "../../constants";

export interface DisplayModel {
  displayName:string
}

export const useDisableUser = () => {
  const appContext = useContext(AppContext);
  if (!appContext) {
    throw new Error("useDisableUser must be used within AppContext provider");
  }

  const { showToast } = appContext;
  const queryClient = useQueryClient();

  return useMutation({

    mutationFn: async ({ displayName}: DisplayModel) => {
     
      return await displayNameUrl.put({displayName});
    },
    onSuccess: (data) => {
      showToast("User is Active", "success");
      queryClient.invalidateQueries({
                queryKey: [FILE_CACHE_KEY],
              })
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
