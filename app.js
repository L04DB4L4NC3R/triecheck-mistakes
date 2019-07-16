require("dotenv").config();
const express = require("express");
const multer = require("multer");
const fs = require("fs");
const shell = require("shelljs");

var upload = multer({dest:"static/"});

var app = express();

app.set("view engine","ejs");

app.use(express.static('static'));

app.get("/",(req,res)=>{
    res.render("index");
});



app.use(require("./routes/ocr"));
//process.env.PORT
app.listen(process.env.PORT || 3000,()=>{
    console.log("OK");
});

