import { Input } from "@/components/ui/input";
import ProductMutationSection, {
  type productFormProps,
} from "./components/mutation.section";
import { AlertDialogTrigger } from "@/components/ui/alert-dialog";
import useFetch from "@/hooks/useFetch";
import debounce from "debounce";
import { useMemo, useState } from "react";
import TableProductSection from "./components/table.section";
import SelectOption from "@/components/internal/select-option";
import type { productCategoryFormProps } from "../product-category/components/mutation.section";

export type productQueryProps = {
  page: number;
  limit: number;
  search: string;
  sortCreatedAt?: "desc" | "asc";
  productCategoryId: string;
};

export type productProps = {
  id: string;
  name: string;
  sellPrice: number;
  buyPrice: number;
  productCategory: {
    id: string;
    name: String;
  };
  createdAt: string;
  selled: number;
  stock: number;
  imagePath: string;
  desc: string;
};

function ProductSection() {
  const [dataForm, setDataForm] = useState<productFormProps>({
    name: "",
    id: "",
    desc: "",
    productCategoryId: "",
    mutation: "post",
    sellPrice: null,
    stock: null,
    buyPrice: null,
  });
  const [query, setQuery] = useState<productQueryProps>({
    page: 1,
    search: "",
    productCategoryId: "all",
    limit: 10,
    sortCreatedAt: "desc",
  });
  const { items, totalPage, isLoading } = useFetch({
    api: "/product",
    invalidateKey: "/product",
    query: {
      ...query,
      productCategoryId:
        query.productCategoryId === "all" ? "" : query.productCategoryId,
    },
  });

  /// GET LIST OF PRODUCT CATEGORY
  const { items: itemProductCategory, isLoading: isLoadingProductCategory } =
    useFetch({
      api: "/product-category",
      invalidateKey: "/product-category",
    });

  const productCategoryOption = useMemo(
    () =>
      itemProductCategory?.map(
        (item: Pick<productCategoryFormProps, "name" | "id">) => ({
          value: item?.id,
          label: item?.name,
        })
      ) || [],
    [itemProductCategory]
  );

  const handlePageClick = (event: { selected: number }) => {
    setQuery({ ...query, page: event?.selected + 1 });
  };

  const handleFilterCategory = (value: any) => {
    setQuery({ ...query, productCategoryId: value === "all" ? "" : value });
  };

  const handleSearch = debounce((i) => {
    setQuery({ ...query, page: 1, search: i.target.value });
  }, 1000);
  return (
    <div>
      <div className="flex justify-between">
        <div className="flex gap-3">
          <Input onChange={handleSearch} placeholder="Search product" />
          <SelectOption
            disabled={isLoadingProductCategory}
            placeholder="category"
            onChange={handleFilterCategory}
            value={query.productCategoryId}
            options={[...productCategoryOption, { label: "All", value: "all" }]}
          />
        </div>
        <ProductMutationSection dataForm={dataForm} setDataForm={setDataForm}>
          <AlertDialogTrigger>New Product</AlertDialogTrigger>
        </ProductMutationSection>
      </div>
      <div className="mt-3">
        <TableProductSection
          query={query}
          setQuery={setQuery}
          data={items}
          totalPage={totalPage}
          isLoading={isLoading}
          handlePageClick={handlePageClick}
        />
      </div>
    </div>
  );
}

export default ProductSection;
