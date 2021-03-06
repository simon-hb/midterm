DROP TABLE IF EXISTS quizzes CASCADE;
CREATE TABLE quizzes (
  id SERIAL PRIMARY KEY NOT NULL,
  created_by_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  image_url VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  is_private BOOLEAN NOT NULL DEFAULT false,
  is_published BOOLEAN NOT NULL DEFAULT false,
  url VARCHAR(255) NOT NULL,
  subject_id INTEGER NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  level_id INTEGER NOT NULL REFERENCES levels(id) ON DELETE CASCADE,
  toughness_id INTEGER NOT NULL REFERENCES toughness_options(id) ON DELETE CASCADE,
  revision INTEGER,
  previous_version_id INTEGER,
  type VARCHAR(255),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);