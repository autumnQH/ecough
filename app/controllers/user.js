const userService = require('../service/user.js');;
const tools = require('../utils/tools');
const config  =require('../config/config');
const urlencode = require('urlencode');
const moment = require('moment');
const dao = require('../dao/wechat');
const pay = require('../utils/pay');

// var getUser = async (ctx, next) => {
//     let userId = ctx.params.id;
//     let user = await userService.getUserById(userId);
// 	await ctx.render('user', {user: user});
// };

var delUserAddress = async (ctx, next) => {
	let id = {
		id: ctx.query.id
	};
	return ctx.body = await userService.delUserAddress(id);

}

var setUserAddress = async (ctx, next) => {
	let data = ctx.request.body;
	var result = await userService.setUserAddress(data);
	return ctx.body = result;
}

var getUserAddressByOrder = async (ctx, next) =>{
  let openid = ctx.query.openid;
  var result = await userService.getUserAddress(openid);
  return ctx.body = result;
}

var getUserAddress = async (ctx, next) => {
  var r_url = config.server.host + ctx.url;
  var url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+ config.wx.appid + 
      '&redirect_uri=' + urlencode(r_url) + '&response_type=code&scope=snsapi_userinfo&state=111#wechat_redirect';
  if(ctx.session.openid){
    var result = await userService.getUserAddress(ctx.session.openid);
        await ctx.render('user_address', {
          data: result,
          openid: ctx.session.openid
        });   
  }else{
    if(!ctx.query.code){
      ctx.redirect(url);
    }else{
      let code = ctx.query.code;
      var user = await tools.getOauth2Token(code);
          user = JSON.parse(user);
      if(user.errcode){
        ctx.redirect(url);
      }else{
        //拉取用户信息
        var userinfo = await tools.getUserInfo(user.access_token, user.openid);
            userinfo = JSON.parse(userinfo);
        ctx.session = userinfo;   

        var result = await userService.getUserAddress(ctx.session.openid);
        await ctx.render('user_address', {
          data: result,
          openid: ctx.session.openid
        });     
      }      
    }
  }  


}

var myOrder = async(ctx, next) => {
  var r_url = config.server.host + ctx.url;
  var url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+ config.wx.appid + 
      '&redirect_uri=' + urlencode(r_url) + '&response_type=code&scope=snsapi_userinfo&state=111#wechat_redirect';

  if(ctx.session.openid){
		var result =  await userService.getUserOrder(ctx.session.openid);
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
        if(user.errcode){
            ctx.redirect(url);
        }else{
            //拉取用户信息
            var userinfo = await tools.getUserInfo(user.access_token, user.openid);
                userinfo = JSON.parse(userinfo);
            ctx.session = userinfo;

            var result =  await userService.getUserOrder(ctx.session.openid);

            await ctx.render('myOrder', {
                data: result
            })
        }    
    }
  }

}
var CustomerService = async (ctx, next) => {
  var r_url = config.server.host + ctx.url;
  var url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+ config.wx.appid + 
      '&redirect_uri=' + urlencode(r_url) + '&response_type=code&scope=snsapi_userinfo&state=111#wechat_redirect';

  if(ctx.session.openid){
		var result =  await userService.getUserOrderNumber(ctx.session.openid);
  	await ctx.render('service', {
  		data: result,
  		openid: ctx.session.openid
  	});
  }else{
    if(!ctx.query.code){
        ctx.redirect(url);
    }else{
        let code = ctx.query.code;
        var user = await tools.getOauth2Token(code);
            user = JSON.parse(user);
        if(user.errcode){
            ctx.redirect(url);
        }else{
            //拉取用户信息
            var userinfo = await tools.getUserInfo(user.access_token, user.openid);
                userinfo = JSON.parse(userinfo);
            ctx.session = userinfo;

            var result =  await userService.getUserOrderNumber(ctx.session.openid);
            await ctx.render('service', {
                data: result,
                openid: ctx.session.openid
            })
        }    
    }
  }

}

var setUserService = async (ctx, next) => {
	let data = ctx.request.body;
	var result = await userService.setUserService(data);
	return ctx.body = result;
}

var getUserExpress = async (ctx, next) => {
  return ctx.render('user_express', {
    data: []
  });
}

var getOpenAddress = async (ctx, next) => {
  var r_url = config.server.host + ctx.url;
  var url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+ config.wx.appid + 
      '&redirect_uri=' + urlencode(r_url) + '&response_type=code&scope=snsapi_userinfo&state=111#wechat_redirect';   
  let jssdk = await dao.getJsapiTicket();
  var url = 'http://' + ctx.header.host + ctx.url;
  var value = {
      nonceStr: tools.createRandom(),
      timeStamp: tools.createTimestamp()
  };
  var wxcfg = await pay.setWXConfig(jssdk, url, value);
  console.log(wxcfg);

  if(ctx.session.openid){
    await ctx.render('store_open_address', {
      wxcfg: wxcfg,
      openid: ctx.session.openid
    });
  }else{
    if(!ctx.query.code){
      return redirect(url);
    }else{
      let code = ctx.query.code;
      var user = await tools.getOauth2Token(code);
          user = JSON.parse(user);
      if(user.errcode){
          ctx.redirect(url);
      }else{
          //拉取用户信息
          var userinfo = await tools.getUserInfo(user.access_token, user.openid);
              userinfo = JSON.parse(userinfo);
          ctx.session = userinfo;

          var result =  await userService.getUserOrderNumber(ctx.session.openid);

          await ctx.render('store_open_address', {
            wxcfg: wxcfg,
            openid: ctx.session.openid
          });
    }
  }
}

module.exports = {
    'POST /users/setUserAddress': setUserAddress,
    'GET /users/delUserAddress': delUserAddress,
    //'GET /users/getUserAddress': getUserAddress,
    'GET /users/getUserAddress': getOpenAddress,
    'GET /users/my/order': myOrder,
    'GET /users/service': CustomerService,
    'POST /users/service/issue': setUserService,
    'GET /users/my/express': getUserExpress,
    'GET /user/order/address': getUserAddressByOrder
/*
    'POST /users': addUser,
    'PUT /users/id': updateUser,
    'DELETE /users/:id': deleteUser
*/
};