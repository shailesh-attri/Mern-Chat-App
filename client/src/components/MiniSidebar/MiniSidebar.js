import React, { useContext, useEffect, useState } from "react";
import "./miniSidebar.scss";
import defaultImage from "../../assets/defaultImage.png";
import N_logo from "../../assets/N_logo.png";
import { getUserRoute } from "../../utils/APIRoutes";
import { AuthContext } from "../../utils/AuthContext";
import axios from "axios";
import { MdLogout } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { RiFullscreenLine } from "react-icons/ri";
import { FullScreenContext  } from "../../utils/fullScreenContext";
import useBlocklist from "../../hooks/getBlocklist";
const MiniSidebar = ({ sendDataToParent }) => {
  const {toggleFullScreen} = useContext(FullScreenContext )
  const [ThisUser, setThisUser] = useState([]);
  const { authUser, avatarMessage, sendLoggedData } =
    useContext(AuthContext);
  const {handleBlocklist} = useBlocklist()
  const navigate = useNavigate();
  const getUser = `${getUserRoute}/${authUser?.id}`;

  useEffect(() => {
    // fetching user
    const handleFetchUser = async () => {
      try {
        const res = await axios.get(getUser);
        if (res.status === 200) {
          sendLoggedData(res.data.ThisUser);
          setThisUser(res.data.ThisUser);
          handleBlocklist(authUser?.id)
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    //   Calling functions
    handleFetchUser();
  }, [authUser, avatarMessage]);
  const handleEditData = (data) => {
    sendDataToParent(data);
  };
  const Logout = () => {
    localStorage.removeItem("userData");

    navigate("/");
    window.location.reload(); 
    toast.success("Logged out successfully");
  };
  return (
    <div className="mainContainer">
      <div className="wrapper">
        <div className="logo">
          <img src={N_logo} alt="" />
        </div>
        <div className="UserLog_and_out">
        <RiFullscreenLine onClick={toggleFullScreen}/>
          <span className="MdLogout">
            <MdLogout onClick={Logout} />
          </span>
          <div className="user" onClick={() => handleEditData(false)}>
            <img
              src={(ThisUser && ThisUser?.avatarUrl) || defaultImage}
              alt=""
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiniSidebar;
