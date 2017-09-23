const dao = require('../dao/store');

exports.getStore = () => {
	return dao.getStore();
}

//修改商品信息
exports.updateStore = (data)=> {
	return dao.updateStore(data);
}
//根据id获取商品
exports.getStoreById = (product_id)=> {
	return dao.getStoreById(product_id);
}