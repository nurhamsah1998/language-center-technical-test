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
import useMutationX from "@/hooks/useMutationX";
import { useEffect, type ReactElement } from "react";
import { Controller, useForm } from "react-hook-form";

export type productCategoryFormProps = {
  name: string;
  id?: string;
  createdAt?: string;
  mutation: "post" | "put";
};

function ProductCategoryMutationSection({
  children,
  dataForm,
  setDataForm = () => {},
}: {
  children: ReactElement;
  dataForm: productCategoryFormProps;
  setDataForm?: (props: productCategoryFormProps) => void;
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
  const mutation = useMutationX({
    api: "/product-category",
    invalidateKey: "/product-category",
    mutation: dataForm.mutation,
    onSuccess() {
      reset();
      const elementCloseBtn = document.getElementById(
        "close-btn-mutation-product-category"
      );

      if (elementCloseBtn) elementCloseBtn.click();
    },
  });

  const onSubmit = (values: productCategoryFormProps) => {
    mutation.mutate({
      ...values,
      /// JIKA MUTATION === put, MAKA INJECT VALUE id
      ...(dataForm.mutation === "put" && { id: dataForm?.id }),
    });
  };

  const handleCancel = () => {
    reset();
    setDataForm({ ...dataForm, mutation: "post" });
  };

  useEffect(() => {
    if (dataForm?.mutation === "put" && dataForm?.id) {
      setValue("name", dataForm?.name);
    }
  }, [dataForm]);
  return (
    <AlertDialog>
      {children}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {dataForm.mutation === "post" ? "Create" : "Update"} product
            category
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
            id="close-btn-mutation-product-category"
            onClick={handleCancel}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={mutation.isPending}
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
