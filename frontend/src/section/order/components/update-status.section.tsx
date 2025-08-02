import SelectOption from "@/components/internal/select-option";
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
import { Label } from "@/components/ui/label";
import useFetch from "@/hooks/useFetch";
import useMutationX from "@/hooks/useMutationX";
import { useEffect, type ReactElement } from "react";
import { Controller, useForm } from "react-hook-form";
import type { orderProps } from "../order.section";

export type orderFormProps = {
  id?: string | null;
  status: "Packaging" | "Deliver" | "Done" | "";
};

const statusOption = [
  {
    label: "Packaging",
    value: "Packaging",
  },
  {
    label: "Deliver",
    value: "Deliver",
  },
  {
    label: "Done",
    value: "Done",
  },
];

function OrderUpdateStatusSection({
  children,
  dataForm,
  setDataForm = () => {},
}: {
  children: ReactElement;
  dataForm: orderFormProps;
  setDataForm?: (props: orderFormProps) => void;
}) {
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<orderFormProps>({
    defaultValues: {
      status: "",
    },
  });

  const mutation = useMutationX({
    api: "/order",
    invalidateKey: "/order",
    mutation: "put",
    onSuccess() {
      reset();
      const elementCloseBtn = document.getElementById(
        "close-btn-update-order-status"
      );

      if (elementCloseBtn) elementCloseBtn.click();
    },
  });

  /// GET ORDER BY ID
  const { data: orderById, isLoading } = useFetch({
    api: `/order/${dataForm?.id}`,
    invalidateKey: `/order/${dataForm?.id}`,
    enabled: Boolean(dataForm?.id),
  });
  const dataOrder: orderProps = orderById?.data;
  const onSubmit = (values: orderFormProps) => {
    if (isLoading) return;
    mutation.mutate({
      ...values,
      id: orderById?.data?.id,
    });
  };

  const handleCancel = () => {
    reset();
    setDataForm({ ...dataForm });
  };

  useEffect(() => {
    if (dataOrder?.id) {
      setValue("status", dataOrder?.status);
    }
  }, [dataOrder]);
  return (
    <AlertDialog>
      {children}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Update status</AlertDialogTitle>
          <AlertDialogDescription>-</AlertDialogDescription>
        </AlertDialogHeader>
        <div className="max-h-[300px] overflow-auto">
          <div className="p-2 border-2 border-slate-400 mb-5">
            <p className="text-sm leading-3 text-slate-600">Product order : </p>
            <div className="mt-3">
              {dataOrder?.ProductOnOrder?.map((item, idx) => (
                <div className="mb-3" key={idx}>
                  <div>
                    <p className="text-sm leading-3 text-slate-600">name : </p>
                    <p className="text-md font-bold">{item?.product?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm leading-3 text-slate-600">qty : </p>
                    <p className="text-md font-bold">{item?.qty}</p>
                  </div>
                  <div>
                    <p className="text-sm leading-3 text-slate-600">price : </p>
                    <p className="text-md font-bold">
                      Rp{item?.product?.sellPrice}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm leading-3 text-slate-600">total : </p>
                    <p className="text-md font-bold">
                      Rp{item?.product?.sellPrice * item?.qty}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <Controller
                control={control}
                name="status"
                rules={{
                  required: "status is required",
                }}
                render={({ field: { onChange, value } }) => (
                  <div className="grid gap-3">
                    <Label htmlFor="name">Status</Label>
                    <div>
                      <div className="flex gap-3">
                        <SelectOption
                          placeholder="status"
                          onChange={onChange}
                          value={value}
                          options={statusOption}
                        />
                      </div>

                      {errors?.status && (
                        <TextErrorForm>{errors?.status?.message}</TextErrorForm>
                      )}
                    </div>
                  </div>
                )}
              />
            </div>
            <button
              disabled={mutation.isPending}
              type="submit"
              className="hidden"
            >
              s
            </button>
          </form>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel
            id="close-btn-update-order-status"
            onClick={handleCancel}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={mutation.isPending || isLoading}
            onClick={handleSubmit(onSubmit)}
          >
            Save
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default OrderUpdateStatusSection;
