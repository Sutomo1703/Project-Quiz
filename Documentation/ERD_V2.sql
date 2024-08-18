-- This script was generated by a beta version of the ERD tool in pgAdmin 4.
-- Please log an issue at https://redmine.postgresql.org/projects/pgadmin4/issues/new if you find any bugs, including reproduction steps.
BEGIN;


CREATE TABLE IF NOT EXISTS public.quiz
(
    id integer,
    quiz_name character varying NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.question
(
    id integer,
    quiz_id integer NOT NULL,
    question character varying NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.choice
(
    id integer,
    question_id integer NOT NULL,
    answer character varying NOT NULL,
    is_correct boolean NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.record_quiz
(
    id integer,
    quiz_id integer NOT NULL,
    tanggal_kerja date NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.record_answer
(
    id integer,
    record_quiz_id integer NOT NULL,
    question_id integer NOT NULL,
    answer_id integer NOT NULL,
    PRIMARY KEY (id)
);

ALTER TABLE IF EXISTS public.question
    ADD CONSTRAINT quiz_question FOREIGN KEY (quiz_id)
    REFERENCES public.quiz (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public.choice
    ADD FOREIGN KEY (question_id)
    REFERENCES public.question (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public.record_quiz
    ADD FOREIGN KEY (quiz_id)
    REFERENCES public.quiz (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public.record_answer
    ADD FOREIGN KEY (record_quiz_id)
    REFERENCES public.record_quiz (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public.record_answer
    ADD FOREIGN KEY (question_id)
    REFERENCES public.question (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public.record_answer
    ADD FOREIGN KEY (answer_id)
    REFERENCES public.choice (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;

END;