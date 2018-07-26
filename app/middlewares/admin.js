const tools = require('../utils/tools');
const moment = require('moment');
const User = require('../proxy').User;
const Config = require('../proxy').Config;
const Order = require('../proxy').Order;
const WXSDK = require('../proxy').WXSDK
const Gift = require('../proxy').Gift;
const Store = require('../proxy').Store
const UserService = require('../proxy').UserService;
const FAQ = require('../proxy').FAQ
const pay = require('../utils/pay');

exports.home = async (ctx)=> {
	await ctx.redirect('admin/order');
}
exports.showOrder = async (ctx)=> {
  try {
    var datas = await Order.getOrder();
    datas.forEach(function(data) {
        data.create_time = tools.formatDate(data.create_time);
          switch(data.status){
            case 0 :
            data.status = '交易取消';
            break;
            case 2:
            data.status = '待发货';
            break;
            case 3:
            data.status = '已发货';
            break;
            case 4:
            data.status = '申请退款';
            break;          
            case 5:
            data.status = '交易完成';
            break;
            case 8:
            data.status = '交易维权';
            break;
          }
          switch(data.delivery_company){
            case 'shentong':
            data.delivery_company = '申通';
            break;
            case 'huitongkuaidi':
            data.delivery_company = '百世';
            break;
            case 'yuantong':
            data.delivery_company = '圆通';
            break;
          } 
    });
    ctx.state.data = datas;
    await ctx.render('admin/order'); 
  }catch (e) {
    console.error(e)
    ctx.state.data = [];
    await ctx.render('admin/order'); 
  }
}

exports.refundList = async (ctx)=> {
  try {
    var datas = await Order.getRefundList();
    datas.forEach(function(data) {
        data.create_time = tools.formatDate(data.create_time);
          switch(data.status){
            case 4:
            data.status = '申请退款';
            break;          
          }
    });
    ctx.state.data = datas;
    await ctx.render('admin/refundList');
  }catch (e) {
    console.error(e)
    ctx.state.data = []
    await ctx.render('admin/refundList');
  }
}

exports.order = async (ctx)=> {
  try{
    const req = ctx.request.body; 
    const { openid, pay_money, total_money, out_trade_no, product, specifications, total } = req;
    req.create_time = moment().format('YYYY-MM-DD HH:mm:ss');
    //获取用户信息
    const { eventKey, flag } = await User.getUserByOpenId(openid);
    if(eventKey){//是否有推广员
      req.eventKey = eventKey;
    }
    //新增订单信息
    await Order.setOrder(req);
    //产品订单
    if(pay_money !='0' && total_money != '0') {
      if(flag == '1'){
        User.updateUserByFlag(openid, out_trade_no); //记录用户购买订单号,关闭首单          
      }
      const template_id = await WXSDK.getTemplateId()
      const config = await Config.getConfig()
      const json = {
        touser: openid,
        template_id: template_id || 'BgpTq3S8WtnvWGDWST_lH3l1NaCZZ_PM7I33qIouEhk',
        url: config.server_host + '/user/my/code',
        data: {
          first: {
            value: '您好，您已购买成功。'
          },
          keyword1: {
            value: product + '(' + specifications + ')'
          },
          keyword2: {
            value: total 
          },
          remark: {
            value: '推荐购买，最高可兑换iphoneX哦～',
            color: '#fb3535'
          }
        }

      }
      await WXSDK.handle('sendTemplateMessage', json)      
      ctx.status = 204;	
    //礼物订单
    }else if(pay_money =='0' && total_money == '0'){
      const gift = await Gift.getGiftForConsumeByNameAndSpecifications(product, specifications);
      await User.delUserConsumeByOpenId(openid, gift.consume);
      const template_id = await WXSDK.getTemplateId()
      const config = await Config.getConfig()
      const json = {
        touser: openid,
        template_id: template_id || 'BgpTq3S8WtnvWGDWST_lH3l1NaCZZ_PM7I33qIouEhk',
        url: config.server_host + '/user/my/code',
        data: {
          first: {
            value: '您好，您已购买成功。'
          },
          keyword1: {
            value: product + '(' + specifications + ')'
          },
          keyword2: {
            value: total 
          },
          remark: {
            value: '推荐购买，最高可兑换iphoneX哦～',
            color: '#fb3535'
          }
        }

      }
      await WXSDK.handle('sendTemplateMessage', json)      
      ctx.status = 204;
    }
  }catch(e) {
    console.error(e)
    ctx.status = 204
  }
}

