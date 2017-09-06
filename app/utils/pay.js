const tools = require('./tools');
const config = require('../config/config');
const crypto = require('crypto');
const xml = require('./xml');


//统一下单
exports.setPackageData = function (openid, pay.money, value) {	
    var data = {
        appid: config.wx.appid, //appId
        attach: '支付测试',
        body: 'Test', //商品描述
        mch_id: config.wx.mchid, //商户号id
        nonce_str: value.nonceStr,
        out_trade_no: value.out_trade_no,//商户订单号
        total_fee: pay.money,//标价金额
        spbill_create_ip: '47.93.245.51',//终端IP
        notify_url: '/notify',
        trade_type: 'JSAPI',
        openid: openid          
        //sign: data.sign,//签名
    }; 
    var key = config.wx.key;
    var str = tools.raw(data);
    		str += '&key='+ key;

    var sign = crypto.createHash('md5').update(str,'utf8').digest('hex').toUpperCase();//签名

        data.sign = sign;
    		data = xml.jsonToXml(data);
    return data;
}

//生成支付请求签名
exports.setPaySign = function (prepayid, value) {
		var data = {
		    appId: config.wx.appid,
		    timeStamp: value.timeStamp,
		    nonceStr: value.nonceStr,
		    package: 'prepay_id='+prepayid,
		    signType: 'MD5'
		};
    var str = tools.raw(data);
        str += '&key=' + config.wx.key;
    
    //支付签名
    var paySign = crypto.createHash('md5').update(str, 'utf8').digest('hex').toUpperCase();
        data.paySign = paySign;
        data.out_trade_no = value.out_trade_no;
    return data;    
}

exports.setWXConfig = function(jsapi_ticket, url, value) {
    var wxcfg = {
        appid: config.wx.appid,
        timestamp: value.timeStamp,
        nonceStr: value.nonceStr
    };
    var str = tools.raw({
        noncestr: wxcfg.nonceStr,
        jsapi_ticket: jsapi_ticket,
        timestamp: wxcfg.timestamp,
        url: url
    });  
    //JS-SDK使用权限签名
    var signature = crypto.createHash('sha1').update(str, 'utf8').digest('hex').toLowerCase();
    wxcfg.signature = signature; 
    return wxcfg; 
}