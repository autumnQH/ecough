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

var getPay = async (ctx, next)=>{   
    var order = ctx.params.orderId;
    var selectSum = ctx.params.selectSum;
    var token = ctx.params.token;
    var code = ctx.query.code;
    if(!code){
        var r_url = 'http://www.e-cough.com/pay/'+orderId+'/'+selectSum+'/'+token;
        var url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+ config.weixin.appid + 
        '&redirect_uri=' + urlencode(r_url) + '&response_type=code&scope=snsapi_userinfo&state=111#wechat_redirect';
        console.log(r_url);
        ctx.redirect(r_url); 
    }else{
        var code = code;
        var state = req.query.state;
        ctx.render('order', {
            code: code
        });
    }
};

var getOrder = async (ctx, next) => {
    console.log('进来啦');
    let code =  ctx.query.code;//获取网页授权code
    ctx.render('order',{
        code: openid
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
    'GET /pay': getPay,
    'POST /pay': getPay
};