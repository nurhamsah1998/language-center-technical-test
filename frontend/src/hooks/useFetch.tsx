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

let isRequestingNewAccessToken: boolean = false;
let awaitingCount = 1;
let maxAwaitingCount = 100;

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
    queryFn: async () =>
      await fetching({ api, queryParams, refreshToken, onSuccess }),
    enabled,
    retry: 5,
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

const fetching = async ({
  api,
  queryParams,
  refreshToken,
  onSuccess = () => {},
}: Partial<
  Props & { queryParams: URLSearchParams; refreshToken: string | null }
>) => {
  try {
    /// JIKA TIDAK ADA ENPOINT YANG REQUEST NEW ACCESS TOKEN
    /// MAKA SELALU SET awaitingCount ke 1
    if (!isRequestingNewAccessToken) awaitingCount = 1;
    /// FETCHING BIASA
    const res = await AXIOS.get(
      `${api}?${(queryParams as URLSearchParams).toString()}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );
    onSuccess(res);
    return res;
  } catch (error: any) {
    /// LOGIC JIKA ACCESS TOKEN EXPIRED
    if (
      error?.response?.data?.message === "jwt expired" &&
      error?.status === 401
    ) {
      /// JIKA ADA ENDPOINT LAIN YANG REQUEST NEW ACCESS TOKEN
      /// MAKA ENDPOINT YANG LAIN MENUNGGU SELAMA 1 DETIK
      if (isRequestingNewAccessToken) {
        await new Promise(async (next) => {
          setTimeout(() => {
            next("");
          }, 1000);
        });
        return await fetching({ api, queryParams, refreshToken, onSuccess });
        /// JIKA TIDAK ADA ENDPOINT LAIN YANG MENCOBA
        /// REQUEST NEW ACCESS TOKEN, MAKA LANJUT REQUEST TANPA MENUNGGU
      } else {
        return await getNewAccessToken({
          api,
          queryParams,
          refreshToken,
          onSuccess,
        });
      }
      /// JIKA TERJADI ERROR Unauthorized
    } else if (error?.status === 401) {
      localStorage.clear();
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    }
    console.log(error);
  }
};

/// REQUEST ACCESS TOKEN BARU
const getNewAccessToken = async ({
  api,
  queryParams,
  refreshToken,
  onSuccess = () => {},
}: Partial<
  Props & { queryParams: URLSearchParams; refreshToken: string | null }
>) => {
  isRequestingNewAccessToken = true;
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
  /// MELAKUKAN FETCHING ULANG SETELAH MENDAPATKAN ACCESS TOKEN BARU
  const res = await AXIOS.get(
    `${api}?${(queryParams as URLSearchParams).toString()}`,
    {
      headers: {
        Authorization: `Bearer ${newAccessToken}`,
      },
    }
  );
  onSuccess(res);
  /// SET KE false AGAR TIDAK SELALU MENUNGGU
  /// KETIKA SUDAH MENDAPATKAN NEW ACCESS TOKEN
  isRequestingNewAccessToken = false;
  return res;
};

export default useFetch;
