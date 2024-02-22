import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Chat from "./pages/Chat";
import Register from "./pages/Register";
import { SocketContextProvider } from "./utils/SocketContex.js";
import { AuthContextProvider } from "./utils/AuthContext.js";
import { BlockedUsersContextsProvider } from "./utils/BlockedUsers.js";

const App = () => {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <BlockedUsersContextsProvider> {/* Ensure this is correctly imported */}
          <SocketContextProvider>
            <Routes>
              <Route path="/chats/*" element={<Chat></Chat>}></Route>
              <Route path="/" element={<Login></Login>}></Route>
              <Route path="/register" element={<Register></Register>}></Route>
            </Routes>
          </SocketContextProvider>
        </BlockedUsersContextsProvider>
      </AuthContextProvider>
    </BrowserRouter>
  );
};

export default App;
