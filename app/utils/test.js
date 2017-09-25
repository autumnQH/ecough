const request = require('request');

let token = 'qfTwUnUJKudayVhawrBFuFjL40nK-0UHSsJUxRCPwSS37DAu1q5TNL_Jir2EcprCKm0lVHKh7NZ-2lL0NRZv_EwQRSSG_EokfImpSQRrrTD7VBijjLsYPIEFFSAvYSQuOLWhAAAGDO';

async function b() {
  let options = {
    url: 'https://api.weixin.qq.com/cgi-bin/customservice/getkflist?access_token='+ token
  };
  
  return new Promise(function(resolve, reject){
    request(options, function(err, res ,body) {
      if(body){
        return resolve(body);
      }else{
        return reject(err);
      }
    });
  });
}
async function a () {
  
  let json = JSON.stringify({
    kf_account: 'kf2002@gh_3b35ec5a2616',
    openid: 'oDC9Z0qeRibY8W5xwv-wUrNskdoU'
  });
  let options = {
    url: 'https://api.weixin.qq.com/customservice/kfsession/create?access_token='+token,
    method: 'post',
    body: json,
  };
  return new Promise(function(resolve, reject) {
    request(options, function(err, res, body) {
      if(body){
        return resolve(body);    
      }else{
        return reject(err);
      }
    });
    
  });
} 
// b().then(function(r) {
//   console.log(r);
// });
a().then(function(r) {
  console.log(r,'??');
});