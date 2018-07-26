const notify = require('../dao/notify');

exports.saveNotify = (data)=> {
	return notify.saveNotify(data)
}

