const request = require('request');
var jssdk = 'HoagFKDcsGMVCIY2vOjf9jfOn6YGyojYOZG3maG_S48qD295BryhI1NIMcjKicQ9NLxGbgX15Z7kzdzwCvw5bg';
let token = 'H9Zq81PaLbXynbLjk76ySZ4mGBKcQPQOAoGKjwagDNDLJ25fqjVD3ZzQwMa8G6EZUhc32gD7bMzfwSD62GCyX0A7AtuwKQWibyhwP2Z0XaDqbAXz5DuY9J-RpRupUq9lHZCgAFAXPS';
let url = 'https://api.weixin.qq.com/merchant/order/getbyfilter?access_token=' + token;
let data = JSON.stringify({
	status : 2
});

console.log(data);
let options = {
	url: url,
	form: data,
	method:'post',
  headers: {
  	'Content-Type': 'application/x-www-form-urlencoded'
	} 
};
request(options, function(err, res, body) {
	if (err) {
		console.error(err);
	}else{
		console.log(body);
	}
});
