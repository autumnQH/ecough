const tools = require('./tools');
const dao = require('../dao/user');
const _ = require('lodash');

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