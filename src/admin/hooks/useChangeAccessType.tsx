import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import { AppContext } from "../../context/ContextApp";
import { ChangeAccessTypeEndpoint } from "../services/fileService";
import { FILE_CACHE_KEY } from "../../constants"; // optional: if you cache files

export const useChangeAccessType = () => {
  const appContext = useContext(AppContext);
  if (!appContext) throw new Error("useChangeAccessType must be used within AppContext provider");

  const { showToast } = appContext;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ fileShareId, accessType }: { fileShareId: string; accessType: "Public" | "Private" }) => {
      return await ChangeAccessTypeEndpoint(fileShareId, accessType);
    },
    onSuccess: () => {
      showToast("Access type updated successfully!", "success");
      queryClient.invalidateQueries({queryKey:[FILE_CACHE_KEY]}); 
    },
    onError: (error: any) => {
      const errorMsg = error?.response?.data?.error || error.message || "Failed to update access type";
      showToast(errorMsg, "error");
    },
  });
};
