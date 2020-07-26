const { Pool } = require('pg');

const pool = new Pool({
  user: 'labber',
  password: 'labber',
  host: 'localhost',
  database: 'midterm'
});
const queryString = `
SELECT COUNT(response_answers.*) AS score
FROM response_answers
JOIN question_options ON question_options.id = answer_id
WHERE question_options.is_correct = true
AND quiz_response_id = 1;
`;
const queryParams = [];

pool.query(queryString, queryParams)
.then(res => {
  const expectedResult = res.rows[0];
  console.log(expectedResult);
  pool.end();
});