const request = require('request');
const xml = require('../utils/xml');
const wechat = require('../utils/wechat');
const dao = require('../dao/wechat');
const config = require('../config/config');
const tools = require('../utils/tools');
const urlencode = require('urlencode');
const crypto = require('crypto');
const moment = require('moment');
const pay = require('../utils/pay');

var getAddress = async (ctx, next) => {
	ctx.state = {
	    title: 'hello koa2'
  	};
	await ctx.render('address', {});
};

var get_logistics = async (ctx, next) => {
    ctx.state = {
        title: 'hello koa2'
    };
    await ctx.render('logistics', {});
};


var getProduct= async (ctx, next) => {
    await ctx.render('product', {});
};

var getProblem= async (ctx, next) => {
    ctx.state = {
        title: 'hello koa2'
    };
    await ctx.render('problem', {});
};


var getUserInfo = async (ctx, next) => {
    console.log('进来啦');
    var r_url = config.server.host +'/my/userinfo';
    var url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+ config.wx.appid + 
        '&redirect_uri=' + urlencode(r_url) + '&response_type=code&scope=snsapi_userinfo&state=111#wechat_redirect';

    if(ctx.session.openid){
        console.log('session存在');
        console.log(ctx.session);
        await ctx.render('product', {
            userinfo: ctx.session
        });       
    }else{
        if(!ctx.query.code){
            console.log('code不存在');
            ctx.redirect(url);
        }else{
            let code = ctx.query.code;
            var user = await tools.getOauth2Token(code);
                user = JSON.parse(user);
                console.log(user,'user');
                console.log(user.errcode);
            if(user.errcode){
                ctx.redirect(url);
            }else{
                console.log('ok');
                //拉取用户信息
                var userinfo = await tools.getUserInfo(user.access_token, user.openid);
                    userinfo = JSON.parse(userinfo);
                ctx.session = userinfo;
                await ctx.render('product', {
                    userinfo: userinfo
                })
            }    
        }
    }

};

//统一下单-生成预付单-获取package
var jsapiPay = async(ctx, next) => {
    var openid = ctx.query.openid;
    var data = pay.setPackageData(openid);
    
    console.log(data,'统一下单');

    var res = await tools.getPackge(data);//发起统一下单
    var result = await xml.xmlToJson(res);//解析统一下单返回的xml数据

    if(result.xml.prepay_id[0]){
        var prepayid = result.xml.prepay_id[0];
        var data2 = pay.setPaySign(prepayid);

        //获取js-ticket才能调用微信支付请求
        //获取js-cicket
        var jsapi_ticket = await dao.getJsapiTicket();
        var url = 'http://' + ctx.header.host + ctx.url;
        var wxcfg = pay.setWXConfig(jsapi_ticket, url);

        await ctx.render('order', {
            config: wxcfg,
            data: data2
        });         
    }else{
        console.log('errcode');
        await ctx.redirect('/my/order');
    }

};

var notify = async function(ctx, next) {
    console.log('通知哦');
};

var getOrder = async function(ctx, next) {
    await ctx.render('order', {

    });
}

var admin = async function (ctx, next) {
    await ctx.render('admin', {

    });
}

var admin_order = async function(ctx, next) {
    var data = await wechat.getOrder();
    await ctx.render('admin_order', {
        data: data
    });
}

var admin_setOrder = async function (ctx, next) {
    var req = ctx.request.body;
    req.create_time = moment().format('YYYY-MM-DD HH:mm:ss');
    wechat.setOrder(req);
    await ctx.redirect('/product/100001');


}

var admin_qrcode = async function(ctx, next) {
    var data = await wechat.getQRCode();
    await ctx.render('admin_spread', {
        datas: data
    });    
}

var admin_setQrcode = async function(ctx, next) {
    var req = ctx.request.body;
   
    var token = await dao.getActiveAccessToken();
    var json = JSON.stringify({
        'action_name': 'QR_LIMIT_STR_SCENE',
        'action_info': {
            'scene': {
                'scene_str':req.name
            }
        }
    });
    console.log(json,'json--------');
    var data = await tools.getQRCode(token, json);
    console.log(data,'data------');
    data = JSON.parse(data);
    data.create_time = moment().format('YYYY-MM-DD HH:mm:ss');
    data.name = req.name +'';
    data.scene_str = req.name + '';
    data.action_name = 'QR_LIMIT_SCENE';
    data.ticket = 'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket='+ data.ticket;

    var a = await wechat.setQRCode(data);

    await ctx.redirect('/admin/qrcode');
}
module.exports = {
	//'GET /my/address': getAddress,
    //'GET /my/problem': getProblem,
    //'GET /my/logistics': get_logistics,
    //'GET /product/100001': getProduct,
    'GET /product/100001': getUserInfo,
    'POST /product/100001': getProduct,
    'GET /notify': notify,
    'POST /notify': notify,
    'GET /my/userinfo': getUserInfo,
    'GET /my/pay': jsapiPay,
    'GET /my/order': getOrder,
    'GET /admin': admin,
    'GET /admin/order': admin_order,
    'POST /admin/setOrder': admin_setOrder,
    'GET /admin/qrcode': admin_qrcode,
    'POST /admin/setQrcode': admin_setQrcode

};