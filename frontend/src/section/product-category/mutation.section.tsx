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
import type { ReactElement } from "react";
import { Controller, useForm } from "react-hook-form";

export type productCategoryFormProps = {
  name: string;
  mutation?: "post" | "patch";
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
    formState: { errors },
  } = useForm<productCategoryFormProps>({
    defaultValues: {
      name: "",
    },
  });
  const onSubmit = (values: productCategoryFormProps) => {
    console.log(values);
  };
  const handleCancel = () => {
    setData({ ...data, mutation: "post" });
  };
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
          <AlertDialogAction onClick={handleSubmit(onSubmit)}>
            Save
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default ProductCategoryMutationSection;
