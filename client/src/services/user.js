import { axiosInstance } from "services";
import { Navigate } from "react-router-dom";
import { cookies } from "utils";

export const submitLogin = (data) =>{
    console.log(`Data is before submitting: ${data}`);
    return axiosInstance.post("/signin",{
        data
    }).then(res => {
        console.log("TOKEN GENERATED SUCCESSFULLY ");
        console.log("TOKEN: "+ cookies.get("AUTH_TOKEN"));
        return res;
    }).catch(err => err);
}

export const submitRegister = (data) =>{
    return axiosInstance.post()
}