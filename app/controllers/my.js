const request = require('request');
const xml = require('../utils/xml');
const wechat = require('../utils/wechat');
const dao = require('../dao/wechat');
const tools = require('../utils/tools');
const urlencode = require('urlencode');
const crypto = require('crypto');
const moment = require('moment');
const pay = require('../utils/pay');
const USER = require('../utils/user');
const STORE = require('../utils/store');
const logUtil = require('../../utils/log');

//预购
// var PreOrder = async (ctx, next) => {
//     const config = await dao.getConfig();
//     var r_url = config.server_host + ctx.url;
//     var url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+ config.appid + 
//         '&redirect_uri=' + urlencode(r_url) + '&response_type=code&scope=snsapi_userinfo&state=111#wechat_redirect';

//     if(ctx.session.openid){
//         await ctx.render('product', {
//             userinfo: ctx.session,
//             current_money_13: config.current_money_13 * 0.01,
//             original_money_13: config.original_money_13 * 0.01,
//             current_money_10: config.current_money_10 * 0.01,
//             original_money_10: config.original_money_10 * 0.01
//         });       
//     }else{
//         if(!ctx.query.code){
//             ctx.redirect(url);
//         }else{
//             let code = ctx.query.code;
//             var user = await tools.getOauth2Token(code);
//                 user = JSON.parse(user);
//             if(user.errcode){
//                 console.log(user.errcode);
//                 ctx.redirect(url);
//             }else{
//                 var userinfo = await tools.getUserInfo(user.access_token, user.openid);
//                     userinfo = JSON.parse(userinfo);
//                 ctx.session = userinfo;
//                 await ctx.render('product', {
//                     userinfo: userinfo,
//                     current_money_13: config.current_money_13 * 0.01,
//                     original_money_13: config.original_money_13 * 0.01,
//                     current_money_10: config.current_money_10 * 0.01,
//                     original_money_10: config.original_money_10 * 0.01
//                 })
//             }    
//         }
//     }

// };

var product = async (ctx, next) => {
    const config = await dao.getConfig();
    var product_id = ctx.params.product;
    var store = await STORE.getStoreById(product_id);
    store.sku_attr = store.sku_attr.split(',');
    store.sku_info = store.sku_info.split(',').map(function(val, index, arr) {
        var newarr = val.split(':');
        return {specifications: newarr[0], price: newarr[1], ori_price: newarr[2], repertory: newarr[3], qr: newarr[4]}; 
    });

    var r_url = config.server_host + ctx.url.split('?').slice(0,1);
    
    var url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+ config.appid + 
        '&redirect_uri=' + urlencode(r_url) + '&response_type=code&scope=snsapi_userinfo&state=111#wechat_redirect';


    if(ctx.session.openid){
        await ctx.render('product', {
            userinfo: ctx.session,
            store: store
        });       
    }else{
        if(!ctx.query.code){
            ctx.redirect(url);
        }else{
            let code = ctx.query.code;
            var user = await tools.getOauth2Token(code);
                user = JSON.parse(user);
            if(user.errcode){
                console.log(user.errcode);
                ctx.redirect(url);
            }else{
                var userinfo = await tools.getUserInfo(user.access_token, user.openid);
                    userinfo = JSON.parse(userinfo);
                ctx.session = userinfo;
                await ctx.render('product', {
                    userinfo: userinfo,
                    store: store
                })
            }    
        }
    }

}
//统一下单-生成预付单-获取package
var jssdk = async(ctx, next) => {
    const config = await dao.getConfig();
    var openid = ctx.query.openid;
    var total = ctx.query.total;//数量
    var specifications = ctx.query.specifications;//规格
    var product_id = ctx.query.product;//商品ID
    var store = await STORE.getStoreById(product_id);
    store.sku_attr = store.sku_attr.split(',');
    store.sku_info = store.sku_info.split(',').map(function(val, index, arr) {
        var newarr = val.split(':');
        return {specifications: newarr[0], price: newarr[1], ori_price: newarr[2], repertory: newarr[3], qr: newarr[4]}; 
    });

    var nonceStr = tools.createRandom();
    var timeStamp = tools.createTimestamp();
    var out_trade_no = tools.trade();

    var value = {
        nonceStr: nonceStr,
        timeStamp: timeStamp,
        out_trade_no: out_trade_no
    };

    var current_money = 0;//现价
    var derate_money = 0;//首单减免减免

    var todaySubscribe = await USER.getUserFlagByOpenId(openid); 
    
    if(todaySubscribe.flag == '1'){//首单
        derate_money = config.derate_money
    }

    for(var i = 0 ; i< store.sku_info.length; i++){
        if(specifications === store.sku_info[i].specifications) {
            current_money = store.sku_info[i].price
        }
    }

    var pay_money = total * current_money - derate_money ;
    var page = await pay.setPackageData(openid, pay_money, value,store.name);
    
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
        //获取js-ticket
        var jsapi_ticket = await dao.getJsapiTicket();
        var url = 'http://' + ctx.header.host + ctx.url;
        var wxcfg = await pay.setWXConfig(jsapi_ticket, url, value);

        await ctx.render('order', {
            config: wxcfg,
            data: data2,
            openid: openid,
            total: total,
            specifications: specifications,
            total_money: (pay_money + derate_money) * 0.01,
            derate_money: derate_money * 0.01,
            pay_money: pay_money * 0.01,

        });         
    }else{
        await ctx.redirect('/product/10001');
    }

};
// //统一下单-生成预付单-获取package
// var jsapiPay = async(ctx, next) => {
//     const config = await dao.getConfig();
//     var openid = ctx.query.openid;
//     var total = ctx.query.total;//数量
//     var specifications = ctx.query.specifications;//规格

