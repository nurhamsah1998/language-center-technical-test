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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type ReactElement } from "react";
import { Controller, useForm } from "react-hook-form";
import ProductCategoryMutationSection from "../product-category/mutation.section";

export type productFormProps = {
  name: string;
  sellPrice: number | null;
  buyPrice: number | null;
  categoryId: string | undefined;
  mutation: "post" | "patch";
};

function ProductMutationSection({
  children,
  data,
  setData = () => {},
}: {
  children: ReactElement;
  data: productFormProps;
  setData: (props: productFormProps) => void;
}) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<productFormProps>({
    defaultValues: {
      name: "",
      categoryId: "",
      sellPrice: null,
      buyPrice: null,
    },
  });
  const onSubmit = (values: productFormProps) => {
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
            {data.mutation === "post" ? "Create" : "Update"} product
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
                        placeholder="Learn english with language center"
                      />
                      {errors?.name && (
                        <TextErrorForm>{errors?.name?.message}</TextErrorForm>
                      )}
                    </div>
                  </div>
                )}
              />
              <Controller
                control={control}
                name="categoryId"
                rules={{
                  required: "category is required",
                }}
                render={({ field: { onChange, value } }) => (
                  <div className="grid gap-3">
                    <Label htmlFor="name">Category</Label>
                    <div>
                      <div className="flex gap-3">
                        <SelectOption
                          placeholder="category"
                          onChange={onChange}
                          value={value}
                          options={[]}
                        />
                        <ProductCategoryMutationSection>
                          <AlertDialogTrigger>Add new</AlertDialogTrigger>
                        </ProductCategoryMutationSection>
                      </div>

                      {errors?.categoryId && (
                        <TextErrorForm>
                          {errors?.categoryId?.message}
                        </TextErrorForm>
                      )}
                    </div>
                  </div>
                )}
              />
              <Controller
                control={control}
                name="sellPrice"
                rules={{
                  required: "sell price is required",
                }}
                render={({ field: { onChange, value } }) => (
                  <div className="grid gap-3">
                    <Label htmlFor="sellPrice">Sell price</Label>
                    <div>
                      <Input
                        onChange={onChange}
                        value={value || ""}
                        id="sellPrice"
                        type="number"
                        placeholder="1000"
                      />
                      {errors?.sellPrice && (
                        <TextErrorForm>
                          {errors?.sellPrice?.message}
                        </TextErrorForm>
                      )}
                    </div>
                  </div>
                )}
              />
              <Controller
                control={control}
                name="buyPrice"
                rules={{
                  required: "buy price is required",
                }}
                render={({ field: { onChange, value } }) => (
                  <div className="grid gap-3">
                    <Label htmlFor="buyPrice">Buy price</Label>
                    <div>
                      <Input
                        onChange={onChange}
                        value={value || ""}
                        id="buyPrice"
                        type="number"
                        placeholder="500"
                      />
                      {errors?.buyPrice && (
                        <TextErrorForm>
                          {errors?.buyPrice?.message}
                        </TextErrorForm>
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

export default ProductMutationSection;
