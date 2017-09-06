const request = require('request');
const xml = require('../utils/xml');
const wechat = require('../utils/wechat');
const dao = require('../dao/wechat');
const config = require('../config/config');
const tools = require('../utils/tools');
const urlencode = require('urlencode');
const crypto = require('crypto');
const moment = require('moment');
const userService = require('../service/user');


var admin = async function (ctx, next) {
    await ctx.render('admin', {

    });
}

var admin_order = async function(ctx, next) {
    var datas = await wechat.getOrder();
    datas.forEach(function(data) {
        data.create_time = tools.formatDate(data.create_time);
    });
    await ctx.render('admin_order', {
        data: datas
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
    var data = await tools.getQRCode(token, json);
    data = JSON.parse(data);
    data.create_time = moment().format('YYYY-MM-DD HH:mm:ss');
    data.name = req.name +'';
    data.scene_str = req.name + '';
    data.action_name = 'QR_LIMIT_SCENE';
    data.ticket = 'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket='+ data.ticket;

    var a = await wechat.setQRCode(data);

    await ctx.redirect('/admin/qrcode');
}

var admin_userService = async (ctx, next) => {
    var result =  await userService.getUserService();
    await ctx.render('admin_user_service', {
        data: result
    });
}
var adminSetDeliver = async(ctx, next) => {
    var req = ctx.request.body;
    console.log(req);
    console.log(req.out_trade_no);
    var id = await dao.getOutTradeNo(req.out_trade_no);
    console.log(id);
    if(id.length == 1 ){
        let a = {id: id};
        console.log('进来了')
        var result = await dao.adminSetDeliver(req,a);
        await ctx.redirect('/admin/order');
    }else{
       return ctx.body = {
        "err": "没有这个订单"
       }
    }

}

module.exports = {
    'GET /admin': admin,
    'GET /admin/order': admin_order,
    'POST /admin/setOrder': admin_setOrder,
    'GET /admin/qrcode': admin_qrcode,
    'POST /admin/setQrcode': admin_setQrcode,
    'GET /admin/user/service': admin_userService,
    'POST /admin/order/deliver': adminSetDeliver

};