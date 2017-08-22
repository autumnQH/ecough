const request = require('request');
const xml = require('../utils/xml');
const wechat = require('../utils/wechat');
const dao = require('../dao/wechat');
const config = require('../config/config');
const tools = require('../utils/tools');

var getAddress = async (ctx, next) => {
	ctx.state = {
	    title: 'hello koa2'
  	};
	await ctx.render('address', {});
};

var get_logistics = async (ctx, next) => {
    ctx.state = {
        title: 'hello koa2'
    };
    await ctx.render('logistics', {});
};


var getProduct= async (ctx, next) => {
    await ctx.render('product', {});
};

var getProblem= async (ctx, next) => {
    ctx.state = {
        title: 'hello koa2'
    };
    await ctx.render('problem', {});
};

var getPlay = async (ctx, next)=>{
    var token = await dao.getActiveAccessToken();
    var jsapi_ticket =  await dao.getJsapiTicket();
    var url = ctx.header['x-forwarded-proto']+'://' +ctx.host+ctx.url;
    var data = await wechat.signature(jsapi_ticket, url);
    var signature = data.signature;

    await ctx.render('hello',{
        appId: config.wx.appid,
        timestamp: data.timestamp,
        nonceStr: data.nonceStr,
        signature: signature,
        random: tools.createRandom(32)
    });
};

var getOrder = async (ctx, next) => {
    
    ctx.render('order');
};


var postOrder = async(ctx, next) => {
    console.log('codeode');
    let code = ctx.params['code'];
    console.log(code);
    console.log(msg,'页面授权！！');
};

module.exports = {
	'GET /my/address': getAddress,
    'GET /my/problem': getProblem,
    'GET /my/logistics': get_logistics,
    'GET /product/100001': getProduct,
    'POST /product/100001': getProduct,
    'GET /my/order': getOrder,
    'POST /my/order': postOrder,
    'GET /play': getPlay,
    'POST /play': getPlay
};