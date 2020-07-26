const { Pool } = require('pg');

const pool = new Pool({
  user: 'labber',
  password: 'labber',
  host: 'localhost',
  database: 'midterm'
});
const queryString = `
SELECT quiz_responses.taken_by_id AS taker_id, response_answers.quiz_response_id, response_answers.quiz_question_id, response_answers.answer_id AS selected_answer
FROM response_answers
JOIN quiz_responses ON quiz_responses.id = quiz_response_id
WHERE quiz_response_id = 2
ORDER BY quiz_question_id;
`;
const queryParams = [];

pool.query(queryString, queryParams)
.then(res => {
  const expectedResult = res.rows;
  console.log(expectedResult);
  pool.end();
});