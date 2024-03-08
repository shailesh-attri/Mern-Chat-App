import React, { useContext, useEffect, useState } from "react";
import "./ProfilePage.scss";
import { AuthContext } from "../../utils/AuthContext";
import { getSelectedProfile } from "../../utils/APIRoutes";
import axios from "axios";
import { selectedUserContext } from "../../utils/selectedUserContext";
import defaultImage from "../../assets/defaultImage.png";
import useBlockUser from "../../hooks/useBlockUser";
import { BlockedUsersContext } from "../../utils/BlockedUsers";
import { TailSpin } from "react-loader-spinner";
const ProfilePage = ({ selectedUserId }) => {
  const {BlockedUsers} = useContext(BlockedUsersContext);
  const {handleBlockUser,handleUnBlockUser} = useBlockUser()
  const { loggedUser } = useContext(AuthContext);
  const { selectedUser } = useContext(selectedUserContext);
  const [showImage, setImage] = useState(null);
  const [user, setUser] = useState("");
  const [isLoading, setLoading] = useState(false);
  const getProfileRoute = `${getSelectedProfile}/${selectedUserId}`;
  useEffect(() => {
    setImage(loggedUser?.avatarUrl);
  }, [loggedUser]);
  useEffect(() => {
    const handleGetProfile = async () => {
      setLoading(true)
      try {
        const res = await axios.get(getProfileRoute);
        if (res.status === 200) {
          setUser(res.data.otherDetails);
          setLoading(false)
        }
      } catch (error) {
        console.log("Error getting profile", error);
      }
    };
    handleGetProfile();
  }, [selectedUserId]);

  const handleBlocking = (data) => {
    try {
       handleBlockUser(data);
    } catch (error) {
      console.log("Error blocking user:", error);
    }
  };
  
  const handleUnblocking = (data) => {
    try {
      handleUnBlockUser(data);
    } catch (error) {
      console.log("Error unblocking user:", error);
    }
  };
  const isBlocked = BlockedUsers.includes(user?._id);
  return (
    <div className="mainContainer">
      <div className="Header">
        <span className="userInfoHeading">Userinfo</span>
        <span className="userNameHeader">{user?.username}</span>
        {isBlocked ? (
        <span className="block" onClick={()=>handleUnblocking(user?._id)}>Unblock</span>
      ) : (
        <span className="block" onClick={()=>handleBlocking(user?._id)}>Block</span>
      )}
      </div>
      <div className="box">
      {!isLoading ? 
        <div className="Inputs">
          <div className="profileImage">
            <div className="dpImage">
              <img src={(user && user?.avatarUrl) || defaultImage} />
            </div>
          </div>
          <div className="profileBox">
            <div className="container">
              <div className="detail">
                <span>Username : </span> {user?.username}
              </div>
              <div className="detail">
                <span>Fullname : </span> {user?.fullName}
              </div>
              <div className="detail">
                <span>Email : </span> {user?.email}
              </div>
              <div className="detail">
                <span>Bio : </span> {user?.bio}
              </div>
              <div className="detail">
                Joined {extractDate(user?.createdAt)}
              </div>
            </div>
          </div>
        </div>
      :
      <div className="Loader">

        <TailSpin 
              height="30"
              width="40"/>
        </div>
      }
        
      </div>
    </div>
  );
};

export default ProfilePage;
const extractDate = (dateString) => {
  const date = new Date(dateString);
  const options = { day: "numeric", month: "short", year: "numeric" };
  return date.toLocaleDateString("en-GB", options);
};
