import React from "react";


import "./select.component.css";

export const Option = ({value, disabled, register, children}) =>{
    return(
        <option
        disabled= {disabled}
        value={value}
        {...typeof register === "object" ? register : ""}
        >
            {children}
        </option>
    )
}
export const Select = ({label, labelFor, id, title, value, name, required, className, children, register, onChange}) =>{
    return(
        <div className= {className}>
            { label && <label htmlFor={labelFor}>{label}</label>}
            <select
            title= {title}
            value= {value}
            id= {id}
            name= {name}
            required = {required ?? true}
            onChange = {onChange}
            {...typeof register === "object" ? register : ""}
            >
            { children }
            </select>
        </div>
    )
}