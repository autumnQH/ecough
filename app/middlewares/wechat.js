const User = require('../proxy').User;
const SDK = require('../proxy').SDK;
const tools = require('../utils/tools');
const pay = require('../utils/pay');
const xml = require('../utils/xml');

exports.voucher = async (ctx)=> {
	var openid = ctx.session.openid;
	var voucher = await User.getUserVoucherByOpenId(openid);
	console.log(voucher);
	ctx.body = voucher;
}

exports.pay = async (ctx)=> {
    console.log(ctx.ip,'ip----');
    var ip = ctx.ip.match(/\d+.\d+.\d+.\d+/)[0];
    var body = ctx.request.body;
    console.log(body,'res===');

    var nonceStr = tools.createRandom();
    var timeStamp = tools.createTimestamp();
    var out_trade_no = tools.trade();

    var value = {
        nonceStr: nonceStr,
        timeStamp: timeStamp,
        out_trade_no: out_trade_no
    };
	var page = await pay.setPackageData(body.openid, body.total_fee, value,body.store_name, ip);
    
    console.log(page,'统一下单');

    var res = await tools.getPackge(page);//发起统一下单
    var result = await xml.xmlToJson(res);//解析统一下单返回的xml数据
    console.log(result);
    var prepayid = result.xml.prepay_id[0];
    var data2 = await pay.setPaySign(prepayid, value);
    console.log(data2,'data2')
    ctx.body = data2;
}