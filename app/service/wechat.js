const WXSDK = require('../proxy').WXSDK;
const wechat = require('../utils/wechat.js');

var createMenu = async (menu) => {
	try{
		await WXSDK.handle('deleteMenu')
		await WXSDK.handle('createMenu',require(menu))
	}catch(e) {
		console.error(e)
	}
} 

module.exports = {    
	createMenu : createMenu
};
