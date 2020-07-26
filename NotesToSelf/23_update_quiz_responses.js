const { Pool } = require('pg');

const pool = new Pool({
  user: 'labber',
  password: 'labber',
  host: 'localhost',
  database: 'midterm'
});
const queryString = `
UPDATE quiz_responses
SET attempt_number = 7, ended_at = NOW(), is_complete = true
WHERE id = 101;
`;

const queryParams = [];

//successfully updates quiz_response. but doesn't log. Check with: SELECT * FROM quiz_responses WHERE id = 101; need to make id, attempt_number dynamic. Don't need to update share_link since it will be generated but hidden. will show when quiz complete.

pool.query(queryString, queryParams)
.then(res => {
  const expectedResult = res.rows[0]
  console.log(expectedResult);
  pool.end();
});