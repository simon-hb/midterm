const { Pool } = require('pg');

const pool = new Pool({
  user: 'labber',
  password: 'labber',
  host: 'localhost',
  database: 'midterm'
});
const queryString = `
INSERT INTO likes (quiz_id, user_id, is_like, is_dislike)
VALUES (11, 1, false, false);
`;

const queryParams = [];

//successfully adds row to likes_table. check by running SELECT COUNT(*) FROM likes WHERE quiz_id = 11; in psql before and after running this file. does not console log anything. a row should be added each time a user finishes a quiz

pool.query(queryString, queryParams)
.then(res => {
  const expectedResult = res.rows[0]
  console.log(expectedResult);
  pool.end();
});