import React from "react";
import "./Chat.scss";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "../components/Sidebar";
import Conversation from "../components/Conversation";
import OnlineUsers from "../components/OnlineUsers";
const Chat = () => {
 
  return (
    <div className="ChatContainer">
      {/* FriendList */}
     <Sidebar></Sidebar>

      {/* Main chat */}
      <Conversation></Conversation>

      {/* Online users */}
      <OnlineUsers></OnlineUsers>
      <ToastContainer />
    </div>
  );
};

export default Chat;

;
