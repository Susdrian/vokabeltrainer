GRANT ALL PRIVILEGES ON DATABASE postgres TO nodepg;
GRANT ALL ON SCHEMA public TO nodepg;

SET ROLE nodepg;

DROP SCHEMA IF EXISTS wmc CASCADE;

CREATE SCHEMA wmc;

DROP TABLE IF EXISTS wmc.UserFlashCardStats;
DROP TABLE IF EXISTS wmc.Flashcard;
DROP TABLE IF EXISTS wmc.Access;
DROP TABLE IF EXISTS wmc.Deck;
DROP TABLE IF EXISTS wmc.fcUser;

CREATE TABLE wmc.fcUser (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    registrationDate DATE NOT NULL,
    lastLogin TIMESTAMP NOT NULL,
    deleteTag BOOLEAN DEFAULT FALSE NOT NULL
);


CREATE TABLE wmc.Deck (
    id SERIAL PRIMARY KEY,
    description VARCHAR(100) NOT NULL,
    language VARCHAR(100) NOT NULL,
    owner INT NOT NULL,
    editable BOOLEAN DEFAULT TRUE NOT NULL,
    FOREIGN KEY (owner) REFERENCES wmc.fcUser(id) ON DELETE CASCADE
);

CREATE TABLE wmc.Access (
    userId INT,
    deckId INT,
    PRIMARY KEY (userId, deckId),
    FOREIGN KEY (userId) REFERENCES wmc.fcUser(id),
    FOREIGN KEY (deckId) REFERENCES wmc.Deck(id) ON DELETE CASCADE
);

CREATE TABLE wmc.Flashcard (
    id SERIAL PRIMARY KEY,
    front VARCHAR(100) NOT NULL,
    back VARCHAR(100) NOT NULL,
    deckId INT,
    FOREIGN KEY (deckId) REFERENCES wmc.Deck(id) ON DELETE CASCADE
);

CREATE TABLE wmc.UserFlashCardStats (
    shown INT DEFAULT 0 NOT NULL,
    correct INT DEFAULT 0 NOT NULL,
    userId INT,
    cardId INT,
    PRIMARY KEY (userId, cardId),
    FOREIGN KEY (userId) REFERENCES wmc.fcUser(id),
    FOREIGN KEY (cardId) REFERENCES wmc.Flashcard(id) ON DELETE CASCADE
);