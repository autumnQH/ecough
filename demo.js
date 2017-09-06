const moment = require('moment');
var date = new Date('2017-09-05T16:00:00.000Z');
var today = moment().format('YYYY-MM-DD');
console.log(today == moment(date).format('YYYY-MM-DD'));
