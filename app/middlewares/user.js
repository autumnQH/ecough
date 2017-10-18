const User = require('../proxy').User;
const Order = require('../proxy').Order;
const dao = require('../dao/wechat');
const pay = require('../utils/pay');
const tools = require('../utils/tools');

exports.index = async (ctx)=> {
  ctx.state.data = await User.getUserByOpenId(ctx.session.openid);  
  await ctx.render('user/index');
}

exports.showOrder = async (ctx)=> {
	let openid = ctx.session.openid
	let id = ctx.query.id;
	ctx.state.openid = openid;
	ctx.state.out_trade_no = tools.trade();
	ctx.state.data = await User.showGiftById(openid,id);
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

exports.showUserOrder = async (ctx)=> {
	await ctx.render('user/order');
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