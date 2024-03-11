import { Router } from "express";
import { registerController,loginController } from "../controller/auth.Controller.js";

const route = Router();

route.post("/register", registerController);
route.post('/login', loginController);

export default route;
