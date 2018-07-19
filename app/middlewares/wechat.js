const User = require('../proxy').User;
const WXSDK = require('../proxy').WXSDK;
const tools = require('../utils/tools');
const pay = require('../utils/pay');
const xml = require('../utils/xml');
const wechat = require('../utils/wechat');
const dao = require('../dao/wechat');
const moment = require('moment');

exports.checkToken = async (ctx, next) => {
    let result = await wechat.auth(ctx);
    if (result) {
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

    var config = await dao.getConfig();
    var token = await dao.getActiveAccessToken();
    var openid = msg.FromUserName[0];
    var userinfo = await tools.getUserInfo2(token,openid);
    var data = {
        openid: openid,
        create_time: moment(msg.CreateTime[0] * 1000).format('YYYY-MM-DD HH:mm:ss'),
        headimgurl: userinfo.headimgurl,
        nick: userinfo.nickname
    };
    console.log(msg);
    
    let msgType = msg.MsgType[0];
    if(msg.Event){
        if(msg.Event[0] == 'subscribe'){//用户关注
                //记录用户关注信息
            var result =  await wechat.getOneUser(openid);

            if(result.length == 0){
                wechat.setUser(data);
            }else{
                //修改用户
                wechat.updateUser(data, {openid: openid});                                 
            }
                
            if(msg.Ticket){
                if(msg.EventKey[0].replace(/^qrscene_/,"") != openid){//自己扫描自己不算
                    //记录用户扫描带参数的二维码
                    var eventKey = msg.EventKey[0].replace(/^qrscene_/,"");
                    //修改用户备注
                    tools.updateremark(token, openid, eventKey);                       
                    data.eventKey= eventKey,
                    //修改用户
                    wechat.updateUser(data, {openid: openid});
                    
                }                
            }
        }else if(msg.Event[0] == 'unsubscribe'){//取消关注
            //User.removeUserByOpenId(openid);
            User.removeUserForEventKeyByOpenid(openid);
        }
    }

    var reMsg;


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
     
};


exports.sdk = async (ctx)=> {
    let url = decodeURIComponent(ctx.query.url);
    var SDK = await WXSDK.getWeSDK();
    var nonceStr = tools.createRandom();
    var timeStamp = tools.createTimestamp();

    var value = {
        nonceStr: nonceStr,
        timeStamp: timeStamp
    };
    var wxcfg = await pay.setWXConfig(SDK, url, value); 
    ctx.body = wxcfg;   
}

exports.pay = async (ctx)=> {
    var ip = ctx.ip.match(/\d+.\d+.\d+.\d+/)[0];
    var body = ctx.request.body;
    var { openid, store_name, total_fee} = body
    var value = {
        nonceStr: tools.createRandom(),
        timeStamp: tools.createTimestamp(),
        out_trade_no: tools.trade()
    };
    total_fee = total_fee * 100;
	var page = await pay.setPackageData(openid, 1, value, store_name, ip);
    
    var res = await tools.getPackge(page);//发起统一下单
    var result = await xml.xmlToJson(res);//解析统一下单返回的xml数据

    var prepayid = result.xml.prepay_id[0];
    var data2 = await pay.setPaySign(prepayid, value);
    ctx.body = data2;
}
