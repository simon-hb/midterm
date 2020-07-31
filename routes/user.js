const express = require('express');
const router = express.Router();


module.exports = (db) => {

    router.get("/:username/quiz/:quizid", (req, res) => {
    const username = req.params.username
    const quizid = req.params.quizid;
    let quiz_responseID;
    let submissionResult = {};
    let user = {};
    let userID;

    db.query(`SELECT * FROM users WHERE username = $1`, [username]).then((result) => {
      user = result.rows[0];
      userID = user.id;
    }).then(() =>{

    

    db.query(`SELECT id FROM quiz_responses
    WHERE taken_by_id = $1
    AND quiz_id = $2
    ORDER BY started_at DESC
    LIMIT 1;
    `, [userID, quizid])
      .then(data => {
        quiz_responseID = data.rows[0].id;
        console.log("QRID", quiz_responseID)

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

        db.query(queryString, [quiz_responseID])
          .then((combinedData) => {
            submissionResult = combinedData.rows;
            console.log(submissionResult)

          }).then(() => {

            const queryString = `
                    SELECT COUNT(*)
                    FROM quiz_questions
                    WHERE quiz_id = $1
                    `;
            const queryParams = [quizid]

            db.query(queryString, queryParams)
              .then((data) => {
                err = false
                const totalQ = data.rows[0].count;
                submissionResult;
                let i =0;
                for (result of submissionResult){
                  if (result.is_correct=true) i++
                }
                const questionsAnswered = submissionResult.length;
                const correctAnswers = i;
                // submissionResult.totalQuestions = totalQ;
                 user = {
                  name: user.name
                }
                const templateVars = {user, questionsAnswered, correctAnswers, totalQ, err }
                res.render("quizresult", templateVars)
              })
          })
        })
      })
          .catch(err => {
            console.log("Error in Quiz Route getting users:", err)
          })







        //create quiz response
        // then create response answer, each time they finish an answer
        //when done, update quiz response, is_complete to true, ended_at = now(), reveal share_link, reveal score, message?
  })

    return router;
  }
//share_link ejs in views. kaush will take care of that
// for scripts
// display result similar to quiz.js script
// ajax post request when user clicks on quiz link to allow them to take quiz