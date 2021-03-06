/**
 * 云通信基础能力业务短信发送、查询详情以及消费消息示例，供参考。
 * Created on 2017-07-31
 */
const SMSClient = require('@alicloud/sms-sdk');
const Config = require('../proxy').Config;

// ACCESS_KEY_ID/ACCESS_KEY_SECRET 根据实际申请的账号信息进行替换

//在云通信页面开通相应业务消息后，就能在页面上获得对应的queueName,不用填最后面一段
const queueName = 'Alicom-Queue-1092397003988387-';

//初始化sms_client

// //短信回执报告
// smsClient.receiveMsg(0, queueName).then(function (res) {
//     //消息体需要base64解码
//     let {code, body}=res
//     if (code === 200) {
//         //处理消息体,messagebody
//         console.log(body)
//     }
// }, function (err) {
//     console.log(err)
// });

// //短信上行报告
// smsClient.receiveMsg(1, queueName).then(function (res) {
//     //消息体需要base64解码
//     let {code, body}=res
//     if (code === 200) {
//         //处理消息体,messagebody
//         console.log(body)
//     }
// }, function (err) {
//     console.log(err)
// });

exports.send = async (data) => {
    const config = await Config.getConfig();
    const accessKeyId = config.sms_accessKeyId;
    const secretAccessKey = config.sms_secretAccessKey;
    let smsClient = new SMSClient({accessKeyId, secretAccessKey}); 
    data.SignName = config.sms_SignName;
    data.TemplateCode = config.sms_TemplateCode;

    return new Promise(function(resolve, reject) {
        smsClient.sendSMS(data).then(function (res) {
            let {Code}=res;
            if (Code === 'OK') {
                return resolve(res);
            }
        }, function (err) {
            return resolve(err);
        });
    });
    //return smsClient.sendSMS(data);
}


exports.query = async ()=> {
    const config = await Config.getConfig();
    const accessKeyId = config.sms_accessKeyId;
    const secretAccessKey = config.sms_secretAccessKey;
    let smsClient = new SMSClient({accessKeyId, secretAccessKey});
    return 
        //查询短信发送详情
        smsClient.queryDetail({
            PhoneNumber: '15977477245',
            SendDate: '20170917',
            PageSize: '10',
            CurrentPage: "1"
        });
        // .then(function (res) {
        //     let {Code, SmsSendDetailDTOs}=res
        //     if (Code === 'OK') {
        //         //处理发送详情内容
        //         console.log(SmsSendDetailDTOs);
        //     }
        // }, function (err) {
        //     //处理错误
        //     console.log(err,'err0000-0-')
        // });

    
}


