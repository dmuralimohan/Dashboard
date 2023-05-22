import React from "react";
import { AnnouncementCard } from "./AnnouncementCard";

export const Card = (props) =>{
    const {type} = props;
    let element="";
    if(type === "Announcement"){
        element = <AnnouncementCard>
            {props.children}
        </AnnouncementCard>
    }

    return element;
}