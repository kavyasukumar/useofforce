-- Some cleanup
UPDATE rawincidents
SET `Total shots that hit suspect` = NULL
WHERE `Total shots that hit suspect` = 'unknown';

UPDATE rawincidents
SET `Total shots fired by police` = NULL
WHERE `Total shots fired by police` = 'unknown';

INSERT INTO incidents
(
  id,
  caseNum,
  summary,
  date,
  location,  
  city,
  zip,
  injuryLevel,
  manner,
  shotsFired,
  shotsHit,
  copsFired,
  suspectsInvolved,
  initialContact,
  callType,
  isDomesticDispute,
  lessLethalForceUsed,
  isSuicideByCop,
  shotIntoVehicle,
  isAccidental,
  footPursuit,
  carPursuit,
  physicalStruggle,
  lawsuitFiled,
  hasDiscrepancies,
  isModelCase,
  notes,
  reviewBoard,
  otherOfficersInjured
)
SELECT
  `Incident ID`,
  `Police case number`,
  `Summary of incident`,
  str_to_date(date,'%m/%d/%Y'),
  Location,
  City,
  `ZIP code`,
  `Injury level`,
  `Manner of death`,
  convert(NULLIF(`Total shots fired by police`,''), unsigned integer),
  convert(NULLIF(`Total shots that hit suspect`,''), unsigned integer),
  convert(NULLIF(`Number of cops who fired`,''), unsigned integer),
  `Number of suspects shot or shot at`,
  `Source of initial contact`,
  `Call type`,
  CASE `Domestic dispute?`
  WHEN 'Yes' THEN
    TRUE
  ELSE
    FALSE
  END,
   `Less-lethal force?`,
   CASE `Suicide by cop?`
  WHEN 'Yes' THEN
    TRUE
  ELSE
    FALSE
  END,
   CASE `Shots fired into vehicle?`
  WHEN 'Yes' THEN
    TRUE
  ELSE
    FALSE
  END,
   CASE `Accidental discharge?`
  WHEN 'Yes' THEN
    TRUE
  ELSE
    FALSE
  END,
   CASE `Foot pursuit?`
  WHEN 'Yes' THEN
    TRUE
  ELSE
    FALSE
  END,
   CASE `Car pursuit?`
  WHEN 'Yes' THEN
    TRUE
  ELSE
    FALSE
  END,
   CASE `Physical struggle?`
  WHEN 'Yes' THEN
    TRUE
  ELSE
    FALSE
  END,
   CASE `Lawsuit filed?`
  WHEN 'Yes' THEN
    TRUE
  ELSE
    FALSE
  END,
   CASE `Discrepancies?`
  WHEN 'Yes' THEN
    TRUE
  ELSE
    FALSE
  END,
   CASE `Model case?`
  WHEN 'Yes' THEN
    TRUE
  ELSE
    FALSE
  END,
   Notes,
   CASE `Review board?`
  WHEN 'Yes' THEN
    TRUE
  ELSE
    FALSE
  END,
 convert(NULLIF(`Other officer(s) injured?`,''), unsigned integer)
 FROM
  rawincidents;

UPDATE incidents
SET injuryLevel = 'Non-Fatal'
WHERE
  injuryLevel = 'injury';


INSERT INTO subjects (
  lastName,
  firstName,
  middleName,
  dob,
  gender,
  ethnicity,
  city
) SELECT DISTINCT
  `Subject last name`,
  `First name`,
  `Middle name or initial`,
  str_to_date(NULLIF(dob,''),'%m/%d/%Y'),
  Gender,
  Ethnicity,
  `City of residence`
FROM
  rawsubjects
where `Subject last name` <> 'NA' or `First name` <> 'NA';

-- Remove no subjects
DELETE FROM subjects
Where lastName like '%no%subject%';

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
  `Incident ID`,
  S.id,
  R.`Injury level`,
  R.`Subject weapon(s)`,
  CASE R.`Did subject shoot at police?`
WHEN 'Yes' THEN
  TRUE
ELSE
  FALSE
END,
 CASE R.`Was subject behaving suicidal?`
WHEN 'Yes' THEN
  TRUE
ELSE
  FALSE
END,
 CASE R.`History of mental illness?`
WHEN 'Yes' THEN
  TRUE
ELSE
  FALSE
END,
 CASE R.`Self-shooting?`
WHEN 'Yes' THEN
  TRUE
ELSE
  FALSE
END,
 CASE R.`Arrest history?`
WHEN 'Yes' THEN
  TRUE
ELSE
  FALSE
END,
 R.`Toxicology (D)`,
 R.`Toxicology (S)`,
 R.`Crime charged with?`,
 R.`Crime disposition`
FROM
  rawsubjects R
INNER JOIN subjects S ON 
R.`Subject last name` = S.lastName
AND (((R.`First name` ='' OR R.`First name` is null) AND S.firstName is null) OR R.`First name` = S.firstName)
AND (((R.DOB = '' OR R.DOB is null) AND S.dob is null) OR str_to_date(R.dob,'%m/%d/%Y') = S.dob);


INSERT INTO officers
(
lastName,
firstName,
middleName,
dob,
ethnicity,
gender,
FDLEId
)
SELECT
`Officer last name`,
`First name`,
MAX(`Middle name or initial`),
str_to_date(NULLIF(dob,''),'%m/%d/%Y'),
Ethnicity,
Gender,
`FDLE ID number`
from rawofficers
GROUP BY
`Officer last name`,
DOB,
Gender,
Ethnicity,
`FDLE ID number`;

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
R.`Incident ID`,
O.id,
R.Agency,
R.`Agency ID number`,
R.`Officer's assignment`,
R.`PBSO District`,
R.`Number of shots fired by officer`,
R.`Officer weapon`,
R.`Officer injuries?`,
R.`Discipline?`,
R.Rank,
CASE R.`Off-duty?`
  WHEN 'Yes' THEN TRUE
  ELSE FALSE
END
FROM rawofficers R
INNER JOIN officers O ON
R.`Officer last name`=O.lastName
AND (((R.dob ='' OR R.dob is null) AND O.dob is null) OR str_to_date(R.dob,'%m/%d/%Y') = O.dob)
AND (((R.Gender = '' OR R.gender is null) AND O.Gender is null) OR R.Gender=O.gender)
AND (((R.Ethnicity = '' OR R.Ethnicity is null) AND O.Ethnicity is null) OR R.Ethnicity=O.ethnicity)
AND (((R.`FDLE ID number` = '' OR R.`FDLE ID number` is null) AND O.FDLEID is null) OR R.`FDLE ID number`=O.FDLEID);