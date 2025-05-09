import axios from "axios";

import { API_URL, API_URL_NEW } from "constants/request";

axios.defaults.headers.common["Content-Type"] = "multipart/form-data";

const axiosInstance = axios.create({
  baseURL: `${API_URL_NEW}`,
  timeout: 50000,
  params: {} // do not remove this, its added to add params later in the config
});

axiosInstance.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// preserve for the future, this is for update access token or handle unauthorized response
axiosInstance.interceptors.response.use(
  async response => {
    return response;
  },
  async error => {
    const originalRequest = error.config;
    const status = error.response?.status;
    if (!error.response) {
      return Promise.reject({
        ...error,
        response: {
          data: {
            message: JSON.parse(JSON.stringify(error))?.message || null
          }
        }
      });
    }

    if ((status === 401 || status === 403) && !originalRequest._retry) {
      const refreshToken = localStorage.getItem("refreshToken");
      const token = axios
        .post(`${API_URL_NEW}/auth/auth-token-refresh`, {
          refresh_token: refreshToken
        })
        .then(response => {
          if (response?.data?.access_token) {
            localStorage.setItem("token", response?.data?.access_token);
          }
          if (response?.data?.refresh_token) {
            localStorage.setItem("refreshToken", response?.data?.refresh_token);
          }
          return response?.data?.access_token;
        })
        .catch(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("expire");
          window.location = "/login";
          return false;
        });

      if (token) {
        originalRequest._retry = true;
        originalRequest.headers.authorization = `Bearer ${token}`;
        return axios(originalRequest);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
