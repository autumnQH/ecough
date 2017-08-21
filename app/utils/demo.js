const moment = require('moment');
var aa = function () {
	return moment().format('YYYY-MM-DD HH:mm:ss').replace(/\D/g,'')+ Math.floor(Math.random()*100);
}
var i = aa();
console.log(i);