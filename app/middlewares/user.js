const User = require('../proxy').User;
const dao = require('../dao/wechat');
const pay = require('../utils/pay');
const tools = require('../utils/tools');

exports.showOrder = async (ctx)=> {
	ctx.state.openid = ctx.session.openid;
	ctx.state.product = ctx.query.product;
	ctx.state.specifications = ctx.query.specifications;
	ctx.state.out_trade_no = tools.trade();
	console.log(ctx.session.openid);
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