const wechat = require('../utils/wechat');
const config = require('../config/config');

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
    var reMsg;

    console.log(msgType);

    switch (msgType) {
          case 'text':
            reMsg = wechat.getTextMessage(msg, config.wx.message.text);
            break;
          case 'image':
            break;
          case 'voice':
            break;
          case 'event':
            reMsg = wechat.getDefaultMessage(msg, config.wx.message.default);

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
            reMsg = wechat.getDefaultMessage(msg, config.wx.message.default);
            break;
    }

    console.log("reply message: " + reMsg); 
    ctx.body = reMsg;
     
};


module.exports = {
	'GET /wechat': checkToken,
	'POST /wechat': postHandle
};
