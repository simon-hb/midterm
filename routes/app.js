/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {

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
        //send recvd data to ajax post as JSON
        res.json(expectedResult)
      })
      .catch((err) => console.log(err));
    //on ajax, update home based on data recvd as below
    // res.json(resultObj);
  });
  return router;
};
