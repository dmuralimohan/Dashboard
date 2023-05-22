import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./authContext";
import { cookies } from "utils";


export const PrivateRoute = ({element, path}) =>{
    const cookie = cookies();
    const isAuthenticated = cookie.get("userEmail");

    return isAuthenticated ? element : <Navigate to="/login" replace state={{from:path}} />
}