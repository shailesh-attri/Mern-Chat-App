import {React, useState, createContext } from 'react';
export const AuthContext = createContext()

export const AuthContextProvider = ({children})=>{
    const [authUser, setAuthUser] = useState('')
    console.log("authUserId",authUser);

    return (
        <AuthContext.Provider value={{authUser,setAuthUser}}>
        {children}
        </AuthContext.Provider>
    )
}