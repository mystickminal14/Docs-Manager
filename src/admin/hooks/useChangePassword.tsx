import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import { AppContext } from "../../context/ContextApp";
import type { ChangePassword } from "../type/User";
import { ChangePasswordEndpoint } from "../services/UserService";
import { USER_CACHE_KEY } from "../../constants";

const useChangePassword = () => {
  const appContext = useContext(AppContext);
  if (!appContext) throw new Error("useChangePassword must be used within AppContext provider");

  const { showToast } = appContext;
  const queryClient = useQueryClient();

  return useMutation<ChangePassword, Error, { userId: string; password: string }>({
    mutationFn: ({ userId, password }) => ChangePasswordEndpoint(userId, { password }),
    onSuccess: () => {
      showToast("Password Updated Successfully!!", "success");
     queryClient.invalidateQueries({ queryKey: [USER_CACHE_KEY] });
    },
    onError: (error: any) => {
      const errorMsg = error?.response?.data?.error || error.message || "Update failed!";
      showToast(errorMsg, "error");
    },
  });
};

export default useChangePassword;
