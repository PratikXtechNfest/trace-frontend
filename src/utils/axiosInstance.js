import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

// baseURL: "http://localhost:3000".,
// http://localhost:3306
