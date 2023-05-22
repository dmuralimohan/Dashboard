import React, { useState, createContext, useContent } from "react";


const AuthContext = createContext();

export const useAuth = () =>{
    const [token, setToken] = useState(null);
    
}