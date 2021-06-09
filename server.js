// initialize the app to read the .env file for ENVIRONMENT VARIABLES
require("dotenv").config();
const {PORT} = process.env;

const express = require("express");
const app = express();

// enabling app to parse the request body 
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// database connection
require("./_database");


// use route middlewares
app.use("/auth", require("./_Routes/AuthRoute"));


// listening for incoming requests
app.listen(PORT, ()=> console.log(`Server listening on PORT ${PORT}`))


