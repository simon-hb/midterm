const { Pool } = require('pg');

const pool = new Pool({
  user: 'labber',
  password: 'labber',
  host: 'localhost',
  database: 'midterm'
});
const queryString = `
UPDATE likes
SET is_like = false
WHERE quiz_id = 1
AND user_id = 6;
`;

const queryParams = [];

//successfully updates is_dislike. check by running SELECT is_dislike FROM likes WHERE quiz_id = 1 AND user_id = 7; in psql before and after running this file. and looking at 07_likes in seeds line 7

pool.query(queryString, queryParams)
.then(res => {
  const expectedResult = res.rows[0]
  console.log(expectedResult);
  pool.end();
});