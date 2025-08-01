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
import { memo, useEffect, useMemo, useState, type ReactElement } from "react";
import { Controller, useForm } from "react-hook-form";
import ProductCategoryMutationSection, {
  type productCategoryFormProps,
} from "../../product-category/components/mutation.section";
import useFetch from "@/hooks/useFetch";
import useMutationX from "@/hooks/useMutationX";
import type { productProps } from "../product.section";
import { Textarea } from "@/components/ui/textarea";

export type productFormProps = {
  name: string;
  desc: string;
  id?: string;
  sellPrice: number | null;
  buyPrice: number | null;
  stock?: number | null;
  productCategoryId: string | undefined;
  mutation: "post" | "put";
};

function ProductMutationSection({
  children,
  dataForm,
  setDataForm = () => {},
}: {
  children: ReactElement;
  dataForm: productFormProps;
  setDataForm: (props: productFormProps) => void;
}) {
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<productFormProps>({
    defaultValues: {
      name: "",
      desc: "",
      productCategoryId: "",
      sellPrice: null,
      ...(dataForm?.mutation === "post" && {
        stock: null,
      }),
      buyPrice: null,
    },
  });
  const [dataFormProductCategory, setDataFormProductCategory] =
    useState<productCategoryFormProps>({
      name: "",
      mutation: "post",
    });
  /// GET PRODUCT BY ID
  const { data: productById } = useFetch({
    api: `/product/${dataForm?.id}`,
    invalidateKey: `/product/${dataForm?.id}`,
    enabled: Boolean(dataForm?.mutation === "put"),
  });
  /// GET LIST OF PRODUCT CATEGORY
  const { items, isLoading } = useFetch({
    api: "/product-category",
    invalidateKey: "/product-category",
  });

  const productCategoryOption = useMemo(
    () =>
      items?.map((item: Pick<productCategoryFormProps, "name" | "id">) => ({
        value: item?.id,
        label: item?.name,
      })) || [],
    [items]
  );
  const mutation = useMutationX({
    api: "/product",
    invalidateKey: "/product",
    mutation: dataForm.mutation,
    onSuccess() {
      reset();
      const elementCloseBtn = document.getElementById(
        "close-btn-mutation-product"
      );

      if (elementCloseBtn) elementCloseBtn.click();
    },
  });

  const onSubmit = (values: productFormProps) => {
    mutation.mutate({
      ...values,
      sellPrice: Number(values?.sellPrice),
      /// JIKA MUTATION POST, MAKA KIRIM STOCK
      ...(dataForm?.mutation === "post" && {
        stock: Number(values?.stock),
      }),
      buyPrice: Number(values?.buyPrice),
      /// JIKA MUTATION === put, MAKA INJECT VALUE id
      ...(dataForm.mutation === "put" && { id: dataForm?.id }),
    });
  };

  const handleCancel = () => {
    reset();
    setDataForm({ ...dataForm, mutation: "post" });
  };

  useEffect(() => {
    if (dataForm?.mutation === "put" && productById?.data?.id) {
      const { name, buyPrice, sellPrice, productCategory, desc }: productProps =
        productById?.data || {};
      setValue("name", name);
      setValue("buyPrice", buyPrice);
      setValue("sellPrice", sellPrice);
      setValue("desc", desc);
      setValue("productCategoryId", productCategory?.id);
    }
    return () => {};
  }, [productById?.data, dataForm?.mutation]);
  return (
    <AlertDialog>
      {children}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {dataForm.mutation === "post" ? "Create" : "Update"} product
          </AlertDialogTitle>
          <AlertDialogDescription>-</AlertDialogDescription>
        </AlertDialogHeader>
        <div className="max-h-[400px] overflow-auto">
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
                name="desc"
                render={({ field: { onChange, value } }) => (
                  <div className="grid gap-3">
                    <Label htmlFor="name">Description</Label>
                    <div>
                      <Textarea
                        onChange={onChange}
                        value={value || ""}
                        id="desc"
                        className=" resize-none h-40"
                        placeholder="some description product"
                      />
                    </div>
                  </div>
                )}
              />
              <Controller
                control={control}
                name="productCategoryId"
                rules={{
                  required: "category is required",
                }}
                render={({ field: { onChange, value } }) => (
                  <div className="grid gap-3">
                    <Label htmlFor="name">Category</Label>
                    <div>
                      <div className="flex gap-3">
                        <SelectOption
                          disabled={isLoading}
                          placeholder="category"
                          onChange={onChange}
                          value={value}
                          options={productCategoryOption}
                        />
                        <ProductCategoryMutationSection
                          setDataForm={setDataFormProductCategory}
                          dataForm={dataFormProductCategory}
                        >
                          <AlertDialogTrigger disabled={mutation.isPending}>
                            Add new
                          </AlertDialogTrigger>
                        </ProductCategoryMutationSection>
                      </div>

                      {errors?.productCategoryId && (
                        <TextErrorForm>
                          {errors?.productCategoryId?.message}
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
              {dataForm?.mutation === "post" && (
                <Controller
                  control={control}
                  name="stock"
                  rules={{
                    required: "stock is required",
                  }}
                  render={({ field: { onChange, value } }) => (
                    <div className="grid gap-3">
                      <Label htmlFor="stock">Stock</Label>
                      <div>
                        <Input
                          onChange={onChange}
                          value={value || ""}
                          id="stock"
                          type="number"
                          placeholder="500"
                        />
                        {errors?.stock && (
                          <TextErrorForm>
                            {errors?.stock?.message}
                          </TextErrorForm>
                        )}
                      </div>
                    </div>
                  )}
                />
              )}
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
            id="close-btn-mutation-product"
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

export default memo(ProductMutationSection);
