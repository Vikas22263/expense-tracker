import { Router } from "express";
import {
  forgotpasswordController,
  forgotPasswordRequestController,
  updatepasswordController,
} from "../controller/forgotpassword.Controller.js";

const route = Router();

route.get("/resetpassword/:token", forgotPasswordRequestController);
route.get("/updatepassword/:token", updatepasswordController);
route.post("/forgotpassword", forgotpasswordController);

export default route;
