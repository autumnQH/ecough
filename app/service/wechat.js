const wxSDK = require('../proxy').WXSDK;
const wechat = require('../utils/wechat.js');

var createMenu = (menu) => {
	var token = wxSDK.getWeAccessToken();
	wechat.createMenu(menu, token);
} 

module.exports = {    
	createMenu : createMenu
};
