DROP PROCEDURE IF EXISTS Insert_UnknownSubjects;

DELIMITER $$
CREATE PROCEDURE Insert_UnknownSubjects()
BEGIN
  DECLARE done INT DEFAULT FALSE;
  DECLARE a CHAR(16);
  DECLARE C_IncidentId,
    C_lastName,
    C_firstName,
    C_middleName,
    C_dob,
    C_gender,
    C_ethnicity,
    C_injuryLevel,
    C_city,
    C_weapons,
    C_shotAtPolice,
    C_wasSuicidal,
    C_mentalIllness,
    C_arrestHistory,
    C_toxicologyD,
    C_toxicologyS,
    C_charges,
    C_disposition,
    C_shotSelf VARCHAR(255);


  DECLARE cur1 CURSOR FOR SELECT 
  `Incident ID`,
  `Subject last name`,
  `First name`,
  `Middle name or initial`,
  `DOB`,
  `Gender`,
  `Ethnicity`,
  `Injury level`,
  `City of residence`,
  `Subject weapon(s)`,
  `Did subject shoot at police?`,
  `Was subject behaving suicidal?`,
  `History of mental illness?`,
  `Arrest history?`,
  `Toxicology (D)`,
  `Toxicology (S)`,
  `Crime charged with?`,
  `Crime disposition`,
  `Self-shooting?` 
  FROM rawsubjects WHERE `Subject last name` like '%unknown%';
  
  DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

  OPEN cur1;

  read_loop: LOOP
    FETCH cur1 INTO 
    C_IncidentId,
    C_lastName,
    C_firstName,
    C_middleName,
    C_dob,
    C_gender,
    C_ethnicity,
    C_injuryLevel,
    C_city,
    C_weapons,
    C_shotAtPolice,
    C_wasSuicidal,
    C_mentalIllness,
    C_arrestHistory,
    C_toxicologyD,
    C_toxicologyS,
    C_charges,
    C_disposition,
    C_shotSelf;

    IF done THEN
      LEAVE read_loop;
    END IF;

    INSERT INTO subjects (
      lastName,
      firstName,
      middleName,
      dob,
      gender,
      ethnicity,
      city
    ) SELECT 
      C_lastName,
      C_firstName,
      C_middleName,
      str_to_date(NULLIF(C_dob,''),'%m/%d/%Y'),
      C_gender,
      C_ethnicity,
      C_city;

      INSERT INTO incidentSubjectMap
      (
        incidentId,
        subjectId,
        injuryLevel,
        weapons,
        shotAtPolice,
        wasSuicidal,
        mentalIllness,
        shotSelf,
        arrestHistory,
        toxicologyD,
        toxicologyS,
        charges,
        disposition
      )
      SELECT
        C_IncidentId,
        last_insert_id(),
        C_injuryLevel,
        C_weapons,
        CASE C_shotAtPolice
      WHEN 'Yes' THEN
        TRUE
      ELSE
        FALSE
      END,
       CASE C_wasSuicidal
      WHEN 'Yes' THEN
        TRUE
      ELSE
        FALSE
      END,
       CASE C_mentalIllness
      WHEN 'Yes' THEN
        TRUE
      ELSE
        FALSE
      END,
       CASE C_shotSelf
      WHEN 'Yes' THEN
        TRUE
      ELSE
        FALSE
      END,
       CASE C_arrestHistory
      WHEN 'Yes' THEN
        TRUE
      ELSE
        FALSE
      END,
       C_toxicologyD,
       C_toxicologyS,
       C_charges,
       C_disposition;
  END LOOP;

  CLOSE cur1;
END$$
