import { v1 as uuidv1 } from "uuid";
import db from "../db/db.js";
import Mailsender from "../utils/Email.js";
import bcrypt from "bcrypt";
const { User, Forgotpassword } = db;

const forgotpasswordController = async (req, res) => {
  try {
    const { Email } = req.body;
    const user = await User.findOne({ where: { Email: Email } });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found please register" });
    }
    const genratetoken = uuidv1();
    console.log(genratetoken);
    const forgotpasswordrequest = await Forgotpassword.create({
      token: genratetoken,
      UserId: user.id,
      isactive: true,
    });
    

    const urltosend = `http://localhost:9000/api/v1/password/resetpassword/${genratetoken}`;

    const sender = await Mailsender(urltosend, Email, user.Name);
   
    if (sender) {
      res.status(200).send({
        message: "mail send succesfully",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const forgotPasswordRequestController = async (req, res) => {
  try {
    const token = req.params.token;
    console.log(token);
    const forgotRequestCheck = await Forgotpassword.findOne({
      where: { token: token },
    });
   console.log(forgotRequestCheck);
    if (!forgotRequestCheck.isactive) {
      return res.status(404).json({ message: "Invalid or expired reset link" });
    }
    res.status(200).send(
      `<html>
                                    <script>
                                        function formsubmitted(e){
                                            e.preventDefault();
                                            console.log('called')
                                        }
                                    </script>
                                    <form action="/api/v1/password/updatepassword/${token}" method="get">
                                        <label for="newpassword">Enter New password</label>
                                        <input name="newpassword" type="password" required></input>
                                        <button>reset password</button>
                                    </form>
                                </html>`
    );
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const updatepasswordController = async (req, res) => {
  try {
    const token = req.params.token; 
    const newpassword = req.query.newpassword;

    console.log(token);

    const tokenCheck = await Forgotpassword.findOne({
      where: { token: token },
     
    });

    console.log(tokenCheck);

    if (!tokenCheck.isactive) {
      return res.status(404).json({ message: "Invalid or expired reset link" });
    }

    const userId = tokenCheck.UserId;
    const findUser = await User.findOne({
      where: {
        id: userId,
      },
    });

    const hashedPassword = await bcrypt.hash(newpassword, 10);

    const updatepassword = await findUser.update({
      Password: hashedPassword,
    });

    if (updatepassword) {
      await tokenCheck.update({
        isactive: false,
      });
    }

    return res.status(200).send({
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export {
  forgotpasswordController,
  forgotPasswordRequestController,
  updatepasswordController,
};
