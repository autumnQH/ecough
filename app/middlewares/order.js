const Config = require('../proxy').Config;
const WXSDK = require('../proxy').WXSDK;
const Store = require('../proxy').Store
const User = require('../proxy').User

//统一下单-生成预付单-获取package
exports.create = async(ctx, next) => {
    const { total, specifications, productId} = ctx.query
    const { openid } = ctx.session
    const ip = ctx.ip.match(/\d+.\d+.\d+.\d+/)[0];
    try{
        const config = await Config.getConfig();
        const store = await Store.getStoreById(productId);
        const current_money = Store.fetchPrice(store, specifications);//现价

        const {flag} = await User.getUserFlagByOpenId(openid)
        let derate_money = 0;//首单减免减免
        if(flag === '1') {// 第一次购买
            derate_money = config.derate_money
        }
        
        const pay_money = total * current_money - derate_money ;

        const url = config.server_host + ctx.url;
        let data = await WXSDK.getSignatureAsync(url)
        data.appid = config.appid
        await ctx.render('order', {
            config: data,
            openid: openid,
            total: total,
            store: store,
            specifications: specifications,
            total_money: (pay_money + derate_money) * 0.01,
            derate_money: derate_money * 0.01,
            pay_money: pay_money * 0.01,
        });         
    }catch(e){
        console.error(e)
        await ctx.redirect('/product/100001');
    }

};
