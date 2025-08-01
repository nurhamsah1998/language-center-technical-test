import { Button } from "@/components/ui/button";
import ProductMutationSection, {
  type productFormProps,
} from "./components/mutation.section";
import { AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useState } from "react";

function ProductSection() {
  const [data, setData] = useState<productFormProps>({
    name: "",
    sellPrice: 0,
    buyPrice: 0,
    categoryId: undefined,
    mutation: "post",
  });
  return (
    <div>
      <div className="flex justify-end">
        <ProductMutationSection data={data} setData={setData}>
          <AlertDialogTrigger>New Product</AlertDialogTrigger>
        </ProductMutationSection>
      </div>
    </div>
  );
}

export default ProductSection;
