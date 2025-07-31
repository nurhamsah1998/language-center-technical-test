import AXIOS from "@/utils/axios";
import { useQuery } from "@tanstack/react-query";

type Props = {
  api: string;
  invalidateKey: string;
  query?: Record<string, string | number>;
};
const objCleaner = (obj: Record<string, string | number>): {} => {
  try {
    for (const key in obj) {
      if (!key) {
        delete obj[key];
      }
    }
    return obj;
  } catch (error) {
    return {};
  }
};
function useFetch({ api, invalidateKey, query = {} }: Props) {
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");
  const queryParams = new URLSearchParams(objCleaner(query));
  const queryFetch = useQuery({
    queryKey: [invalidateKey],
    queryFn: async () => {
      try {
        const res = await AXIOS.get(`${api}?${queryParams.toString()}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        return res;
      } catch (error) {
        console.log(error);
      }
    },
  });
  return { accessToken, refreshToken, ...queryFetch };
}

export default useFetch;
