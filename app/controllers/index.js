var getIndex = async (ctx, next) => {
	ctx.state = {
	    title: 'hello koa2'
  	};

	await ctx.render('index', {});
};

// module.exports = {
// 	'GET /': getIndex,
// 	'GET /index': getIndex
// };