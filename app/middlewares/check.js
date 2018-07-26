const Config = require('../proxy').Config;
const urlencode = require('urlencode');
const tools = require('../utils/tools');

module.exports = {
	checkAdmin: async(ctx, next)=> {
		if(!ctx.session.admin){
		  ctx.session.referer = '/admin'
		  if(ctx.url != '/sign'){
		    ctx.session.referer = ctx.url;
		  }
			return ctx.redirect('/sign');
		}
		await next();
	},
	checkUser: async(ctx, next)=> {
		console.log('??????/')
		var config = await Config.getConfig();
		//ctx.session.openid = 'o5Yi9wOfXWopOcMYiujWBZmwBH0Q';
		if(!ctx.session.openid){
			console.log('openid')
		  var r_url = config.server_host + ctx.url.split('?').slice(0,1);
		  var url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+ config.appid + 
		      '&redirect_uri=' + urlencode(r_url) + '&response_type=code&scope=snsapi_userinfo&state=111#wechat_redirect';	
		  if(!ctx.query.code){
		  	return ctx.redirect(url);
		  }else{
		  	let code = ctx.query.code;
		  	let user = JSON.parse(await tools.getOauth2Token(code));
		  	if(user.errcode){
        	return ctx.redirect(url);
      	}else{
      		//拉取用户信息
        	let userinfo = JSON.parse(await tools.getUserInfo(user.access_token, user.openid));
              ctx.session = userinfo;
              console.log(ctx.session.openid,'=========')
         	return await next();
      	}
		  }		
		}
		await next();
	} 
}
