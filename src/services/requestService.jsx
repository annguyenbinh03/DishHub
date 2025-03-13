import axiosClient from './axiosClient';

const END_POINTS = {
  CREATE_REQUEST: "requests",
  REQUEST_HISTORY: "requests/history",
  REQUEST_TYPES: "admin/request-types"
};

export const createRequest = (data) => {
  const url = `${END_POINTS.CREATE_REQUEST}`;
  return axiosClient.post(url, data);
};

export const fetchRequestHistory = (orderId) => {
  const url = `${END_POINTS.REQUEST_HISTORY}?orderId=${orderId}`;
  return axiosClient.get(url);
};

export const fetchRequestTypes = () => {
  const url = `${END_POINTS.REQUEST_TYPES}`;
  return axiosClient.get(url);
};

