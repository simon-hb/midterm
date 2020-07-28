const express = require('express');
const router = express.Router();


const { generateRandomString, findUserByCookieID } = require('../helpers')




module.exports = (db) => {

  let users = [];
  console.log("USERS INIT", users);

  db.query(`SELECT * FROM users;`)
    .then(data => {
      users = data.rows;
    })
    .catch(err => {
      console.log("Error in Quiz Route:",err)
    })

  // GET /quiz -  all public quiz
  router.get("/", (req, res) => {
    // all public quizzes (is_published === true, is_private === false)
    // make a query to db
    //return result as json


    const queryString = `
    SELECT *
    FROM quizzes
    JOIN likes ON quizzes.id = likes.quiz_id
    WHERE is_private = false
    AND is_published = true;
    ORDER BY (SUM(likes.is_like::int) DESC
    `;

    const cookieUserId = req.session.user_id;
    const checkUser = findUserByCookieID(cookieUserId, users);

    db.query(queryString)
      .then(result => {
        const quizzes = result.rows;
        // console.log(quizzes)
        const templateVars = {
          user: checkUser,
          quizzes: quizzes
        }
        console.log("SENDING TO TV", templateVars)
        res.render("quiz.ejs", templateVars);
      })
      .catch((err) => console.log(err));

  });







  // GET - /quiz/generated_random_url (to take quiz)
  router.get("/:url", (req, res) => {

    // check if user signed in
    // check if quiz is published
    // if signed in activate quiz, otherwise disabled
    // if user owns it - add edit quiz button ejs

    const queryString = `
    SELECT *
    FROM quizzes
    WHERE url = $1
    `;
    const url = req.params.url;

    db.query(queryString, [url])
      .then(res => {
        const quiz = res.rows[0];
        const checkUser = findUserByCookieID(req.session.user_id, users);

        const templatVars = {
          user: checkUser,
          quiz: quiz
        }
        res.render("quiz.ejs", templateVars);
      })
      .catch((err) => console.log(err));
  })

  // GET - /quiz/new (for create new quiz page)
  router.get("/new", (req, res) => {
    // when user accesses this page, we need to render
    // createNewQuiz.ejs ??
    const cookieUserId = req.session.user_id;
    db.query(`SELECT * FROM users;`)
      .then(data => {
        const users = data.rows;
        const checkUser = findUserByCookieID(req.session.user_id, users);
        res.render("createQuiz", checkUser);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      })
  });



  // POST - /quiz/generated_random_url (to submit answers)
  // on submit 
  router.post("/:url", (req, res) => {
    const url = req.params.url;
    const queryParams = []
    //create quiz response
    // then create response answer, each time they finish an answer
    //when done, update quiz response, is_complete to true, ended_at = now(), reveal share_link, reveal score, message?
  })


  // POST - /quiz/new (to submit quiz)
  router.post("/new", (req, res) => {
    //extract req.body to get the user object of user logged in
    const loggedInUser = req.body.loggedInUser;
    if (loggedInUser) {
      // extract req.body to get details of new quiz
      // find out whether user is trying to submit and publish or save as draft


      // if submitting
      // allow them to post using sql query
      // generaterandomstring using function for their new url
      // make post request /randomstring
      // querystring add quiz, all the other steps below 

      /*
      queryParam = [];
      queryString = `
      INSERT INTO quizzes (created_by_id, name, image_url, description, is_private, is_published, url, subject_id, level_id, toughness_id, revision, previous_version_id, type)
      VALUES ($1, $2, 'https://place-hold.it/350x150', '$4', $5, $6, 'generaterandomstring', $7, $8, $9, null, null, null);
      `

      query param. push ..... all the values using req.body somehow

      db.query (queryString, queryParam)
      .then(result => {
        ....
      })
      */

      // we'll be adding a new quiz to the quiz table, (steps above), similar process for questions and question option
      // ()
      // then we need add to the quiz questions table
      // then we need to add the the question options table
    }
  })



  return router;
} // module exports
