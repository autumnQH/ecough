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
            let openid = msg.FromUserName[0];

            if(msg.Ticket){
                //记录用户扫描带参数的二维码
                let openid = openid;
                let ticket = msg.Ticket[0];
                let eventKey = msg.EventKey[0];

                //var result = await wechat.getOneSpread(openid, ticket, eventKey);
                var result = await wechat.getOneSpread(openid);
                

                //如果未关注，则记录
                if(result.length == 0){
                    let data = {
                        openid: openid,//openId
                        ticket: ticket,//二维码ticket
                        eventKey: eventKey, //事件key值           
                        create_time: moment(msg.CreateTime[0] * 1000).format('YYYY-MM-DD HH:mm:ss')
                    }; 
                    wechat.setSpread(data); 
                //如果之前关注。又扫描二维码。            
                }else{
                    let data = {
                        ticket: ticket,
                        eventKey: eventKey,
                        create_time: moment(msg.CreateTime[0] * 1000).format('YYYY-MM-DD HH:mm:ss')
                    };
                    dao.updateSpread(data, {openid: openid});
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
        //如果已经关注，但是扫描了其他人的二维码
        }else if(msg.Event[0] == 'SCAN') {
            let openid = msg.FromUserName[0];
            let ticket = msg.Ticket[0];
            let eventKey = msg.EventKey[0];
            let create_time = moment(msg.CreateTime[0] * 1000).format('YYYY-MM-DD HH:mm:ss');
            let data = {
                ticket: ticket,
                eventKey: eventKey,
                create_time: create_time
            };
            dao.updateSpread(data, {openid: openid});

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
    switch (msgType) {
          case 'text':
            reMsg = wechat.getTextMessage(msg, config.message_text);
            break;
          case 'image':
            break;
          case 'voice':
            break;
          case 'event':
            //reMsg = wechat.getDefaultMessage(msg, config.message_default);
            switch (msg.Event[0]) {
              case 'subscribe':
                msg.MsgType = 'text';
                reMsg = wechat.getTextMessage(msg, config.message_text);
                break;
              default:
                reMsg = wechat.getDefaultMessage(msg, config.message_default);
                break;
            }
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
