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
  const { items } = useFetch({
    api: "/product/public",
    invalidateKey: "/product/public",
    query: {
      ...query,
    },
  });
  return (
    <div className="flex flex-wrap items-center gap-3 justify-center">
      {items?.map((item: productProps) => (
        <CardProduct key={item?.id} item={item} />
      ))}
    </div>
  );
}

export default MainEcommerceSection;
