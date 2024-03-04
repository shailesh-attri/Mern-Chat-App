import React, { useState,useEffect, useContext } from "react";
import "./Chat.scss";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "../../components/Sidebar/Sidebar";
import Conversation from "../../components/Conversation/Conversation";
import UpdateProfile from "../../components/UpdateProfile/UpdateProfile";
import useConversation from "../../zustand/useConversation";
import ProfilePage from "../../components/ProfilePage/ProfilePage";
import { selectedUserContext } from "../../utils/selectedUserContext";
import MiniSidebar from "../../components/MiniSidebar/MiniSidebar.js";

const Chat = () => {
  const [isConversation, setIsConversation] = useState(true)
  const [isUpdateProfile, setIsUpdateProfile] = useState(false)
  const [isUserProfile, setIsUserProfile] = useState(false)
  const {selectedUser} = useContext(selectedUserContext)
  const [selectedUserId, setSelectedUserId] = useState('');
  const { selectedConversation, setSelectedConversation } = useConversation();
  const handleDataFromChild = (data)=>{
    setIsConversation(false)
    setIsUpdateProfile(true);
    setIsUserProfile(false)
  }
  const handleDataFromChats = (data)=>{
    setIsConversation(data)
  }
  useEffect(() => {
   
  }, [selectedUser]);

  useEffect(() => {
    // Update isConversation state based on selectedConversation
    setIsConversation(true)
    setIsUpdateProfile(false);
    setIsUserProfile(false)

  }, [selectedConversation]);
  const handleUserId = (data)=>{
    setSelectedUserId(data);
    setIsConversation(false)
    setIsUpdateProfile(false);
    setIsUserProfile(true)

  }
  return (
    <div className="ChatContainer">
      {/* FriendList */}
      <MiniSidebar sendDataToParent={handleDataFromChild}></MiniSidebar>
      <Sidebar ></Sidebar>
      
      {/* Main chat */}
      {isConversation  && 
      <Conversation 
      sendDataToParent={handleDataFromChats}
      sendUserId={handleUserId}
      ></Conversation>
      }
      {isUserProfile && 
      <ProfilePage selectedUserId={selectedUserId}></ProfilePage>
      }
      
      {isUpdateProfile && 
      <UpdateProfile ></UpdateProfile>
      }
      
      
      <ToastContainer />
    </div>
  );
};

export default Chat;

;
