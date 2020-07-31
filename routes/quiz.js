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

  // POST - /quiz/new (to submit quiz)
  router.post("/new", (req, res) => {

    const loggedInUser = req.session.user_id;
    const basicFormData = req.body.serialized;
    let quizLink = "";

    queryParams = [];
    queryString = `
      INSERT INTO quizzes (created_by_id, name, image_url, description, is_private, is_published, url, subject_id, level_id, toughness_id, revision, previous_version_id, type)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING id;
      `
    const created_by_id = loggedInUser;
    queryParams.push(created_by_id);

    const name = basicFormData.quizname;
    queryParams.push(name);

    const image_url = basicFormData.image_url;
    queryParams.push(image_url);

    const description = basicFormData.quizdescription;
    queryParams.push(description);

    const is_private = basicFormData.is_private;
    queryParams.push(is_private);

    const is_published = basicFormData.is_published;
    queryParams.push(is_published);

    const url = generateRandomString();
    queryParams.push(url);
    quizLink = `http://${req.get('host')}/quiz/${url}`


    const subject_id = basicFormData.subject;
    queryParams.push(subject_id);

    const level_id = basicFormData.level
    queryParams.push(level_id);

    const toughness_id = basicFormData.toughness;
    queryParams.push(toughness_id);

    const revision = null;
    queryParams.push(revision);

    const previous_version_id = null;
    queryParams.push(previous_version_id);

    const type = null;
    queryParams.push(type);

    db.query(queryString, queryParams)
      .then(result => {
        console.log("quiz id", result.rows);

        const quiz_questions = [];
        let i = 1;
        for (oneQuestion of req.body.questions) {
          const question = [];

          const quiz_id = result.rows[0].id;
          question.push(quiz_id);

          question.push(i); //question number

          const question_name = oneQuestion.title
          question.push(question_name);  //question

          const questionType = "Multiple Choice"
          question.push(questionType);


          quiz_questions.push(question)
          i++;
        }
        const queryString = format(`INSERT INTO quiz_questions (quiz_id, question_number, question, question_type)
          Values %L RETURNING id`, quiz_questions);


        db.query(queryString).then(result => {
          console.log("quiz question ids", result.rows)
          // const questionIds = result.rows;

          const allOptions = [];

          for (question of req.body.questions) {


            let j = 0;

            const optionsOrder = [];
            while (optionsOrder.length < question.options.length) {
              let r = Math.floor(Math.random() * question.options.length) + 1;
              if (optionsOrder.indexOf(r) === -1) optionsOrder.push(r);
            }
            for (option of question.options) {

              let oneOption = [];
              const quiz_question_id = result.rows[0].id;
              oneOption.push(quiz_question_id);

              const answer = option;
              oneOption.push(answer);

              option_order = optionsOrder[j];
              oneOption.push(option_order);

              j === 0 ? is_correct = true : is_correct = false;
              oneOption.push(is_correct);

              allOptions.push(oneOption);
              j++;
            }
          }

          console.log("ALL OPTIONS", allOptions)
          const queryString = format(`INSERT INTO question_options (quiz_question_id, answer, option_order, is_correct)
          Values %L RETURNING *`, allOptions);

          db.query(queryString).then(result => {
            console.log("question options", result.rows);

            const err = false;
            const responseObject = { err, quizLink, name }
            res.json(responseObject);

          })
        })

      }).catch(err => {
        console.log("Error adding quiz with questions and options to DB", err);

        const quizLink = "";
        const name = "";
        const responseObject = { err, quizLink, name }
        res.json(responseObject)
      })

    // we'll be adding a new quiz to the quiz table, (steps above), similar process for questions and question option
    // ()
    // then we need add to the quiz questions table
    // then we need to add the the question options table
  })

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
        const testLink = `http://${req.get('host')}/user/${submissionDetails[0].username}/quiz/${submissionDetails[0].quizId}`;
        const queryString = `
          INSERT INTO quiz_responses (quiz_id, taken_by_id, attempt_number, share_link)
          VALUES ($1, $2, $3,$4) RETURNING id;
        `;
        const queryParams = [submissionDetails[0].quizId, submissionDetails[0].userId, thisAttempt, testLink]
       

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
                        err = false
                        const totalQ = data.rows[0].count;
                        submissionResult.totalQuestions = totalQ;
                        res.json({ submissionResult, totalQ, testLink, err })
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



  return router;
} // module exports

