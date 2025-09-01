/*
	01 create database
    02 create tables
    03 insert data
*/


/* 01 create database */
create database if not exists dbo;
use dbo;


/* 02 create tables */
create table employee(
	 id bigint not null auto_increment
	,uid varchar(255)
    ,first_name varchar(255)
    ,last_name varchar(255)
    ,email varchar(255)
    ,phone_number varchar(50)
    ,position varchar(255)
    ,department_id bigint
    ,manager_uid varchar(255)
    ,employment_date datetime(6)
    ,role varchar(255)
    ,leave_days_available bigint
    ,created_at datetime
    ,updated_at datetime
    ,primary key (id)
);

create table department(
	 id bigint not null
    ,description varchar(255)
    ,primary key (id)
);

create table leave_request(
	 id bigint not null auto_increment
    ,employee_uid varchar(255)
    ,start_date date
    ,end_date date
    ,type varchar(255)
    ,status varchar(255)
    ,description varchar(1000)
    ,created_at datetime
    ,updated_at datetime
    ,primary key (id)
);


/* 03 insert data */
insert into employee (id, first_name, last_name, email, phone_number, position, department_id, manager_uid, employment_date, role, created_at, uid, leave_days_available)
values
(1,'Krzysztof', 'Kwiatkowski', 	'admin@firma.pl', 			'500 000 000', 'Prezes Zarządu', 				1, 	null,						   '2025-01-01', 'MANAGER', 	now(), 'OrqwrK5u0ahpujv2eJShMBPuw683', 30),
(2,'Jan', 		'Kowalski', 	'jan.kowalski@firma.pl', 	'500 234 567', 'Kierownik działu IT', 			2, 'OrqwrK5u0ahpujv2eJShMBPuw683', '2025-02-01', 'MANAGER', 	now(), 'Y80KFruPfKN9FnratzBR12mV2MC2', 2),
(3,'Adam', 		'Nowak', 		'adam.nowak@firma.pl', 		'500 345 678', 'Backend developer', 			2, 'Y80KFruPfKN9FnratzBR12mV2MC2', '2025-03-01', 'SUBORDINATE', now(), 'MGOyfPTamgTwnw4jHwzBqvqv6zm1', 5),
(4,'Łukasz', 	'Nawrocki', 	'lukasz.nawrocki@firma.pl', '500 369 320', 'Frontend developer', 			2, 'Y80KFruPfKN9FnratzBR12mV2MC2', '2025-03-01', 'SUBORDINATE', now(), '6fLwv7AofGUbkllBQkk5rBHytjl2', 7),
(5,'Ewa', 		'Wiśniewska', 	'ewa.wisniewska@firma.pl', 	'500 456 789', 'UX/UI designer', 				2, 'Y80KFruPfKN9FnratzBR12mV2MC2', '2025-04-01', 'SUBORDINATE', now(), 'RFO4hJb0jyTayeMtRhR5fvS2kHN2', 12),
(6,'Piotr', 	'Zieliński', 	'piotr.zielinski@firma.pl', '500 567 890', 'Kierownik działu marketingu', 	3, 'OrqwrK5u0ahpujv2eJShMBPuw683', '2025-05-01', 'MANAGER', 	now(), 'lr797X3tMsQty6x1q8WGHHOkf4M2', 1),
(7,'Alicja', 	'Wójcik', 		'alicja.wojcik@firma.pl', 	'500 678 901', 'Specjalista ds. marketingu', 	3, 'lr797X3tMsQty6x1q8WGHHOkf4M2', '2025-06-01', 'MANAGER', 	now(), 'JWI2vJuZ6uWsThrVnsHbdg4y3kS2', 23),
(8,'Marta',		'Lorenc', 		'marta.lorenc@firma.pl', 	'500 890 123', 'Asystentka Zarządu', 			1, 'OrqwrK5u0ahpujv2eJShMBPuw683', '2025-08-01', 'SUBORDINATE', now(), 'pnEVBvQEzTapw33HZy2VM9kldXp2', 10),
(9,'Agnieszka', 'Kaczmarek', 	'admin@firma.pl', 			'500 901 234', 'Kierownik działu HR', 			4, 'OrqwrK5u0ahpujv2eJShMBPuw683', '2025-09-01', 'ADMIN', 		now(), 'LlrSPLWbynWZr3LQniXn4NnUkSc2', 6),
(10,'Michał', 	'Szymański', 	'michal.szymanski@firma.pl','500 902 357', 'Specjalista ds. HR', 			4, 'LlrSPLWbynWZr3LQniXn4NnUkSc2', '2025-09-01', 'SUBORDINATE', now(), 'Wqgvlj3oqeaf81065ABftontZ6k2', 33);

insert into department(id, description)
values
(1, 'Zarząd'),
(2, 'IT'),
(3, 'Marketing'),
(4, 'HR');

insert into leave_request(employee_uid, start_date, end_date, type, status, description, created_at)
values 
('Y80KFruPfKN9FnratzBR12mV2MC2', '2025-09-01', '2025-09-05', 'VACATION', 'APPROVED', NULL, '2025-08-26 14:16:53'),
('RFO4hJb0jyTayeMtRhR5fvS2kHN2', '2025-09-24', '2025-09-26', 'OTHER', 'REJECTED', 'Przeprowadzka', '2025-08-04 09:47:41'),
('RFO4hJb0jyTayeMtRhR5fvS2kHN2', '2025-09-29', '2025-10-01', 'OTHER', 'PENDING', 'Przeprowadzka', '2025-09-04 11:54:32'),
('MGOyfPTamgTwnw4jHwzBqvqv6zm1', '2025-09-08', '2025-09-08', 'OTHER', 'PENDING', 'Narodziny dziecka', '2025-09-05 17:12:59'),
('6fLwv7AofGUbkllBQkk5rBHytjl2', '2025-09-19', '2025-09-26', 'VACATION', 'APPROVED', NULL, '2025-08-26 14:55:36');
