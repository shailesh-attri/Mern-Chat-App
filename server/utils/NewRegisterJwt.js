import jwt from 'jsonwebtoken'

const JwtForRegistration =(otp)=>{
    
    const token = jwt.sign({otp}, process.env.JWT_SECRET_KEY, {
        expiresIn:'10d',
    })
    
    return token

}
export default JwtForRegistration