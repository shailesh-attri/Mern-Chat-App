
import React, { useEffect, useState, useRef, useContext } from "react";
import userImg from "../assets/user.jpg";
import { IoAttachSharp } from "react-icons/io5";
import { VscSend } from "react-icons/vsc";
import EmojiPicker from "emoji-picker-react";
import "react-toastify/dist/ReactToastify.css";
import useConversation from "../zustand/useConversation";
import useSendMessage from "../hooks/useSendMessage";
import useGetMessages from "../hooks/useGetMessages";
import { useSocketContext } from "../utils/SocketContex";
import useListenMessage from "../hooks/useListenMessage";
import { AuthContext } from "../utils/AuthContext";
import { RxCross1 } from "react-icons/rx";
import formattedTime from "../utils/formatTime";
import { selectedUserContext } from "../utils/selectedUserContext";

const Conversation = ({sendDataToParent}) => {
    // Context providers
    useListenMessage();
    const {formatTime} = formattedTime()
    const { authUser } = useContext(AuthContext);
    const {sendUserData,sendChatData} = useContext(selectedUserContext)
    const { selectedConversation, setSelectedConversation } = useConversation();
    const { onlineUsers } = useSocketContext();
    const chatBoxRef = useRef(null);
    const { sendMessage } = useSendMessage();
    const { message: ChatMessages } = useGetMessages();
    // useState
  
  const [showEmoji, setShowEmoji] = useState(false);
  const [image, setImage] = useState(null);
  const [ShowImage, setShowImage] = useState(null);
  const [messages, setMessages] = useState("");
  const [isChats, setIsChats] = useState(true);
  

    // Event handlers
    const handleInputFromSender = (e) => {
        e.preventDefault();
        setMessages(e.target.value);
        setShowEmoji(false);
        // Clear the input field after submitting
      };
    const handleEmoji = () => {
        setShowEmoji((prev) => !prev);
      };
      const PickEmoji = (emojiObject) => {
        setMessages((prev) => prev + emojiObject.emoji);
      };
    
      const handleFileInputChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        setImage(file);
        reader.onloadend = () => {
          // Set the image state with the uploaded image
          setShowImage(reader.result);
        };
    
        if (file) {
          reader.readAsDataURL(file);
        }
      };
      useEffect(() => {
        setShowImage(null);
      }, [selectedConversation]);

      const handleSendMessage = async (e) => {
        e.preventDefault();
        setIsChats(true);
        setShowImage(null);
    
        // Check if either text message or image is present
        if (!messages && !image) return;
    
        // Call the sendMessage function with appropriate parameters
        try {
          if (messages && image) {
            // If both text message and image are present, send both
            await sendMessage(messages, image);
          } else if (messages) {
            // If only text message is present, send it without an image
            await sendMessage(messages, null);
          } else {
            // If only image is present, send it without a text message
            await sendMessage("", image);
          }
    
          // Reset image and message state after sending
          setImage(null);
          setMessages("");
        } catch (error) {
          // Handle error if any
          console.error("Error sending message:", error);
        }
      };

      useEffect(() => {
        const chatBox = chatBoxRef.current;
        if (chatBox) {
          chatBox.scrollTop = chatBox.scrollHeight;
        }
      }, [sendMessage, ChatMessages]);
      const sendDataToContext = ()=>{
        sendUserData(selectedConversation?._id)
      }
      const handleVisibilityData = (data)=>{
        sendDataToParent(data)
      }
  return (
    <>
        {selectedConversation ? (
        <div className="mainChat">
          <div className="User">
            <div className="userHeader" onClick={()=>{
                  sendDataToContext()
                  handleVisibilityData(false)
                  }}>
              <div className="profileImg">
                <img src={userImg} alt="" />
              </div>
              <div className="status">
                <span className="userName" >
                  {selectedConversation.fullName}
                </span>
                <div className="onlineStatus">
                  {onlineUsers.length > 0 &&
                    onlineUsers.map((online, index) => {
                      const isOnline = online.includes(
                        selectedConversation?._id
                      );

                      return (
                        <span className="onlineStatus" key={index}>
                          {isOnline && (
                            <span className="showOnline">Active now</span>
                          )}
                        </span>
                      );
                    })}
                </div>
              </div>
            </div>
            
          </div>
          <div className="chat">
            <div className="chatBox" id="chatBox" ref={chatBoxRef}>
              {ChatMessages &&
                ChatMessages.length > 0 &&
                ChatMessages.map((ThisMessage) => {
                  const fromMe = ThisMessage.msgSender === authUser?.id;
                  const chatClassName = fromMe ? "flex-end" : "flex-start";
                  const BgColor = fromMe ? "BG_Green" : "BG_Gray";

                  const formattedTime = formatTime(ThisMessage);
                  return (
                    <div
                      className={`messages ${chatClassName} `}
                      key={ThisMessage._id}
                    >
                      {ThisMessage.fileUrl && (
                        <span className="ImageFile">
                          <img src={ThisMessage.fileUrl} alt="Uploaded" />
                        </span>
                      )}
                      <div className="MessageContainer">
                      <div className={`${fromMe ? 'flex-end':'flex-start'}`}>
                        <span className="user">
                          {fromMe ? "You" : selectedConversation.fullName}
                        </span>

                      </div>
                        <div className={` ${BgColor} `}>
                          <span className="">{ThisMessage.content}</span> 
                          <span className="time">{formattedTime}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              {ChatMessages && ChatMessages.length === 0 && (
                <p className="StartChat">
                  ------- Send a message to start chat -------
                </p>
              )}
            </div>
            <div className="inputMsg">
              <div className="icons">
                <span onClick={handleEmoji}>😊</span>
                <label htmlFor="fileInput">
                  <IoAttachSharp />
                  <input
                    id="fileInput"
                    type="file"
                    name="image"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleFileInputChange}
                  />
                </label>
              </div>
              <form action="" onSubmit={handleSendMessage}>
                <input
                  type="text"
                  placeholder="Send message"
                  name="message"
                  value={messages}
                  onChange={handleInputFromSender}
                />
                <button type="submit" className="sendIcon">
                  <VscSend />
                </button>
              </form>
              {/* Display the uploaded image if available */}
              {ShowImage && (
                <div className="UploadImage">
                  <div
                    className="close"
                    onClick={() => {
                      setShowImage(null);
                      setImage(null);
                    }}
                  >
                    <RxCross1 />
                  </div>
                  <img src={ShowImage} alt="Uploaded" />
                </div>
              )}
            </div>
          </div>
          {showEmoji && (
            <div className="emojis">
              <EmojiPicker onEmojiClick={PickEmoji} />
            </div>
          )}
        </div>
      ) : (
        <div className="mainChat">
          <div className="WelcomePage">
            <h1>Welcome Shailesh </h1>
            <p>Start your chat </p>
          </div>
        </div>
      )}
    </>
  )
}

export default Conversation
