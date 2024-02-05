import React, { useEffect, useState } from "react";
import "./Chat.scss";
import { useNavigate, } from "react-router-dom";
import user from "../assets/user.jpg";
import { MdLogout } from "react-icons/md";
import { IoIosSearch } from "react-icons/io";
import { IoAttachSharp } from "react-icons/io5";
import { VscSend } from "react-icons/vsc";
import EmojiPicker from "emoji-picker-react";
import {
  findUserRoute,
  getUserRoute,
  getProfileRoute,
} from "../utils/APIRoutes";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Chat = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState([]);
  const [AllUsers, setAllUsers] = useState([]);
  const [userMessage, setUserMessage] = useState("");
  const [inputMessage, setInputMessage] = useState({ input: "" });
  const [showEmoji, setShowEmoji] = useState(false);

  const userResponse = JSON.parse(localStorage.getItem("userData"));
  const userId = userResponse?.id || "";
  const getUser = `${getUserRoute}/${userId}`;
  
  
  useEffect(() => {
    // Check if userResponse exists in localStorage
    if (!userId) {
      // If not, user is not logged in or session expired
      toast.error("Token expired. Redirecting to login again");
      setTimeout(() => {
        navigate("/");
        window.location.reload(); // Reload the page to force a redirect
        return;
      }, 1000);
    }
  }, []);
  useEffect(() => {
    const handleFetchUser = async () => {
      try {
        const res = await axios.get(getUser);
        if (res.status === 200) {
          setAllUsers(res.data.ThisUser);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    handleFetchUser();
  }, []);
  const Logout = () => {
    localStorage.removeItem("userData");
    
    navigate("/");
    window.location.reload(); // Reload the page to force a redirect
    toast.success("Logged out successfully");
  };

  const handleEmoji = () => {
    setShowEmoji((prev) => !prev);
  };
  const PickEmoji = (emojiObject) => {
    setInputMessage((prev) => prev + emojiObject.emoji);
  };
  const handleInputChange = (e) => {
    setInputMessage({
      [e.target.name]: e.target.value,
    });
  };
  const handleSearch = async () => {
    try {
      const result = await axios.post(findUserRoute, inputMessage);
      if (result.status === 200) {
        setUser(result.data);
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  const handleInputData = (e) => {
    e.preventDefault();
    setUserMessage((prevMessages) => {
      return [...prevMessages, inputMessage];
    });
    console.log(userMessage);
    setInputMessage("");
    setShowEmoji(false);
    // Clear the input field after submitting
  };
  useEffect(() => {
    const chatBox = document.getElementById("chatBox");
    if (chatBox) {
      chatBox.scrollTop = chatBox.scrollHeight;
    }
  }, [userMessage]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "Enter" && inputMessage.trim() !== "") {
        handleInputData(e);
        handleSearch(e);
      }
    };

    // Add event listener for the 'Enter' key
    window.addEventListener("keydown", handleKeyPress);

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleInputData, inputMessage]);
  const handleSelectUser = (userID) => {
    alert(userID);
  };
  return (
    <div className="ChatContainer">
      {/* FriendList */}
      <div className="LeftContainer">
        <div className="UserContainer">
          <div className="User">
            <div className="profileImg">
              <img src={user} alt="" />
            </div>
            <span className="userName">{AllUsers.fullName}</span>
          </div>
          <span className="MdLogout">
            <MdLogout onClick={Logout} />
          </span>
        </div>
        <div className="SearchBar">
          <input
            type="text"
            placeholder="Search for friends"
            name="input"
            value={inputMessage.input}
            onChange={handleInputChange}
          />
          <div className="SearchBtn">
            <IoIosSearch onClick={handleSearch} />
          </div>
        </div>
        <div className="friendList">
          <h1>Chats</h1>

          <div className="AllFriends">
            {user?.map((friend) => (
              <div className="FriendContainer" key={friend._id}>
                <div className="Friend">
                  <div className="profileImg">
                    <img src={user} alt="" />
                  </div>
                  <div
                    className="friendBox"
                    onClick={() => handleSelectUser(friend._id)}
                  >
                    <span className="userName">{friend.fullName}</span>
                    <span className="msg">hello shailesh </span>
                  </div>
                </div>
                <span className="time">09:24 AM</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main chat */}
      <div className="mainChat">
        <div className="User">
          <div className="profileImg">
            <img src={user} alt="" />
          </div>
          <div className="status">
            <span className="userName">Shailesh Attri</span>
            <div className="onlineStatus">
              <div className="indicator"></div>
              <span className="showStatus">Active now</span>
            </div>
          </div>
        </div>
        <div className="chat">
          <div className="chatBox" id="chatBox">
            <div className="friendMsg">
              <span className="received">
                <span>Lorem ipsum, dolor sit amet consectetur</span>
                <span className="time">04:45 am</span>
              </span>
            </div>
            <div className="userMsg">
              {userMessage &&
                userMessage.map((message) => (
                  <span className="sender">
                    <span>{message}</span>
                    <span className="time">04:45 am</span>
                  </span>
                ))}
            </div>
          </div>
          <div className="inputMsg">
            <div className="icons">
              <span onClick={handleEmoji}>😊</span>
              <IoAttachSharp />
            </div>
            <form action="" onSubmit={handleInputData}>
              <input
                type="text"
                placeholder="Send message"
                required
                name="message"
              />
              <button type="submit" className="sendIcon">
                <VscSend />
              </button>
            </form>
          </div>
        </div>
        {showEmoji && (
          <div className="emojis">
            <EmojiPicker onEmojiClick={PickEmoji} />
          </div>
        )}
      </div>

      {/* Online users */}
      <div className="OnlineSidebar">
        <div className="User">
          <div className="status">
            <span className="userName">Online users</span>
          </div>
        </div>
        <div className="AllUserContainer">
          {/* <div className="AllFriends">
            {AllUsers?.map((friend) => (
              <div className="FriendContainer" key={friend._id}>
                <div className="Friend">
                  <div className="profileImg">
                    <img src={user} alt="" />
                  </div>
                  <div
                    className="friendBox"
                    onClick={() => handleSelectUser(friend._id)}
                  >
                    <span className="userName">{friend.fullName}</span>
                    <span className="msg">{friend.username} </span>
                  </div>
                </div>
                
              </div>
            ))}
          </div> */}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Chat;
