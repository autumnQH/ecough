const gift = require('../dao/gift');

//获取所有礼品
exports.getGift = ()=> {
	return gift.getGift();
}

/**
 * 增加一条礼品
 * @param {Object} data 数据包
 */
exports.addGift = (data)=> {
	return gift.addGift(data);
}

/**
 * 根据Id获取一条礼品信息
 * @param {String} id ID 
 */
exports.getGiftById = (id)=> {
	return gift.getGiftById(id);
}

/**
 * 根据Id修改一条礼品信息
 * @param {Object} data 数据包
 * @param {String} id ID
 */
exports.updateGift = (data, id)=> {
	return gift.updateGift(data, id);
}

/**
 * 根据ID删除一条礼品
 * @param {String} id ID
 */
exports.delGiftById = (id)=> {
	return gift.delGiftById(id);
}

/**
 * 获取礼物所需要的件数
 * @param {String} name 礼物名称
 * @param {String} specifications 礼物规格
 * @return {Int} consume 需要的件数
 */
exports.getGiftForConsumeByNameAndSpecifications = (name, specifications) => {
	return gift.getGiftForConsumeByNameAndSpecifications(name, specifications)
}
