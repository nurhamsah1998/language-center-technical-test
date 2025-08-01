import useFetch from "@/hooks/useFetch";
import type {
  productProps,
  productQueryProps,
} from "../product/product.section";
import { useState } from "react";
import CardProduct from "./components/card-product";

function MainEcommerceSection() {
  const [query, setQuery] = useState<productQueryProps>({
    page: 1,
    search: "",
    limit: 10,
  });
  const { items, isLoading } = useFetch({
    api: "/product/public",
    invalidateKey: "/product/public",
    query: {
      ...query,
    },
  });
  return (
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
  );
}

export default MainEcommerceSection;
