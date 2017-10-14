const User = require('../proxy').User;
const dao = require('../dao/wechat');
const pay = require('../utils/pay');
const tools = require('../utils/tools');

exports.showGift = async (ctx)=> {
	ctx.state.data = await User.showGift();
	await ctx.render('user/gift');
}

exports.showGiftById = async (ctx)=> {
	let id = ctx.params.id;  
	ctx.state.data = await User.showGiftById(id);
	await ctx.render('user/gift_info');
}