import AXIOS from "@/utils/axios";
import { useState } from "react";
import { toast } from "sonner";

function useRefresh({
  api,
  queryParams,
}: {
  api: string;
  queryParams: URLSearchParams;
}) {
  const [a, setA] = useState(false);
  const getNewAccessToken = async () => {
    const requestNewAccessToken = await AXIOS.post(`/auth/refresh`, {
      refreshToken: localStorage.getItem("refreshToken"),
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
    const res = await AXIOS.get(
      `${api}?${(queryParams as URLSearchParams).toString()}`,
      {
        headers: {
          Authorization: `Bearer ${newAccessToken}`,
        },
      }
    );
    setA(true);
    return res;
  };
  return { getNewAccessToken, setA, a };
}

export default useRefresh;
