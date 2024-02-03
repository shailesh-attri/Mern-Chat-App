const UserController = {

    // editProfile: function
    editProfile:(req, res, next)=>{
        res.json({message: 'Edit Profile'})
    },

    // deleteProfile: function
    deleteProfile:(req, res, next)=>{
        res.json({message: 'Delete Profile'})
    },

    // getUser: function
    getUser:(req, res, next)=>{
        res.json({message: 'getUser'})
    },

    // getAllUsers: function
    getAllUsers:(req, res, next)=>{
        res.json({message: 'getAllUsers'})
    },

    // followUser: function
    followUser:(req, res, next)=>{
        res.json({message: 'followUser'})
    },

    // unFollowUser: function
    unFollowUser:(req, res, next)=>{
        res.json({message: 'unFollowUser'})
    },

    // changeAvatar: function
    changeAvatar:(req, res, next)=>{
        res.json({message: 'changeAvatar'})
    },



}
export {UserController}