DROP DATABASE IF EXISTS ecough;

CREATE DATABASE ecough;

USE ecough; 


CREATE TABLE IF NOT EXISTS T_WECHAT_QRCODE (
  id int NOT NULL AUTO_INCREMENT,
  name varchar(36) DEFAULT NULL COMMENT 'name',
  expire_seconds int(16) DEFAULT NULL COMMENT '该二维码有效时间，以秒为单位.最大不超过2592000（即30天)',
  scene_str varchar(125) DEFAULT NULL COMMENT '场景值 string',
  scene_id int(32) DEFAULT NULL COMMENT '场景值 id参数只支持1--100000',
  action_name varchar(36) DEFAULT NULL COMMENT '二维码类型 QR_SCENE为临时的整型参数值，QR_STR_SCENE为临时的字符串参数值，QR_LIMIT_SCENE为永久的整型参数值，QR_LIMIT_STR_SCENE为永久的字符串参数值',
  ticket varchar(255) NOT NULL COMMENT '获取的二维码ticket，凭借此ticket可以在有效时间内换取二维码',
  url varchar(255) NOT NULL COMMENT '二维码图片解析后的地址',
  create_time datetime  DEFAULT NULL COMMENT ,
  PRIMARY KEY (id)
)DEFAULT CHARSET=utf8  COMMENT='生成带参数二维码';

CREATE TABLE IF NOT EXISTS T_WECHAT_USER (
  id int(11) NOT NULL AUTO_INCREMENT,
  openid varchar(128) NOT NULL COMMENT 'openid',
  headimgurl varchar(255) DEFAULT NULL COMMENT '用户头像url',
  nick varchar(20) DEFAULT NULL COMMENT '用户昵称',
  phone varchar(16) DEFAULT NULL COMMENT '用户电话',
  ticket varchar(255) DEFAULT NULL COMMENT '二维码的ticke值',
  eventKey varchar(255) DEFAULT NULL COMMENT '二维码的场景值',
  integral int(16) DEFAULT 0 COMMENT '积分', 
  create_time datetime DEFAULT NULL COMMENT '',
  flag tinyint(1) DEFAULT '1' COMMENT '是否是首单',
  order_count int(12) DEFAULT 0 COMMENT '下单次数',
  PRIMARY KEY (id),
  Index openid (openid),
  Index eventKey (eventKey)
) DEFAULT CHARSET=utf8 COMMENT='用户表';


CREATE TABLE IF NOT EXISTS T_WECHAT_ORDER (
  id int NOT NULL AUTO_INCREMENT,
  openid varchar(128) NOT NULL COMMENT 'openid',
  name varchar(32) NOT NULL COMMENT '姓名',
  address varchar(128) NOT NULL COMMENT '地址',
  phone varchar(32) NOT NULL COMMENT '电话',
  product varchar(128) NOT NULL COMMENT '产品',
  total varchar(20) NOT NULL COMMENT '数量',
  specifications varchar(32) NOT NULL COMMENT '规格',
  pay_money varchar(20) NOT NULL COMMENT '支付金额',
  total_money varchar(20) NOT NULL COMMENT '总金额',
  derate_money varchar(20) NOT NULL COMMENT '减免金额',
  out_trade_no varchar(32) NOT NULL COMMENT '订单号',
  create_time datetime  DEFAULT NULL COMMENT '',
  delivery_company varchar(32) DEFAULT NULL COMMENT '物流公司id (申通快递-shentong )（百世快递-huitongkuaidi）',
  delivery_track_no varchar(32) DEFAULT NULL COMMENT '物流号',
  status int(4) NOT NULL COMMENT '订单状态(2-待发货, 3-已发货, 5-已完成, 8-维权中 )',
  PRIMARY KEY (id),
  INDEX openid (openid),
  INDEX out_trade_no (out_trade_no)
)DEFAULT CHARSET=utf8  COMMENT='订单表';

CREATE TABLE IF NOT EXISTS USER_SERVICE (
  id int NOT NULL AUTO_INCREMENT,
  openid varchar(128) NOT NULL COMMENT 'openid',
  out_trade_no varchar(32) NOT NULL COMMENT '订单号',
  title varchar(255) NOT NULL COMMENT '问题标题',
  issue TEXT NOT NULL COMMENT '问题详细内容',
  phone int(32) NOT NULL COMMENT '用户电话', 
  PRIMARY KEY (id),
  INDEX openid (openid)
)DEFAULT CHARSET=utf8 COMMENT='用户售后服务' ;

CREATE TABLE IF NOT EXISTS USER_VOUCHER (#
  id int(11) NOT NULL AUTO_INCREMENT,
  openid varchar(128) NOT NULL COMMENT 'openid',
  voucher_type varchar(36) DEFAULT NULL COMMENT '代金券类别',
  voucher_denomination int(10) DEFAULT NULL COMMENT '代金券面额',
  create_time datetime DEFAULT NULL COMMENT '创建时间',
  end_time datetime DEFAULT NULL COMMENT '到期时间',
  PRIMARY KEY (id),
  Index openid (openid)
) DEFAULT CHARSET=utf8 COMMENT='用户代金券';


CREATE TABLE IF NOT EXISTS STORE_ORDER (
  id int NOT NULL AUTO_INCREMENT ,
  openid varchar(128) NOT NULL COMMENT 'openid',
  order_id varchar(255) NOT NULL COMMENT '订单id',
  order_status varchar(255) NOT NULL COMMENT '订单状态',
  product_id varchar(255) NOT NULL COMMENT '商品id',
  sku_info varchar(255) NOT NULL COMMENT '其他',
  create_time datetime DEFAULT NULL COMMENT '',
  PRIMARY KEY (id),
  INDEX openid (openid)
)DEFAULT CHARSET=utf8 COMMENT='微信小店';

