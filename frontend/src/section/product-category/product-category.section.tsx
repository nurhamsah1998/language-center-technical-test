import { AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useState } from "react";
import ProductCategoryMutationSection, {
  type productCategoryFormProps,
} from "./components/mutation.section";
import TableProductCategorySection from "./components/table.section";
import useFetch from "@/hooks/useFetch";

type queryProps = {
  page: number;
};
function ProductCategorySection() {
  const [data, setData] = useState<productCategoryFormProps>({
    name: "",
    mutation: "post",
  });
  const [query, setQuery] = useState<queryProps>({
    page: 1,
  });
  const { items, totalPage, isLoading } = useFetch({
    api: "/product-category",
    invalidateKey: "/product-category",
    query: {
      limit: 3,
      ...query,
    },
  });
  console.log(query.page);
  const handlePageClick = (event: { selected: number }) => {
    setQuery({ ...query, page: event?.selected + 1 });
  };
  return (
    <div>
      <div className="flex justify-end">
        <ProductCategoryMutationSection data={data} setData={setData}>
          <AlertDialogTrigger>New category</AlertDialogTrigger>
        </ProductCategoryMutationSection>
      </div>
      <div>
        <TableProductCategorySection
          data={items}
          totalPage={totalPage}
          isLoading={isLoading}
          handlePageClick={handlePageClick}
        />
      </div>
    </div>
  );
}

export default ProductCategorySection;
