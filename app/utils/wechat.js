const crypto = require('crypto');
const config = require('../config/config');
const request = require('request');
const xml = require("./xml");
const tools = require('./tools');
const mysql = require('./mysql');
const moment = require('moment');

exports.auth = async (ctx) => {
    let token = config.wx.token;
    let signature = ctx.query.signature;
    let timestamp = ctx.query.timestamp;
    let nonce = ctx.query.nonce;

    console.log("token: %s, timestamp: %s, nonce: %s", signature, timestamp, nonce);   
    
    // 字典排序
    const arr = [token, timestamp, nonce].sort()
    var tmpStr = arr.join('');
    
    // 排序完成之后,需要进行sha1加密, 这里我们使用node.js 自带的crypto模块
    var sha1 = crypto.createHash('sha1');
    sha1.update(tmpStr);
    var resStr = sha1.digest('hex');
    console.log(signature, 'resStr: ', resStr);

    // 开发者获得加密后的字符串可与signature对比，标识该请求来源于微信,
    // 如果匹配,返回echoster , 不匹配则返回error
    if (resStr === signature) {
        return true;
    } else {
        return false;
    }
}

exports.createMenu = async (menu, token) => {
    let options = {
        url: 'https://api.weixin.qq.com/cgi-bin/menu/create?access_token=' + token,
        form: JSON.stringify(require(menu)),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
    };

    request.post(options, function (err, res, body) {
        if (err) {
          console.log(err);
        }else {
          console.log(body);
        }
    })
  
}

exports.getTextMessage = (msg, content) => {

        return xml.jsonToXml({
            xml: {
                ToUserName: msg.FromUserName,
                FromUserName: msg.ToUserName,
                CreateTime: Date.now(),
                MsgType: msg.MsgType,
                Content: content
            }
        })
}
 
exports.getDefaultMessage = (msg, content) => {
        return xml.jsonToXml({
            xml: {
                ToUserName: msg.FromUserName,
                FromUserName: msg.ToUserName,
                CreateTime: Date.now(),
                MsgType: msg.MsgType,
                Content: content
            }
        })
}

//js-sdk签名
exports.signature = async (jsapi_ticket, url) => {
    var ret = {
        jsapi_ticket: jsapi_ticket,
        nonceStr: tools.createNonceStr(),
        timestamp: tools.createTimestamp(),
        url: url
    };
    var str = tools.raw(ret);

    var resStr = crypto.createHash('sha1').update(str).digest('hex');
    console.log( 'resStr: ', resStr);
    return {signature:resStr, nonceStr: ret.nonceStr, timestamp: ret.timestamp};
}

//网页授权token
exports.getAuthToken = async function(code, cb) {
    console.log(typeof code);
    let options = {
        url: 'https://api.weixin.qq.com/sns/oauth2/access_token?appid='+ config.wx.appid +'&secret='+ config.wx.appid +'&code='+ code +'&grant_type=authorization_code'
    };

    request.get(options, function(err, res, body) {
        if(err){
            console.error(err);
        }
       if(res && res.statusCode === 200){
        var data = JSON.parse(body);;
        data.create_time = moment().format('YYYY-MM-DD HH:mm:ss');
        mysql.add('T_WECHAT_TOKEN_AUTH', data);
        cb(data.openid);
       }
    });
}

exports.paySign = async function(key) {
    var ret = {
        appid: config.wx.appid,
        mch_id: config.wx.mchid,
        device_info: 'WEB',
        body: 'Test',
        nonce_str: tools.createRandom()
    };
    var str1 = tools.raw(ret);
    str1 += '&key='+ key;
    var sign = crypto.createHash('md5').update(str1, 'utf8').digest('hex').toUpperCase();
    return sign;
}