-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Dec 03, 2025 at 02:42 PM
-- Server version: 8.0.30
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `dbWebUjian`
--

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text,
  `price` decimal(10,2) NOT NULL,
  `stock` int DEFAULT '0',
  `category` varchar(100) DEFAULT 'general',
  `image_url` varchar(500) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `description`, `price`, `stock`, `category`, `image_url`, `created_at`, `updated_at`) VALUES
(9, 'Sabana', 'Ayam Goreng', '11000.00', 93, 'Food', 'https://i.gojekapi.com/darkroom/gofood-indonesia/v2/images/uploads/14845456-9589-4cd0-8aba-7539502b9aa4_uc.jpeg', '2025-12-03 14:05:26', '2025-12-03 14:35:37'),
(10, 'Rompi', 'Anti peluru AE50', '5000000.00', 10, 'Fashion', 'https://api.globy.com/public/market/65718794c1e99000459aba6f/photos/65718794c1e99000459aba78/65718794c1e99000459aba78_lg.webp', '2025-12-03 14:19:06', '2025-12-03 14:19:06');

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `payment_method` enum('qris','cash') DEFAULT 'qris',
  `payment_status` enum('pending','completed','failed') DEFAULT 'pending',
  `qr_code` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`id`, `user_id`, `total_amount`, `payment_method`, `payment_status`, `qr_code`, `created_at`) VALUES
(1, 4, '11000.00', 'qris', 'completed', 'data:image/png;base64,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', '2025-12-03 14:07:30'),
(2, 4, '11000.00', 'cash', 'completed', NULL, '2025-12-03 14:07:57'),
(3, 4, '11000.00', 'qris', 'completed', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAANQAAADUCAYAAADk3g0YAAAAAklEQVR4AewaftIAAAqkSURBVO3BQY4YybLgQDJR978yR0tfBZDIKD31fDezP1hrXfGw1rrmYa11zcNa65qHtdY1D2utax7WWtc8rLWueVhrXfOw1rrmYa11zcNa65qHtdY1D2utax7WWtc8rLWu+eEjlb+pYlKZKiaVqWJSOamYVKaKL1Smit+kMlVMKicVJypTxYnKVDGp/E0VXzysta55WGtd87DWuuaHyypuUjmpmFROVE4qJpUTlaliUpkqpopJZaqYVE4qJpUTlaniROWk4kRlqnij4iaVmx7WWtc8rLWueVhrXfPDL1N5o+KLikllqphUJpWbKiaVk4pJZap4o+INlaliqviXqLxR8Zse1lrXPKy1rnlYa13zw3+cylQxVZxU/E0Vk8qkMlVMKm9UnKh8oTJVvKEyVfyXPay1rnlYa13zsNa65of/z6hMFZPKScUbKlPFTSpfqEwVU8WJyhsq/5c9rLWueVhrXfOw1rrmh19W8TdVTCpTxaQyqUwVk8pUMalMFZPKScUbKlPFpDKpTBWTylQxqbxR8Zsq/iUPa61rHtZa1zysta754TKV/7KKSWWqmFSmikllqphUTlSmii8qJpWpYlKZKiaVqWJSmSomlaniROVf9rDWuuZhrXXNw1rrmh8+qvgvUZkqTiomlROVE5U3Kr6omFSmiknljYqTii8q/kse1lrXPKy1rnlYa11jf/CBylTxhspUMam8UXGiclIxqUwVk8pJxYnK31RxovJGxYnKVHGiclPFicpU8cXDWuuah7XWNQ9rrWt+uExlqphUpopJZao4UZlUTiomlUnli4pJ5Y2KSeWNikllUpkqTiomlUnlpOJEZaqYVKaKSWWqmFROKm56WGtd87DWuuZhrXWN/cE/ROWmikllqphUpopJ5aaKSeWNii9UporfpHJSMancVPGbHtZa1zysta55WGtd88NHKl9UnFScqEwVk8pU8UXFicpU8UbFb1I5UZkqJpWTikllqphUJpWTiknlpGJSOan44mGtdc3DWuuah7XWNT/8ZRVvqEwVU8Wk8kXFpPKFylQxqUwVk8pUMamcVLxRMal8UTGpTBUnKpPKScUbFTc9rLWueVhrXfOw1rrmh8sqTlTeqJhUpoqTiknljYoTlani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', '2025-12-03 14:31:07'),
(4, 4, '11000.00', 'qris', 'completed', 'data:image/png;base64,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', '2025-12-03 14:35:27'),
(5, 4, '33000.00', 'cash', 'completed', NULL, '2025-12-03 14:35:37');

-- --------------------------------------------------------

--
-- Table structure for table `transaction_items`
--

CREATE TABLE `transaction_items` (
  `id` int NOT NULL,
  `transaction_id` int DEFAULT NULL,
  `product_id` int DEFAULT NULL,
  `quantity` int NOT NULL,
  `price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `transaction_items`
--

INSERT INTO `transaction_items` (`id`, `transaction_id`, `product_id`, `quantity`, `price`) VALUES
(1, 1, 9, 1, '11000.00'),
(2, 2, 9, 1, '11000.00'),
(3, 3, 9, 1, '11000.00'),
(4, 4, 9, 1, '11000.00'),
(5, 5, 9, 3, '11000.00');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `username` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `role` enum('user','admin') DEFAULT 'user',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `full_name`, `role`, `created_at`, `updated_at`) VALUES
(4, 'farrell', 'farrell@mail.com', '$2a$10$rbgy9At3GFHE/OTXBHv/Pe75ds4lWSgPysfOE/bAjGSo4dh1CLxEi', 'farrell', 'admin', '2025-12-03 14:06:21', '2025-12-03 14:06:30');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `transaction_items`
--
ALTER TABLE `transaction_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `transaction_id` (`transaction_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `transaction_items`
--
ALTER TABLE `transaction_items`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `transaction_items`
--
ALTER TABLE `transaction_items`
  ADD CONSTRAINT `transaction_items_ibfk_1` FOREIGN KEY (`transaction_id`) REFERENCES `transactions` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `transaction_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
