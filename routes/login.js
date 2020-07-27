/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt');

const { findUser, validatePassword } = require("../helpers");

module.exports = (db) => {

  router.post("/", (req, res) => {

    console.log("inside login route:", req.body);

    db.query(`SELECT * FROM users;`)
      .then(data => {
        const users = data.rows;
        const checkUser = findUser(req.body.email, users);
        if (checkUser) {
          console.log("CU", checkUser);
          res.set("userValidated", "true"); // if found user set Header

          const emailPasswordCheck = validatePassword(checkUser, req.body.email, req.body.password);
          console.log("CP", emailPasswordCheck);

          if (emailPasswordCheck) {
            // let userID = checkUser.id;
            // console.log(users);
            console.log("password checked and matches");

            req.session.user_id = checkUser.id;
            res.set("passwordValidated", "true");
            res.end();
          } else { // if user exists but password doesnt match
            res.set("passwordValidated", "nope");
            console.log("PV HDR", res.get("passwordValidated"));
            res.end();

          }
        } else {
          res.set("userValidated", "nope");

        }

        res.send();


      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      })
  });

  return router;
};

