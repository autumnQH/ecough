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
    console.log('adasdasd');
    var data = {
        appid: config.weixin.appid, //appId
        attach: '支付测试',
        body: 'Test', //商品描述
        mch_id: config.wx.mchid, //商户号id
        nonce_str: tools.createRandom(),
        out_trade_no: tools.trade(),//商户订单号
        total_fee: '1',//标价金额
        spbill_create_ip: '123.12.12.123',//终端IP
        notify_url: '/notify',
        trade_type: 'JSAPI',
        openid: 'oDC9Z0l_Ngjc36rTb7i86hgj57R4'           
        //sign: data.sign,//签名
    };   
    console.log('什么鬼');
    var key = config.wx.key;
    console.log('日你');
    var str1 = tools.raw(data);
    console.log('这都能卡？');
    str1 += '&key='+ key;
    var sign = await crypto.createHash('md5').update(str1).digest('hex').toUpperCase();//签名
    console.log('死那里去了？');
    data.sign = sign;
    data = xml.jsonToXml(data);
    console.log('日日啊啊');
    var res = await tools.getPackge(data);//发起统一下单
    var result = await xml.xmlToJson(res);//解析统一下单返回的xml数据
    console.log('操操操');
    if(result.xml.prepay_id[0]){
        console.log('打桩1');
        var prepayid = result.xml.prepay_id[0];
        //生成支付请求签名
        var data = {
            appid: config.weixin.id,
            timeStamp: tools.createTimestamp(),
            nonceStr: tools.createRandom(),
            package: prepayid,
            signType: 'MD5'
        };

        var str1 = tools.raw(data);
        //支付签名
        var sign = crypto.createHash('md5').update(str1).digest('hex').toUpperCase();
        data.paySign = sign;
        console.log(data);

        //获取js-ticket才能调用微信支付请求
        //获取js-cicket
        var jsapi_ticket = dao.getJsApiTicket();
        var wxfig = {
            appid: config.weixin.appid,
            timestamp: tools.createTimestamp(),
            nonceStr: tools.createRandom()
        };
        console.log('url差点错误');
        var str2 = tools.rwa({
            noncestr: wxfig.nonceStr,
            jsapi_ticket: jsapi_ticket,
            timestamp: wxfig.timestamp,
            url: ctx.path
        });
        console.log(str2.url);
        console.log(typeof str2.url);
        //JS-SDK使用权限签名
        var signature = crypto.createHash('sha1').update(shr2, 'utf8').digest('hex').toLowerCase();
        wxfig.signature = signature;

        await ctx.render('hello', {
            config: wxcfg,
            data: data
        });         
    }else{
        console.log('打桩2');
        await ctx.redirect('back');
    }

};

var notify = async function(ctx, next) {

};

module.exports = {
	'GET /my/address': getAddress,
    'GET /my/problem': getProblem,
    'GET /my/logistics': get_logistics,
    'GET /product/100001': getProduct,
    'POST /product/100001': getProduct,
    'GET /pay': getPay,
    'POST /notify': notify,
    'GET /my/order': getOrder,
    'GET /my/userinfo': getUserInfo,
    'GET /my/pay': jsapiPay,

};