import React, { useEffect, useContext } from "react";
import useConversation from "../zustand/useConversation";
import axios from "axios";
import { accessChatRoute } from "../utils/APIRoutes";
import { AuthContext } from "../utils/AuthContext";
const useGetMessages = () => {
  const { authUser } = useContext(AuthContext);

  const { message, setMessages, selectedConversation, setCurrentMessage } =
    useConversation();

  useEffect(() => {
    const getMessagesOfChat = async () => {
      const data = {
        sender: authUser?.id,
        selectedUser: selectedConversation?._id,
      };

      try {
        const result = await axios.post(accessChatRoute, data);
        if (result.status === 200) {
          setMessages(result?.data);
          setCurrentMessage(result?.data);
        }
      } catch (error) {
        console.error(error.message, error);
      }
    };

    if (selectedConversation?._id) getMessagesOfChat();
  }, [selectedConversation?._id, setMessages, authUser]);

  return { message };
};

export default useGetMessages;
