const wechat = require('../utils/wechat');
const dao = require('../dao/wechat');
const moment = require('moment');

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

    
    console.log(msg);

    let msgType = msg.MsgType[0];
    if(msg.Event){//用户关注
        if(msg.Event[0] == 'subscribe'){
            console.log('用户关注');
            let openid = msg.FromUserName[0];
            if(msg.Ticket){
                //记录用户扫描带参数的二维码
                let userName = openid;
                let ticket = msg.Ticket[0];
                let eventKey = msg.EventKey[0];

                var result = await wechat.getOneSpread(userName, ticket, eventKey);
               
                if(result.length == 0){
                    let data = {
                        userName: userName,//openId
                        ticket: ticket,//二维码ticket
                        eventKey: eventKey, //事件key值           
                        create_time: moment(msg.CreateTime[0] * 1000).format('YYYY-MM-DD HH:mm:ss')
                    }; 
                    wechat.setSpread(data);            
                }
                
            }
            //记录用户首次关注时间
            var result =  await wechat.getOpenIdForSubscribe(openid);
            if(result.length == 0){
                let data = {
                    openid: openid,
                    flag: '1',
                    create_time: moment(msg.CreateTime[0] * 1000).format('YYYY-MM-DD')
                }
                wechat.setOpenIdForSubscribe(data);
            }
        }else if(msg.Event[0] == 'merchant_order') {
            //记录微信小店用户购买产品
            //console.log('进来了');
            let data = {
                openid : msg.FromUserName[0],
                order_id: msg.OrderId[0],
                order_status: msg.OrderStatus[0],
                product_id: msg.ProductId[0],
                sku_info: msg.SkuInfo[0],
                create_time: moment(msg.CreateTime[0] * 1000).format('YYYY-MM-DD HH:mm:ss')
            };
            wechat.setStoreOrder(data);                
        }
    }

    var reMsg;

    console.log(msgType);
    var config = await dao.getConfig();
    console.log(config,'adad');
    switch (msgType) {
          case 'text':
            reMsg = wechat.getTextMessage(msg, config.message_text);
            break;
          case 'image':
            break;
          case 'voice':
            break;
          case 'event':
            reMsg = wechat.getDefaultMessage(msg, config.message_default);

            // switch (msg.Event) {
            //   case 'subscribe':
            //     yield weixin.default(msg)
            //     break;
            //   default:
            //     yield weixin.default(msg)
            //     break;
            // }
            break;
          default:
              reMsg = wechat.getDefaultMessage(msg, config.message_default);
            break;
    }

    console.log("reply message: " + reMsg); 
    return ctx.body = reMsg;
     
};


module.exports = {
	'GET /wechat': checkToken,
	'POST /wechat': postHandle
};