//     var nonceStr = tools.createRandom();
//     var timeStamp = tools.createTimestamp();
//     var out_trade_no = tools.trade();

//     var value = {
//         nonceStr: nonceStr,
//         timeStamp: timeStamp,
//         out_trade_no: out_trade_no
//     };

//     var current_money = 0;//现价
//     var derate_money = 0;//首单减免减免

//     var todaySubscribe = await USER.getUserFlagByOpenId(openid); 
    
//     if(todaySubscribe.flag == '1'){//首单
//         derate_money = config.derate_money
//     }

//     switch(specifications) {
//         case '1.3米':
//         current_money = config.current_money_13;
//         break;
//         case '1米':
//         current_money = config.current_money_10;
//         break;
//     }

//     var pay_money = total * current_money - derate_money ;
//     var page = await pay.setPackageData(openid, pay_money, value);
    
//     //console.log(page,'统一下单');

//     var res = await tools.getPackge(page);//发起统一下单
//     var result = await xml.xmlToJson(res);//解析统一下单返回的xml数据
//     //console.log(result);
//     if(result.xml.err_code){
//         if(result.xml.err_code[0] == 'ORDERPAID'){
//             console.log('该订单已经支付');
//             await ctx.redirect('/product/100001');
//         }
//     }
//     if(result.xml.prepay_id){
//         var prepayid = result.xml.prepay_id[0];
//         var data2 = await pay.setPaySign(prepayid, value);

//         //获取js-ticket才能调用微信支付请求
//         //获取js-ticket
//         var jsapi_ticket = await dao.getJsapiTicket();
//         var url = 'http://' + ctx.header.host + ctx.url;
//         var wxcfg = await pay.setWXConfig(jsapi_ticket, url, value);

//         await ctx.render('order', {
//             config: wxcfg,
//             data: data2,
//             openid: openid,
//             total: total,
//             specifications: specifications,
//             total_money: (pay_money + derate_money) * 0.01,
//             derate_money: derate_money * 0.01,
//             pay_money: pay_money * 0.01,

//         });         
//     }else{
//         await ctx.redirect('/product/100001');
//     }

// };

//收款通知
var notify = async function(ctx, next) {
    let msg = ctx.request.body ? ctx.request.body.xml : '';
    if(msg.result_code[0] == 'SUCCESS' && msg.return_code[0] == 'SUCCESS'){
        var config = await dao.getConfig();
        var data = {
            appid: msg.appid[0],//公众账号id
            attach: msg.attach[0],//商家数据包
            bank_type: msg.bank_type[0],//付款银行
            cash_fee: msg.cash_fee[0],//现金支付金额
            fee_type: msg.fee_type[0],//货币种类
            is_subscribe: msg.is_subscribe[0],//是否关注公众账号
            mch_id: msg.mch_id[0],//商户号
            nonce_str: msg.nonce_str[0],//随机字符串
            openid: msg.openid[0],//用户标识
            out_trade_no: msg.out_trade_no[0],//商户订单号
            result_code: msg.result_code[0],//业务结果
            return_code: msg.return_code[0],//业务代码
            sign: msg.sign[0],//签名
            time_end: msg.time_end[0],//支付完成时间
            total_fee: msg.total_fee[0],//订单金额
            trade_type: msg.trade_type[0],//交易类型
            transaction_id: msg.transaction_id[0] //微信支付订单号
        }
        //console.log(data,'数据');
        dao.setNOTIFY(data);
        wechat.customUpdateUser(data.openid); //记录用户购买一次,关闭首单         
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

//退款
var refund = async function(ctx, next) {
    var req = ctx.request.body;
    var out_trade_no = req.out_trade_no;
    var config = await dao.getConfig();
    req.appid = config.appid;
    req.mch_id = config.store_mchid;
    req.out_refund_no = req.out_trade_no;//退款号=订单号
    req.refund_fee = parseInt(req.total_fee* 100);//退款金额=支付金额
    req.total_fee = parseInt(req.total_fee* 100);
    var refund = await pay.refund(req);    
    var xml = refund.xml; 
    if(xml.return_code[0] === 'SUCCESS' && xml.return_msg[0] === 'OK'){     
        if(xml.result_code[0] === 'SUCCESS'){
            // await wechat.delOrderByOutTradeNo(req.out_trade_no);//删除订单
            await wechat.updateOrderStatus(req.out_trade_no);
            return ctx.body = {
                msg: xml.result_code[0]
            }
        }else{        
            return ctx.body = {
                msg: xml.result_code[0],
                code:xml.err_code +':'+ xml.err_code_des[0]
            }
        }
    }
} 

module.exports = {
    //'GET /product/100001': PreOrder,
    'GET /product/:product': product,
    'POST /notify': notify,
    'GET /my/pay': jssdk,
    'POST /my/refund': refund

};