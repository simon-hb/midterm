const express = require('express');
const router = express.Router();

const format = require('pg-format');


const { generateRandomString, findUserByCookieID } = require('../helpers');
const { response } = require('express');


module.exports = (db) => {

  let users = [];
  db.query(`SELECT * FROM users;`)
    .then(data => {
      users = data.rows;
    })
    .catch(err => {
      console.log("Error in Quiz Route getting users:", err)
    })



  // GET - /quiz/new (for create new quiz page)
  router.get("/new", (req, res) => {
    // when user accesses this page, we need to render
    // createNewQuiz.ejs ??
    const cookieUserId = req.session.user_id;
    const checkUser = findUserByCookieID(cookieUserId, users);
    const templateVars = {
      user: checkUser
    }
    res.render("makeQuiz", templateVars);
  });

  // // GET - /quiz/generated_random_url (to take quiz)
  router.get("/:url", (req, res) => {

    const templateVars = {
      user: false,
      quiz: {},
      questions: {},
      options: {}
    };


    // check if user signed in  
    // check if quiz is published
    // if signed in activate quiz, otherwise disabled
    // if user owns it - add edit quiz button ejs

    const queryString = `
    SELECT quizzes.*, subjects.name AS subject, levels.name AS level, toughness_options.name AS toughness
    FROM quizzes
    JOIN subjects ON subjects.id = quizzes.subject_id
    JOIN levels ON levels.id = quizzes.level_id
    JOIN toughness_options ON toughness_options.id = quizzes.toughness_id
    WHERE quizzes.url = $1;
    `;

    const queryParams = [req.params.url];
    const checkUser = findUserByCookieID(req.session.user_id, users);

    db.query(queryString, queryParams)
      .then(quizData => {
        templateVars.quiz = quizData.rows;

        templateVars.user = checkUser;

      }).then(result => {
        const queryString = `
          SELECT quiz_questions.*
          FROM quizzes
          JOIN quiz_questions ON quizzes.id = quiz_questions.quiz_id
          WHERE quizzes.url = $1;
          `;

        const queryParams = [req.params.url];

        db.query(queryString, queryParams)
          .then(questionsData => {
            templateVars.questions = questionsData.rows;
          })
          .then(result => {

            const queryString = `
          SELECT question_options.id, question_options.quiz_question_id, question_options.answer, question_options.option_order
          FROM quizzes
          JOIN quiz_questions ON quizzes.id = quiz_questions.quiz_id
          JOIN question_options ON quiz_questions.id = question_options.quiz_question_id
          JOIN subjects ON subjects.id = quizzes.subject_id
          JOIN levels ON levels.id = quizzes.level_id
          JOIN toughness_options ON toughness_options.id = quizzes.toughness_id
          WHERE quizzes.url = $1;
          `;

            const queryParams = [req.params.url];

            db.query(queryString, queryParams)
              .then(optionsData => {
                templateVars.options = optionsData.rows;
                res.render("takeQuiz", templateVars);
              })

          })

      })
      .catch((err) => console.log(err));
  })

  // GET /quiz -  all public quiz
  router.get("/", (req, res) => {
    // all public quizzes (is_published === true, is_private === false)
    // make a query to db
    //return result as json
    db.query(` 
          SELECT quizzes.*, SUM(is_like::int) AS rating
          FROM likes
          RIGHT JOIN quizzes ON quizzes.id = likes.quiz_id
          WHERE is_private = false
          AND is_published = true
          GROUP BY quizzes.id
          ORDER BY SUM(is_like::int) DESC
    `)
      .then(data => {
        quizzes = data.rows;
        const cookieUserId = req.session.user_id;
        const checkUser = findUserByCookieID(cookieUserId, users);

        const templateVars = {
          user: checkUser,
          quizzes: quizzes,
          host: req.get('host')
        }
        res.render("quiz", templateVars);
      })
      .catch(err => {
        console.log("Error in Quiz Route Getting published quizzes:", err)
      })

  }); // GET /



  // POST - /quiz/generated_random_url (to submit answers)
  // on submit 
  router.post("/:url", (req, res) => {

    const url = req.params.url;

    const submissionDetails = req.body.userSubmission;

    let attempts;
    let submissionResult = {};
    db.query(`SELECT COUNT(*) FROM quiz_responses
    WHERE taken_by_id = $1
    AND quiz_id = $2;
    `, [submissionDetails[0].userId, submissionDetails[0].quizId])
      .then(data => {
        attempts = Number(data.rows[0].count);
        thisAttempt = attempts + 1;
      }).then(() => {
        const testLink = `http://${req.get('host')}/user${submissionDetails[0].userId}/quiz${submissionDetails[0].quizId}`;
        const queryString = `
          INSERT INTO quiz_responses (quiz_id, taken_by_id, attempt_number, share_link)
          VALUES ($1, $2, $3,$4) RETURNING id;
        `;
        const queryParams = [submissionDetails[0].quizId, submissionDetails[0].userId, thisAttempt, testLink]
        // NOTETOKAUSH : ADD A .then() here for cleaner promise tree and to avoid to nested db requests


        db.query(queryString, queryParams)
          .then(data => {
            const responseId = data.rows[0].id;
            const allSubmissions = [];
            for (submission of submissionDetails) {
              allSubmissions.push([responseId, submission.optionId])
            }

            const queryString = format(`INSERT INTO response_answers (quiz_response_id, answer_id)
          Values %L RETURNING *`, allSubmissions);
            db.query(queryString)
              .then((data) => {
                const correctAnswers = `
            (SELECT question_options.answer, question_options.id AS qo_id, quiz_questions.id AS q_id
            FROM question_options
            JOIN quiz_questions ON quiz_questions.id = quiz_question_id
            JOIN quizzes ON quizzes.id = quiz_questions.quiz_id
            JOIN quiz_responses ON quizzes.id = quiz_responses.quiz_id
            WHERE question_options.is_correct = true
            AND quiz_responses.id = $1
            ORDER BY quiz_questions.question_number)
            `;

                const selectedAnswers = `
            (SELECT quiz_responses.taken_by_id AS taker_id, response_answers.quiz_response_id, quizzes.name, quiz_questions.question_number, question_options.option_order AS selected_option, question_options.answer AS selected_answer, question_options.is_correct, quiz_questions.id, quiz_responses.share_link
            FROM response_answers
            JOIN quiz_responses ON quiz_responses.id = response_answers.quiz_response_id
            JOIN question_options ON question_options.id = response_answers.answer_id
            JOIN quiz_questions ON quiz_questions.id = question_options.quiz_question_id
            JOIN quizzes ON quizzes.id = quiz_questions.quiz_id
            WHERE quiz_response_id = $1
            ORDER BY quiz_questions.question_number)
            `
                const queryString = `
            SELECT sa.*, ca.qo_id
            FROM ${selectedAnswers} sa
            LEFT JOIN ${correctAnswers} ca
            ON sa.id=ca.q_id
            `

                db.query(queryString, [data.rows[0].quiz_response_id])
                  .then((data) => {
                    submissionResult = data.rows;

                  }).then(() => {

                    const queryString = `
                    SELECT COUNT(*)
                    FROM quiz_questions
                    WHERE quiz_id = $1
                    `;
                    const queryParams = [submissionDetails[0].quizId]

                    db.query(queryString, queryParams)
                      .then((data) => {
                        const totalQ = data.rows[0].count;
                        submissionResult.totalQuestions = totalQ;
                        res.json({ submissionResult, totalQ })
                      })
                  })
              })
          })



      })
      .catch(err => {
        console.log("Error in Quiz Route getting users:", err)
      });







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

