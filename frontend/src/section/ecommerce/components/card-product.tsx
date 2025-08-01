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
      <Card className=" cursor-pointer" onClick={handleClick}>
        <CardContent>
          <CardHeader>
            <CardTitle>{item?.name}</CardTitle>
            <CardDescription>{item?.desc}</CardDescription>
            <div>
              <span className=" font-black text-xl">Rp{item?.sellPrice}</span>
            </div>
          </CardHeader>
          <CardFooter className="mt-5">
            <div>
              <span>selled : {item?.selled}</span>
            </div>
          </CardFooter>
        </CardContent>
      </Card>
    </div>
  );
}

export default CardProduct;
