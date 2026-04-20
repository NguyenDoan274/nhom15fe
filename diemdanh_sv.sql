-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Apr 06, 2026 at 02:17 AM
-- Server version: 10.6.19-MariaDB
-- PHP Version: 8.1.32

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `thanhsond22_diemdanh_sv`
--

-- --------------------------------------------------------

--
-- Table structure for table `diem_danhs`
--

CREATE TABLE `diem_danhs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `lich_thi_id` bigint(20) UNSIGNED NOT NULL,
  `sinh_vien_id` bigint(20) UNSIGNED NOT NULL,
  `ket_qua` enum('hợp lệ','Vắng mặt') DEFAULT NULL,
  `do_chinh_xac` varchar(20) DEFAULT NULL,
  `thoi_gian_dd` datetime DEFAULT NULL,
  `hinh_thuc_dd` varchar(10) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `diem_danhs`
--

INSERT INTO `diem_danhs` (`id`, `lich_thi_id`, `sinh_vien_id`, `ket_qua`, `do_chinh_xac`, `thoi_gian_dd`, `hinh_thuc_dd`, `created_at`, `updated_at`) VALUES
(36, 20, 19, 'hợp lệ', '99.907936096191', '2025-11-22 07:26:17', 'Camera', '2025-11-21 23:36:47', '2025-11-22 00:26:17'),
(53, 32, 18, 'Vắng mặt', NULL, NULL, NULL, '2025-11-26 03:46:36', '2025-12-03 03:15:57'),
(54, 32, 19, 'Vắng mặt', NULL, NULL, NULL, '2025-11-26 03:46:36', '2025-12-03 03:15:57'),
(55, 32, 20, 'Vắng mặt', NULL, NULL, NULL, '2025-11-26 03:46:36', '2025-12-03 03:15:57'),
(56, 32, 22, 'Vắng mặt', NULL, NULL, NULL, '2025-11-26 03:46:36', '2025-12-03 03:15:57'),
(57, 32, 23, 'Vắng mặt', NULL, NULL, NULL, '2025-11-26 03:46:36', '2025-12-03 03:15:57'),
(58, 33, 18, 'Vắng mặt', NULL, NULL, NULL, '2025-11-26 03:51:45', '2025-12-03 03:15:57'),
(59, 33, 19, 'Vắng mặt', NULL, NULL, NULL, '2025-11-26 03:51:45', '2025-12-03 03:15:57'),
(60, 33, 20, 'hợp lệ', '99.999465942383', '2025-11-26 11:02:30', 'Camera', '2025-11-26 03:51:45', '2025-11-26 04:02:30'),
(85, 52, 25, 'Vắng mặt', NULL, NULL, NULL, '2026-03-16 16:10:02', '2026-03-16 20:04:20'),
(86, 52, 18, 'hợp lệ', '99.760856628418', '2026-03-16 23:12:12', 'Camera', '2026-03-16 16:10:02', '2026-03-16 16:12:12'),
(87, 53, 25, 'Vắng mặt', NULL, NULL, NULL, '2026-03-18 12:06:59', '2026-03-18 14:03:27'),
(88, 53, 18, 'Vắng mặt', NULL, NULL, NULL, '2026-03-18 12:06:59', '2026-03-18 14:03:27');

-- --------------------------------------------------------

--
-- Table structure for table `giang_viens`
--

CREATE TABLE `giang_viens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `ma_gv` varchar(20) NOT NULL,
  `ho_ten` varchar(50) NOT NULL,
  `email` varchar(191) NOT NULL,
  `password` varchar(255) NOT NULL,
  `vai_tro` varchar(20) DEFAULT 'Giảng viên',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `giang_viens`
--

INSERT INTO `giang_viens` (`id`, `ma_gv`, `ho_ten`, `email`, `password`, `vai_tro`, `created_at`, `updated_at`) VALUES
(13, '1', 'Trần Văn Hùng', 'hung.tranvan@stu.edu.vn', '$2y$12$e5WsO2Z2NN9rJST10c5mkuj7BKv3qRhCWkIm7bLMQWS360UoRO0b2', 'admin', '2025-11-15 10:23:51', '2025-12-03 03:17:44'),
(15, '3', 'Giang_vien', 'bb@gmail.com', '$2y$12$q.qeR6t7VVHZwS3ehhaCdejHH/ToszMocsE/SLwnlYEICJ8y1l22G', 'giang_vien', '2025-11-15 11:06:17', '2025-11-21 19:52:18'),
(16, '2', 'Nguyễn Hùng Thanh Sơn', 'test@gmail.com', '$2y$12$nB3aPAa/jAp/M91Ph219huYoVWBicZJsUPjlpJphgu83eHW4eSXtq', 'admin', '2026-03-06 17:57:42', '2026-03-06 17:58:17');

-- --------------------------------------------------------

--
-- Table structure for table `lich_this`
--

CREATE TABLE `lich_this` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `mon_hoc_id` bigint(20) UNSIGNED NOT NULL,
  `ngay_thi` date NOT NULL,
  `gio_thi` time NOT NULL,
  `phong` varchar(10) NOT NULL,
  `ky_thi` varchar(50) NOT NULL,
  `nam_hoc` varchar(50) NOT NULL,
  `trang_thai` varchar(30) NOT NULL DEFAULT 'chua_dien_ra',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `lich_this`
--

