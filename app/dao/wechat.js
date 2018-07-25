const db = require("../utils/mysql");


exports.fetchToken = () => {
	return db.findOne("SELECT * FROM TOKEN ORDER BY id DESC LIMIT 1")
}

exports.saveToken = async (data) => {
	const result = await db.findOne("SELECT * FROM TOKEN ORDER BY id DESC LIMIT 1")
	if(result.access_token) {
		data.update_time = (new Date().getTime())
		return db.update("TOKEN", data, {id: result.id})
	}else {
		data.create_time = data.update_time = (new Date().getTime())
		return db.add("TOKEN", data)
	}
}

exports.fetchTicket = () => {
	return db.findOne("SELECT * FROM TICKET ORDER BY id DESC LIMIT 1")
}

exports.saveTicket = async (data) => {
	const result = await db.findOne("SELECT * FROM TICKET ORDER BY id DESC LIMIT 1")
	if(result.ticket) {
		data.update_time = (new Date().getTime())
		return db.update("TICKET", data, {id: result.id})
	}else {
		data.create_time = data.update_time = (new Date().getTime())
		return db.add("TICKET", data)
	}
}

// new end
