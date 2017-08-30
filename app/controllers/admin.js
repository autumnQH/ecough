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

var admin_userService = async (ctx, next) => {
    var result =  await userService.getUserService();
    await ctx.render('admin_user_service', {
        data: result
    });
}
module.exports = {
    'GET /admin': admin,
    'GET /admin/order': admin_order,
    'POST /admin/setOrder': admin_setOrder,
    'GET /admin/qrcode': admin_qrcode,
    'POST /admin/setQrcode': admin_setQrcode,
    'GET /admin/user/service': admin_userService

};