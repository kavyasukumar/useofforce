SELECT
	*, DATEDIFF(
		e.separationdate,
		e.startdate
	) / 365 as years

FROM
	policeshootings.officers o
INNER JOIN (
	SELECT
		person_nbr,
		min(employ_start_date) AS startdate,
		max(separation_date) AS separationdate
	FROM
		fdle14.employments
	GROUP BY
		person_nbr
) e ON o.FDLEID = e.person_nbr;
