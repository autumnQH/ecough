var db = require("../utils/mysql");

exports.getFAQ = ()=> {
	return db.find("SELECT * FROM FAQ ORDER BY CREATE_TIME DESC");
}

exports.getFAQById = (id)=> {
	return db.findOne("SELECT * FROM FAQ WHERE ? ",{id: id});
}