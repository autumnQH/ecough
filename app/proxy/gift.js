const gift = require('../dao/gift');

exports.getGiftForConsumeByNameAndSpecifications = (name, specifications) => {
	return gift.getGiftForConsumeByNameAndSpecifications(name, specifications)
}
