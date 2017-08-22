const request = require('request');
var options = {
	url:'https://api.weixin.qq.com/sns/userinfo?access_token=xyfWJSA-jJDrRzynZebJ8Mx2cFt1VifyP8LHbUN2riXs2U6atkkr0tpBvaQpnavLcj7q_aYJ85U_ncMahN2FGg&openid=oDC9Z0l_Ngjc36rTb7i86hgj57R4&lang=zh_CN',
	headers: [
        {
          name: 'content-type',
          value: 'application/x-www-form-urlencoded'
        }
      ],
};
request.get(options, function(err, res, body) {
	if(err){
		console.log(err);
	}else{
		console.log(JSON.parse(body).headimgurl);
	}
});