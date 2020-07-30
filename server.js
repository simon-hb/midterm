// load .env data into process.env
require('dotenv').config();

// Web server config
const PORT = process.env.PORT || 8080;
const ENV = process.env.ENV || "development";
const express = require("express");
const bodyParser = require("body-parser");
const sass = require("node-sass-middleware");
const app = express();
const morgan = require('morgan');

const {findUserByCookieID} = require("./helpers")


const bcrypt = require('bcrypt');

var cookieSession = require('cookie-session')
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));

// PG database client/connection setup
const { Pool } = require('pg');
const dbParams = require('./lib/db.js');
const db = new Pool(dbParams);
db.connect();

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const appsRoutes = require("./routes/app");
const widgetsRoutes = require("./routes/widgets");
const loginsRoutes = require("./routes/login");
const logoutsRoutes = require("./routes/logout");
const registersRoutes = require("./routes/register");
const searchRoutes = require("./routes/search");
const quizRoutes = require("./routes/quiz");

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own

app.use("/api/app", appsRoutes(db)); // use for api-esques functionality where user gets JSON back
app.use("/login", loginsRoutes(db));
app.use("/logout", logoutsRoutes(db));
app.use("/register", registersRoutes(db));
app.use("/search", searchRoutes(db));
app.use("/quiz", quizRoutes(db));
// Note: mount other resources here, using the same pattern above


// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).
app.get("/", (req, res) => {
  const cookieUserId = req.session.user_id;
  const templateVars = {
    user: false,
    quizzes: []
  }
  db.query(`SELECT * FROM users;`)
  .then(data => {
    const users = data.rows;
    return  user = findUserByCookieID(req.session.user_id, users);
  }).then((user)=> {
    templateVars.user = user;

    const queryParams = [];
    let queryString = `
      SELECT quizzes.*, SUM(likes.is_like::int) AS likes
      FROM quizzes
      JOIN subjects ON subjects.id = subject_id
      JOIN levels ON levels.id = level_id
      JOIN toughness_options ON toughness_options.id = toughness_id
      JOIN likes ON quizzes.id = likes.quiz_id
      WHERE quizzes.is_private = false AND quizzes.is_published = true
      GROUP BY quizzes.id
      ORDER BY likes DESC
      LIMIT 6;
      `;

      db.query(queryString, queryParams)

      .then(result => {
        const expectedResult = result.rows;

        templateVars.quizzes = expectedResult;
        templateVars.host = req.get('host')
        console.log(templateVars)
        // Render home with top quizzes
        res.render("index", templateVars);
      })



  })
  .catch(err => {
    res
      .status(500)
      .json({ error: err.message });
  })
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
