import { createContext, useState, useEffect, useContext } from "react";
import io from "socket.io-client";
import { AuthContext } from "./AuthContext";
import { host } from "../baseUrl";

const SocketContext = createContext();



export const useSocketContext = () => {
    return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
	const [onlineUsers, setOnlineUsers] = useState([]);
    const {authUser, setAuthUser} = useContext(AuthContext)
    
    
	useEffect(() => {
        
        console.log("socket", socket);
		if (authUser) {
			const socket = io.connect(host, {
				query: {
					userId: authUser?.id,
				},
			});

			setSocket(socket);

			// socket.on() is used to listen to the events. can be used both on client and server side
			socket.on("getOnlineUsers", (users) => {
				setOnlineUsers(users);
			});

			return () => socket.close();
		} else {
			if (socket) {
				socket.close();
				setSocket(null);
			}
		}
	}, [authUser]);

	return <SocketContext.Provider value={{ socket, onlineUsers }}>{children}</SocketContext.Provider>;
};