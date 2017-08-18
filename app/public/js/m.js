;(function(){
    function obj(){
        var 
        _hideAllNonBaseMenuItem=false,
        _hideTimeline=false,
        wx_ready=false,
        wx_share={
            title:"FLŌWERPLUS（花+）",
            subtitle:"用鲜花点亮生活，鲜花订阅，每周一次，新客户首单送花瓶哦。",
            image:"http://static2.flowerplus.cn/Static/img/flowerpluslogo2.jpg",
            link:"http://t.flowerplus.cn",
            whenMenuShareTimeline:null,
            whenMenuShareAppMessage:null
        };

        this.IS_WEIXIN=false;
        this.OS="PC";
        this.ajax_timeout = 0;
        this.EVENT_CLICK=typeof document.documentElement.ontouchstart!="undefined"?"touchstart":"click";

        this.setAjaxTimeout = function(timeout){
          this.ajax_timeout = timeout;
          console.log('set ajaxtimeout ' + timeout);
        };
        //设置微信分享的标题
        this.setWeixinShareTitle=function(v){
          $.extend(wx_share,v);
        };

        // 隐藏微信右上角菜单
        this.hideAllNonBaseMenuItem=function(){
          _hideAllNonBaseMenuItem=true;
          if(wx_ready){
            wx.hideAllNonBaseMenuItem();
          }
        };

        this.hideTimeline=function(){
          _hideTimeline=true;
          if(wx_ready){
            wx.hideMenuItems({
                menuList: ["menuItem:share:timeline"] 
            });
          }
        };

        var onWeiXinLoaded=function(v){
          wx.config({
              debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
              appId: v.appId, // 必填，公众号的唯一标识
              timestamp: v.timestamp, // 必填，生成签名的时间戳
              nonceStr: v.nonceStr, // 必填，生成签名的随机串
              signature: v.signature,// 必填，签名，见附录1
              jsApiList: ['checkJsApi','onMenuShareTimeline','onMenuShareAppMessage','onMenuShareQQ','onMenuShareWeibo','hideMenuItems','showMenuItems','hideAllNonBaseMenuItem','showAllNonBaseMenuItem','translateVoice','startRecord','stopRecord','onRecordEnd','playVoice','pauseVoice','stopVoice','uploadVoice','downloadVoice','chooseImage','previewImage','uploadImage','downloadImage','getNetworkType','openLocation','getLocation','hideOptionMenu','showOptionMenu','closeWindow','scanQRCode','chooseWXPay','openProductSpecificView','addCard','chooseCard','openCard']
          });

          wx.ready(function(){
              wx_ready=true;
              wx.onMenuShareTimeline({
                  title: wx_share.title, // 分享标题
                  link: wx_share.link, // 分享链接
                  imgUrl: wx_share.image, // 分享图标
                  success: function () {
                    if(typeof wx_share.whenMenuShareTimeline == "function"){
                        (wx_share.whenMenuShareTimeline)();
                    }
                  },
                  cancel: function () { 
                  }
              });

              wx.onMenuShareAppMessage({
                  title: wx_share.title, // 分享标题
                  desc: wx_share.subtitle, // 分享描述
                  link: wx_share.link, // 分享链接
                  imgUrl: wx_share.image, // 分享图标
                  type: '', // 分享类型,music、video或link，不填默认为link
                  dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                  success: function () {
                    if(typeof wx_share.whenMenuShareAppMessage == "function"){
                        (wx_share.whenMenuShareAppMessage)();
                    }
                  },
                  cancel: function () { 
                  }
              });

              if(_hideAllNonBaseMenuItem){
                wx.hideAllNonBaseMenuItem();
              }
              if(_hideTimeline){
                 wx.hideMenuItems({
                    menuList: ["menuItem:share:timeline"] 
                });
              }
          });
        };


        this.toMoney=function(v){
          return Math.round(v*100)/100;
        };

        this.ajaxPost=function(url,data,success_fun,error_fun){
          $.ajax({
            type : "POST",
            url  : url,
            data : data,
            dataType : "json",
            timeout  : this.ajax_timeout,
            success  : success_fun,
            error    : error_fun 
            });
        };

        this.ajaxGet=function(url,data,success_fun,error_fun){
          $.ajax({
            type : "GET",
            url  : url,
            data : data,
            dataType : "json",
            timeout  : this.ajax_timeout,
            success  : success_fun,
            error    : error_fun 
            });
        };

        this.showError=function(errmsg){
            var tips=$(".tips");
            if(tips.length==0){
              tips=$("<div class=\"tips\"></div>").appendTo("body");
            }
            tips.html("<div>"+errmsg+"</div>");
            tips.fadeIn();
            if(typeof window.__ERROR_TIPS_TIMER !="undefined"){
              window.clearTimeout(window.__ERROR_TIPS_TIMER);
            }
            window.__ERROR_TIPS_TIMER=window.setTimeout(function(){
                $(".tips").fadeOut('fast');
              },3000);
            window.setTimeout(function(){
                $(document).one("touchstart",function(e){
                if(e.target.tagName=="BUTTON"){
                  return;
                }
                $(".tips").fadeOut("fast");
              });
              },300);
        };

        this.getSkuValue = function(sku_properties_name,sname){
            var sku=sku_properties_name.split(';'), svalue='';

            for (var i=sku.length-1; i>=0; i--) {
                var sku_item=sku[i].split(':');
                if(sku_item.length!=2){
                    continue;
                }
                if(sku_item[0]==sname){
                    svalue=sku_item[1];
                    break;
                }
            }
            return svalue;
        };

        this.fastClick=function(){
            var supportTouch = function(){
                try {
                    document.createEvent("TouchEvent");
                    return true;
                } catch (e) {
                    return false;
                }
            }();
            var _old$On = $.fn.on;

            $.fn.on = function(){
                if(/click/.test(arguments[0]) && typeof arguments[1] == 'function' && supportTouch){ // 只扩展支持touch的当前元素的click事件
                    var touchStartY, callback = arguments[1];
                    _old$On.apply(this, ['touchstart', function(e){
                        touchStartY = e.originalEvent.changedTouches[0].clientY;
                    }]);
                    _old$On.apply(this, ['touchend', function(e){
                        if (Math.abs(e.originalEvent.changedTouches[0].clientY - touchStartY) > 10) return;
                        e.preventDefault();
                        callback.apply(this, [e]);
                    }]);
                }else{
                    _old$On.apply(this, arguments);
                }
                return this;
            };
            $.fn.click=function(fun){
                $.fn.on.call(this,"click",fun);
            }
        };


        this.init=function(_web_base){
          var u=window.navigator.userAgent;
          if(u.indexOf('Android') > -1 || u.indexOf('Adr') > -1){
            this.OS="Android";
          }else if(!!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)){
            this.OS="iOS";
          }

          if(u.toLowerCase().match(/MicroMessenger/i)=="micromessenger"){
            this.IS_WEIXIN=true;
            this.ajaxGet(_web_base+"weixin_js.html",{url:window.location.href},onWeiXinLoaded);
          }
        }

    }

    var _FP=new obj();_FP.init(_web_base);window.FP=_FP;
})();