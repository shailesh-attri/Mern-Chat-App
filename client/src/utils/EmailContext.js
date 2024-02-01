import {React, useState, createContext} from 'react';
const EmailContext = createContext()
const EmailContextProvider = ({children})=>{
    const [ContextEmail, setEmail] = useState([])
    const sendEmail = (data)=>{
        setEmail(data)
    }
    console.log("ContextEmail in Context", ContextEmail);
    return (
        <EmailContext.Provider value={{sendEmail, ContextEmail}}>
            {children}
        </EmailContext.Provider>
    )
}
export {EmailContext, EmailContextProvider} 
