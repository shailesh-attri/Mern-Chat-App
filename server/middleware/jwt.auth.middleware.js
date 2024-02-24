import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

const JwtAuthMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    console.log(token);
      
      if (!token) {
          return res.status(400).json({ message: "Invalid token" });
      }

      const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
      
      req.userID = decode?.userID;
      
      next();
    //   res.json({decode: decode})
  } catch (error) {
      return res.status(401).json({ message: "Invalid token or expire" });
  }
};
export default JwtAuthMiddleware

const JwtAuthMiddlewareForRegistration = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(400).json({ message: "Invalid token" });
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
    
    
    req.UserOTP = decode?.otp
    next();
    
} catch (error) {
    return res.status(401).json({ message: "Invalid token or expire" });
}
}
export  {JwtAuthMiddlewareForRegistration}