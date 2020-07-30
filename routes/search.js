/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router = express.Router();

const {findUserByCookieID} = require("../helpers")

module.exports = (db) => {


  let users = [];
  db.query(`SELECT * FROM users;`)
    .then(data => {
      users = data.rows;
    })
    .catch(err => {
      console.log("Error in Quiz Route getting users:", err)
    })

  router.post("/", (req, res) => {

    console.log("REQ BODY", req.body);

    // queryParams
    const queryParams = [];
    let queryString = `
      SELECT quizzes.*, (SUM(likes.is_like::int) - SUM((NOT likes.is_like)::int)) AS rating
      FROM quizzes
      JOIN subjects ON subjects.id = subject_id
      JOIN levels ON levels.id = level_id
      JOIN toughness_options ON toughness_options.id = toughness_id
      JOIN likes ON quizzes.id = likes.quiz_id
      WHERE quizzes.is_private = false AND quizzes.is_published = true
      `;

    // extract req.body into its su-elements i.e, quizName, subject, level, toughness
    if (req.body.quizName) {
      queryParams.push(`%${req.body.quizName}%`);
      // queryString += `WHERE quizzes.name LIKE %${req.body.quizName}% `;
      queryString += `AND quizzes.name LIKE $${queryParams.length} `;
    }
    //subjects
    if (req.body.subjectSelection) {
      queryParams.push(req.body.subjectSelection);
      queryString += `AND subjects.name = ANY ($${queryParams.length}) `;
    }
    //levels
    if (req.body.levelSelection) {
      queryParams.push(req.body.levelSelection);
      queryString += `AND levels.name = ANY ($${queryParams.length}) `;

    }
    //toughness
    if (req.body.toughnessSelection) {
      queryParams.push(req.body.toughnessSelection);
      queryString += `AND toughness_options.name = ANY ($${queryParams.length}) `;
    }

    queryString += `
      GROUP BY quizzes.id
      ORDER BY rating DESC;
      `;

      
      db.query(queryString, queryParams)
      .then(result => {

        const expectedResult = result.rows;
        console.log(expectedResult)
        const checkUser = findUserByCookieID(req.session.user_id, users)
        
        // Render home with search results
          const templateVars = {
            user: checkUser,
            quizzes: expectedResult,
            host: req.get('host')
          }
          console.log(templateVars)
        res.json(expectedResult);
      })
      .catch((err) => console.log(err));
  });

  return router;
};