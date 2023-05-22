import React, { lazy } from "react";
import { Navigate, NavLink } from "react-router-dom";
import { Spinner } from "components";
import { cookies } from "utils";


const Lazy = (path) => {
    return lazy(() => import(`../${path}`));
};
const HomeLayout = Lazy("layouts/home");
const AuthLayout = Lazy("../layouts/authlayout");

const HomePage = Lazy("pages/home");
const LoginPage = Lazy("pages/login");
const RegisterPage = Lazy("pages/register");
const ContactPage = Lazy("pages/contact");
const DashBoard = Lazy("pages/dashboard");
const PageNotFound = Lazy("pages/404");

export const GetRouterPath = () => {
    const cookie = cookies();
    const isLoggedIn = cookie.get("AUTH_TOKEN");
    const routerPath = [
        {
            path: "/",
            element: <Navigate replace to= { isLoggedIn ? "/app/dashboard" : "/home" } />
        },
        {
            path: "/",
            element: <HomeLayout />,
            children:[
                {
                    path: "home",
                    element: <HomePage />,
                    auth: false
                },
                {
                    path: "contact",
                    element: <ContactPage />,
                    auth: false
                },
                {
                    path: "about",
                    element:(<h2 style={{color: "#ffffff"}}>About</h2>),
                    auth: false
                },
                {
                    path: "login",
                    element: <LoginPage />,
                    auth: false
                },
                {
                    path:"register",
                    element: <RegisterPage />,
                    auth: false
                }
            ]
        },
        {
            path: "app",
            element: <AuthLayout />,
            children: [
                {
                    path: "dashboard",
                    element: <DashBoard />,
                    auth: false
                }
            ]
        },
        {
            path: "*",
            element: <PageNotFound />
        }
    ];

    return routerPath;
}

// export const GetRouterPath = () => {
//     const cookie = cookies();
//     const isLoggedIn = cookie.get("authentication_token");
  
//     const routerPath = [
//       {
//         path: "/",
//         element: lazy(() => import("../layouts/home")),
//         children: [
//           { path: "home", element: lazy(() => import("../pages/home")), auth: false },
//           { path: "contact", element: lazy(() => import("../pages/contact")), auth: true },
//           { path: "about", element: lazy(() => import("../pages/about")), auth: true },
//           { path: "login", element: lazy(() => import("../pages/login")), auth: false },
//           { path: "register", element: lazy(() => import("../pages/register")), auth: false },
//         ],
//       },
//       {
//         path: "/app",
//         element: lazy(() => import("../layouts/authlayout")),
//         children: [
//           { path: "dashboard", element: lazy(() => import("../pages/dashboard")), auth: true },
//         ],
//       },
//       { path: "*", element: lazy(() => import("../pages/404")) },
//     ];

//     return routerPath;
// };