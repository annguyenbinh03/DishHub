import axiosClient from "./axiosClient";

const END_POINTS = {
  GET_DISHES: "admin/dishes",
  GET_STAFF_DISHES: "dishes",

};

export const getAdminDishes = () => {
    const url = `${END_POINTS.GET_DISHES}`;
    return axiosClient.get(url);
};

export const getDishes = () => {
  const url = `${END_POINTS.GET_STAFF_DISHES}`;
  return axiosClient.get(url);
};
