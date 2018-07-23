const WXSDK = require('../proxy').WXSDK;
const wechat = require('../utils/wechat.js');

var createMenu = async (menu) => {
	try{
		await WXSDK.handle('deleteMenu')
		await WXSDK.handle('createMenu',require(menu))
		const template_id = await WXSDK.getTemplateId()
	}catch(e) {
		console.error(e)
	}
} 

module.exports = {    
	createMenu : createMenu
};
