import axiosClient from './axiosClient';

const END_POINTS = {
  GET_CATEGORIES: "categories", 
};

export const getCategories = () => {
  const url = `${END_POINTS.GET_CATEGORIES}`;
  return axiosClient.get(url);
}
