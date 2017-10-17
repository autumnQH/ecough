const User = require('../proxy').User;
const dao = require('../dao/wechat');
const pay = require('../utils/pay');
const tools = require('../utils/tools');

exports.showOrder = async (ctx)=> {
	let openid = ctx.session.openid
	let id = ctx.query.id;
	ctx.state.openid = openid;
	ctx.state.out_trade_no = tools.trade();
	ctx.state.data = await User.showGiftById(openid,id);
	console.log(await User.showGiftById(openid,id));
 	await ctx.render('common/order');
}

exports.showGift = async (ctx)=> {
	ctx.state.data = await User.showGift();
	await ctx.render('user/gift');
}

exports.showGiftById = async (ctx)=> {
	let id = ctx.params.id;
	let openid = ctx.session.openid;  
	ctx.state.data = await User.showGiftById(openid, id);
	await ctx.render('user/gift_info');
}

exports.getOrderByStatus = async (ctx)=> {
	let openid = ctx.session.openid;
	let status = ctx.query.status;
	let page = ctx.query.page;
	let size = ctx.query.size;
	openid = 'o5Yi9wOfXWopOcMYiujWBZmwBH0Q';
	var order = await User.getUserOrderForStatusByStatusAndOpenId(openid, status,page,size);
	console.log(order);
	return ctx.body = order;
}