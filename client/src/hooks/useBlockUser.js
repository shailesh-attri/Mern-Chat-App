import React, { useContext,useState } from 'react'
import { useSocketContext } from '../utils/SocketContex.js'
import { AuthContext } from '../utils/AuthContext.js'
import { blockedChatRoute, UnBlockedUsersChatRoute } from '../utils/APIRoutes.js'
import axios from 'axios'
import { BlockedUsersContext } from '../utils/BlockedUsers.js'

const useBlockUser = () => {
    const {sendBlock} = useContext(BlockedUsersContext)
    const { authUser } = useContext(AuthContext);
    const { socket} = useSocketContext()
 
  const [blockedUsers, setBlockedUsers] = useState([]);
    const handleBlockUser = async(blockedUserId) => {
        
        // Emit an event to the server indicating that the user wants to block another user
        socket?.emit("blockUser", blockedUserId, authUser?.id);
       
        // Optionally, you can also perform client-side actions, such as filtering out messages from the blocked user
        const updatedBlockedUsers = [...blockedUsers, blockedUserId];
        setBlockedUsers(updatedBlockedUsers);
        sendBlock(updatedBlockedUsers)
        const blockUser = {
            sender:authUser?.id,
            blockedUserId : blockedUserId
        }
      
        try {
            const res = await axios.post(blockedChatRoute, blockUser )
            if(res.status === 200){
                sendBlock(blockedUserId)
            }
        } catch (error) {
            console.log(error.message);
        }

    }
    const handleUnBlockUser = async(blockedUserId) => {
        
        // Emit an event to the server indicating that the user wants to block another user
        socket?.emit("unblockUser", blockedUserId, authUser?.id);
       
        // Optionally, you can also perform client-side actions, such as filtering out messages from the blocked user
        const updatedBlockedUsers = blockedUsers.filter((userId) => userId !== blockedUserId);
        setBlockedUsers(updatedBlockedUsers);
        sendBlock(updatedBlockedUsers)
        const blockUser = {
            sender:authUser?.id,
            blockedUserId : blockedUserId
        }
        
        try {
            const res = await axios.post(UnBlockedUsersChatRoute, blockUser )
            if(res.status === 200){
                return res.data
            }
        } catch (error) {
            console.log(error.message);
        }

    }
      
      return { handleBlockUser,handleUnBlockUser };
}

export default useBlockUser
