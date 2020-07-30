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
    db.query(`SELECT * FROM users;`)
      .then(data => {
        const resultObject = {
          userValidated: false,
          passwordValidated: false
        };
        const users = data.rows;
        const checkUser = findUser(req.body.email, users);
        if (checkUser) {
          resultObject.userValidated = true;
          const emailPasswordCheck = validatePassword(checkUser, req.body.email, req.body.password);
          if (emailPasswordCheck) {
            req.session.user_id = checkUser.id;
            resultObject.passwordValidated = true
          }
        }
        res.json(resultObject);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      })
  });

  return router;
};

