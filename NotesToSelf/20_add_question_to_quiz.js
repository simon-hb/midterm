const { Pool } = require('pg');

const pool = new Pool({
  user: 'labber',
  password: 'labber',
  host: 'localhost',
  database: 'midterm'
});
const queryString = `
INSERT INTO quiz_questions (quiz_id, question_number, question, question_type)
VALUES (20, 6, 'TEST QUESTION TEST QUESTION TEST QUESTION', 'Multiple Choice');
`;

const queryParams = [];

//this will successfully insert another quiz but does not console.log anything

pool.query(queryString, queryParams)
.then(res => {
  const expectedResult = res.rows[0]
  console.log(expectedResult);
  pool.end();
});
