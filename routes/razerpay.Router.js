import { Router } from "express";
import {ceateOrdercontroller,VerifyOrdercontroller} from "../controller/payment.Controller.js";
import Checkjwttoken from "../middleware/Authentication.js"
const route=Router()

route.post('/createOrder',Checkjwttoken,ceateOrdercontroller);
route.post('/verifyOrder',Checkjwttoken,VerifyOrdercontroller);


export default route;