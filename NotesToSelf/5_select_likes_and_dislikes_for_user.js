const { Pool } = require('pg');

const pool = new Pool({
  user: 'labber',
  password: 'labber',
  host: 'localhost',
  database: 'midterm'
});
const queryString = `
SELECT quiz_id, name, creator_id, SUM(is_like::int) as likes, SUM(is_dislike::int) as dislikes 
FROM quizzes
JOIN likes ON quizzes.id = quiz_id
WHERE creator_id = 3
GROUP BY name, creator_id, quiz_id
LIMIT 10;
`;
const queryParams = [];

pool.query(queryString, queryParams)
.then(res => {
  const expectedResult = res.rows;
  console.log(expectedResult);
  pool.end();
});