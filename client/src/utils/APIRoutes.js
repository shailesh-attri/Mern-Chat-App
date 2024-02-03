const host = "http://localhost:8000";

// useAuthRoutes
const AuthAPI = "api/user/auth";
export const registerRoute = `${host}/${AuthAPI}/register`;
export const loginRoute = `${host}/${AuthAPI}/login`;
export const EmailVerifyRoute = `${host}/${AuthAPI}/email_verify`;
export const ResetPasswordRoute = `${host}/${AuthAPI}/reset_password`;
export const verify_otpRoute = `${host}/${AuthAPI}/verify_otp`;

// UserRoute
const UserAPI = "api/user";
export const getUserRoute = `${host}/${UserAPI}/:id`;
export const editUserRoute = `${host}/${UserAPI}/edit_profile`;
export const deleteUserRoute = `${host}/${UserAPI}/delete_profile`;
export const getAllUsersRoute = `${host}/${UserAPI}/getAllUsers`;
export const followUserRoute = `${host}/${UserAPI}/:id/follow`;
export const unFollowUserRoute = `${host}/${UserAPI}/:id/unFollow`;
export const changeAvatarRoute = `${host}/${UserAPI}/change_avatar`
