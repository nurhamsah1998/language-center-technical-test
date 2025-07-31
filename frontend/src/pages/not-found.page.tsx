import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

function NotFoundPage() {
  const nav = useNavigate();
  return (
    <div className="w-full h-dvh flex justify-center items-center">
      <div className=" flex flex-col justify-center gap-3">
        <p> Opps, Page Not Found</p>
        <Button onClick={() => nav("/")}>Back Home</Button>
      </div>
    </div>
  );
}

export default NotFoundPage;
