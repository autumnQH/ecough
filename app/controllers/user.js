const tools = require('../utils/tools');
const urlencode = require('urlencode');
const moment = require('moment');
const dao = require('../dao/wechat');
const pay = require('../utils/pay');
const USER = require('../utils/user');

//个人中心
var User = async (ctx, next) => {

  var config = await dao.getConfig();
  var r_url = config.server_host + ctx.url;
  var url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+ config.appid + 
      '&redirect_uri=' + urlencode(r_url) + '&response_type=code&scope=snsapi_userinfo&state=111#wechat_redirect';

  if(ctx.session.openid){
    var userinfo = await USER.getUserInfoByOpenId(ctx.session.openid);  
    console.log(userinfo,'userinfo');
    await ctx.render('user', {
      data: userinfo
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

        var userinfo = await USER.getUserInfoByOpenId(ctx.session.openid);  
        console.log(userinfo,'userinfo');
        await ctx.render('user', {
          data: userinfo
        });     
      }      
    }
  }         

}

//用户订单
var myOrder = async(ctx, next) => {
  var config = await dao.getConfig();
  var r_url = config.server_host + ctx.url;
  console.log(r_url,'=======');
  var url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+ config.appid + 
      '&redirect_uri=' + urlencode(r_url) + '&response_type=code&scope=snsapi_userinfo&state=111#wechat_redirect';
      console.log(url,'url-----');
  if(ctx.session.openid){
		var result =  await USER.getUserOrder(ctx.session.openid);
    result.forEach(function(data) {
      data.create_time = tools.formatDate(data.create_time);
    });
  	await ctx.render('myOrder', {
  		data: result
  	});
  }else{

    if(!ctx.query.code){
      console.log('错误');
        ctx.redirect(url);
    }else{
        let code = ctx.query.code;
        var user = await tools.getOauth2Token(code);
            user = JSON.parse(user);
        if(user.errcode){
          console.log('await');
            ctx.redirect(url);
        }else{
            //拉取用户信息
            var userinfo = await tools.getUserInfo(user.access_token, user.openid);
                userinfo = JSON.parse(userinfo);
            ctx.session = userinfo;

            var result =  await USER.getUserOrder(ctx.session.openid);
    result.forEach(function(data) {
      data.create_time = tools.formatDate(data.create_time);
    });
            await ctx.render('myOrder', {
                data: result
            })
        }    
    }
  }

}

var queryUserOrder = async (ctx, next) => {
  var req = ctx.request.body;
  var data = await USER.queryUserOrder(req);
  data.forEach(function(d){
    d.create_time = tools.formatDate(d.create_time);
  });
  return ctx.body = data;

}

//获取订单，设置问题
var CustomerService = async (ctx, next) => {
  var config = await dao.getConfig();
  var r_url = config.server_host + ctx.url;
  var url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+ config.appid + 
      '&redirect_uri=' + urlencode(r_url) + '&response_type=code&scope=snsapi_userinfo&state=111#wechat_redirect';

  if(ctx.session.openid){
		var result =  await USER.getUserOrderNumber(ctx.session.openid);
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

            var result =  await USER.getUserOrderNumber(ctx.session.openid);
            await ctx.render('service', {
                data: result,
                openid: ctx.session.openid
            });
        }    
    }
  }

}

//设置我的问题
var setUserService = async (ctx, next) => {
	let data = ctx.request.body;
	var result = await USER.setUserService(data);
	return ctx.body = result;
}

//获取用户共享地址
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

//已下单的人
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

//获取用户代金券
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
      flag: flag,
      derate_money: config.derate_money
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
          flag: flag,
          derate_money: config.derate_money
        });
      }    
    }

  }
};


//获取用户积分
var UserIntegral =async function(ctx, next) {

  var config = await dao.getConfig();
  var r_url = config.server_host + ctx.url;
  var url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+ config.appid + 
      '&redirect_uri=' + urlencode(r_url) + '&response_type=code&scope=snsapi_userinfo&state=111#wechat_redirect';

  if(ctx.session.openid){
    var data = await USER.getUserForIntegralByOpenId(ctx.session.openid);
    return await ctx.render('user_integral', {
      data: data,
      config: {
        n_integral: config.n_integral,
        m_voucher: config.m_voucher
      }
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
          data: data,
          config: {
            n_integral: config.n_integral,
            m_voucher: config.m_voucher
          }          
        });
      } 

    }

  }  
}


//积分兑换代金券
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

//绑定手机号
var setUserPhone = async function(ctx, next) {
  var req = ctx.request.body;
  var config = await dao.getConfig();
  if(config.signup_phone_integral!= null) {
    req.integral = config.signup_phone_integral;
  }
  console.log(req);
  USER.setUserPhone(req);
  return ctx.body = {
    code :1,msg :'绑定成功'  
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
    'POST /users/my/order/query': queryUserOrder,
    'GET /users/service': CustomerService,
    'POST /users/service/issue': setUserService,
    'POST /user/setphone': setUserPhone

};