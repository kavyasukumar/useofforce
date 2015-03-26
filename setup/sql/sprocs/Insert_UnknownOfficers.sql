DROP PROCEDURE IF EXISTS Insert_UnknownOfficers;

DELIMITER $$
CREATE PROCEDURE Insert_UnknownOfficers()
BEGIN
  DECLARE done INT DEFAULT FALSE;
  DECLARE C_IncidentId,
    C_lastName,
    C_firstName,
    C_middleName,
    C_dob,
    C_ethnicity,
    C_gender,
    C_FDLEid,
    C_agency,
    C_agencyId,
    C_officerAssignment,
    C_PBSODistrict,
    C_shotsfired,
    C_weapon,
    C_injuries,
    C_DisciplinaryAction,
    C_rank,
    C_wasOffDuty VARCHAR(255);


  DECLARE cur1 CURSOR FOR SELECT 
   `Incident ID`,
  `Officer last name`,
  `First name`,
  `Middle name or initial`,
  `DOB`,
  `Ethnicity`,
  `Gender`,
  `FDLE ID number`,
  `Agency`,
  `Agency ID number`,
  `Officer's assignment`,
  `PBSO District`,
  `Number of shots fired by officer`,
  `Officer weapon`,
  `Officer injuries?`,
  `Discipline?`,
  `Rank`,
  `Off-duty?`
  FROM rawofficers WHERE `Officer last name` like '%unknown%';
  
  DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

  OPEN cur1;

  read_loop: LOOP
    FETCH cur1 INTO 
    C_IncidentId,
    C_lastName,
    C_firstName,
    C_middleName,
    C_dob,
    C_ethnicity,
    C_gender,
    C_FDLEid,
    C_agency,
    C_agencyId,
    C_officerAssignment,
    C_PBSODistrict,
    C_shotsfired,
    C_weapon,
    C_injuries,
    C_DisciplinaryAction,
    C_rank,
    C_wasOffDuty;

    IF done THEN
      LEAVE read_loop;
    END IF;

    INSERT INTO officers
    (
    lastName,
    firstName,
    middleName,
    dob,
    gender,
    ethnicity,
    FDLEId
    )
    SELECT 
      C_lastName,
      C_firstName,
      C_middleName,
      str_to_date(NULLIF(C_dob,''),'%m/%d/%Y'),
      C_gender,
      C_ethnicity,
      C_FDLEid;

    INSERT INTO officerIncidentMap
    (
       incidentId,
       officerId,
       agency,
       agencyId,
       officerAssignment,
       PBSODistrict,
       shotsfired,
       weapon,
       injuries,
       DisciplinaryAction,
       rank,
       wasOffDuty
    )
    SELECT
      C_IncidentId,
      last_insert_id(),
      C_agency,
      C_agencyId,
      C_officerAssignment,
      C_PBSODistrict,
      C_shotsfired,
      C_weapon,
      C_injuries,
      C_DisciplinaryAction,
      C_rank,
      CASE C_wasOffDuty
        WHEN 'Yes' THEN TRUE
        ELSE FALSE
      END;
  END LOOP;

  CLOSE cur1;
END$$
