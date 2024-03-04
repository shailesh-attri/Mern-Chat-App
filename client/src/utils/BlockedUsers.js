import {React, useState, createContext } from 'react';
export const BlockedUsersContext = createContext()

export const BlockedUsersContextsProvider = ({children})=>{
    const [BlockedUsers, setBlockedUsers] = useState('')
    const [isBlocking, setIsBlocking] = useState(null)
    const [isSender, setSenderId] = useState(null)
    const sendBlock = (data)=>{
        setBlockedUsers(data)
    }
    
    const sendBlockedUsers = (data)=>{
        setIsBlocking(data)
    }
    const sendSenderId  = (data)=>{
        setSenderId(data)
    }
    console.log("isSender",isSender);
    return (
        <BlockedUsersContext.Provider value={{sendBlockedUsers,BlockedUsers,sendBlock,isBlocking,sendSenderId,isSender}}>
        {children}
        </BlockedUsersContext.Provider>
    )
}