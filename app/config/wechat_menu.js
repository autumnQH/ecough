module.exports = Object.assing({}, 
{  
  "button":[  
    {  
      "type":"view",  
      "name":"产品订购",
      "url":"http://www.c-fafn.com/product/100001"
    },
    {
      "name":"自助服务",
      "sub_button": [
        {  
          "type":"view",  
          "name":"我的订单",
          "url":"http://www.c-fafn.com/user/my/order"
        },{  
          "type":"view",  
          "name":"联系客服",
          "url":"http://www.c-fafn.com/user/service"
        },{
          "type":"view",
          "name":"福利二维码",
          "url":"http://www.c-fafn.com/user/my/code"
        },{
          "type": "view",
          "name": "个人中心",
          "url": "http://www.c-fafn.com/user"
        }      
      ]
    }
  ]  
});