const { Pool } = require('pg');

const pool = new Pool({
  user: 'labber',
  password: 'labber',
  host: 'localhost',
  database: 'midterm'
});
const queryString = `
SELECT quiz_responses.taken_by_id AS taker_id, response_answers.quiz_response_id, quizzes.name, quiz_questions.question_number, question_options.option_order AS selected_option, question_options.answer AS selected_answer
FROM response_answers
JOIN quiz_responses ON quiz_responses.id = response_answers.quiz_response_id
JOIN question_options ON question_options.id = response_answers.answer_id
JOIN quiz_questions ON quiz_questions.id = question_options.quiz_question_id
JOIN quizzes ON quizzes.id = quiz_questions.quiz_id
WHERE quiz_response_id = 2
ORDER BY quiz_questions.question_number;
`;
const queryParams = [];

pool.query(queryString, queryParams)
.then(res => {
  const expectedResult = res.rows;
  console.log(expectedResult);
  pool.end();
});