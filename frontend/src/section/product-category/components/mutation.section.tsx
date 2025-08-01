import TextErrorForm from "@/components/internal/TextErrorForm";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AXIOS from "@/utils/axios";
import { useEffect, useTransition, type ReactElement } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

export type productCategoryFormProps = {
  name: string;
  id?: string;
  mutation?: "post" | "put";
};

function ProductCategoryMutationSection({
  children,
  data = { name: "", mutation: "post" },
  setData = () => {},
}: {
  children: ReactElement;
  data?: productCategoryFormProps;
  setData?: (props: productCategoryFormProps) => void;
}) {
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<productCategoryFormProps>({
    defaultValues: {
      name: "",
    },
  });
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");
  const [isPending, startTransition] = useTransition();
  const onSubmit = (values: productCategoryFormProps) => {
    startTransition(async () => {
      try {
        /// PADA LOGIC INI BISA POST ATAU PUT TERGANTU DARI VALUE data.mutation
        const res = await (AXIOS as any)[
          data.mutation as keyof Pick<productCategoryFormProps, "mutation">
        ](
          `/product-category${data.mutation === "put" ? `/${data.id}` : ""}`,
          values,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        toast.success(res?.data?.message);
        reset();
      } catch (error: any) {
        /// LOGIC JIKA ACCESS TOKEN EXPIRED
        if (
          error?.response?.data?.message === "jwt expired" &&
          error?.status === 401
        ) {
          const requestNewAccessToken = await AXIOS.post(`/auth/refresh`, {
            refreshToken,
          }).catch((refreshError) => {
            toast.error((refreshError as any)?.response?.data?.message);
            localStorage.clear();
            setTimeout(() => {
              window.location.reload();
            }, 3000);
          });
          const newAccessToken = requestNewAccessToken?.data;
          localStorage.setItem("accessToken", newAccessToken);
          const res = await (AXIOS as any)[
            data.mutation as keyof Pick<productCategoryFormProps, "mutation">
          ](
            /// PADA LOGIC INI BISA POST ATAU PUT TERGANTU DARI VALUE data.mutation
            `/product-category${data.mutation === "put" ? `/${data.id}` : ""}`,
            values,
            {
              headers: {
                Authorization: `Bearer ${newAccessToken}`,
              },
            }
          );
          toast.success(res?.data?.message);
          return;
        } else if (error?.status === 401) {
          localStorage.clear();
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        }
        console.log(error);
        toast.error((error as any)?.response?.data?.message);
      }
    });
  };
  const handleCancel = () => {
    setData({ ...data, mutation: "post" });
  };
  useEffect(() => {
    if (data?.mutation === "put") {
      setValue("name", data?.name);
    }
  }, [data]);
  return (
    <AlertDialog>
      {children}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {data.mutation === "post" ? "Create" : "Update"} product category
          </AlertDialogTitle>
          <AlertDialogDescription>-</AlertDialogDescription>
        </AlertDialogHeader>
        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <Controller
                control={control}
                name="name"
                rules={{
                  required: "name is required",
                }}
                render={({ field: { onChange, value } }) => (
                  <div className="grid gap-3">
                    <Label htmlFor="name">Name</Label>
                    <div>
                      <Input
                        onChange={onChange}
                        value={value}
                        id="name"
                        type="text"
                        placeholder="book"
                      />
                      {errors?.name && (
                        <TextErrorForm>{errors?.name?.message}</TextErrorForm>
                      )}
                    </div>
                  </div>
                )}
              />
            </div>
            <button type="submit" className="hidden">
              s
            </button>
          </form>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={isPending}
            onClick={handleSubmit(onSubmit)}
          >
            Save
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default ProductCategoryMutationSection;
