SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 ;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 ;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' ;
SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 ;

DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
	`user_id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
	`first_name` varchar(255) NOT NULL,
	`last_name` varchar(255) NULL,
	`email` varchar(255) NOT NULL,
	`password` binary(60) NOT NULL,
	PRIMARY KEY (`user_id`),
	CONSTRAINT unique_constraint UNIQUE (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `user` (first_name, last_name, email, password)
	VALUES 	('Peter', 'Yetti', 'yettip@oregonstate.edu', '$2y$12$.qAPE7lAbBu7SZpUPs1cXetTJ.ppuZAlt/XWABJCd.QpB7hPMYI8m'),
			('Andrew', 'Chandra', 'chandran@oregonstate.edu', '$2y$12$gYWROr5Z5dIzXLdCpurbXOF18KOtaxQQwACRvryj8WWvhHNrhC.QC');

commit;
