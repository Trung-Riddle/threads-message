import axios from "axios";

axios.defaults.withCredentials = true;
const instance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
});
instance.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  function (response) {
    return response.data;
  },
  function (error) {
    return error.response.data;
  }
);
export default instance;

