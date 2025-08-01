import { Navigate } from "react-router-dom";

function OrderSection() {
  if (!localStorage.getItem("accessToken")) return <Navigate to="/" replace />;
  return <div>OrderSection</div>;
}

export default OrderSection;
