SELECT 
	id,
	hed,
	summary,
	date,
	city
FROM incidents;

Select 
S.id,
S.firstName,
S.lastName,
S.dob,
S.ethnicity,
S.gender,
ISM.injuryLevel,
ISM.weapons,
ISM.shotatpolice,
I.id as incidentid,
I.date,
I.location,
I.city as incidentCity,
concat(concat(concat(replace(S.lastName,' ',''),'-'),I.id),'.jpg') as imgName
from subjects S
LEFT JOIN incidentSubjectMap ISM
ON S.id = ISM.subjectId
INNER JOIN incidents I
ON I.id = ISM.incidentID;


Select 
DISTINCT
OIM.incidentid,
ALT.officialname
 from officerIncidentMap OIM
 left join agencyaltnames ALT
 ON ALT.shortname = OIM.agency;