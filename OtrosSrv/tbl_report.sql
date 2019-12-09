-- Table: reports

-- DROP TABLE reports;

CREATE TABLE reports
(
  destino text,
  contiene text,
  date timestamp without time zone,
  key serial NOT NULL
)
WITH (
  OIDS=FALSE
);
ALTER TABLE reports
  OWNER TO postgres;
