const fs = require('fs')
const { resolve } = require('path');
const Config = require('../proxy').Config;
const Payment = require('wechat-pay').Payment;

const cert = resolve(__dirname, 'config/cert/apiclient_cert.p12')

console.log(cert)

async function initConfig() {
	const config = await Config.getConfig()
	return {
	  partnerKey: config.store_key,
	  appId: config.appid,
	  mchId: config.store_mchid,
	  notifyUrl: config.server_host + '/notify',
	  pfx: fs.readFileSync(cert)
	};
}

const init = initConfig()
console.log(init,'initConfig')

const payment = new Payment(init || {});

exports.getBrandWCPayRequestParams = (order) => {
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
