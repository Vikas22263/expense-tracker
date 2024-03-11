import { Sequelize } from "sequelize";
import User from "../models/user.model.js";
import Expense from "../models/expense.model.js";
import Order from "../models/order.model.js";
import Totalexpense from "../models/totalexpense.model.js";
import Forgotpassword from "../models/forgotrequests.model.js";
import Expensereocord from "../models/userexpenerecode.model.js";
const dbConnect = new Sequelize("node-schema", "root", "Vikas@10", {
  host: "localhost",
  dialect: "mysql",
  // logging: false,
});

const db = {};

db.Sequelize = Sequelize;
db.dbConnect = dbConnect;
db.Expense = Expense(dbConnect, Sequelize);
db.User = User(dbConnect, Sequelize, db.Expense);
db.Order = Order(dbConnect, Sequelize);
db.Totalexpense = Totalexpense(dbConnect, Sequelize);
db.Forgotpassword = Forgotpassword(dbConnect, Sequelize);
db.Expensereocord = Expensereocord(dbConnect, Sequelize);


//association
db.User.hasMany(db.Expense, { foreignKey: "UserId" });
db.Expense.belongsTo(db.User, { foreignKey: "UserId" });
db.Forgotpassword.belongsTo(db.User, { foreignKey: "UserId" });
db.User.hasMany(db.Forgotpassword, { foreignKey: "UserId" });

db.dbConnect
  .sync()
  .then(() => {
    console.log("Database is connected");
  })
  .catch((err) => {
    console.error("Error connecting to the database:", err);
  });

export default db;
