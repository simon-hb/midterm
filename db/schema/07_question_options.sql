DROP TABLE IF EXISTS question_options CASCADE;
CREATE TABLE question_options (
  id SERIAL PRIMARY KEY NOT NULL,
  quiz_question_id INTEGER NOT NULL REFERENCES quiz_questions(id) ON DELETE CASCADE,
  answer TEXT NOT NULL,
  option_order SMALLINT NOT NULL,
  is_correct BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);