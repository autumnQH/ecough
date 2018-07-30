const crypto = require('crypto');
const xml = require('./xml');

function createNonceStr() {
	return Math.random().toString(36).substr(3, 16)
}

function createTimestamp() {
	return parseInt(new Date().getTime() / 1000, 0) + ''
}

function raw(args) {
	let keys = Object.keys(args)
	let newArgs = {}
	let str = ''

	keys = keys.sort()

	keys.forEach((key) => {
		newArgs[key.toLowerCase()] = args[key]
	})

	for(let k in newArgs) {
		str += '&' + k + '=' + newArgs[k]
	}
	return str.substr(1)

}

function signIt(noncestr, timestamp, jsapi_ticket, url) {
	const ret = {noncestr, jsapi_ticket, timestamp , url}
	const string = raw(ret)
  const sha = crypto.createHash('sha1').update(string,'utf8').digest('hex').toLowerCase()
  return sha
}

exports.signature = (jsapi_ticket, url)=> {
	const noncestr = createNonceStr()
	const timestamp = createTimestamp()
	const signature = signIt(noncestr, timestamp, jsapi_ticket, url)

	return {noncestr, timestamp, signature}
}

exports.getTextMessage = (msg, content) => {

        return xml.jsonToXml({
            xml: {
                ToUserName: msg.FromUserName,
                FromUserName: msg.ToUserName,
                CreateTime: Date.now(),
                MsgType: msg.MsgType,
                Content: content
            }
        })
}
 
exports.transfer2CustomerService = (msg) => {
    return xml.jsonToXml({
        xml: {
            ToUserName: msg.FromUserName,
            FromUserName: msg.ToUserName,
            CreateTime: Date.now(),
            MsgType: 'transfer_customer_service'            
        }
    });
}
