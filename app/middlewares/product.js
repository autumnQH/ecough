const xml = require('../utils/xml');
const dao = require('../dao/wechat');
const tools = require('../utils/tools');
const urlencode = require('urlencode');
const STORE = require('../utils/store');

exports.getProductById = async (ctx, next) => {
    const config = await dao.getConfig();
    var product_id = ctx.params.product;
    var store = await STORE.getStoreById(product_id);
    
    store.sku_attr = store.sku_attr.split(',');
    store.sku_info = store.sku_info.split(',').map(function(val, index, arr) {
        var newarr = val.split(':');
        return {specifications: newarr[0], price: newarr[1], ori_price: newarr[2], repertory: newarr[3], qr: newarr[4]}; 
    });
       // return await ctx.render('product', {
       //      userinfo: {openid: 'asd'},
       //      store: store
       //  }); 
    var r_url = config.server_host + ctx.url.split('?').slice(0,1);
    
    var url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+ config.appid + 
        '&redirect_uri=' + urlencode(r_url) + '&response_type=code&scope=snsapi_userinfo&state=111#wechat_redirect';


    if(ctx.session.openid){
        await ctx.render('product', {
            userinfo: ctx.session,
            store: store
        });       
    }else{
        if(!ctx.query.code){
            ctx.redirect(url);
        }else{
            let code = ctx.query.code;
            var user = await tools.getOauth2Token(code);
                user = JSON.parse(user);
            if(user.errcode){
                console.log(user.errcode);
                ctx.redirect(url);
            }else{
                var userinfo = await tools.getUserInfo(user.access_token, user.openid);
                    userinfo = JSON.parse(userinfo);
                ctx.session = userinfo;
                await ctx.render('product', {
                    userinfo: userinfo,
                    store: store
                })
            }    
        }
    }

}
