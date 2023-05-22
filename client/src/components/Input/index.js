import React, { useState, useEffect } from "react";


import "./input.component.css";

export const Input = ({
  type = "text",
  value = "",
  id = null,
  name,
  label,
  placeholder = "",
  icon = null,
  isReadOnly = false,
  register = null,
  errors = null,
  onClick = null,
  onChange = null,
  iconClick = null,
  className = null,
  children
}) => {
  const[isError, setError] = useState(false);
  const error = errors && errors[name];
  useEffect(() => {
    if (error) {
      setError(true);
    } else {
      setError(false);
    }
  }, [error]);

  return (
    <div className={className}>
      { label && <label htmlFor={id}>{label}</label>}
      {!isReadOnly ? 
        <input
          type = { type }
          defaultValue = {value}
          id = { id }
          name = { name }
          onClick = { onClick }
          onChange = { onChange }
          placeholder = { placeholder }
          { ...typeof register === "object" ? register : "" }
          style={{borderBottom: isError ? "1px solid #ff0000": ""}}
          autoComplete= "off"
        /> :
        <span>{value}</span>
      }
      {children}
      { icon && <i className={icon} onClick={ iconClick }></i> }
      { errors && errors[name] && <span>{ errors[name].message }</span> }
    </div>
  );
};