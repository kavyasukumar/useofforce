DROP TABLE IF EXISTS policeshootings.EmploymentHist;
CREATE TABLE policeshootings.EmploymentHist
(
  officerid INT,
	incidentId VARCHAR(255),
	agency VARCHAR(255),
	FDLEID VARCHAR(255),
	startdate DATETIME,
	separationdate DATETIME,
	isActive BOOLEAN,
	hasbreak BOOLEAN,
  yearsofService FLOAT
);

INSERT INTO policeshootings.EmploymentHist
SELECT
	O.id,
  OIM.incidentId,
	OIM.agency,
	MAX(O.FDLEID) AS FDLEID, 
	MIN(employ_start_date) AS startdate,
	NULL as separationdate,
	TRUE AS isActive,
  null,
  null
FROM
	policeshootings.officers O
INNER JOIN policeshootings.officerincidentmap OIM ON O.id = OIM.officerid
LEFT JOIN agencyaltnames A ON A.shortname = OIM.agency
INNER JOIN fdle14.employments E ON E.person_nbr = O.FDLEID
	AND E.agcy_name = A.officialname
WHERE
	E.separation_date IS NULL
GROUP BY
	O.id,
OIM.incidentId,
	OIM.agency;

INSERT INTO employmenthist
SELECT
	O.id,
  OIM.incidentId,
	OIM.agency,
	MAX(O.FDLEID) AS FDLEID, 
	MIN(employ_start_date) AS startdate,
	MAX(separation_date) AS separationdate,
 	FALSE AS isActive,
  null,
  null
FROM
	policeshootings.officers O
INNER JOIN policeshootings.officerincidentmap OIM ON O.id = OIM.officerid
LEFT JOIN agencyaltnames A ON A.shortname = OIM.agency
INNER JOIN fdle14.employments E ON E.person_nbr = O.FDLEID
	AND E.agcy_name = A.officialname
WHERE
	E.separation_date IS NOT NULL
	AND NOT EXISTS(SELECT * FROM Employmenthist X where X.officerid=O.id and X.incidentid=OIM.incidentId)
GROUP BY
	O.id,
OIM.incidentId,
	OIM.agency;
