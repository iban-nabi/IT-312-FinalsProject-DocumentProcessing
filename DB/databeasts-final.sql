-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Dec 15, 2023 at 03:29 PM
-- Server version: 8.0.31
-- PHP Version: 8.0.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `databeasts-final`
--

-- --------------------------------------------------------

--
-- Table structure for table `account`
--

DROP TABLE IF EXISTS `account`;
CREATE TABLE IF NOT EXISTS `account` (
  `acct_username` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `acct_fname` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `acct_lname` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `acct_type` enum('ADMIN','REQUESTER','REVIEWER') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `revofc_id` varchar(7) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `school_id` varchar(3) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `status` enum('ACTIVE','INACTIVE') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`acct_username`),
  KEY `reviewer_FK` (`revofc_id`),
  KEY `school_FK` (`school_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `account`
--

INSERT INTO `account` (`acct_username`, `password`, `acct_fname`, `acct_lname`, `acct_type`, `revofc_id`, `school_id`, `status`, `email`) VALUES
('office1', '9M5nC/9Hj0nS8xY1xNy0RQ==', 'Jill', 'Valentine', 'REVIEWER', 'REVOFC1', NULL, 'ACTIVE', 'ograa@slu.edu.ph'),
('office2', '9M5nC/9Hj0nS8xY1xNy0RQ==', 'Albert', 'Wesker', 'REVIEWER', 'REVOFC2', NULL, 'ACTIVE', 'ovp.aa@slu.edu.ph'),
('office3', '9M5nC/9Hj0nS8xY1xNy0RQ==', 'Ashley', 'Graham', 'REVIEWER', 'REVOFC3', NULL, 'ACTIVE', 'ovp.f@slu.edu.ph'),
('office4', '9M5nC/9Hj0nS8xY1xNy0RQ==', 'Leon', 'Kennedy', 'REVIEWER', 'REVOFC4', NULL, 'ACTIVE', 'ola@slu.edu.ph'),
('office5', '9M5nC/9Hj0nS8xY1xNy0RQ==', 'Chris', 'Redfield', 'REVIEWER', 'REVOFC5', NULL, 'ACTIVE', 'ovp.a@slu.edu.ph'),
('requester1', 'kUy8DHhhI7xZmm+QFXao+Q==', 'Saffron', 'Hunt', 'REQUESTER', NULL, 'SC5', 'ACTIVE', 'requester1@slu.edu.ph'),
('requester2', 'kUy8DHhhI7xZmm+QFXao+Q==', 'Alicia', 'Villegas', 'REQUESTER', NULL, 'SC7', 'ACTIVE', 'requester2@slu.edu.ph'),
('requester3', 'kUy8DHhhI7xZmm+QFXao+Q==', 'Danny', 'Odonnell', 'REQUESTER', NULL, 'SC2', 'ACTIVE', 'requester3@slu.edu.ph'),
('user1', 'vdsF5LLqVVb5DjYJkyjjuQ==', 'James', 'Band', 'ADMIN', NULL, NULL, 'ACTIVE', 'admin@slu.edu.ph'),
('user2', 'kUy8DHhhI7xZmm+QFXao+Q==', 'Juan', 'Cruz', 'REQUESTER', NULL, 'SC1', 'ACTIVE', 'user2@slu.edu.ph');

-- --------------------------------------------------------

--
-- Table structure for table `document`
--

DROP TABLE IF EXISTS `document`;
CREATE TABLE IF NOT EXISTS `document` (
  `doc_id` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `version` int NOT NULL DEFAULT '1',
  `doc_type` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `doc_title` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `file_size` decimal(6,3) NOT NULL,
  `no_of_pages` int NOT NULL,
  `acct_username` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`doc_id`,`version`,`acct_username`),
  KEY `requester_FK` (`acct_username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `rev_office`
--

DROP TABLE IF EXISTS `rev_office`;
CREATE TABLE IF NOT EXISTS `rev_office` (
  `revofc_id` varchar(7) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `dept_name` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`revofc_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `rev_office`
--

INSERT INTO `rev_office` (`revofc_id`, `dept_name`) VALUES
('REVOFC1', 'OGRAA'),
('REVOFC2', 'OVP for Academic Affairs'),
('REVOFC3', 'OVP for Finance'),
('REVOFC4', 'Office for Legal Affairs'),
('REVOFC5', 'OVP for Administration');

-- --------------------------------------------------------

--
-- Table structure for table `school`
--

DROP TABLE IF EXISTS `school`;
CREATE TABLE IF NOT EXISTS `school` (
  `school_id` varchar(4) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `school_name` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`school_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `school`
--

INSERT INTO `school` (`school_id`, `school_name`) VALUES
('SC1', 'SAMCIS'),
('SC2', 'SAS'),
('SC3', 'SEA'),
('SC4', 'SOL'),
('SC5', 'SOM'),
('SC6', 'SONAHBS'),
('SC7', 'STELA');

-- --------------------------------------------------------

--
-- Table structure for table `transaction`
--

DROP TABLE IF EXISTS `transaction`;
CREATE TABLE IF NOT EXISTS `transaction` (
  `trn_id` varchar(6) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `trn_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `doc_id` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `version` int NOT NULL DEFAULT '1',
  `acct_username` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `revofc_id` varchar(7) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `trn_status` enum('PENDING','APPROVED','REVIEWING','RETURNED','REJECTED','CANCELLED') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `notification` tinyint(1) NOT NULL DEFAULT '0',
  `remarks` tinytext COLLATE utf8mb4_general_ci,
  PRIMARY KEY (`trn_id`),
  KEY `transac_document_FK` (`doc_id`),
  KEY `transac_revofc_FK` (`revofc_id`),
  KEY `transac_doc_FK` (`doc_id`,`version`,`acct_username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `account`
--
ALTER TABLE `account`
  ADD CONSTRAINT `reviewer_FK` FOREIGN KEY (`revofc_id`) REFERENCES `rev_office` (`revofc_id`),
  ADD CONSTRAINT `school_FK` FOREIGN KEY (`school_id`) REFERENCES `school` (`school_id`);

--
-- Constraints for table `document`
--
ALTER TABLE `document`
  ADD CONSTRAINT `doc_acct_FK` FOREIGN KEY (`acct_username`) REFERENCES `account` (`acct_username`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Constraints for table `transaction`
--
ALTER TABLE `transaction`
  ADD CONSTRAINT `transac_doc_FK` FOREIGN KEY (`doc_id`,`version`,`acct_username`) REFERENCES `document` (`doc_id`, `version`, `acct_username`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `transac_revofc_FKF` FOREIGN KEY (`revofc_id`) REFERENCES `rev_office` (`revofc_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
