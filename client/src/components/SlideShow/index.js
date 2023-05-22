import React, { useState, useEffect } from "react";
import { Button } from "components";

import "./slideshow.component.css";

const Indicator = ({index, i, onClick}) => {
    const BagroundColor = index === i ? "#000000" : "#ffffff";
    const BoxShadow = index === i ? "1px 1px 20px black": "0 0 0";
    return <span onClick = {() => onClick(i)} className= "indicator" style={{backgroundColor: BagroundColor, boxShadow: BoxShadow}}></span>
}
const ImageIndicator = ({index, length, onClick}) => {
    let element = [];
    for(var i = 0;i<length;i++)
        element.push( <Indicator index={index} i={i} key={i} onClick={onClick} /> );
    return(
        <div className= "imageIndicator">
            { element }
        </div>
    );
}
export const SlideShow = (props) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const { imageData, duration, isButton } = props;
    const totalImage = imageData?.length;
    const moveButton = isButton ? 
        <>
        <Button value= "<" className= "previous" Click= {() => previous()} />
        <Button value= ">" className= "next" Click= {() => next()}  />
        </> : "";

    const previous = () => setCurrentIndex(prev => prev === 0 ? totalImage - 1 : --prev);
    const next = () => setCurrentIndex(prev => prev === (totalImage - 1) ? 0 : ++prev);
    const setIndex = (index) => setCurrentIndex(index);

    useEffect( () => {
        if(duration > 0){
            let id = setInterval(next , 2500);

            return () => clearInterval(id);
        }
    },[currentIndex]);

    return(
        <div className="slideshow">
            <img className="slideImage"
             style ={{
                animation: "opacity1 2.5s ease-in-out infinite"
             }}
             src={imageData[currentIndex].type} alt={`slide ${currentIndex + 1}`} />
            <ImageIndicator index= { currentIndex } length= {totalImage} onClick = {(index) => setIndex(index)} />
             { moveButton }
        </div>
    )
}