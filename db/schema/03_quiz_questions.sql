DROP TABLE IF EXISTS quiz_questions CASCADE;
CREATE TABLE trivia_questions (
  id SERIAL PRIMARY KEY NOT NULL,
  quiz_id INTEGER NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  question_number SMALLINT NOT NULL,
  question TEXT NOT NULL,
  question_type VARCHAR(255) NOT NULL
);