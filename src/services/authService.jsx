import axiosClient from "./axiosClient";

const END_POINTS = {
  LOGIN: "auth/login",
  LOGIN_GOOGLE: "/auth/login-google"
};


export const loginGoogle = (token) => {
  const url = `${END_POINTS.LOGIN_GOOGLE}`;
  return axiosClient.post(url,{token});
};

export const login = (username, password) => {
  const url = `${END_POINTS.LOGIN}`;
  return axiosClient.post(url,{username, password});
};