import React, { useContext, useEffect } from 'react'
import { useSocketContext } from '../utils/SocketContex.js'
import useConversation from '../zustand/useConversation'
import notificationsSound from '../assets/notification.mp3'
import { BlockedUsersContext } from '../utils/BlockedUsers.js'
import { AuthContext } from '../utils/AuthContext.js'
const useListenMessage = () => {
  const {authUser} = useContext(AuthContext)
  const {BlockedUsers,sendIsVisibleInput,sendIsBlocked} = useContext(BlockedUsersContext)
  const { socket} = useSocketContext()
  const { message, setMessages} = useConversation();

  useEffect(()=>{
    
    socket?.on("newMessage", (newMessage) =>{
        console.log(newMessage);
        const sound = new Audio(notificationsSound)
        sound.play()
          setMessages([...message, newMessage]);
        // if (!BlockedUsers.includes(newMessage.msgSender)) {
        //   setMessages([...message, newMessage]);
        // }
    })

    // socket?.on("userBlocked", (blockedUserId)=>{
    //   console.log(blockedUserId);
    //   if(authUser?.id === blockedUserId){
    //     console.log("true");
    //     sendIsVisibleInput(false)
    //     sendIsBlocked(false)
    //   }else{
    //     sendIsVisibleInput(true)
    //     sendIsBlocked(true)
    //   }
    // })
    // socket?.on("userUnBlocked", (blockedUserId)=>{
    //   console.log(blockedUserId);
    //   if(authUser?.id === blockedUserId){
    //     console.log("true");
    //     sendIsVisibleInput( true)
    //   }
    // })
    
    return ()=> {
      socket?.off("newMessage")
      // socket?.off("userBlocked")
      // socket?.off("unblockUser")
    }
  },[socket, message, setMessages,BlockedUsers, authUser, sendIsVisibleInput])

  
}

export default useListenMessage
