var db = require("../utils/mysql");

//新增用户
exports.saveUser = async (data) => {
	const result = await db.getByOpenId("USER", data.openid)
	if(result.openid) {
		return db.update("USER", data, {openid: data.openid})
	}else{
		return db.add("USER", data)
	}
}
//记录用户购买订单号,关闭首单 
exports.updateUserByFlag = (openid, out_trade_no) => {
	return db.update("USER", {flag: out_trade_no}, {openid});
}

// new end

exports.getUserInfoByOpenId = (openid) => {
	var result = db.findOne("SELECT * FROM USER WHERE ?", {openid: openid});
	return result;
}
//删除用户信息
exports.removeUserByOpenId = (openid)=> {
	return db.update("USER",{eventKey: null, integral: 0, order_count: 0, consume: 0, total_consume: 0}, {openid: openid});
}
//删除对应推广员
exports.removeUserForEventKeyByOpenid = (openid)=> {
	return db.update("USER",{eventKey: null},{eventKey: openid});
}
//获取用户订单
exports.getUserOrder = (openid) => {
	var result = db.find("SELECT * FROM ORDERS WHERE openid='" + openid + "' ORDER BY CREATE_TIME DESC");
	return result;
}

//根据条件查询
exports.queryUserOrder = (data) =>{
	var result = db.find("SELECT * FROM ORDERS WHERE openid = '"+data.openid+"' and create_time >= '"+data.date+"' ORDER BY CREATE_TIME DESC");
	return result;
}

//获取用户订单号
exports.getUserOrderNumber = (openid) =>{
	var result = db.find("SELECT out_trade_no FROM ORDERS WHERE openid='" + openid +"'");
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
	var result = db.find("SELECT ifnull(SUM(total),0) as order_count, (SELECT A.headimgurl from USER A where A.openid = O.openid) as headimgurl, (select B.nickname from USER B where B.openid = O.openid) as nickname FROM ORDERS O where O.status in(3,5) AND eventKey = '"+ eventKey+"' GROUP BY O.openid;");
	return result;
}
//查询已经推广人数购买产品的数量
exports.getUserTotalConsume = (eventKey)=> {
	return db.findOne("SELECT total_consume, consume, (select count(DISTINCT openid) from ORDERS where eventKey ='"+ eventKey+"' AND status IN(3,5)) as count, (select ifnull(SUM(total),0) from ORDERS where eventKey = '"+ eventKey+"' AND status IN(3,5)) as order_count FROM USER  WHERE openid = '"+ eventKey+"'");
} 

//获取用户积分
exports.getUserForIntegralByOpenId = (openid)=> {
	var result = db.findOne("SELECT integral FROM USER WHERE openid = '"+ openid+ "' ORDER BY CREATE_TIME DESC");
	return result
}


exports.delUserForIntegralByOpendId = (value, openid)=> {
	var result  = db.update("USER", value, openid);
	return result
}

exports.addUserForIntegralByOpendId = (value, openid)=> {
  var result = db.update("USER", value, openid);
  return result;
}

exports.getUserFlagByOpenId = (openid)=> {
	var result = db.findOne("SELECT flag FROM USER WHERE ?", {openid});
	return result;
}

exports.setUserPhone = (data) => {
	var result = db.find("UPDATE USER SET integral = integral+"+data.integral+", phone = "+data.phone+" WHERE openid = '"+data.openid +"'");
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
	return db.findOne("SELECT *, (SELECT consume FROM USER WHERE openid = '" + openid + "') as myConsume FROM GIFT WHERE ? ", {id: id});
}

exports.addUserConsumeByEventKey = (eventKey, total)=> {
	return db.find("UPDATE USER SET consume = consume+" + total + " ,total_consume = total_consume+"+total+" WHERE openid = '" + eventKey +"'");
}
exports.addUserConsumeByOpenId = (openid, consume)=> {
	return db.find("UPDATE USER SET consume = consume+" + consume + " WHERE openid = '" + openid +"'");
}
exports.delUserConsumeByOpenId = (openid, consume)=> {
	return db.find("UPDATE USER SET consume = consume-"+ consume + " WHERE openid = '" + openid + "'");
}
exports.addUserOrderCountByOpenId = (openid)=> {
	return db.find("UPDATE USER SET order_count = order_count+1 WHERE openid = '"+openid+"'");
}

exports.getUserOrderForStatusByStatusAndOpenId = (openid, status, page, size)=> {
	return db.queryPage("SELECT * FROM ORDERS WHERE ? AND ?",[{openid}, {status}], page, size);
}
