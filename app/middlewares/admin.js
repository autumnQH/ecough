const wechat = require('../utils/wechat');
const tools = require('../utils/tools');
const moment = require('moment');
const Admin = require('../proxy').Admin;
const User = require('../proxy').User;
const Config = require('../proxy').Config;

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
        } 
  });
  ctx.state.data = datas;
  await ctx.render('admin/order');
}

exports.order = async (ctx)=> {
  var req = ctx.request.body;
  var arr = req.arr.split(',');
  delete req.arr;
  req.create_time = moment().format('YYYY-MM-DD HH:mm:ss');
  tools.sendTemplateMessage(req.openid, req.pay_money, req.product+ '('+req.specifications+req.total+')');//发送模版消息
  await wechat.setOrder(req);
  var order_id = await Admin.getOrderIdByOutTradeNo(req.out_trade_no);
  arr.forEach(function(val) {
    User.updateUserVoucherById(val, order_id.id);
  });
  ctx.status = 204;	
}

//设置发货
exports.express = async (ctx)=> {
	var req = ctx.request.body;
  console.log(req);
  var out_trade_no = req.out_trade_no;
  var order = await Admin.getOrderByOutTradeNo(out_trade_no);
  if(order.status == 2){//第一次发货
    var openid = order.openid;//openid
    var specifications = order.specifications;//规格
    var pay_money = order.pay_money;//支付金额
    var total = order.total;//数量

    var userinfo = await User.getUserByOpenId(openid);//获取用户信息
    var config = await Config.getActivityCFG();//获取活动信息

    var order_count = userinfo.order_count;//下单次数
        //order_count += 1;
    var integral = userinfo.integral;//用户积分
        integral = integral + parseInt(pay_money * config.shoping_integral * 0.01);//计算积分

    //下单赠送积分
    User.addUserIntegralByOpenId(integral, order_count, openid);
    if(userinfo.flag == '1' && userinfo.eventKey){//首单
      var eventKey = userinfo.eventKey.replace(/^qrscene_/,"");//推广员
      var data = {
        openid: eventKey,
        voucher_type: '推广代金券',
        create_time: moment().format('YYYY-MM-DD HH:mm:ss'),
        voucher_denomination: config.spread_voucher
      };
      //推广员获得代金券
      await User.addUserVoucherByOpenId(data);
    }

    //减库存
    //最烂代码没有之一
    var store = await Admin.getStore();
      store = tools.StoreDataStringToObject(store);
      console.log(store,'减库存');
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
    wechat.customUpdateUser(openid, out_trade_no); //记录用户购买一次,关闭首单         
  }//第一次发货end
	await Admin.updateOrderExpress(req);
	await ctx.redirect('back');
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
	console.log(req);
	await Admin.updateConfig(req);
	return ctx.redirect('back');
}