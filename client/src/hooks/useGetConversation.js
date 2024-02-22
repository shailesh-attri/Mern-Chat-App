import { React, useState, useEffect } from "react";
import { getAllUsersRoute } from "../utils/APIRoutes";
import axios from "axios";
const useGetConversation = () => {
  const userResponse = JSON.parse(localStorage.getItem("userData"));
  const userId = userResponse?.id || "";
  const [AllDBUsers, setAllDbUsers] = useState([]);
  useEffect(() => {
    const getAllUsers = async () => {
      try {
        const result = await axios.post(getAllUsersRoute, { userId: userId });
        if (result.status === 200) {
          setAllDbUsers(result.data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    getAllUsers();
  },[]);

  return { AllDBUsers };
};

export default useGetConversation;
