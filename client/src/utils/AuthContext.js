import {React, useState, createContext } from 'react';
export const AuthContext = createContext()

export const AuthContextProvider = ({children})=>{
    const [authUser, setAuthUser] = useState('')
    const [loggedUser, setLoggedUser] = useState('')
    const [avatarMessage, setAvatarUrl] = useState('')
    const [profileUpdate, setProfileUpdate] = useState('')

    const sendLoggedData = (data)=>{
        setLoggedUser(data)
    }
    const sendAvatarData = (data)=>{
        setAvatarUrl(data)
        
    }
    
    const sendUpdateProfileData = (data)=>{
        setProfileUpdate(data)
    }
    return (
        <AuthContext.Provider value={
            {authUser,
            setAuthUser,
            sendLoggedData, 
            loggedUser,
            sendAvatarData,
            avatarMessage,
            profileUpdate,
            sendUpdateProfileData
            }
            }>
        {children}
        </AuthContext.Provider>
    )
}