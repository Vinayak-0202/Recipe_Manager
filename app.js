const express = require("express");
const path = require("path");
const pg = require("pg");
const consolidate = require("consolidate");
const dust = require("dustjs-helpers");
const bodyParser = require("body-parser");
const app = express();

//DataBase Connect String
const connString =
  process.env.CONNECT || "postgres://vinayak:vinayak21@localhost/recipebookdb";
let port = process.env.PORT || 3000;

// Assign Dust Engine to .dust Files
app.engine("dust", consolidate.dust);

//Set Default Ext .dust
app.set("view engine", "dust");
app.set("views", __dirname + "/views");

app.use(express.static(path.join(__dirname, "public")));

//Body -parser middleaware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.render("index");
});
//server
app.listen(port, () => console.log(`server is listning on ${port}...`));
