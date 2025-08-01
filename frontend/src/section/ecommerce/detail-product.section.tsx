import useFetch from "@/hooks/useFetch";
import { useNavigate, useParams } from "react-router-dom";
import type { productProps } from "../product/product.section";
import { Button } from "@/components/ui/button";
import { useUserSession } from "@/store/user-session.store";
import ModalAlert from "@/components/internal/modal-alert";
import { AlertDialogTrigger } from "@/components/ui/alert-dialog";
import useMutationX from "@/hooks/useMutationX";
import { useState } from "react";

function DetailProductSection() {
  const { id } = useParams();
  const { id: userId } = useUserSession();
  const [qty, setQty] = useState<number>(1);
  const { data } = useFetch({
    api: `/product/public${id ? `/${id}` : ""}`,
    invalidateKey: `/product/public${id ? `/${id}` : ""}`,
  });
  const nav = useNavigate();
  const product: productProps = data?.data;
  const mutation = useMutationX({
    api: "/order",
    invalidateKey: "/order",
    mutation: "post",
    onSuccess() {
      setQty(1);
    },
  });
  const handlePay = () => {
    mutation.mutate({
      products: [
        {
          productId: id,
          qty,
        },
      ],
    });
  };
  return (
    <div className="grid md:flex gap-10">
      <div>
        <div className=" w-full md:w-[400px] h-[300px] bg-slate-600 rounded-md" />
      </div>
      <div>
        <div>
          <p className="text-sm leading-3 text-slate-600">Name : </p>
          <p className="text-2xl font-bold">{product?.name}</p>
          <p className="text-sm leading-3 text-slate-600 mt-3">
            Description :{" "}
          </p>
          <p className="text-slate-800">{product?.desc}</p>
          <p className="mt-3">selled : {product?.selled}</p>
        </div>
        <div className="mt-4">
          <p className="text-sm leading-3 text-slate-600">Price : </p>
          <p className="text-2xl font-bold text-green-600">
            Rp{product?.sellPrice * qty}
          </p>
        </div>
        <div className="flex items-center gap-3 mt-4">
          <Button disabled={qty === 1} onClick={() => setQty(qty - 1)}>
            -
          </Button>
          <div className="text-xl font-bold text-slate-800">
            {qty}/{product?.stock}
          </div>
          <Button
            disabled={qty === product?.stock}
            onClick={() => setQty(qty + 1)}
          >
            +
          </Button>
        </div>
        {userId ? (
          <ModalAlert
            handleSubmit={handlePay}
            labelSubmit="Pay"
            title="Modal Payment"
            desc="Ini adalah section untuk pembayaran , bisa di integrasikan dengan layanan pembayaran pihak ketiga"
          >
            <AlertDialogTrigger className="inline-flex md:w-fit w-full mt-5 bg-primary h-9 px-4 py-2 has-[>svg]:px-3 text-primary-foreground shadow-xs hover:bg-primary/90 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive">
              Buy Now!
            </AlertDialogTrigger>
          </ModalAlert>
        ) : (
          <Button
            onClick={() => nav("/login")}
            className="mt-5 md:w-fit w-full"
          >
            Buy Now!
          </Button>
        )}
      </div>
    </div>
  );
}

export default DetailProductSection;
