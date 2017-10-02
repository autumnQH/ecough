var tools = require('./tools');
var crypto = require('crypto');
var xml =require('./xml');
var fs = require('fs');
var request = require('request');

let i = ' 2017092817073458  '

async function a() {
	let json = {
		appid : 'wxff24c10734aed1ef',
    mch_id : '1470073502',
    out_refund_no : '2017100220342981',//退款号=订单号
    out_trade_no: '2017100220342981',
    refund_fee : 100,
    total_fee : 100
	};
    const nonce_str = tools.createRandom();
    const mch_id = json.mch_id;
        json.nonce_str = nonce_str;

    var str = tools.raw(json);
        str += '&key=' + 'qwertyuiopasdfghjklzxcvbnm123456';

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

a().then(function(r) {
	console.log(r);
})