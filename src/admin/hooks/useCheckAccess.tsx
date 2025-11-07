import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { AppContext } from "../../context/ContextApp";
import { viewFile } from "../services/fileService";
import { FILE_CACHE_KEY } from "../../constants";

export const useViewFile = (fileShareId: string) => {
  const appContext = useContext(AppContext);
  if (!appContext) {
    throw new Error("useViewFile must be used within AppContext provider");
  }


  return useQuery({
    queryKey: [FILE_CACHE_KEY, fileShareId],
    queryFn: async () => {
      return await viewFile(fileShareId);
    },
    enabled: !!fileShareId, 
   
  });
};
