import db from "../db/db.js";
import bcrypt from "bcrypt"
import {generateAuthToken} from '../utils/generateAuthToken.js'
import {ApiResponse} from "../utils/ApiResponse.js"
const { User } = db;

const registerController = async (req, res) => {
  const { Name, Email, Phone, Password } = req.body;

  const ExistingUser = await User.findOne({ where: { Email: Email } });
  if (ExistingUser) {
    return res
      .status(403)
      .send({ StatusCode: 403, Message: "User already exists please login" });
  }
  const Hashpass=await bcrypt.hash(Password,10)
  const user = await User.create({
    Name: Name,
    Email: Email,
    Phone: Phone,
    Password: Hashpass,
    Ispremium:false
  });

  return res.status(201).json(user);
};

const loginController = async (req, res) => {
  try {
    const { Email, Password } = req.body;
    const user = await User.findOne({ where: { Email: Email } });
    if (!user) {
      return res
        .status(404)
        .send({
          StatusCode: 404,
          Message: "User does not exist please register",
        });
    }
  
    const isMatch = await bcrypt.compareSync(Password,user.Password)
    console.log(isMatch);
    if (!isMatch) {
      return res
        .status(401)
        .send({ StatusCode: 401, Message: "Password does not match" });
    }
     const tokenvalue={
      id:user.id,
      Ispremium:user.Ispremium
     }
    const token = await generateAuthToken(tokenvalue);
    res.cookie('Bearer', token, {
      httpOnly: true, 
      secure: true,   
      maxAge: 7 * 24 * 60 * 60 * 1000, 
    });
    return res
      .status(200)
      .send(new ApiResponse(200,{
        Accesstoken: token,
        user,
        message: "Login successful",
        success: true,
      }));
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export { registerController, loginController };
