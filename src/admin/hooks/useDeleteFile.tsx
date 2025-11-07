import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import { AppContext } from "../../context/ContextApp";
import { DeleteFileEndpoint } from "../services/fileService";
import { FILE_CACHE_KEY } from "../../constants"; // optional: if you cache file list

export const useDeleteFile = () => {
  const appContext = useContext(AppContext);
  if (!appContext) throw new Error("useDeleteFile must be used within AppContext provider");

  const { showToast } = appContext;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (fileShareId: string) => {
      return await DeleteFileEndpoint(fileShareId);
    },
    onSuccess: () => {
      showToast("File deleted successfully!", "success");
           queryClient.invalidateQueries({queryKey:[FILE_CACHE_KEY]}); 

    },
    onError: (error: any) => {
      const errorMsg = error?.response?.data?.error || error.message || "Failed to delete file";
      showToast(errorMsg, "error");
    },
  });
};
