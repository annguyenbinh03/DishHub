import axiosClient from "./axiosClient";

const END_POINTS = {
    GET_ORDERS: "admin/orders",

};
export const getAdminOrders = async () => {
    const url = `${END_POINTS.GET_ORDERS}`;
    return axiosClient.get(url);
};