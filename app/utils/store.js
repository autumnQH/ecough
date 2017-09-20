const dao = require('../dao/store');

//获取商品
exports.getStoreById = async (product_id)=> {
	return dao.getStoreById(product_id);
}