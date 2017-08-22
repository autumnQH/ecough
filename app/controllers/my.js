const request = require('request');
const xml = require('../utils/xml');
const wechat = require('../utils/wechat');
const dao = require('../dao/wechat');
const config = require('../config/config');
const tools = require('../utils/tools');
const urlencode = require('urlencode');

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

//用code 换取token
function getToken(code) {
    let options = {
        method: 'get',
        url: 'https://api.weixin.qq.com/sns/oauth2/access_token?appid='+ config.weixin.appid +'&secret='+ config.weixin.appSecret +'&code='+ code +'&grant_type=authorization_code'
    };
    console.log(url);
    return new Promise((resolve, reject)=>{
        request(options, function(err, res, body) {
            if(res){
                console.log(JSON.parse(body));
                resolve(JSON.parse(body));
            }else{
                reject(err);
            }
        });
    });
}

function getUserInfo(AccessToken, openId) {
    let options ={
        method: 'get',
        url: 'https://api.weixin.qq.com/sns/userinfo?access_token='+ AccessToken+'&openid='+ openid+'&lang=zh_CN'
    };
    console.log(url);
    return new Promise((resolve, reject)=>{
        request(options, function(err, res, body) {
            if(res){
                resolve(JSON.parse(body));
            }else{
                reject(err);
            }
        });
    });
}

var getOrder = async (ctx, next) => {
    console.log('进来啦');
    if(!ctx.query.code){
        console.log('code不存在');
        var r_url = 'http://www.e-cough.com/my/order';
        var url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+ config.weixin.appid + 
        '&redirect_uri=' + urlencode(r_url) + '&response_type=code&scope=snsapi_userinfo&state=111#wechat_redirect';
        console.log(r_url);
        ctx.redirect(url);
    }else{
        let code = ctx.query.code;
        console.log(typeof getToken(code));
        getToken(code);
    }

};


var postOrder = async(ctx, next) => {
    
};

module.exports = {
	'GET /my/address': getAddress,
    'GET /my/problem': getProblem,
    'GET /my/logistics': get_logistics,
    'GET /product/100001': getProduct,
    'POST /product/100001': getProduct,
    'GET /my/order': getOrder,
    'POST /my/order': getOrder,
    'GET /pay': getPay,
    'POST /pay': getPay
};