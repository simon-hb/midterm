const { Pool } = require('pg');

const pool = new Pool({
  user: 'labber',
  password: 'labber',
  host: 'localhost',
  database: 'midterm'
});
const queryString = `
DELETE FROM question_options
WHERE quiz_id = 1
AND quiz_question_id = 1
AND id = 1;
`;

const queryParams = [];

//successfully deletes question_option. does not console log anything. test by running SELECT COUNT(*) FROM question_options WHERE quiz_id = 1 AND quiz_question_id = 1; in psql before and after.
//seed file for question_option question_id should increment 1, 1, 1, 1, 2, ... 100, 100, 100, 100

pool.query(queryString, queryParams)
.then(res => {
  const expectedResult = res.rows[0]
  console.log(expectedResult);
  pool.end();
});