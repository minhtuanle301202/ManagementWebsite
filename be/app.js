const database = require('./database/database');
const express = require('express');
const dotenv = require('dotenv');
const adminRouter = require('./routes/AdminRoute');
const userRouter = require('./routes/UserRoute');
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");

dotenv.config();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
})); 
app.use('/admin',adminRouter);
app.use('/user',userRouter);



app.listen(3001,'0.0.0.0', () => {
    console.log("Server is running on port 3001");
});

database.connectDB();



module.exports = app;

