import db from "../db/db.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import AWS from "aws-sdk";
const { Expense, User, dbConnect, Totalexpense, Sequelize,Expensereocord } = db;

const uploadToS3 = async (data, filename) => {
  const BUCKET_NAME = process.env.BUCKET_NAME;
  const IAM_USER_KEY = process.env.IAM_USER_KEY;
  const SECRETKEY = process.env.SECRETKEY;

  const s3bucket = new AWS.S3({
    accessKeyId: IAM_USER_KEY,
    secretAccessKey: SECRETKEY,
  });

  return new Promise((resolve, reject) => {
    s3bucket.createBucket(() => {
      const params = {
        Bucket: BUCKET_NAME,
        Key: filename,
        Body: data,
        ACL: 'public-read',
      };

      s3bucket.upload(params, (err, response) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          console.log( response);
          resolve(response.Location);
        }
      });
    });
  });
};

const downloadexpenseController = async (req, res) => {
  try {
    const { Ispremium, Userid } = req; 

    if (!Ispremium) {
      return res.status(400).json({
        success: false,
        message: "User is not a premium member",
      });
    }

 
    const expenses = await Expense.findAll({ where: { UserId: Userid } });
    console.log(expenses);

    const stringifiedExpenses = JSON.stringify(expenses);

    const filename = `Expenses${Userid}/${new Date()}.txt`; 
    const fileURL =await uploadToS3(stringifiedExpenses, filename); 
  
    const createRecord= await Expensereocord.create({
      UserId:Userid,
      Record:fileURL
    })

    const getoldExpenserecord= await Expensereocord.findAll({
      where:{
        UserId:Userid,
      }
    })
     

 
    res.status(200).json({ fileURL,getoldExpenserecord, success: true });
  } catch (error) {
    console.error( error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const userexpenseController = async (req, res) => {
  const t = await dbConnect.transaction();
  try {
    const { Amount, Description, Category } = req.body;

    if ([Amount, Description, Category].some((ele) => ele === "")) {
      return res
        .status(403)
        .json({ StatusCode: 403, Message: "Please fill all the fields" });
    }

    const userexpense = await Expense.create(
      {
        Amount,
        Description,
        Category,
        UserId: req.Userid,
      },
      { trasaction: t }
    );

    const username = await User.findOne({
      where: {
        id: req.Userid,
      },
    });

    const getTotalexpens = await Totalexpense.findOne({
      where: { UserId: req.Userid },
    });

    if (!getTotalexpens) {
      await Totalexpense.create(
        {
          Name: username.Name,
          Amount: Amount,
          UserId: req.Userid,
        },
        { trasaction: t }
      );
    } else {
      const calculatetotal = Number(getTotalexpens.Amount) + Number(Amount);
      await Totalexpense.update(
        { Amount: calculatetotal },
        { where: { UserId: req.Userid }, transaction: t }
      );
    }
    await t.commit();
    return res.status(200).json({
      StatusCode: 200,
      Data: userexpense,
      Message: "Expense created successfully",
    });
  } catch (error) {
    await t.rollback();
    console.error(error);
    return res
      .status(500)
      .json({ StatusCode: 500, Message: "Internal Server Error" });
  }
};

const allexpenseController = async (req, res) => {
  try {
    const userid = req.Userid;
    const Ispremium = req.Ispremium;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.pagelimit) || 5;
    const objTosend = {};
     console.log(page)
     console.log(limit)
    const userExpense = await Expense.findAll({
      where: {
        UserId: userid,
      },
      limit: limit,
      offset: (page - 1) * limit,
    });

    objTosend.userExpense = userExpense;

    const nextPage = userExpense.length === limit ? page + 1 : null;
    const previousPage = page > 1 ? page - 1 : null;
    
    objTosend.pagination = {
      pageno: page,
      nextpage: nextPage,
      previouspage: previousPage,
    };

    if (Ispremium) {
      let expensesQuery = {
        attributes: ["Name", "Amount"],
        order: [[Sequelize.literal("Amount"), "DESC"]],
      };
      const userExpenses = await Totalexpense.findAll(expensesQuery);
      objTosend.Leedbord = userExpenses;
    }

    return res
      .status(200)
      .send(new ApiResponse(200, objTosend, "Expenses fetched successfully"));
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send(new ApiResponse(500, "", "Internal Server Error"));
  }
};


const deleteexpenseController = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);

    const getproduct = await Expense.findOne({
      where: {
        id: id,
      },
    });
    const getTotalexpens = await Totalexpense.findOne({
      where: { UserId: req.Userid },
    });

    const calculatetotal =
      Number(getTotalexpens.Amount) - Number(getproduct.Amount);
    await Totalexpense.update(
      { Amount: calculatetotal },
      { where: { UserId: req.Userid } }
    );

    const deleteexpense = await Expense.destroy({
      where: { id },
    });
    if (!deleteexpense) {
      return res.status(200).send({
        message: "item not found",
      });
    }
    return res.send(200).send(new ApiResponse(200, '', "item deleted succesfully"));
  } catch (error) {
    
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export {
  userexpenseController,
  allexpenseController,
  deleteexpenseController,
  downloadexpenseController,
};
