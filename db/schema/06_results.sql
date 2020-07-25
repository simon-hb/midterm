DROP TABLE IF EXISTS results CASCADE;
CREATE TABLE results (
  id SERIAL PRIMARY KEY NOT NULL,
  taker_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  quiz_id INTEGER NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  date_taken DATE NOT NULL,
  share_link VARCHAR(255) NOT NULL,
  result VARCHAR(255) NOT NULL,
  description TEXT NOT NULL
);