import React, { useState, createContext } from 'react';

const FullScreenContext = createContext();

const FullScreenProvider = ({ children,toggleFullScreen  }) => {
    const [toggleData, setToggleData] = useState(null);
    const sendToggle = (data)=>{
        setToggleData(data);
    }
    
    return (
        <FullScreenContext.Provider value={{ toggleFullScreen,sendToggle,toggleData  }}>
            {children}
        </FullScreenContext.Provider>
    );
};

export { FullScreenContext, FullScreenProvider };
