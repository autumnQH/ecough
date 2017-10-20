var db = require("../utils/mysql");

var getUserInfoByOpenId = (openid) => {
	var result = db.findOne("SELECT * FROM T_WECHAT_USER WHERE ?", {openid: openid});
	return result;
}
//删除用户信息
var removeUserByOpenId = (openid)=> {
	return db.update("T_WECHAT_USER",{eventKey: null, integral: 0, order_count: 0, consume: 0, total_consume: 0}, {openid: openid});
}
//删除对应推广员
var removeUserForEventKeyByOpenid = (openid)=> {
	return db.update("T_WECHAT_USER",{eventKey: null},{eventKey: openid});
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
var getUserService = ()=> {
	var result = db.find("SELECT * FROM USER_SERVICE");
	return result;
}

//获取用户场景值
var getUserByEnentKey = (eventKey)=> {
	//var result = db.find("SELECT headimgurl, nick , (select create_time from T_WECHAT_ORDER where out_trade_no = U.flag )as create_time FROM T_WECHAT_USER as U WHERE  flag NOT IN('1')  AND order_count > 0 AND eventKey IN('qrscene_"+ eventKey +"','"+ eventKey+"') ORDER BY order_count DESC");
	//var result = db.find("SELECT headimgurl, nick , order_count FROM T_WECHAT_USER  WHERE  flag NOT IN('1')  AND order_count > 0 AND eventKey IN('qrscene_"+ eventKey +"','"+ eventKey+"') ORDER BY order_count DESC");
	//var result = db.find("SELECT headimgurl, nick , (select count(id) from T_WECHAT_ORDER where eventKey = '"+ eventKey+"' AND status IN(3,5) ) as order_count FROM T_WECHAT_USER as U  WHERE  flag NOT IN('1')  AND order_count > 0 AND eventKey IN('qrscene_"+ eventKey +"','"+ eventKey+"') ORDER BY order_count DESC");
	//var result = db.find("SELECT U.headimgurl, U.nick, count(O.id) as order_count FROM ( select A.id, A.eventKey from T_WECHAT_ORDER A  WHERE A.eventKey = '"+ eventKey+"' AND A.status IN(3,5)) as O LEFT JOIN T_WECHAT_USER  as U ON O.eventKey = U.openid ");
	var result = db.find("SELECT ifnull(SUM(total),0) as order_count, (SELECT A.headimgurl from T_WECHAT_USER A where A.openid = O.openid) as headimgurl, (select B.nick from T_WECHAT_USER B where B.openid = O.openid) as nick FROM T_WECHAT_ORDER O where O.status in(3,5) AND eventKey = '"+ eventKey+"' GROUP BY O.openid;");
	return result;
}
var getUserTotalConsume = (eventKey)=> {
	//return db.findOne("SELECT total_consume, consume, (select count(id) from T_WECHAT_USER where eventKey = '"+ eventKey+"' AND flag NOT IN('1')) as count, (select SUM(order_count) from T_WECHAT_USER where eventKey = '"+ eventKey+"' AND flag NOT IN('1')) as order_count FROM T_WECHAT_USER  WHERE openid = '"+ eventKey+"'");
	return db.findOne("SELECT total_consume, consume, (select count(DISTINCT openid) from T_WECHAT_ORDER where eventKey ='"+ eventKey+"' AND status IN(3,5)) as count, (select ifnull(SUM(total),0) from T_WECHAT_ORDER where eventKey = '"+ eventKey+"' AND status IN(3,5)) as order_count FROM T_WECHAT_USER  WHERE openid = '"+ eventKey+"'");
} 

//获取用户积分
var getUserForIntegralByOpenId = (openid)=> {
	var result = db.findOne("SELECT integral FROM T_WECHAT_USER WHERE openid = '"+ openid+ "' ORDER BY CREATE_TIME DESC");
	return result
}

//设置用户代金券使用中
var updateUserVoucherById = (id, order_id)=>{
	var result = db.update("USER_VOUCHER", {status: 3, order_id: order_id }, {id: id});
}

var delUserForIntegralByOpendId = (value, openid)=> {
	var result  = db.update("T_WECHAT_USER", value, openid);
	return result
}

var addUserForIntegralByOpendId = (value, openid)=> {
  var result = db.update("T_WECHAT_USER", value, openid);
  return result;
}

var getUserVoucherByOpenId = (openid)=> {
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
var showGift = ()=> {
	return db.find("SELECT id, title, icon_url FROM GIFT ORDER BY create_time DESC");
}

var showGiftById = (openid, id)=> {
	return db.findOne("SELECT *, (SELECT consume FROM T_WECHAT_USER WHERE openid = '" + openid + "') as myConsume FROM GIFT WHERE ? ", {id: id});
}

var addUserConsumeByEventKey = (eventKey, total)=> {
	return db.find("UPDATE T_WECHAT_USER SET consume = consume+" + total + " ,total_consume = total_consume+"+total+" WHERE openid = '" + eventKey +"'");
}
var addUserConsumeByOpenId = (openid, consume)=> {
	return db.find("UPDATE T_WECHAT_USER SET consume = consume+" + consume + " WHERE openid = '" + openid +"'");
}
var delUserConsumeByOpenId = (openid, consume)=> {
	return db.find("UPDATE T_WECHAT_USER SET consume = consume-"+ consume + " WHERE openid = '" + openid + "'");
}
var addUserOrderCountByOpenId = (openid)=> {
	return db.find("UPDATE T_WECHAT_USER SET order_count = order_count+1 WHERE openid = '"+openid+"'");
}

var getUserOrderForStatusByStatusAndOpenId = (openid, status,page, size)=> {
	return db.queryPage("SELECT * FROM T_WECHAT_ORDER WHERE status = "+ status +" AND openid = '"+openid+"'",null, page,size);
}
module.exports = { 
	getUserInfoByOpenId: getUserInfoByOpenId,
	removeUserByOpenId: removeUserByOpenId,
	removeUserForEventKeyByOpenid: removeUserForEventKeyByOpenid,
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
	updateUserVoucherById: updateUserVoucherById,
	showGift: showGift,
	showGiftById: showGiftById,
	addUserConsumeByEventKey: addUserConsumeByEventKey,
	addUserConsumeByOpenId: addUserConsumeByOpenId,
	delUserConsumeByOpenId: delUserConsumeByOpenId,
	getUserTotalConsume: getUserTotalConsume,
	addUserOrderCountByOpenId: addUserOrderCountByOpenId,
	getUserOrderForStatusByStatusAndOpenId: getUserOrderForStatusByStatusAndOpenId
};
