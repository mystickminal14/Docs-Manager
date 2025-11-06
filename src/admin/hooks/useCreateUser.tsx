import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import { AppContext } from "../../context/ContextApp";
import type { User } from "../type/User";
import { UserEndpoint } from "../services/UserService";
import { PROFILE_CACHE_KEY } from "../../constants";


const useAddUser = () => {
  const appContext = useContext(AppContext);
  if (!appContext) {
    throw new Error("useAddUser must be used within AppContext provider");
  }
  const { showToast } = appContext;
  const queryClient = useQueryClient(); 
  return useMutation<User, Error, User>({
    mutationFn: (user: User) => UserEndpoint.post(user),
    onSuccess: (data: User) => {
      if (data) {
        showToast("User Created successfully!", "success");
        queryClient.invalidateQueries({ queryKey: [PROFILE_CACHE_KEY] });
      }
    },
    onError: (error: any) => {
      const errorMsg =
        error?.response?.data?.message || error.message || "Application request failed!";
      showToast(errorMsg, "error");
    },
  });
};

export default useAddUser;
