import {React, useState, createContext } from 'react';
export const BlockedUsersContext = createContext()

export const BlockedUsersContextsProvider = ({children})=>{
    const [BlockedUsers, setBlockedUsers] = useState('')
    const [isVisibleInput, setVisibleInput] = useState(null)
    const [isBlocking, setIsBlocking] = useState(null)
    const sendBlock = (data)=>{
        setBlockedUsers(data)
    }
    const sendIsVisibleInput = (data)=>{
        setVisibleInput(data)
        
    }
    const sendIsBlocked = (data)=>{
        setIsBlocking(data)
    }
    return (
        <BlockedUsersContext.Provider value={{sendIsBlocked,BlockedUsers,sendBlock,sendIsVisibleInput,isVisibleInput,isBlocking}}>
        {children}
        </BlockedUsersContext.Provider>
    )
}