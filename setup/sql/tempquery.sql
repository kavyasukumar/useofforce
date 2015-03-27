Select S.*,
ISM.injuryLevel,
ISM.weapons,
ISM.shotatpolice,
ISM.shotself,
ISM.arresthistory,
I.summary,
I.date,
I.location,
I.city as incidentCity
from subjects S
LEFT JOIN incidentSubjectMap ISM
ON S.id = ISM.subjectId
INNER JOIN incidents I
ON I.id = ISM.incidentID;