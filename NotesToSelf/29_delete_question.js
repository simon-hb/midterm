const { Pool } = require('pg');

const pool = new Pool({
  user: 'labber',
  password: 'labber',
  host: 'localhost',
  database: 'midterm'
});
const queryString = `
DELETE FROM quiz_questions
WHERE quiz_id = 1
AND question_number = 5;
`;

const queryParams = [];

//successfully deletes question. does not console log anything. test by running SELECT COUNT(*) FROM quiz_questions WHERE quiz_id = 1; in psql before and after

pool.query(queryString, queryParams)
.then(res => {
  const expectedResult = res.rows[0]
  console.log(expectedResult);
  pool.end();
});