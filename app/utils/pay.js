const tools = require('./tools');
const crypto = require('crypto');
const xml = require('./xml');
const dao = require('../dao/wechat');
const fs = require('fs');
const request = require('request');
const _ = require('lodash');

//统一下单
exports.setPackageData = async function (openid, pay_money, value) {
    const config = await dao.getConfig();	
    var data = {
        appid: config.appid, //appId
        attach: '支付测试',
        body: 'Test', //商品描述
        mch_id: config.store_mchid, //商户号id
        nonce_str: value.nonceStr,
        out_trade_no: value.out_trade_no,//商户订单号
        total_fee: pay_money,//标价金额
        spbill_create_ip: '47.93.245.51',//终端IP
        notify_url: config.server_host+'/notify',
        trade_type: 'JSAPI',
        openid: openid          
        //sign: data.sign,//签名
    }; 
    var key = config.store_key;
    var str = tools.raw(data);
    		str += '&key='+ key;

    var sign = crypto.createHash('md5').update(str,'utf8').digest('hex').toUpperCase();//签名

        data.sign = sign;
    		data = xml.jsonToXml(data);
    return data;
}

//生成支付请求签名
exports.setPaySign = async function (prepayid, value) {
    const config = await dao.getConfig();
	var data = {
	    appId: config.appid,
	    timeStamp: value.timeStamp,
	    nonceStr: value.nonceStr,
	    package: 'prepay_id='+prepayid,
	    signType: 'MD5'
	};
    var str = tools.raw(data);
        str += '&key=' + config.store_key;
    
    //支付签名
    var paySign = crypto.createHash('md5').update(str, 'utf8').digest('hex').toUpperCase();
        data.paySign = paySign;
        data.out_trade_no = value.out_trade_no;
    return data;    
}

exports.setWXConfig = async function(jsapi_ticket, url, value) {
    const config = await dao.getConfig();
    var wxcfg = {
        appid: config.appid,
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

//退款
exports.refund = async function(json) {
    var config = await dao.getConfig();
    const nonce_str = tools.createRandom();
    const mch_id = json.mch_id;
        json.nonce_str = nonce_str;

    var str = tools.raw(json);
        str += '&key=' + config.store_key;

    var sign = crypto.createHash('md5').update(str,'utf8').digest('hex').toUpperCase();

        json.sign = sign;        
        json = xml.jsonToXml(json);

    let options = {
        url: 'https://api.mch.weixin.qq.com/secapi/pay/refund',
        method: 'post',
        body: json,
        agentOptions: {
            pfx: fs.readFileSync(__dirname+ '/apiclient_cert.p12'),
            passphrase: mch_id
        }
    };

    return new Promise(function(resolve, reject) {
        request(options, function(err, res, body) {
            if(body){
                return resolve(xml.xmlToJson(body));
            }else{
                return reject(xml.xmlToJson(err));
            }
        });
    });    
}