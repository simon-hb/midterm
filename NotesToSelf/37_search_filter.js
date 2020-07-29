const { Pool } = require('pg');

const pool = new Pool({
  user: 'labber',
  password: 'labber',
  host: 'localhost',
  database: 'midterm'
});

const queryParams = [];
let whereOrAnd;

const queryString = `
SELECT *, (SUM(likes.is_like::int) - SUM((NOT likes.is_like)::int)) AS rating
FROM quizzes
JOIN subjects ON subjects.id = subject_id
JOIN levels ON levels.id = level_id
JOIN toughness_options ON toughness_options.id = toughness_id
JOIN likes ON quizzes.id = likes.quiz_id
`;

if (options.subject) {
  queryParams.push(`%${options.subject}%`);
  queryString += `WHERE subjects.name LIKE $${queryParams.length} `;
}

if (options.level) {
  whereOrAnd = (queryParams.length === 0 ? 'WHERE' : 'AND');
  queryParams.push(`${options.level}`);
  queryString += `${whereOrAnd} levels.name LIKE $${queryParams.length} `
}

if (options.toughness) {
  whereOrAnd = (queryParams.length === 0 ? 'WHERE' : 'AND');
  queryParams.push(`${options.toughness}`);
  queryString += `${whereOrAnd} toughness_options.name LIKE $${queryParams.length} `
}
queryString += `
  GROUP BY quizzes.id
  `

// To be used if we can normalize rating
// if (options.rating) {
//   queryParams.push(`${options.rating}`);
//   queryString += `HAVING (SUM(likes.is_like::int) - SUM((NOT likes.is_like)::int)) >= $${queryParams.length}`
// }

queryString += `
ORDER BY ratings DESC
LIMIT 10;
`;

pool.query(queryString, queryParams)
.then(res => {
  const expectedResult = res.rows;
  console.log(expectedResult);
  pool.end();
});