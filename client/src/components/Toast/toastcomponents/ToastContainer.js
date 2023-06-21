import React, { useState, useEffect, useMemo } from 'react';
import { EventEmitter, Portal, ToastCard } from './index';

const positions = [
    "top-left",
    "top-center",
    "top-right",
    "bottom-right",
    "bottom-center",
    "bottom-left"
];
const types = ["error","info","success", "warning"];

const positionTypes = new Set(positions);
const themeTypes = new Set(types);

export const ToastContainer = () => {
    const [toast, setToast] = useState([]);

    const handleNewEventEmitter = (event) => {
        let { position, themeType} = event;

        if(!positionTypes.has(position) && !themeTypes.has(themeType)) return;
        setToast((prev) => [...prev, event]);
    }

    const clearToast = (toastId) => setToast((prev) => prev.filter(({id})=> id !== toastId));

    const toastsContainer = useMemo(() => {
        return positions.map((positionType) => toast.filter(({position}) => positionType === position));
    }, [toast]);

    useEffect(() => {
        EventEmitter.on("toast", handleNewEventEmitter);
        return () => EventEmitter.off("toast");
    });

    return (
        <Portal>
            {
                toastsContainer.map((item, index) => {
                    if(item.length === 0) return;
                    return (
                        <div
                         key= {index}
                         className= "toast-container"
                         position-type= {positions[index]}
                        >
                            {
                                item.map((tCard) => {
                                    const { id } = tCard;
                                    return <ToastCard key= {id} {...tCard} clearToast= {clearToast}/>;
                                })
                            }
                        </div>
                    );
                })
            }
        </Portal>
    )
}