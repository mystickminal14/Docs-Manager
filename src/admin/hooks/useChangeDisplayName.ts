import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import { AppContext } from "../../context/ContextApp";
import { ChangeDisplayNameEndpoint } from "../services/fileService";
import { FILE_CACHE_KEY } from "../../constants";

interface ChangeDisplayNamePayload {
  fileShareId: string;
  displayName: string;
}

export const useChangeDisplayName = () => {
  const appContext = useContext(AppContext);
  if (!appContext) {
    throw new Error("useChangeDisplayName must be used within AppContext provider");
  }

  const { showToast } = appContext;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ fileShareId, displayName }: ChangeDisplayNamePayload) => {
      return await ChangeDisplayNameEndpoint(fileShareId, displayName);
    },

    onSuccess: () => {
      showToast("Display name updated successfully!", "success");
      queryClient.invalidateQueries({ queryKey: [FILE_CACHE_KEY] });
    },

    onError: (error: any) => {
      const data = error?.response?.data;

      // Handle validation errors
      if (data && typeof data === "object") {
        const fieldErrors: string[] = [];
        Object.entries(data).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            value.forEach((msg) => fieldErrors.push(`${key}: ${msg}`));
          } else if (typeof value === "string") {
            fieldErrors.push(`${key}: ${value}`);
          }
        });

        if (fieldErrors.length > 0) {
          fieldErrors.forEach((msg) => showToast(msg, "error"));
          return;
        }
      }

      const errorMsg = data?.message || error.message || "Failed to update display name!";
      showToast(errorMsg, "error");
    },
  });
};
