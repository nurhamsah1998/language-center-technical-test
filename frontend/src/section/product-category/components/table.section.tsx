import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ReactPaginate from "react-paginate";
import type { productCategoryFormProps } from "./mutation.section";
import ModalAlert from "@/components/internal/modal-alert";
import { AlertDialogTrigger } from "@radix-ui/react-alert-dialog";
import { memo, useState } from "react";
import ProductCategoryMutationSection from "./mutation.section";
import useMutationX from "@/hooks/useMutationX";

type Props = {
  data: Omit<productCategoryFormProps, "mutation">[];
  totalPage: number;
  page: number;
  isLoading: boolean;
  handlePageClick: (arg: { selected: number }) => void;
};
function TableProductCategorySection({
  data,
  totalPage,
  page,
  isLoading,
  handlePageClick = () => {},
}: Props) {
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow className="bg-primary hover:bg-primary ">
            <TableHead className="text-white">Name</TableHead>
            <TableHead className="text-white">Created at</TableHead>
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
                <TableCell>
                  {new Date(item?.createdAt || "").toDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex gap-3">
                    <DeleteProductCategory item={item} />
                    <UpdateProductCategory item={item} />
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
            page === 1 ? "text-slate-600 cursor-not-allowed" : "cursor-pointer"
          }`}
          nextClassName={` ${
            totalPage === page
              ? "text-slate-600 cursor-not-allowed"
              : "cursor-pointer"
          }`}
          renderOnZeroPageCount={null}
        />
      </div>
    </div>
  );
}
const DeleteProductCategory = memo(
  ({ item }: { item: Omit<productCategoryFormProps, "mutation"> }) => {
    const mutationDelete = useMutationX({
      api: "/product-category",
      invalidateKey: "/product-category",
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
  }
);

const UpdateProductCategory = memo(
  ({ item }: { item: Omit<productCategoryFormProps, "mutation"> }) => {
    const [dataForm, setDataForm] = useState<productCategoryFormProps>({
      name: "",
      id: "",
      mutation: "put",
    });
    return (
      <ProductCategoryMutationSection
        dataForm={dataForm}
        setDataForm={setDataForm}
      >
        <AlertDialogTrigger
          onClick={() => {
            setDataForm({ name: item?.name, id: item?.id, mutation: "put" });
          }}
          className="bg-green-200 px-3 rounded-md cursor-pointer text-green-600 hover:bg-green-300"
        >
          Update
        </AlertDialogTrigger>
      </ProductCategoryMutationSection>
    );
  }
);
export default TableProductCategorySection;
