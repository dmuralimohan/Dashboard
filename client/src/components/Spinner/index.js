import React from "react";


import "./spinner.component.css";

export const Spinner = ({size, color= "black", content = null}) => {
    size = size ? size : "70px";
    return(
        <div className="circle">
            <div className="rotate" style={{borderColor: color, height: size, width: size}}></div>
            {content && <div className="loadingContent">{content}</div>}
        </div>
    )
}