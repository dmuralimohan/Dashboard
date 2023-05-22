import React from "react";
import { NavLink } from "react-router-dom";

import "bootstrap-icons/font/bootstrap-icons.css";
import "./header.home.css";

function Link(props){
    const {value,path,icon,id} = props;
    return(
        <NavLink to={path} id={id}>
            {icon && <i className={icon}></i>}
            {value}
        </NavLink>
    )
}
function NavBar({data}){
    const element = Object.keys(data).map(v => <Link value={v} path={data[v].path} key={v} icon={data[v].icon} />);

    return(
        <div className="nav">
            <input type={"checkbox"} id="nav-check" />
            <Link value="Login" path="/login" icon="bi bi-box-arrow-in-right" id="login" />
            <div className="nav-links">
                <label className="nav-close" htmlFor="nav-check">X</label>
                {element}
            </div>
            <label className="nav-btn" htmlFor="nav-check"><i className="bi bi-justify"></i></label>
        </div>
    )
}
export const Header = () =>{
    const navData = {
        Home:{
            path:"/",
            icon:"bi bi-house-door"
        },
        Contact:{
            path:"/contact",
            icon:"bi bi-person-rolodex"
        },
        About:{
            path:"/about",
            icon:"bi bi-file-person-fill"
        }
    }
    return(
        <NavBar data={navData} />
    )
}