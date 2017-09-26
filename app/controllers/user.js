const tools = require('../utils/tools');
const urlencode = require('urlencode');
const moment = require('moment');
const dao = require('../dao/wechat');
const pay = require('../utils/pay');
const USER = require('../utils/user');

//个人中心
var User = async (ctx, next) => {

  var config = await dao.getConfig();
  var r_url = config.server_host + ctx.url.split('?').slice(0,1);
  var url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+ config.appid + 
      '&redirect_uri=' + urlencode(r_url) + '&response_type=code&scope=snsapi_userinfo&state=111#wechat_redirect';

  if(ctx.session.openid){
    var userinfo = await USER.getUserInfoByOpenId(ctx.session.openid);  
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
        await ctx.render('user', {
          data: userinfo
        });     
      }      
    }
  }         

}

//我要推广
var UserCode = async(ctx, next) => {
  var config = await dao.getConfig();
  var r_url = config.server_host + ctx.url.split('?').slice(0,1);
  var url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+ config.appid + 
      '&redirect_uri=' + urlencode(r_url) + '&response_type=code&scope=snsapi_userinfo&state=111#wechat_redirect';

  if(ctx.session.openid){
    await ctx.render('user_code');   
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
        await ctx.render('user_code');    
      } 
           
    }
  }       
  
}

var userCode = async (ctx, next) => {
  if(ctx.session.openid){
    const token = await dao.getActiveAccessToken();
    let json = JSON.stringify({
        "expire_seconds": 2592000, 
        "action_name": "QR_STR_SCENE", 
        "action_info": {
            "scene": {
                "scene_str": ctx.session.openid
            }
        }
    });
    var qrurl =  await tools.getQRCode(token, json);
    var userinfo =  ctx.session;
    var url = await tools.getQrFile(userinfo, qrurl); 
    return ctx.body = {
      url : '/imgs/'+ url + '.jpeg',
      f: true
    }
    
  }else{
    return ctx.body = {     
      url : '',
      f: false
    }
  }
}

//用户订单
var UserOrder = async(ctx, next) => {
  var config = await dao.getConfig();
  var r_url = config.server_host + ctx.url.split('?').slice(0,1);
  var url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+ config.appid + 
      '&redirect_uri=' + urlencode(r_url) + '&response_type=code&scope=snsapi_userinfo&state=111#wechat_redirect';
  if(ctx.session.openid){
		var result =  await USER.getUserOrder(ctx.session.openid);
    
    result.forEach(function(data) {
      data.create_time = tools.formatDate(data.create_time);
    });

  	await ctx.render('user_order', {
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

            var result =  await USER.getUserOrder(ctx.session.openid);

    result.forEach(function(data) {
      data.create_time = tools.formatDate(data.create_time);
    });
            await ctx.render('user_order', {
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
  var r_url = config.server_host + ctx.url.split('?').slice(0,1);
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
  var r_url = config.server_host + ctx.url.split('?').slice(0,1);
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
  var r_url = config.server_host + ctx.url.split('?').slice(0,1);
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
  var r_url = config.server_host + ctx.url.split('?').slice(0,1);
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
  var r_url = config.server_host + ctx.url.split('?').slice(0,1);
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
  USER.setUserPhone(req);
  return ctx.body = {
    code :1,msg :'绑定成功'  
  }

}

var FAQIssue = async function(ctx, next) {
  var id = ctx.params.id;
  var config = await dao.getConfig();
  var r_url = config.server_host + ctx.url.split('?').slice(0,1);
  var url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+ config.appid + 
      '&redirect_uri=' + urlencode(r_url) + '&response_type=code&scope=snsapi_userinfo&state=111#wechat_redirect'; 
  if(ctx.session.openid){
    var jssdk = await dao.getJsapiTicket();
    var value = {
      nonceStr: tools.createRandom(),
      timeStamp: tools.createTimestamp()
    };
    ctx.state.wxcfg = await pay.setWXConfig(jssdk, r_url, value);
    ctx.state.data =  await USER.getFAQById(id);
    ctx.state.openid = ctx.session.openid;
    await ctx.render('user_FAQ_issue');

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
          var value = {
              nonceStr: tools.createRandom(),
              timeStamp: tools.createTimestamp()
          };

          ctx.state.wxcfg = await pay.setWXConfig(jssdk, r_url, value);
          ctx.state.data =  await USER.getFAQById(id);
          ctx.state.openid = ctx.session.openid;
          await ctx.render('user_FAQ_issue'); 

      }  

    }

  }    
}


var FAQ = async function(ctx, next) {
  ctx.state.data =  await USER.getFAQ();
  await ctx.render('user_FAQ');
}

var customservice = async function(ctx, next) {
  var openid = ctx.params.openid;
  var token = await dao.getActiveAccessToken();
  var kf_account = await tools.customservice_getonlinekflist(token);
  var status = await tools.customservice(token,openid, kf_account);
  console.log(status,'status--');
  if(status.errcode==0&& status.errmsg=='ok'){
    await tools.customSendMsg(token,openid, kf_account);
  }
  ctx.body = status;
}
module.exports = {
    'GET /users/user': User,
    'GET /users/code': UserCode,
    'GET /user/code': userCode,
    'GET /users/customer':  UserCustomer ,
    'GET /users/voucher': UserVoucher,
    'GET /users/integral': UserIntegral,
    'GET /users/getUserAddress': getOpenAddress,
    'GET /users/my/order': UserOrder,
    'GET /users/service': CustomerService,
    'GET /users/FAQ': FAQ,
    'GET /users/FAQ/issue/:id': FAQIssue,
    'POST /users/my/order/query': queryUserOrder,
    'POST /user/setvoucher': setUserVoucher,
    'POST /users/service/issue': setUserService,
    'POST /user/setphone': setUserPhone,
    'GET /users/customservice/:openid': customservice

};