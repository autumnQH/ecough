const moment = require('moment');
const dao = require('../dao/wechat');
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
    const config = await dao.getConfig();
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

//创建二维码
exports.getQRCode = function(token, json) {
  let options = {
    url: 'https://api.weixin.qq.com/cgi-bin/qrcode/create?access_token=' + token,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    method: 'post',
    form: json
  };

  return new Promise(function(resolve, reject) {
    request(options, function(err, res, body) {
      if(body){
        return resolve(JSON.parse(body));
      }else{
        return reject(JSON.parse(err));
      }
    });
  });
}

exports.getQRCodeImg = function(ticket) {
  let options = {
    url: 'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket='+ ticket,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    method: 'get'
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

//上传临时素材
// exports.uploadFile = async function(userinfo,token, qrurl){
//   var q=  await qr.qr(userinfo);
//   var logo = await qr.qr_logo(userinfo, qrurl);
//   let formData = {
//     custom_file: {
//       value:  fs.createReadStream(__dirname+'/'+ userinfo.openid+'.jpeg'),
//       options: {
//         contentType: 'image/jpeg'
//       }
//     }
//   }; 
//   return new Promise(function(resolve, reject) {
//     request.post({url:'http://file.api.weixin.qq.com/cgi-bin/media/upload?access_token='+ token +'&type=image', formData: formData}, function optionalCallback(err, httpResponse, body) {
//       if (body) {
//         fs.unlinkSync(__dirname+'/'+userinfo.openid+ '.jpeg');
//         fs.unlinkSync(__dirname+'/'+userinfo.openid+ 'logo.jpeg');
//         return resolve(JSON.parse(body))
//       }else{        
//         return reject(JSON.parse(err));
//       }
//     });
//   });
// };

exports.getQrFile = async function(userinfo, qrurl) {
  var q=  await qr.qr(userinfo);
  var logo = await qr.qr_logo(userinfo, qrurl);
  return userinfo.openid;
}

//设置用户备注
exports.updateremark = (token, openid, remark) => {
  let data = JSON.stringify({
    'openid': openid,
    'remark': remark
  });
  return new Promise(function(resolve, reject) {
    request.post({
      url: 'https://api.weixin.qq.com/cgi-bin/user/info/updateremark?access_token='+ token,
      form: data
    }, function(err, res, body) {
      if(body){
        return resolve(JSON.parse(body));
      }else{
        return reject(JSON.parse(err));
      }
    });
  });
}

//发送模版消息
exports.sendTemplateMessage = async (openid,orderMoneySum,orderProductName) => {
  var token = await dao.getActiveAccessToken();
  var config = await dao.getConfig();
  let json = JSON.stringify({
    touser: openid,
    template_id: 'eE2JhSjiUnLB6cQQm23RckRhj57T0HCTBXUERRSeqPs',
    url: config.server_host+'/users/my/order',
    topcolor: "#FF0000",
    data: {
      first :{
        value: config.template_title
      },
      orderMoneySum: {
        value: '¥'+orderMoneySum
      },
      orderProductName: {
        value: orderProductName
      },
      Remark: {
        value: config.template_remake
      }
    }
  });  
  let options = {
    url: 'https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=' + token,
    method: 'post',
    body: json
  };
  return new Promise(function(resolve, reject) {
    request(options, function(err, res, body) {
      if(body){
        return resolve(JSON.parse(body));
      }else{
        return reject(JSON.parse(err));
      }
    });   
  });
}

exports.customservice_getonlinekflist = async () => {
  var token = await dao.getActiveAccessToken();
  return new Promise(function(resolve, reject) {
    request({
      url: 'https://api.weixin.qq.com/cgi-bin/customservice/getonlinekflist?access_token='+ token
    }, function(err, res, body) {
      if(body){
        body = JSON.parse(body);
        if(body.kf_online_list.length==0){
          return resolve('null');
        }else{        
          body.kf_online_list.forEach(function(val, index, arr) {
            if(val.status ==1){
              return resolve(val.kf_account);
            }else{
              return resolve(val.kf_account);
            }
          });
        }
      }else{
        return reject(JSON.parse(err));
      }
    });
    
  });

}

//客服-创建会话
exports.customservice = async (openid) =>{
  var token = await dao.getActiveAccessToken();
  var kf_account = await this.customservice_getonlinekflist();
  let json = JSON.stringify({
    kf_account: kf_account,
    openid: openid
  });
  let options = {
    url: 'https://api.weixin.qq.com/customservice/kfsession/create?access_token='+token,
    method: 'post',
    body: json,
  };
  return new Promise(function(resolve, reject) {
    request(options, function(err, res, body) {
      if(body){
        return resolve(JSON.parse(body));    
      }else{
        return reject(JSON.parse(err));
      }
    });
    
  });  
}

exports.formatDate = (date)=> {
  return moment(new Date(date)).format('YYYY-MM-DD HH:mm:ss')
}