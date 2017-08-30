
var admin = async function (ctx, next) {
    await ctx.render('admin', {

    });
}

var admin_order = async function(ctx, next) {
    var data = await wechat.getOrder();
    await ctx.render('admin_order', {
        data: data
    });
}

var admin_setOrder = async function (ctx, next) {
    var req = ctx.request.body;
    req.create_time = moment().format('YYYY-MM-DD HH:mm:ss');
    wechat.setOrder(req);
    await ctx.redirect('/product/100001');


}

var admin_qrcode = async function(ctx, next) {
    var data = await wechat.getQRCode();
    await ctx.render('admin_spread', {
        datas: data
    });    
}

var admin_setQrcode = async function(ctx, next) {
    var req = ctx.request.body;
   
    var token = await dao.getActiveAccessToken();
    var json = JSON.stringify({
        'action_name': 'QR_LIMIT_STR_SCENE',
        'action_info': {
            'scene': {
                'scene_str':req.name
            }
        }
    });
    console.log(json,'json--------');
    var data = await tools.getQRCode(token, json);
    console.log(data,'data------');
    data = JSON.parse(data);
    data.create_time = moment().format('YYYY-MM-DD HH:mm:ss');
    data.name = req.name +'';
    data.scene_str = req.name + '';
    data.action_name = 'QR_LIMIT_SCENE';
    data.ticket = 'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket='+ data.ticket;

    var a = await wechat.setQRCode(data);

    await ctx.redirect('/admin/qrcode');
}

module.exports = {
    'GET /admin': admin,
    'GET /admin/order': admin_order,
    'POST /admin/setOrder': admin_setOrder,
    'GET /admin/qrcode': admin_qrcode,
    'POST /admin/setQrcode': admin_setQrcode

};