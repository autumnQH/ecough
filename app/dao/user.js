var db = require("../utils/mysql");

var getUserInfoByOpenId = (openid) => {
	var result = db.findOne("SELECT * FROM T_WECHAT_USER WHERE ?", {openid: openid});
	return result;
}

var getUserOrder = (openid) => {
	var result = db.find("SELECT * FROM T_WECHAT_ORDER WHERE openid='" + openid + "' ORDER BY CREATE_TIME DESC");
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

//获取我的获取
var getUserService = () => {
	var result = db.find("SELECT * FROM USER_SERVICE");
	return result;
}

//获取用户场景值
var getUserByEnentKey = (eventKey) => {
	var result = db.find("SELECT headimgurl, nick , order_count FROM T_WECHAT_USER WHERE order_count > 0 AND eventKey = 'qrscene_"+ eventKey +"' or eventKey = '"+ eventKey+"' AND order_count > 0 ORDER BY order_count DESC");
	return result;
}

//获取用户积分
var getUserForIntegralByOpenId = (openid) => {
	var result = db.findOne("SELECT integral FROM T_WECHAT_USER WHERE openid = '"+ openid+ "' ORDER BY CREATE_TIME DESC");
	return result
}

var delUserForIntegralByOpendId = (value, openid) => {
	var result  = db.update("T_WECHAT_USER", value, openid);
	return result
}

var addUserForIntegralByOpendId = () => {
  var result = db.update("T_WECHAT_USER", value, openid);
  return result;
}

var getUserVoucherByOpenId = (openid) => {
	var result = db.find("SELECT * FROM USER_VOUCHER WHERE openid = '" + openid+ "' ORDER BY CREATE_TIME DESC");
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
var addUserOrderCount = (openid)=> {
	var result = db.find("update T_WECHAT_USER set order_count = order_count+1, flag = false where openid = '"+openid +"'");
	return result;
}
var setUserPhone = (data) => {
	var result = db.update("T_WECHAT_USER",{phone: data.phone}, {openid: data.openid});
	return result;
}
module.exports = { 
	getUserInfoByOpenId: getUserInfoByOpenId,
	getUserOrder: getUserOrder,
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
	setUserPhone: setUserPhone
};
