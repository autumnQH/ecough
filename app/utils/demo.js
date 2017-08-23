const tools = require('./tools');
const config = require('../config/config');
const crypto = require('crypto');
const xml = require('./xml');

var data = {
    appid: config.weixin.appid, //appId
    attach: '支付测试',
    body: 'Test', //商品描述
    mch_id: config.wx.mchid, //商户号id
    nonce_str: tools.createRandom(),
    out_trade_no: tools.trade(),//商户订单号
    total_fee: '1',//标价金额
    spbill_create_ip: '123.12.12.123',//终端IP
    notify_url: '/notify',
    trade_type: 'JSAPI',
    openid: 'oDC9Z0l_Ngjc36rTb7i86hgj57R4'           
    //sign: data.sign,//签名
};
var key = config.wx.key;
var str1 = tools.raw(data);
str1 += '&key='+ key;

var sign = crypto.createHash('md5').update(str1, 'utf8').digest('hex').toUpperCase();

data.sign = sign;

data = xml.jsonToXml(data);

async function a (){
   var res = await tools.getPackge(data);
   var result = await xml.xmlToJson(res);
   result = result.xml.prepay_id[0];

}
a();