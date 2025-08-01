import useFetch from "@/hooks/useFetch";
import { useNavigate, useParams } from "react-router-dom";
import type { productProps } from "../product/product.section";
import { Button } from "@/components/ui/button";
import { useUserSession } from "@/store/user-session.store";

function DetailProductSection() {
  const { id } = useParams();
  const { id: userId } = useUserSession();
  const { data } = useFetch({
    api: `/product/public${id ? `/${id}` : ""}`,
    invalidateKey: `/product/public${id ? `/${id}` : ""}`,
  });
  const nav = useNavigate();
  const product: productProps = data?.data;
  const handleBuy = () => {
    if (!userId) {
      return nav("/login");
    }
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
            Rp{product?.sellPrice}
          </p>
        </div>
        <Button onClick={handleBuy} className="mt-5 md:w-fit w-full">
          Buy Now!
        </Button>
      </div>
    </div>
  );
}

export default DetailProductSection;
