const User = require('../proxy').User;
const Order = require('../proxy').Order;
const WXSDK = require('../proxy').WXSDK;
const pay = require('../utils/pay');
const tools = require('../utils/tools');
const moment = require('moment');
const dao = require('../dao/admin');

exports.index = async (ctx)=> {
    let openid = ctx.session.openid;
    ctx.state.data = await User.getUserByOpenId(openid);  
    await ctx.render('user/index');
}

exports.addUserPhone = async (ctx)=> {
    var req = ctx.request.body;
    var config = await dao.getConfig();
    if(config.signup_phone_integral!= null) {
        req.integral = config.signup_phone_integral;
    }
    User.setUserForPhone(req);
    return ctx.body = {
    code :1,msg :'绑定成功'  
    }
}

exports.showGift = async (ctx)=> {
	ctx.state.data = await User.showGift();
	await ctx.render('user/gift');
}

exports.showGiftById = async (ctx)=> {
	let id = ctx.params.id;
	let openid = ctx.session.openid;  
	ctx.state.openid = openid;
	ctx.state.out_trade_no = tools.trade();
	ctx.state.data = await User.showGiftById(openid, id);

	await ctx.render('user/gift_info');
}

exports.showUserOrder = async (ctx)=> {
	await ctx.render('user/order');
}

exports.showUserOrder2 = async (ctx)=> {
	await ctx.render('user/order2');
}

exports.getOrderByStatus = async (ctx)=> {
	let openid = ctx.session.openid;
	let status = ctx.query.status;
	let page = ctx.query.page;
	let size = ctx.query.size;
	var order = await User.getUserOrderForStatusByStatusAndOpenId(openid, status,page,size);
	return ctx.body = order;
}

exports.getOrderInfoById =async (ctx)=> {
	let order_id = ctx.query.id;
	ctx.state.data = await Order.getOneOrderById(order_id);
	return ctx.render('user/order_info');
}

exports.showCode = async (ctx)=> {
    var nonceStr = tools.createRandom();
    var timeStamp = tools.createTimestamp();

    var value = {
        nonceStr: nonceStr,
        timeStamp: timeStamp
    };     
    var jsapi_ticket = await WXSDK.getWeSDK();
    var jsapi_ticket_url = 'http://' + ctx.header.host + ctx.url.split('?').slice(0,1);
    var wxcfg = await pay.setWXConfig(jsapi_ticket, jsapi_ticket_url, value);  
    ctx.state.config = wxcfg; 
    await ctx.render('user/code_qr'); 	
}

exports.getMyQR_Code = async (ctx)=> {
	let token = await WXSDK.getWeAccessToken();
    let json = JSON.stringify({
        "expire_seconds": 3 * 60 *60 *24, 
        "action_name": "QR_STR_SCENE", 
        "action_info": {
            "scene": {
                "scene_str": ctx.session.openid
            }
        }
    });
    var qrurl =  await tools.getQRCode(token, json);
    var userinfo =  ctx.session;    
    var url = await tools.getQrFile(userinfo, qrurl); 
    return ctx.body = {
      url : '/imgs/'+ url + '.jpeg',
      f: true
    }
}

exports.showPartner = async (ctx)=> {
	let openid = ctx.session.openid
	ctx.state.data = await User.getUserByEnentKey(openid);
	ctx.state.data2 = await User.getUserTotalConsume(openid);
    await ctx.render('user/partner');	
}

exports.showService = async (ctx)=> {
    let openid = ctx.session.openid;
    ctx.state.data =  await Order.getOrderForTradeByOpenId(openid);
    ctx.state.openid = openid;
    await ctx.render('user/service');
}

exports.addService = async (ctx)=> {
    let data = ctx.request.body;
    data.create_time = moment().format('YYYY-MM-DD HH:mm:ss');
    User.setService(data);
    return ctx.status = 204;
}

exports.showFAQ = async (ctx)=> {
    ctx.state.data =  await User.getFAQ();
    ctx.state.openid = ctx.session.openid;
    await ctx.render('user/FAQ');
}

exports.showFAQById = async (ctx)=> {
    var id = ctx.params.id;
    ctx.state.data =  await User.getFAQById(id);
    ctx.state.openid = ctx.session.openid;
    await ctx.render('user/FAQ_info');     
}

exports.contactCustomService = async (ctx)=> {
    let openid = ctx.session.openid;
    var token = await WXSDK.getWeAccessToken();
    var kf_account = await tools.customservice_getonlinekflist(token);
    var status = await tools.customservice(token, openid, kf_account);
    if(status.errcode==0&& status.errmsg=='ok'){
    await tools.customSendMsg(token,openid, kf_account);
    }
    ctx.body = status;    
}