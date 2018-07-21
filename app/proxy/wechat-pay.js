const fs = require('fs')
const { resolve } = require('path');
const Config = require('../proxy').Config;
const Payment = require('wechat-pay').Payment;

const cert = resolve(__dirname,'../../' ,'config/apiclient_cert.p12')

exports.getBrandWCPayRequestParams = (config) => {
	console.log('进来辣')
	console.log(config,'getBrandWCPayRequestParams--------------')
	const payment = new Payment({
		  partnerKey: config.store_key,
		  appId: config.appid,
		  mchId: config.store_mchid,
		  notifyUrl: config.server_host + '/notify',
		  pfx: fs.readFileSync(cert)
	} || {});

	return function(order) {
		return new Promise((resolve, reject)=> {
			payment.getBrandWCPayRequestParams(order, (err, payargs) => {
				if(err) {
					reject(err)
				}else{
					resolve(payargs)
				}	
			})		
		})
	}
}
