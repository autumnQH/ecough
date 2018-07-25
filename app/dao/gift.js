const db = require('../utils/mysql');


exports.getGiftForConsumeByNameAndSpecifications = (name, specifications)=> {
	return db.findOne("SELECT consume FROM GIFT WHERE ? AND ? ",{name, specifications});
}
