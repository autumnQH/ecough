const User = require('../proxy').User;
const Order = require('../proxy').Order;
const WXSDK = require('../proxy').WXSDK;
const Config = require('../proxy').Config;
const tools = require('../utils/tools');
const moment = require('moment');

function isOnlinekf(data) {
  if(data.kf_online_list.length === 0) {
    return null
  }else {
    data.forEach(item => {
      item.status === 1 ? item.kf_account : item.kf_account
    })
  }
}

exports.index = async (ctx)=> {
    let openid = ctx.session.openid;
    ctx.state.data = await User.getUserByOpenId(openid);  

    await ctx.render('user/index');
}

exports.addUserPhone = async (ctx)=> {
    let data = ctx.request.body;
    try {
      const { signup_phone_integral } = await Config.getConfig();
      if(signup_phone_integral) {
          data.integral = signup_phone_integral;
      }
      await User.setUserForPhone(data);
      ctx.body = {
        code :1,msg :'绑定成功'  
      }
    }catch(e) {
      console.error(e)
      ctx.body = {
        code: 0, msg: '服务器繁忙，请稍后再试!'
      }
    }
}



exports.showGift = async (ctx)=> {
  try {
    ctx.state.data = await User.showGift();
    await ctx.render('user/gift');
  }catch(e) {
    console.error(e)
    ctx.state.data = []
    await ctx.render('user/gift');    
  }
}

exports.showGiftById = async (ctx)=> {
  const id = ctx.params.id;
  const openid = ctx.session.openid;  
  try {
    ctx.state.openid = openid;
    ctx.state.out_trade_no = tools.trade();
    ctx.state.data = await User.showGiftById(openid, id);
    await ctx.render('user/gift_info');
  }catch(e) {
    ctx.state.openid = openid;
    ctx.state.out_trade_no = tools.trade();
    ctx.state.data = await User.showGiftById(openid, id);
    await ctx.render('user/gift_info');    
  }

}

exports.showUserOrder = async (ctx)=> {
  await ctx.render('user/order');
}

exports.showUserOrder2 = async (ctx)=> {
  await ctx.render('user/order2');
}

exports.getOrderByStatus = async (ctx)=> {
  try {
    const openid = ctx.session.openid;
    const {status, page, size} = ctx.query;
    ctx.body = await User.getUserOrderForStatusByStatusAndOpenId(openid, status, page, size);
  }catch (e) {
    console.error(e) 
    ctx.body = {}
  }
}

exports.getOrderInfoById = async (ctx)=> {
  const order_id = ctx.query.id;
  try {
    ctx.state.data = await Order.getOneOrderById(order_id);
    await ctx.render('user/order_info');
  }catch (e) {
    console.error(e) 
    ctx.state.data = {}
    await ctx.render('user/order_info');
  }
}

exports.showCode = async (ctx)=> {
  let url = 'http://' + ctx.header.host + ctx.url.split('?').slice(0,1);
  try{
    let data = await WXSDK.getSignatureAsync(url) 
    const config = await Config.getConfig()
    data.appid = config.appid
    ctx.state.config = data; 
    await ctx.render('user/code_qr');   
  }catch(e) {
    console.error(e)
    ctx.state.config = {}; 
    await ctx.render('user/code_qr');    
  }
}

exports.getMyQR_Code = async (ctx)=> {
  const json = {
      "expire_seconds": 3 * 60 *60 *24, 
      "action_name": "QR_STR_SCENE", 
      "action_info": {
          "scene": {
              "scene_str": ctx.session.openid
          }
      }
  }
 
  const userinfo =  ctx.session;    
  try{
    const data = await WXSDK.handle('createQRCode', json)
    const url = await tools.getQrFile(userinfo, data.url); 
    ctx.body = {
      url : '/imgs/'+ url + '.jpeg',
      f: true
    }
  }catch(e) {
    console.error(e)
    ctx.body = {
      url: '',
      f: false
    }
  }

}

