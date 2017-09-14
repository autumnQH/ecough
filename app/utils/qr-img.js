var qr_image = require('qr-image');  
var images = require('images');
var request = require('request');
var fs = require('fs');
var qr = require('./qr');

  var userinfo = {};
  userinfo.headimgurl = 'http://wx.qlogo.cn/mmopen/PiajxSqBRaEKqqa31ybC79PqVmErpI2QiapLA5yxT9ampXSa1WrDxcTc6AokhZpBBoOvDYFwTJ5aP6Gvtarcib70w/0';
  userinfo.openid = '123';
async function a() {
	var r = await qr.qr(userinfo);
	console.log(r);
	var logo = await qr.qr_logo(userinfo);
	console.log(logo);
	return {'asda': 'asd'};
}
async function b() {
	var i = await a();
	console.log(i);
}

b()

// var logo = 'http://wx.qlogo.cn/mmopen/PiajxSqBRaEKqqa31ybC79PqVmErpI2QiapLA5yxT9ampXSa1WrDxcTc6AokhZpBBoOvDYFwTJ5aP6Gvtarcib70w/0'.replace(/\/0/,'/64');
// console.log(logo);


// var logo = request('http://wx.qlogo.cn/mmopen/PiajxSqBRaEKqqa31ybC79PqVmErpI2QiapLA5yxT9ampXSa1WrDxcTc6AokhZpBBoOvDYFwTJ5aP6Gvtarcib70w/64')
// .pipe(fs.createWriteStream('logo.jpeg').on('close', function() {
// 	console.log('logo完成');
// 	var qr = qr_image.imageSync('http://weixin.qq.com/q/027920JGB8eZ010000M07Q');
// 	var width = images(qr).width() /2 ;
// 	var height = images(qr).height() /2;
// 	var size = width/2;
// 	var qr_img = images(qr).draw(images('logo.jpeg').size(size),width-size/2,height-size/2).saveAsync('../public/'+'t11est.jpeg',{quality:50},{}, function() {
// 		console.log('haha');
// 	});
// }));

// var temp_qrcode = qr_image.image('http://weixin.qq.com/q/027920JGB8eZ010000M07Q');  
//     temp_qrcode.pipe(require('fs').createWriteStream('qr1.jpeg'));  
// var qr = qr_image.image('http:\/\/wx.qlogo.cn\/mmopen\/PiajxSqBRaEKqqa31ybC79PqVmErpI2QiapLA5yxT9ampXSa1WrDxcTc6AokhZpBBoOvDYFwTJ5aP6Gvtarcib70w\/0');
// qr.pipe(require('fs').createWriteStream('headimg.jpeg'));
//images('http:\/\/wx.qlogo.cn\/mmopen\/PiajxSqBRaEKqqa31ybC79PqVmErpI2QiapLA5yxT9ampXSa1WrDxcTc6AokhZpBBoOvDYFwTJ5aP6Gvtarcib70w\/0').save('../public/headtest.jpeg',{quality: 50});