INSERT INTO `lich_this` (`id`, `mon_hoc_id`, `ngay_thi`, `gio_thi`, `phong`, `ky_thi`, `nam_hoc`, `trang_thai`, `created_at`, `updated_at`) VALUES
(18, 1, '2025-11-22', '06:33:00', 'C708', 'Thi giữa kỳ HK1', '2025-2026', 'da_ket_thuc', '2025-11-21 23:32:26', '2025-11-22 00:43:07'),
(20, 1, '2025-11-22', '06:37:00', 'C706', 'Thi giữa kỳ HK1', '2025-2026', 'da_ket_thuc', '2025-11-21 23:36:31', '2025-11-22 00:43:06'),
(32, 2, '2025-11-27', '12:05:00', 'C705', 'Thi cuối kỳ HK1', '2025-2026', 'da_ket_thuc', '2025-11-26 03:35:34', '2025-12-03 03:15:57'),
(33, 1, '2025-11-26', '10:53:00', 'C705', 'Thi cuối kỳ HK1', '2025-2026', 'da_ket_thuc', '2025-11-26 03:51:19', '2025-12-03 03:15:57'),
(52, 1, '2026-03-16', '23:11:00', 'C705', 'Thi giữa kỳ HK2', '2025-2026', 'da_ket_thuc', '2026-03-16 16:09:31', '2026-03-16 20:04:20'),
(53, 2, '2026-03-18', '19:08:00', 'C705', 'Thi giữa kỳ HK2', '2025-2026', 'da_ket_thuc', '2026-03-18 12:06:27', '2026-03-18 14:03:27');

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(191) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '2025_10_05_083051_create_sinh_viens_table', 1),
(2, '2025_10_05_083255_create_giang_viens_table', 1),
(29, '2025_11_14_005112_add_hinh_thuc_dd_to_diem_danhs_table', 6),
(24, '2025_10_30_235547_create_mon_hocs_table', 4),
(28, '2025_10_05_083324_create_diem_danhs_table', 5),
(27, '2025_10_05_083313_create_phan_cong_g_v_s_table', 5),
(13, '2025_10_11_154413_add_password_to_giang_viens', 2),
(14, '2025_10_15_132142_add_vai_tro_to_giang_viens_table', 3),
(26, '2025_10_05_083304_create_lich_this_table', 5),
(30, '2025_12_16_034519_add_face_columns_to_sinh_viens_table', 7),
(32, '2025_12_16_040418_add_face_quality_to_sinh_viens', 8);

-- --------------------------------------------------------

--
-- Table structure for table `mon_hocs`
--

