const db = require('../utils/mysql');

//获取常见问题
exports.getFAQ = ()=> {
	return db.find("SELECT * FROM FAQ ORDER BY CREATE_TIME DESC");
}
//获取一条常见问题
exports.getFAQById = (id)=> {
	return db.findOne("SELECT * FROM FAQ WHERE ? ",{id: id});
}
//获取一条FAQ
exports.updateFAQ = (data, id)=> {
	return db.update("FAQ",data, {id: id});
}
//根据ID删除一条FAQ
exports.delFAQ = (id)=> {
	return db.delete("FAQ", {id: id});
}
//增加一条FAQ
exports.addFAQ = (data)=> {
	return db.add("FAQ", data);
}
//获取产品
exports.getStore = ()=> {
	return db.find("SELECT * FROM STORE");
}
