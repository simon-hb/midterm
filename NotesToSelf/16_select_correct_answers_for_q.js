const { Pool } = require('pg');

const pool = new Pool({
  user: 'labber',
  password: 'labber',
  host: 'localhost',
  database: 'midterm'
});
const queryString = `
SELECT quizzes.name, quiz_questions.question_number, question_options.option_order, question_options.answer
FROM question_options
JOIN quiz_questions ON quiz_questions.id = quiz_question_id
JOIN quizzes ON quizzes.id = quiz_questions.quiz_id
WHERE question_options.is_correct = true
AND quizzes.id = 1
ORDER BY quiz_questions.question_number;
`;
const queryParams = [];

pool.query(queryString, queryParams)
.then(res => {
  const expectedResult = res.rows;
  console.log(expectedResult);
  pool.end();
});