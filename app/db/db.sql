DROP DATABASE IF EXISTS ecough;

CREATE DATABASE ecough;

USE ecough; 

CREATE TABLE IF NOT EXISTS STORE (
  product_id int(16) NOT NULL COMMENT '商品id',
  title varchar(36) DEFAULT NULL COMMENT '网页标题',
  keywords varchar(255) DEFAULT NULL COMMENT '网页关键字',
  description varchar(255) DEFAULT NULL COMMENT '网页描述',
  centent TEXT DEFAULT NULL COMMENT '网页内容',
  name varchar(72) DEFAULT NULL COMMENT '产品名称',
  sku_description varchar(255) DEFAULT NULL COMMENT '产品描述',
  sku_info TEXT(255) DEFAULT NULL COMMENT '多规格({"specifications":"10*10米","price":1000,"old_price":1200,"stock_num":0})',
  icon_url varchar(255) DEFAULT NULL COMMENT 'icon图片地址',
  icon_url_opt TEXT DEFAULT NULL COMMENT '其他图片',
  isPostFree tinyint(1) DEFAULT '1' COMMENT '是否包邮 1-是，0-否',
  isHasReceipt tinyint(1) DEFAULT '0' COMMENT '是否提供发票 1-是，0-否',
  isUnderGuaranty tinyint(1) DEFAULT '0' COMMENT '是否保修 1-是，0-否',
  isSupportReplace tinyint(1) DEFAULT '0' COMMENT '是否支持退换货 1-是，0-否',
  PRIMARY KEY (product_id)
)DEFAULT CHARSET=utf8  COMMENT='产品表';

INSERT INTO STORE SET product_id = 100001, name = '防雾霾窗贴', title = '防雾霾窗贴', sku_attr = '白色;黑色', sku_info = '{"specifications":"10*10米","price":1000,"old_price":1200,"stock_num":0};{"specifications":"12*12米","price":1200,"old_price":1500,"stock_num":100}', icon_url = '/images/fangwumaichuangtie_share.jpeg'; 


CREATE TABLE IF NOT EXISTS USER (
  id int(11) NOT NULL AUTO_INCREMENT,
  subscribe int(1) NOT NULL COMMENT '用户是否订阅该公众号标识，值为0时，代表此用户没有关注该公众号，拉取不到其余信息',
  openid varchar(128) NOT NULL COMMENT 'openid',
  nickname varchar(50) DEFAULT NULL COMMENT '用户昵称',
  sex int(1) DEFAULT NULL COMMENT '用户的性别，值为1时是男性，值为2时是女性，值为0时是未知',
  city varchar(128) DEFAULT NULL COMMENT '用户所在城市',
  country varchar(128) DEFAULT NULL COMMENT '用户所在国家',
  province varchar(128) DEFAULT NULL COMMENT '用户所在省份',
  language varchar(128) DEFAULT NULL COMMENT '用户的语言，简体中文为zh_CN',
  headimgurl varchar(255) DEFAULT NULL COMMENT '用户头像，最后一个数值代表正方形头像大小（有0、46、64、96、132数值可选，0代表640*640正方形头像），用户没有头像时该项为空。若用户更换头像，原有头像URL将失效',
  subscribe_time int(36) DEFAULT NULL COMMENT '用户关注时间，为时间戳。如果用户曾多次关注，则取最后关注时间',
  unionid varchar(128) DEFAULT NULL COMMENT '只有在用户将公众号绑定到微信开放平台帐号后，才会出现该字段',
  remark varchar(255) DEFAULT NULL COMMENT '公众号运营者对粉丝的备注，公众号运营者可在微信公众平台用户管理界面对粉丝添加备注',
  groupid int(16) DEFAULT NULL COMMENT '用户所在的分组ID',
  tagid_list varchar(255) DEFAULT NUll COMMENT '用户被打上的标签ID列表',
  subscribe_scene varchar(255) DEFAULT NULL COMMENT '返回用户关注的渠道来源，ADD_SCENE_SEARCH 公众号搜索，ADD_SCENE_ACCOUNT_MIGRATION 公众号迁移，ADD_SCENE_PROFILE_CARD 名片分享，ADD_SCENE_QR_CODE 扫描二维码，ADD_SCENEPROFILE LINK 图文页内名称点击，ADD_SCENE_PROFILE_ITEM 图文页右上角菜单，ADD_SCENE_PAID 支付后关注，ADD_SCENE_OTHERS 其他',
  qr_scene int(16) DEFAULT NUll COMMENT '二维码扫码场景（开发者自定义)',
  qr_scene_str varchar(255) DEFAULT NUll COMMENT '二维码扫码场景描述（开发者自定义)',
  eventKey varchar(128) DEFAULT NULL COMMENT '推广人',
  phone varchar(16) DEFAULT NULL COMMENT '用户电话',
  integral int(16) DEFAULT 0 COMMENT '积分', 
  create_time varchar(36) DEFAULT NULL COMMENT '创建时间',
  flag varchar(64) DEFAULT '1' COMMENT '是否是首单（1-首单, 订单号）',
  order_count int(12) DEFAULT 0 COMMENT '下单次数',
  total_consume int(8) DEFAULT 0 COMMENT '推广总件数',
  consume int(8) DEFAULT 0 COMMENT '推广件数',
  PRIMARY KEY (id),
  INDEX openid (openid)
) DEFAULT CHARSET=utf8mb4 COMMENT='用户表';


