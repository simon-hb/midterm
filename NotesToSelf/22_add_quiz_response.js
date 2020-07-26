const { Pool } = require('pg');

const pool = new Pool({
  user: 'labber',
  password: 'labber',
  host: 'localhost',
  database: 'midterm'
});
const queryString = `
INSERT INTO quiz_responses (quiz_id, taken_by_id, attempt_number, started_at, ended_at, is_complete, share_link)
VALUES (1, 9, 6, '2020-07-25 05:28:43', '2020-07-25 05:54:08', false, 'TESTLINK');
`;

const queryParams = [];

//this will successfully insert another option to question but does not console.log anything. test with SELECT * FROM quiz_responses WHERE id = 101;. end_date should be default null

pool.query(queryString, queryParams)
.then(res => {
  const expectedResult = res.rows[0]
  console.log(expectedResult);
  pool.end();
});