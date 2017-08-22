const request = require('request');
const xml = require('../utils/xml');
const wechat = require('../utils/wechat');
const dao = require('../dao/wechat');
const config = require('../config/config');
const tools = require('../utils/tools');

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
    //     var data = {
    //     appid: config.weixin.appid, //appId
    //     mch_id: config.wx.mchid, //商户号id
    //     body: 'Test', //商品描述
    //     nonce_str: tools.createRandom(),
    //     //sign: data.sign,//签名
    //     out_trade_no: tools.trade(),//商户订单号
    //     total_fee: '1',//标价金额
    //     attach: '支付测试',
    //     spbill_create_ip: ctx.header['x-forwarded-for'],//终端IP
    //     notify_url: '/getOrder',
    //     trade_type: 'JSAPI',
    //     openid: openid           
    // };

    // var sign = wechat.paySign(data, config.wx.key);
    //     data.sign = sign.sign;
    // console.log(data);
    
    // await wechat.getAuthToken(code, function(openid) {
    //     var formData = xml.jsonToXml({
    //         xml: data
    //     });
    //     console.log(formData);
    //     let options = {
    //         url: 'https://api.mch.weixin.qq.com/pay/unifiedorder',
    //         method: 'POST',  
    //         body: formData
    //     };
    //     request.post(options, function(err, res, body) {
    //         if(err){
    //             console.log(err, 'err========');
    //         }else{
    //             console.log(body, 'body======支付啊日你吗');
    //         }
    //     });
    // });
    await ctx.render('product', {});
};

var getProblem= async (ctx, next) => {
    ctx.state = {
        title: 'hello koa2'
    };
    await ctx.render('problem', {});
};

var getPlay = async (ctx, next)=>{
    var token = await dao.getActiveAccessToken();
    var jsapi_ticket =  await dao.getJsapiTicket();
    var url = ctx.header['x-forwarded-proto']+'://' +ctx.host+ctx.url;
    var data = await wechat.signature(jsapi_ticket, url);
    var signature = data.signature;

    await ctx.render('hello',{
        appId: config.wx.appid,
        timestamp: data.timestamp,
        nonceStr: data.nonceStr,
        signature: signature,
        random: tools.createRandom(32)
    });
};

var getOrder = async (ctx, next) => {
    console.log('进来啦');
    let code =  ctx.query.code;//获取网页授权code
    await wechat.getAuthToken(code, function(openid) {
        await ctx.render('order',{
            code: openid
        });
    });

};


var postOrder = async(ctx, next) => {
    console.log('codeode');
    let code = ctx.params['code'];
    console.log(code);
    console.log(msg,'页面授权！！');
};

module.exports = {
	'GET /my/address': getAddress,
    'GET /my/problem': getProblem,
    'GET /my/logistics': get_logistics,
    'GET /product/100001': getProduct,
    'POST /product/100001': getProduct,
    'GET /my/order': getOrder,
    'POST /my/order': postOrder,
    'GET /play': getPlay,
    'POST /play': getPlay
};