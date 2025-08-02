import useFetch from "@/hooks/useFetch";
import type {
  productProps,
  productQueryProps,
} from "../product/product.section";
import { useMemo, useState } from "react";
import CardProduct from "./components/card-product";
import SelectOption from "@/components/internal/select-option";
import type { productCategoryFormProps } from "../product-category/components/mutation.section";
import ReactPaginate from "react-paginate";

function MainEcommerceSection() {
  const [query, setQuery] = useState<productQueryProps>({
    page: 1,
    search: "",
    limit: 10,
    productCategoryId: "",
  });
  const { items, isLoading, totalPage } = useFetch({
    api: "/product/public",
    invalidateKey: "/product/public",
    query: {
      ...query,
    },
  });
  const { items: itemProductCategory, isLoading: isLoadingProductCategory } =
    useFetch({
      api: "/product-category/public",
      invalidateKey: "/product-category/public",
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

  const handleFilterCategory = (value: any) => {
    setQuery({ ...query, productCategoryId: value === "all" ? "" : value });
  };
  const handlePageClick = (event: { selected: number }) => {
    setQuery({ ...query, page: event?.selected + 1 });
  };
  return (
    <div>
      <div className="flex justify-between mb-10">
        <div>
          <p className="text-2xl">Welcome</p>
          <p className="text-sm text-slate-600">happy shopping</p>
        </div>
        <div className="w-xs">
          <SelectOption
            disabled={isLoadingProductCategory}
            placeholder="category"
            onChange={handleFilterCategory}
            value={query.productCategoryId}
            options={[...productCategoryOption, { label: "All", value: "all" }]}
          />
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3 justify-center">
        {isLoading ? (
          Array(5)
            .fill(1)
            .map((_, index) => (
              <div
                key={index}
                className="w-sm h-[100px] rounded-md bg-slate-600 animate-pulse"
              />
            ))
        ) : items?.length !== 0 ? (
          items?.map((item: productProps) => (
            <CardProduct key={item?.id} item={item} />
          ))
        ) : (
          <div className=" text-2xl font-bold text-slate-700">
            Sorry, we dont have any product yet!
          </div>
        )}
      </div>
      <div className="flex justify-center mt-4">
        <ReactPaginate
          containerClassName=" flex gap-3"
          pageLinkClassName="px-2 py-1"
          pageClassName=" cursor-pointer hover:bg-slate-200 rounded-md"
          activeLinkClassName="bg-primary px-2 py-1 hover:bg-primary rounded-md hover:text-white text-white"
          breakLabel="..."
          nextLabel="next"
          onPageChange={(selected) => handlePageClick(selected)}
          pageRangeDisplayed={5}
          pageCount={totalPage || 0}
          previousLabel="previous"
          previousClassName={` ${
            query.page === 1
              ? "text-slate-600 cursor-not-allowed"
              : "cursor-pointer"
          }`}
          nextClassName={` ${
            totalPage === query.page
              ? "text-slate-600 cursor-not-allowed"
              : "cursor-pointer"
          }`}
          renderOnZeroPageCount={null}
        />
      </div>
    </div>
  );
}

export default MainEcommerceSection;
