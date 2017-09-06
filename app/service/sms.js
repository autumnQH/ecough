const SMSClient = require('../utils/sms');
const config = require('../config/config').config();

// ACCESS_KEY_ID/ACCESS_KEY_SECRET 根据实际申请的账号信息进行替换
const accessKeyId = config.sms.accessKeyId;
const secretAccessKey = config.sms.secretAccessKey;//初始化sms_client
let smsClient = new SMSClient({accessKeyId, secretAccessKey})
//发送短信
smsClient.sendSMS({
    PhoneNumbers: '15977477245',
    SignName: config.sms.SignName,
    TemplateCode: config.sms.TemplateCode,
    TemplateParam: '{"code":"12345","product":"刘鹏"}'
}).then(function (res) {
    let {Code}=res
    if (Code === 'OK') {
        //处理返回参数
        console.log(res)
    }
}, function (err) {
    console.log(err)
})