import { axiosInstance } from "services";
import { Navigate } from "react-router-dom";
import { cookies } from "utils";

export const submitLogin = (data) =>{
    console.log(`Data is before submitting: ${data}`);
    return axiosInstance.post("/signin",{
        data
    }).then(res => {
        console.log("TOKEN GENERATED SUCCESSFULLY ");
        console.log(res);

        return res.data;
    }).catch(err => err);
}

export const isExistsEmail = (data) => {
    return axiosInstance.post("/validateEmail",{
        data
    }).then(res => {
        return res.data;
    }).catch(err => new Error(err));
}

export const submitRegister = (data) =>{
    return axiosInstance.post("/signup", {
        data
    }).then( res  => {
        console.log(res);
        return res.data;
    }).catch(err  => err);
}