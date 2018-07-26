const fs = require('fs');

exports.index = async (ctx)=> {
  var imgData = ctx.request.body.img;
  //过滤data:URL
  var base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");
  var type = imgData.replace(/data:image\/([^;]+).*/i,'$1');//取类型
  var name = Date.now() +'.' + type;
	var url = __dirname + '/../public/uploads/'+name
  var dataBuffer = new Buffer(base64Data, 'base64');	
	var img = await new Promise(function(resolve, reject) {
  	fs.writeFile(url, dataBuffer, function(err) {
  		if(err){
        console.error(err);
  			reject(err);
  		}else{
  			resolve({
  				url: '/uploads/'+name
  			});
  		}
  	});
	});	
	return ctx.body = img;	
}
