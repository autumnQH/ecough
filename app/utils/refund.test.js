const request = require('request');
const dao = require('../dao/wechat');
async function a () {
	var token = await dao.getActiveAccessToken();
	console.log(token);
	let json = JSON.stringify({
		  industry_id1: '1',
      industry_id2: '1'
	});
	let options = {
		url: 'https://api.weixin.qq.com/cgi-bin/template/api_set_industry?access_token='+ token,
		method : 'post',
		body: json
	};
	request(options, function(err ,res, body) {
		if(body){
			console.log(body);
		}else{
			console.log(err);
		}
	});	
}
async function b() {
	var token = await dao.getActiveAccessToken();
	let options = {
		url: 'https://api.weixin.qq.com/cgi-bin/template/get_industry?access_token='+token,
		method: 'get'
	};
	request(options, function(err, res, body) {
		if(body){
			console.log(body)
		}else{
			console.log(err)
		}
	});
}
//a();
b();