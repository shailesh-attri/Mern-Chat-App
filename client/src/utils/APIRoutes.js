const host = "http://localhost:8000";

// useAuthRoutes
const AuthAPI = "api/user/auth";
export const registerRoute = `${host}/${AuthAPI}/register`;
export const loginRoute = `${host}/${AuthAPI}/login`;
export const EmailVerifyRoute = `${host}/${AuthAPI}/email_verify`;
export const ResetPasswordRoute = `${host}/${AuthAPI}/reset_password`;
export const verify_otpRoute = `${host}/${AuthAPI}/verify_otp`;
export const logoutRoute = `${host}/${AuthAPI}/logout`;
export const registrationVerifyRoute = `${host}/${AuthAPI}/registration_verify`
// UserRoute
const UserAPI = "api/user";
export const getUserRoute = `${host}/${UserAPI}/`;
export const editUserRoute = `${host}/${UserAPI}/edit_profile`;
export const deleteUserRoute = `${host}/${UserAPI}/delete_profile`;
export const getAllUsersRoute = `${host}/${UserAPI}/getAllUsers`;
export const findUserRoute = `${host}/${UserAPI}/findUser`;
export const getProfileRoute = `${host}/${UserAPI}/getProfile`;
export const unFollowUserRoute = `${host}/${UserAPI}/:id/unFollow`;
export const changeAvatarRoute = `${host}/${UserAPI}/change_avatar`


// Message routes
const MessageAPI = 'api/user/message'
export const sendMessageRoute = `${host}/${MessageAPI}/sendMessage`
export const fileUploadRoute = `${host}/${MessageAPI}/uploadImage`

// Chat routes
const ChatAPI = 'api/user/chat'
export const accessChatRoute = `${host}/${ChatAPI}/accessChat`
export const fetchChatRoute = `${host}/${ChatAPI}/`
export const blockedChatRoute = `${host}/${ChatAPI}/blockedUsers`
export const UnBlockedUsersChatRoute = `${host}/${ChatAPI}/UnBlockedUsers`
