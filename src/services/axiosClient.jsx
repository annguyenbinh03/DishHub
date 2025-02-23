import axios from "axios";
import { toast } from 'react-toastify';

const instance = axios.create({
  baseURL: import.meta.env.VITE_BACK_END,
  timeout: 300000,
});

instance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const { status, message } = error.response;
    toast.error(`Fetch Api fail: ${message}`, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
      });
    if (status === 404 || status === 400) {
      console.log(message);
      return error;
    } else {
      console.log(error);
      return error;
    }
  }
);

export default instance;