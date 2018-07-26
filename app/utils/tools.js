const moment = require('moment');
const Config = require('../proxy').Config
const request = require('request');
const fs = require('fs');
var qr_image = require('qr-image');  
var images = require('images');
var xml = require('./xml');
var qr = require('./qr');
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
          newArgs[key] = args[key];
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

//网页授权获取access_token
exports.getOauth2Token = async function (code) {
    const config = await Config.getConfig();
    let options = {
        method: 'get',
        url: 'https://api.weixin.qq.com/sns/oauth2/access_token?appid='+ config.appid +'&secret='+ config.appSecret +'&code='+ code +'&grant_type=authorization_code',
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

//非网页获取用户信息
exports.getUserInfo2 = function(token, openid) {
    let options ={
        method: 'get',
        url: 'https://api.weixin.qq.com/cgi-bin/user/info?access_token='+token+'&openid='+openid+'&lang=zh_CN',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
    };
    return new Promise((resolve, reject)=> {
      request(options, function(err, res, body) {
        if(body){
          return resolve(JSON.parse(body));
        }else{
          return reject(JSON.parse(err));
        }
      });
    });
}
//网页获取用户信息
exports.getUserInfo = function (AccessToken, openid) {
    let options ={
        method: 'get',
        url: 'https://api.weixin.qq.com/sns/userinfo?access_token='+ AccessToken+'&openid='+ openid+'&lang=zh_CN',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
    };
    return new Promise((resolve, reject)=> {
        request(options, function(err, res, body) {
            if(body){
                return resolve(body);
            }else{
                return reject(err);
            }
        });
    });  
}

exports.getQrFile = async function(userinfo, url) {
  var q=  await qr.qr(userinfo);
  var logo = await qr.qr_logo(userinfo, url);
  return userinfo.openid;
}



exports.formatDate = (date)=> {
  return moment(new Date(date)).format('YYYY-MM-DD HH:mm:ss')
}
