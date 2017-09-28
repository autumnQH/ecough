module.exports = {
	checkAdmin: async(ctx, next)=> {
		if(!ctx.session.admin){
		  ctx.session.referer = '/admin'
		  if(ctx.url != '/sign'){
		    ctx.session.referer = ctx.url;
		  }
			return ctx.redirect('/sign');
		}
		await next();
	}
}