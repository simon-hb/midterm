const { Pool } = require('pg');

const pool = new Pool({
  user: 'labber',
  password: 'labber',
  host: 'localhost',
  database: 'midterm'
});
const queryString = `
INSERT INTO quizzes (creator_id, name, image_url, description, is_private, is_published, url, subject, level, toughness)
Values (9, 'Parry''s Clover', 'http://dummyimage.com/176x135.png/ff4444/ffffff', 'Ut at dolor quis odio consequat varius. Integer ac leo.', false, true, '95Mp2w', 'Math', 'Elementary', 'Easy');
`;
const queryParams = [];

pool.query(queryString, queryParams)
.then(res => {
  const expectedResult = res.rows[0]
  console.log(expectedResult);
  pool.end();
});