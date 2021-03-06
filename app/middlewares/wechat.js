const crypto = require('crypto');
const moment = require('moment');
const User = require('../proxy').User;
const WXSDK = require('../proxy').WXSDK;
const wechat = require('../utils/wechat-lib');
const Config = require('../proxy').Config;
const Pay = require('../proxy').Pay;

exports.checkToken = async (ctx, next) => {
    const {token} = await Config.getConfig();
    const {signature, timestamp, nonce} = ctx.query

    // 字典排序
    const arr = [token, timestamp, nonce].sort()
    const tmpStr = arr.join('');
    
    // 排序完成之后,需要进行sha1加密, 这里我们使用node.js 自带的crypto模块
    const resStr = crypto.createHash('sha1').update(tmpStr).digest('hex');
    // console.log(signature, 'resStr: ', resStr);

    // 开发者获得加密后的字符串可与signature对比，标识该请求来源于微信,
    // 如果匹配,返回echoster , 不匹配则返回error
    if (resStr === signature) {
        ctx.body = ctx.query.echostr
    } else {
        return false;
    }
};

exports.postHandle = async(ctx, next) => {
    let msg = ctx.request.body ? ctx.request.body.xml : '';
 
    if (!msg) {
        ctx.body = 'error request.';
        return;
    }
    try {
        var openid = msg.FromUserName[0];
        //获取用户信息
        var userinfo = await WXSDK.handle('fetchUserInfo', openid)        
        //保存用户信息
        await User.updateUser(userinfo)
        ctx.session = userinfo;
        
        if(msg.Event[0] == 'subscribe'){//用户关注                
            if(msg.Ticket){
                if(msg.EventKey[0].replace(/^qrscene_/,"") != openid){//自己扫描自己不算
                    //记录用户扫描带参数的二维码
                    var eventKey = msg.EventKey[0].replace(/^qrscene_/,"");
                    //修改用户备注
                    await WXSDK.handle('remarkUser',openid, eventKey);
                    userinfo.eventKey= eventKey,
                    //修改用户
                    User.updateUser(userinfo)
                }                
            }
        }else if(msg.Event[0] == 'unsubscribe'){//取消关注
            User.removeUserForEventKeyByOpenid(openid);
        }

        var reMsg;

        let msgType = msg.MsgType[0];

        switch (msgType) {
              case 'text':
                reMsg = wechat.transfer2CustomerService(msg);
                break;
              case 'image':
                reMsg = wechat.transfer2CustomerService(msg);
                break;
              case 'voice':
                reMsg = wechat.transfer2CustomerService(msg);
                break;
              case 'event':
                var config = await Config.getConfig();
                switch (msg.Event[0]) {

                  case 'subscribe':
                    msg.MsgType = 'text';
                    reMsg = wechat.getTextMessage(msg, config.message_text);
                    break;

                  case 'TEMPLATESENDJOBFINISH':
                    reMsg = await wechat.getTextMessage(msg);
                    break;

                  case 'kf_create_session':
                    reMsg = wechat.transfer2CustomerService(msg);
                    break;
                  case 'SCAN':
                    msg.MsgType = 'text';
                    reMsg = wechat.transfer2CustomerService(msg);
                    break;
                  default:
                    reMsg = wechat.getTextMessage(msg, config.message_text);
                    break;
                }

                break;

              default:
                  reMsg = wechat.transfer2CustomerService(msg);
                break;
        }

        console.log("reply message: " + reMsg); 
        return ctx.body = reMsg;
    }catch(e) {
        console.error(e)
        return ctx.body = 'error request.';
    }
     
};

exports.signature = async (ctx)=> {
    let url = decodeURIComponent(ctx.query.url);
    if(!url) ctx.throw(404)

    try {
        let data = await WXSDK.getSignatureAsync(url)
        const config = await Config.getConfig();
        data.appid = config.appid
        ctx.body = {
            success: true,
            data: data
        }    
    }catch(e) {
        console.error(e)
        ctx.body = {
            success: false,
            data: {}
        }
    }
}

exports.pay = async (ctx)=> {
    const ip = ctx.ip.match(/\d+.\d+.\d+.\d+/)[0];
    const {store_name, total_fee} = ctx.request.body
    const openid = ctx.session.openid
    const out_trade_no = Date.now()
    try {
        const order = {
            body: store_name,
            attach: store_name,
            out_trade_no: out_trade_no,
            total_fee: total_fee * 100,
            spbill_create_ip: ip,
            openid: openid,
            trade_type: 'JSAPI'
        }
        const config = await Config.getConfig()
        
        const data = await Pay.getBrandWCPayRequestParams(config)(order)
        
        data.out_trade_no = out_trade_no
        ctx.body = data;
    }catch(e) {
        console.error(e)
        ctx.body = {}
    }
}
