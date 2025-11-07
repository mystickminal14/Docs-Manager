// src/hooks/useFileUpload.ts
import { useMutation } from "@tanstack/react-query";
import { FileEndpoint } from "../services/fileService";
import { AppContext } from "../../context/ContextApp";
import { useContext } from "react";

interface UploadPayload {
  files: File[];
  category: string;
  displayName?: string;
}

export const useFileUpload = () => {
  const appContext = useContext(AppContext);
  if (!appContext) {
    throw new Error("useFileUpload must be used within AppContext provider");
  }

  const { showToast } = appContext;

  return useMutation({
    mutationFn: async ({ files, category, displayName }: UploadPayload) => {
      if (!files.length) throw new Error("No files selected!");
      return await FileEndpoint.upload(files, category, displayName);
    },
    onSuccess: (data) => {
      showToast("Files uploaded successfully!", "success");
      console.log("Upload result:", data);
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "File upload failed!";
      showToast(message, "error");
    },
  });
};
