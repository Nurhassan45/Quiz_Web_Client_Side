import axios from "axios";

const axiosInstance = axios.create({
    baseURL:"https://serverside-eta.vercel.app",
});
export default axiosInstance;