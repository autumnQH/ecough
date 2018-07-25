const tools = require('./tools');
const crypto = require('crypto');
const xml = require('./xml');
const fs = require('fs');
const request = require('request');
const { resolve } = require('path');
const cert = resolve(__dirname, '../../' ,'config/apiclient_cert.p12')

//退款
exports.refund = async function(json) {
    const nonce_str = tools.createRandom();
    json.nonce_str = nonce_str;
    const mch_id = json.mch_id
    const store_key = json.store_key
    delete json.store_key
    var str = tools.raw(json);
        str += '&key=' + store_key;

    var sign = crypto.createHash('md5').update(str,'utf8').digest('hex').toUpperCase();

        json.sign = sign;        
        json = xml.jsonToXml(json);

    let options = {
        url: 'https://api.mch.weixin.qq.com/secapi/pay/refund',
        method: 'post',
        body: json,
        agentOptions: {
            pfx: fs.readFileSync(cert),
            passphrase: mch_id
        }
    };

    return new Promise(function(resolve, reject) {
        request(options, function(err, res, body) {
            if(body){
                console.log(body)
                return resolve(xml.xmlToJson(body));
            }else{
                console.log(err)
                return reject(xml.xmlToJson(err));
            }
        });
    });    
}