//设置订单状态
exports.express = async (ctx)=> {
  const { out_trade_no, status, delivery_track_no, delivery_company } = ctx.request.body
  var order = await Order.getOrderByOutTradeNo(out_trade_no);
  console.log(out_trade_no, status, delivery_track_no, delivery_company)
  try {
    if(order.status == 2 && status == 3){//第一次发货
      var openid = order.openid;//openid
      var specifications = order.specifications;//规格
      var pay_money = order.pay_money;//支付金额
      var total = Number(order.total.replace(/[\u4e00-\u9fa5]+/g,""));//数量,去除中文。件
      if(pay_money) {//支付金额小于0是礼物订单
        //推广人获取推广件数
        if(order.eventKey){
          User.addUserConsumeByEventKey(order.eventKey, total);
          User.addUserOrderCountByOpenId(openid);
        }

        //减少商品库存
        const store = await Store.getStoreById('100001')
        const { sku_info } = store
        sku_info.map(item => {
          switch(item.specifications) {
            case specifications:
            item.stock_num -= total
          }
        })
        await Store.updateStoreById(store)
        await Order.updateOrderById(order.id, {status, delivery_track_no, delivery_company, out_trade_no})
        await ctx.redirect('back');
      }else {
        await Order.updateOrderById(order.id, {status, delivery_track_no, delivery_company, out_trade_no})
        await ctx.redirect('back');
      }
    //第一次发货end
    }else {
      //交易完成
      await Order.updateOrderById(order.id, {status, out_trade_no, delivery_track_no})
      await ctx.redirect('back');
    }
  }catch (e) {
    console.error(e)
    await ctx.redirect('back');
  }
}

exports.refund = async (ctx, next) => {
  const { out_trade_no, total_fee} = ctx.request.body
  try {
    var order = await Order.getOrderByOutTradeNo(out_trade_no);
    if(order.status === 4 && total_fee == 0){//礼物退货
        var status = await Order.updateOrderById(order.id, {status: 0});//更新订单状态0-交易取消
        if(status == 1){
            return ctx.body = {
                msg: "SUCCESS",
                code: '订单取消成功'
            }
        }else{
            return ctx.body = {
                msg: "ERROR",
                code: "服务器繁忙，请稍后再试"
            }
        }
    }else if(order.status === 4 && total_fee>0){//退款
        var config = await Config.getConfig();
        const json = {
          out_trade_no: out_trade_no,
          appid: config.appid,
          store_key: config.store_key,
          mch_id: config.store_mchid,
          out_refund_no: out_trade_no,
          refund_fee: Number(total_fee * 100),
          total_fee: Number(total_fee * 100)
        }
        var refund = await pay.refund(json);   
        var xml = refund.xml; 
        if(xml.return_code[0] === 'SUCCESS' && xml.return_msg[0] === 'OK'){     
            if(xml.result_code[0] === 'SUCCESS'){
                await wechat.refundUserByOutTradeNo(out_trade_no);//退款首单
                await wechat.updateOrderStatus(out_trade_no);//更新订单状态0-交易取消
                return ctx.body = {
                    msg: xml.result_code[0]
                }
            }else{        
                return ctx.body = {
                    msg: xml.result_code[0],
                    code:xml.err_code +':'+ xml.err_code_des[0]
                }
            }
        }
        
    }else if(order.status == 3) {
        return ctx.body = {
            msg: 'ERROR',
            code: '该订单已经发货'
        }
    }else if(order.status == 0) {
        return ctx.body = {
            msg: 'ERROR',
            code: '该订单已经取消'
        }
    }else{
        return ctx.body = {
            msg:'ERROR',
            code: '未知错误!'
        }
    }  
  }catch (e) {
    console.error(e)
    ctx.body = {
      msg: 'ERROR',
      code: '请检查你的证书和对应参数'
    }
  }
}


exports.showService = async (ctx)=> {
  try {
    let data = await UserService.getService();
    data.forEach(function(val) {
      val.create_time = tools.formatDate(val.create_time);
    });
    ctx.state.data = data;
  	await ctx.render('admin/service');
  }catch(e) {
    console.error(e)
    ctx.state.data = [];
    await ctx.render('admin/service');    
  }
}

exports.showFAQ = async (ctx)=> {
  try {
  	ctx.state.data = await FAQ.getFAQ();
  	await ctx.render('admin/FAQ');
  }catch(e) {
    console.error(e)
    ctx.state.data = []
    await ctx.render('admin/FAQ')
  }
}

