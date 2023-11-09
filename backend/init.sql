
CREATE TABLE Users (
  id serial PRIMARY KEY,
  username text UNIQUE NOT NULL,
  email text UNIQUE NOT NULL
);

CREATE TABLE Lists (
  id serial PRIMARY KEY,
  name text NOT NULL,
  user_id integer,
  FOREIGN KEY(user_id) REFERENCES Users(id)
);

CREATE TABLE Tasks (
  id serial PRIMARY KEY,
  name text NOT NULL,
  list_id integer,
  FOREIGN KEY(list_id) REFERENCES Lists(id)
);

INSERT INTO Users (username, email) VALUES ('jane', 'jane@example.com');
INSERT INTO Users (username, email) VALUES ('john', 'john@example.com');

INSERT INTO Lists (name, user_id) VALUES ('Personal Tasks', 1);
INSERT INTO Lists (name, user_id) VALUES ('Work Tasks', 1);
INSERT INTO Lists (name, user_id) VALUES ('Home Chores', 2);
INSERT INTO Lists (name, user_id) VALUES ('Project Tasks', 2);

INSERT INTO Tasks (name, list_id) VALUES ('Buy groceries for the weekend', 1);
INSERT INTO Tasks (name, list_id) VALUES ('Prepare presentation for the meeting', 1);
INSERT INTO Tasks (name, list_id) VALUES ('Clean the house and do laundry', 1);
INSERT INTO Tasks (name, list_id) VALUES ('Complete the project report', 1);
