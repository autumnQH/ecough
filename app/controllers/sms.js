const sms = require('../utils/sms');

var send = async (ctx, next) => {
	var req = ctx.request.body;
  var number="";  
  for(var i=0;i<4;i++){  
      number+=Math.floor(Math.random()*10)  
  } 	
	var s =  await sms.send({
		PhoneNumbers: req.phone,
		TemplateParam: '{"code":"'+number+'"}'
	});
  if(s.Code=="OK"){ 
    return  ctx.body = {code :1,msg :number}  
  }else{ 
    return ctx.body = {code :0,msg:'系统繁忙，请稍后再试'}  
  }
};
var queryDetail = async (ctx, next) => {
	
};

module.exports = {
	'POST /sms/send': send
	//,'POST /sms/query': queryDetail
};