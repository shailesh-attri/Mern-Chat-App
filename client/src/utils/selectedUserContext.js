import { useState, createContext } from "react";

const selectedUserContext = createContext();

const SelectedUserContextProvider = ({ children }) => {
    const [selectedUser, setSelectedUser] = useState(null); 
    
    const sendUserData = (data) => {
        setSelectedUser(data);
    };
    

    return (
        <selectedUserContext.Provider value={{ selectedUser, sendUserData }}>
            {children}
        </selectedUserContext.Provider>
    );
};

export { selectedUserContext, SelectedUserContextProvider };
