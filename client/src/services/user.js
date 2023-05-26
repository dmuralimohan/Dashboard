import { axiosInstance } from "services";
import { Navigate } from "react-router-dom";
import { cookies } from "utils";

export const submitLogin = (data) =>{
    return axiosInstance.post("/signin",{
        data: data
    }).then(res => {
        console.log("TOKEN GENERATED SUCCESSFULLY ");
        console.log("TOKEN: "+ cookies.get("AUTH_TOKEN"));
        return res;
    }).catch(err => err);
}

export const submitRegister = (data) =>{
    return axiosInstance.post()
}