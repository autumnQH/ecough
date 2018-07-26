const xml = require('../utils/xml');
const Notify = require('../proxy').Notify;

//收款通知
exports.index = async function(ctx, next) {
    let msg = ctx.request.body ? ctx.request.body.xml : '';
    if(msg.result_code[0] == 'SUCCESS' && msg.return_code[0] == 'SUCCESS'){
        var data = {
            appid: msg.appid[0],//公众账号id
            attach: msg.attach[0],//商家数据包
            bank_type: msg.bank_type[0],//付款银行
            cash_fee: msg.cash_fee[0],//现金支付金额
            fee_type: msg.fee_type[0],//货币种类
            is_subscribe: msg.is_subscribe[0],//是否关注公众账号
            mch_id: msg.mch_id[0],//商户号
            nonce_str: msg.nonce_str[0],//随机字符串
            openid: msg.openid[0],//用户标识
            out_trade_no: msg.out_trade_no[0],//商户订单号
            result_code: msg.result_code[0],//业务结果
            return_code: msg.return_code[0],//业务代码
            sign: msg.sign[0],//签名
            time_end: msg.time_end[0],//支付完成时间
            total_fee: msg.total_fee[0],//订单金额
            trade_type: msg.trade_type[0],//交易类型
            transaction_id: msg.transaction_id[0] //微信支付订单号
        }
        //console.log(data,'数据');
        Notify.saveNotify(data);
        return ctx.body =  xml.jsonToXml({
            return_code: msg.result_code[0],
            return_msg: msg.return_code[0]
        });        
    }else{
        return ctx.body =  xml.jsonToXml({
            return_code: msg.result_code[0],
            return_msg: msg.return_code[0]
        });
    }


};
