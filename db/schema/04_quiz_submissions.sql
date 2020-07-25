DROP TABLE IF EXISTS quiz_question_submissions CASCADE;
CREATE TABLE quiz_question_submissions (
  id SERIAL PRIMARY KEY NOT NULL,
  quiz_id INTEGER NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  taker_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  question_id INTEGER NOT NULL REFERENCES trivia_questions(id) ON DELETE CASCADE,
  answer_selected TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL
);