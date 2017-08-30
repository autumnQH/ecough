const userService = require('../service/user.js');;
const tools = require('../utils/tools');
const config  =require('../config/config');
const urlencode = require('urlencode');

// var getUser = async (ctx, next) => {
//     let userId = ctx.params.id;
//     let user = await userService.getUserById(userId);
// 	await ctx.render('user', {user: user});
// };

var delUserAddress = async (ctx, next) => {
	let id = {
		id: ctx.query.id
	};
	console.log(id);
	return ctx.body = await userService.delUserAddress(id);

}

var setUserAddress = async (ctx, next) => {
	let data = ctx.request.body;
	var result = await userService.setUserAddress(data);
	return ctx.body = result;
}

var getUserAddress = async (ctx, next) => {
	let openid = ctx.query.openid;
	console.log(openid);
	var result = await userService.getUserAddress(openid);
	console.log(result);
	return ctx.body = result;

}

var myOrder = async(ctx, next) => {
	console.log('my order result');
  var r_url = config.server.host + ctx.url;
  console.log(r_url,'myOrder');
  var url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+ config.wx.appid + 
      '&redirect_uri=' + urlencode(r_url) + '&response_type=code&scope=snsapi_userinfo&state=111#wechat_redirect';

  if(ctx.session.openid){
		var result =  await userService.getUserOrder(ctx.session.openid);
		console.log(result,'my order result');
  	await ctx.render('myOrder', {
  		data: result
  	});
  }else{

    if(!ctx.query.code){
        ctx.redirect(url);
    }else{
        let code = ctx.query.code;
        var user = await tools.getOauth2Token(code);
            user = JSON.parse(user);
            console.log(user,'user');
        if(user.errcode){
            ctx.redirect(url);
        }else{
            console.log('ok');
            //拉取用户信息
            var userinfo = await tools.getUserInfo(user.access_token, user.openid);
                userinfo = JSON.parse(userinfo);
            ctx.session = userinfo;

            var result =  await userService.getUserOrder(ctx.session.openid);
            console.log(result,'my order result');
            await ctx.render('myOrder', {
                data: result
            })
        }    
    }
  }

}

module.exports = {
    'POST /users/setUserAddress': setUserAddress,
    'GET /users/delUserAddress': delUserAddress,
    'GET /users/getUserAddress': getUserAddress,
    'GET /users/my/order': myOrder
/*
    'POST /users': addUser,
    'PUT /users/id': updateUser,
    'DELETE /users/:id': deleteUser
*/
};