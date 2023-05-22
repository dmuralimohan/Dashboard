import React,{ Suspense, useState } from "react";
import { Outlet } from "react-router-dom";

import { Header } from "./Header";
import { Spinner } from "components";

import "./home.layout.css";

const Home = () => {
    return(
       <Suspense fallback={<Spinner size="150px" color="#ffffff" />}>
            <Header />
            <div className="outlet">
                <Suspense fallback={<Spinner color="#ffffff" size="70px" />}>
                    <Outlet />
                </Suspense>
            </div>
       </Suspense>
    )
}

export default Home;