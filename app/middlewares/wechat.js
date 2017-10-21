const User = require('../proxy').User;
const WXSDK = require('../proxy').WXSDK;
const tools = require('../utils/tools');
const pay = require('../utils/pay');
const xml = require('../utils/xml');

exports.voucher = async (ctx)=> {
	var openid = ctx.session.openid;
	var voucher = await User.getUserVoucherByOpenId(openid);
	console.log(voucher);
	ctx.body = voucher;
}

exports.sdk = async (ctx)=> {
    let url = decodeURIComponent(ctx.query.url);
    var SDK = await WXSDK.getWeSDK();
    var nonceStr = tools.createRandom();
    var timeStamp = tools.createTimestamp();

    var value = {
        nonceStr: nonceStr,
        timeStamp: timeStamp
    };
    var wxcfg = await pay.setWXConfig(SDK, url, value); 
    ctx.body = wxcfg;   
}

exports.pay = async (ctx)=> {
    var ip = ctx.ip.match(/\d+.\d+.\d+.\d+/)[0];
    var body = ctx.request.body;

    var nonceStr = tools.createRandom();
    var timeStamp = tools.createTimestamp();
    var out_trade_no = tools.trade();

    var value = {
        nonceStr: nonceStr,
        timeStamp: timeStamp,
        out_trade_no: out_trade_no
    };
    body.total_fee = body.total_fee * 100;
	var page = await pay.setPackageData(body.openid, body.total_fee, value,body.store_name, ip);
    
    var res = await tools.getPackge(page);//发起统一下单
    var result = await xml.xmlToJson(res);//解析统一下单返回的xml数据

    var prepayid = result.xml.prepay_id[0];
    var data2 = await pay.setPaySign(prepayid, value);
    ctx.body = data2;
}

exports.openAddress = async (ctx) => {

}