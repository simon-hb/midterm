const { Pool } = require('pg');

const pool = new Pool({
  user: 'labber',
  password: 'labber',
  host: 'localhost',
  database: 'midterm'
});
const queryString = `
INSERT INTO question_options (quiz_question_id, answer, option_order, is_correct)
VALUES (100, 'E', 5, 'false');
`;

const queryParams = [];

//this will successfully insert another option to question but does not console.log anything

pool.query(queryString, queryParams)
.then(res => {
  const expectedResult = res.rows[0]
  console.log(expectedResult);
  pool.end();
});