// src/hooks/useFileUpload.ts
import { useMutation } from "@tanstack/react-query";
import { useAppContext } from "../../context/ContextApp";
import { FileEndpoint } from "../services/fileService";


export const useFileUpload = () => {
  const { showToast } = useAppContext();

  return useMutation({
    mutationFn: async (files: File[]) => {
      if (!files.length) throw new Error("No files selected!");
      return await FileEndpoint.upload(files);
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
