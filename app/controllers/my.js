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
            current_money: config.current_money * 0.01,
            original_money: config.original_money * 0.01
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
                    userinfo: userinfo,
                    current_money: config.current_money * 0.01,
                    original_money: config.original_money * 0.01
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

    var original_money = config.original_money;//原价
    var derate_money = 0;//减免

    var todaySubscribe = await dao.getOpenIdForSubscribe(openid); 
    
    if(todaySubscribe.flag == '1'){//首单
        derate_money = config.derate_money
    }

    var pay_money = total * original_money - derate_money ;
    var page = await pay.setPackageData(openid, pay_money, value);
    
    //console.log(page,'统一下单');

    var res = await tools.getPackge(page);//发起统一下单
    var result = await xml.xmlToJson(res);//解析统一下单返回的xml数据
    //console.log(result);
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
    let msg = ctx.request.body ? ctx.request.body.xml : '';
    if(msg.result_code[0] == 'SUCCESS' && msg.return_code[0] == 'SUCCESS'){
        var data = {
            appid: msg.appid[0],
            attach: msg.attach[0],
            bank_type: msg.bank_type[0],
            cash_fee: msg.cash_fee[0],
            fee_type: msg.fee_type[0],
            is_subscribe: msg.is_subscribe[0],
            mch_id: msg.mch_id[0],
            nonce_str: msg.nonce_str[0],
            openid: msg.openid[0],
            out_trade_no: msg.out_trade_no[0],
            result_code: msg.result_code[0],
            return_code: msg.return_code[0],
            sign: msg.sign[0],
            time_end: msg.time_end[0],
            total_fee: msg.total_fee[0],
            trade_type: msg.trade_type[0],
            transaction_id: msg.transaction_id[0] 
        }
        //console.log(data,'数据');
        dao.setNOTIFY(data);
        var flag = await dao.getOpenIdForSubscribe(data.openid);//查询用户首单
        if(flag.flag == '1'){
            var result = await wechat.getOneSpread(data.openid);
            var ticket = result.ticket;
            console.log(ticket,'二维码参数');
            dao.setOpenIdForSubscribe({ticket: ticket, flag: false},{openid: data.openid});//关闭首单
        }
        return ctx.body =  xml.jsonToXml({
            return_code: msg.result_code[0],
            return_msg: msg.return_code[0]
        });        
    }else{
        return ctx.body =  xml.jsonToXml({
            return_code: msg.result_code[0],
            return_msg: msg.return_code[0]
        });
    }


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
    'POST /notify': notify,
    //'POST /my/pay/notify': notify,
    //'GET /my/userinfo': getUserInfo,
    'GET /my/pay': jsapiPay
    //'GET /my/order': getOrder,

};