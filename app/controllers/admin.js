const request = require('request');
const xml = require('../utils/xml');
const wechat = require('../utils/wechat');
const dao = require('../dao/wechat');
const tools = require('../utils/tools');
const urlencode = require('urlencode');
const crypto = require('crypto');
const moment = require('moment');
const USER = require('../utils/user');
const STORE = require('../utils/store');

var a = function(ctx, next) {
    if(ctx.session.admin){
        console.log(ctx.session.admin);
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
        console.log(ctx.session);
       return await ctx.redirect('/admin');
    }else{
       return await ctx.redirect('back');
    }
}

var admin = async function (ctx, next) {
    await a(ctx, next);
    await ctx.render('admin', {

    });
}

var admin_order = async function(ctx, next) {
    var datas = await wechat.getOrder();
    datas.forEach(function(data) {
        data.create_time = tools.formatDate(data.create_time);
    });
    await ctx.render('admin_order.min', {
        data: datas
    });
}

var getOrder = async function(ctx, next) {
    var datas = await wechat.getOrder();
    datas.forEach(function(data) {
        data.create_time = tools.formatDate(data.create_time);
    });
    return ctx.body = datas;    
}

var admin_setOrder = async function (ctx, next) {
    a(ctx, next);
    var req = ctx.request.body;
    req.create_time = moment().format('YYYY-MM-DD HH:mm:ss');
    tools.sendTemplateMessage(req.openid, req.pay_money, req.product+ '('+req.specifications+req.total+')');//发送模版消息
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
    a(ctx, next);
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
    var result =  await USER.getUserService();
    await ctx.render('admin_user_service', {
        data: result
    });
}
//设置发货
var adminSetDeliver = async(ctx, next) => {
    a(ctx, next);
    var req = ctx.request.body;
    var data = await dao.getOutTradeNo(req.out_trade_no);
    var config = await dao.getConfig();
    var token = await dao.getActiveAccessToken();
    if(data.id){
        let openid = data.openid;
        req.status = 3;
        await dao.adminSetDeliver(req,{id: data.id});
        var pay_money = data.pay_money;
        var flag = await USER.getUserFlagByOpenId(openid);//是否首单
        if(flag.flag == '1'){
            console.log(pay_money,'支付金额');
            //下单送积分
            var integral = await USER.getUserForIntegralByOpenId(openid);
            var number = integral.integral + (parseInt(pay_money*config.shoping_integral*0.01));
            
                USER.addUserForIntegralByOpendId({integral: number}, {openid: openid});
            // 推广人获得代金券
            var userinfo = await tools.getUserInfo2(token, openid);
            
            let data = {
                openid: userinfo.remark,
                voucher_type: '推广代金券',
                create_time: moment().format('YYYY-MM-DD HH:mm:ss'),
                voucher_denomination: config.spread_voucher
            };
            USER.setUserVoucher(data);            

        }

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

var getStore = async (ctx, next)=> {
    a(ctx, next);
    var data = await dao.getConfig();
    await ctx.render('admin_store', {
        config: data
    });
}

var setConfig = async (ctx, next) => {
    await a(ctx, next);
    var data = ctx.request.body;
    await dao.setConfig(data);
    await ctx.redirect('/admin/getconfig');
}

var product = async(ctx, next) =>{

    var data = await STORE.getStore();
    data.map(function(val) {
        val.sku_attr = val.sku_attr.split(',');
        val.sku_info = val.sku_info.split(',').map(function(val1, index, arr) {
            var newarr = val1.split(':');
            return {specifications: newarr[0], price: newarr[1], ori_price: newarr[2], repertory: newarr[3], qr: newarr[4]}; 
        });    
        return val
    });
    ctx.state.data = data;
    console.log(JSON.stringify(data));  
    await ctx.render('admin_product');
}

var setproduct = async (ctx, next) => {
    var data = ctx.request.body;
    var sku_info = ''
    if(typeof data.specifications != 'object'){
        sku_info = data.specifications+':'+data.price+':'+data.ori_price+':'+data.repertory;
    }else{
        for(var i=0;i<data.specifications.length;i++) {
            sku_info += data.specifications[i]+':'+data.price[i]+':'+data.ori_price[i]+':'+data.repertory[i];
            if(i!=data.specifications.length-1){            
                sku_info+=','
            }
        }
    }
    delete data.specifications;
    delete data.price;
    delete data.ori_price;
    delete data.repertory;

    data.sku_info = sku_info; 
    STORE.updateStore(data);
    return ctx.redirect('back');
}


// var getProduct = async (ctx, next) => {
//     var data = await STORE.getStore();
//     data.map(function(val) {
//         val.sku_attr = val.sku_attr.split(',');
//         val.sku_info = val.sku_info.split(',').map(function(val1, index, arr) {
//             var newarr = val1.split(':');
//             return {specifications: newarr[0], price: newarr[1], ori_price: newarr[2], repertory: newarr[3], qr: newarr[4]}; 
//         });    
//         return val
//     });
//     console.log(JSON.stringify(data));
//     return ctx.body=data;
// }

//获取所有FAQ列表
var getFAQ = async function(ctx, next) {
    a(ctx, next);
    ctx.state.FAQ = await wechat.getFAQTitle();
    await ctx.render('admin_FAQ');
}

//新建FAQ get
var setFAQ = async function(ctx, next) {
    a(ctx, next);
    await ctx.render('admin_add_FAQ');

}
//新建FAQ post
var SetFAQ = async function(ctx, next) {
    var req = ctx.request.body;
    req.create_time = moment().format('YYYY-MM-DD HH:mm:ss');
    await wechat.setFAQ(req);
    return ctx.body = {
        msg: 'SUCCESS'
    }
}

//更新FAQ get
var updateFAQ =  async function(ctx, next) {
    a(ctx, next);
    var id = ctx.params.id;    
    var data = await wechat.getFAQById(id);    
    ctx.state.data = data;
    await ctx.render('admin_edit_FAQ');
}

//更新FAQ post
var UpdateFAQ = async function (ctx, next) {
    var id = ctx.params.id;    
    var req = ctx.request.body;
    await wechat.updateFAQById(req, id);
    return ctx.body= {
        msg: 'SUCCESS'
    }
}

var delFAQ= async function(ctx, next) {
    a(ctx, next);
    var id = ctx.params.id;
    await wechat.delFAQ(id);
    return ctx.body= {
        msg: 'SUCCESS'
    }
}
module.exports = {
    'GET /sign': sign,
    'POST /sign': Sign,
    'GET /admin':admin, 
    'GET /admin/store': getStore,
    'GET /admin/order': admin_order,
    'POST /admin/setOrder': admin_setOrder,
    'GET /admin/qrcode': admin_qrcode,
    'POST /admin/setQrcode': admin_setQrcode,
    'GET /admin/user/service': admin_userService,
    'POST /admin/order/deliver': adminSetDeliver,
    'GET /admin/getconfig': getConfig,
    'POST /admin/setconfig' : setConfig,
    'GET /api/admin/order': getOrder,
    'GET /admin/product': product, 
    'POST /admin/setproduct': setproduct,
    //'GET /api/admin/product': getProduct
    'GET /admin/FAQ': getFAQ,
    'GET /admin/setFAQ': setFAQ,
    'POST /admin/setFAQ': SetFAQ,
    'GET /admin/updateFAQ/:id': updateFAQ,
    'POST /admin/updateFAQ/:id': UpdateFAQ,
    'GET /admin/delFAQ/:id': delFAQ

};