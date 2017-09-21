var qr_image = require('qr-image');  
var images = require('images');
var request = require('request');
var fs = require('fs');

exports.qr = async function(userinfo) {
  return new Promise(function(resolve, reject) {
  var logo = request(userinfo.headimgurl.replace(/\/0/,'/64'))
  .pipe(fs.createWriteStream(__dirname+'/../public/imgs/'+userinfo.openid+'logo.jpeg').on('close', function(err, data) {
    return resolve('success');
  }));
    
  });
}

exports.qr_logo = async function(userinfo, qrurl){
  return new Promise(function(resolve, reject) {
    var qr = qr_image.imageSync(qrurl.url);
    var q_size = 120;
    var logo_size = 26;

    var logo = images(__dirname+'/../public/imgs/'+userinfo.openid+'logo.jpeg').size(logo_size);
    var q = images(qr).size(q_size).draw(logo,q_size/2-logo_size/2,q_size/2-logo_size/2);
    images(__dirname + '/'+'backage.jpg').draw(q,52,330)
    .saveAsync(__dirname+'/../public/imgs/'+userinfo.openid+'.jpeg',{quality:50},{}, function() {
          return resolve('ok');      
    });

  });
}