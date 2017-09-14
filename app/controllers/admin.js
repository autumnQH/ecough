const request = require('request');
const xml = require('../utils/xml');
const wechat = require('../utils/wechat');
const dao = require('../dao/wechat');
const tools = require('../utils/tools');
const urlencode = require('urlencode');
const crypto = require('crypto');
const moment = require('moment');
const userService = require('../service/user');



var a = async function(ctx, next) {
    if(ctx.session.admin){
        console.log('呵呵');
        next();
    }else{
        return ctx.redirect('/sign');
    }
}

var sign = async function(ctx, next) {
    await ctx.render('signin', {

    });
}

var Sign = async function(ctx, next) {
    var admin = ctx.request.body;
    var name = admin.name;
    var password = admin.password;
    var admin = {
        admin: {
            name: name,
            password: password
        }
    }
    if(name ==='root' && password ==='root666888'){
        ctx.session = admin;
        await ctx.redirect('/admin');
    }else{
        await ctx.redirect('back');
    }
}

var admin = async function (ctx, next) {
    await a(ctx, next);
    await ctx.render('admin', {

    });
}

var admin_order = async function(ctx, next) {
    a(ctx, next);
    var datas = await wechat.getOrder();
    datas.forEach(function(data) {
        data.create_time = tools.formatDate(data.create_time);
    });
    await ctx.render('admin_order', {
        data: datas
    });
}

var admin_setOrder = async function (ctx, next) {
    a(ctx, next);
    var req = ctx.request.body;
    req.create_time = moment().format('YYYY-MM-DD HH:mm:ss');
    wechat.setOrder(req);
    await ctx.redirect('/users/my/order');


}

var admin_qrcode = async function(ctx, next) {
    a(ctx, next);
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
    var data = await tools.getQRCode(token, json);
    data.create_time = moment().format('YYYY-MM-DD HH:mm:ss');
    data.name = req.name +'';
    data.scene_str = req.name + '';
    data.action_name = 'QR_LIMIT_SCENE';
    data.ticket = 'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket='+ data.ticket;

    var a = await wechat.setQRCode(data);

    await ctx.redirect('/admin/qrcode');
}

var admin_userService = async (ctx, next) => {
    a(ctx, next);
    var result =  await userService.getUserService();
    await ctx.render('admin_user_service', {
        data: result
    });
}
var adminSetDeliver = async(ctx, next) => {
    a(ctx, next);
    var req = ctx.request.body;
    var id = await dao.getOutTradeNo(req.out_trade_no);
    if(id.id){
        let a = {id: id.id};
        req.status = 3;
        var result = await dao.adminSetDeliver(req,a);
        await ctx.redirect('/admin/order');
    }else{
       return ctx.body = {
        "err": "没有这个订单或者已经发货"
       }
    }

}

var getConfig = async (ctx, next) => {
    a(ctx, next);
    var data = await dao.getConfig();
    await ctx.render('admin_config', {
        config: data
    });
}

var setConfig = async (ctx, next) => {
    a(ctx, next);
    var data = ctx.request.body;
    await dao.setConfig(data);
    await ctx.redirect('/admin/getconfig');
}



module.exports = {
    'GET /sign': sign,
    'POST /sign': Sign,
    'GET /admin':admin, 
    'GET /admin/order': admin_order,
    'POST /admin/setOrder': admin_setOrder,
    'GET /admin/qrcode': admin_qrcode,
    'POST /admin/setQrcode': admin_setQrcode,
    'GET /admin/user/service': admin_userService,
    'POST /admin/order/deliver': adminSetDeliver,
    'GET /admin/getconfig': getConfig,
    'POST /admin/setconfig' : setConfig,

};