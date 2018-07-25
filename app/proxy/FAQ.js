const faq = require('../dao/faq')


//获取常见问题
exports.getFAQ = ()=> {
	return faq.getFAQ();
}
/**
 * 获取一条常见问题
 * @param {String} id ID
 */
exports.getFAQById = (id)=> {
	return faq.getFAQById(id);
}
/**
 * 根据Id修改一条FAQ
 * @param {Object} data 数据包
 * @param {String} id ID
 */
exports.updateFAQ = (data, id)=> {
	return faq.updateFAQ(data, id);
}
/**
 * 删除一条FAQ
 * @param {String} id ID
 */
exports.delFAQ = (id)=> {
	return faq.delFAQ(id);
}
/**
 * 增加一条FAQ
 * @param {Object} data 数据包
 */
exports.addFAQ = (data)=> {
	return faq.addFAQ(data);
}
