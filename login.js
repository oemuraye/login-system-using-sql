const mysql = require("mysql");
const express = require("express");
const bodyParser = require("body-parser");

const dotenv = require("dotenv");
dotenv.config();

const encoder = bodyParser.urlencoded();

const app = express();
app.use("/assets", express.static("assets"));

const connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

connection.connect((err) => {
  if (err) {
    console.log(err.message);
  }
  console.log("db " + connection.state);
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", encoder, (req, res) => {
  let username = req.body.username;
  let password = req.body.password;

  connection.query(
    "SELECT * FROM loginusers WHERE user_name = ? AND user_pass = ?",
    [username, password],
    (error, results, fields) => {
      if (results.length > 0) {
        res.redirect("/welcome");
      } else {
        res.redirect("/");
      }
      res.end();
    }
  );
});

// when login is success
app.get("/welcome", (req, res) => {
  res.sendFile(__dirname + "/welcome.html");
});

app.listen(4000);
