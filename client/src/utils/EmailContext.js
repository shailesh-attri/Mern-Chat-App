import {React, useState, createContext} from 'react';
const EmailContext = createContext()
const EmailContextProvider = ({children})=>{
    const [ContextEmail, setEmail] = useState([])
    const [ContextLoggedIn, setContextLoggedIn] = useState()
    const sendEmail = (data)=>{
        setEmail(data)
    }
    const sendLoggedIn = (data)=>{
        setContextLoggedIn(data)
    }
    
    return (
        <EmailContext.Provider value={{sendEmail, ContextEmail, ContextLoggedIn, sendLoggedIn}}>
            {children}
        </EmailContext.Provider>
    )
}
export {EmailContext, EmailContextProvider} 
