const WXSDK = require('../proxy').WXSDK;

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
