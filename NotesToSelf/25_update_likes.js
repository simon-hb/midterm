const { Pool } = require('pg');

const pool = new Pool({
  user: 'labber',
  password: 'labber',
  host: 'localhost',
  database: 'midterm'
});
const queryString = `
UPDATE likes
SET is_like = true
WHERE quiz_id = 1
AND user_id = 6;
`;

const queryParams = [];

//successfully updates likes. check by running node 11 before and after running this file. and looking at 07_likes in seeds line 6

pool.query(queryString, queryParams)
.then(res => {
  const expectedResult = res.rows[0]
  console.log(expectedResult);
  pool.end();
});