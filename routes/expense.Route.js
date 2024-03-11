import { Router } from "express";
import {
  userexpenseController,
  allexpenseController,
  deleteexpenseController,
  downloadexpenseController
} from "../controller/expense.Controller.js";
import Checkjwttoken from "../middleware/Authentication.js";
const route = Router();


route.get("/download", Checkjwttoken, downloadexpenseController);
route.get("/allexpense", Checkjwttoken, allexpenseController);
route.post("/usersexpense", Checkjwttoken, userexpenseController);
route.delete("/deleteexpense/:id", Checkjwttoken, deleteexpenseController);
export default route;
