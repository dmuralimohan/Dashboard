import React, { useRef } from 'react';
import PropTypes from 'prop-types';

export const ToastCard = ({
    id,
    message= "",
    type,
    themeType,
    color,
    delay= 3000,
    closeIcon,
    pauseOnHover,
    clearToast
}) => {
    const toastRef = useRef();

    const progressRef = useRef();

    const animateMouseEnter = () => {
        progressRef.current.style["animation-play-state"] = "paused";
    }

    const animateMouseLeave = () => {
        progressRef.current.style["animation-play-state"] = "running";
    }

    const hideToast = () => {
        toastRef.current.classList.add("hide");
    }

    const animationEnd = ({ animationName }) => {
        if(animationName === "toast_progress") {
            hideToast();
            return;
        }
        if(animationName.includes("slideOut")) {
            clearToast(id);
            return;
        }
    }
    return(
        <div
         ref= { toastRef }
         className= "toast"
         theme-type= { themeType }
         data-type= { type }
         {...(color && { style: `--custom-bg: ${color}`})}
         onMouseEnter = { () => pauseOnHover && animateMouseEnter() }
         onMouseLeave = { () => pauseOnHover && animateMouseLeave() }
         onAnimationEnd = { animationEnd }
        >
            <div className= "icon">
                <i></i>
            </div>
            <div>
                <span>{message}</span>
            </div>
            {
                closeIcon && (
                    <button onClick= { hideToast }>&#xD7;</button>
                )
            }
            <div
             ref= { progressRef }
             className= "progress"
             style= {{"--progress-anim-delay": delay+"ms"}}
            ></div>
        </div>
    )
};

ToastCard.propTypes = {
    id: PropTypes.string.isRequired,
    types: PropTypes.oneOf(["success", "warning", "info", "error"]),
    message: PropTypes.string.isRequired,
    delay:  PropTypes.number,
    closeIcon: PropTypes.bool,
    pauseOnHover: PropTypes.bool,

}

ToastCard.defaultProps = {
    type: "success",
    delay: 3000,
    closeIcon: true,
    pauseOnHover: true,
    theme: "light"
}