const config = require('../../config/config.js')

module.exports = Object.assign({}, 
{  
  "button":[  
    {  
      "type":"view",  
      "name":"产品订购",
      "url":config.SITE_ROOT_URL + "/product/100001"
    },
    {
      "name":"自助服务",
      "sub_button": [
        {  
          "type":"view",  
          "name":"我的订单",
          "url": config.SITE_ROOT_URL + "/user/my/order"
        },{  
          "type":"view",  
          "name":"联系客服",
          "url": config.SITE_ROOT_URL + "/user/service"
        },{
          "type":"view",
          "name":"福利二维码",
          "url": config.SITE_ROOT_URL + "/user/my/code"
        },{
          "type": "view",
          "name": "个人中心",
          "url":  config.SITE_ROOT_URL + "/user"
        }      
      ]
    }
  ]  
});
