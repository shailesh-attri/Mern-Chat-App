import React, { useEffect, useState, useRef, useContext } from "react";
import { FcPicture } from "react-icons/fc";
import { VscSend } from "react-icons/vsc";
import EmojiPicker from "emoji-picker-react";
import "react-toastify/dist/ReactToastify.css";
import useConversation from "../../zustand/useConversation";
import useSendMessage from "../../hooks/useSendMessage";
import useGetMessages from "../../hooks/useGetMessages";
import { useSocketContext } from "../../utils/SocketContex";
import useListenMessage from "../../hooks/useListenMessage";
import { AuthContext } from "../../utils/AuthContext";
import { RxCross1 } from "react-icons/rx";
import formattedTime from "../../utils/formatTime";
import defaultImage from "../../assets/defaultImage.png";
import N_logo from "../../assets/N_logo.png";
import { BlockedUsersContext } from "../../utils/BlockedUsers";
import getBlocklist from "../../hooks/getBlocklist";
import { Oval } from "react-loader-spinner";
const Conversation = ({ sendDataToParent, sendUserId }) => {
  // Context providers
  useListenMessage();
  const {handleBlocklist} = getBlocklist()
  const { formatTime } = formattedTime();
  const { authUser, loggedUser } = useContext(AuthContext);
  const { BlockedUsers } = useContext(BlockedUsersContext);
  const { selectedConversation, blockedUsers } = useConversation();
  const { onlineUsers } = useSocketContext();
  const chatBoxRef = useRef(null);
  const emojiRef = useRef(null);
  const { sendMessage } = useSendMessage();
  const { message: ChatMessages } = useGetMessages();
  // useState

  const [showEmoji, setShowEmoji] = useState(false);
  const [image, setImage] = useState(null);
  const [ShowImage, setShowImage] = useState(null);
  const [messages, setMessages] = useState("");
  const [isLargeImage, setIsLargeImage] = useState(false);
  const [ThisImage, setThisImage] = useState(null);

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setShowEmoji(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
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

  const handleVisibilityData = (data) => {
    sendDataToParent(data);
  };
  const handleUserData = (data) => {
    sendUserId(data);
  };
  
  useEffect(() =>{
    handleBlocklist(authUser?.id)
  },[authUser, selectedConversation]);
 
  return (
    <>
      {selectedConversation ? (
        <div className="mainChat">
          <div className="User">
            <div
              className="userHeader"
              onClick={() => {
                handleUserData(selectedConversation?._id);
                handleVisibilityData(false);
              }}
            >
              <div className="profileImg">
                <img
                  src={
                    (selectedConversation && selectedConversation?.avatarUrl) ||
                    defaultImage
                  }
                  alt=""
                />
              </div>
              <div className="status">
                <span className="userName">
                  {selectedConversation.fullName}
                </span>
                <div className="onlineStatus">
                  {onlineUsers.length > 0 &&
                    onlineUsers.map((online, index) => {
                      const isOnline = online.includes(
                        selectedConversation?._id
                      );
                      const IsBlocked = BlockedUsers.includes(
                        selectedConversation?._id
                      );
                      const shouldRenderOnlineStatus = blockedUsers.includes(selectedConversation?._id)

                      return (
                        <span className="onlineStatus" key={index}>
                          {isOnline &&
                            (IsBlocked  || shouldRenderOnlineStatus ? (
                              ""
                            ) : (
                              <span className="showOnline">Online</span>
                            ))}
                        </span>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
          <div className="chat">
            <div className="chatBox" id="chatBox" ref={chatBoxRef}>
              {ChatMessages ?
                ChatMessages.length > 0 &&
                ChatMessages.map((ThisMessage) => {
                  const fromMe = ThisMessage?.msgSender === authUser?.id;
                  const chatClassName = fromMe ? "flex-end" : "flex-start";
                  const BgColor = fromMe ? "BG_Green" : "BG_Gray";

                  const formattedTime = formatTime(ThisMessage);
                  return (
                    <div
                      className={`messages ${chatClassName} `}
                      key={ThisMessage?._id}
                    >
                      {ThisMessage?.fileUrl && (
                        <span className={`ImageFile `}>
                          <img
                            src={ThisMessage?.fileUrl}
                            alt="Uploaded"
                            className={`${fromMe ? "BgBlue" : "bgBlack"}`}
                            onClick={()=>{setIsLargeImage(prev=>!prev); setThisImage(ThisMessage?.fileUrl)}}
                          />
                        </span>
                      )}
                        
                      <div className="MessageContainer">
                        <div
                          className={`${fromMe ? "flex-end" : "flex-start"}`}
                        >
                          <span className="user">
                            {fromMe ? "You" : selectedConversation?.fullName}
                          </span>
                        </div>
                        <div className={` ${BgColor} `}>
                          <span className="">{ThisMessage?.content}</span>
                          <span className="time">{formattedTime}</span>
                        </div>
                      </div>
                    </div>
                  );
                }) : <div className="loader">
              <Oval
                visible={true}
                height="35"
                width="30"
                color="#fff"
                ariaLabel="triangle-loading"
                wrapperStyle={{}}
                wrapperClass=""
              />
            </div>}
              {ChatMessages && ChatMessages.length === 0 && (
                <p className="StartChat">
                  ------- Send a message to start chat -------
                </p>
              )}
            </div>
          </div>
          {blockedUsers.includes(selectedConversation._id) ?
             <div className="blockMessage inputMsg">
            You have been blocked. You will no longer send messages to them.
            </div>
          : 
          <div className="inputMsg">
            <div className="icons">
              <span onClick={handleEmoji}>🙂</span>
              <label htmlFor="fileInput" className="fileInput">
                <FcPicture size="35" />
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
              {isLargeImage && <ShowLargeImage ThisImage={ThisImage} setIsLargeImage={setIsLargeImage}></ShowLargeImage>}
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
          }
          
          
          
          {showEmoji && (
            <div className="emojis" ref={emojiRef}>
              <EmojiPicker onEmojiClick={PickEmoji} />
            </div>
          )}
        </div>
      ) : (
        <div className="mainChat">
          <div className="WelcomePage">
            <div className="Logo">
              <img src={N_logo} alt="" />
            </div>
            <h1>Hey! {loggedUser?.fullName} </h1>
            <p>Select a conversation or start a new one</p>
          </div>
        </div>
      )}
      
    </>
  );
};

export default Conversation;

const ShowLargeImage = ({ThisImage,setIsLargeImage})=>{
    return (
      <div className="Container">
       <button className="closeBtn" onClick={()=>setIsLargeImage(prev=>!prev)} >X</button>
       <div className="Image">
        <img src={ThisImage} alt="" />
       </div>
      </div>
    )
}
