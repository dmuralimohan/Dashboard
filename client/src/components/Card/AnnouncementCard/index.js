import React from "react";


import "./announcement.card.css";
import Speaker from "../../../assets/speaker.jpeg"

export const AnnouncementCard = (props) =>{
    return (
        <div className="card">
            <img src={Speaker} className="speaker speaker1" alt="speaker1" />
            <img src={Speaker} className="speaker speaker2" alt="speaker2" />
            {props.children}
        </div>
    )
}