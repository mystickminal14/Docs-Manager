import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { PaginatedUserEndpoint } from "../services/UserService";
import { USER_CACHE_KEY } from "../../constants";
import type { PaginationResponse, User, PaginationParams } from "../type/User";

export const useGetFiles = (params: PaginationParams) => {
  return useQuery<PaginationResponse<User>, Error>({
    queryKey: [USER_CACHE_KEY, params],
    queryFn: async () => {
      const response = await PaginatedUserEndpoint.get(params);
      return response;
    },
    placeholderData: keepPreviousData,
  });
};
