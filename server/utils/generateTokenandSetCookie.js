import jwt from 'jsonwebtoken'

const generateTokenAndSetCookie = (userID, time)=>{
const token = jwt.sign({userID}, process.env.JWT_SECRET_KEY, {
    expiresIn:time
})

return token
}
export default generateTokenAndSetCookie