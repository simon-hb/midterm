const { Pool } = require('pg');

const pool = new Pool({
  user: 'labber',
  password: 'labber',
  host: 'localhost',
  database: 'midterm'
});
const queryString = `
INSERT INTO quizzes (created_by_id, name, image_url, description, is_private, is_published, url, subject_id, level_id, toughness_id, revision, previous_version_id, type)
VALUES (2, 'TEST QUIZ', 'http://dummyimage.com/183x114.jpg/5fa2dd/ffffff', 'TEST QUIZ TEST QUIZ TEST QUIZ TEST QUIZ', true, true, '83Bx5b', 1, 1, 1, null, null, null);
`;
const queryParams = [];

//this will successfully insert another quiz but does not console.log anything

pool.query(queryString, queryParams)
.then(res => {
  const expectedResult = res.rows[0]
  console.log(expectedResult);
  pool.end();
});
