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

CREATE TABLE IF NOT EXISTS T_WECHAT_USER (#用户表
  id int(11) NOT NULL AUTO_INCREMENT,
  openid varchar(128) NOT NULL,
  headimgurl varchar(255) DEFAULT NULL,#用户头像
  nick varchar(20) DEFAULT NULL,#用户昵称
  phone varchar(16) DEFAULT NULL,#用户电话
  ticket varchar(255) DEFAULT NULL,#二维码的ticke值
  eventKey varchar(255) DEFAULT NULL,#二维码的场景值
  integral int(16) DEFAULT 0, #积分
  create_time datetime DEFAULT NULL,
  flag tinyint(1) DEFAULT '1',#是否是首单
  order_count int(12) DEFAULT 0,#下单次数
  PRIMARY KEY (id),
  Index openid (openid),
  Index eventKey (eventKey)
) DEFAULT CHARSET=utf8;


CREATE TABLE IF NOT EXISTS T_WECHAT_ORDER (#订单表
  id int NOT NULL AUTO_INCREMENT,
  openid varchar(128) NOT NULL,
  name varchar(32) NOT NULL,#姓名
  address varchar(128) NOT NULL,#地址
  phone varchar(32) NOT NULL,#电话
  product varchar(128) NOT NULL,#产品
  total varchar(20) NOT NULL,#数量
  specifications varchar(32) NOT NULL,#规格
  pay_money varchar(20) NOT NULL,#支付金额
  total_money varchar(20) NOT NULL,#总金额
  derate_money varchar(20) NOT NULL,#减免金额
  out_trade_no varchar(32) NOT NULL,#订单号
  create_time datetime  DEFAULT NULL,
  delivery_company varchar(32) DEFAULT NULL,#物流公司id (申通快递-shentong )
  delivery_track_no varchar(32) DEFAULT NULL,#物流号
  status int(4) NOT NULL,# 订单状态(2-待发货, 3-已发货, 5-已完成, 8-维权中 )
  PRIMARY KEY (id),
  INDEX openid (openid),
  INDEX out_trade_no (out_trade_no)
)DEFAULT CHARSET=utf8 ;

CREATE TABLE IF NOT EXISTS USER_SERVICE (#用户售后服务
  id int NOT NULL AUTO_INCREMENT,
  openid varchar(128) NOT NULL,
  out_trade_no varchar(32) NOT NULL,#订单号
  title varchar(255) NOT NULL,#问题标题
  issue TEXT NOT NULL,#问题详细内容
  phone int(32) NOT NULL, #用户电话
  PRIMARY KEY (id),
  INDEX openid (openid)
)DEFAULT CHARSET=utf8 ;

CREATE TABLE IF NOT EXISTS USER_VOUCHER (#用户代金券
  id int(11) NOT NULL AUTO_INCREMENT,
  openid varchar(128) NOT NULL,
  voucher_type varchar(36) DEFAULT NULL,#代金券类别
  voucher_denomination int(10) DEFAULT NULL,#代金券面额
  create_time datetime DEFAULT NULL,#创建时间
  end_time datetime DEFAULT NULL,#到期时间
  PRIMARY KEY (id),
  Index openid (openid)
) DEFAULT CHARSET=utf8;


CREATE TABLE IF NOT EXISTS STORE_ORDER (#微信小店
  id int NOT NULL AUTO_INCREMENT,
  openid varchar(128) NOT NULL,
  order_id varchar(255) NOT NULL,
  order_status varchar(255) NOT NULL,
  product_id varchar(255) NOT NULL,
  sku_info varchar(255) NOT NULL,
  create_time datetime DEFAULT NULL,
  PRIMARY KEY (id),
  INDEX openid (openid)
)DEFAULT CHARSET=utf8 ;

CREATE TABLE IF NOT EXISTS CONFIG (#config
  id int NOT NULL AUTO_INCREMENT,
  appid varchar(128) DEFAULT '',#appid
  appSecret varchar(255) DEFAULT '',#appSecret
  token varchar(255) DEFAULT '',#token
  store_mchid varchar(32) DEFAULT '', #商户id
  store_key varchar(255) DEFAULT '',#商户支付key
  encodingAESKey varchar(255) DEFAULT '',#消息加密
  message_text varchar(255) DEFAULT '终于等到您，还好没放弃！',#回复内容
  message_default varchar(255) DEFAULT '冥冥之中自有缘分！',#默认回复内容
  sms_accessKeyId varchar(255) DEFAULT '',#阿里短信 accessKeyId
  sms_secretAccessKey varchar(255) DEFAULT '',#阿里短信 secretAccessKey
  sms_TemplateCode varchar(255) DEFAULT '',#阿里短信 TemplateCode
  sms_SignName varchar(255) DEFAULT '',#阿里短信 SignName
  server_host varchar(255) DEFAULT '',#网站
  original_money int(36) DEFAULT 1,#原价
  current_money int(36) DEFAULT 1,#现价
  derate_money int(36) DEFAULT 0,#减免
  PRIMARY KEY (id)
)DEFAULT CHARSET=utf8 ;

CREATE TABLE IF NOT EXISTS NOTIFY (#支付成功通知
  id int NOT NULL AUTO_INCREMENT,
  appid varchar(128) DEFAULT NULL,
  mch_id varchar(32) DEFAULT NULL,#商户号
  device_info varchar(32) DEFAULT NULL,#设备号
  nonce_str varchar(32) DEFAULT NULL,#随机字符串
  sign varchar(32) DEFAULT NULL,#签名
  sign_type varchar(32) DEFAULT NULL,#签名类型
  result_code varchar(16) DEFAULT NULL,#业务结果
  return_code varchar(128) DEFAULT NULL,#业务代码
  err_code varchar(32) DEFAULT NULL,#错误代码
  err_code_des varchar(128) DEFAULT NULL,#错误代码描述
  openid varchar(128) DEFAULT NULL,#用户标示
  is_subscribe varchar(1) DEFAULT NULL,#用户是否关注公众账号，Y-关注，N-未关注，仅在公众账号类型支付有效
  trade_type varchar(16) DEFAULT NULL,#交易类型 JSAPI、NATIVE、APP
  bank_type varchar(16) DEFAULT NULL,#银行类型
  total_fee int(10) DEFAULT NULL,#订单金额
  settlement_total_fee int(10) DEFAULT NULL,#应结订单金额 应结订单金额=订单金额-非充值代金券金额，应结订单金额<=订单金额
  fee_type varchar(8) DEFAULT NULL,#货币类型
  cash_fee int(10) DEFAULT NULL,#现金支付金额 订单现金支付金额
  cash_fee_type varchar(16) DEFAULT NULL, #现金支付货币类型
  coupon_fee  int(10) DEFAULT NULL,#代金券金额<=订单金额，订单金额-代金券金额=现金支付金额
  coupon_count int (10) DEFAULT NULL, #代金券使用数量
  coupon_type_$n varchar(20) DEFAULT NULL ,#代金券类型 
  coupon_id_$n varchar(20) DEFAULT NULL, #代金券ID
  coupon_fee_$n  int(10) DEFAULT NULL, #单个代金券支付金额
  transaction_id varchar(32) DEFAULT NULL,#微信支付订单号
  out_trade_no varchar(32) DEFAULT NULL,#商户订单号
  attach varchar(128) DEFAULT NULL,#商家数据包
  time_end varchar(14) DEFAULT NULL,#支付完成时间
  PRIMARY KEY (id),
  INDEX openid (openid)
)DEFAULT CHARSET=utf8 ;