const { Pool } = require('pg');

const pool = new Pool({
  user: 'labber',
  password: 'labber',
  host: 'localhost',
  database: 'midterm'
});
const queryString = `
SELECT users.id, quizzes.name
FROM users
JOIN quizzes on creator_id = users.id
WHERE users.id = 3;
`;
const queryParams = [];

pool.query(queryString, queryParams)
.then(res => {
  const expectedResult = res.rows;
  console.log(expectedResult);
  pool.end();
});