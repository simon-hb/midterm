DROP TABLE IF EXISTS trivia_questions CASCADE;
CREATE TABLE trivia_questions (
  id SERIAL PRIMARY KEY NOT NULL,
  quiz_id INTEGER NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  question_number SMALLINT NOT NULL,
  question text NOT NULL,
  correct_answer text NOT NULL,
  incorrect_answer1 text NOT NULL,
  incorrect_answer2 text NOT NULL,
  incorrect_answer3 text NOT NULL,
  is_true_false BOOLEAN NOT NULL DEFAULT false
);