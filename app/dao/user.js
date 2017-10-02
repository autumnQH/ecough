var db = require("../utils/mysql");

var getUserInfoByOpenId = (openid) => {
	var result = db.findOne("SELECT * FROM T_WECHAT_USER WHERE ?", {openid: openid});
	return result;
}

//获取用户订单
var getUserOrder = (openid) => {
	var result = db.find("SELECT * FROM T_WECHAT_ORDER WHERE openid='" + openid + "' ORDER BY CREATE_TIME DESC");
	return result;
}

//根据条件查询
var queryUserOrder = (data) =>{
	var result = db.find("SELECT * FROM T_WECHAT_ORDER WHERE openid = '"+data.openid+"' and create_time >= '"+data.date+"' ORDER BY CREATE_TIME DESC");
	return result;
}

//获取用户订单号
var getUserOrderNumber = (openid) =>{
	var result = db.find("SELECT out_trade_no FROM T_WECHAT_ORDER WHERE openid='" + openid +"'");
	return result;
}

//设置我的客服
var setUserService = (data) => {
	var result = db.add("USER_SERVICE", data);
	return result;
}

//获取我的客服
var getUserService = () => {
	var result = db.find("SELECT * FROM USER_SERVICE");
	return result;
}

//获取用户场景值
var getUserByEnentKey = (eventKey) => {
	var result = db.find("SELECT headimgurl, nick , (select create_time from T_WECHAT_ORDER where openid = U.openid and status = 1 or status = 5 ORDER BY CREATE_TIME LIMIT 1 )as create_time FROM T_WECHAT_USER as U WHERE order_count > 0 AND eventKey = 'qrscene_"+ eventKey +"' or eventKey = '"+ eventKey+"' AND order_count > 0 ORDER BY order_count DESC");
	return result;
}

//获取用户积分
var getUserForIntegralByOpenId = (openid) => {
	var result = db.findOne("SELECT integral FROM T_WECHAT_USER WHERE openid = '"+ openid+ "' ORDER BY CREATE_TIME DESC");
	return result
}

//设置用户代金券使用中
var updateUserVoucherById = (id, order_id)=>{
	var result = db.update("USER_VOUCHER", {status: 3, order_id: order_id }, {id: id});
}

var delUserForIntegralByOpendId = (value, openid) => {
	var result  = db.update("T_WECHAT_USER", value, openid);
	return result
}

var addUserForIntegralByOpendId = (value, openid) => {
  var result = db.update("T_WECHAT_USER", value, openid);
  return result;
}

var getUserVoucherByOpenId = (openid) => {
	var result = db.find("SELECT * FROM USER_VOUCHER WHERE ? AND status = 2 ORDER BY CREATE_TIME DESC", {openid: openid});
	return result;
}
var setUserVoucher = (data)=> {
	var result = db.add("USER_VOUCHER", data);
	return result;
}
var getUserFlagByOpenId = (openid)=> {
	var result = db.findOne("SELECT flag FROM T_WECHAT_USER WHERE openid = '"+openid + "'");
	return result;
}

var setUserPhone = (data) => {
	var result = db.find("UPDATE T_WECHAT_USER SET integral = integral+"+data.integral+", phone = "+data.phone+" WHERE openid = '"+data.openid +"'");
	return result;
}

var getFAQ = () => {
	var result = db.find("SELECT id, title FROM FAQ ORDER BY create_time DESC");
	return result;
}

var getFAQById = (id) => {
	var result = db.findOne("SELECT * FROM FAQ WHERE id = '" +id+ "'");
	return result;
}
module.exports = { 
	getUserInfoByOpenId: getUserInfoByOpenId,
	getUserOrder: getUserOrder,
	queryUserOrder: queryUserOrder,
	getUserOrderNumber: getUserOrderNumber,
	setUserService: setUserService,
	getUserService: getUserService,
	getUserByEnentKey: getUserByEnentKey,
	getUserForIntegralByOpenId: getUserForIntegralByOpenId,
	delUserForIntegralByOpendId: delUserForIntegralByOpendId,
	addUserForIntegralByOpendId: addUserForIntegralByOpendId,
	getUserVoucherByOpenId: getUserVoucherByOpenId,
	setUserVoucher: setUserVoucher,
	getUserFlagByOpenId: getUserFlagByOpenId,
	setUserPhone: setUserPhone,
	getFAQ: getFAQ,
	getFAQById: getFAQById,
	updateUserVoucherById: updateUserVoucherById
};
