/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router = express.Router();

const { findUser, htmlDecode } = require("../helpers");

module.exports = (db) => {
  router.post("/", (req, res) => {
    console.log("inside register route:", req.body);

    db.query(`SELECT * FROM users;`)
      .then(data => {
        const users = data.rows;
        const checkUser = findUser(req.body.email, users);
        req.body.canRegister = false;
        if (!checkUser) {
          console.log("do REGISTRATION HERE");
          // res.redirect("/");
          // const canRegister = true;
          req.body.canRegister = true;
          // return canRegister;

        }

        return req.body;
      }).then(bodyObject => {
        console.log("BODY", bodyObject);
        const canRegister = bodyObject.canRegister;
        
        const emailStr = htmlDecode(bodyObject.email);
        if (canRegister) {

          const queryParams = [bodyObject.username,bodyObject.password, emailStr, bodyObject.name]
          db.query(`
            insert into users (username, password, email, name) values ($1, $2, $3, $4) RETURNING *;
            `, queryParams).then(data => {
            console.log(data.rows[0]);
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