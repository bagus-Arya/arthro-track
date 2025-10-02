-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Oct 02, 2025 at 02:09 AM
-- Server version: 11.8.2-MariaDB
-- PHP Version: 8.4.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_arthrotrack`
--

-- --------------------------------------------------------

--
-- Table structure for table `sensor_data`
--

CREATE TABLE `sensor_data` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `left_weight` decimal(8,2) DEFAULT NULL,
  `right_weight` decimal(8,2) DEFAULT NULL,
  `left_mpu` decimal(8,4) DEFAULT NULL,
  `right_mpu` decimal(8,4) DEFAULT NULL,
  `piezo1` decimal(8,2) DEFAULT NULL,
  `piezo2` decimal(8,2) DEFAULT NULL,
  `piezo3` decimal(8,2) DEFAULT NULL,
  `piezo4` decimal(8,2) DEFAULT NULL,
  `piezo5` decimal(8,2) DEFAULT NULL,
  `param1` varchar(255) DEFAULT NULL,
  `param2` varchar(255) DEFAULT NULL,
  `param3` varchar(255) DEFAULT NULL,
  `param4` varchar(255) DEFAULT NULL,
  `param5` varchar(255) DEFAULT NULL,
  `param6` varchar(255) DEFAULT NULL,
  `oa_score` decimal(5,2) DEFAULT NULL,
  `oa_risk_category` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sensor_data`
--

INSERT INTO `sensor_data` (`id`, `user_id`, `left_weight`, `right_weight`, `left_mpu`, `right_mpu`, `piezo1`, `piezo2`, `piezo3`, `piezo4`, `piezo5`, `param1`, `param2`, `param3`, `param4`, `param5`, `param6`, `oa_score`, `oa_risk_category`, `created_at`, `updated_at`) VALUES
(1, 1, 12.34, 15.67, 1.2345, 1.5678, 3050.00, 2800.00, 1500.00, 1200.00, 900.00, 'OA Sedang', 'OA Sedang', 'OA Rendah', 'Non-OA', 'OA Rendah', 'OA Sedang', 44.45, 'Risiko Sedang', '2025-10-01 15:27:02', '2025-10-01 15:27:02');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `sensor_data`
--
ALTER TABLE `sensor_data`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sensor_data_user_id_foreign` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `sensor_data`
--
ALTER TABLE `sensor_data`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `sensor_data`
--
ALTER TABLE `sensor_data`
  ADD CONSTRAINT `sensor_data_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
