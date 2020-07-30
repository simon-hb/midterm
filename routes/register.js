/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router = express.Router();

const bcrypt = require("bcrypt");

const { findUser } = require("../helpers");
const { response } = require('express');

module.exports = (db) => {
  router.post("/", (req, res) => {

    db.query(`SELECT * FROM users;`)
      .then(data => {
        const users = data.rows;
        const checkUser = findUser(req.body.email, users);
        req.body.canRegister = false;
        if (!checkUser) {
          req.body.canRegister = true;
        } 

        return req.body;
      }).then(bodyObject => {

        const canRegister = bodyObject.canRegister;
        const emailStr = bodyObject.email;
        const hashedPassword = bcrypt.hashSync(bodyObject.password, 10);

        if (canRegister) {
          const queryParams = [bodyObject.username, hashedPassword, emailStr, bodyObject.name]
          db.query(`
            insert into users (username, password, email, name) values ($1, $2, $3, $4) RETURNING *;
            `, queryParams)
            .then(response => {
              const user = response.rows[0];
              req.session.user_id = user.id;
              res.redirect("/");
            })
          }
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      })
  });  // router post
  return router;
}