const xml = require('../utils/xml');
const dao = require('../dao/wechat');
const tools = require('../utils/tools');
const pay = require('../utils/pay');
const USER = require('../utils/user');
const STORE = require('../utils/store');

//统一下单-生成预付单-获取package
exports.create = async(ctx, next) => {
    const config = await dao.getConfig();
    var openid = ctx.query.openid;
    var total = ctx.query.total;//数量
    var specifications = ctx.query.specifications;//规格
    var product_id = ctx.query.product;//商品ID
    var store = await STORE.getStoreById(product_id);
    store.sku_attr = store.sku_attr.split(',');
    store.sku_info = store.sku_info.split(',').map(function(val, index, arr) {
        var newarr = val.split(':');
        return {specifications: newarr[0], price: newarr[1], ori_price: newarr[2], repertory: newarr[3], qr: newarr[4]}; 
    });
    var nonceStr = tools.createRandom();
    var timeStamp = tools.createTimestamp();
    var out_trade_no = tools.trade();

    var value = {
        nonceStr: nonceStr,
        timeStamp: timeStamp,
        out_trade_no: out_trade_no
    };

    var current_money = 0;//现价
    var derate_money = 0;//首单减免减免

    var todaySubscribe = await USER.getUserFlagByOpenId(openid); 
    if(todaySubscribe.flag == '1'){//首单
        derate_money = config.derate_money;
    }

    for(var i = 0 ; i< store.sku_info.length; i++){
        if(specifications === store.sku_info[i].specifications) {
            current_money = store.sku_info[i].price;
        }
    }
    var pay_money = total * current_money - derate_money ;
    var ip = ctx.ip.match(/\d+.\d+.\d+.\d+/)[0];
    var page = await pay.setPackageData(openid, pay_money, value, store.name, ip);
    
    // console.log(page,'统一下单');

    var res = await tools.getPackge(page);//发起统一下单
    var result = await xml.xmlToJson(res);//解析统一下单返回的xml数据
    // console.log(result);
    if(result.xml.err_code){
        if(result.xml.err_code[0] == 'ORDERPAID'){
            await ctx.redirect('/product/100001');
        }
    }
    if(result.xml.prepay_id){
        var prepayid = result.xml.prepay_id[0];
        var data2 = await pay.setPaySign(prepayid, value);

        //获取js-ticket才能调用微信支付请求
        //获取js-ticket
        var jsapi_ticket = await dao.getJsapiTicket();
        // var url = 'http://' + ctx.header.host + ctx.url;
        var url = config.server_host + ctx.url;
        var wxcfg = await pay.setWXConfig(jsapi_ticket, url, value);
       // console.log(wxcfg,'wxcfg')
        await ctx.render('order', {
            config: wxcfg,
            data: data2,
            openid: openid,
            total: total,
            store: store,
            specifications: specifications,
            total_money: (pay_money + derate_money) * 0.01,
            derate_money: derate_money * 0.01,
            pay_money: pay_money * 0.01,

        });         
    }else{
        await ctx.redirect('/product/100001');
    }

};