CREATE TABLE IF NOT EXISTS ORDER (
  id int NOT NULL AUTO_INCREMENT,
  openid varchar(128) NOT NULL COMMENT 'openid',
  name varchar(32) NOT NULL COMMENT '姓名',
  address varchar(128) NOT NULL COMMENT '地址',
  phone varchar(32) NOT NULL COMMENT '电话',
  product varchar(128) NOT NULL COMMENT '产品',
  img_url varchar(255) DEFAULT NULL COMMENT '产品图片',
  title varchar(255) DEFAULT NUll COMMENT '产品标题',
  url varchar(255) DEFAULT NULL COMMENT '产品url',
  total varchar(20) NOT NULL COMMENT '数量',
  specifications varchar(32) NOT NULL COMMENT '规格',
  pay_money varchar(20) NOT NULL COMMENT '支付金额',
  total_money varchar(20) NOT NULL COMMENT '总金额',
  derate_money varchar(20) NOT NULL COMMENT '减免金额',
  out_trade_no varchar(32) NOT NULL COMMENT '订单号',
  create_time datetime  DEFAULT NULL COMMENT '',
  delivery_company varchar(32) DEFAULT NULL COMMENT '物流公司id (申通快递-shentong )（百世快递-huitongkuaidi）',
  delivery_track_no varchar(32) DEFAULT NULL COMMENT '物流号',
  status int(4) NOT NULL COMMENT '订单状态(2-待发货, 3-已发货, 5-已完成, 8-维权中 0-取消 4-申请退款)',
  eventKey varchar(128) DEFAULT NUlL COMMENT '推广员',
  PRIMARY KEY (id),
  INDEX openid (openid),
  INDEX out_trade_no (out_trade_no),
  INDEX create_time (create_time)
)DEFAULT CHARSET=utf8  COMMENT='订单表';

CREATE TABLE IF NOT EXISTS USER_SERVICE (
  id int NOT NULL AUTO_INCREMENT,
  openid varchar(128) NOT NULL COMMENT 'openid',
  out_trade_no varchar(32) NOT NULL COMMENT '订单号',
  title varchar(255) NOT NULL COMMENT '问题标题',
  issue TEXT NOT NULL COMMENT '问题详细内容',
  phone varchar(255) DEFAULT NULL COMMENT '联系方式', 
  create_time datetime NOT NULL COMMENT '',
  PRIMARY KEY (id),
  INDEX openid (openid)
)DEFAULT CHARSET=utf8 COMMENT='用户售后服务' ;

