var db = require("../utils/mysql");


//记录用户购买订单号,关闭首单 
exports.updateUserByFlag = (openid, out_trade_no) => {
	return db.find("update T_WECHAT_USER set flag = '"+ out_trade_no+"' where openid = '"+ openid +"'");
}

exports.getUserInfoByOpenId = (openid) => {
	var result = db.findOne("SELECT * FROM T_WECHAT_USER WHERE ?", {openid: openid});
	return result;
}
//删除用户信息
exports.removeUserByOpenId = (openid)=> {
	return db.update("T_WECHAT_USER",{eventKey: null, integral: 0, order_count: 0, consume: 0, total_consume: 0}, {openid: openid});
}
//删除对应推广员
exports.removeUserForEventKeyByOpenid = (openid)=> {
	return db.update("T_WECHAT_USER",{eventKey: null},{eventKey: openid});
}
//获取用户订单
exports.getUserOrder = (openid) => {
	var result = db.find("SELECT * FROM T_WECHAT_ORDER WHERE openid='" + openid + "' ORDER BY CREATE_TIME DESC");
	return result;
}

//根据条件查询
exports.queryUserOrder = (data) =>{
	var result = db.find("SELECT * FROM T_WECHAT_ORDER WHERE openid = '"+data.openid+"' and create_time >= '"+data.date+"' ORDER BY CREATE_TIME DESC");
	return result;
}

//获取用户订单号
exports.getUserOrderNumber = (openid) =>{
	var result = db.find("SELECT out_trade_no FROM T_WECHAT_ORDER WHERE openid='" + openid +"'");
	return result;
}

//设置我的客服
exports.setUserService = (data) => {
	var result = db.add("USER_SERVICE", data);
	return result;
}

//获取我的客服
exports.getUserService = ()=> {
	var result = db.find("SELECT * FROM USER_SERVICE");
	return result;
}

//获取用户场景值
exports.getUserByEnentKey = (eventKey)=> {
	var result = db.find("SELECT ifnull(SUM(total),0) as order_count, (SELECT A.headimgurl from T_WECHAT_USER A where A.openid = O.openid) as headimgurl, (select B.nick from T_WECHAT_USER B where B.openid = O.openid) as nick FROM T_WECHAT_ORDER O where O.status in(3,5) AND eventKey = '"+ eventKey+"' GROUP BY O.openid;");
	return result;
}
//查询已经推广人数购买产品的数量
exports.getUserTotalConsume = (eventKey)=> {
	return db.findOne("SELECT total_consume, consume, (select count(DISTINCT openid) from T_WECHAT_ORDER where eventKey ='"+ eventKey+"' AND status IN(3,5)) as count, (select ifnull(SUM(total),0) from T_WECHAT_ORDER where eventKey = '"+ eventKey+"' AND status IN(3,5)) as order_count FROM T_WECHAT_USER  WHERE openid = '"+ eventKey+"'");
} 

//获取用户积分
exports.getUserForIntegralByOpenId = (openid)=> {
	var result = db.findOne("SELECT integral FROM T_WECHAT_USER WHERE openid = '"+ openid+ "' ORDER BY CREATE_TIME DESC");
	return result
}

//设置用户代金券使用中
exports.updateUserVoucherById = (id, order_id)=>{
	var result = db.update("USER_VOUCHER", {status: 3, order_id: order_id }, {id: id});
}

exports.delUserForIntegralByOpendId = (value, openid)=> {
	var result  = db.update("T_WECHAT_USER", value, openid);
	return result
}

exports.addUserForIntegralByOpendId = (value, openid)=> {
  var result = db.update("T_WECHAT_USER", value, openid);
  return result;
}

exports.getUserVoucherByOpenId = (openid)=> {
	var result = db.find("SELECT * FROM USER_VOUCHER WHERE ? AND status = 2 ORDER BY CREATE_TIME DESC", {openid: openid});
	return result;
}
exports.setUserVoucher = (data)=> {
	var result = db.add("USER_VOUCHER", data);
	return result;
}
exports.getUserFlagByOpenId = (openid)=> {
	var result = db.findOne("SELECT flag FROM T_WECHAT_USER WHERE openid = '"+openid + "'");
	return result;
}

exports.setUserPhone = (data) => {
	var result = db.find("UPDATE T_WECHAT_USER SET integral = integral+"+data.integral+", phone = "+data.phone+" WHERE openid = '"+data.openid +"'");
	return result;
}

exports.getFAQ = () => {
	var result = db.find("SELECT id, title FROM FAQ ORDER BY create_time DESC");
	return result;
}

exports.getFAQById = (id) => {
	var result = db.findOne("SELECT * FROM FAQ WHERE id = '" +id+ "'");
	return result;
}
exports.showGift = ()=> {
	return db.find("SELECT id, title, icon_url FROM GIFT ORDER BY create_time DESC");
}

exports.showGiftById = (openid, id)=> {
	return db.findOne("SELECT *, (SELECT consume FROM T_WECHAT_USER WHERE openid = '" + openid + "') as myConsume FROM GIFT WHERE ? ", {id: id});
}

exports.addUserConsumeByEventKey = (eventKey, total)=> {
	return db.find("UPDATE T_WECHAT_USER SET consume = consume+" + total + " ,total_consume = total_consume+"+total+" WHERE openid = '" + eventKey +"'");
}
exports.addUserConsumeByOpenId = (openid, consume)=> {
	return db.find("UPDATE T_WECHAT_USER SET consume = consume+" + consume + " WHERE openid = '" + openid +"'");
}
exports.delUserConsumeByOpenId = (openid, consume)=> {
	return db.find("UPDATE T_WECHAT_USER SET consume = consume-"+ consume + " WHERE openid = '" + openid + "'");
}
exports.addUserOrderCountByOpenId = (openid)=> {
	return db.find("UPDATE T_WECHAT_USER SET order_count = order_count+1 WHERE openid = '"+openid+"'");
}

exports.getUserOrderForStatusByStatusAndOpenId = (openid, status,page, size)=> {
	return db.queryPage("SELECT * FROM T_WECHAT_ORDER WHERE status = "+ status +" AND openid = '"+openid+"'",null, page,size);
}
