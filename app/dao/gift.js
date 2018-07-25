const db = require('../utils/mysql');

//获取礼品列表
exports.getGift = ()=> {
	return db.find("SELECT * FROM GIFT ORDER BY CREATE_TIME DESC");
}

//获取一条礼品信息
exports.getGiftById = (id)=> {
	return db.findOne("SELECT * FROM GIFT WHERE ? ",{id: id});
}

//添加礼品
exports.addGift = (data)=> {
	return db.add("GIFT", data);
}

//根据Id修改礼品信息
exports.updateGift = (data, id)=> {
	return db.update("GIFT", data, {id: id});
}

//根据ID删除一条礼品
exports.delGiftById = (id)=> {
	return db.delete("GIFT", {id: id})
}


exports.getGiftForConsumeByNameAndSpecifications = (name, specifications)=> {
	return db.findOne("SELECT consume FROM GIFT WHERE ? AND ? ",{name, specifications});
}
