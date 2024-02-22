import React, { useEffect, useState, useRef, useContext } from "react";

import { useNavigate } from "react-router-dom";
import userImg from "../assets/user.jpg";
import { MdLogout } from "react-icons/md";
import { IoIosSearch } from "react-icons/io";
import { IoAttachSharp } from "react-icons/io5";
import { VscSend } from "react-icons/vsc";
import EmojiPicker from "emoji-picker-react";
import {
  findUserRoute,
  getUserRoute,
  getProfileRoute,
  sendMessageRoute,
  fetchChatRoute,
  accessChatRoute,
  getMessageRoute,
} from "../utils/APIRoutes";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RxCross2 } from "react-icons/rx";
import io from "socket.io-client";
import useGetConversation from "../hooks/useGetConversation";
import { Oval } from "react-loader-spinner";
import useConversation from "../zustand/useConversation";
import useSendMessage from "../hooks/useSendMessage";
import useGetMessages from "../hooks/useGetMessages";
import { useSocketContext } from "../utils/SocketContex";
import useListenMessage from "../hooks/useListenMessage";
import { AuthContext } from "../utils/AuthContext";
const OnlineUsers = () => {
    // All context providers
    const { authUser } = useContext(AuthContext);
    const { onlineUsers } = useSocketContext();
    const { AllDBUsers } = useGetConversation();
    const { selectedConversation, setSelectedConversation } = useConversation();
    const isSelectedConversation = (user) => {
      return selectedConversation && selectedConversation._id === user._id;
    };
    // All useStates


    // All event handlers
    useEffect(() => {
        // clean up
        return () => setSelectedConversation(null);
      }, [setSelectedConversation]);
  return (
    <div className="OnlineSidebar">
        <div className="User">
          <div className="status">
            <span className="userName">New Joined!</span>
          </div>
        </div>
        <div className="AllUserContainer">
          <div className="AllFriends">
            {AllDBUsers?.map((ThisUser) => (
              <div
                className={`FriendContainer ${
                  isSelectedConversation(ThisUser) ? "bgBlue" : ""
                }`}
                key={ThisUser._id}
                onClick={() => setSelectedConversation(ThisUser)}
              >
                <div className="Friend">
                  <div className="profileImg">
                    <img src={userImg} alt="" />
                    {onlineUsers.length > 0 &&
                      onlineUsers.map((online, index) => {
                        const isOnline = online.includes(ThisUser._id);
                        return (
                          isOnline && (
                            <div className="OnlineIndicator" key={index}></div>
                          )
                        );
                      })}
                  </div>

                  <div className="friendBox">
                    <span className="userName">{ThisUser.fullName}</span>
                    <span className="msg">{ThisUser.username} </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
  )
}

export default OnlineUsers
