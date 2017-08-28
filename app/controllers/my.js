const request = require('request');
const xml = require('../utils/xml');
const wechat = require('../utils/wechat');
const dao = require('../dao/wechat');
const config = require('../config/config');
const tools = require('../utils/tools');
const urlencode = require('urlencode');
const crypto = require('crypto');
const moment = require('moment');

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
    var r_url = 'http://'+ config.server.host +'/my/userinfo';

    var url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+ config.wx.appid + 
        '&redirect_uri=' + urlencode(r_url) + '&response_type=code&scope=snsapi_userinfo&state=111#wechat_redirect';
    if(!ctx.query.code && !ctx.userinfo){
        console.log('code不存在');
        ctx.redirect(url);
    }else if(!ctx.userinfo){
        console.log('code存在');
        let code = ctx.query.code;
        ctx.userinfo = await tools.getOauth2Token(code);
        var data = JSON.parse(ctx.userinfo);
        console.log(data,':::data');
        if(data.errcode){
            ctx.redirect(url);
        }else{
            ctx.userinfo = await tools.getUserInfo(data.access_token, data.openid);
            ctx.userinfo = JSON.parse(ctx.userinfo);
            console.log(ctx.userinfo);
            // await ctx.render('user',{
            //     userinfo: ctx.userinfo
            // });
            await ctx.render('product', {
                userinfo: ctx.userinfo
            });            
        }
    }else{
        console.log(ctx.userinfo,'else===');
        // await ctx.render('user', {
        //     userinfo: ctx.userinfo
        // });
        await ctx.render('order', {
            userinfo: ctx.userinfo
        });
    }

};

//统一下单-生成预付单-获取package
var jsapiPay = async(ctx, next) => {
    
    var openid = ctx.query.openid;

    var nonceStr = tools.createRandom();
    var timeStamp = tools.createTimestamp();
    var out_trade_no = tools.trade();

    var data = {
        appid: config.wx.appid, //appId
        attach: '支付测试',
        body: 'Test', //商品描述
        mch_id: config.wx.mchid, //商户号id
        nonce_str: nonceStr,
        out_trade_no: out_trade_no,//商户订单号
        total_fee: '1',//标价金额
        spbill_create_ip: '47.93.245.51',//终端IP
        notify_url: '/notify',
        trade_type: 'JSAPI',
        openid: openid          
        //sign: data.sign,//签名
    };   

    var key = config.wx.key;
    var str = tools.raw(data);
    str += '&key='+ key;
    var sign = await crypto.createHash('md5').update(str,'utf8').digest('hex').toUpperCase();//签名
    data.sign = sign;
    data = xml.jsonToXml(data);

    //console.log(data,'统一下单');

    var res = await tools.getPackge(data);//发起统一下单
    var result = await xml.xmlToJson(res);//解析统一下单返回的xml数据

    //console.log(result,'result');
    
    if(result.xml.prepay_id[0]){
        var prepayid = result.xml.prepay_id[0];
        //生成支付请求签名
        var data2 = {
            appId: config.wx.appid,
            timeStamp: timeStamp,
            nonceStr: nonceStr,
            package: 'prepay_id='+prepayid,
            signType: 'MD5'
        };

        var str1 = tools.raw(data2);
            str1 += '&key=' + config.wx.key;
        //支付签名
        var paySign = await crypto.createHash('md5').update(str1, 'utf8').digest('hex').toUpperCase();
        data2.paySign = paySign;
        data2.out_trade_no = out_trade_no;

        //获取js-ticket才能调用微信支付请求
        //获取js-cicket
        var jsapi_ticket = await dao.getJsapiTicket();
        var wxcfg = {
            appid: config.wx.appid,
            timestamp: timeStamp,
            nonceStr: nonceStr
        };

        var url = 'http://' + ctx.header.host + ctx.url;
        var str2 = tools.raw({
            noncestr: wxcfg.nonceStr,
            jsapi_ticket: jsapi_ticket,
            timestamp: wxcfg.timestamp,
            url: url
        });

        //JS-SDK使用权限签名
        var signature = crypto.createHash('sha1').update(str2, 'utf8').digest('hex').toLowerCase();
        wxcfg.signature = signature;

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
    await ctx.render('admin_order', {

    });
}

var admin_setOrder = async function (ctx.next) {
    var req = ctx.request.body;
    var name = req.name;
    var address = req.address;
    var phone = req.phone;
    var product = req.product;//产品
    var specifications = req.specifications;//规格
    var money = req.money;//金额
    var out_trade_no = req.out_trade_no;//订单号
    console.log(req)
    console.log(name);
    console.log(address);
    console.log(phone);
    console.log(product);
    console.log(specifications);
    console.log(money);
    console.log(out_trade_no);


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