import axiosClient from './axiosClient';

const END_POINTS = {
  CREATE_REQUEST: "requests", 
};

export const createRequest = (token, data ) => {
  const url = `${END_POINTS.CREATE_REQUEST}`;
  return axiosClient.post(url, data, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }); 
};

export const getRequestHistory = (orderId, token) => {
  const url = `requests/history?orderId=${orderId}`;
  return axiosClient.get(url, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

export const getRequestTypes = (token) => {
  const url = `admin/request-types`;
  return axiosClient.get(url, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}



