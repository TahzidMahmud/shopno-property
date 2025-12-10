-- MySQL dump 10.13  Distrib 8.0.44, for Linux (x86_64)
--
-- Host: localhost    Database: shopno
-- ------------------------------------------------------
-- Server version	8.0.44-0ubuntu0.24.04.1

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

--
-- Table structure for table `about_page_projects`
--

DROP TABLE IF EXISTS `about_page_projects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `about_page_projects` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subtitle` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `order` int NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `about_page_projects`
--

LOCK TABLES `about_page_projects` WRITE;
/*!40000 ALTER TABLE `about_page_projects` DISABLE KEYS */;
INSERT INTO `about_page_projects` VALUES (1,'Modern Office Complex','New Dhaka, 11 June, 2022',NULL,1,1,'2025-12-08 05:04:03','2025-12-08 05:04:03'),(2,'Resort Project',NULL,NULL,2,1,'2025-12-08 05:04:03','2025-12-08 05:04:03'),(3,'Management Project',NULL,NULL,3,1,'2025-12-08 05:04:03','2025-12-08 05:04:03'),(4,'Luxury Design',NULL,NULL,4,1,'2025-12-08 05:04:03','2025-12-08 05:04:03');
/*!40000 ALTER TABLE `about_page_projects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `about_page_settings`
--

DROP TABLE IF EXISTS `about_page_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `about_page_settings` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `about_page_settings_key_unique` (`key`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `about_page_settings`
--

LOCK TABLES `about_page_settings` WRITE;
/*!40000 ALTER TABLE `about_page_settings` DISABLE KEYS */;
INSERT INTO `about_page_settings` VALUES (1,'hero_title','About Us','2025-12-08 05:04:03','2025-12-08 05:04:03'),(2,'hero_background_image',NULL,'2025-12-08 05:04:03','2025-12-08 05:04:03'),(3,'vision_title','Where Vision Meets Value','2025-12-08 05:04:03','2025-12-08 05:04:03'),(4,'vision_description','Welcome to Shopno Property – your trusted real estate partner. We make it easy to find and secure the perfect property, whether you\'re looking for a home, land, or investment opportunity. Enjoy a seamless experience with verified listings, expert guidance, and dedicated support every step of the way.','2025-12-08 05:04:03','2025-12-08 05:04:03'),(5,'vision_image',NULL,'2025-12-08 05:04:03','2025-12-08 05:04:03'),(6,'award_badge','Award Winning Company In The Shopno Property','2025-12-08 05:04:03','2025-12-08 05:04:03'),(7,'stat_projects','50+','2025-12-08 05:04:03','2025-12-08 05:04:03'),(8,'stat_customers','48+','2025-12-08 05:04:03','2025-12-08 05:04:03'),(9,'stat_success_rate','45%','2025-12-08 05:04:03','2025-12-08 05:04:03'),(10,'stat_team','5+','2025-12-08 05:04:03','2025-12-08 05:04:03'),(11,'projects_title','Discover Our Signature Projects','2025-12-08 05:04:03','2025-12-08 05:04:03'),(12,'projects_subtitle','From residential to commercial developments, each project reflects our commitment to quality and trust.','2025-12-08 05:04:03','2025-12-08 05:04:03'),(13,'team_title','Our Professional Team Member','2025-12-08 05:04:03','2025-12-08 05:04:03'),(14,'chairman_name','MD. Sirajul Islam','2025-12-08 05:04:03','2025-12-08 05:04:03'),(15,'chairman_position','MANAGING DIRECTOR','2025-12-08 05:04:03','2025-12-08 05:04:03'),(16,'chairman_image',NULL,'2025-12-08 05:04:03','2025-12-08 05:04:03'),(17,'chairman_message','Our mission at Shopno Property has always been to build more than just structures; we build communities and futures. It is with this commitment that we proudly present Matribhumi City, a landmark project designed to be a true sanctuary for your family near Dhaka. This project is a testament to our dedication to quality, innovation, and your trust in us. We are deeply grateful for your continued support and look forward to building a future of shared success with you.','2025-12-08 05:04:03','2025-12-08 05:04:03'),(18,'testimonials_title','Hear What Our Client Say','2025-12-08 05:04:03','2025-12-08 05:04:03'),(19,'testimonials_subtitle','Hear from our clients about finding their dream homes, seamless property deals.','2025-12-08 05:04:03','2025-12-08 05:04:03');
/*!40000 ALTER TABLE `about_page_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `about_page_team_members`
--

DROP TABLE IF EXISTS `about_page_team_members`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `about_page_team_members` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `position` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `order` int NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `about_page_team_members`
--

LOCK TABLES `about_page_team_members` WRITE;
/*!40000 ALTER TABLE `about_page_team_members` DISABLE KEYS */;
INSERT INTO `about_page_team_members` VALUES (1,'Imtinan Raj','CEO',NULL,1,1,'2025-12-08 05:04:03','2025-12-08 05:04:03'),(2,'Mahabubur Ripon','Head Of Visual Experience',NULL,2,1,'2025-12-08 05:04:03','2025-12-08 05:04:03'),(3,'Shohana','Lead Developer',NULL,3,1,'2025-12-08 05:04:03','2025-12-08 05:04:03'),(4,'Saiful Islam Xakib','Business Operations & Strategy Manager',NULL,4,1,'2025-12-08 05:04:03','2025-12-08 05:04:03');
/*!40000 ALTER TABLE `about_page_team_members` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `about_page_testimonials`
--

DROP TABLE IF EXISTS `about_page_testimonials`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `about_page_testimonials` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `quote` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `author_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `author_position` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `author_company` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rating` int NOT NULL DEFAULT '5',
  `image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `order` int NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `about_page_testimonials`
--

LOCK TABLES `about_page_testimonials` WRITE;
/*!40000 ALTER TABLE `about_page_testimonials` DISABLE KEYS */;
INSERT INTO `about_page_testimonials` VALUES (1,'Partnering with AFMS was the best decision for our properties. Their professional team, responsive service, and attention to detail consistently exceed expectations. Highly recommended for facility management!','Jessica Wright','Facility Director','Skyline Properties',5,NULL,1,1,'2025-12-08 05:04:03','2025-12-08 05:04:03');
/*!40000 ALTER TABLE `about_page_testimonials` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `blog_posts`
--

DROP TABLE IF EXISTS `blog_posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `blog_posts` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci,
  `image` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `published_date` date NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_published` tinyint(1) NOT NULL DEFAULT '1',
  `order` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `blog_posts_slug_unique` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blog_posts`
--

LOCK TABLES `blog_posts` WRITE;
/*!40000 ALTER TABLE `blog_posts` DISABLE KEYS */;
INSERT INTO `blog_posts` VALUES (1,'Officiis laboris ut','Duis nulla sed magni','uploads/home/blog/693587f30e883.webp','1999-02-06','Aut occaecat velit',1,62,'2025-12-07 07:58:11','2025-12-07 07:58:11');
/*!40000 ALTER TABLE `blog_posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contact_page_key_transports`
--

DROP TABLE IF EXISTS `contact_page_key_transports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contact_page_key_transports` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `icon` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `distance` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `order` int NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contact_page_key_transports`
--

LOCK TABLES `contact_page_key_transports` WRITE;
/*!40000 ALTER TABLE `contact_page_key_transports` DISABLE KEYS */;
INSERT INTO `contact_page_key_transports` VALUES (1,'Supermarket','store','200m',1,1,'2025-12-08 04:49:02','2025-12-08 04:49:02'),(2,'Airport','airplane','2,790m',2,1,'2025-12-08 04:49:02','2025-12-08 04:49:02'),(3,'Hospital','hospital','500m',3,1,'2025-12-08 04:49:02','2025-12-08 04:49:02'),(4,'State Bank','bank','190m',4,1,'2025-12-08 04:49:02','2025-12-08 04:49:02'),(5,'University','school','250m',5,1,'2025-12-08 04:49:02','2025-12-08 04:49:02'),(6,'Railway Station','train','1,800m',6,1,'2025-12-08 04:49:02','2025-12-08 04:49:02');
/*!40000 ALTER TABLE `contact_page_key_transports` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contact_page_settings`
--

DROP TABLE IF EXISTS `contact_page_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contact_page_settings` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `contact_page_settings_key_unique` (`key`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contact_page_settings`
--

LOCK TABLES `contact_page_settings` WRITE;
/*!40000 ALTER TABLE `contact_page_settings` DISABLE KEYS */;
INSERT INTO `contact_page_settings` VALUES (1,'hero_title','Contact Us','2025-12-08 04:49:02','2025-12-08 04:49:02'),(2,'hero_background_image',NULL,'2025-12-08 04:49:02','2025-12-08 04:49:02'),(3,'section_title','Get In Touch','2025-12-08 04:49:02','2025-12-08 04:49:02'),(4,'form_heading','Enquiry','2025-12-08 04:49:02','2025-12-08 04:49:02'),(5,'form_description','Wish to get a call back from our team? Fill in your details.','2025-12-08 04:49:02','2025-12-08 04:49:02'),(6,'form_email','contact@example.com','2025-12-08 04:49:02','2025-12-08 04:49:02'),(7,'address','Rupayan Taj, 1, 1/1 Naya Paltan, Suite L - 5 (5th Floor), Culvert Road, Dhaka,','2025-12-08 04:49:02','2025-12-08 04:49:02'),(8,'phone','+8801844-646633','2025-12-08 04:49:02','2025-12-08 04:49:02'),(9,'email','info.shopnoproperty@gmail.com','2025-12-08 04:49:02','2025-12-08 04:49:02'),(10,'map_address','46B Matheswartala Road, Tejgaon, Dhaka Bangladesh','2025-12-08 04:49:02','2025-12-08 04:49:02'),(11,'map_latitude','23.7639','2025-12-08 04:49:02','2025-12-08 04:49:02'),(12,'map_longitude','90.3889','2025-12-08 04:49:02','2025-12-08 04:49:02');
/*!40000 ALTER TABLE `contact_page_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `facilities`
--

DROP TABLE IF EXISTS `facilities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `facilities` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `facilities`
--

LOCK TABLES `facilities` WRITE;
/*!40000 ALTER TABLE `facilities` DISABLE KEYS */;
INSERT INTO `facilities` VALUES (1,'pool','uploads/facilities/6933407ed50fa.webp','2025-12-05 14:28:47','2025-12-05 14:28:47');
/*!40000 ALTER TABLE `facilities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `failed_jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `failed_jobs`
--

LOCK TABLES `failed_jobs` WRITE;
/*!40000 ALTER TABLE `failed_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `failed_jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `footer_discover_links`
--

DROP TABLE IF EXISTS `footer_discover_links`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `footer_discover_links` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `label` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `url` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `order` int NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `footer_discover_links`
--

LOCK TABLES `footer_discover_links` WRITE;
/*!40000 ALTER TABLE `footer_discover_links` DISABLE KEYS */;
/*!40000 ALTER TABLE `footer_discover_links` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `footer_quick_links`
--

DROP TABLE IF EXISTS `footer_quick_links`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `footer_quick_links` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `label` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `url` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `order` int NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `footer_quick_links`
--

LOCK TABLES `footer_quick_links` WRITE;
/*!40000 ALTER TABLE `footer_quick_links` DISABLE KEYS */;
/*!40000 ALTER TABLE `footer_quick_links` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `footer_settings`
--

DROP TABLE IF EXISTS `footer_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `footer_settings` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `footer_settings_key_unique` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `footer_settings`
--

LOCK TABLES `footer_settings` WRITE;
/*!40000 ALTER TABLE `footer_settings` DISABLE KEYS */;
/*!40000 ALTER TABLE `footer_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `footer_social_links`
--

DROP TABLE IF EXISTS `footer_social_links`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `footer_social_links` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `platform` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `url` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `footer_social_links`
--

LOCK TABLES `footer_social_links` WRITE;
/*!40000 ALTER TABLE `footer_social_links` DISABLE KEYS */;
/*!40000 ALTER TABLE `footer_social_links` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `header_dropdown_items`
--

DROP TABLE IF EXISTS `header_dropdown_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `header_dropdown_items` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `navigation_link_id` bigint unsigned NOT NULL,
  `label` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `url` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `order` int NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `header_dropdown_items_navigation_link_id_foreign` (`navigation_link_id`),
  CONSTRAINT `header_dropdown_items_navigation_link_id_foreign` FOREIGN KEY (`navigation_link_id`) REFERENCES `header_navigation_links` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `header_dropdown_items`
--

LOCK TABLES `header_dropdown_items` WRITE;
/*!40000 ALTER TABLE `header_dropdown_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `header_dropdown_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `header_navigation_links`
--

DROP TABLE IF EXISTS `header_navigation_links`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `header_navigation_links` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `label` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `url` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `order` int NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'link',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `header_navigation_links`
--

LOCK TABLES `header_navigation_links` WRITE;
/*!40000 ALTER TABLE `header_navigation_links` DISABLE KEYS */;
/*!40000 ALTER TABLE `header_navigation_links` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `header_settings`
--

DROP TABLE IF EXISTS `header_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `header_settings` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `header_settings_key_unique` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `header_settings`
--

LOCK TABLES `header_settings` WRITE;
/*!40000 ALTER TABLE `header_settings` DISABLE KEYS */;
/*!40000 ALTER TABLE `header_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hero_slides`
--

DROP TABLE IF EXISTS `hero_slides`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hero_slides` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `background_image` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subtitle` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `button_text` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `button_link` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `order` int NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hero_slides`
--

LOCK TABLES `hero_slides` WRITE;
/*!40000 ALTER TABLE `hero_slides` DISABLE KEYS */;
INSERT INTO `hero_slides` VALUES (1,'uploads/home/hero/693586c8da0aa.webp','Dolor id autem cum e','Reprehenderit ad ips','Velit cumque quod mo','Eum rerum mollitia v','Nisi odit voluptatib',70,1,'2025-12-07 07:53:12','2025-12-07 07:53:12');
/*!40000 ALTER TABLE `hero_slides` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `home_page_settings`
--

DROP TABLE IF EXISTS `home_page_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `home_page_settings` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `home_page_settings_key_unique` (`key`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `home_page_settings`
--

LOCK TABLES `home_page_settings` WRITE;
/*!40000 ALTER TABLE `home_page_settings` DISABLE KEYS */;
INSERT INTO `home_page_settings` VALUES (1,'call_to_action_background','uploads/home/settings/69358a57bc29b.webp','2025-12-07 08:08:23','2025-12-07 08:08:23'),(2,'call_to_action_image','uploads/home/settings/69358a60acb96.webp','2025-12-07 08:08:32','2025-12-07 08:08:32'),(3,'why_choose_us_video','uploads/home/settings/69358a6a53c07.webp','2025-12-07 08:08:42','2025-12-07 08:08:42');
/*!40000 ALTER TABLE `home_page_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `investment_benefits`
--

DROP TABLE IF EXISTS `investment_benefits`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `investment_benefits` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `icon_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `order` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `investment_benefits`
--

LOCK TABLES `investment_benefits` WRITE;
/*!40000 ALTER TABLE `investment_benefits` DISABLE KEYS */;
INSERT INTO `investment_benefits` VALUES (1,'Storage','Odit expedita ab tem','Soluta expedita sed',42,'2025-12-07 07:57:43','2025-12-07 07:57:43');
/*!40000 ALTER TABLE `investment_benefits` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,'2014_10_12_000000_create_users_table',1),(2,'2014_10_12_100000_create_password_reset_tokens_table',1),(3,'2019_08_19_000000_create_failed_jobs_table',1),(4,'2019_12_14_000001_create_personal_access_tokens_table',1),(5,'2025_10_12_131460_create_properties_table',1),(6,'2025_10_12_140039_create_facilities_table',1),(8,'2025_12_05_201347_create_property_facility_table',2),(9,'2025_12_05_202758_add_title_and_image_to_facilities_table',2),(10,'2025_12_06_174238_create_hero_slides_table',3),(11,'2025_12_06_174241_create_why_choose_us_features_table',3),(12,'2025_12_06_174243_create_investment_benefits_table',3),(13,'2025_12_06_174251_create_blog_posts_table',3),(14,'2025_12_06_174254_create_partners_table',3),(15,'2025_12_06_174256_create_search_options_table',3),(16,'2025_12_06_174341_create_home_page_settings_table',3),(17,'2025_12_07_141429_create_property_types_table',4),(18,'2025_12_08_073916_create_header_settings_table',5),(19,'2025_12_08_073917_create_footer_settings_table',5),(20,'2025_12_08_080721_add_map_and_booking_fields_to_properties_table',6),(21,'2025_12_08_104341_create_contact_page_settings_table',7),(23,'2025_12_08_105304_create_about_page_settings_table',8);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `partners`
--

DROP TABLE IF EXISTS `partners`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `partners` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logo` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `website` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `order` int NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `partners`
--

LOCK TABLES `partners` WRITE;
/*!40000 ALTER TABLE `partners` DISABLE KEYS */;
INSERT INTO `partners` VALUES (1,'Xavier Munoz','uploads/home/partners/69358803d79ff.webp','https://www.jepecaliqir.tv',22,1,'2025-12-07 07:58:27','2025-12-07 07:58:27');
/*!40000 ALTER TABLE `partners` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `personal_access_tokens`
--

DROP TABLE IF EXISTS `personal_access_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `personal_access_tokens` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint unsigned NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personal_access_tokens`
--

LOCK TABLES `personal_access_tokens` WRITE;
/*!40000 ALTER TABLE `personal_access_tokens` DISABLE KEYS */;
INSERT INTO `personal_access_tokens` VALUES (1,'App\\Models\\User',1,'auth-token','851fffcdeab8d28a96a80eee607ada622ae082d7d504ae38f97d97d3b7854825','[\"*\"]','2025-12-09 23:14:10',NULL,'2025-12-09 23:08:45','2025-12-09 23:14:10');
/*!40000 ALTER TABLE `personal_access_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `properties`
--

DROP TABLE IF EXISTS `properties`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `properties` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `area` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `location` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `total_floor` int DEFAULT NULL,
  `total_flat` int DEFAULT NULL,
  `flat_size` int DEFAULT NULL,
  `total_parking` int DEFAULT NULL,
  `price_range` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `main_image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `layout_images` json DEFAULT NULL,
  `gallery_images` json DEFAULT NULL,
  `demo_video` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `booking_form_background_image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `full_address` text COLLATE utf8mb4_unicode_ci,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `key_transports` json DEFAULT NULL,
  `under_development` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bedrooms` int DEFAULT NULL,
  `bathrooms` int DEFAULT NULL,
  `company_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `properties`
--

LOCK TABLES `properties` WRITE;
/*!40000 ALTER TABLE `properties` DISABLE KEYS */;
INSERT INTO `properties` VALUES (1,'Molestias voluptatem','available','Cumque ipsa consequ','Quisquam quisquam ob','house',8,34,75,61,'572','uploads/properties/main/6933864b60a4c.webp','[\"uploads/properties/layouts/6933825ba8686.webp\", \"uploads/properties/layouts/6933825c13cad.webp\", \"uploads/properties/layouts/6933825c24e70.webp\", \"uploads/properties/layouts/6933864b9e2d9.webp\", \"uploads/properties/layouts/6933864bd7a42.webp\", \"uploads/properties/layouts/6933864be17be.webp\", \"uploads/properties/layouts/6933864be6f3a.webp\", \"uploads/properties/layouts/6933864c03a13.webp\"]','[\"uploads/properties/gallery/6933825c2d96c.webp\", \"uploads/properties/gallery/6933825c8bb68.webp\", \"uploads/properties/gallery/6933825ce8f6f.webp\", \"uploads/properties/gallery/6933825cf19cb.webp\", \"uploads/properties/gallery/6933864c26391.webp\", \"uploads/properties/gallery/6933864c5df48.webp\", \"uploads/properties/gallery/6933864c9603e.webp\", \"uploads/properties/gallery/6933864c9af24.webp\", \"uploads/properties/gallery/6933864ca11b9.webp\"]',NULL,NULL,'At iusto ex non labo',NULL,NULL,'[\"lol\"]',NULL,68,35,'Cherry Mckinney LLC','2025-12-05 14:29:09','2025-12-05 19:26:36'),(2,'Nulla qui pariatur','sold','Laboris ad optio ex','Ea voluptas nihil au','house',2,46,89,38,'203','uploads/properties/main/693467bbc11f5.webp','[\"uploads/properties/layouts/693467bbc8663.webp\", \"uploads/properties/layouts/693467bc00a99.webp\", \"uploads/properties/layouts/693467bc2b4a3.webp\", \"uploads/properties/layouts/693467bc2ee91.webp\"]','[\"uploads/properties/gallery/693467bc33301.webp\", \"uploads/properties/gallery/693467bc5bcd1.webp\", \"uploads/properties/gallery/693467bc63d25.webp\", \"uploads/properties/gallery/693467bc68128.webp\"]',NULL,NULL,'Omnis ut officiis of',NULL,NULL,'[\"Quisquam ut autem cu\"]','yes',24,11,'Ortiz and Hopkins Inc','2025-12-06 11:28:28','2025-12-06 11:28:28');
/*!40000 ALTER TABLE `properties` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `property_facility`
--

DROP TABLE IF EXISTS `property_facility`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `property_facility` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `property_id` bigint unsigned NOT NULL,
  `facility_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `property_facility_property_id_facility_id_unique` (`property_id`,`facility_id`),
  KEY `property_facility_facility_id_foreign` (`facility_id`),
  CONSTRAINT `property_facility_facility_id_foreign` FOREIGN KEY (`facility_id`) REFERENCES `facilities` (`id`) ON DELETE CASCADE,
  CONSTRAINT `property_facility_property_id_foreign` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `property_facility`
--

LOCK TABLES `property_facility` WRITE;
/*!40000 ALTER TABLE `property_facility` DISABLE KEYS */;
INSERT INTO `property_facility` VALUES (1,1,1,NULL,NULL),(2,2,1,NULL,NULL);
/*!40000 ALTER TABLE `property_facility` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `property_types`
--

DROP TABLE IF EXISTS `property_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `property_types` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type_value` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `icon_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `order` int NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `property_types`
--

LOCK TABLES `property_types` WRITE;
/*!40000 ALTER TABLE `property_types` DISABLE KEYS */;
INSERT INTO `property_types` VALUES (1,'Rhea Merritt','house','HouseIcon',68,1,'2025-12-07 13:59:54','2025-12-07 13:59:54');
/*!40000 ALTER TABLE `property_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `search_options`
--

DROP TABLE IF EXISTS `search_options`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `search_options` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `category` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `label` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `order` int NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `search_options`
--

LOCK TABLES `search_options` WRITE;
/*!40000 ALTER TABLE `search_options` DISABLE KEYS */;
INSERT INTO `search_options` VALUES (1,'project_status','Inventore sapiente e','Nobis sint magna ex',89,1,'2025-12-07 08:00:07','2025-12-07 08:00:07'),(2,'project_status','Id dolorum quod sit','Nostrud eos dolore d',78,1,'2025-12-07 08:00:12','2025-12-07 08:00:12');
/*!40000 ALTER TABLE `search_options` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Admin User','admin@shopnoproperty.com',NULL,'$2y$12$4xfFVnIczuK7h2L15i1sm.B9PRgXQ./dbVRHVjTgKB3zHsR73Dtii',NULL,'2025-12-09 23:05:11','2025-12-09 23:05:11');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `why_choose_us_features`
--

DROP TABLE IF EXISTS `why_choose_us_features`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `why_choose_us_features` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `icon_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '0',
  `order` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `why_choose_us_features`
--

LOCK TABLES `why_choose_us_features` WRITE;
/*!40000 ALTER TABLE `why_choose_us_features` DISABLE KEYS */;
INSERT INTO `why_choose_us_features` VALUES (1,'LocationCity','Ea provident quas r','Est sit facere vel',1,63,'2025-12-07 07:56:53','2025-12-07 07:56:53');
/*!40000 ALTER TABLE `why_choose_us_features` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-10 11:57:19
