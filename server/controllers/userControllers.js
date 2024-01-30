import bcrypt from "bcrypt";
import { user } from "../Models/user.model.js";

const userController = {
  register: async (req, res) => {
    try {
      const { username, email, password, phoneNo, fullName } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new user({
        username,
        email,
        phoneNo,
        fullName,
        password: hashedPassword,
      });

      await newUser.save();
      res.status(200).send({ message: "User registered successfully" });
    } catch (error) {
      console.error(error);
      res.status(error.status).send({ message: "User registration failed" });
    }
  },
};
export default userController;
