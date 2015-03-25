#!/bin/bash          
echo Starting UseOfForce project setup ...

password=$(cat password)

# Drop existing db and create new one
mysql -p$password -e "DROP DATABASE IF EXISTS policeshootings"
mysql -p$password -e "CREATE DATABASE policeshootings"

# Create table structure
mysql -p$password policeshootings < ./sql/createtables.sql

# import raw data into tables
filepath=$(pwd)'/data'

mysql -p$password policeshootings -e "LOAD DATA INFILE '$filepath/rawincidents.csv'
	INTO TABLE rawincidents 
	FIELDS TERMINATED BY ','
	OPTIONALLY ENCLOSED BY '\"'
	IGNORE 1 LINES"
mysql -p$password policeshootings -e "LOAD DATA INFILE '$filepath/rawsubjects.csv'
	INTO TABLE rawsubjects
	FIELDS TERMINATED BY ','
	OPTIONALLY ENCLOSED BY '\"'
	IGNORE 1 LINES"
mysql -p$password policeshootings -e "LOAD DATA INFILE '$filepath/rawofficers.csv'
	INTO TABLE rawofficers
	FIELDS TERMINATED BY ','
	OPTIONALLY ENCLOSED BY '\"'
	IGNORE 1 LINES"

# normalize data into separate tables
mysql -p$password policeshootings < ./sql/normalize.sql

# import all stored procedures
for FILE in `ls ./sql/sprocs/*.sql`
do
	echo $FILE
	mysql -p$password policeshootings < $FILE
done