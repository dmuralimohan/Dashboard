import React from "react";


export const Button = ({
    type = "button",
    value,
    id,
    Click,
    Change,
    MouseOver,
    MouseOut,
    className
}) => {
    return(
        <button
        type= { type }
        id = { id }
        onChange = { Change }
        onClick = { Click }
        onMouseOver = { MouseOver }
        onMouseOut = { MouseOut }
        className = { className }
        >
        { value }
        </button>
    )
}