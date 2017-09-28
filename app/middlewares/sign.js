const crypto = require('crypto');

exports.showSignIn = async (ctx)=> {
	await ctx.render('signin');
}

exports.SignIn = async (ctx) => {
  var admin = ctx.request.body;
  var name = admin.name;
  var password = admin.password;
  var admin = {
      admin: {
          name: name,
          password: password
      }
  }
  var pwd = crypto.createHash('md5').update(password,'utf8').digest('hex').toUpperCase();
  if(name ==='root' && pwd ==='448C734BAB346602663CF807DAA5EB2B'){
      ctx.session.admin = admin;
     await ctx.redirect(ctx.session.referer);
  }else{
     await ctx.redirect('back');
  }	
}