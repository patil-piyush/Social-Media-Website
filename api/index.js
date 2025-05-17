const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const helmet = require('helmet');
require('dotenv').config();

const app = express();


//importing routes
const userRoute = require('./routes/user')
const authRoute = require('./routes/auth')

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("Connected to MongoDB!"))
  .catch((err) => console.error("MongoDB connection error:", err));


//middlewares
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

//setting up routes
app.use('/api/users', userRoute);
app.use('/api/auth', authRoute);




app.listen(8800, () => console.log("backend Server is Running!"));
