const { Pool } = require('pg');

const pool = new Pool({
  user: 'labber',
  password: 'labber',
  host: 'localhost',
  database: 'midterm'
});
const queryString = `
SELECT COUNT(*) AS attempts
FROM quiz_responses
WHERE quiz_id = 1
AND taken_by_id = 1;
`;
const queryParams = [];

pool.query(queryString, queryParams)
.then(res => {
  const expectedResult = res.rows[0];
  console.log(expectedResult);
  pool.end();
});