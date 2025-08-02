import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ReactPaginate from "react-paginate";
import { AlertDialogTrigger } from "@radix-ui/react-alert-dialog";
import { memo, useState } from "react";
import type { orderFormProps } from "./update-status.section";
import type { orderProps } from "../order.section";
import OrderUpdateStatusSection from "./update-status.section";
import { useUserSession } from "@/store/user-session.store";
import DetailOrderSection from "./detail-order.section";
import TrackingOrderSection from "./tracking-order.section";
import { QueryClient, useQueryClient } from "@tanstack/react-query";

type Props = {
  data: orderProps[];
  totalPage: number;
  page: number;
  isLoading: boolean;
  handlePageClick: (arg: { selected: number }) => void;
};
function TableOrderSection({
  data,
  totalPage,
  page,
  isLoading,
  handlePageClick = () => {},
}: Props) {
  const { role } = useUserSession();
  const client = useQueryClient();
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow className="bg-primary hover:bg-primary ">
            <TableHead className="text-white">Order code</TableHead>
            <TableHead className="text-white">Customer</TableHead>
            <TableHead className="text-white">Status</TableHead>
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
                <TableCell>{item?.orderCode}</TableCell>
                <TableCell>{item?.customer?.profile?.name || "-"}</TableCell>
                <TableCell>{item?.status || "-"}</TableCell>
                <TableCell>
                  {new Date(item?.createdAt || "").toDateString()}
                </TableCell>

                <TableCell>
                  <div className="flex gap-3">
                    {role === "Admin" && (
                      <UpdateOrderStatus client={client} item={item} />
                    )}
                    <DetailOrder item={item} />
                    <TrackingOrder item={item} />
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

const TrackingOrder = memo(({ item }: { item: orderProps }) => {
  return (
    <TrackingOrderSection orderId={item.id}>
      <AlertDialogTrigger className="bg-pink-200 px-3 rounded-md cursor-pointer text-pink-600 hover:bg-pink-300">
        Tracking
      </AlertDialogTrigger>
    </TrackingOrderSection>
  );
});

const DetailOrder = memo(({ item }: { item: orderProps }) => {
  return (
    <DetailOrderSection orderId={item.id}>
      <AlertDialogTrigger className="bg-cyan-200 px-3 rounded-md cursor-pointer text-cyan-600 hover:bg-cyan-300">
        Detail
      </AlertDialogTrigger>
    </DetailOrderSection>
  );
});

const UpdateOrderStatus = memo(
  ({ item, client }: { client: QueryClient; item: orderProps }) => {
    const [dataForm, setDataForm] = useState<orderFormProps>({
      id: item?.id,
      status: item?.status,
    });
    return (
      <OrderUpdateStatusSection dataForm={dataForm} setDataForm={setDataForm}>
        <AlertDialogTrigger
          onClick={() => {
            setDataForm({ id: item?.id, status: item?.status });
            client.removeQueries({ queryKey: [`/order/${item?.id}`] });
          }}
          className="bg-green-200 px-3 rounded-md cursor-pointer text-green-600 hover:bg-green-300"
        >
          Change status
        </AlertDialogTrigger>
      </OrderUpdateStatusSection>
    );
  }
);
export default TableOrderSection;
