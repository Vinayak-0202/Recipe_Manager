const express = require("express");
const path = require("path");
const pg = require("pg");
const consolidate = require("consolidate");
const dust = require("dustjs-helpers");
const bodyParser = require("body-parser");
const app = express();

//DataBase Connect String
// const connString =
//   process.env.CONNECT || "postgres://vinayak:vinayak21@localhost/recipebookdb";
const config = {
  user: "postgres",
  database: "recipebookdb",
  password: "vinayak21",
  port: 5433, //Default port, change it if needed
};
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
  //pg connect
  const pool = new pg.Pool(config);
  pool.connect(function (err, client, done) {
    if (err) {
      return console.error("error fetching clientfrom pool", err);
    }
    client.query("SELECT * FROM recipes", function (err, result) {
      if (err) {
        return console.error("error running query", err);
      }
      done();
      res.render("index", { recipes: result.rows });
      // res.status(200).send(result.rows);
    });
    pool.end();
  });
});

app.post("/add", function (req, res) {
  //pg connect
  const pool = new pg.Pool(config);
  pool.connect(function (err, client, done) {
    if (err) {
      return console.error("error fetching clientfrom pool", err);
    }
    client.query(
      "INSERT INTO recipes(name, ingredients,directions) VALUES($1,$2,$3)",
      [req.body.name, req.body.ingredients, req.body.directions]
    );
    done();
    res.redirect("/");
    //pool.end();
  });
});
//server
app.listen(port, () => console.log(`server is listning on ${port}...`));
