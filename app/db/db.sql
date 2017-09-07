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
  openid varchar(255) NOT NULL,
  ticket varchar(255) NOT NULL,
  eventKey varchar(255) NOT NULL,#场景值
  create_time datetime  DEFAULT NULL
  PRIMARY KEY (id)
)DEFAULT CHARSET=utf8 ;

CREATE TABLE IF NOT EXISTS T_WECHAT_ORDER (
  id int NOT NULL AUTO_INCREMENT,
  openid varchar(255) NOT NULL,
  name varchar(255) NOT NULL,
  address varchar(255) NOT NULL,
  phone varchar(255) NOT NULL,
  product varchar(255) NOT NULL,
  specifications varchar(255) NOT NULL,
  pay_money varchar(255) NOT NULL,
  out_trade_no varchar(255) NOT NULL,#订单号
  create_time datetime  DEFAULT NULL,
  delivery_company varchar(255) DEFAULT NULL,#物流公司id (申通快递-shentong )
  delivery_track_no varchar(255) DEFAULT NULL,
  status int(4) NOT NULL,# 订单状态(2-待发货, 3-已发货, 5-已完成, 8-维权中 )
  PRIMARY KEY (id),
  INDEX openid (openid),
  INDEX out_trade_no (out_trade_no)
)DEFAULT CHARSET=utf8 ;

CREATE TABLE IF NOT EXISTS USER_SERVICE (
  id int NOT NULL AUTO_INCREMENT,
  openid varchar(255) NOT NULL,
  out_trade_no varchar(255) NOT NULL,
  title varchar(255) NOT NULL,
  issue TEXT NOT NULL,
  PRIMARY KEY (id),
  INDEX openid (openid)
)DEFAULT CHARSET=utf8 ;

CREATE TABLE IF NOT EXISTS STORE_ORDER (
  id int NOT NULL AUTO_INCREMENT,
  openid varchar(255) NOT NULL,
  order_id varchar(255) NOT NULL,
  order_status varchar(255) NOT NULL,
  product_id varchar(255) NOT NULL,
  sku_info varchar(255) NOT NULL,
  create_time datetime DEFAULT NULL,
  PRIMARY KEY (id),
  INDEX openid (openid)
)DEFAULT CHARSET=utf8 ;

CREATE TABLE IF NOT EXISTS T_WECHAT_SUBSCRIBE (
  id int NOT NULL AUTO_INCREMENT,
  openid varchar(255) NOT NULL,
  flag tinyint(1) DEFAULT '1',#0-false 1-true
  create_time datetime DEFAULT NULL, 
  ticket varchar(255) DEFAULT NULL,#业绩人员二维码
  PRIMARY KEY (id),
  INDEX openid (openid)
)DEFAULT CHARSET=utf8 ;

CREATE TABLE IF NOT EXISTS CONFIG (
  id int NOT NULL AUTO_INCREMENT,
  appid varchar(255) DEFAULT 'wxff24c10734aed1ef',#appid
  appSecret varchar(255) DEFAULT 'e4f2067a90f7aed463e6bc51ba02f51d',#appSecret
  token varchar(255) DEFAULT 'ecough',
  store_mchid varchar(255) DEFAULT '1470073502', #商户id
  store_key varchar(255) DEFAULT 'qwertyuiopasdfghjklzxcvbnm123456',#商户支付key
  encodingAESKey varchar(255) DEFAULT '9dq7tO5Gi7iP6tIiCUBUXM55eVG8CGCWuRS2zyk5CPS',
  message_text varchar(255) DEFAULT '终于等到您，还好没放弃！',
  message_default varchar(255) DEFAULT '冥冥之中自有缘分！',
  sms_accessKeyId varchar(255) DEFAULT 'LTAI8ttec2BYuOMC',
  sms_secretAccessKey varchar(255) DEFAULT '3sDGHGwyQWpNwCdSYoomAWFGj9wSUj',
  sms_TemplateCode varchar(255) DEFAULT 'SMS_91000028',
  sms_SignName varchar(255) DEFAULT '刘鹏',
  server_host varchar(255) DEFAULT 'http://www.e-cough.com',
  server_port int(20) DEFAULT 80,
  original_money int(36) DEFAULT 1,#原价
  current_money int(36) DEFAULT 1,#现价
  derate_money int(36) DEFAULT 0,#减免
  PRIMARY KEY (id)
)DEFAULT CHARSET=utf8 ;

CREATE TABLE IF NOT EXISTS NOTIFY (
  id int NOT NULL AUTO_INCREMENT,
  appid varchar(255) DEFAULT NULL,
  attach varchar(255) DEFAULT NULL,
  bank_type varchar(255) DEFAULT NULL,
  cash_fee varchar(255) DEFAULT NULL, 
  fee_type varchar(255) DEFAULT NULL,
  is_subscribe varchar(255) DEFAULT NULL,
  mch_id varchar(255) DEFAULT NULL,
  nonce_str varchar(255) DEFAULT NULL,
  openid varchar(255) DEFAULT NULL,
  out_trade_no varchar(255) DEFAULT NULL,
  result_code varchar(255) DEFAULT NULL,
  return_code varchar(255) DEFAULT NULL,
  sign varchar(255) DEFAULT NULL,
  time_end varchar(255) DEFAULT NULL,
  total_fee varchar(255) DEFAULT NULL,
  trade_type varchar(255) DEFAULT NULL,
  transaction_id varchar(255) DEFAULT NULL,
  PRIMARY KEY (id),
  INDEX openid (openid)
)DEFAULT CHARSET=utf8 ;