exports.showAddFAQ= async (ctx)=> {
  try {
    ctx.state.data = null;
    await ctx.render('admin/FAQEdit');
  }catch(e) {
    console.error(e)
    ctx.state.data = null;
    await ctx.render('admin/FAQEdit')
  }
}

exports.addFAQ= async (ctx)=> {
  try {
    const {centent, title} = ctx.request.body;
    await FAQ.addFAQ({centent, title});
    ctx.status = 204;
  }catch(e) {
    console.error(e)
    ctx.status = 500;    
  }
}

exports.showEditFAQ = async (ctx)=> {
  try {
    const id = ctx.params.id;
    ctx.state.data = await FAQ.getFAQById(id);
    await ctx.render('admin/FAQEdit');
  }catch(e) {
    console.error(e)
    ctx.state.data = {}
    await ctx.refund('admin/FAQEdit')
  }
}

exports.updateFAQ = async (ctx)=> {
  try {
    const id = ctx.params.id;
    const {centent, title} = ctx.request.body;
    await FAQ.updateFAQ({centent, title}, id);
    ctx.status = 204;
  }catch (e) {
    console.error(e)
    ctx.statue = 500
  }
}

exports.delFAQ = async (ctx)=> {
  try {
  	const id = ctx.params.id;
  	await FAQ.delFAQ(id)
  	ctx.status = 204
  }catch(e) {
    console.error(e)
    ctx.status = 500
  }
}


exports.showStore = async (ctx)=> {
  try {
  	var data = await Store.getStoreById('100001');
    ctx.state.data = [data]
  	await ctx.render('admin/product');
  }catch(e) {
    console.log(e)
    ctx.state.data = []
    await ctx.render('admin/product');
  }
}
exports.updateStore = async (ctx)=> {
  const { product_id, name, specifications, price, old_price, stock_num } = ctx.request.body;
  try {
    let arr = []
    for(let i = 0; i < price.length; i++) {
      arr.push({
        specifications: specifications[i],
        price: price[i],
        old_price: old_price[i],
        stock_num: stock_num[i]
      })
    }
    await Store.updateStoreById({
      product_id,
      name,
      sku_info: arr
    });
    return ctx.redirect('back');
  }catch(e) {
    return ctx.redirect('back');
  }
}

exports.showConfig = async (ctx)=> {
  try {
    const data = await Config.getConfig();
    ctx.state.config = data
  	await ctx.render('admin/config');
  }catch(e) {
    console.error(e)
    ctx.state.config = {}
    await ctx.render('admin/config');
  }
}

exports.updateConfig = async (ctx)=> {
  try {
    var req = ctx.request.body;
    await Config.saveConfig(req)
  	return ctx.redirect('back');
  }catch(e) {
    console.error(e)
    return ctx.redirect('back');
  }
}

exports.showGift = async (ctx) => {
  try {
    ctx.state.data = await Gift.getGift();
    await ctx.render('admin/gift');
  }catch(e) {
    ctx.state.data = []
    await ctx.render('admin/gift');
  }
}

exports.showAddGift = async (ctx) => {
  ctx.state.data = null;
  await ctx.render('admin/giftEdit');
}

exports.addGift = async (ctx) => {
  const {title, name, specifications, centent, img_url, icon_url, consume} = ctx.request.body;
  const create_time = moment().format('YYYY-MM-DD HH:mm:ss');
  try {
    await Gift.addGift({title, name, specifications, centent, img_url, icon_url, consume, create_time});
    ctx.status = 204;
  }catch(e) {
    console.error(e)
    ctx.statue = 500
  }
}

exports.showEditGift = async (ctx)=> {
  const id = ctx.params.id;
  try {
    ctx.state.data = await Gift.getGiftById(id);
    await ctx.render('admin/giftEdit');
  }catch(e) {
    console.error(e)
    ctx.state.data = {}
    await ctx.render('admin/giftEdit');
  }
}

exports.updateGift = async (ctx)=> {
  const id = ctx.params.id;
  const {title, name, specifications, centent, img_url, icon_url, consume} = ctx.request.body;
  try {
    await Gift.updateGift({title, name, specifications, centent, img_url, icon_url, consume}, id);
    ctx.status = 204;  
  }catch(e) {
    console.error(e)
    ctx.status = 500
  }
}

exports.delGiftById = async (ctx)=> {
  try {
    var id = ctx.params.id;
    await Gift.delGiftById(id);
    ctx.status = 204;  
  }catch(e) {
    console.erro(e)
    ctx.status = 500
  }

}
