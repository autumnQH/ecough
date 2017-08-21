const dao = require('../dao/wechat.js');
const wechat = require('../utils/wechat.js');

var createMenu = async(menu) => {
	var token = await dao.getActiveAccessToken();
	console.log('token', token);
	wechat.createMenu(menu, token);
} 

module.exports = {    
	createMenu : createMenu
};
