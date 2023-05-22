import React, { lazy } from "react";
import { useRoutes } from "react-router-dom";
import { GetRouterPath } from "./routepath";
import { PrivateRoute } from "./authenticateRoute";

const MakeElement = ({component, path, auth}) =>{
    return auth ? (<PrivateRoute element= {component} path={path} />) : component;
}

export const Router = () => {
    const routerPath = GetRouterPath();
    const routingElements = routerPath.map((route) =>{
        return{
            ...route,
            element: (<MakeElement component= {route.element} path= {route.path} auth= {route.auth} />),
            children: route.children ? 
                route.children.map(childRoute =>{
                    return{
                        ...childRoute,
                        element: <MakeElement component= {childRoute.element} path= {childRoute.path} auth={childRoute.auth} />
                    }
                })
            : false
        }
    });

    return useRoutes(routingElements);
}