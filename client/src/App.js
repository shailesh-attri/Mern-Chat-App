import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Chat from "./pages/Chat";
import Register from "./pages/Register";
import { EmailContextProvider } from "./utils/EmailContext";
const App = () => {
  return (
    <BrowserRouter>
      <EmailContextProvider>
        <Routes>
          <Route path="/chats" element={<Chat></Chat>}></Route>
          <Route path="/" element={<Login></Login>}></Route>
          <Route path="/register" element={<Register></Register>}></Route>
        </Routes>
      </EmailContextProvider>
    </BrowserRouter>
  );
};

export default App;
