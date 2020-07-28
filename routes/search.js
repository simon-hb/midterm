/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router = express.Router();

module.exports = (db) => {
  router.post("/", (req, res) => {
    console.log("REQ BODY",req.body);

    const queryString = ``;
    const queryParams = [];

    

    // extract req.body into its su-elements i.e, quizName, subject, level, toughness

    
    //send query to db, get data
    //send recvd data to ajax post as JSON
    //on ajax, update home based on data recvd as below
    // res.json(resultObj);
  });

  return router;
};

