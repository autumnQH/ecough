var getAddress = async (ctx, next) => {
	ctx.state = {
	    title: 'hello koa2'
  	};
	await ctx.render('address', {});
};


var getOrder = async (ctx, next) => {
    ctx.state = {
        title: 'hello koa2'
    };
    await ctx.render('order', {});
};

var get_logistics = async (ctx, next) => {
    ctx.state = {
        title: 'hello koa2'
    };
    await ctx.render('logistics', {});
};


var getProduct= async (ctx, next) => {
    ctx.state = {
        title: 'hello koa2'
    };
    console.log("test1111-------------")
    console.log(ctx)
    // ctx.compress = true
    // ctx.set('Content-Type', 'text/plain')
    await ctx.render('product', {});
};

var getProblem= async (ctx, next) => {
    ctx.state = {
        title: 'hello koa2'
    };
    await ctx.render('problem', {});
};

module.exports = {
	'GET /my/address': getAddress,
    'GET /my/problem': getProblem,
    'GET /my/logistics': get_logistics,
    'GET /product/100001': getProduct,
    'POST /product/100001': getProduct,
    'GET /my/order': getOrder
};