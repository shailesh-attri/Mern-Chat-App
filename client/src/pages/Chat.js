import React, { useEffect, useState } from "react";
import "./Chat.scss";
import user from "../assets/user.jpg";
import { MdLogout } from "react-icons/md";
import { IoIosSearch } from "react-icons/io";
import { IoAttachSharp } from "react-icons/io5";
import { VscSend } from "react-icons/vsc";
import EmojiPicker from "emoji-picker-react";
const Chat = () => {
  const friend = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  const [userMessage, setUserMessage] = useState("");
  const [inputMessage, setInputMessage] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const handleEmoji = () => {
    setShowEmoji((prev) => !prev);
  };
  const PickEmoji = (emojiObject) => {
    setInputMessage((prev) => prev + emojiObject.emoji);
  };
  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
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
    console.log(userMessage);
  }, [userMessage]);
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "Enter") {
        handleInputData(e);
      }
    };

    // Add event listener for the 'Enter' key
    window.addEventListener("keydown", handleKeyPress);

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleInputData]);
  return (
    <div className="ChatContainer">
      {/* FriendList */}
      <div className="LeftContainer">
        <div className="UserContainer">
          <div className="User">
            <div className="profileImg">
              <img src={user} alt="" />
            </div>
            <span className="userName">Shailesh Attri</span>
          </div>
          <MdLogout />
        </div>
        <div className="SearchBar">
          <input type="text" placeholder="Search for friends" />
          <div className="SearchBtn">
            <IoIosSearch />
          </div>
        </div>
        <div className="friendList">
          <h1>Chats</h1>

          <div className="AllFriends">
            {friend.map((friend) => (
              <div className="FriendContainer">
                <div className="Friend">
                  <div className="profileImg">
                    <img src={user} alt="" />
                  </div>
                  <div className="friendBox">
                    <span className="userName">Shailesh Attri</span>
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
          <div className="chatBox" id='chatBox'>
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
                value={inputMessage}
                required
                name="message"
                onChange={handleInputChange}
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
    </div>
  );
};

export default Chat;
