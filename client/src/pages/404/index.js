import React from "react";
import { NavLink } from "react-router-dom";


const PageNotFound = () =>{
    return(
        <div class="pagenotfound">
            <h1>404</h1>
            <NavLink to="/login">Click here to Login</NavLink>
        </div>
    )
}

export default PageNotFound;