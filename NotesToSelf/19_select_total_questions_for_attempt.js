const { Pool } = require('pg');

const pool = new Pool({
  user: 'labber',
  password: 'labber',
  host: 'localhost',
  database: 'midterm'
});
const queryString = `
SELECT COUNT(quiz_questions.*) AS total
FROM quizzes
JOIN quiz_questions ON quizzes.id = quiz_questions.quiz_id
JOIN quiz_responses ON quizzes.id = quiz_responses.quiz_id
WHERE quiz_responses.id = 1
`;
const queryParams = [];

pool.query(queryString, queryParams)
.then(res => {
  const expectedResult = res.rows[0];
  console.log(expectedResult);
  pool.end();
});