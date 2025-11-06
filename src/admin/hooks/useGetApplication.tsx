import { useQuery } from "@tanstack/react-query";
import { APPLICATION_CACHE_KEY,  } from "../../../constants";
import { ApplicationEndpoint,  } from "../services/UserService";
import type { ApplicationModel,  } from "../model/ApplicationModel";

export const useGetApplication = () => {
  return useQuery<ApplicationModel[], Error>({
    queryKey: [APPLICATION_CACHE_KEY],
    queryFn: async () => {
      try {
        return await ApplicationEndpoint.getAll();
      } catch (err: any) {
        if (err?.response?.status === 404) {
          return []; 
        }
        throw err; 
      }
    },
  });
};
