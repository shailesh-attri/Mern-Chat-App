import {create} from 'zustand'
const useConversation = create((set)=>({
    selectedConversation:'',
    setSelectedConversation:(selectedConversation)=>set({selectedConversation}),
    
    message:[],
    setMessages: (messages) => set({ message: messages})
}))
export default useConversation