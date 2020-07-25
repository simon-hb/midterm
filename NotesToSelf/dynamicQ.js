const { Pool } = require('pg');

const pool = new Pool({
  user: 'labber',
  password: 'labber',
  host: 'localhost',
  database: 'midterm'
});


const queryString = `
SELECT sum(is_correct::int) as SUM FROM (
  SELECT quiz_id, taker_id, question_id, is_correct, answer_selected 
  FROM quiz_question_submissions
  WHERE taker_id = 1 AND quiz_id = 1 
  LIMIT (SELECT COUNT(*) from trivia_questions where quiz_id = 1) 
) as nested;`

pool.query(queryString)
  .then(res => {
    const quizResult = res.rows[0].sum;
    let dynObj = {};
    dynObj.result = quizResult;
    return dynObj;
  }).then(dynObj => {
    console.log("DIS YOUR OBJ", dynObj);
    const insertQuery = `
        INSERT INTO results (taker_id, quiz_id, attempt_id, date_taken, share_link, result, description)
        VALUES (1, 1, 1, '2020-07-25', 'https://google.com', $1, 'you did well... kinda!') RETURNING *;
    `;
    const queryParams = [dynObj.result];
    return pool.query(insertQuery, queryParams);
  }).then(res => {
    console.log(res.rows);
    pool.end();
  }).catch(err => console.log(err));

  // Calculate attempts
  // generate share link
  // generate description