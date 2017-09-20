const dao = require('../dao/user');

//获取用户信息
exports.getUserInfoByOpenId = async function(openid) {
	return dao.getUserInfoByOpenId(openid);
}

//获取 已经下单的人
exports.getUserByEnentKey = async function(eventKey) {
	return dao.getUserByEnentKey(eventKey);
}

//获取用户积分
exports.getUserForIntegralByOpenId = async function(openid) {
	return dao.getUserForIntegralByOpenId(openid);
}

//减 用户积分
exports.delUserForIntegralByOpendId = async function(value, openid) {
	return dao.delUserForIntegralByOpendId(value, openid);
}

//加 用户积分
exports.addUserForIntegralByOpendId = async function(value, openid) {
	return dao.addUserForIntegralByOpendId(value, openid);
}

//获取用户代金券
exports.getUserVoucherByOpenId = async function(openid) {
	return dao.getUserVoucherByOpenId(openid);
}

//添加用户代金券
exports.setUserVoucher = async function (data) {
	return dao.setUserVoucher(data);
}

//获取用户首单
exports.getUserFlagByOpenId = async function(openid) {
	return dao.getUserFlagByOpenId(openid);
}

//用户绑定手机号
exports.setUserPhone = async function(data) {
	return dao.setUserPhone(data);
}

//获取我的订单
exports.getUserOrder = async (openid) => {
	var result = await dao.getUserOrder(openid);
	return result;
}

//条件查询我的订单
exports.queryUserOrder = async (data)=>{
	var result = await dao.queryUserOrder(data);
	return result;
}

//获取我的订单号
exports.getUserOrderNumber = async(openid) => {
	var result = await dao.getUserOrderNumber(openid);
	return result;
}

//设置我的客服
exports.setUserService = async (data) => {
	var result = await dao.setUserService(data);
	return result;
}

//获取我的客服
exports.getUserService = async () => {
	var result = await dao.getUserService();
	return result;
}
