DROP TABLE IF EXISTS question_options CASCADE;
CREATE TABLE question_options (
  id SERIAL PRIMARY KEY NOT NULL,
  quiz_id INTEGER NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  quiz_question_id INTEGER NOT NULL REFERENCES quiz_questions(id) ON DELETE CASCADE,
  answer TEXT NOT NULL,
  option_order SMALLINT NOT NULL,
  is_correct BOOLEAN NOT NULL DEFAULT false
);