import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import useFetch from "@/hooks/useFetch";
import type { ReactElement } from "react";
import type { orderProps } from "../order.section";

function DetailOrderSection({
  children,
  orderId,
}: {
  children: ReactElement;
  orderId: string | undefined;
}) {
  /// GET ORDER BY ID
  const { data, isLoading } = useFetch({
    api: `/order/${orderId}`,
    invalidateKey: `/order/${orderId}`,
    enabled: Boolean(orderId),
  });
  const dataOrder: orderProps = data?.data;
  return (
    <AlertDialog>
      {children}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Detail order</AlertDialogTitle>
          <AlertDialogDescription>-</AlertDialogDescription>
        </AlertDialogHeader>
        <div className="max-h-[300px] overflow-auto">
          {isLoading ? (
            <div>
              <p className="text-center font-bold text-slate-500 text-lg py-14 animate-pulse">
                Getting data...
              </p>
            </div>
          ) : (
            <div className="grid gap-3">
              <div>
                <p className="text-sm leading-3 text-slate-600">
                  Order code :{" "}
                </p>
                <p className="text-md font-bold">{dataOrder?.orderCode}</p>
              </div>
              <div>
                <p className="text-sm leading-3 text-slate-600">
                  Customer name :{" "}
                </p>
                <p className="text-md font-bold">
                  {dataOrder?.customer?.profile?.name}
                </p>
              </div>
              <div className="p-2 border-2 border-slate-400">
                <p className="text-sm leading-3 text-slate-600">
                  Product order :{" "}
                </p>
                <div className="mt-3">
                  {dataOrder?.ProductOnOrder?.map((item, idx) => (
                    <div className="mb-3" key={idx}>
                      <div>
                        <p className="text-sm leading-3 text-slate-600">
                          name :{" "}
                        </p>
                        <p className="text-md font-bold">
                          {item?.product?.name}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm leading-3 text-slate-600">
                          qty :{" "}
                        </p>
                        <p className="text-md font-bold">{item?.qty}</p>
                      </div>
                      <div>
                        <p className="text-sm leading-3 text-slate-600">
                          price :{" "}
                        </p>
                        <p className="text-md font-bold">
                          Rp{item?.product?.sellPrice}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm leading-3 text-slate-600">
                          total :{" "}
                        </p>
                        <p className="text-md font-bold">
                          Rp{item?.product?.sellPrice * item?.qty}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm leading-3 text-slate-600">Status : </p>
                <p className="text-md bg-slate-200 font-bold text-slate-700 w-fit p-2 rounded-md mt-1">
                  {dataOrder?.status}
                </p>
              </div>
              <div>
                <p className="text-sm leading-3 text-slate-600">
                  Created at :{" "}
                </p>
                <p className="text-md font-bold">
                  {new Date(dataOrder?.createdAt || "").toDateString()}
                </p>
              </div>
            </div>
          )}
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel id="close-btn-detail-order">
            Close
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DetailOrderSection;
