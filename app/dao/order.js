var db = require("../utils/mysql");

//根据id查找订单
exports.getOneOrderById = (id)=> {
	return db.findOne("SELECT * FROM T_WECHAT_ORDER WHERE ?", {id: id});
}