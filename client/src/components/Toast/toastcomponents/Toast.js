import { EventEmitter } from './EventEmitter';

export const Toast = ({
    id,
    message= "",
    position= "top-right",
    type,
    themeType,
    color,
    closeIcon,
    delay= 3000,
    pauseOnHover
}) => {
    let generateId = () => {
        return new Date().getTime().toString();
    };    
    EventEmitter.emit("toast", {
        id: generateId(),
        position,
        message,
        type,
        themeType,
        color,
        delay,
        closeIcon,
        pauseOnHover
    });
}