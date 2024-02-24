import React, { useEffect} from "react";
import userImg from "../assets/user.jpg";
import "react-toastify/dist/ReactToastify.css";
import useGetConversation from "../hooks/useGetConversation";
import useConversation from "../zustand/useConversation";
import { useSocketContext } from "../utils/SocketContex";
const OnlineUsers = () => {
    // All context providers
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
