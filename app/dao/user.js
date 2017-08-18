var db = require("../utils/mysql");

var getUserById = (userId) => {    
	var user = db.getById("t_user", userId); 
	return user; 
}

module.exports = {    
	getUserById : getUserById 
};
