import axios from "axios";
import { cookies } from "utils";

export { submitLogin } from "./user";

export const axiosInstance = axios.create({
    baseURL: "http://localhost:3000"
})

axiosInstance.interceptors.request.use(function(config){
    config.headers.Authorization = cookies().get("AUTH_TOKEN");
    return config;
    },function (err){
        return Promise.reject(err);
    }
);

axiosInstance.interceptors.response.use((response) => {
    return response;
}, async (err) => {
    const originalRequest = err.config;
    if(err.response.status === 1001 && !originalRequest._retry)
    {
        axiosInstance.post("/updateAuthToken", {
            data: JSON.stringify(cookies().get("REFRESH_TOKEN"))
        }).then(res => {
            originalRequest._retry = true;
            return axios(originalRequest);
        }).catch(err => err);
    }

    return Promise.reject(err);
})