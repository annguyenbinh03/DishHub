import axiosClient from "./axiosClient";

const END_POINTS = {
  GET_DISHES: "admin/dishes",
  GET_STAFF_DISHES: "dishes",
  GET_DISH_DETAIL: "dishes",

};

export const getAdminDishes = () => {
    const url = `${END_POINTS.GET_DISHES}`;
    return axiosClient.get(url);
};

export const getDishes = () => {
  const url = `${END_POINTS.GET_STAFF_DISHES}`;
  return axiosClient.get(url);
};

export const getDishDetail = (id) => {
  const url = `${END_POINTS.GET_DISH_DETAIL}/${id}`;
  return axiosClient.get(url);
};
