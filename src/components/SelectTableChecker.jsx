import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const SelectTableChecker = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Chỉ kiểm tra nếu user đang ở trang staff (/user/*)
    if (!location.pathname.startsWith("/user/")) return;

    const storedTableData = JSON.parse(localStorage.getItem("selectedTable"));
    const today = new Date().toISOString().split("T")[0];

    // Nếu không có bàn hoặc bàn đã hết hạn, xóa dữ liệu và chuyển hướng
    if (!storedTableData || storedTableData.date !== today) {
      localStorage.removeItem("selectedTable");
      localStorage.removeItem("tableId");
      navigate("/user/table-setting");
    }
  }, [navigate, location.pathname]);

  return null;
};

export default SelectTableChecker;
