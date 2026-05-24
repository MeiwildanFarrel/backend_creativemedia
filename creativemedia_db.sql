-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 24, 2026 at 12:17 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `creativemedia_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `jadwal_interview`
--

CREATE TABLE `jadwal_interview` (
  `id` int(11) NOT NULL,
  `id_lamaran` int(11) NOT NULL,
  `jadwal` datetime NOT NULL,
  `lokasi` varchar(255) NOT NULL,
  `catatan` text DEFAULT NULL,
  `status` enum('terjadwal','selesai','dibatalkan') DEFAULT 'terjadwal',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `kategori_pekerjaan`
--

CREATE TABLE `kategori_pekerjaan` (
  `id` int(11) NOT NULL,
  `nama` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `kategori_pekerjaan`
--

INSERT INTO `kategori_pekerjaan` (`id`, `nama`, `created_at`, `updated_at`) VALUES
(1, 'Pengembangan Web', '2026-05-09 14:34:02', '2026-05-09 14:34:02'),
(3, 'social media enthusiast', '2026-05-09 14:35:44', '2026-05-09 14:35:44'),
(4, 'social media manager', '2026-05-09 14:35:52', '2026-05-09 14:35:52');

-- --------------------------------------------------------

--
-- Table structure for table `lamaran_kerja`
--

CREATE TABLE `lamaran_kerja` (
  `id` int(11) NOT NULL,
  `id_lowongan` int(11) NOT NULL,
  `id_pelamar` int(11) NOT NULL,
  `surat_lamaran` text DEFAULT NULL,
  `url_cv` varchar(255) DEFAULT NULL,
  `status` enum('dilamar','ditinjau','interview','diterima','ditolak') DEFAULT 'dilamar',
  `dilamar_pada` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `shortlisted` tinyint(1) DEFAULT 0,
  `skor_kecocokan` float DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `lowongan_kerja`
--

CREATE TABLE `lowongan_kerja` (
  `id` int(11) NOT NULL,
  `id_perusahaan` int(11) NOT NULL,
  `id_kategori` int(11) NOT NULL,
  `judul` varchar(100) NOT NULL,
  `deskripsi` text NOT NULL,
  `lokasi` varchar(100) NOT NULL,
  `keahlian_dibutuhkan` text NOT NULL,
  `pendidikan_dibutuhkan` varchar(100) NOT NULL,
  `pengalaman_dibutuhkan` int(11) NOT NULL,
  `status` enum('buka','tutup') DEFAULT 'buka',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `profil_pelamar`
--

CREATE TABLE `profil_pelamar` (
  `id` int(11) NOT NULL,
  `id_pengguna` int(11) NOT NULL,
  `nama_lengkap` varchar(100) NOT NULL,
  `telepon` varchar(20) NOT NULL,
  `lokasi` varchar(100) NOT NULL,
  `pendidikan` text NOT NULL,
  `pengalaman` text NOT NULL,
  `keahlian` text NOT NULL,
  `url_cv` varchar(255) DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `profil_pelamar`
--

INSERT INTO `profil_pelamar` (`id`, `id_pengguna`, `nama_lengkap`, `telepon`, `lokasi`, `pendidikan`, `pengalaman`, `keahlian`, `url_cv`, `bio`, `created_at`, `updated_at`) VALUES
(1, 2, 'Budi Santoso Martadireja', '08123456789', 'Bandung', 'S1 Teknik Informatika', '2 tahun sebagai frontend developer', 'JavaScript, React, Node.js', '/uploads/cv-2-1778329573655-762246317.pdf', 'Saya adalah developer yang berpengalaman', '2026-05-09 12:26:13', '2026-05-09 12:29:39');

-- --------------------------------------------------------

--
-- Table structure for table `profil_perusahaan`
--

CREATE TABLE `profil_perusahaan` (
  `id` int(11) NOT NULL,
  `id_pengguna` int(11) NOT NULL,
  `nama_perusahaan` varchar(100) NOT NULL,
  `industri` varchar(100) NOT NULL,
  `lokasi` varchar(100) NOT NULL,
  `deskripsi` text NOT NULL,
  `situs_web` varchar(255) DEFAULT NULL,
  `url_logo` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `profil_perusahaan`
--

INSERT INTO `profil_perusahaan` (`id`, `id_pengguna`, `nama_perusahaan`, `industri`, `lokasi`, `deskripsi`, `situs_web`, `url_logo`, `created_at`, `updated_at`) VALUES
(1, 4, 'Creative Studio Indonesia', 'Kreatif', 'Jakarta Selatan', 'Perusahaan yang bergerak di bidang pengembangan aplikasi mobile dan web untuk klien korporat', 'https://pixelstudio.id', '/uploads/logo-4-1778334647090-780020503.jpeg', '2026-05-09 13:50:47', '2026-05-09 14:21:53');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('admin','pelamar','perusahaan','recruiter') DEFAULT 'pelamar',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password_hash`, `role`, `created_at`, `updated_at`) VALUES
(1, 'tes hrd1', 'hrd1@gmail.com.com', '$2b$10$3SZmMU3wRgm0RAXzU0KiMeD.6d58GzNr5q5ngFYzYC07MrBN2FO.G', 'recruiter', '2026-05-02 03:34:24', '2026-05-09 06:44:51'),
(2, 'tes pelamar', 'pelamar@gmail.com.com', '$2b$10$xxdttMRR.qJLEpx7fhAMwum1TRuhAFW7VcdNSJvvoiom3qAQyOfWK', 'pelamar', '2026-05-02 03:39:13', '2026-05-02 03:39:13'),
(3, 'tes admin', 'admin@gmail.com.com', '$2b$10$yUNEbyBn1cE34lNdHQrZI.rZjseHKPUGWCMAXM1LS6NWQLHIoIblK', 'admin', '2026-05-02 03:40:29', '2026-05-02 03:40:29'),
(4, 'tes perusahaan', 'perusahaan@gmail.com', '$2b$10$4Ols1keRfZocNCStC4jXcOuwIwPF/7BnT.aLJjj16HqXb3Kso97wa', 'perusahaan', '2026-05-09 13:50:16', '2026-05-09 13:50:16'),
(5, 'tes pelamar2', 'pelamar2@gmail.com', '$2b$10$bgJqcv9JtwIwcYN.b4y0aOvbG9o0/sLw8jjUMtsYpx9Wka8BjIhCW', 'pelamar', '2026-05-09 15:48:02', '2026-05-09 15:48:02');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `jadwal_interview`
--
ALTER TABLE `jadwal_interview`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_lamaran` (`id_lamaran`);

--
-- Indexes for table `kategori_pekerjaan`
--
ALTER TABLE `kategori_pekerjaan`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nama` (`nama`);

