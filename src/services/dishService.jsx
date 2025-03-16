import axiosClient from "./axiosClient";

const END_POINTS = {
  GET_DISHES: "admin/dishes",
  GET_STAFF_DISHES: "dishes",
  CREATE_DISH: "admin/dishes",
  UPDATE_DISH: (id) => `admin/dishes/${id}`,
  DELETE_DISH: (id) => `admin/dishes/${id}`,
  GET_DISH_DETAIL: "dishes",
};

export const getAdminDishes = (token) => {
  const url = `${END_POINTS.GET_DISHES}`;
  return axiosClient.get(url, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const getDishes = (token) => {
  const url = `${END_POINTS.GET_STAFF_DISHES}`;
  return axiosClient.get(url, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const createDish = (dishData) => {
  const formData = new FormData();
  formData.append("name", dishData.name);
  formData.append("description", dishData.description);
  formData.append("categoryId", dishData.categoryId);
  formData.append("price", dishData.price);
  formData.append("status", dishData.status);
  formData.append("restaurantId", dishData.restaurantId);
  formData.append("ingredients", JSON.stringify(dishData.ingredients));

  // Only append image if it's available
  if (dishData.image) {
    formData.append("image", dishData.image);
  }

  return axiosClient.post(END_POINTS.CREATE_DISH, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
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

export const getDishDetail = (id, token) => {
  const url = `${END_POINTS.GET_DISH_DETAIL}/${id}`;
  return axiosClient.get(url, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

