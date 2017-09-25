const request = require('request');

async function a () {
  let token = '84iIrVZu9IlQeqCaxakm9bZYjm-x-pfm9360bIAswbDEm60DhldKde4Cu_JsmgkoGCp1MhEGjYTXVecNnTuWkxKoX1MPWBniD7sAm6caJhFD1bD0Cx-knpOhNPPKKF3HRIAcAIAEVN';
  let json = JSON.stringify({
    kf_account: 'test@qh_Jack',
    invite_wx: 'wx_liup778328'
  });
  let options = {
    url: 'https://api.weixin.qq.com/customservice/kfaccount/inviteworker?access_token='+ token,
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

a().then(function(r) {
  console.log(r,'??');
});