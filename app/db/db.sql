DROP DATABASE IF EXISTS ecough;

CREATE DATABASE ecough;

USE ecough; 


CREATE TABLE IF NOT EXISTS T_WECHAT_QRCODE (
  id int NOT NULL AUTO_INCREMENT,
  name varchar(255) NOT NULL,
  scene_str varchar(255) NOT NULL,
  action_name varchar(255) NOT NULL,
  ticket varchar(255) NOT NULL,
  url varchar(255) NOT NULL,
  create_time datetime  DEFAULT NULL,
  PRIMARY KEY (id)
)DEFAULT CHARSET=utf8 ;

CREATE TABLE IF NOT EXISTS T_WECHAT_SPREAD (
  id int NOT NULL AUTO_INCREMENT,
  userName varchar(255) NOT NULL,
  ticket varchar(255) NOT NULL,
  eventKey varchar(255) NOT NULL,
  create_time datetime  DEFAULT NULL,
  PRIMARY KEY (id)
) ;

CREATE TABLE IF NOT EXISTS T_WECHAT_ORDER (
  id int NOT NULL AUTO_INCREMENT,
  openid varchar(255) NOT NULL,
  name varchar(255) NOT NULL,
  address varchar(255) NOT NULL,
  phone varchar(255) NOT NULL,
  product varchar(255) NOT NULL,
  specifications varchar(255) NOT NULL,
  pay_money varchar(255) NOT NULL,
  out_trade_no varchar(255) NOT NULL,
  create_time datetime  DEFAULT NULL,
  PRIMARY KEY (id)
)DEFAULT CHARSET=utf8 ;

CREATE TABLE IF NOT EXISTS USER_ADDRESS (
  id int NOT NULL AUTO_INCREMENT,
  openid varchar(255) NOT NULL,
  name varchar(255) NOT NULL,
  address varchar(255) NOT NULL,
  phone varchar(255) NOT NULL,
  PRIMARY KEY (id)
)DEFAULT CHARSET=utf8 ;
