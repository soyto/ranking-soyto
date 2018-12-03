CREATE TABLE USERS(
  uuid VARCHAR(255) PRIMARY KEY NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL
);

---- #

CREATE TABLE CHARACTERS(
  uuid VARCHAR(255) PRIMARY KEY NOT NULL,
  serverName VARCHAR(255) NOT NULL,
  characterId INT NOT NULL,
  profile_pic_url VARCHAR(255),
  facebook_url VARCHAR(255),
  twitch_url VARCHAR(255),
  youtube_url VARCHAR(255),
  mouseClick_gearCalc_url VARCHAR(255),
  hide_old_names BOOLEAN,
  hide_old_legions BOOLEAN
);

---- #

CREATE TABLE VERSION(
  version VARCHAR(255) PRIMARY KEY NOT NULL
);

---- #

INSERT INTO VERSION(version) VALUES('0.0.1');