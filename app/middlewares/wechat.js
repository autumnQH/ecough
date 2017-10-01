const User = require('../proxy/').User;
const SDK = require('../proxy/').SDK;
const tools = require('../utils/tools');
const pay = require('../utils/pay');
const xml = require('../utils/xml');

exports.voucher = async (ctx)=> {
	var openid = ctx.params.openid;
	var voucher = await User.getUserVoucherByOpenId(openid);
	console.log(voucher);
	ctx.body = voucher;
}

exports.pay = async (ctx)=> {
    var nonceStr = tools.createRandom();
    var timeStamp = tools.createTimestamp();
    var out_trade_no = tools.trade();

    var value = {
        nonceStr: nonceStr,
        timeStamp: timeStamp,
        out_trade_no: out_trade_no
    };
    var openid = 'oDC9Z0l_Ngjc36rTb7i86hgj57R4';
	var page = await pay.setPackageData(openid, 1, value,'api测试');
    
    console.log(page,'统一下单');

    var res = await tools.getPackge(page);//发起统一下单
    var result = await xml.xmlToJson(res);//解析统一下单返回的xml数据
    console.log(result);
    var prepayid = result.xml.prepay_id[0];
    var data2 = await pay.setPaySign(prepayid, value);

    //获取js-ticket才能调用微信支付请求
    //获取js-ticket
    var jsapi = await SDK.getWXSDK();
    var url = 'http://' + ctx.header.host + ctx.url;
    var wxcfg = await pay.setWXConfig(jsapi, url, value);
    console.log(wxcfg);
    ctx.body = wxcfg;
}