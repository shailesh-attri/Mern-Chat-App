import React, { useContext } from 'react';
import axios from 'axios';
import { AllBlockedRoute } from '../utils/APIRoutes';
import { BlockedUsersContext } from '../utils/BlockedUsers.js';

const useBlocklist = () => {
    const { sendBlock } = useContext(BlockedUsersContext);

    const handleBlocklist = async (authUserId) => {
        
        const getList = `${AllBlockedRoute}${authUserId}`;
        console.log(getList);

        try {
            const res = await axios.get(getList);
            const IsUser = res.data.BlockedUserDoc.includes(authUserId)
            if(IsUser) {
                sendBlock(res.data.BlockedUser);
                console.log("res.data.BlockedUser", res.data.BlockedUser);
            }
        } catch (error) {
            console.log("Error in getting blocklist", error);
        }
    };

    return { handleBlocklist };
};

export default useBlocklist;
