import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ReactPaginate from "react-paginate";
import type { productCategoryFormProps } from "./mutation.section";
import { Button } from "@/components/ui/button";
import ModalAlert from "@/components/internal/modal-alert";
import { AlertDialogTrigger } from "@radix-ui/react-alert-dialog";
import { memo, useState } from "react";
import ProductCategoryMutationSection from "./mutation.section";

type Props = {
  data: Omit<productCategoryFormProps, "mutation">[];
  totalPage: number;
  isLoading: boolean;
  handlePageClick: (arg: { selected: number }) => void;
};
function TableProductCategorySection({
  data,
  totalPage,
  isLoading,
  handlePageClick = () => {},
}: Props) {
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
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
                  <div className="flex gap-3">
                    <ModalAlert
                      // handleSubmit={handleLogOut}
                      labelSubmit="Delete"
                      title="Confirm"
                      desc={`Are you sure want to delete ${item?.name}`}
                    >
                      <AlertDialogTrigger className="bg-red-200 px-3 rounded-md cursor-pointer text-red-600 hover:bg-red-300">
                        Delete
                      </AlertDialogTrigger>
                    </ModalAlert>
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
      <div className="flex justify-end">
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
          previousClassName="cursor-pointer"
          nextClassName="cursor-pointer"
          renderOnZeroPageCount={null}
        />
      </div>
    </div>
  );
}

const UpdateProductCategory = memo(
  ({ item }: { item: productCategoryFormProps }) => {
    const [data, setData] = useState<productCategoryFormProps>({
      name: item?.name,
      id: item?.id,
      mutation: "put",
    });
    return (
      <ProductCategoryMutationSection data={data} setData={setData}>
        <AlertDialogTrigger className="bg-green-200 px-3 rounded-md cursor-pointer text-green-600 hover:bg-green-300">
          Update
        </AlertDialogTrigger>
      </ProductCategoryMutationSection>
    );
  }
);
export default TableProductCategorySection;
