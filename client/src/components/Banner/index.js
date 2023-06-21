import React from 'react';

import "./banner.component.css";

export const AlertBanner = ({
    type,
    content
})  => {
    return(
        <div class= {type}>
            <h1>{content}</h1>
        </div>
    )
};