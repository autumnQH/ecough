var db = require("../utils/mysql");


var getStore = function() {
	var result = db.find("SELECT * FROM STORE");
	return result;
}

//更新商品信息
var updateStore = function(data) {
	var result = db.update("STORE", data, {product_id: data.product_id});
	return result;
}
//获取商品信息
var getStoreById = function(product_id) {
	var result = db.findOne("SELECT * FROM STORE WHERE product_id='"+ product_id+"' ");
	return result;
}
module.exports = { 
	getStore: getStore,
	updateStore: updateStore,
	getStoreById: getStoreById
};