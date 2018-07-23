const WXSDK = require('../proxy').WXSDK;
const wechat = require('../utils/wechat.js');

var createMenu = async (menu) => {
	try{
		await WXSDK.handle('deleteMenu')
		await WXSDK.handle('createMenu',require(menu))
		const test = await WXSDK.handle('addTemplate')
		const json = {
			touser: 'o5Yi9wOfXWopOcMYiujWBZmwBH0Q',
			template_id: 'BgpTq3S8WtnvWGDWST_lH3l1NaCZZ_PM7I33qIouEhk',
			url: 'http://fafuna.vipgz1.idcfengye.com/user/my/code',
			data: {
				first: {
					value: '您好，您已购买成功。'
				},
				keyword1: {
					value: '微信数据容灾服务'
				},
				keyword2: {
					value: '1份'
				},
				remark: {
					value: '备注：如有疑问，请致电13912345678联系我们。'
				}
			}

		}
		const test1 = await WXSDK.handle('sendTemplateMessage', json)
    console.log(test)
	}catch(e) {
		console.error(e)
	}
} 

module.exports = {    
	createMenu : createMenu
};
