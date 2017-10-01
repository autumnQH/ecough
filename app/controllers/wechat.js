const wechat = require('../utils/wechat');
const dao = require('../dao/wechat');
const moment = require('moment');
const urlencode = require('urlencode');
const tools = require('../utils/tools');

var checkToken = async (ctx, next) => {
    let result = await wechat.auth(ctx);
    if (result) {
        ctx.body = ctx.query.echostr
    } else {
        return false;
    }
};

var postHandle = async(ctx, next) => {
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
                data.flag= '1'
                wechat.setUser(data);
            }else{
                //修改用户
                wechat.updateUser(data, {openid: openid});                                 
            }
                
            if(msg.Ticket){
                if(msg.EventKey[0].replace(/^qrscene_/,"") != openid){//自己扫描自己不算
                    //记录用户扫描带参数的二维码
                    var eventKey = msg.EventKey[0];
                    //修改用户备注
                    tools.updateremark(token, openid, eventKey);                       
                    data.eventKey= eventKey,
                    //修改用户
                    wechat.updateUser(data, {openid: openid});
                    
                }                
            }
        //如果已经关注，但是扫描了其他人的二维码
        }else if(msg.Event[0] == 'SCAN') {
            if(msg.EventKey[0].replace(/^qrscene_/,"") != openid){//自己扫描自己不算
                var eventKey = msg.EventKey[0];
                //修改用户备注
                tools.updateremark(token, openid, eventKey);
                data.eventKey= eventKey;               
                //修改用户
                wechat.updateUser(data, {openid: openid});                
            }
        }else if(msg.Event[0] == 'VIEW'){//每次点击菜单都更新用户信息
            //修改用户
            wechat.updateUser(data, {openid: openid});                               
        }
        //else if(msg.Event[0] == 'merchant_order') {
        //     //记录微信小店用户购买产品
        //     //console.log('进来了');
        //     let data = {
        //         openid : msg.FromUserName[0],
        //         order_id: msg.OrderId[0],
        //         order_status: msg.OrderStatus[0],
        //         product_id: msg.ProductId[0],
        //         sku_info: msg.SkuInfo[0],
        //         create_time: moment(msg.CreateTime[0] * 1000).format('YYYY-MM-DD HH:mm:ss')
        //     };
        //     wechat.setStoreOrder(data);                
        // }
    }

    var reMsg;


    switch (msgType) {
          case 'text':
            reMsg = wechat.transfer2CustomerService(msg);
            //reMsg = wechat.getTextMessage(msg, config.message_text);
            break;
          case 'image':
            reMsg = wechat.transfer2CustomerService(msg);
            break;
          case 'voice':
            reMsg = wechat.transfer2CustomerService(msg);
            break;
          case 'event':

            //reMsg = wechat.getDefaultMessage(msg, config.message_default);
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

              default:
                msg.MsgType = 'text';
                reMsg = wechat.getTextMessage(msg, config.message_text);
                break;
            }

            break;

          default:
              //reMsg = wechat.getDefaultMessage(msg, config.message_default);
              reMsg = wechat.transfer2CustomerService(msg);
            break;
    }

    console.log("reply message: " + reMsg); 
    return ctx.body = reMsg;
     
};


module.exports = {
	'GET /wechat': checkToken,
	'POST /wechat': postHandle
};
