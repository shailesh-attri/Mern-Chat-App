import React, { useContext, useEffect } from 'react'
import { useSocketContext } from '../utils/SocketContex.js'
import useConversation from '../zustand/useConversation'
import notificationsSound from '../assets/notification.mp3'
import { BlockedUsersContext } from '../utils/BlockedUsers.js'
import { AuthContext } from '../utils/AuthContext.js'

const useListenMessage = () => {
  const {authUser} = useContext(AuthContext)
  const { socket} = useSocketContext()
  const { message, setMessages,  blockUser, unblockUser} = useConversation();
  
  useEffect(()=>{
    
    socket?.on("newMessage", (newMessage) =>{
        const sound = new Audio(notificationsSound)
        sound.play()
          setMessages([...message, newMessage]);
        
          
        
    })

    socket?.on("userBlocked", (blockedUserId,senderId) => {
      if(blockedUserId === authUser?.id){
        blockUser(senderId)
      }
    });
    
    socket?.on("userUnBlocked", (blockedUserId,senderId) => {
      if(blockedUserId === authUser?.id){
        unblockUser(senderId)
      }
    });
    
    return ()=> {
      socket?.off("newMessage")
      socket?.off("userBlocked")
      socket?.off("unblockUser")
    }
  },[socket, message, setMessages,authUser])

  
}

export default useListenMessage
