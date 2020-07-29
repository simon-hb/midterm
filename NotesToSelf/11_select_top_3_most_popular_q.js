const { Pool } = require('pg');

const pool = new Pool({
  user: 'labber',
  password: 'labber',
  host: 'localhost',
  database: 'midterm'
});
const queryString = `
SELECT quiz_id, (SUM(is_like::int) - SUM((NOT is_like)::int)) AS rating
FROM likes
GROUP BY quiz_id
ORDER BY SUM(is_like::int) DESC
LIMIT 3;
`;
const queryParams = [];

pool.query(queryString, queryParams)
.then(res => {
  const expectedResult = res.rows;
  console.log(expectedResult);
  pool.end();
});