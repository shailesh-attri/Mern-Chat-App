let host = "http://localhost:8000";

// Check if the environment is production (Vercel deployment)
// if (process.env.NODE_ENV === "production") {
//     // If so, set the host to the Vercel URL
//     host = "https://backend-chat-app-opal.vercel.app";
// }
const Host = "http://localhost:8000"
// useAuthRoutes
const AuthAPI = "api/user/auth";
export const registerRoute = `/${AuthAPI}/register`;
export const loginRoute = `/${AuthAPI}/login`;
export const EmailVerifyRoute = `/${AuthAPI}/email_verify`;
export const ResetPasswordRoute = `/${AuthAPI}/reset_password`;
export const verify_otpRoute = `/${AuthAPI}/verify_otp`;
export const logoutRoute = `/${AuthAPI}/logout`;
export const registrationVerifyRoute = `/${AuthAPI}/registration_verify`
// UserRoute
const UserAPI = "api/user";
export const getUserRoute = `/${UserAPI}/`;
export const editUserRoute = `/${UserAPI}/edit_profile`;
export const UpdatePasswordRoute = `/${UserAPI}/update_password`;
export const getAllUsersRoute = `/${UserAPI}/getAllUsers`;
export const findUserRoute = `/${UserAPI}/findUser`;
export const getSelectedProfile = `/${UserAPI}/getSelectedProfile`;
export const unFollowUserRoute = `/${UserAPI}/:id/unFollow`;
export const changeAvatarRoute = `/${UserAPI}/`
export const deleteAvatarRoute = `/${UserAPI}/deleteAvatar`


// Message routes
const MessageAPI = 'api/user/message'
export const sendMessageRoute = `/${MessageAPI}/sendMessage`
export const fileUploadRoute = `/${MessageAPI}/uploadImage`

// Chat routes
const ChatAPI = 'api/user/chat'
export const accessChatRoute = `/${ChatAPI}/accessChat`
export const fetchChatRoute = `/${ChatAPI}/`
export const blockedChatRoute = `/${ChatAPI}/blockedUsers`
export const UnBlockedUsersChatRoute = `/${ChatAPI}/UnBlockedUsers`
export const AllBlockedRoute = `/${ChatAPI}/AllBlocked/`
export const groupChatRoutes = `/${ChatAPI}/groupChat`
