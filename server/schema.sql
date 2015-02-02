-- CREATE DATABASE fantasy;

USE fantasy;

CREATE TABLE master (
  /* Describe your table here.*/

  id int NOT NULL AUTO_INCREMENT,
  teamname varchar(200) NOT NULL,
  PTS int NOT NULL,
  REB int NOT NULL,
  OREB int NOT NULL,
  AST int NOT NULL,
  STL int NOT NULL,
  BLK int NOT NULL,
  THREE int NOT NULL,
  PRIMARY KEY (ID)
);

/* Create other tables and define schemas for them here! */


-- CREATE TABLE users (
--   id        int    NOT NULL AUTO_INCREMENT,
--   username  varchar(40)   NOT NULL,
--   PRIMARY KEY (ID)
-- );


/*  Execute this file from the command line by typing:
 *    mysql -u root < server/schema.sql
 *  to create the database and the tables.*/