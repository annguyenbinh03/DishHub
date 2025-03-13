import axiosClient from "./axiosClient";

const END_POINTS = {
  LOGIN: "auth/login",
  LOGIN_GOOGLE: "/auth/login-google",
  GET_TOKEN: "/auth/login",
  LOG_OUT: "/auth/logout"
};


export const loginGoogle = (token) => {
  const url = `${END_POINTS.LOGIN_GOOGLE}`;
  return axiosClient.post(url,{token});
};

export const login = (username, password) => {
  const url = `${END_POINTS.LOGIN}`;
  return axiosClient.post(url,{username, password});
};

export const logout = (token) => {
  const url = `${END_POINTS.LOGIN}`;
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  return axiosClient.post(url,{username, password}, null , config);
};

export const getToken = ( username, password ) => {
  return axiosClient.post(`${END_POINTS.GET_TOKEN}`, {username, password});
};

export const refreshAccessToken = ( token ) => {
  return axiosClient.post(`${END_POINTS.REFRESH_TOKEN}`, {token});
};
