/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router = express.Router();

const { findUser, validatePassword } = require("../helpers");

module.exports = (db) => {

  router.get("/", (req, res) => {
    db.query(`SELECT * FROM users;`)
      .then(data => {

        const users = data.rows;
        const checkUser = findUser(req.body.email, users);
        const templateVars = {
          user: checkUser,
          page: req.url
        }
        res.render("login", templateVars);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      })
  });



  router.post("/", (req, res) => {
    console.log("inside login route:", req.body);

    db.query(`SELECT * FROM users;`)
      .then(data => {
        const users = data.rows;
        const checkUser = findUser(req.body.email, users);
        if (checkUser) {
          console.log("CU", checkUser);

          const emailPasswordCheck = validatePassword(checkUser, req.body.email, req.body.password);
          console.log("CP", emailPasswordCheck);

          if (emailPasswordCheck) {
            // let userID = checkUser.id;
            // console.log(users);
            req.session.user_id = checkUser.id;

            const originPage = (req.headers.origin);
            console.log("PTRD", originPage);
            res.set("canRedirect", "1");
            res.end();

            // res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
            // res.redirect("/");

            // res.redirect(originPage);

          }
        }
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      })
  });

  return router;
};