CREATE TABLE `mon_hocs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `ma_mon` varchar(20) NOT NULL,
  `ten_mon` varchar(100) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `mon_hocs`
--

INSERT INTO `mon_hocs` (`id`, `ma_mon`, `ten_mon`, `created_at`, `updated_at`) VALUES
(1, 'CS00038', 'Lập trình Web', '2025-10-30 17:31:35', '2025-10-30 17:31:35'),
(2, 'CS00039', 'Lập trình Windows', '2025-11-25 21:37:53', '2025-11-25 21:37:53'),
(4, 'CS00040', 'Mã nguồn mở', '2025-12-17 06:41:37', '2025-12-17 06:41:37');

-- --------------------------------------------------------

--
-- Table structure for table `phan_cong_gvs`
--

CREATE TABLE `phan_cong_gvs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `lich_thi_id` bigint(20) UNSIGNED NOT NULL,
  `giang_vien_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `phan_cong_gvs`
--

INSERT INTO `phan_cong_gvs` (`id`, `lich_thi_id`, `giang_vien_id`, `created_at`, `updated_at`) VALUES
(24, 20, 13, '2025-11-21 23:36:57', '2025-11-21 23:36:57'),
(25, 20, 15, '2025-11-21 23:37:00', '2025-11-21 23:37:00'),
(41, 33, 13, '2025-11-26 03:51:25', '2025-11-26 03:51:25'),
(42, 33, 15, '2025-11-26 03:51:28', '2025-11-26 03:51:28'),
(43, 32, 13, '2025-11-26 04:05:57', '2025-11-26 04:05:57'),
(52, 52, 16, '2026-03-16 16:09:38', '2026-03-16 16:09:38'),
(53, 53, 13, '2026-03-18 12:06:32', '2026-03-18 12:06:32'),
(54, 53, 16, '2026-03-18 12:06:37', '2026-03-18 12:06:37'),
(55, 53, 15, '2026-03-18 12:06:39', '2026-03-18 12:06:39');

-- --------------------------------------------------------

--
-- Table structure for table `sinh_viens`
--

CREATE TABLE `sinh_viens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `ma_sv` varchar(20) NOT NULL,
  `ho_ten` varchar(50) NOT NULL,
  `lop` varchar(20) NOT NULL,
  `email` varchar(191) NOT NULL,
  `hinh_anh` varchar(191) DEFAULT NULL,
  `da_train_khuon_mat` tinyint(1) NOT NULL DEFAULT 0,
  `face_ids` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`face_ids`)),
  `do_chinh_xac_tb` double DEFAULT NULL,
  `so_lan_nhan_dien` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sinh_viens`
--

INSERT INTO `sinh_viens` (`id`, `ma_sv`, `ho_ten`, `lop`, `email`, `hinh_anh`, `da_train_khuon_mat`, `face_ids`, `do_chinh_xac_tb`, `so_lan_nhan_dien`, `created_at`, `updated_at`) VALUES
(7, 'DH52201535', 'Nguyễn Thành Thuận', 'D22_TH10', 'dh52201535@student.stu.edu.vn', 'uploads/hinhanh_sv/d22_th10/DH52201535.jpg', 1, '[\"f6dc96f9-5019-4ea8-87ff-26d479636b8a\", \"5f0c21c9-65c4-4886-8e66-20986d4836bb\"]', NULL, 0, '2025-10-05 02:14:17', '2025-12-16 02:07:19'),
(8, 'DH52201086', 'Bùi Ngọc Kim Ngân', 'D22_TH09', 'dh52201086@student.stu.edu.vn', 'uploads/hinhanh_sv/d22_th09/DH52201086.jpg', 1, '[\"04fb7db3-b050-47f1-bd52-d7422e2a8e09\"]', NULL, 0, '2025-10-05 02:14:17', '2025-12-15 23:35:21'),
(9, 'DH52201131', 'Phạm Phong Nhã', 'D22_TH09', 'dh52201131@student.stu.edu.vn', 'uploads/hinhanh_sv/d22_th09/DH52201131.jpg', 1, '[\"fb11e12e-834b-4eb7-b394-326edb7a8126\"]', NULL, 0, '2025-10-05 02:14:17', '2025-12-15 23:35:19'),
(18, 'DH52201371', 'Nguyễn Hùng Thanh Sơn', 'D22_TH09', 'dh52201371@student.stu.edu.vn', 'uploads/hinhanh_sv/d22_th09/DH52201371.jpg', 1, '[\"b85524d4-9180-4f12-9164-9ba0fe88cdf5\"]', NULL, 0, '2025-10-08 09:00:59', '2026-03-22 21:41:50'),
(19, 'DH52201357', 'Ngô Hoàng Sang', 'D22_TH09', 'dh52201357@student.stu.edu.vn', 'uploads/hinhanh_sv/d22_th09/DH52201357.jpg', 1, '[\"48b11b0c-fd26-4ecb-80ad-10d5d9fddab9\"]', NULL, 0, '2025-10-08 09:00:59', '2025-12-15 23:35:23'),
(20, 'DH52201381', 'Lê Nhân Tài', 'D22_TH09', 'dh52201381@student.stu.edu.vn', 'uploads/hinhanh_sv/d22_th09/DH52201381.jpg', 1, '[\"791fbbbc-a879-4e4f-809d-cc396dd4e391\"]', 99, 0, '2025-10-08 09:00:59', '2025-12-15 23:30:58'),
(22, 'DH52201112', 'Đoàn Lê Hoàng Nguyên', 'D22_TH10', 'dh52201112@student.stu.edu.vn', 'uploads/hinhanh_sv/d22_th10/DH52201112.jpg', 1, '[\"9713ca15-c910-4404-aac9-9b5fce6481f0\"]', NULL, 0, '2025-10-08 09:53:23', '2025-12-20 23:56:21'),
(23, 'DH52201014', 'Đỗ Thành Long', 'D22_TH10', 'dh52201014@student.stu.edu.vn', 'uploads/hinhanh_sv/d22_th10/DH52201014.jpg', 1, '[\"b953f110-3d8e-4291-8bb7-10a7dae8428e\"]', NULL, 0, '2025-10-18 04:40:22', '2025-12-16 02:06:18'),
(24, 'DH52200346', 'Ngô Xuân Bắc', 'D22_TH09', 'dh52200346@student.stu.edu.vn', 'uploads/hinhanh_sv/d22_th09/DH52200346.jpg', 1, '[\"e4fbdabd-bae0-461f-b0b0-e74ea9f62dad\"]', NULL, 0, '2025-10-21 09:26:24', '2025-12-15 23:35:16'),
(25, 'DH52200965', 'Huỳnh Nhật Ký', 'D22_TH09', 'dh52200965@student.stu.edu.vn', 'uploads/hinhanh_sv/d22_th09/DH52200965.jpg', 1, '[\"0ae5298d-cf97-44b1-9f9c-eafe8a7ce461\"]', NULL, 0, '2025-12-08 18:23:56', '2025-12-15 23:30:07'),
(34, 'DH52200335', 'Phạm Đức Anh', 'D22_TH09', 'dh52200335@student.stu.edu.vn', NULL, 1, '[\"240bf187-3811-46ec-a087-cb711987a5d1\"]', NULL, 0, '2025-12-16 01:20:28', '2026-01-15 12:35:06'),
(35, 'DH52200343', 'Võ Minh Anh', 'D22_TH09', 'dh52200343@student.stu.edu.vn', 'uploads/hinhanh_sv/d22_th09/DH52200343.jpg', 1, '[\"2563a51a-0128-42ce-9b42-f2db3eef8ed3\"]', NULL, 0, '2025-12-16 01:20:28', '2025-12-16 02:04:50'),
(36, 'DH52200353', 'Đỗ Gia Bảo', 'D22_TH09', 'dh52200353@student.stu.edu.vn', 'uploads/hinhanh_sv/d22_th09/DH52200353.jpg', 1, '[\"4427dfa7-390d-4672-bb94-09ab33cff700\"]', NULL, 0, '2025-12-16 01:20:28', '2025-12-16 02:04:52'),
(37, 'DH52200363', 'Ngô Gia Bảo', 'D22_TH09', 'dh52200363@student.stu.edu.vn', 'uploads/hinhanh_sv/d22_th09/DH52200363.jpg', 1, '[\"77a02011-0e0a-4d8a-85fd-c5797798aad9\"]', NULL, 0, '2025-12-16 01:20:28', '2025-12-16 02:04:55'),
(38, 'DH52200370', 'Nguyễn Lê Gia Bảo', 'D22_TH09', 'dh52200370@student.stu.edu.vn', 'uploads/hinhanh_sv/d22_th09/DH52200370.jpg', 1, '[\"c5b3bebf-12f2-482f-9468-24e6f4227679\"]', NULL, 0, '2025-12-16 01:20:28', '2025-12-16 02:04:59'),
(39, 'DH52200386', 'Đặng Duy Bình', 'D22_TH09', 'dh52200386@student.stu.edu.vn', 'uploads/hinhanh_sv/d22_th09/DH52200386.jpg', 1, '[\"940b005e-a16e-4433-8e6c-e548b4bc4e9b\"]', NULL, 0, '2025-12-16 01:20:28', '2025-12-16 02:04:57'),
(40, 'DH52200402', 'Đoàn Văn Cần', 'D22_TH09', 'dh52200402@student.stu.edu.vn', 'uploads/hinhanh_sv/d22_th09/DH52200402.jpg', 1, '[\"f93b627e-1faf-4acb-af8a-fdd3b758f7ce\"]', NULL, 0, '2025-12-16 01:20:28', '2025-12-16 02:05:02'),
(41, 'DH52200417', 'Nguyễn Hồng Cơ', 'D22_TH09', 'dh52200417@student.stu.edu.vn', 'uploads/hinhanh_sv/d22_th09/DH52200417.jpg', 1, '[\"0767427e-961d-4ea1-97b8-220b23ad6c5f\"]', NULL, 0, '2025-12-16 01:20:28', '2025-12-16 02:05:04'),
(42, 'DH52200418', 'Nguyễn Thành Công', 'D22_TH09', 'dh52200418@student.stu.edu.vn', 'uploads/hinhanh_sv/d22_th09/DH52200418.jpg', 1, '[\"30325b70-86c5-4dc7-bcb2-b85fd6e6aba7\"]', NULL, 0, '2025-12-16 01:20:28', '2025-12-16 02:05:09'),
(43, 'DH52200476', 'Nguyễn Công Đạt', 'D22_TH09', 'dh52200476@student.stu.edu.vn', 'uploads/hinhanh_sv/d22_th09/DH52200476.jpg', 1, '[\"43a12c6e-5785-4c47-8c97-f26b556d5a45\"]', NULL, 0, '2025-12-16 01:20:28', '2025-12-16 02:05:06'),
(44, 'DH52200514', 'Phan Võ Minh Đồng', 'D22_TH09', 'dh52200514@student.stu.edu.vn', 'uploads/hinhanh_sv/d22_th09/DH52200514.jpg', 1, '[\"419d9b23-8cb3-4b11-b05d-1336c8ca4d10\"]', NULL, 0, '2025-12-16 01:20:28', '2025-12-16 02:05:11'),
(45, 'DH52200516', 'Đoàn Tiến Đức', 'D22_TH09', 'dh52200516@student.stu.edu.vn', 'uploads/hinhanh_sv/d22_th09/DH52200516.jpg', 1, '[\"c57ff0a9-53f4-4d3c-aa3b-8beb69eeeff7\"]', NULL, 0, '2025-12-16 01:20:28', '2025-12-16 02:05:16'),
(46, 'DH52200568', 'Nguyễn Khánh Duy', 'D22_TH09', 'dh52200568@student.stu.edu.vn', 'uploads/hinhanh_sv/d22_th09/DH52200568.jpg', 1, '[\"e507647e-bcd9-46bc-bc1b-aee7f36b5b9c\"]', NULL, 0, '2025-12-16 01:20:28', '2026-01-15 12:58:51'),
(47, 'DH52200577', 'Nguyễn Tuấn Duy', 'D22_TH09', 'dh52200577@student.stu.edu.vn', 'uploads/hinhanh_sv/d22_th09/DH52200577.jpg', 1, '[\"e0253b2f-d528-4d6c-9998-634c996b2fb8\"]', NULL, 0, '2025-12-16 01:20:28', '2025-12-16 02:05:18'),
(48, 'DH52200589', 'Trần Khương Duy', 'D22_TH09', 'dh52200589@student.stu.edu.vn', 'uploads/hinhanh_sv/d22_th09/DH52200589.jpg', 1, '[\"2a0fe899-3fb7-4e09-9004-bbc2fe8f72a9\"]', NULL, 0, '2025-12-16 01:20:28', '2025-12-16 02:05:21'),
(49, 'DH52200594', 'Đoàn Trần Ngọc Duyên', 'D22_TH09', 'dh52200594@student.stu.edu.vn', 'uploads/hinhanh_sv/d22_th09/DH52200594.jpg', 1, '[\"7d7416df-4a2f-44ee-9db5-c6eee2e8d6bc\"]', NULL, 0, '2025-12-16 01:20:28', '2025-12-16 02:05:23'),
(50, 'DH52200605', 'Hoàng Văn Giáp', 'D22_TH09', 'dh52200605@student.stu.edu.vn', 'uploads/hinhanh_sv/d22_th09/DH52200605.jpg', 1, '[\"d0460858-7431-4db7-b5c7-3f660f96c1be\"]', NULL, 0, '2025-12-16 01:20:28', '2025-12-16 02:05:28'),
(51, 'DH52200606', 'Lê Nguyên Giáp', 'D22_TH09', 'dh52200606@student.stu.edu.vn', 'uploads/hinhanh_sv/d22_th09/DH52200606.jpg', 1, '[\"6d3139ad-9609-414e-a784-1c19528e1e61\"]', NULL, 0, '2025-12-16 01:20:28', '2025-12-16 02:05:25'),
(52, 'DH52200613', 'Nguyễn Thị Thu Hà', 'D22_TH09', 'dh52200613@student.stu.edu.vn', 'uploads/hinhanh_sv/d22_th09/DH52200613.jpg', 1, '[\"f2550d3b-4952-480e-87ba-95460b18ab61\"]', NULL, 0, '2025-12-16 01:20:28', '2025-12-16 02:05:30'),
(53, 'DH52200638', 'Nguyễn Trường Trí Hào', 'D22_TH09', 'dh52200638@student.stu.edu.vn', 'uploads/hinhanh_sv/d22_th09/DH52200638.jpg', 1, '[\"d8f0c4ee-de3d-4712-809e-ddbd3e9e872b\"]', NULL, 0, '2025-12-16 01:20:28', '2025-12-16 02:05:32'),
(54, 'DH52200649', 'Ngô Công Hậu', 'D22_TH09', 'dh52200649@student.stu.edu.vn', 'uploads/hinhanh_sv/d22_th09/DH52200649.jpg', 1, '[\"0f7d56e3-1c2a-4c14-a24b-0a508556d3d6\"]', NULL, 0, '2025-12-16 01:20:28', '2025-12-16 02:05:34'),
(55, 'DH52200688', 'Phạm Văn Hiếu', 'D22_TH09', 'dh52200688@student.stu.edu.vn', 'uploads/hinhanh_sv/d22_th09/DH52200688.jpg', 1, '[\"c3da940d-95c6-497a-94e7-55aadeb71a09\"]', NULL, 0, '2025-12-16 01:20:28', '2025-12-16 02:05:39'),
(56, 'DH52200704', 'Lê Cao Việt Hoàng', 'D22_TH09', 'dh52200704@student.stu.edu.vn', 'uploads/hinhanh_sv/d22_th09/DH52200704.jpg', 1, '[\"0e1b6f6b-6f2f-40b2-8889-b3c16c40b882\"]', NULL, 0, '2025-12-16 01:20:28', '2025-12-16 02:05:37'),
(57, 'DH52200734', 'Trần Minh Hùng', 'D22_TH09', 'dh52200734@student.stu.edu.vn', 'uploads/hinhanh_sv/d22_th09/DH52200734.jpg', 1, '[\"de3098da-7e9e-4634-b9e4-21146d53dfb4\"]', NULL, 0, '2025-12-16 01:20:28', '2025-12-16 02:05:42'),
(58, 'DH52200737', 'Nguyễn Hoàng Hưng', 'D22_TH09', 'dh52200737@student.stu.edu.vn', 'uploads/hinhanh_sv/d22_th09/DH52200737.jpg', 1, '[\"36be9c0e-4f3b-42f2-9818-84ccc87826e4\"]', NULL, 0, '2025-12-16 01:20:28', '2025-12-16 02:05:44'),
(59, 'DH52200746', 'Trần Huy Khải Hưng', 'D22_TH09', 'dh52200746@student.stu.edu.vn', 'uploads/hinhanh_sv/d22_th09/DH52200746.jpg', 1, '[\"a8032c29-f990-42dd-a54c-e29afaf0903e\"]', NULL, 0, '2025-12-16 01:20:28', '2025-12-16 02:05:46'),
(60, 'DH52200764', 'Đoàn Hoàng Huy', 'D22_TH09', 'dh52200764@student.stu.edu.vn', 'uploads/hinhanh_sv/d22_th09/DH52200764.jpg', 1, '[\"0185452a-5c78-4f22-9855-8d75dc437d0f\"]', NULL, 0, '2025-12-16 01:20:28', '2025-12-16 02:05:49'),
(61, 'DH52200781', 'Nguyễn Ngọc Huy', 'D22_TH09', 'dh52200781@student.stu.edu.vn', 'uploads/hinhanh_sv/d22_th09/DH52200781.jpg', 1, '[\"51f53143-7a2f-4c39-9a1e-44467fd02db2\"]', NULL, 0, '2025-12-16 01:20:28', '2025-12-16 02:05:51'),
(62, 'DH52200795', 'Phạm Nguyễn Nhật Huy', 'D22_TH09', 'dh52200795@student.stu.edu.vn', 'uploads/hinhanh_sv/d22_th09/DH52200795.jpg', 1, '[\"64ab3e1f-7940-48b5-8f1a-e6d66d2fea2d\"]', NULL, 0, '2025-12-16 01:20:28', '2025-12-16 02:05:53'),
(63, 'DH52200837', 'Lê Duy Khang', 'D22_TH09', 'dh52200837@student.stu.edu.vn', 'uploads/hinhanh_sv/d22_th09/DH52200837.jpg', 1, '[\"f6d8e7f7-f04f-42d1-a3b7-cf34fa7896ba\"]', NULL, 0, '2025-12-16 01:20:28', '2025-12-16 02:05:56'),
(64, 'DH52200856', 'Vũ Đình Khang', 'D22_TH09', 'dh52200856@student.stu.edu.vn', 'uploads/hinhanh_sv/d22_th09/DH52200856.jpg', 1, '[\"1bb70bd1-8e43-457e-ab57-4204628269e6\"]', NULL, 0, '2025-12-16 01:20:28', '2025-12-16 02:05:58'),
(65, 'DH52200873', 'Nguyễn Đào Minh Khánh', 'D22_TH09', 'dh52200873@student.stu.edu.vn', 'uploads/hinhanh_sv/d22_th09/DH52200873.jpg', 1, '[\"f94c67fd-4f41-4952-ae61-45b864028240\"]', NULL, 0, '2025-12-16 01:20:28', '2025-12-16 02:06:00'),
(66, 'DH52200874', 'Nguyễn Duy Khánh', 'D22_TH09', 'dh52200874@student.stu.edu.vn', 'uploads/hinhanh_sv/d22_th09/DH52200874.jpg', 1, '[\"9624da73-37c6-47db-87ed-6d41c199edf7\"]', NULL, 0, '2025-12-16 01:20:28', '2025-12-16 02:06:02'),
(67, 'DH52200881', 'Nguyễn Xuân Khánh', 'D22_TH09', 'dh52200881@student.stu.edu.vn', 'uploads/hinhanh_sv/d22_th09/DH52200881.jpg', 1, '[\"f4c9e885-510d-40e1-9dc1-e2ac8c515cd4\"]', NULL, 0, '2025-12-16 01:20:28', '2025-12-16 02:06:05'),
(68, 'DH52200913', 'Nguyễn Minh Khoa', 'D22_TH09', 'dh52200913@student.stu.edu.vn', 'uploads/hinhanh_sv/d22_th09/DH52200913.jpg', 1, '[\"cd97c38c-9b6a-48f3-8a02-6986dfbbac39\"]', NULL, 0, '2025-12-16 01:20:28', '2025-12-16 02:06:07'),
(69, 'DH52200928', 'Nguyễn Đăng Khôi', 'D22_TH09', 'dh52200928@student.stu.edu.vn', 'uploads/hinhanh_sv/d22_th09/DH52200928.jpg', 1, '[\"38f055f5-c030-4ad1-a744-f094a4c35f38\"]', NULL, 0, '2025-12-16 01:20:28', '2025-12-16 02:06:09'),
(70, 'DH52200939', 'Nguyễn Hữu Kiên', 'D22_TH09', 'dh52200939@student.stu.edu.vn', 'uploads/hinhanh_sv/d22_th09/DH52200939.jpg', 1, '[\"1dd3779b-eede-447d-872d-2830ca0f6832\"]', NULL, 0, '2025-12-16 01:20:28', '2025-12-16 02:06:11'),
(71, 'DH52200960', 'Võ Gia Kiệt', 'D22_TH09', 'dh52200960@student.stu.edu.vn', 'uploads/hinhanh_sv/d22_th09/DH52200960.jpg', 1, '[\"12d0923c-c6e8-468e-be15-0a765eb7c5cd\"]', NULL, 0, '2025-12-16 01:20:28', '2025-12-16 02:06:14'),
(72, 'DH52200978', 'Phan Công Lập', 'D22_TH09', 'dh52200978@student.stu.edu.vn', 'uploads/hinhanh_sv/d22_th09/DH52200978.jpg', 1, '[\"f13740b9-e121-4fd8-9578-c2ac752fefb9\"]', NULL, 0, '2025-12-16 01:20:28', '2025-12-16 02:06:16'),
(73, 'DH52200999', 'Nguyễn Hữu Lộc', 'D22_TH09', 'dh52200999@student.stu.edu.vn', 'uploads/hinhanh_sv/d22_th09/DH52200999.jpg', 1, '[\"c6c79c08-28b6-45af-885f-951bdc6ba413\"]', NULL, 0, '2025-12-16 01:20:28', '2025-12-16 02:06:21'),
(74, 'DH52201003', 'Phạm Tấn Lộc', 'D22_TH09', 'dh52201003@student.stu.edu.vn', 'uploads/hinhanh_sv/d22_th09/DH52201003.jpg', 1, '[\"57ad91ee-c932-47b2-94f1-8748b1bfeec7\"]', NULL, 0, '2025-12-16 01:20:28', '2025-12-16 02:06:23'),
(75, 'DH52201006', 'Trần Trung Lộc', 'D22_TH09', 'dh52201006@student.stu.edu.vn', 'uploads/hinhanh_sv/d22_th09/DH52201006.jpg', 1, '[\"68078545-3922-460d-b4e1-91f7d7937484\"]', NULL, 0, '2025-12-16 01:20:28', '2025-12-16 02:06:25'),
(76, 'DH52201026', 'Phan Thành Long', 'D22_TH09', 'dh52201026@student.stu.edu.vn', 'uploads/hinhanh_sv/d22_th09/DH52201026.jpg', 1, '[\"69c45c72-27fb-449f-9b28-7765e5ea037d\"]', NULL, 0, '2025-12-16 01:20:28', '2025-12-16 02:06:28'),
(77, 'DH52201044', 'Hồ Minh Mẫn', 'D22_TH09', 'dh52201044@student.stu.edu.vn', 'uploads/hinhanh_sv/d22_th09/DH52201044.jpg', 1, '[\"be0579c7-15d1-47ba-a67b-4ed62a963215\"]', NULL, 0, '2025-12-16 01:20:28', '2025-12-16 02:06:35'),
(78, 'DH52201048', 'Nguyễn Tuấn Mạnh', 'D22_TH09', 'dh52201048@student.stu.edu.vn', 'uploads/hinhanh_sv/d22_th09/DH52201048.jpg', 1, '[\"08268ea4-9cbd-458f-bc05-3d754794cc05\"]', NULL, 0, '2025-12-16 01:20:28', '2025-12-16 02:06:30'),
(79, 'DH52201052', 'Hồ Sỹ Minh', 'D22_TH09', 'dh52201052@student.stu.edu.vn', 'uploads/hinhanh_sv/d22_th09/DH52201052.jpg', 1, '[\"7e58d08b-2cbd-49f6-b549-8a3e12631fce\"]', NULL, 0, '2025-12-16 01:20:28', '2025-12-16 02:06:32'),
(80, 'DH52201127', 'Trương Nhã Nguyên', 'D22_TH09', 'dh52201127@student.stu.edu.vn', 'uploads/hinhanh_sv/d22_th09/DH52201127.jpg', 1, '[\"0bdd98d5-c8ab-44cb-953f-d35cb9a06dc8\"]', NULL, 0, '2025-12-16 01:20:28', '2025-12-16 02:06:40'),
(81, 'DH52201189', 'Nguyễn Lê Tiến Phát', 'D22_TH09', 'dh52201189@student.stu.edu.vn', 'uploads/hinhanh_sv/d22_th09/DH52201189.jpg', 1, '[\"b888f0d1-d49e-488c-9e9e-13a13e87c06d\"]', NULL, 0, '2025-12-16 01:20:29', '2025-12-16 02:06:44'),
(82, 'DH52201209', 'Lê Ngọc Phong', 'D22_TH09', 'dh52201209@student.stu.edu.vn', 'uploads/hinhanh_sv/d22_th09/DH52201209.jpg', 1, '[\"16a55d6c-34e7-49f6-875c-59431abddb9d\"]', NULL, 0, '2025-12-16 01:20:29', '2025-12-16 02:06:42'),
(83, 'DH52201321', 'Nguyễn Anh Quốc', 'D22_TH09', 'dh52201321@student.stu.edu.vn', 'uploads/hinhanh_sv/d22_th09/DH52201321.jpg', 1, '[\"a196a401-97a9-4c0b-bb3f-700381db6521\"]', NULL, 0, '2025-12-16 01:20:29', '2025-12-16 02:06:49'),
(84, 'DH52201329', 'Mai Anh Quý', 'D22_TH09', 'dh52201329@student.stu.edu.vn', 'uploads/hinhanh_sv/d22_th09/DH52201329.jpg', 1, '[\"0ef32f3e-42bc-453c-9c31-58a209824778\"]', NULL, 0, '2025-12-16 01:20:29', '2025-12-16 02:06:46'),
(85, 'DH52201355', 'Huỳnh Minh Sang', 'D22_TH09', 'dh52201355@student.stu.edu.vn', 'uploads/hinhanh_sv/d22_th09/DH52201355.jpg', 1, '[\"3100fe61-7e93-4f64-9dbc-4b86204992ba\"]', NULL, 0, '2025-12-16 01:20:29', '2025-12-16 02:06:51'),
(86, 'DH52201368', 'Lý Quốc Sơn', 'D22_TH09', 'dh52201368@student.stu.edu.vn', 'uploads/hinhanh_sv/d22_th09/DH52201368.jpg', 1, '[\"6566c63e-465e-4ac7-b83d-e9bfacacca9e\"]', NULL, 0, '2025-12-16 01:20:29', '2025-12-16 02:06:54'),
(87, 'DH52201386', 'Nguyễn Đức Tài', 'D22_TH09', 'dh52201386@student.stu.edu.vn', 'uploads/hinhanh_sv/d22_th09/DH52201386.jpg', 1, '[\"4bb956d9-f0c0-4f00-9685-ab5a2b05bcde\"]', NULL, 0, '2025-12-16 01:20:29', '2025-12-16 02:06:56'),
(88, 'DH52201397', 'Võ Văn Tài', 'D22_TH09', 'dh52201397@student.stu.edu.vn', 'uploads/hinhanh_sv/d22_th09/DH52201397.jpg', 1, '[\"e4ae2d8f-f0ae-4925-a7b7-e9e20e136e7b\"]', NULL, 0, '2025-12-16 01:20:29', '2025-12-16 02:06:58'),
(89, 'DH52201398', 'Vương Thái Tài', 'D22_TH09', 'dh52201398@student.stu.edu.vn', 'uploads/hinhanh_sv/d22_th09/DH52201398.jpg', 1, '[\"99962f06-c90f-4398-b815-82186f5b9835\"]', NULL, 0, '2025-12-16 01:20:29', '2025-12-16 02:07:01'),
(90, 'DH52201413', 'Đặng Mạnh Tấn', 'D22_TH09', 'dh52201413@student.stu.edu.vn', 'uploads/hinhanh_sv/d22_th09/DH52201413.jpg', 1, '[\"86249116-7536-4fcb-904b-d9bf038ec97e\"]', NULL, 0, '2025-12-16 01:20:29', '2025-12-16 02:07:03'),
(91, 'DH52201414', 'Nguyễn Công Tấn', 'D22_TH09', 'dh52201414@student.stu.edu.vn', 'uploads/hinhanh_sv/d22_th09/DH52201414.jpg', 1, '[\"0df4f536-0481-421c-af7f-933838f71d16\"]', NULL, 0, '2025-12-16 01:20:29', '2025-12-16 02:07:05'),
(92, 'DH52201438', 'Nguyễn Quang Thắng', 'D22_TH09', 'dh52201438@student.stu.edu.vn', 'uploads/hinhanh_sv/d22_th09/DH52201438.jpg', 1, '[\"e939aba8-9479-4dcb-9529-443eaa95a8be\"]', NULL, 0, '2025-12-16 01:20:29', '2025-12-16 02:07:08'),
(93, 'DH52201470', 'Võ Thị Xuân Thao', 'D22_TH09', 'dh52201470@student.stu.edu.vn', 'uploads/hinhanh_sv/d22_th09/DH52201470.jpg', 1, '[\"23c082cf-320b-4267-b452-fd722a420e90\"]', NULL, 0, '2025-12-16 01:20:29', '2025-12-16 02:07:10'),
(94, 'DH52201474', 'Nguyễn ái Phương Thảo', 'D22_TH09', 'dh52201474@student.stu.edu.vn', 'uploads/hinhanh_sv/d22_th09/DH52201474.jpg', 1, '[\"a57ea0c5-6da4-4597-abb8-a28eea7bdfde\"]', NULL, 0, '2025-12-16 01:20:29', '2025-12-16 02:07:12'),
(95, 'DH52201488', 'Trần Quang Thiện', 'D22_TH09', 'dh52201488@student.stu.edu.vn', 'uploads/hinhanh_sv/d22_th09/DH52201488.jpg', 1, '[\"a819205d-4ddf-4527-81f3-c536be8ace68\"]', NULL, 0, '2025-12-16 01:20:29', '2025-12-16 02:07:15'),
(96, 'DH52201510', 'Võ Thị Kiều Thơ', 'D22_TH09', 'dh52201510@student.stu.edu.vn', 'uploads/hinhanh_sv/d22_th09/DH52201510.jpg', 1, '[\"d5bbb90c-d049-40cf-8cef-ae42de5b2851\"]', NULL, 0, '2025-12-16 01:20:29', '2025-12-16 02:07:17'),
(97, 'DH52201565', 'Bùi Tấn Tín', 'D22_TH09', 'dh52201565@student.stu.edu.vn', 'uploads/hinhanh_sv/d22_th09/DH52201565.jpg', 1, '[\"338a20e1-5642-4905-bc3e-dfe6472a1884\"]', NULL, 0, '2025-12-16 01:20:29', '2025-12-16 02:07:22'),
(98, 'DH52201641', 'Nguyễn Minh Triết', 'D22_TH09', 'dh52201641@student.stu.edu.vn', 'uploads/hinhanh_sv/d22_th09/DH52201641.jpg', 1, '[\"c2e1c37f-0c40-4f60-a257-4846e0eced3b\"]', NULL, 0, '2025-12-16 01:20:29', '2025-12-16 02:07:24'),
(99, 'DH52201740', 'Nguyễn Minh Tuyến', 'D22_TH09', 'dh52201740@student.stu.edu.vn', 'uploads/hinhanh_sv/d22_th09/DH52201740.jpg', 1, '[\"66687e44-4aa9-4170-9eda-b283c18ea0fe\"]', NULL, 0, '2025-12-16 01:20:29', '2025-12-16 02:07:26'),
(100, 'DH52201743', 'Nguyễn Thị Hoàng Uyên', 'D22_TH09', 'dh52201743@student.stu.edu.vn', 'uploads/hinhanh_sv/d22_th09/DH52201743.jpg', 1, '[\"9ddcb5c9-9b62-44d8-86a5-53ab132dda21\"]', NULL, 0, '2025-12-16 01:20:29', '2025-12-16 02:07:29'),
(101, 'DH52110555', 'Ngô Tuấn Anh', 'D21_TH13', 'dh52110555@student.stu.edu.vn', 'uploads/hinhanh_sv/d21_th13/DH52110555.jpg', 1, '[\"77b80d0a-c130-4794-8adb-dc1b1dc61a2a\"]', NULL, 0, '2026-01-15 12:42:14', '2026-01-15 12:43:52'),
(102, 'DH52200548', 'qq DH52200548', 'D26_TH09', 'DH52200548@student.stu.edu.vn', 'uploads/hinhanh_sv/d26_th09/DH52200548.jpg', 0, NULL, NULL, 0, '2026-01-15 12:54:48', '2026-01-15 12:54:48');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `diem_danhs`
--
ALTER TABLE `diem_danhs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `diem_danhs_lich_thi_id_sinh_vien_id_unique` (`lich_thi_id`,`sinh_vien_id`),
  ADD KEY `fk_diemdanh_sinhvien` (`sinh_vien_id`);

