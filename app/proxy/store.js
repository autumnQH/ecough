const store = require('../dao/store');

/**
 * 根据id获取商品
 * @param {Int} product_id 商品id
 */
exports.getStoreById = async (product_id)=> {
  const result = await store.getStoreById(product_id)
  // 格式化商品信息字段
  result.sku_info = result.sku_info.split(';').map(item => {
    return JSON.parse(item)
  })
  return result
}

/**
 * 更新商品数据
 * @param {Object} data 商品数据
 */
exports.updateStoreById = (data) => {
  data.sku_info = data.sku_info.map(item => {
    return JSON.stringify(item)
  })
  data.sku_info = data.sku_info.join(';')
  return store.updateStore(data)
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
