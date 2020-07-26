const { Pool } = require('pg');

const pool = new Pool({
  user: 'labber',
  password: 'labber',
  host: 'localhost',
  database: 'midterm'
});
const queryString = `
SELECT response_answers.quiz_response_id, response_answers.quiz_question_id, response_answers.answer_id, question_options.answer AS correct_answer
FROM response_answers
JOIN question_options ON question_options.id = answer_id
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