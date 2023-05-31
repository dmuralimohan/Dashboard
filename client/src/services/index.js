import axios from "axios";
import { cookies } from "utils";

export { submitLogin, submitRegister, isExistsEmail } from "./user";

export const axiosInstance = axios.create({
    baseURL: "http://localhost:3001"
})

axiosInstance.interceptors.request.use(function(request){
    request.headers.Authorization = cookies().get("AUTH_TOKEN"); 
    console.log(cookies().get("AUTH_TOKEN"));
    return request;
    },function (err){
        return Promise.reject(err);
    }
);

axiosInstance.interceptors.response.use((response) => {
    console.log(response.baseURL);
    return response;
}, async (err) => {
    const originalRequest = err.config;
    if( err.response && err.response.status && err.response.status === 1001 && !originalRequest._retry)
    {
        axiosInstance.post("/updateAuthToken", {
            data: JSON.stringify(cookies().get("REFRESH_TOKEN"))
        }).then(res => {
            originalRequest._retry = true;
            return axios(originalRequest);
        }).catch(err => err);
    }

    return Promise.reject(err);
});