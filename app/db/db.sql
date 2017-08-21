DROP DATABASE IF EXISTS ecough;

CREATE DATABASE ecough;

USE ecough; 

CREATE TABLE IF NOT EXISTS T_USER (
  id int NOT NULL AUTO_INCREMENT,
  open_id varchar(255) DEFAULT NULL,
  email varchar(255) DEFAULT NULL,
  passwd varchar(255) DEFAULT NULL,
  name varchar(255) DEFAULT NULL,
  nick varchar(255) DEFAULT NULL,
  address varchar(100) DEFAULT NULL,
  post_code varchar(6) DEFAULT NULL,
  phone_no varchar(11) DEFAULT NULL,
  create_time datetime  DEFAULT NULL,
  modified_time datetime DEFAULT NULL,
  voided_time datetime DEFAULT NULL,
  data_status int DEFAULT NULL,
  level int DEFAULT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS T_PRODUCT(
  id int NOT NULL AUTO_INCREMENT,
  product_no varchar(255)  DEFAULT NULL,
  name varchar(255)  DEFAULT NULL,
  catagory varchar(50)  DEFAULT NULL,
  price decimal DEFAULT NULL,
  description varchar(500)  DEFAULT NULL,
  pic varchar(100)  DEFAULT NULL,
  upshelf_date datetime  DEFAULT NULL,
  downshelf_date datetime  DEFAULT NULL,
  create_time datetime  DEFAULT NULL,
  modified_time datetime DEFAULT NULL,
  voided_time datetime DEFAULT NULL,
  data_status int DEFAULT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS T_ORDER(
  id int NOT NULL AUTO_INCREMENT,
  user_id int DEFAULT NULL,
  order_no varchar(255) DEFAULT NULL,
  order_time datetime DEFAULT NULL,
  total_price decimal DEFAULT NULL,
  order_status varchar(20) DEFAULT NULL,
  pay_way varchar(20) DEFAULT NULL,
  create_time datetime  DEFAULT NULL,
  modified_time datetime DEFAULT NULL,
  voided_time datetime DEFAULT NULL,
  data_status int DEFAULT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES T_USER(id)
);

CREATE TABLE IF NOT EXISTS T_ORDER_PRODUCT(
  id int NOT NULL AUTO_INCREMENT,
  order_id int DEFAULT NULL,
  product_id int DEFAULT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (order_id) REFERENCES T_ORDER(id), 
  FOREIGN KEY (product_id) REFERENCES T_PRODUCT(id)
);

CREATE TABLE IF NOT EXISTS T_WECHAT_TOKEN_AUTH (
  id int NOT NULL AUTO_INCREMENT,
  access_token varchar(255) NOT NULL,
  expires_in int(32) NOT NULL,
  refresh_token varchar(255) NOT NULL,
  openid varchar(255) NOT NULL,
  scope varchar(255) NOT NULL,
  unionid varchar(255) NOT NULL,
  create_time datetime  DEFAULT NULL,
  PRIMARY KEY (id)
) ;

INSERT INTO T_USER set email='1@example.com', passwd='123456';

INSERT INTO T_USER set email='2@example.com', passwd='123456';

INSERT INTO T_USER set email='3@example.com', passwd='123456';