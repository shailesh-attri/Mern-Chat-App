import React, { useState,useEffect, useContext } from "react";
import "./Chat.scss";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "../components/Sidebar";
import Conversation from "../components/Conversation";
import OnlineUsers from "../components/OnlineUsers";
import UpdateProfile from "../components/UpdateProfile";
import useConversation from "../zustand/useConversation";
import ProfilePage from "../components/ProfilePage";
import { selectedUserContext } from "../utils/selectedUserContext";
const Chat = () => {
  const [isConversation, setIsConversation] = useState(true)
  const {selectedUser} = useContext(selectedUserContext)
  const { selectedConversation, setSelectedConversation } = useConversation();
  const handleDataFromChild = (data)=>{
    setIsConversation(data)
  }
  const handleDataFromChats = (data)=>{
    setIsConversation(data)
  }
  useEffect(() => {
   
  }, [selectedUser]);

  useEffect(() => {
    // Update isConversation state based on selectedConversation
    setIsConversation(!!selectedConversation);
  }, [selectedConversation]);
  return (
    <div className="ChatContainer">
      {/* FriendList */}
     <Sidebar sendDataToParent={handleDataFromChild}></Sidebar>

      {/* Main chat */}
      {isConversation  ? 
      <Conversation sendDataToParent={handleDataFromChats}></Conversation>
      :
      <ProfilePage></ProfilePage>
      }
      {/* Online users */}
      {/* <UpdateProfile></UpdateProfile> */}
      <OnlineUsers></OnlineUsers>
      <ToastContainer />
    </div>
  );
};

export default Chat;

;
