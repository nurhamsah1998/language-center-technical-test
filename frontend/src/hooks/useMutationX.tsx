import AXIOS from "@/utils/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type Props = {
  api: string;
  invalidateKey: string;
  mutation: "delete" | "post" | "put";
};

function useMutationX({ api, invalidateKey, mutation }: Props) {
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");
  const client = useQueryClient();
  /// LOGIC UNTUK BISA MELAKUKAN MULTI MUTATION (delete, post, put)
  const AxiosMutation = async ({
    accessToken,
    values,
  }: {
    values: any;
    accessToken: string | null;
  }) => {
    const paramId = values?.id;
    delete values.id;
    if (mutation === "post" || mutation === "put") {
      return await AXIOS[mutation](
        `${api}${mutation === "put" ? `${paramId}` : ""}`,
        values,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
    } else {
      return await AXIOS.delete(`${api}/${paramId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    }
  };
  const queryMutation = useMutation({
    queryKey: [invalidateKey],
    queryFn: async (values: any) => {
      try {
        const res = await AxiosMutation({ values, accessToken });
        toast.success(res?.data?.message);
        /// INVALIDATE QUERY
        client.invalidateQueries({ queryKey: [invalidateKey] });
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
          const res = await AxiosMutation({
            values,
            accessToken: newAccessToken,
          });
          toast.success(res?.data?.message);
          /// INVALIDATE QUERY
          client.invalidateQueries({ queryKey: [invalidateKey] });
          return;
        } else if (error?.status === 401) {
          localStorage.clear();
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        }
        console.log(error);
      }
    },
  });
  return { ...queryMutation };
}

export default useMutationX;
