import { useQuery, keepPreviousData } from "@tanstack/react-query";
import type { FileModel, PaginationParams, PaginationResponse } from "../type/User";
import { FILE_CACHE_KEY } from "../../constants";
import { PaginatedFileEndpoint } from "../services/fileService";

export const useGetFiles = (params: PaginationParams) => {
  return useQuery<PaginationResponse<FileModel>, Error>({
    queryKey: [FILE_CACHE_KEY, params],
    queryFn: async () => {
      const response = await PaginatedFileEndpoint.get(params);
      return response;
    },
    placeholderData: keepPreviousData,
  });
};