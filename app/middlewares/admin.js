const wechat = require('../utils/wechat');
const tools = require('../utils/tools');
const moment = require('moment');
const Admin = require('../proxy').Admin;
const User = require('../proxy').User;
const Config = require('../proxy').Config;
const dao = require('../dao/wechat');

exports.home = async (ctx)=> {
	await ctx.redirect('admin/order');
}
exports.showOrder = async (ctx)=> {
  var datas = await Admin.getOrder();
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
}

exports.order = async (ctx)=> {
  var req = ctx.request.body; 
  req.create_time = moment().format('YYYY-MM-DD HH:mm:ss');
  var userinfo = await User.getUserByOpenId(req.openid);//获取用户信息
  if(userinfo.eventKey){//是否有推广员
    req.eventKey = userinfo.eventKey;
  }
  await wechat.setOrder(req);
  if(req.pay_money !='0' && req.total_money != '0') {//产品订单
    if(userinfo.flag == '1'){
      wechat.customUpdateUser(req.openid, req.out_trade_no); //记录用户购买一次,关闭首单          
    }
    await tools.sendTemplateMessage(req.openid, req.pay_money, req.product+ '('+req.specifications+req.total+')');//发送模版消息
    // var order_id = await Admin.getOrderIdByOutTradeNo(req.out_trade_no);
    ctx.status = 204;	
  }else if(req.pay_money =='0' && req.total_money == '0'){//礼物订单
    var gift = await wechat.getGiftForConsumeByNameAndSpecifications(req.product, req.specifications);
        User.delUserConsumeByOpenId(req.openid, gift.consume);
    await tools.sendTemplateMessage(req.openid, req.pay_money, req.product+ '('+req.specifications+req.total+')');//发送模版消息
    ctx.status = 204;
  }
}

//设置发货
exports.express = async (ctx)=> {
  var req = ctx.request.body;
  var out_trade_no = req.out_trade_no;
  var order = await Admin.getOrderByOutTradeNo(out_trade_no);
  if(order.status == 2 && req.status == 3){//第一次发货
    var openid = order.openid;//openid
    var specifications = order.specifications;//规格
    var pay_money = order.pay_money;//支付金额
    var total = Number(order.total.replace(/[\u4e00-\u9fa5]+/g,""));//数量,去除中文。件

    var userinfo = await User.getUserByOpenId(openid);//获取用户信息
    //var config = await Config.getActivityCFG();//获取活动信息

    var order_count = userinfo.order_count;//下单件数
        order_count += total;
    if(order.eventKey){
      User.addUserConsumeByEventKey(order.eventKey, total);
      User.addUserOrderCountByOpenId(openid);
    }

    //减库存
    //最烂代码没有之一
    var store = await Admin.getStore();
      store = tools.StoreDataStringToObject(store);

      store[0].sku_info.map(function(val, index, arr) {
        
        switch(val.specifications){
          case specifications:          
          val.repertory -= total;
          
        }
        return val;
      }); 
      var sku_info = tools.StoreDataObjectToString(store[0].sku_info);
      let s  = {
        product_id: store[0].product_id,
        sku_info: sku_info
      }

    await Admin.updateStore(s);
  }//第一次发货end
  if(order.status!=0){
	 await Admin.updateOrderExpress(req);
  }
	await ctx.redirect('back');
}

exports.refundList = async (ctx)=> {
  var datas = await Admin.getRefundList();
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
}
exports.refund = async (ctx) => {
  var req = ctx.request.body;
  var out_trade_no = req.out_trade_no;
  var order = await Admin.getOrderByOutTradeNo(out_trade_no);
  console.log(order)
  if(order.status == 4 && req.total_fee == 0){//礼物退货
      var status = await wechat.refundGift(req.out_trade_no);//更新订单状态0-交易取消
      if(status == 1){
          return ctx.body = {
              msg: "SUCCESS"
          }
      }else{
          return ctx.body = {
              msg: "ERROR",
              code: "500:网络繁忙!"
          }
      }
  }else if(order.status == 4 && req.total_fee>0){//退款
      var config = await dao.getConfig();
      req.appid = config.appid;
      req.mch_id = config.store_mchid;
      req.out_refund_no = req.out_trade_no;//退款号=订单号
      req.refund_fee = parseInt(req.total_fee* 100);//退款金额=支付金额
      req.total_fee = parseInt(req.total_fee* 100);
      var refund = await pay.refund(req);    
      var xml = refund.xml; 
      console.log(xml);
      if(xml.return_code[0] === 'SUCCESS' && xml.return_msg[0] === 'OK'){     
          if(xml.result_code[0] === 'SUCCESS'){
              // await wechat.delOrderByOutTradeNo(req.out_trade_no);//删除订单
              await wechat.refundVoucherByOutTradeNo(req.out_trade_no);//退款代金券
              await wechat.refundUserByOutTradeNo(req.out_trade_no);//退款首单
              await wechat.updateOrderStatus(req.out_trade_no);//更新订单状态0-交易取消
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

