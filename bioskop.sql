-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 05, 2021 at 08:38 PM
-- Server version: 10.4.17-MariaDB
-- PHP Version: 8.0.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `bioskop`
--

-- --------------------------------------------------------

--
-- Table structure for table `filmovi`
--

CREATE TABLE `filmovi` (
  `id` int(11) UNSIGNED NOT NULL,
  `naziv` varchar(30) NOT NULL,
  `izvorni_naziv` varchar(30) NOT NULL,
  `slika` varchar(150) DEFAULT NULL,
  `imdb_link` varchar(150) NOT NULL,
  `trajanje` varchar(30) NOT NULL,
  `drzava` varchar(30) NOT NULL,
  `pocetak_prikazivanja` date NOT NULL,
  `kraj_prikazivanja` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `filmovi`
--

INSERT INTO `filmovi` (`id`, `naziv`, `izvorni_naziv`, `slika`, `imdb_link`, `trajanje`, `drzava`, `pocetak_prikazivanja`, `kraj_prikazivanja`) VALUES
(1, 'Mračna Kula', 'Dark Tower', 'http://cdn.collider.com/wp-content/uploads/2017/03/the-dark-tower-poster.jpg', '0', '123', 'USA', '2021-02-02', '2021-03-03'),
(16, 'Tenet', 'Tenet', 'https://m.media-amazon.com/images/M/MV5BYzg0NGM2NjAtNmIxOC00MDJmLTg5ZmYtYzM0MTE4NWE2NzlhXkEyXkFqcGdeQXVyMTA4NjE0NjEy._V1_.jpg', 'https://www.imdb.com/title/tt6723592/', '180', 'USA', '2020-12-01', '2021-02-01'),
(17, 'Memento', 'Memento', 'https://i.imgur.com/jmouNc8.jpeg', 'https://www.imdb.com/title/tt0209144/', '113', 'USA', '2020-12-01', '2020-12-25'),
(18, 'Mračni Vitez', 'The Dark Knight', 'https://i.imgur.com/PPtwCje.jpeg', 'https://www.imdb.com/title/tt0468569/', '152', 'USA', '2021-03-02', '2021-03-30'),
(19, 'Vuk sa Vol Strita', 'The Wolf of Wall Street', 'https://i.imgur.com/a2d1nM2.jpeg', 'https://www.imdb.com/title/tt0993846/', '180', 'USA', '2020-12-02', '2021-03-03'),
(20, 'Džon Vik 3 - Parabelum', 'John Wick: Chapter 3 - Parabel', 'https://i.imgur.com/z7xDAhR.jpeg', 'https://www.imdb.com/title/tt6146586/?ref_=hm_tpks_tt_1_pd_tp1', '130', 'USA', '2021-03-15', '2021-04-12'),
(21, 'Dedpul 2', 'Deadpool 2', 'https://i.imgur.com/kCJAR8W_d.webp', 'https://www.imdb.com/title/tt5463162/?ref_=hm_tpks_tt_3_pd_tp1', '119', 'USA', '2021-01-01', '2021-02-01'),
(22, 'Vozač', 'Baby Driver', 'https://i.imgur.com/zNVxtUd.png', 'https://www.imdb.com/title/tt3890160/?ref_=hm_tpks_tt_10_pd_tp1', '113', 'USA', '2020-08-17', '2020-09-27'),
(23, 'Skajfol', 'Skyfall', 'https://i.imgur.com/ClKhMHl.jpeg', 'https://www.imdb.com/title/tt1074638/?ref_=hm_tpks_tt_18_pd_tp1', '143', 'USA', '2020-12-12', '2021-03-01');

-- --------------------------------------------------------

--
-- Table structure for table `korisnici`
--

CREATE TABLE `korisnici` (
  `id` int(11) UNSIGNED NOT NULL,
  `ime` varchar(15) NOT NULL,
  `prezime` varchar(20) NOT NULL,
  `email` varchar(25) NOT NULL,
  `sifra` varchar(150) NOT NULL,
  `broj_telefona` varchar(15) NOT NULL,
  `tip_naloga` enum('obican','admin','') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `korisnici`
--

INSERT INTO `korisnici` (`id`, `ime`, `prezime`, `email`, `sifra`, `broj_telefona`, `tip_naloga`) VALUES
(31, 'Petar', 'Petrovic', 'petar@gmail.com', 'sha1$c082c607$1$aa23206f62592a360024e6aed05ad8d49f107c60', '069123456', 'obican'),
(32, 'Marko', 'Markovic', 'admin@admin.com', 'sha1$dad13d3a$1$c247dbea11c4eeb704277e9c24b6bf5c364b1802', '069123457', 'admin'),
(33, 'Ivan', 'Ivanovic', 'ivan@gmail.com', 'sha1$29e04618$1$fdc7a9486ebe6276562476b6212ee3c7c748fa8a', '060123456', 'obican');

-- --------------------------------------------------------

--
-- Table structure for table `rezervacije`
--

CREATE TABLE `rezervacije` (
  `id` int(10) UNSIGNED NOT NULL,
  `termin_id` int(10) UNSIGNED NOT NULL,
  `korisnik_id` int(11) UNSIGNED NOT NULL,
  `racun` int(11) NOT NULL,
  `sifra_rezervacije` int(11) NOT NULL,
  `vreme_rezervacije` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `rezervacije`
--

INSERT INTO `rezervacije` (`id`, `termin_id`, `korisnik_id`, `racun`, `sifra_rezervacije`, `vreme_rezervacije`) VALUES
(1026, 36, 31, 600, 8452, '2021-02-09 18:49:33'),
(1029, 42, 33, 900, 9300, '2021-02-09 20:02:02'),
(1030, 35, 33, 300, 2198, '2021-02-09 20:02:40'),
(1031, 35, 31, 900, 8185, '2021-02-09 20:03:01'),
(1032, 35, 32, 900, 8660, '2021-02-09 20:12:03'),
(1036, 43, 31, 600, 3721, '2021-02-09 20:37:14'),
(1037, 43, 32, 900, 9820, '2021-02-11 19:32:46'),
(1038, 37, 32, 700, 8247, '2021-02-11 21:08:02'),
(1039, 36, 32, 1200, 9189, '2021-02-11 22:44:51'),
(1040, 20, 31, 300, 7281, '2021-02-05 20:20:03');

-- --------------------------------------------------------

--
-- Table structure for table `rezervacije_sedista`
--

CREATE TABLE `rezervacije_sedista` (
  `id` int(10) UNSIGNED NOT NULL,
  `rezervacija_id` int(10) UNSIGNED NOT NULL,
  `red` int(11) NOT NULL,
  `mesto_u_redu` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `rezervacije_sedista`
--

INSERT INTO `rezervacije_sedista` (`id`, `rezervacija_id`, `red`, `mesto_u_redu`) VALUES
(98, 1026, 5, 3),
(99, 1026, 5, 4),
(105, 1029, 1, 1),
(106, 1029, 1, 2),
(107, 1029, 1, 3),
(108, 1030, 3, 5),
(109, 1031, 6, 4),
(110, 1031, 6, 5),
(111, 1031, 6, 6),
(112, 1032, 2, 3),
(113, 1032, 2, 4),
(114, 1032, 2, 5),
(121, 1036, 7, 8),
(122, 1036, 7, 9),
(123, 1037, 8, 7),
(124, 1037, 8, 8),
(125, 1037, 8, 9),
(126, 1038, 4, 10),
(127, 1038, 4, 11),
(128, 1039, 1, 4),
(129, 1039, 1, 5),
(130, 1039, 1, 6),
(131, 1039, 1, 7),
(132, 1040, 3, 4);

-- --------------------------------------------------------

--
-- Table structure for table `sale`
--

CREATE TABLE `sale` (
  `id` int(11) UNSIGNED NOT NULL,
  `naziv` varchar(20) NOT NULL,
  `broj_redova` int(11) NOT NULL,
  `broj_mesta_u_redu` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `sale`
--

INSERT INTO `sale` (`id`, `naziv`, `broj_redova`, `broj_mesta_u_redu`) VALUES
(5, 'Sala 1', 5, 15),
(6, 'Sala 2', 10, 30),
(7, 'Sala 3', 10, 20);

-- --------------------------------------------------------

--
-- Table structure for table `termini`
--

CREATE TABLE `termini` (
  `id` int(10) UNSIGNED NOT NULL,
  `film_id` int(10) UNSIGNED NOT NULL,
  `sala_id` int(10) UNSIGNED NOT NULL,
  `cena_karte` int(11) NOT NULL,
  `vreme_prikazivanja` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `termini`
--

INSERT INTO `termini` (`id`, `film_id`, `sala_id`, `cena_karte`, `vreme_prikazivanja`) VALUES
(20, 1, 5, 300, '2021-03-06 20:00:00'),
(21, 1, 6, 300, '2021-03-07 20:00:00'),
(22, 1, 6, 300, '2021-03-07 22:00:00'),
(23, 1, 6, 300, '2021-03-08 22:00:00'),
(24, 1, 5, 300, '2021-03-11 20:00:00'),
(25, 1, 5, 300, '2021-03-10 22:00:00'),
(26, 1, 5, 300, '2021-03-11 20:00:00'),
(27, 18, 5, 250, '2020-03-03 20:00:00'),
(28, 18, 5, 250, '2020-03-04 20:00:00'),
(29, 18, 5, 250, '2020-03-05 20:00:00'),
(30, 18, 5, 250, '2020-03-06 20:00:00'),
(31, 18, 6, 250, '2020-03-06 22:00:00'),
(32, 19, 5, 300, '2020-12-02 20:00:00'),
(33, 19, 5, 300, '2020-12-02 22:00:00'),
(34, 19, 6, 300, '2020-12-03 22:00:00'),
(35, 19, 7, 300, '2021-01-11 20:00:00'),
(36, 19, 5, 300, '2021-02-01 22:00:00'),
(37, 19, 5, 350, '2021-02-01 22:00:00'),
(38, 20, 5, 300, '2020-03-15 20:00:00'),
(39, 20, 6, 300, '2020-03-15 22:00:00'),
(40, 20, 6, 300, '2020-03-17 22:00:00'),
(41, 20, 7, 300, '2020-03-17 20:00:00'),
(42, 16, 5, 300, '2021-01-11 18:00:00'),
(43, 16, 6, 300, '2021-01-11 21:00:00'),
(44, 21, 7, 300, '2021-01-14 22:00:00'),
(45, 21, 7, 300, '2021-01-15 22:00:00'),
(46, 21, 6, 300, '2021-01-15 20:00:00'),
(47, 21, 5, 300, '2021-01-15 18:00:00'),
(48, 23, 5, 300, '2021-01-07 22:00:00'),
(49, 23, 7, 300, '2021-01-08 20:00:00'),
(50, 23, 5, 300, '2021-01-07 20:00:00'),
(51, 23, 7, 300, '2021-01-08 22:00:00'),
(52, 1, 5, 300, '2021-01-09 20:00:00'),
(53, 16, 5, 300, '2021-01-09 20:00:00'),
(54, 19, 5, 300, '2021-02-08 20:00:00'),
(55, 19, 6, 300, '2021-02-15 21:00:00');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `filmovi`
--
ALTER TABLE `filmovi`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `korisnici`
--
ALTER TABLE `korisnici`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `rezervacije`
--
ALTER TABLE `rezervacije`
  ADD PRIMARY KEY (`id`),
  ADD KEY `termin_id_foreign` (`termin_id`),
  ADD KEY `korisnik_id_foreign` (`korisnik_id`);

--
-- Indexes for table `rezervacije_sedista`
--
ALTER TABLE `rezervacije_sedista`
  ADD PRIMARY KEY (`id`),
  ADD KEY `rezervacija_id_foreign` (`rezervacija_id`);

--
-- Indexes for table `sale`
--
ALTER TABLE `sale`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `termini`
--
ALTER TABLE `termini`
  ADD PRIMARY KEY (`id`),
  ADD KEY `film_id` (`film_id`),
  ADD KEY `sala_id` (`sala_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `filmovi`
--
ALTER TABLE `filmovi`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `korisnici`
--
ALTER TABLE `korisnici`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `rezervacije`
--
ALTER TABLE `rezervacije`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1041;

--
-- AUTO_INCREMENT for table `rezervacije_sedista`
--
ALTER TABLE `rezervacije_sedista`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=133;

--
-- AUTO_INCREMENT for table `sale`
--
ALTER TABLE `sale`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `termini`
--
ALTER TABLE `termini`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=56;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `rezervacije`
--
ALTER TABLE `rezervacije`
  ADD CONSTRAINT `korisnik_id_foreign` FOREIGN KEY (`korisnik_id`) REFERENCES `korisnici` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `termin_id_foreign` FOREIGN KEY (`termin_id`) REFERENCES `termini` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `rezervacije_sedista`
--
ALTER TABLE `rezervacije_sedista`
  ADD CONSTRAINT `rezervacija_id_foreign` FOREIGN KEY (`rezervacija_id`) REFERENCES `rezervacije` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `termini`
--
ALTER TABLE `termini`
  ADD CONSTRAINT `dodaj_foreign_za_film` FOREIGN KEY (`film_id`) REFERENCES `filmovi` (`id`) ON UPDATE NO ACTION,
  ADD CONSTRAINT `dodaj_foreign_za_salu` FOREIGN KEY (`sala_id`) REFERENCES `sale` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
