import axiosClient from "./axiosClient";

const END_POINTS = {
  GET_DISHES: "admin/dishes",
  GET_STAFF_DISHES: "dishes",
  CREATE_DISH: "admin/dishes",
  UPDATE_DISH: (id) => `admin/dishes/${id}`,
  DELETE_DISH: (id) => `admin/dishes/${id}`,
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
export const createDish = (dishData) => {
  return axiosClient.post(END_POINTS.CREATE_DISH, dishData, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};
export const updateDish = (id, dishData) => {
  return axiosClient.put(END_POINTS.UPDATE_DISH(id), dishData, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};
export const deleteDish = (id) => {
  return axiosClient.delete(END_POINTS.DELETE_DISH(id));
};

export const getDishDetail = (id) => {
  const url = `${END_POINTS.GET_DISH_DETAIL}/${id}`;
  return axiosClient.get(url);
};

