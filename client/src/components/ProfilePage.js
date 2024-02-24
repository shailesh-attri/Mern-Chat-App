import React, { useContext, useEffect, useState } from "react";
import './ProfilePage.scss'
import { AuthContext } from "../utils/AuthContext";
import { getSelectedProfile } from "../utils/APIRoutes";
import axios from "axios";
import { selectedUserContext } from "../utils/selectedUserContext";
import useConversation from "../zustand/useConversation";
const ProfilePage = () => {
  const { loggedUser } = useContext(AuthContext);
  const { selectedConversation } = useConversation();
  const { selectedUser} = useContext(selectedUserContext);
  const [showImage, setImage] = useState(null);
  const [user, setUser] = useState('')
  const getProfileRoute = selectedConversation
  ? `${getSelectedProfile}/${selectedConversation._id}`
  : "";
  useEffect(() => {
    setImage(loggedUser?.avatarUrl);
    console.log(selectedUser);
  }, [loggedUser]);
  useEffect(()=>{
    const handleGetProfile = async()=>{

        try {
            const res = await axios.get(getSelectedProfile, {userId:selectedUser})
            if(res.status === 200){
                setUser(res.data)
            }
        } catch (error) {
            console.log("Error getting profile", error);
        }
    }
    handleGetProfile();
  },[selectedUser])
  return (
    <div className="mainProfile">
      <div className="Header">
        <span className="userNameHeader">{user?.fullName} Profile</span>
      </div>
      <div className="mainInputs">
        <div className="profileImage">
          <div className="dpImage">
            <img src={showImage} />
          </div>
        </div>
        <div className="profileBox">
            <div className="container">
                <span>{user?.fullName}</span>
                <span>{user?.username}</span>
                <span>{user?.email}</span>
                <span>{user?.bio}</span>
                <span>Joined 04/feb/2024</span>
            </div>
           
        </div>
      </div>
   
    </div>
    
  );
};

export default ProfilePage;
