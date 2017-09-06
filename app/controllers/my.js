const request = require('request');
const xml = require('../utils/xml');
const wechat = require('../utils/wechat');
const dao = require('../dao/wechat');
const tools = require('../utils/tools');
const urlencode = require('urlencode');
const crypto = require('crypto');
const moment = require('moment');
const pay = require('../utils/pay');


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
    const config = await dao.getConfig();
    var r_url = config.server_host + ctx.url;
    var url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+ config.appid + 
        '&redirect_uri=' + urlencode(r_url) + '&response_type=code&scope=snsapi_userinfo&state=111#wechat_redirect';

    if(ctx.session.openid){
        //console.log('session存在');
        //console.log(ctx.session);
        await ctx.render('product', {
            userinfo: ctx.session
        });       
    }else{
        if(!ctx.query.code){
            //console.log('code不存在');
            ctx.redirect(url);
        }else{
            let code = ctx.query.code;
            var user = await tools.getOauth2Token(code);
                user = JSON.parse(user);
                //console.log(user,'user');
            if(user.errcode){
                ctx.redirect(url);
            }else{
                //console.log('ok');
                //拉取用户信息
                var userinfo = await tools.getUserInfo(user.access_token, user.openid);
                    userinfo = JSON.parse(userinfo);
                ctx.session = userinfo;
                await ctx.render('product', {
                    userinfo: userinfo
                })
            }    
        }
    }

};

//统一下单-生成预付单-获取package
var jsapiPay = async(ctx, next) => {
    // var wxcfg = {
    //     appid: '',
    //     timestamp: '',
    //     nonceStr: '',
    //     signature: ''
    // };
    // var data2 = {
    //     timeStamp: '',
    //     nonceStr: '',
    //     package: '',
    //     signType: '',
    //     paySign: ''
    // };
    // await ctx.render('order',{
    //     config: wxcfg,
    //     data: data2,
    //     openid: ''
    // });

    const config = await dao.getConfig();
    var openid = ctx.query.openid;
    var total = ctx.query.total;

    var nonceStr = tools.createRandom();
    var timeStamp = tools.createTimestamp();
    var out_trade_no = tools.trade();

    var value = {
        nonceStr: nonceStr,
        timeStamp: timeStamp,
        out_trade_no: out_trade_no
    };

    var original_money = config.original_money//原价
    var derate_money = config.derate_money//减免
    console.log(original_money,'原价');
    console.log(derate_money, '减免');

    var pay_money = total * 10 - 1 ;
    console.log(pay_money);
    var page = await pay.setPackageData(openid, pay_money, value);
    
    //console.log(page,'统一下单');

    var res = await tools.getPackge(page);//发起统一下单
    var result = await xml.xmlToJson(res);//解析统一下单返回的xml数据
    console.log(result);
    if(result.xml.err_code){
        if(result.xml.err_code[0] == 'ORDERPAID'){
            console.log('该订单已经支付');
            await ctx.redirect('/product/100001');
        }
    }
    if(result.xml.prepay_id){
        var prepayid = result.xml.prepay_id[0];
        var data2 = await pay.setPaySign(prepayid, value);

        //获取js-ticket才能调用微信支付请求
        //获取js-cicket
        var jsapi_ticket = await dao.getJsapiTicket();
        var url = 'http://' + ctx.header.host + ctx.url;
        var wxcfg = await pay.setWXConfig(jsapi_ticket, url, value);

        await ctx.render('order', {
            config: wxcfg,
            data: data2,
            openid: openid,
            total: total,
            pay_money: pay_money * 0.01
        });         
    }else{
        await ctx.redirect('/product/100001');
    }

};

var notify = async function(ctx, next) {
    console.log('通知哦');
};

var getOrder = async function(ctx, next) {
    await ctx.render('order', {

    });
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
    //'GET /my/userinfo': getUserInfo,
    'GET /my/pay': jsapiPay
    //'GET /my/order': getOrder,

};