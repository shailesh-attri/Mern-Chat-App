import React, { useEffect, useState, useRef, useContext } from "react";
import { AuthContext } from "../../utils/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { IoIosSearch } from "react-icons/io";
import { findUserRoute, fetchChatRoute } from "../../utils/APIRoutes";
import axios from "axios";
import useConversation from "../../zustand/useConversation";
import useGetMessages from "../../hooks/useGetMessages";
import { useSocketContext } from "../../utils/SocketContex";
import { RxCross2 } from "react-icons/rx";
import { Oval } from "react-loader-spinner";
import formattedTime from "../../utils/formatTime";
import defaultImage from "../../assets/defaultImage.png";
import { BlockedUsersContext } from "../../utils/BlockedUsers";

const Sidebar = ({sendMessageRoute}) => {
  const {BlockedUsers} = useContext(BlockedUsersContext);
  const { authUser,avatarMessage } = useContext(AuthContext);
  const { formatTime } = formattedTime();
  console.log(avatarMessage);
  // All useStates
  const [user, setUser] = useState([]);
  const [SearchInput, setSearchInput] = useState("");
  const [isChats, setIsChats] = useState(true);
  const [isLoading, setLoading] = useState(true);
  const [messages, setMessages] = useState("");
  const [UserAllChat, setUserAllChat] = useState([]);
  const [latestMessage, setLatestMessage] = useState([]);
  // Routes initializing
  const fetchChatRouter = `${fetchChatRoute}/${authUser?.id}`;

  // UseFunctionsContext
  const navigate = useNavigate();
  const { selectedConversation, setSelectedConversation,blockedUsers } = useConversation();
  const isSelectedConversation = (user) => {
    return selectedConversation && selectedConversation._id === user._id;
  };
  const { onlineUsers } = useSocketContext();
  const { message: ChatMessages } = useGetMessages();
  // SingleUse UseEffects
  useEffect(() => {
    setIsChats(true);
    console.log(ChatMessages);
  }, [ChatMessages]);

  useEffect(() => {
    // Check if userResponse exists in localStorage
    if (!authUser?.id) {
      // If not, user is not logged in or session expired
      toast.error("Token expired. Redirecting to login again");
      setTimeout(() => {
        navigate("/");
        window.location.reload(); // Reload the page to force a redirect
        return;
      }, 1000);
    }
  }, [authUser]);

  
  //   Event handlers
  
  const fetchChat = async () => {
    
    try {
      const result = await axios.get(fetchChatRouter);
      if (result.status === 200) {
        const receiverList = result.data.Receiver;
        // Sort the Receiver array based on the lastCreated timestamp in descending order
          console.log(receiverList);
          setUserAllChat(receiverList);
        }
      } catch (error) {
        console.log(error.message, error);
      }
    };
  useEffect(() => {
      fetchChat();
      
    }, [authUser,avatarMessage,messages, ChatMessages, selectedConversation,sendMessageRoute]);
    useEffect(()=>{
      if(selectedConversation && avatarMessage){
        fetchChat()
      }
    },[selectedConversation,avatarMessage])

  const handleInputFromSearch = (e) => {
    setSearchInput(e.target.value);
    e.preventDefault();
  };

  const handleSearch = async (e) => {
    setIsChats(false);
    e.preventDefault();
    setSearchInput("");
    try {
      const result = await axios.post(findUserRoute, {
        input: SearchInput,
        userId: authUser?.id,
      });
      if (result.status === 200) {
        setUser(result.data);
        setLoading(false);
        console.log(result.data);
      } else {
        setUser("No user found");
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  const getLatestMessages = (chat) => {
    const isBlocked = BlockedUsers.includes(chat.receiver._id);
    return isBlocked ? "You blocked this user" : chat.receiver.lastMessage
  }
  return (
    <div className="LeftContainer">
      <form className="SearchBar" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search"
          name="input"
          required
          value={SearchInput}
          onChange={handleInputFromSearch}
        />
        <button className="SearchBtn" type="submit">
          <IoIosSearch />
        </button>
      </form>
      <h1>
        <span onClick={fetchChat}>{isChats ? 'Chats' : 'Search result'}</span>
        {!isChats && <span className="MdLogout">
              <RxCross2 onClick={() => setIsChats(true)} size="25" />
        </span>} 
        
      </h1>

      {isChats ? (
        <div className="friendList">
          <div className="AllFriends">
            {UserAllChat ? (
              UserAllChat &&
              UserAllChat.map((chat) => (
                <div
                  className={`FriendContainer ${
                    isSelectedConversation(chat.receiver) ? "bgBlue" : ""
                  }`}
                  key={chat._id}
                  onClick={() => setSelectedConversation(chat.receiver)}
                >
                  <div className="Friend">
                    <div className="profileImg">
                      <img
                        src={(chat && chat.receiver?.avatarUrl) || defaultImage}
                        alt=""
                      />
                      {onlineUsers.length > 0 &&
                        onlineUsers.map((online, index) => {
                          const isOnline = online.includes(chat?.receiver._id);
                          const isBlocked = BlockedUsers.includes(chat?.receiver._id)
                          const shouldRenderOnlineStatus = blockedUsers.includes(chat?.receiver._id)
                          return (
                            isOnline && (
                              !isBlocked && !shouldRenderOnlineStatus && 
                              <div
                                className="OnlineIndicator"
                                key={index}
                              ></div>
                            )
                          );
                        })}
                    </div>
                    <div className="friendBox">
                      <span className="userName">{chat.receiver.fullName}</span>
                    

                      <span className="msg">{getLatestMessages(chat)}</span>
              
                    </div>
                  </div>
                  {chat.receiver.lastCreated && (
                    <span className="time">{formatTime(chat.receiver.lastCreated)}</span>
                  )}
                </div>
              ))
            ) : (
              <div >No chats available</div>
            )}
          </div>
        </div>
      ) : (
        <div className="friendList">
          

          {isLoading ? (
            <div className="loader">
              <Oval
                visible={true}
                height="35"
                width="30"
                color="#fff"
                ariaLabel="triangle-loading"
                wrapperStyle={{}}
                wrapperClass=""
              />
            </div>
          ) : (
            <div className="AllFriends">
              {user &&
                user.map((friend) => (
                  <div
                    className={`FriendContainer ${
                      isSelectedConversation(friend) ? "bgBlue" : ""
                    }`}
                    key={friend._id}
                    onClick={() => setSelectedConversation(friend)}
                  >
                    <div className="Friend">
                      <div className="profileImg">
                        <img
                          src={(friend && friend?.avatarUrl) || defaultImage}
                          alt=""
                        />
                      </div>
                      <div className="friendBox">
                        <span className="userName">{friend.fullName}</span>
                        <span className="msg">{friend.username}</span>
                      </div>
                    </div>
                  </div>
                ))}
              {!user && <div>No chats available</div>}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Sidebar;
