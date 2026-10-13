-- HealthEase: verified schema-only export; no source records exported.
-- Import into an empty local demo database.
-- Account definers removed for portability; views use invoker permissions.


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
DROP TABLE IF EXISTS `appointment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `appointment` (
  `App_ID` varchar(10) NOT NULL,
  `Date` date NOT NULL,
  `Time` time NOT NULL,
  `Patient_ID` varchar(10) NOT NULL,
  `Dr_ID` varchar(10) NOT NULL,
  PRIMARY KEY (`App_ID`),
  KEY `Patient_ID` (`Patient_ID`),
  KEY `Dr_ID` (`Dr_ID`),
  CONSTRAINT `appointment_ibfk_1` FOREIGN KEY (`Patient_ID`) REFERENCES `patient` (`Patient_ID`),
  CONSTRAINT `appointment_ibfk_2` FOREIGN KEY (`Dr_ID`) REFERENCES `doctor` (`Dr_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `appointments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `appointments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `patient_id` int NOT NULL,
  `doctor_id` int NOT NULL,
  `appointment_date` date NOT NULL,
  `time_slot` time NOT NULL,
  `status` enum('booked','completed','cancelled') DEFAULT 'booked',
  `payment_status` enum('paid','pending') DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_doctor_timeslot` (`doctor_id`,`appointment_date`,`time_slot`),
  KEY `idx_appointments_doctor_date` (`doctor_id`,`appointment_date`),
  KEY `idx_appointments_patient` (`patient_id`),
  CONSTRAINT `appointments_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`),
  CONSTRAINT `appointments_ibfk_2` FOREIGN KEY (`doctor_id`) REFERENCES `doctors` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 */ /*!50003 TRIGGER `validate_appointment_time` BEFORE INSERT ON `appointments` FOR EACH ROW BEGIN
  DECLARE doctor_start TIME;
  DECLARE doctor_end TIME;

  SELECT start_time, end_time INTO doctor_start, doctor_end
  FROM doctors WHERE id = NEW.doctor_id;

  IF NEW.time_slot < doctor_start OR NEW.time_slot > doctor_end THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'Appointment time outside doctor availability';
  END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
DROP TABLE IF EXISTS `department`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `department` (
  `Dept_ID` varchar(10) NOT NULL,
  `Dept_Name` varchar(50) NOT NULL,
  PRIMARY KEY (`Dept_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `departments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `departments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `doctor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `doctor` (
  `Dr_ID` varchar(10) NOT NULL,
  `Name` varchar(50) NOT NULL,
  `Specialization` varchar(50) NOT NULL,
  `Experience` int DEFAULT NULL,
  `Phone_No` varchar(15) DEFAULT NULL,
  `Dept_ID` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`Dr_ID`),
  KEY `Dept_ID` (`Dept_ID`),
  CONSTRAINT `doctor_ibfk_1` FOREIGN KEY (`Dept_ID`) REFERENCES `department` (`Dept_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `doctors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `doctors` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `department_id` int DEFAULT NULL,
  `specialization` varchar(255) DEFAULT NULL,
  `available_days` set('Mon','Tue','Wed','Thu','Fri','Sat','Sun') DEFAULT NULL,
  `start_time` time DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_doctors_department` (`department_id`),
  CONSTRAINT `doctors_ibfk_1` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `patient`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `patient` (
  `Patient_ID` varchar(10) NOT NULL,
  `Name` varchar(50) NOT NULL,
  `Gender` varchar(10) NOT NULL,
  `Age` int NOT NULL,
  `Phone_No` varchar(15) DEFAULT NULL,
  PRIMARY KEY (`Patient_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `patients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `patients` (
  `id` int NOT NULL AUTO_INCREMENT,
  `full_name` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `payment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment` (
  `Pymt_ID` varchar(10) NOT NULL,
  `Amount` decimal(10,2) NOT NULL,
  `Date` date NOT NULL,
  `Pymt_Method` varchar(20) NOT NULL,
  `App_ID` varchar(10) NOT NULL,
  PRIMARY KEY (`Pymt_ID`),
  KEY `App_ID` (`App_ID`),
  CONSTRAINT `payment_ibfk_1` FOREIGN KEY (`App_ID`) REFERENCES `appointment` (`App_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `appointment_id` int NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `method` enum('online','cod') DEFAULT NULL,
  `transaction_id` varchar(255) DEFAULT NULL,
  `status` enum('success','failed','pending') DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_payments_appointment` (`appointment_id`),
  CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`appointment_id`) REFERENCES `appointments` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `todays_appointments`;
/*!50001 DROP VIEW IF EXISTS `todays_appointments`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `todays_appointments` AS SELECT
 1 AS `appointment_id`,
 1 AS `patient_name`,
 1 AS `doctor_name`,
 1 AS `appointment_date`,
 1 AS `time_slot`*/;
SET character_set_client = @saved_cs_client;
/*!50001 DROP VIEW IF EXISTS `todays_appointments`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013  SQL SECURITY INVOKER */
/*!50001 VIEW `todays_appointments` AS select `a`.`id` AS `appointment_id`,`p`.`full_name` AS `patient_name`,`d`.`name` AS `doctor_name`,`a`.`appointment_date` AS `appointment_date`,`a`.`time_slot` AS `time_slot` from ((`appointments` `a` join `patients` `p` on((`a`.`patient_id` = `p`.`id`))) join `doctors` `d` on((`a`.`doctor_id` = `d`.`id`))) where ((`a`.`appointment_date` = curdate()) and (`a`.`status` = 'booked')) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;


-- Synthetic demo records only. No source records were read or copied.
START TRANSACTION;
INSERT INTO departments (id, name, description) VALUES
  (1, 'General Medicine', 'Synthetic demo department for appointment booking.');
INSERT INTO doctors (id, name, department_id, specialization, available_days, start_time, end_time) VALUES
  (1, 'Dr. Demo Physician', 1, 'General Medicine', 'Mon,Tue,Wed,Thu,Fri', '09:00:00', '17:00:00');
INSERT INTO patients (id, full_name, email, phone) VALUES
  (1, 'Demo Patient', 'demo.patient@example.invalid', NULL);
INSERT INTO appointments (id, patient_id, doctor_id, appointment_date, time_slot, status, payment_status) VALUES
  (1, 1, 1, '2030-01-15', '09:00:00', 'booked', 'pending');
INSERT INTO payments (id, appointment_id, amount, method, transaction_id, status) VALUES
  (1, 1, 100.00, 'cod', NULL, 'pending');
COMMIT;
