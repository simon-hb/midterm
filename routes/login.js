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

          const emailPasswordCheck = validatePassword(checkUser, req.body.email, req.body.password);
          console.log("CP", emailPasswordCheck);

          if (emailPasswordCheck) {
            // let userID = checkUser.id;
            // console.log(users);
            req.session.user_id = checkUser.id;
            res.set("userValidated", "true");
            res.end();
          }
        } else {
          res.set("userValidated", "nope");
          res.end();
          
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

