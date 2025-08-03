import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ReactPaginate from "react-paginate";
import ModalAlert from "@/components/internal/modal-alert";
import { AlertDialogTrigger } from "@radix-ui/react-alert-dialog";
import { memo, useState } from "react";
import useMutationX from "@/hooks/useMutationX";
import type { productProps, productQueryProps } from "../product.section";
import type { productFormProps } from "./mutation.section";
import ProductMutationSection from "./mutation.section";
import { QueryClient, useQueryClient } from "@tanstack/react-query";

type Props = {
  query: productQueryProps;
  data: productProps[];
  totalPage: number;
  isLoading: boolean;
  handlePageClick: (arg: { selected: number }) => void;
  setQuery: (prev: productQueryProps) => void;
};
function TableProductSection({
  data,
  query,
  setQuery,
  totalPage,
  isLoading,
  handlePageClick = () => {},
}: Props) {
  const client = useQueryClient();
  const handleSort = (sort: string) => {
    setQuery({
      ...query,
      [sort]: query[sort as keyof productQueryProps] === "asc" ? "desc" : "asc",
    });
  };
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow className="bg-primary hover:bg-primary ">
            <TableHead className="text-white">Name</TableHead>
            <TableHead className="text-white">Category</TableHead>
            <TableHead className="text-white">Sell price</TableHead>
            <TableHead className="text-white">Buy price</TableHead>
            <TableHead className="text-white">Stock</TableHead>
            <TableHead className="text-white">Selled</TableHead>
            <TableHead className="text-white">
              <div
                onClick={() => handleSort("sortCreatedAt")}
                className=" cursor-pointer"
              >
                Created at{" "}
                <span className="text-xs">({query.sortCreatedAt})</span>
              </div>
            </TableHead>
            <TableHead className="text-white">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell
                colSpan={12}
                className="text-center font-bold text-slate-500 text-lg py-14 animate-pulse"
              >
                Getting data...
              </TableCell>
            </TableRow>
          ) : data?.length !== 0 ? (
            data?.map((item) => (
              <TableRow key={item?.id}>
                <TableCell>{item?.name}</TableCell>
                <TableCell>{item?.productCategory?.name || "-"}</TableCell>
                <TableCell>{item?.sellPrice}</TableCell>
                <TableCell>{item?.buyPrice}</TableCell>
                <TableCell>{item?.stock}</TableCell>
                <TableCell>{item?.selled}</TableCell>
                <TableCell>
                  {new Date(item?.createdAt || "").toLocaleTimeString()}
                </TableCell>
                <TableCell>
                  <div className="flex gap-3">
                    <DeleteProduct item={item} />
                    <UpdateProduct item={item} client={client} />
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={12}
                className="text-center font-bold text-slate-500 text-lg py-14"
              >
                No data
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex justify-end mt-3">
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
const DeleteProduct = memo(({ item }: { item: productProps }) => {
  const mutationDelete = useMutationX({
    api: "/product",
    invalidateKey: "/product",
    mutation: "delete",
  });
  const handleDelete = () => {
    mutationDelete.mutate({ id: item?.id });
  };
  return (
    <ModalAlert
      handleSubmit={handleDelete}
      labelSubmit="Delete"
      title="Confirm"
      desc={`Are you sure want to delete ${item?.name}`}
    >
      <AlertDialogTrigger
        disabled={mutationDelete.isPending}
        className={` px-3 rounded-md  ${
          mutationDelete.isPending
            ? "bg-slate-200 animate-pulse cursor-not-allowed text-slate-600 hover:bg-slate-300"
            : "bg-red-200 cursor-pointer text-red-600 hover:bg-red-300"
        }`}
      >
        {mutationDelete.isPending ? "Deleting..." : "Delete"}
      </AlertDialogTrigger>
    </ModalAlert>
  );
});

const UpdateProduct = memo(
  ({ item, client }: { client: QueryClient; item: productProps }) => {
    const [dataForm, setDataForm] = useState<productFormProps>({
      name: "",
      id: "",
      desc: "",
      productCategoryId: "",
      mutation: "post",
      sellPrice: null,
      buyPrice: null,
    });
    return (
      <ProductMutationSection dataForm={dataForm} setDataForm={setDataForm}>
        <AlertDialogTrigger
          onClick={() => {
            client.removeQueries({ queryKey: [`/product/${item?.id}`] });
            setDataForm({
              name: item?.name,
              desc: item?.desc,
              id: item?.id,
              productCategoryId: item?.productCategory.id,
              mutation: "put",
              sellPrice: item?.sellPrice,
              buyPrice: item?.buyPrice,
            });
          }}
          className="bg-green-200 px-3 rounded-md cursor-pointer text-green-600 hover:bg-green-300"
        >
          Update
        </AlertDialogTrigger>
      </ProductMutationSection>
    );
  }
);
export default TableProductSection;
