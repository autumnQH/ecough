var db = require("../utils/mysql");

//获取商品信息
var getStoreById = function(product_id) {
	var result = db.findOne("SELECT * FROM STORE WHERE product_id='"+ product_id+"' ");
	return result;
}
module.exports = { 
	getStoreById: getStoreById
};