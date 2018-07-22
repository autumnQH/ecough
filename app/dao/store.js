var db = require("../utils/mysql");

//获取全部商品
exports.getStore = function() {
	return db.find("SELECT * FROM STORE");
}

//更新商品信息
exports.updateStore = function(data) {
	return db.update("STORE", data, {product_id: data.product_id});
}
//获取指定商品信息
exports.getStoreById = function(product_id) {
  return db.findOne("SELECT * FROM STORE WHERE ? ", {product_id});
}
