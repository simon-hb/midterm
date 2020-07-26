const { Pool } = require('pg');

const pool = new Pool({
  user: 'labber',
  password: 'labber',
  host: 'localhost',
  database: 'midterm'
});
const queryString = `
SELECT COUNT(response_answers.*) AS score, (quiz_responses.ended_at - quiz_responses.started_at) AS duration
FROM response_answers
JOIN question_options ON question_options.id = answer_id
JOIN quiz_responses ON quiz_responses.id = quiz_response_id
WHERE question_options.is_correct = true
AND quiz_response_id = 1
GROUP BY quiz_responses.ended_at, quiz_responses.started_at;
`;
const queryParams = [];

pool.query(queryString, queryParams)
.then(res => {
  const expectedResult = res.rows[0];
  console.log(expectedResult);
  pool.end();
});