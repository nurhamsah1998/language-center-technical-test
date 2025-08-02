import { Input } from "@/components/ui/input";
import useFetch from "@/hooks/useFetch";
import debounce from "debounce";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import TableOrderSection from "./components/table.section";

type queryProps = {
  page: number;
  limit: number;
  search: string;
};

export type orderProps = {
  id: string;
  status: "Packaging" | "Deliver" | "Done";
  createdAt: string;
  ProductOnOrder?: {
    productId: string;
    product: {
      name: string;
      sellPrice: number;
    };
    qty: number;
  }[];
  orderCode: string;
  customer: {
    id: string;
    profile: {
      name: string;
    };
  };
  tracking: string[];
};

function OrderSection() {
  const [query, setQuery] = useState<queryProps>({
    page: 1,
    search: "",
    limit: 10,
  });
  const { items, totalPage, isLoading } = useFetch({
    api: "/order",
    invalidateKey: "/order",
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
  if (!localStorage.getItem("accessToken")) return <Navigate to="/" replace />;
  return (
    <div>
      <div className="">
        <Input onChange={handleSearch} placeholder="Search order" />
      </div>
      <div className="mt-3">
        <TableOrderSection
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

export default OrderSection;
