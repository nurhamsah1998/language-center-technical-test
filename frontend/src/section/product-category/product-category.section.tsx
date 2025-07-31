import { AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useState } from "react";
import ProductCategoryMutationSection, {
  type productCategoryFormProps,
} from "./mutation.section";

function ProductCategorySection() {
  const [data, setData] = useState<productCategoryFormProps>({
    name: "",
    mutation: "post",
  });
  return (
    <div>
      <div className="flex justify-end">
        <ProductCategoryMutationSection data={data} setData={setData}>
          <AlertDialogTrigger>New category</AlertDialogTrigger>
        </ProductCategoryMutationSection>
      </div>
    </div>
  );
}

export default ProductCategorySection;
