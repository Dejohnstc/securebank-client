import axios from "axios";

/* Create API client */

const api = axios.create({
  baseURL: "https://securebank-api-ixis.onrender.com",
  withCredentials: true
});

/* Attach token automatically */

api.interceptors.request.use((config) => {

  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;

});

/* Handle expired / invalid tokens globally */

api.interceptors.response.use(

  (response) => response,

  (error) => {

    if (error.response && error.response.status === 401) {

      console.warn("Session expired. Logging out.");

      localStorage.removeItem("token");

      window.location.href = "/";

    }

    return Promise.reject(error);

  }

);

export default api;