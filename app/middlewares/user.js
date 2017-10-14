const User = require('../proxy').User;
const dao = require('../dao/wechat');
const pay = require('../utils/pay');
const tools = require('../utils/tools');

exports.showGift = async (ctx)=> {
	var a = await User.showGift();
	ctx.state.data = a;
	console.log(a)
	await ctx.render('user/gift');
}

exports.showGiftById = async (ctx)=> {
	let id = ctx.params.id;
	var jsapi_ticket = await dao.getJsapiTicket();
  var url = 'http://' + ctx.header.host + ctx.url.split('?').slice(0,1);
  var nonceStr = tools.createRandom();
  var timeStamp = tools.createTimestamp();
  var out_trade_no = tools.trade();
  var value = {
      nonceStr: nonceStr,
      timeStamp: timeStamp,
      out_trade_no: out_trade_no
  };  
  
	ctx.state.data = await User.showGiftById(id);
	var wxconfig = await pay.setWXConfig(jsapi_ticket, url, value);
	ctx.state.config = wxconfig;
	console.log(wxconfig);
	await ctx.render('user/gift_info');
}