const { Pool } = require('pg');

const pool = new Pool({
  user: 'labber',
  password: 'labber',
  host: 'localhost',
  database: 'midterm'
});
const queryString = `
INSERT INTO response_answers (quiz_response_id, answer_id)
Values (101, 1);
`;

const queryParams = [];

//this will successfully insert another response_answer but does not console.log anything. test with SELECT * FROM response_answers WHERE quiz_response_id = 101; but make sure to add quiz_response 101 first since seed file does not include (node query 22)

pool.query(queryString, queryParams)
.then(res => {
  const expectedResult = res.rows[0]
  console.log(expectedResult);
  pool.end();
});