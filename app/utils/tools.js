const moment = require('moment');
const config = require('../config/config');
const request = require('request');

//随机串
exports.createNonceStr = function() {
	return Math.random().toString(36).substr(2, 15);
}

//时间戳
exports.createTimestamp = function() {
	return parseInt(new Date().getTime() / 1000) + '';
}

//随机字符串
exports.createRandom = function(len) {
		len = len || 32;
　　var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
　　var maxPos = $chars.length;
　　var pwd = '';
　　for (i = 0; i < len; i++) {
　　　　pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
　　}
　　return pwd;
}

//拼接字符串
exports.raw = function(args){
      var keys = Object.keys(args);
      keys = keys.sort();
      var newArgs = {};
      keys.forEach(function(key) {
          newArgs[key.toLowerCase()] = args[key];
      });

      var string = '';
      for(var k in newArgs) {
          string += '&' + k + '=' + newArgs[k];
      }
      string = string.substr(1);
      return string;
}

exports.trade = function() {
  return moment().format('YYYY-MM-DD HH:mm:ss').replace(/\D/g,'')+ Math.floor(Math.random()*100);
}

//网页授权
exports.getToken = async function (code) {
    let options = {
        method: 'get',
        url: 'https://api.weixin.qq.com/sns/oauth2/access_token?appid='+ config.weixin.appid +'&secret='+ config.weixin.appSecret +'&code='+ code +'&grant_type=authorization_code',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }       
    };

    return new Promise(function (resolve, reject){
        request(options, function(err, res, body) {
            if(body){
                return resolve(body);
            }else{
                return reject(err);
            }
        });
    }); 
}

//拉取用户信息
exports.getUserInfo = function (AccessToken, openid) {
    let options ={
        method: 'get',
        url: 'https://api.weixin.qq.com/sns/userinfo?access_token='+ AccessToken+'&openid='+ openid+'&lang=zh_CN',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
    };

    return new Promise((resolve, reject)=>{
        request(options, function(err, res, body) {
            if(bod){
                return resolve(body);
            }else{
                return reject(err);
            }
        });
    });  
}

//统一下单
exports.getPackge = function (xml) {
  let options = {
    url: 'https://api.mch.weixin.qq.com/pay/unifiedorder',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    method: 'post',
    form: xml
  };

  return new Promise(function(resolve, reject) {
    request(options, function(err, res, body) {
      if(body){
        return resolve(body);
      }else{
        return reject(err);
      }
    });
  });
}
