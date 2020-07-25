const { Pool } = require('pg');

const pool = new Pool({
  user: 'labber',
  password: 'labber',
  host: 'localhost',
  database: 'midterm'
});
const queryString = `
INSERT INTO users (username, password, email, name)
Values ('bwentwortho', 'password', 'bwentwortho@so-net.ne.jp', 'Biron Wentworth');
`;
const queryParams = [];

pool.query(queryString, queryParams)
.then(res => {
  const expectedResult = res.rows[0]
  console.log(expectedResult);
  pool.end();
});