
Select S.*,
ISM.injuryLevel,
ISM.weapons,
ISM.shotatpolice,
I.id,
I.date,
I.location,
I.city as incidentCity,
(select group_concat(distinct ALT.officialname) AS agencies
 from officerIncidentMap OIM
 left join agencyaltnames ALT
 ON ALT.shortname =OIM.agency
 where incidentId= I.id 
 group by incidentId) AS agencies
from subjects S
LEFT JOIN incidentSubjectMap ISM
ON S.id = ISM.subjectId
INNER JOIN incidents I
ON I.id = ISM.incidentID;