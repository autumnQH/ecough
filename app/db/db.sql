DROP DATABASE IF EXISTS ecough;

CREATE DATABASE ecough;

USE ecough; 


CREATE TABLE IF NOT EXISTS T_WECHAT_QRCODE (#生成带参数二维码
  id int NOT NULL AUTO_INCREMENT,
  name varchar(36) DEFAULT NULL,
  expire_seconds int(16) DEFAULT NULL,#该二维码有效时间，以秒为单位.最大不超过2592000（即30天)
  scene_str varchar(125) DEFAULT NULL,#场景值 string
  scene_id int(32) DEFAULT NULL,#场景值 参数只支持1--100000
  action_name varchar(36) DEFAULT NULL,#二维码类型，QR_SCENE为临时的整型参数值，QR_STR_SCENE为临时的字符串参数值，QR_LIMIT_SCENE为永久的整型参数值，QR_LIMIT_STR_SCENE为永久的字符串参数值
  ticket varchar(255) NOT NULL,#获取的二维码ticket，凭借此ticket可以在有效时间内换取二维码。
  url varchar(255) NOT NULL,#二维码图片解析后的地址
  create_time datetime  DEFAULT NULL,
  PRIMARY KEY (id)
)DEFAULT CHARSET=utf8 ;

CREATE TABLE IF NOT EXISTS T_WECHAT_SPREAD (#记录用户通过谁的二维码关注
  id int NOT NULL AUTO_INCREMENT,
  openid varchar(255) NOT NULL,
  ticket varchar(255) NOT NULL,#获取的二维码ticket
  eventKey varchar(255) NOT NULL,#场景值
  create_time datetime  DEFAULT NULL,
  PRIMARY KEY (id)
)DEFAULT CHARSET=utf8 ;

CREATE TABLE IF NOT EXISTS T_WECHAT_ORDER (
  id int NOT NULL AUTO_INCREMENT,
  openid varchar(255) NOT NULL,
  name varchar(255) NOT NULL,#姓名
  address varchar(255) NOT NULL,#地址
  phone varchar(255) NOT NULL,#电话
  product varchar(255) NOT NULL,#产品
  total varchar(255) NOT NULL,#数量
  specifications varchar(255) NOT NULL,#规格
  pay_money varchar(255) NOT NULL,#支付金额
  total_money varchar(255) NOT NULL,#总金额
  derate_money varchar(255) NOT NULL,#减免金额
  out_trade_no varchar(255) NOT NULL,#订单号
  create_time datetime  DEFAULT NULL,
  delivery_company varchar(255) DEFAULT NULL,#物流公司id (申通快递-shentong )
  delivery_track_no varchar(255) DEFAULT NULL,#物流号
  status int(4) NOT NULL,# 订单状态(2-待发货, 3-已发货, 5-已完成, 8-维权中 )
  PRIMARY KEY (id),
  INDEX openid (openid),
  INDEX out_trade_no (out_trade_no)
)DEFAULT CHARSET=utf8 ;

CREATE TABLE IF NOT EXISTS USER_SERVICE (#售后服务
  id int NOT NULL AUTO_INCREMENT,
  openid varchar(255) NOT NULL,
  out_trade_no varchar(255) NOT NULL,#订单号
  title varchar(255) NOT NULL,#问题标题
  issue TEXT NOT NULL,#问题详细内容
  phone int(32) NOT NULL, #用户电话
  PRIMARY KEY (id),
  INDEX openid (openid)
)DEFAULT CHARSET=utf8 ;

CREATE TABLE IF NOT EXISTS STORE_ORDER (#微信小店
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
  flag tinyint(1) DEFAULT '1',#0-false 1-true 是否首单
  create_time datetime DEFAULT NULL, 
  ticket varchar(255) DEFAULT NULL,#业绩人员二维码ticket值
  PRIMARY KEY (id),
  INDEX openid (openid)
)DEFAULT CHARSET=utf8 ;

CREATE TABLE IF NOT EXISTS CONFIG (
  id int NOT NULL AUTO_INCREMENT,
  appid varchar(255) DEFAULT 'wxff24c10734aed1ef',#appid
  appSecret varchar(255) DEFAULT 'e4f2067a90f7aed463e6bc51ba02f51d',#appSecret
  token varchar(255) DEFAULT 'ecough',#token
  store_mchid varchar(255) DEFAULT '1470073502', #商户id
  store_key varchar(255) DEFAULT 'qwertyuiopasdfghjklzxcvbnm123456',#商户支付key
  encodingAESKey varchar(255) DEFAULT '9dq7tO5Gi7iP6tIiCUBUXM55eVG8CGCWuRS2zyk5CPS',#消息加密
  message_text varchar(255) DEFAULT '终于等到您，还好没放弃！',#回复内容
  message_default varchar(255) DEFAULT '冥冥之中自有缘分！',#默认回复内容
  sms_accessKeyId varchar(255) DEFAULT 'LTAI8ttec2BYuOMC',#阿里短信 accessKeyId
  sms_secretAccessKey varchar(255) DEFAULT '3sDGHGwyQWpNwCdSYoomAWFGj9wSUj',#阿里短信 secretAccessKey
  sms_TemplateCode varchar(255) DEFAULT 'SMS_91000028',#阿里短信 TemplateCode
  sms_SignName varchar(255) DEFAULT '刘鹏',#阿里短信 SignName
  server_host varchar(255) DEFAULT 'http://www.e-cough.com',#网站
  server_port int(20) DEFAULT 80,
  original_money int(36) DEFAULT 1,#原价
  current_money int(36) DEFAULT 1,#现价
  derate_money int(36) DEFAULT 0,#减免
  PRIMARY KEY (id)
)DEFAULT CHARSET=utf8 ;

CREATE TABLE IF NOT EXISTS NOTIFY (#支付成功通知
  id int NOT NULL AUTO_INCREMENT,
  appid varchar(255) DEFAULT NULL,
  attach varchar(255) DEFAULT NULL,#商家数据包
  bank_type varchar(255) DEFAULT NULL,#银行类型
  cash_fee varchar(255) DEFAULT NULL,#现金支付金额订单现金支付金额 
  fee_type varchar(255) DEFAULT NULL,#货币类型
  is_subscribe varchar(255) DEFAULT NULL,#用户是否关注公众账号，Y-关注，N-未关注，仅在公众账号类型支付有效
  mch_id varchar(255) DEFAULT NULL,#商户号
  nonce_str varchar(255) DEFAULT NULL,#随机字符串
  openid varchar(255) DEFAULT NULL,
  out_trade_no varchar(255) DEFAULT NULL,#商户订单号
  result_code varchar(255) DEFAULT NULL,#业务结果
  return_code varchar(255) DEFAULT NULL,#返回代码
  sign varchar(255) DEFAULT NULL,#签名
  time_end varchar(255) DEFAULT NULL,#支付完成时间
  total_fee varchar(255) DEFAULT NULL,#订单金额
  trade_type varchar(255) DEFAULT NULL,#交易类型 JSAPI、NATIVE、APP
  transaction_id varchar(255) DEFAULT NULL,#微信支付订单号
  PRIMARY KEY (id),
  INDEX openid (openid)
)DEFAULT CHARSET=utf8 ;