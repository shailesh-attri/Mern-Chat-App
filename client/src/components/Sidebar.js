import React, { useEffect, useState, useRef, useContext } from "react";
import userImg from '../assets/user.jpg'
import { AuthContext } from "../utils/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { MdLogout } from "react-icons/md";
import { IoIosSearch } from "react-icons/io";
import {
    findUserRoute,
    getUserRoute,
    fetchChatRoute,
  } from "../utils/APIRoutes";
  import axios from "axios";
  import useConversation from "../zustand/useConversation";
import useGetMessages from "../hooks/useGetMessages";
import { useSocketContext } from "../utils/SocketContex";
import { RxCross2 } from "react-icons/rx";
import { Oval } from "react-loader-spinner";
import formattedTime from "../utils/formatTime";
const Sidebar = ({sendDataToParent}) => {
    const { authUser,avatarMessage,sendLoggedData,profileUpdate,loggedUser } = useContext(AuthContext);
    const {formatTime} = formattedTime()
    
    // All useStates
    const [ThisUser, setThisUser] = useState([]);
    const [user, setUser] = useState([]);
    const [SearchInput, setSearchInput] = useState("");
    const [isChats, setIsChats] = useState(true);
    const [isLoading, setLoading] = useState(true);
    const [messages, setMessages] = useState("");
    const [UserAllChat, setUserAllChat] = useState([]);
    const [profileImage, setProfileImage] = useState(null)
    // Routes initializing
    const getUser = `${getUserRoute}/${authUser?.id}`;
    const fetchChatRouter = `${fetchChatRoute}/${authUser?.id}`;
     
    
    // UseFunctionsContext
    const navigate = useNavigate();
    const { selectedConversation, setSelectedConversation } = useConversation();
    const isSelectedConversation = (user) => {
    return selectedConversation && selectedConversation._id === user._id;};
    const { onlineUsers } = useSocketContext();
    const { message: ChatMessages } = useGetMessages();
    // SingleUse UseEffects
    useEffect(()=>{
      setIsChats(true)
    },[ChatMessages])
    useEffect(()=>{
      if(loggedUser && loggedUser?.avatarUrl){
        setProfileImage(loggedUser?.avatarUrl)
      }else{
        setProfileImage(userImg)
      }
    },[avatarMessage,loggedUser,userImg])
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

        // fetching user
        const handleFetchUser = async () => {
            try {
              const res = await axios.get(getUser);
              if (res.status === 200) {
                sendLoggedData(res.data.ThisUser);
                setThisUser(res.data.ThisUser);
              }
            } catch (error) {
              console.log(error.message);
            }
          };

          
        //   Calling functions
          handleFetchUser();
      }, [authUser, avatarMessage, profileUpdate]);
    
    useEffect(() => {
        fetchChat();
    }, [messages, ChatMessages]);

    //   Event handlers
    const fetchChat = async () => {
        try {
          const result = await axios.get(fetchChatRouter);
          if (result.status === 200) {
            const receiverList = result.data.Receiver;
            // Sort the Receiver array based on the lastCreated timestamp in descending order
            receiverList.sort(
              (a, b) => new Date(b.lastCreated) - new Date(a.lastCreated)
            );
            setUserAllChat(receiverList);
          }
        } catch (error) {
          console.log(error.message, error);
        }
      };
    const Logout = () => {
        localStorage.removeItem("userData");
    
        navigate("/");
        window.location.reload(); // Reload the page to force a redirect
        toast.success("Logged out successfully");
      };
    
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
          } else {
            setUser("No user found");
          }
        } catch (error) {
          console.log(error.message);
        }
      };
    const handleEditData =(data)=>{
      sendDataToParent(data);
    }
    
  return (
    <div className="LeftContainer">
        <div className="UserContainer">
          <div className="User" onClick={()=>handleEditData(false)}>
            <div className="profileImg">
              <img src={profileImage} alt="" />
            </div>
            <span className="userName">{ThisUser?.fullName}</span>
          </div>
          <span className="MdLogout">
            <MdLogout onClick={Logout} />
          </span>
        </div>

        <form className="SearchBar" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search for friends"
            name="input"
            required
            value={SearchInput}
            onChange={handleInputFromSearch}
          />
          <button className="SearchBtn" type="submit">
            <IoIosSearch />
          </button>
        </form>
        {isChats ? (
          <div className="friendList">
            <h1>Chats</h1>

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
                        <img src={userImg} alt="" />
                        {onlineUsers.length > 0 &&
                          onlineUsers.map((online, index) => {
                            const isOnline = online.includes(
                              chat?.receiver._id
                            );
                            return (
                              isOnline && (
                                <div
                                  className="OnlineIndicator"
                                  key={index}
                                ></div>
                              )
                            );
                          })}
                      </div>
                      <div className="friendBox">
                        <span className="userName">
                          {chat.receiver.fullName}
                        </span>

                        <span className="msg">{chat.latestMessage}</span>
                      </div>
                    </div>
                    {chat.lastCreated && (
                      <span className="time">
                        {formatTime(chat.lastCreated)}
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <div>No chats available</div>
              )}
            </div>
          </div>
        ) : (
          <div className="friendList">
            <div className="Head-Buttons">
              <h1>Search Result :</h1>
              <span className="MdLogout">
                <RxCross2 onClick={() => setIsChats(true)} size="25" />
              </span>
            </div>

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
                          <img src={userImg} alt="" />
                        </div>
                        <div className="friendBox">
                          <span className="userName">{friend.fullName}</span>
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
  )
}

export default Sidebar
