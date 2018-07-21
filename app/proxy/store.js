const store = require('../dao/store');

/**
 * 根据id获取商品
 * @param {Int} product_id 商品id
 */
exports.getStoreById = async (product_id)=> {
  const result = await store.getStoreById(product_id)
  // 格式化商品信息字段
  result.sku_attr = result.sku_attr.split(',');
  let arr = []
  result.sku_info.split(';').forEach(val => {
      arr.push(JSON.parse(val))
  })
  result.sku_info = arr
  return result
}

exports.fetchPrice = (store, specifications) => {
  let price = 0
  store.sku_info.forEach(item => {// 查询商品的对应价格
    if(specifications === item.specifications) {
      price = item.price
    }
  })
  return price
}

// new end

// 获取所有商品
exports.getStore = () => {
	return store.getStore();
}

//修改商品信息
exports.updateStore = (data)=> {
	return store.updateStore(data);
}
