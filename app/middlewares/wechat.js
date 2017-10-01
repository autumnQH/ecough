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
    console.log(ctx.ip.match(/\d+.\d+.\d+.\d+/)[0],'ctx.id=====');
    var body = ctx.request.body;
    console.log(body,'res===');
    var req = {
        openid: 'oDC9Z0l_Ngjc36rTb7i86hgj57R4',
        pay_money: 1,
        store_name: 'api测试'
    };
    var nonceStr = tools.createRandom();
    var timeStamp = tools.createTimestamp();
    var out_trade_no = tools.trade();

    var value = {
        nonceStr: nonceStr,
        timeStamp: timeStamp,
        out_trade_no: out_trade_no
    };
	var page = await pay.setPackageData(req.openid, req.pay_money, value,req.store_name);
    
    console.log(page,'统一下单');

    var res = await tools.getPackge(page);//发起统一下单
    var result = await xml.xmlToJson(res);//解析统一下单返回的xml数据
    console.log(result);
    var prepayid = result.xml.prepay_id[0];
    var data2 = await pay.setPaySign(prepayid, value);
    console.log(data2,'data2')
    ctx.body = data2;
}