const xml = require('../utils/xml');
const dao = require('../dao/wechat');
const tools = require('../utils/tools');
const urlencode = require('urlencode');
const STORE = require('../utils/store');
const Store = require('../proxy').Store
const Config = require('../proxy').Config;

exports.getProductById = async (ctx, next) => {
    try{
        if(ctx.session.openid){
            const config = await Config.getConfig();
            const product_id = ctx.params.product;
            console.log(product_id)
            console.log(typeof product_id)
            const store = await Store.getStoreById(product_id);
            await ctx.render('product', {
                url: config.server_host,
                store: store
            });       
        }else{
            const config = await Config.getConfig();
            const r_url = config.server_host + ctx.url.split('?').slice(0,1);
            const url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+ config.appid + '&redirect_uri=' + urlencode(r_url) + '&response_type=code&scope=snsapi_userinfo&state=111#wechat_redirect';
            if(!ctx.query.code){
                ctx.redirect(url);
            }else{
                const code = ctx.query.code;
                let user = await tools.getOauth2Token(code);
                    user = JSON.parse(user);
                if(user.errcode){
                    ctx.redirect(url);
                }else{
                    const product_id = ctx.params.product;
                    console.log(product_id)
                    const store = await Store.getStoreById(product_id);                    
                    let userinfo = await tools.getUserInfo(user.access_token, user.openid);
                        userinfo = JSON.parse(userinfo);
                    ctx.session = userinfo;
                    await ctx.render('product', {
                        url: config.server_host,
                        store: store
                    })
                }    
            }
        }
        
    }catch(e) {
        console.error(e)
    }

}
