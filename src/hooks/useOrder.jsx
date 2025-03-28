import { useContext } from "react";
import OrderContext from "contexts/OrderContext";

const useOrder = () => {
    return useContext(OrderContext);
}

export default useOrder;