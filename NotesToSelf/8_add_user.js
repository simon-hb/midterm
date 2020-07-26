const { Pool } = require('pg');

const pool = new Pool({
  user: 'labber',
  password: 'labber',
  host: 'localhost',
  database: 'midterm'
});
const queryString = `
INSERT INTO users (username, password, email, name)
VALUES ('bwentwortho', 'password', 'bwentwortho@so-net.ne.jp', 'Biron Wentworth');
`;
const queryParams = [];

//this will successfully insert another user but does not console.log anything

pool.query(queryString, queryParams)
.then(res => {
  const expectedResult = res.rows[0]
  console.log(expectedResult);
  pool.end();
});