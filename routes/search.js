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
    console.log("REQ BODY", req.body);

    let whereOrAnd;
    const queryParams = [];
    let queryString = `
      SELECT quizzes.*, (SUM(likes.is_like::int) - SUM((NOT likes.is_like)::int)) AS rating
      FROM quizzes
      JOIN subjects ON subjects.id = subject_id
      JOIN levels ON levels.id = level_id
      JOIN toughness_options ON toughness_options.id = toughness_id
      JOIN likes ON quizzes.id = likes.quiz_id
      `;

    // extract req.body into its su-elements i.e, quizName, subject, level, toughness
    if (req.body.quizName) {
      queryParams.push(`%${req.body.quizName}%`);
      // queryString += `WHERE quizzes.name LIKE %${req.body.quizName}% `;
      queryString += `WHERE quizzes.name LIKE $${queryParams.length} `;
    }
    //subjects
    if (req.body.subjectSelection) {
      whereOrAnd = (queryParams.length === 0 ? 'WHERE' : 'AND');
      queryParams.push(req.body.subjectSelection);
      queryString += `${whereOrAnd} subjects.name = ANY ($${queryParams.length}) `;
    }
    //levels
    if (req.body.levelSelection) {
      whereOrAnd = (queryParams.length === 0 ? 'WHERE' : 'AND');
      queryParams.push(req.body.levelSelection);
      // queryString += `${whereOrAnd} levels.name IN ${levelParam} `;
      queryString += `${whereOrAnd} levels.name = ANY ($${queryParams.length}) `;

    }
    //toughness
    if (req.body.toughnessSelection) {
      whereOrAnd = (queryParams.length === 0 ? 'WHERE' : 'AND');
      queryParams.push(req.body.toughnessSelection);
      // queryString += `${whereOrAnd} toughness_options.name IN  ${toughnessParam} `;
      queryString += `${whereOrAnd} toughness_options.name = ANY ($${queryParams.length}) `;

    }



    queryString += `
      GROUP BY quizzes.id
      ORDER BY rating DESC;
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