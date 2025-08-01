import AXIOS from "@/utils/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import { toast } from "sonner";

type Props = {
  api: string;
  invalidateKey: string;
  mutation: "delete" | "post" | "put";
  onSuccess?: (arg: AxiosResponse<any, any>) => void;
  onError?: (arg: AxiosError) => void;
};

function useMutationX({
  api,
  invalidateKey,
  mutation,
  onSuccess = () => {},
  onError = () => {},
}: Props) {
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
    if (mutation === "post" || mutation === "put") {
      return await AXIOS[mutation](
        `${api}${mutation === "put" ? `/${values?.id}` : ""}`,
        values,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
    } else {
      return await AXIOS.delete(`${api}/${values?.id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    }
  };
  const queryMutation = useMutation({
    mutationKey: [invalidateKey as any],
    mutationFn: async (values: any) => {
      try {
        const res = await AxiosMutation({ values, accessToken });
        toast.success(res?.data?.message);
        /// INVALIDATE QUERY
        client.invalidateQueries({ queryKey: [invalidateKey] });
        onSuccess(res);
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
          await AxiosMutation({
            values,
            accessToken: newAccessToken,
          })
            .then((res) => {
              toast.success(res?.data?.message);
              /// INVALIDATE QUERY
              client.invalidateQueries({ queryKey: [invalidateKey] });
              onSuccess(res);
            })
            .catch((secondMutation) => {
              /// JIKA TERJADI ERROR PADA SAAT MELAKUKAN MUTATION KEDUA
              /// SETELAH DAPAT ACCESS TOKEN BARU
              toast.error((secondMutation as any)?.response?.data?.message);
            });
          return;
          /// JIKA ERROR Unauthorized TANPA TOKEN EXPIRED
        } else if (error?.status === 401) {
          localStorage.clear();
          setTimeout(() => {
            window.location.reload();
          }, 3000);
          return;
        }
        /// THROW ERROR SAAT MUTATION PERTAMA
        console.log(error);
        toast.error((error as any)?.response?.data?.message);
        onError(error);
      }
    },
  });
  return { ...queryMutation };
}

export default useMutationX;