--
-- Indexes for table `lamaran_kerja`
--
ALTER TABLE `lamaran_kerja`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unik_lamaran` (`id_lowongan`,`id_pelamar`),
  ADD KEY `id_pelamar` (`id_pelamar`);

--
-- Indexes for table `lowongan_kerja`
--
ALTER TABLE `lowongan_kerja`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_perusahaan` (`id_perusahaan`),
  ADD KEY `id_kategori` (`id_kategori`);

--
-- Indexes for table `profil_pelamar`
--
ALTER TABLE `profil_pelamar`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id_pengguna` (`id_pengguna`);

--
-- Indexes for table `profil_perusahaan`
--
ALTER TABLE `profil_perusahaan`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id_pengguna` (`id_pengguna`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `jadwal_interview`
--
ALTER TABLE `jadwal_interview`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `kategori_pekerjaan`
--
ALTER TABLE `kategori_pekerjaan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `lamaran_kerja`
--
ALTER TABLE `lamaran_kerja`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `lowongan_kerja`
--
ALTER TABLE `lowongan_kerja`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `profil_pelamar`
--
ALTER TABLE `profil_pelamar`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `profil_perusahaan`
--
ALTER TABLE `profil_perusahaan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `jadwal_interview`
--
ALTER TABLE `jadwal_interview`
  ADD CONSTRAINT `jadwal_interview_ibfk_1` FOREIGN KEY (`id_lamaran`) REFERENCES `lamaran_kerja` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `lamaran_kerja`
--
ALTER TABLE `lamaran_kerja`
  ADD CONSTRAINT `lamaran_kerja_ibfk_1` FOREIGN KEY (`id_lowongan`) REFERENCES `lowongan_kerja` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `lamaran_kerja_ibfk_2` FOREIGN KEY (`id_pelamar`) REFERENCES `profil_pelamar` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `lowongan_kerja`
--
ALTER TABLE `lowongan_kerja`
  ADD CONSTRAINT `lowongan_kerja_ibfk_1` FOREIGN KEY (`id_perusahaan`) REFERENCES `profil_perusahaan` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `lowongan_kerja_ibfk_2` FOREIGN KEY (`id_kategori`) REFERENCES `kategori_pekerjaan` (`id`);

--
-- Constraints for table `profil_pelamar`
--
ALTER TABLE `profil_pelamar`
  ADD CONSTRAINT `profil_pelamar_ibfk_1` FOREIGN KEY (`id_pengguna`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `profil_perusahaan`
--
ALTER TABLE `profil_perusahaan`
  ADD CONSTRAINT `profil_perusahaan_ibfk_1` FOREIGN KEY (`id_pengguna`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
