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

function TrackingOrderSection({
  children,
  orderId,
}: {
  children: ReactElement;
  orderId: string;
}) {
  /// GET ORDER BY ID
  const { data, isLoading } = useFetch({
    api: `/order/${orderId}/tracking`,
    invalidateKey: `/order/${orderId}/tracking`,
    enabled: Boolean(orderId),
  });
  const dataOrder: string[] = data?.data;

  return (
    <AlertDialog>
      {children}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Order tracking</AlertDialogTitle>
          <AlertDialogDescription>-</AlertDialogDescription>
        </AlertDialogHeader>
        <div>
          {isLoading ? (
            <div>
              <p className="text-center font-bold text-slate-500 text-lg py-14 animate-pulse">
                Getting data...
              </p>
            </div>
          ) : (
            <div>{dataOrder?.join(" > ")}</div>
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

export default TrackingOrderSection;
