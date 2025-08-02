import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { productProps } from "@/section/product/product.section";
import { useNavigate } from "react-router-dom";

function CardProduct({ item }: { item: productProps }) {
  const nav = useNavigate();
  const handleClick = () => {
    nav(`/product/${item?.id}`);
  };
  return (
    <div className="w-sm">
      <Card
        className=" cursor-pointer hover:scale-[1.04] hover:shadow-md duration-100"
        onClick={handleClick}
      >
        <CardContent>
          <CardHeader>
            <CardTitle>{item?.name}</CardTitle>
            <CardDescription>{item?.desc}</CardDescription>
            <div className="bg-teal-100 text-teal-700 font-semibold text-xs p-2 rounded-md w-fit">
              {item?.productCategory?.name}
            </div>
            <div>
              <span className=" font-black text-xl">Rp{item?.sellPrice}</span>
            </div>
          </CardHeader>
          <CardFooter className="mt-5">
            <div className="flex gap-4 justify-between w-full">
              <span>stock : {item?.stock}</span>
              <span>selled : {item?.selled}</span>
            </div>
          </CardFooter>
        </CardContent>
      </Card>
    </div>
  );
}

export default CardProduct;
