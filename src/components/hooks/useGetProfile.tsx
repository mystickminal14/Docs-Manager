import { useQuery } from "@tanstack/react-query";
import { PROFILE_CACHE_KEY } from "../../constants";
import { ProfileEndpoint } from "../services/ProfileService";
import type { ProfileModel } from "../model/ProfileModel";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/ContextApp";

export const useGetProfile = () => { 
   const { showToast } = useAppContext();

  const navigate = useNavigate();

  const query = useQuery<ProfileModel, Error>({
    queryKey: [PROFILE_CACHE_KEY],
    queryFn: async () => {
      try {
        const res = await ProfileEndpoint.get();
        return res;
      } catch (err: any) {
        if (err.response?.status === 401) {
          showToast('Session Not Found', 'error');
          navigate("/", { replace: true });
        }
        throw err;
      }
    },
    retry: false,
  });

 

  return query;
};