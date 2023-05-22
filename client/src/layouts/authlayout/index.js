import React from "react";
import { Outlet } from "react-router-dom";

const AuthLayout = ({children}) =>{
    return(
       <>
        <div>
            <h2>Authentication Layout</h2>
        </div>
        <div>
            <Outlet />
        </div>
       </>
    )
}

export default AuthLayout;