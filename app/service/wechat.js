const wxSDK = require('../dao/wechat');
const wechat = require('../utils/wechat.js');

var createMenu = async (menu) => {
	var token = await wxSDK.getActiveAccessToken();
	wechat.createMenu(menu, token);
} 

module.exports = {    
	createMenu : createMenu
};
