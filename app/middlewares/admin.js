const tools = require('../utils/tools');
const moment = require('moment');
const Admin = require('../proxy').Admin;
const User = require('../proxy').User;
const Config = require('../proxy').Config;
const Order = require('../proxy').Order;
const WXSDK = require('../proxy').WXSDK
const Gift = require('../proxy').Gift;
const Store = require('../proxy').Store
const pay = require('../utils/pay');
const Pay = require('../proxy').Pay;

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

//设置发货
exports.express = async (ctx)=> {
  const { out_trade_no, status, delivery_track_no, delivery_company } = ctx.request.body
  var order = await Order.getOrderByOutTradeNo(out_trade_no);
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
    }//第一次发货end
	 await ctx.redirect('back');
  }catch (e) {
    console.error(e)
    await ctx.redirect('back');
  }
}

//new end

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
        var refund = await pay.refund({
          appid: config.appid,
          mch_id: config.store_mchid,
          out_trade_no: out_trade_no,
          out_refund_no: out_trade_no,
          refund_fee: Number(total_fee * 100),
          total_fee: Number(total_fee * 100)
        });   
        console.log(refund)
        var xml = refund.xml; 
        console.log(xml)
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
      code: '服务器繁忙，请稍后再试'
    }
  }
}
exports.showService = async (ctx)=> {
  var data = await Admin.getService();
  data.forEach(function(val) {
    val.create_time = tools.formatDate(val.create_time);
  });
  ctx.state.data = data;
	await ctx.render('admin/service');
}

exports.showFAQ = async (ctx)=> {
	ctx.state.data = await Admin.getFAQ();
	await ctx.render('admin/FAQ');
}

exports.showAddFAQ= async (ctx)=> {
	ctx.state.data = null;
	await ctx.render('admin/FAQEdit');
}

exports.addFAQ= async (ctx)=> {
	var req = ctx.request.body;
	await Admin.addFAQ(req);
	ctx.status = 204;
}

exports.showEditFAQ = async (ctx)=> {
	var id = ctx.params.id;
	ctx.state.data = await Admin.getFAQById(id);
	await ctx.render('admin/FAQEdit');
}

exports.updateFAQ = async (ctx)=> {
	var id = ctx.params.id;
	var req = ctx.request.body;
	await Admin.updateFAQ(req, id);
	ctx.status = 204;
}

exports.delFAQ = async (ctx)=> {
	var id = ctx.params.id;
	await Admin.delFAQ(id);
	ctx.status = 204;
}

exports.showStore = async (ctx)=> {
	var data = await Admin.getStore();
  ctx.state.data = tools.StoreDataStringToObject(data);
	await ctx.render('admin/product');
}

exports.updateStore = async (ctx)=> {
	var data = ctx.request.body;
	data.sku_info = tools.StoreDataArrayToString(data);
  await Admin.updateStore(data);
  return ctx.redirect('back');
}

exports.showConfig = async (ctx)=> {
	ctx.state.config = await Admin.getConfig();
	await ctx.render('admin/config');
}

exports.updateConfig = async (ctx)=> {
	var req = ctx.request.body;
  data = await Admin.getConfig();
  
  if(data.id) {
	  await Admin.updateConfig(req);
  }else {
    await Admin.saveConfig(req)
  }
	return ctx.redirect('back');
}

exports.showGift = async (ctx) => {
  ctx.state.data = await Admin.getGift();
  await ctx.render('admin/gift');
}

exports.showAddGift = async (ctx) => {
  ctx.state.data = null;
  await ctx.render('admin/giftEdit');
}

exports.addGift = async (ctx) => {
  var req = ctx.request.body;
  req.create_time = moment().format('YYYY-MM-DD HH:mm:ss');
  await Admin.addGift(req);
  ctx.status = 204;
}

exports.showEditGift = async (ctx)=> {
  var id = ctx.params.id;
  ctx.state.data = await Admin.getGiftById(id);
  await ctx.render('admin/giftEdit');
}

exports.updateGift = async (ctx)=> {
  var id = ctx.params.id;
  var req = ctx.request.body;
  await Admin.updateGift(req, id);
  ctx.status = 204;  
}

exports.delGiftById = async (ctx)=> {
  var id = ctx.params.id;
  await Admin.delGiftById(id);
  ctx.status = 204;  
}

