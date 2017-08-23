const request = require('request');
const xml = require('../utils/xml');
const wechat = require('../utils/wechat');
const dao = require('../dao/wechat');
const config = require('../config/config');
const tools = require('../utils/tools');
const urlencode = require('urlencode');
const crypto = require('crypto');

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

var getPay = async (ctx, next)=>{   

       await ctx.render('hello', {
           
        });

};


var getUserInfo = async (ctx, next) => {
    console.log('userinfo');
    if(!ctx.query.code){
        ctx.redirect('/my/order');
    }else{
        let code = ctx.query.code;
        ctx.userinfo = await tools.getToken(code);
        console.log(typeof ctx.userinfo,'ctx.userinfo1');
        var data = JSON.parse(ctx.userinfo);
        console.log(typeof data,'data22');
        console.log(data,'data=====');
        ctx.userinfo = await tools.getUserInfo(data.access_token, data.openid);
        var userinfo = JSON.parse(ctx.userinfo);
        console.log(ctx.userinfo,'ctx.userinfo');
        await ctx.render('user',{
            userinfo: userinfo
        });
   }
};

var getOrder = async (ctx, next) => {
    console.log('进来啦');
    if(!ctx.query.code){
        console.log('code不存在');
        var r_url = 'http://'+ config.server.host +'/my/order';
        var url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+ config.weixin.appid + 
        '&redirect_uri=' + urlencode(r_url) + '&response_type=code&scope=snsapi_userinfo&state=111#wechat_redirect';
        ctx.redirect(url);
    }else{
        console.log('code存在');
        let code = ctx.query.code;
        await ctx.render('order',{
            code: code
        });
    }

};

//统一下单-生成预付单-获取package
var jsapiPay = async(ctx, next) => {

    var ip = ctx.header['x-forwarded-for'];
    var nonceStr = tools.createRandom();
    console.log(typeof nonceStr);
    var timeStamp = tools.createTimestamp();
    console.log(typeof timeStamp);

    var data = {
        appid: config.weixin.appid, //appId
        attach: '支付测试',
        body: 'Test', //商品描述
        mch_id: config.wx.mchid, //商户号id
        nonce_str: nonceStr,
        out_trade_no: tools.trade(),//商户订单号
        total_fee: '1',//标价金额
        spbill_create_ip: ip,//终端IP
        notify_url: '/notify',
        trade_type: 'JSAPI',
        openid: 'oDC9Z0l_Ngjc36rTb7i86hgj57R4'           
        //sign: data.sign,//签名
    };   

    var key = config.wx.key;
    var str = tools.raw(data);
    str += '&key='+ key;

    var sign = await crypto.createHash('md5').update(str,'utf8').digest('hex').toUpperCase();//签名
    data.sign = sign;
    data = xml.jsonToXml(data);
    console.log(data,'统一下单');
    var res = await tools.getPackge(data);//发起统一下单
    var result = await xml.xmlToJson(res);//解析统一下单返回的xml数据
    console.log(result,'result');
    if(result.xml.prepay_id[0]){
        var prepayid = result.xml.prepay_id[0];
        //生成支付请求签名
        var data2 = {
            appId: config.weixin.appid,
            timeStamp: timeStamp,
            nonceStr: nonceStr,
            package: 'prepay_id='+prepayid,
            signType: 'MD5'
        };

        var str1 = tools.raw(data2);
            str1 += '&key=' + config.wx.key;
        //支付签名
        console.log(str1);
        var paySign = await crypto.createHash('md5').update(str1, 'utf8').digest('hex').toUpperCase();
        data2.paySign = paySign;
        //data2.paySign = sign;
        console.log(data2,'支付签名');

        //获取js-ticket才能调用微信支付请求
        //获取js-cicket
        var jsapi_ticket = await dao.getJsapiTicket();
        var wxcfg = {
            appid: config.weixin.appid,
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

        await ctx.render('hello', {
            config: wxcfg,
            data: data2
        });         
    }else{
        console.log('打桩2');
        ctx.redirect('/my/order');
    }

};

var notify = async function(ctx, next) {
    console.log('通知哦');
};

module.exports = {
	'GET /my/address': getAddress,
    'GET /my/problem': getProblem,
    'GET /my/logistics': get_logistics,
    'GET /product/100001': getProduct,
    'POST /product/100001': getProduct,
    'GET /pay': getPay,
    'GET /notify': notify,
    'POST /notify': notify,
    'GET /my/order': getOrder,
    'GET /my/userinfo': getUserInfo,
    'GET /my/pay': jsapiPay,

};