# ************************************************************
# Sequel Pro SQL dump
# Version 4541
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: 127.0.0.1 (MySQL 5.7.19)
# Database: xss-detection
# Generation Time: 2018-07-01 15:57:51 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table inject_points
# ------------------------------------------------------------

DROP TABLE IF EXISTS `inject_points`;

CREATE TABLE `inject_points` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '注入点id',
  `page_id` int(11) DEFAULT NULL COMMENT 'page id',
  `page_url` varchar(1024) DEFAULT NULL COMMENT 'page url',
  `inject_point` text COMMENT '注入点 selector',
  `active_point` text COMMENT '交互点 selector',
  `is_vulnerable` tinyint(1) DEFAULT '0' COMMENT '是否危险',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table page
# ------------------------------------------------------------

DROP TABLE IF EXISTS `page`;

CREATE TABLE `page` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT 'id',
  `site_id` int(11) DEFAULT NULL COMMENT 'site id',
  `url` varchar(255) DEFAULT '' COMMENT 'page url',
  `origin` varchar(255) DEFAULT NULL COMMENT '当前页面的源origin',
  `related_url` varchar(255) DEFAULT '' COMMENT '链接（相关）url',
  `visited` tinyint(1) DEFAULT '0' COMMENT '是否访问过（有无注入点）',
  PRIMARY KEY (`id`),
  UNIQUE KEY `url` (`url`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table site
# ------------------------------------------------------------

DROP TABLE IF EXISTS `site`;

CREATE TABLE `site` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '网站id',
  `start_url` varchar(255) DEFAULT NULL COMMENT '网站爬取 起始url',
  `origin` varchar(64) DEFAULT NULL COMMENT '网站源',
  PRIMARY KEY (`id`),
  UNIQUE KEY `url` (`start_url`),
  UNIQUE KEY `origin` (`origin`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;




/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
