import { Input } from "@/components/ui/input";
import ProductMutationSection, {
  type productFormProps,
} from "./components/mutation.section";
import { AlertDialogTrigger } from "@/components/ui/alert-dialog";
import useFetch from "@/hooks/useFetch";
import debounce from "debounce";
import { useState } from "react";
import TableProductSection from "./components/table.section";

export type productQueryProps = {
  page: number;
  limit: number;
  search: string;
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
    limit: 10,
  });
  const { items, totalPage, isLoading } = useFetch({
    api: "/product",
    invalidateKey: "/product",
    query: {
      ...query,
    },
  });

  const handlePageClick = (event: { selected: number }) => {
    setQuery({ ...query, page: event?.selected + 1 });
  };
  const handleSearch = debounce((i) => {
    setQuery({ page: 1, limit: 10, search: i.target.value });
  }, 1000);
  return (
    <div>
      <div className="flex justify-between">
        <div>
          <Input onChange={handleSearch} placeholder="Search product" />
        </div>
        <ProductMutationSection dataForm={dataForm} setDataForm={setDataForm}>
          <AlertDialogTrigger>New Product</AlertDialogTrigger>
        </ProductMutationSection>
      </div>
      <div className="mt-3">
        <TableProductSection
          data={items}
          page={query.page}
          totalPage={totalPage}
          isLoading={isLoading}
          handlePageClick={handlePageClick}
        />
      </div>
    </div>
  );
}

export default ProductSection;
