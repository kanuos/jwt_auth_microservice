// initialize the app to read the .env file for ENVIRONMENT VARIABLES
require("dotenv").config();

const {PORT} = process.env;

const express = require("express");
const app = express();
app.listen(PORT, ()=> console.log(`Server listening on PORT ${PORT}`))


app.get("/", (req, res) => res.json("hello world"))
