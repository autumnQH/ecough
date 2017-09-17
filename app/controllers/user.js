const userService = require('../service/user.js');
const tools = require('../utils/tools');
const urlencode = require('urlencode');
const moment = require('moment');
const dao = require('../dao/wechat');
const pay = require('../utils/pay');
const USER = require('../utils/user');

var User = async (ctx, next) => {

       return await ctx.render('user', {

        });
  var config = await dao.getConfig();
  var r_url = config.server_host + ctx.url;
  var url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+ config.appid + 
      '&redirect_uri=' + urlencode(r_url) + '&response_type=code&scope=snsapi_userinfo&state=111#wechat_redirect';

  if(ctx.session.openid){
        await ctx.render('user', {

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
        await ctx.render('user', {

        });     
      }      
    }
  }         

}

var myOrder = async(ctx, next) => {
  var config = await dao.getConfig();
  var r_url = config.server_host + ctx.url;
  var url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+ config.appid + 
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
  var config = await dao.getConfig();
  var r_url = config.server_host + ctx.url;
  var url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+ config.appid + 
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
            });
        }    
    }
  }

}

var setUserService = async (ctx, next) => {
	let data = ctx.request.body;
	var result = await userService.setUserService(data);
	return ctx.body = result;
}

var getOpenAddress = async (ctx, next) => {
  var config = await dao.getConfig();
  var r_url = config.server_host + ctx.url;
  var url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+ config.appid + 
      '&redirect_uri=' + urlencode(r_url) + '&response_type=code&scope=snsapi_userinfo&state=111#wechat_redirect';   
  if(ctx.session.openid){
    var jssdk = await dao.getJsapiTicket();
    var url = 'http://' + ctx.header.host + ctx.url;
    var value = {
      nonceStr: tools.createRandom(),
      timeStamp: tools.createTimestamp()
    };
    var wxcfg = await pay.setWXConfig(jssdk, url, value);

    await ctx.render('store_open_address', {
      wxcfg: wxcfg,
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

          var jssdk = await dao.getJsapiTicket();
          var url = 'http://' + ctx.header.host + ctx.url;
          var value = {
              nonceStr: tools.createRandom(),
              timeStamp: tools.createTimestamp()
          };
          var wxcfg = await pay.setWXConfig(jssdk, url, value);
          
          await ctx.render('store_open_address', {
            wxcfg: wxcfg,
            openid: ctx.session.openid
          });
      }    
    }
  }
}

var UserCustomer = async function(ctx, next) {

  var config = await dao.getConfig();
  var r_url = config.server_host + ctx.url;
  var url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+ config.appid + 
      '&redirect_uri=' + urlencode(r_url) + '&response_type=code&scope=snsapi_userinfo&state=111#wechat_redirect';

  if(ctx.session.openid){
    var data = await USER.getUserByEnentKey(ctx.session.openid);
    return await ctx.render('user_customer',{
      data: data
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
        var userinfo = await tools.getUserInfo(user.access_token, user.openid);
            userinfo = JSON.parse(userinfo);
        ctx.session = userinfo; 

        var data = await USER.getUserByEnentKey(ctx.session.openid);
        await ctx.render('user_customer',{
          data: data
        });        
      }  

    }

  }
};

var UserVoucher =async function(ctx, next) {

  var config = await dao.getConfig();
  var r_url = config.server_host + ctx.url;
  var url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+ config.appid + 
      '&redirect_uri=' + urlencode(r_url) + '&response_type=code&scope=snsapi_userinfo&state=111#wechat_redirect';

  if(ctx.session.openid){
    var data = await USER.getUserVoucherByOpenId(ctx.session.openid);
    var flag = await USER.getUserFlagByOpenId(ctx.session.openid);
    
    return await ctx.render('user_voucher', {
      data: data,
      flag: flag
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
        var userinfo = await tools.getUserInfo(user.access_token, user.openid);
            userinfo = JSON.parse(userinfo);
        ctx.session = userinfo; 

        var data = await USER.getUserVoucherByOpenId(ctx.session.openid);
        var flag = await USER.getUserFlagByOpenId(ctx.session.openid);
        
        return await ctx.render('user_voucher', {
          data: data,
          flag: flag
        });
      }    
    }

  }
};

var UserIntegral =async function(ctx, next) {

  var config = await dao.getConfig();
  var r_url = config.server_host + ctx.url;
  var url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+ config.appid + 
      '&redirect_uri=' + urlencode(r_url) + '&response_type=code&scope=snsapi_userinfo&state=111#wechat_redirect';

  if(ctx.session.openid){
    var data = await USER.getUserForIntegralByOpenId(ctx.session.openid);
    return await ctx.render('user_integral', {
      data: data
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
        var userinfo = await tools.getUserInfo(user.access_token, user.openid);
            userinfo = JSON.parse(userinfo);
        ctx.session = userinfo; 

        var data = await USER.getUserForIntegralByOpenId(ctx.session.openid);
        return await ctx.render('user_integral', {
          data: data
        });
      } 

    }

  }  
}

var setUserVoucher = async function(ctx, next) {
  var req = ctx.request.body;
      req.create_time = moment().format('YYYY-MM-DD HH:mm:ss');

  var integral = await USER.getUserForIntegralByOpenId(req.openid);

  if(integral.integral >=req.voucher_denomination ){
    var number = integral.integral - req.voucher_denomination;
    
    USER.delUserForIntegralByOpendId({integral: number},{openid: req.openid})
    USER.setUserVoucher(req);
    return ctx.body = {
      success: '兑换成功'
    }; 
  }else{
    return ctx.body = {
      success: '积分不够'
    }
  }
}

module.exports = {
    'GET /users/user': User,
    'GET /users/customer':  UserCustomer ,
    'GET /users/voucher': UserVoucher,
    'POST /user/setvoucher': setUserVoucher,
    'GET /users/integral': UserIntegral,
    'GET /users/getUserAddress': getOpenAddress,
    'GET /users/my/order': myOrder,
    'GET /users/service': CustomerService,
    'POST /users/service/issue': setUserService,

};