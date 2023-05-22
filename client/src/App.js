import React, { Suspense } from "react";
import { HashRouter } from "react-router-dom";
import { Router } from "./router";
import { Spinner } from "components";

export default function App(){
  
  return(
    <Suspense fallback={<Spinner />}>
      <HashRouter>
        <Router />
      </HashRouter>
    </Suspense>
  )
}