CREATE TABLE IF NOT EXISTS CONFIG (
  id int NOT NULL AUTO_INCREMENT,
  appid varchar(128) DEFAULT '' COMMENT 'appid',
  appSecret varchar(255) DEFAULT '' COMMENT 'appSecret',
  token varchar(255) DEFAULT '' COMMENT 'token',
  store_mchid varchar(32) DEFAULT '' COMMENT '商户mch_id', 
  store_key varchar(255) DEFAULT '' COMMENT '商户支付key',
  encodingAESKey varchar(255) DEFAULT '' COMMENT '消息加密',
  message_text varchar(255) DEFAULT '终于等到您，还好没放弃' COMMENT '回复内容',
  message_default varchar(255) DEFAULT '冥冥之中自有缘分' COMMENT '默认回复内容',
  sms_accessKeyId varchar(255) DEFAULT '' COMMENT '阿里短信accessKeyId',
  sms_secretAccessKey varchar(255) DEFAULT '' COMMENT '阿里短信 secretAccessKey',
  sms_TemplateCode varchar(255) DEFAULT '' COMMENT '阿里短信 TemplateCode',
  sms_SignName varchar(255) DEFAULT '' COMMENT '阿里短信 SignName',
  server_host varchar(255) DEFAULT '' COMMENT '网站',
  original_money_13 int(36) DEFAULT 1 COMMENT '1.3米规格原价',
  current_money_13 int(36) DEFAULT 1 COMMENT '1.3米规格现价',
  original_money_10 int(36) DEFAULT 1 COMMENT '1.0米规格原价',
  current_money_10 int(36) DEFAULT 1 COMMENT '1.0米规格现价',
  derate_money int(36) DEFAULT 0 COMMENT '首单代金券',
  spread_voucher int(10) DEFAULT 1 COMMENT '推广获得代金券',
  signup_phone_integral int(10) DEFAULT NULL COMMENT '注册手机获得x积分',
  shoping_integral int(10) DEFAULT NULL COMMENT '购买商品获得x积分',
  n_integral int(10) DEFAULT NULL COMMENT 'n积分换取m面值代金券',
  m_voucher int(10) DEFAULT NULL COMMENT 'm面值代金券',
  default_total int(4) DEFAULT NULL COMMENT '默认分页',
  PRIMARY KEY (id)
)DEFAULT CHARSET=utf8 COMMENT='config';

CREATE TABLE IF NOT EXISTS NOTIFY (
  id int NOT NULL AUTO_INCREMENT,
  appid varchar(128) DEFAULT NULL COMMENT 'appid',
  mch_id varchar(32) DEFAULT NULL COMMENT '商户号mch_id',
  device_info varchar(32) DEFAULT NULL COMMENT '设备号',
  nonce_str varchar(32) DEFAULT NULL COMMENT '随机字符串',
  sign varchar(32) DEFAULT NULL COMMENT '签名',
  sign_type varchar(32) DEFAULT NULL COMMENT '签名类型',
  result_code varchar(16) DEFAULT NULL COMMENT '业务结果',
  return_code varchar(128) DEFAULT NULL COMMENT '业务代码',
  err_code varchar(32) DEFAULT NULL COMMENT '错误代码',
  err_code_des varchar(128) DEFAULT NULL COMMENT '错误代码描述',
  openid varchar(128) DEFAULT NULL COMMENT '用户标示',
  is_subscribe varchar(1) DEFAULT NULL COMMENT '用户是否关注公众账号，Y-关注，N-未关注，仅在公众账号类型支付有效',
  trade_type varchar(16) DEFAULT NULL COMMENT '交易类型 JSAPI、NATIVE、APP',
  bank_type varchar(16) DEFAULT NULL COMMENT '银行类型',
  total_fee int(10) DEFAULT NULL COMMENT '订单金额',
  settlement_total_fee int(10) DEFAULT NULL COMMENT '应结订单金额 应结订单金额=订单金额-非充值代金券金额，应结订单金额<=订单金额',
  fee_type varchar(8) DEFAULT NULL COMMENT '货币类型',
  cash_fee int(10) DEFAULT NULL COMMENT '现金支付金额 订单现金支付金额',
  cash_fee_type varchar(16) DEFAULT NULL COMMENT '现金支付货币类型', 
  coupon_fee  int(10) DEFAULT NULL COMMENT '代金券金额<=订单金额，订单金额-代金券金额=现金支付金额',
  coupon_count int (10) DEFAULT NULL COMMENT '代金券使用数量', 
  coupon_type_$n varchar(20) DEFAULT NULL  COMMENT '代金券类型',
  coupon_id_$n varchar(20) DEFAULT NULL COMMENT '代金券ID', 
  coupon_fee_$n  int(10) DEFAULT NULL COMMENT '单个代金券支付金额',
  transaction_id varchar(32) DEFAULT NULL COMMENT '微信支付订单号',
  out_trade_no varchar(32) DEFAULT NULL COMMENT '商户订单号',
  attach varchar(128) DEFAULT NULL COMMENT '商家数据包',
  time_end varchar(14) DEFAULT NULL COMMENT '支付完成时间',
  PRIMARY KEY (id),
  INDEX openid (openid)
)DEFAULT CHARSET=utf8  COMMENT='支付成功通知';