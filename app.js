import express from 'express'
import morgan from "morgan"
import cors from "cors"
import dotenv from "dotenv"
import cookieParser from 'cookie-parser'
import helemt from "helmet"
import db from './db/db.js'

const app=express()

//configs
app.use(cors({origin:"*"}));
app.use(morgan('dev'))
app.use(express.json())
app.use(cookieParser())
dotenv.config({path:'.env'})


 

//Router configs
import authroute from './routes/auth.Route.js'
import expense from './routes/expense.Route.js'
import payment from './routes/razerpay.Router.js'
import password from './routes/password.route.js'

app.use('/api/v1/Auth',authroute)
app.use('/api/v1/Expense',expense)
app.use('/api/v1/Payment',payment)
app.use('/api/v1/password',password)


app.use(helemt())

const PORT=process.env.PORT||9000
app.listen(PORT,()=>{
    console.log(`Server is running in ${PORT}`);
})