CREATE TABLE IF NOT EXISTS CONFIG (
  id int NOT NULL AUTO_INCREMENT,
  appid varchar(128) DEFAULT '' COMMENT '微信公众号appid',
  appSecret varchar(255) DEFAULT '' COMMENT '微信公众号appidappSecret',
  token varchar(255) DEFAULT '' COMMENT '微信公众号appidtoken',
  store_mchid varchar(32) DEFAULT '' COMMENT '微信支付商户mch_id', 
  store_key varchar(255) DEFAULT '' COMMENT '商户支付key',
  encodingAESKey varchar(255) DEFAULT '' COMMENT '微信公众号消息加密',
  message_text varchar(255) DEFAULT '终于等到您，还好没放弃' COMMENT '微信公众号回复内容',
  message_default varchar(255) DEFAULT '冥冥之中自有缘分' COMMENT '微信公众号默认回复内容',
  sms_accessKeyId varchar(255) DEFAULT '' COMMENT '阿里短信accessKeyId',
  sms_secretAccessKey varchar(255) DEFAULT '' COMMENT '阿里短信 secretAccessKey',
  sms_TemplateCode varchar(255) DEFAULT '' COMMENT '阿里短信 TemplateCode',
  sms_SignName varchar(255) DEFAULT '' COMMENT '阿里短信 SignName',
  server_host varchar(255) DEFAULT '' COMMENT '填写微信公众号后台授权的url地址',
  template_title TEXT DEFAULT NULL COMMENT '微信支付成功模版消息标题',
  template_remake TEXT DEFAULT NULL COMMENT '微信支付成功模版消息备注',
  derate_money int(36) DEFAULT 0 COMMENT '首单代金券',
  spread_voucher varchar(10) DEFAULT 1 COMMENT '推广获得m面值代金券',
  signup_phone_integral varchar(10) DEFAULT '0' COMMENT '注册手机获得x积分',
  shoping_integral varchar(10) DEFAULT '0' COMMENT '购买商品获得x积分',
  n_integral varchar(10) DEFAULT '0' COMMENT 'n积分换取m面值代金券',
  m_voucher varchar(10) DEFAULT '0' COMMENT 'm面值代金券',
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
)DEFAULT CHARSET=utf8  COMMENT='支付通知';

CREATE TABLE IF NOT EXISTS FAQ (
  id int NOT NULL AUTO_INCREMENT ,
  title varchar(128) NOT NULL COMMENT '标题',
  centent TEXT NOT NULL COMMENT '内容',
  create_time datetime DEFAULT NULL COMMENT '',
  PRIMARY KEY (id)
)DEFAULT CHARSET=utf8 COMMENT='常见问题';

CREATE TABLE IF NOT EXISTS GIFT (
  id int NOT NULL AUTO_INCREMENT ,
  title varchar(255) NOT NULL COMMENT '标题',
  name varchar(255) NOT NUll COMMENT '产品名称',
  specifications varchar(255) DEFAULT NULL COMMENT '规格',
  img_url varchar(255) DEFAULT NULL COMMENT '大图URL',
  centent TEXT NOT NULL COMMENT '详细内容',
  icon_url varchar(255) DEFAULT NULL COMMENT '小图URL',
  consume int(10) DEFAULT NUll COMMENT '所需件数',
  create_time datetime DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (id),
  INDEX create_time (create_time)
)DEFAULT CHARSET=utf8 COMMENT='礼品';

CREATE TABLE IF NOT EXISTS TOKEN (
  id int NOT NULL AUTO_INCREMENT,
  access_token varchar(255) NOT NULL COMMENT '微信token凭证',
  expires_in varchar(36) NOT NULL COMMENT '有效时间,时间戳',
  create_time varchar(36) NOT NULL COMMENT '创建时间,时间戳',
  update_time varchar(36) NOT NULL COMMENT '更新时间,时间戳',
  PRIMARY KEY (id)
)DEFAULT CHARSET=utf8 COMMENT='微信票据';



CREATE TABLE IF NOT EXISTS TICKET (
  id int NOT NULL AUTO_INCREMENT,
  ticket varchar(255) NOT NULL COMMENT '微信ticket临时凭证',
  expires_in varchar(36) NOT NULL COMMENT '有效时间,时间戳',
  create_time varchar(36) NOT NULL COMMENT '创建时间,时间戳',
  update_time varchar(36) NOT NULL COMMENT '更新时间,时间戳',
  PRIMARY KEY (id)
)DEFAULT CHARSET=utf8 COMMENT='微信临时票据';
