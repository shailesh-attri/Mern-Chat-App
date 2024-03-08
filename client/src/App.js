import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login.js";
import Chat from "./pages/Chat/Chat.js";
import Register from "./pages/Register/Register.js";
import { SocketContextProvider } from "./utils/SocketContex.js";
import { AuthContextProvider } from "./utils/AuthContext.js";
import { BlockedUsersContextsProvider } from "./utils/BlockedUsers.js";
import { SelectedUserContextProvider } from "./utils/selectedUserContext.js";
import { FullScreenProvider, FullScreenContext } from "./utils/fullScreenContext.js"; // Import FullScreenContext from fullScreenContext.js
import './App.scss';

const App = () => {
  
  const [isFullScreen, setIsFullScreen] = React.useState(false);

  const toggleFullScreen = () => {
    if (!isFullScreen) {
        document.documentElement.requestFullscreen().then(() => {
            setIsFullScreen(true);
        }).catch(err => {
            console.error("Error attempting to enable full-screen mode:", err);
        });
    } else {
        document.exitFullscreen().then(() => {
            setIsFullScreen(false);
        }).catch(err => {
            console.error("Error attempting to exit full-screen mode:", err);
        });
    }
};

// Add event listener to listen for fullscreenchange event
React.useEffect(() => {
    const handleFullScreenChange = () => {
        setIsFullScreen(document.fullscreenElement !== null);
    };

    document.addEventListener("fullscreenchange", handleFullScreenChange);

    return () => {
        document.removeEventListener("fullscreenchange", handleFullScreenChange);
    };
}, []);
  return (
    <FullScreenProvider toggleFullScreen={toggleFullScreen}>
      <AppContent />
    </FullScreenProvider>
  );
};

const AppContent = () => {
  

  return (
    <div className="App">
      <div className="Message">
        <p>Thank you for visiting our website. We regret to inform you that our chat app is currently unavailable for devices with a screen width lower than 768px. We are actively developing an Android app, and we will keep you updated on its progress. Please try accessing the chat app on devices with a higher screen width. Thank you for your understanding.</p>
       
      </div>
      <div className="AppData">
        <BrowserRouter>
          <SelectedUserContextProvider>
            <AuthContextProvider>
              <BlockedUsersContextsProvider>
                <SocketContextProvider>
                  <Routes>
                    <Route path="/chats/*" element={<Chat />} />
                    <Route path="/" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                  </Routes>
                </SocketContextProvider>
              </BlockedUsersContextsProvider>
            </AuthContextProvider>
          </SelectedUserContextProvider>
        </BrowserRouter>
      </div>
    </div>
  );
};

export default App;
