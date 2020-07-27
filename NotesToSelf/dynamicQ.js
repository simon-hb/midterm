// //TEMPLATE
const { Pool } = require('pg');

const pool = new Pool({
  user: 'labber',
  password: 'labber',
  host: 'localhost',
  database: 'midterm'
});
const queryString = ``;
const queryParams = [];

pool.query(queryString, queryParams)
.then(res => {
  const expectedResult = res.rows;
  console.log(expectedResult);
   pool.end();
});

const { Pool } = require('pg');

const pool = new Pool({
  user: 'labber',
  password: 'labber',
  host: 'localhost',
  database: 'midterm'
});




const takerId = 1;
const quizId = 1;

let dynObj = {};

  pool.query('SELECT COUNT(*) from trivia_questions where quiz_id = $1', [quizId])
  .then(res => {
   const questionsForQuiz =  res.rows[0].count;
   console.log(questionsForQuiz);
    dynObj.questionsForQuiz = questionsForQuiz;
    return dynObj;
  }).then( dynObj => {
    return pool.query(`SELECT quiz_id, taker_id, question_id, is_correct, answer_selected 
      FROM quiz_question_submissions
      WHERE taker_id = $1 AND quiz_id = $2;`, [takerId, quizId])
  }).then(res => {
    const totalRowsForUser = res.rows.length;
    console.log("HERE",totalRowsForUser);
    dynObj.totalRowsForUser = totalRowsForUser;
    console.log( dynObj);
    pool.end();
  }).catch(err => console.log(err));


// const queryString = `
// SELECT sum(is_correct::int) as SUM FROM (
//   SELECT quiz_id, taker_id, question_id, is_correct, answer_selected 
//   FROM quiz_question_submissions
//   WHERE taker_id = 1 AND quiz_id = 1 
//   LIMIT (SELECT COUNT(*) from trivia_questions where quiz_id = 1) 
// ) as nested;`

// pool.query(queryString)
//   .then(res => {
//     const quizResult = res.rows[0].sum;
//     let dynObj = {};
//     dynObj.result = quizResult;
//     return dynObj;
//   }).then(dynObj => {
//     console.log("DIS YOUR OBJ", dynObj);
//     const insertQuery = `
//         INSERT INTO results (taker_id, quiz_id, attempt_id, date_taken, share_link, result, description)
//         VALUES (1, 1, 1, '2020-07-25', 'https://google.com', $1, 'you did well... kinda!') RETURNING *;
//     `;
//     const queryParams = [dynObj.result];
//     return pool.query(insertQuery, queryParams);
//   }).then(res => {
//     console.log(res.rows);
//     pool.end();
//   }).catch(err => console.log(err));

//   Calculate attempts
//   generate share link
//   generate description
// new line