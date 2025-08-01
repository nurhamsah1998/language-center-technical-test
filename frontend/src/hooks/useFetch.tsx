import AXIOS from "@/utils/axios";
import { useQuery } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";
import { toast } from "sonner";

type Props = {
  api: string;
  invalidateKey: string;
  enabled?: boolean;
  staleTime?: number;
  onSuccess?: (arg: AxiosResponse<any, any>) => void;
  query?: Record<string, string | number>;
};
const objCleaner = (obj: Record<string, string | number>): {} => {
  try {
    for (const key in obj) {
      if (!obj[key]) {
        delete obj[key];
      }
    }
    return obj;
  } catch (error) {
    return {};
  }
};
function useFetch({
  api,
  onSuccess = () => {},
  invalidateKey,
  staleTime = 0,
  query = {},
  enabled = true,
}: Props) {
  const refreshToken = localStorage.getItem("refreshToken");
  const queryParams = new URLSearchParams(objCleaner(query));
  const queryFetch = useQuery({
    queryKey: [invalidateKey, queryParams.toString()],
    queryFn: async () => {
      try {
        const res = await AXIOS.get(`${api}?${queryParams.toString()}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        onSuccess(res);
        return res;
      } catch (error: any) {
        /// LOGIC JIKA ACCESS TOKEN EXPIRED
        if (
          error?.response?.data?.message === "jwt expired" &&
          error?.status === 401
        ) {
          /// REQUEST ACCESS TOKEM BARU
          const requestNewAccessToken = await AXIOS.post(`/auth/refresh`, {
            refreshToken,
          }).catch((refreshError) => {
            /// LOG OUT OTOMATIS JIKA REFRESH TOKEN DI DB TIDAK ADA ATAU TIDAK VALID
            toast.error((refreshError as any)?.response?.data?.message);
            localStorage.clear();
            setTimeout(() => {
              window.location.reload();
            }, 3000);
          });
          /// SET ACCESS TOKEN BARU KE LOCALSTORAGE
          const newAccessToken = requestNewAccessToken?.data;
          localStorage.setItem("accessToken", newAccessToken);
          /// MELAKUKAN MUTATION ULANG SETELAH MENDAPATKAN ACCESS TOKEN BARU
          const res = await AXIOS.get(`${api}?${queryParams.toString()}`, {
            headers: {
              Authorization: `Bearer ${newAccessToken}`,
            },
          });
          onSuccess(res);
          return res;
        } else if (error?.status === 401) {
          localStorage.clear();
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        }
        console.log(error);
      }
    },
    enabled,
    retry: 3,
    staleTime,
  });
  const items = queryFetch?.data?.data?.data || [];
  const { totalPage, totalData } = queryFetch?.data?.data?.meta || {};
  return {
    totalPage,
    totalData,
    items,
    refreshToken,
    ...queryFetch,
  };
}

export default useFetch;