--
-- Indexes for table `giang_viens`
--
ALTER TABLE `giang_viens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `giang_viens_ma_gv_unique` (`ma_gv`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `lich_this`
--
ALTER TABLE `lich_this`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_lichthi_monhoc` (`mon_hoc_id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `mon_hocs`
--
ALTER TABLE `mon_hocs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `mon_hocs_ma_mon_unique` (`ma_mon`);

--
-- Indexes for table `phan_cong_gvs`
--
ALTER TABLE `phan_cong_gvs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `idx_unique_phancong` (`lich_thi_id`,`giang_vien_id`),
  ADD KEY `fk_phancong_giangvien` (`giang_vien_id`);

--
-- Indexes for table `sinh_viens`
--
ALTER TABLE `sinh_viens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `sinh_viens_ma_sv_unique` (`ma_sv`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `diem_danhs`
--
ALTER TABLE `diem_danhs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=89;

--
-- AUTO_INCREMENT for table `giang_viens`
--
ALTER TABLE `giang_viens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `lich_this`
--
ALTER TABLE `lich_this`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=54;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `mon_hocs`
--
ALTER TABLE `mon_hocs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `phan_cong_gvs`
--
ALTER TABLE `phan_cong_gvs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=56;

--
-- AUTO_INCREMENT for table `sinh_viens`
--
ALTER TABLE `sinh_viens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=103;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `diem_danhs`
--
ALTER TABLE `diem_danhs`
  ADD CONSTRAINT `fk_diemdanh_lichthi` FOREIGN KEY (`lich_thi_id`) REFERENCES `lich_this` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_diemdanh_sinhvien` FOREIGN KEY (`sinh_vien_id`) REFERENCES `sinh_viens` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `lich_this`
--
ALTER TABLE `lich_this`
  ADD CONSTRAINT `fk_lichthi_monhoc` FOREIGN KEY (`mon_hoc_id`) REFERENCES `mon_hocs` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `phan_cong_gvs`
--
ALTER TABLE `phan_cong_gvs`
  ADD CONSTRAINT `fk_phancong_giangvien` FOREIGN KEY (`giang_vien_id`) REFERENCES `giang_viens` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_phancong_lichthi` FOREIGN KEY (`lich_thi_id`) REFERENCES `lich_this` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
