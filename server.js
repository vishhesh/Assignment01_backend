const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const { mongoose } = require("./mongoose/mongoose");
const Routers = require("./routes/index");
const cors = require('cors');



// const fileUpload = require('express-fileupload');
const jwt = require("jsonwebtoken");

const { verifyToken } = require("./utils/index");
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// app.use(fileUpload());
app.use(express.static(path.join(__dirname, "/public")));

app.use(async (req, res,next)=>{
	let k = await Object.keys(req.body)[0];
	let a = await JSON.parse(k);
	req.body = a;
	next();
})


app.use('/auth', Routers.authRouter);
app.use(verifyToken);

app.get('/me', (req, res)=>{
	
})

app.get('/users', (req, res)=>{
	console.log(req.body);
})


app.listen(3030, () => {
	console.log("@3030");
});
