import axiosClient from "./axiosClient";

const END_POINTS = {
  GET_DISHES: "admin/dishes",
};

export const getAdminDishes = () => {
    const url = `${END_POINTS.GET_DISHES}`;
    return axiosClient.get(url);
};