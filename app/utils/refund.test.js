const pay = require('./pay');
const tools = require('./tools');
const crypto = require('crypto');

async function a() {

	var b = await pay.refund({
		appid: 'wxff24c10734aed1ef',
		mch_id: '1470073502',
		out_trade_no: '2017091013070220',
		out_refund_no: '2017091013070220',
		total_fee: '10',
		refund_fee: '10'
	});
	console.log(b);
}
a();