const crypto = require('crypto');
const request = require('request');
const tools = require('./tools');
const mysql = require('./mysql');
const dao = require('../dao/wechat');
const fs = require('fs');
const qr_image = require('qr-image');  
const images = require('images');
const xml = require('./xml');
const _ = require('lodash');

exports.auth = async (ctx) => {
    const config = await dao.getConfig();
    let token = config.token;
    let signature = ctx.query.signature;
    let timestamp = ctx.query.timestamp;
    let nonce = ctx.query.nonce;

    //console.log("token: %s, timestamp: %s, nonce: %s", signature, timestamp, nonce);   
    
    // 字典排序
    const arr = [token, timestamp, nonce].sort()
    var tmpStr = arr.join('');
    
    // 排序完成之后,需要进行sha1加密, 这里我们使用node.js 自带的crypto模块
    var sha1 = crypto.createHash('sha1');
    sha1.update(tmpStr);
    var resStr = sha1.digest('hex');
    //console.log(signature, 'resStr: ', resStr);

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


exports.getImageMessage = async (msg) => {
    const token = await dao.getActiveAccessToken();
    let json = JSON.stringify({
        "expire_seconds": 60480, 
        "action_name": "QR_STR_SCENE", 
        "action_info": {
            "scene": {
                "scene_str": msg.FromUserName[0]
            }
        }
    });
    var qrurl =  await tools.getQRCode(token, json);
    // console.log(qrurl,'qrurl');
    // dao.setQRCode(_.assign(qrurl, JSON.parse(json)));
    // console.log(_.assign(qrurl, JSON.parse(json)),'assign');
    var userinfo =  await tools.getUserInfo2(token, msg.FromUserName[0]);
    var data =  await tools.uploadFile(userinfo, token, qrurl);
    return xml.jsonToXml({
        xml: {
            ToUserName: msg.FromUserName,
            FromUserName: msg.ToUserName,
            CreateTime: Date.now(),
            MsgType: 'image',
            Image: {
                MediaId: data.media_id
            }
        }
    });
}

exports.getIntegral = async(msg) => {
    return xml.jsonToXml({
        xml: {
            ToUserName: msg.FromUserName,
            FromUserName: msg.ToUserName,
            CreateTime: Date.now(),
            MsgType: 'text',
            Content: '2'
        }
    })
}

exports.getJsApiTicket = () => {
    return dao.getJsapiTicket();
}
exports.getQRCode = () => {
    return dao.getQRCode();
}

exports.setQRCode = (data) => {
    return dao.setQRCode(data);
}

exports.customUpdateUser = (openid)=> {
    return dao.customUpdateUser(openid);
}

exports.getUser = () => {
    return dao.getUser();
}

exports.updateUser = (data, value)=> {
    return dao.updateUser(data, value);
}

exports.getOneUser = (openid) => {
    return dao.getOneUser(openid);
}

exports.setUser = (data) => {
    return dao.setUser(data);
}

exports.getOrder = () => {
    return dao.getOrder();
}

exports.setOrder = (data) => {
    return dao.setOrder(data);
}

exports.setStoreOrder = (data) => {
    return dao.setStoreOrder(data);
}


