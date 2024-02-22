import React, { useContext } from "react";
import { sendMessageRoute, fileUploadRoute } from "../utils/APIRoutes";
import useConversation from "../zustand/useConversation";
import axios from "axios";
import { AuthContext } from "../utils/AuthContext";

const useSendMessage = () => {
  const { authUser } = useContext(AuthContext);
  const { message, setMessages, selectedConversation } = useConversation();

  const sendMessage = async (MyMessage, image) => {
    const formData = new FormData();
    formData.append("image",image);
    formData.append("message",MyMessage);
    formData.append("targetId",selectedConversation?._id);
    formData.append("userId",authUser?.id);
    

    try {
      const res = await axios.post(sendMessageRoute, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (res.status === 200) {
        
        setMessages([...message, res.data.newMessage]); // Assuming res.data contains the message object returned by the server
      }
    } catch (error) {
      console.error("Error sending message:", error, error.response.data);
      // Handle error gracefully
    }
  };
  
  

  return { sendMessage };
};

export default useSendMessage;
