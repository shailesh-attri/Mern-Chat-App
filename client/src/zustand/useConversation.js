import {create} from 'zustand'
const useConversation = create((set)=>({
    selectedConversation:'',
    setSelectedConversation:(selectedConversation)=>set({selectedConversation}),
    
    message:[],
    setMessages: (messages) => set({ message: messages}),

    blockedUsers: [],
    blockUser: (user) => set((state) => ({
        blockedUsers: [...state.blockedUsers, user],
    })),
    unblockUser: (user) => set((state) => ({
        blockedUsers: state.blockedUsers.filter((blockedUser) => blockedUser !== user),
    })),
}))
export default useConversation