exports.showPartner = async (ctx)=> {
	const openid = ctx.session.openid
  try {
    ctx.state.data = await User.getUserByEnentKey(openid);
    ctx.state.data2 = await User.getUserTotalConsume(openid);
    await ctx.render('user/partner');	
  }catch (e) {
    ctx.state.data = []
    ctx.state.data2 = {}
    await ctx.render('user/partner'); 
  }
}

exports.showService = async (ctx)=> {
  let openid = ctx.session.openid;
  try {
    ctx.state.data =  await Order.getOrderForTradeByOpenId(openid);
    ctx.state.openid = openid;
    await ctx.render('user/service');
  }catch (e) {
    console.error(e)
    ctx.state.data =  []
    ctx.state.openid = openid;
    await ctx.render('user/service');    
  }
}

exports.addService = async (ctx)=> {
    let data = ctx.request.body;
    try {
      data.create_time = moment().format('YYYY-MM-DD HH:mm:ss');
      User.setService(data);
      ctx.status = 204;
    }catch(e) {
      console.error(e)
      ctx.status = 204;
    }
}

exports.showFAQ = async (ctx)=> {
  const openid = ctx.session.openid;
  try {
    ctx.state.data =  await User.getFAQ();
    ctx.state.openid = openid
    await ctx.render('user/FAQ');
    
  }catch (e) {
    console.error(e) 
    ctx.state.data = []
    ctx.state.openid = openid
    await ctx.render('user/FAQ');    
  }
}


exports.showFAQById = async (ctx)=> {
  const id = ctx.params.id;
  const openid = ctx.session.openid;
  try {
    ctx.state.data =  await User.getFAQById(id);
    ctx.state.openid = openid
    await ctx.render('user/FAQ_info');     
  }catch(e) {
    console.error(e)
    ctx.state.data =  {}
    ctx.state.openid = openid
    await ctx.render('user/FAQ_info');     
  }
}



exports.contactCustomService = async (ctx)=> {
    const openid = ctx.session.openid;
    try {
      const data = await WXSDK.handle('getTheFirstOnlineCustomerservice')
      const kf_account = isOnlinekf(data)
      const kf = await WXSDK.handle('createKfsession', openid,kf_account)
      if(status.errcode==0&& status.errmsg=='ok'){
        let json = {
            touser: openid,
            msgtype: 'text',
            text: {
              content: '你好，很高兴为你服务'
            },
            customservice: {
              kf_account: kf_account
            }
        }       
        await WXSDK.handle('sendCustomMessage', json)
      }
      ctx.body = status;    
    }catch(e) {
      console.error(e)
      ctx.body = {
        errcode: 1,
        errmsg: '服务器繁忙，请稍后再试'
      }
    }
}

exports.refundOrder = async (ctx) => {
  const req = ctx.request.body;
  const id = req.id
  try{
    const order = await Order.getOneOrderById(id);
    if(order.status == 2 && req.total_fee == 0){//礼物退货
      const status = await Order.updateOrderById(order.id, {status: 0});
      if(status == 1){
          ctx.body = {
              msg: "SUCCESS"
          }
      }else{
          ctx.body = {
              msg: "ERROR",
              code: "500:网络繁忙!"
          }
      }
    }else if(order.status == 2 && req.total_fee > 0) {   // 产品退货 
      const status = await Order.updateOrderById(order.id, {status: 4});
      ctx.body = {
        msg: "SUCCESS"
      }
    }else if(order.status == 3) {
        ctx.body = {
            msg: 'ERROR',
            code: '该订单已经发货'
        }
    }else if(order.status == 0) {
        ctx.body = {
            msg: 'ERROR',
            code: '该订单已经取消'
        }
    }else{
        ctx.body = {
            msg:'ERROR',
            code: '未知错误!'
        }
    }
    
  }catch(e) {
    console.error(e)
    ctx.body = {
      msg: 'ERROR',
      code: '服务器繁忙，请稍后再试'
    }
  }
}
