import { AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useState } from "react";
import ProductCategoryMutationSection, {
  type productCategoryFormProps,
} from "./components/mutation.section";
import TableProductCategorySection from "./components/table.section";
import useFetch from "@/hooks/useFetch";
import { Input } from "@/components/ui/input";
import debounce from "debounce";

type queryProps = {
  page: number;
  limit: number;
  search: string;
};
function ProductCategorySection() {
  const [dataForm, setDataForm] = useState<productCategoryFormProps>({
    name: "",
    mutation: "post",
  });
  const [query, setQuery] = useState<queryProps>({
    page: 1,
    search: "",
    limit: 10,
  });
  const { items, totalPage, isLoading } = useFetch({
    api: "/product-category",
    invalidateKey: "/product-category",
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
      <div className="md:flex grid gap-3 md:justify-between ">
        <div>
          <Input
            onChange={handleSearch}
            placeholder="Search product category"
          />
        </div>
        <ProductCategoryMutationSection
          dataForm={dataForm}
          setDataForm={setDataForm}
        >
          <AlertDialogTrigger>New category</AlertDialogTrigger>
        </ProductCategoryMutationSection>
      </div>
      <div className="mt-3">
        <TableProductCategorySection
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

export default ProductCategorySection;
