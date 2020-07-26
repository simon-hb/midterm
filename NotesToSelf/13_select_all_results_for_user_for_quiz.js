const { Pool } = require('pg');

const pool = new Pool({
  user: 'labber',
  password: 'labber',
  host: 'localhost',
  database: 'midterm'
});
const queryString = `
SELECT id, taken_by_id, quiz_id, (ended_at - started_at) AS duration, is_complete
FROM quiz_responses
WHERE taken_by_id = 1
AND quiz_id = 1;
`;
const queryParams = [];

pool.query(queryString, queryParams)
.then(res => {
  const expectedResult = res.rows;
  console.log(expectedResult);
  pool.end();
});

// tried to show score in this as well but struggled. code below doesn't work
// SELECT quiz_responses.id, quiz_responses.taken_by_id, quiz_responses.quiz_id, quiz_responses.(ended_at - started_at) AS duration, is_complete, SELECT COUNT(response_answers.*) AS score
// FROM quiz_responses
// JOIN response_answers ON quiz_responses.id = response_answers.quiz_response_id
// JOIN question_options ON question_options.id = response_answers.answer_id
// WHERE taken_by_id = 1
// AND quiz_id = 1
// AND question_options.is_correct = true;