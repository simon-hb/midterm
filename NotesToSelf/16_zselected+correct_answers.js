const { Pool } = require('pg');

const pool = new Pool({
  user: 'labber',
  password: 'labber',
  host: 'localhost',
  database: 'midterm'
});
const correctAnswers = `
(SELECT question_options.answer, question_options.id AS qo_id, quiz_questions.id AS q_id
FROM question_options
JOIN quiz_questions ON quiz_questions.id = quiz_question_id
JOIN quizzes ON quizzes.id = quiz_questions.quiz_id
JOIN quiz_responses ON quizzes.id = quiz_responses.quiz_id
WHERE question_options.is_correct = true
AND quiz_responses.id = 2
ORDER BY quiz_questions.question_number)
`;

const selectedAnswers = `
(SELECT quiz_responses.taken_by_id AS taker_id, response_answers.quiz_response_id, quizzes.name, quiz_questions.question_number, question_options.option_order AS selected_option, question_options.answer AS selected_answer, question_options.is_correct, quiz_questions.id
FROM response_answers
JOIN quiz_responses ON quiz_responses.id = response_answers.quiz_response_id
JOIN question_options ON question_options.id = response_answers.answer_id
JOIN quiz_questions ON quiz_questions.id = question_options.quiz_question_id
JOIN quizzes ON quizzes.id = quiz_questions.quiz_id
WHERE quiz_response_id = 2
ORDER BY quiz_questions.question_number)
`

const queryString = `
SELECT sa.*, ca.qo_id FROM ${selectedAnswers} sa
LEFT JOIN ${correctAnswers} ca
ON sa.id=ca.q_id
`
const queryParams = [];

pool.query(queryString, queryParams)
.then(res => {
  const expectedResult = res.rows;
  console.log(expectedResult);
  pool.end();
});