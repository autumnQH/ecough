$(function() {
    new Swiper('.swiper-container', {
        pagination: '.swiper-pagination',
        paginationClickable: true,
        loop:true
    });
	var EQ =0;
    //立即购买
    $('#pay').on('click', function(event) {
        var specifications = $.trim($('.active').text());
        var total = Math.abs(parseInt($('#total').children().eq(EQ).find('input').val()));
        if ($(this).attr('disabled')) {
            $('#pay').attr('href', "/my/pay?openid=<%= userinfo.openid %>&total=" + total + "&specifications=" + specifications + "&product=<%= store.product_id %>");
        } else {
            return;
        }
    });


    $('.jian').attr('disabled', true);

    $('#total .add').on('click', function() {
        var t = $(this).parent().next();
        var a = $(this).parent().parent().next().children().text();
        var o = $(this).parent().parent().next().next().text();
        if (a != '已售馨') {
            if (parseInt(t.val()) < o) {
                t.val(Math.abs(parseInt(t.val())) + 1);
                $(this).parent().parent().next().children().text(parseInt(a) - 1);
            }

            if (parseInt(t.val()) != 1) {
                $(this).parent().next().next().find('button').attr('disabled', false);
            }

        }

    });

    $('#total .jian').on('click', function() {
        if ($(this).parent().prev().val() <= 1) {
            $(this).attr('disabled', true);
            return;
        }
        var t = $(this).parent().prev();
        t.val(Math.abs(parseInt(t.val())) - 1);
        var a = $(this).parent().parent().next().children().text();
        $(this).parent().parent().next().children().text(parseInt(a) + 1);
        if (parseInt(t.val()) == 1) {
            $(this).attr('disabled', true);
        }
    });

    $('#total .form-control').on('change', function() {
        var o = $(this).parent().parent().find('span').last().text();
        var v = Math.abs(parseInt($(this).val()));
        if (parseInt(v) <= 1) {
            $('.jian').attr('disabled', true);
        }
        var t = $(this).parent().next().children();
        if (parseInt($(this).val()) > o) {
            $(this).val(o);
            t.text(parseInt(o - $(this).val()));
        } else {
            t.text(parseInt(o) - v);
            $(this).next().children().attr('disabled', false);
        }
    });


    $('#menu_specifications button').on('click', function() {   	
				EQ = $(this).index()-1;
        $("#menu_specifications button").removeClass("active");
        $(this).addClass("active");
        var specifications = $(this).text();
        $('#s_money').children().hide();
        $('#s_money').children().eq(EQ).show();
        $('#total').children().addClass('hide');
        var sub = $('#total').children().eq(EQ);
        sub.removeClass('hide');
        if (sub.find('span').last().text() == '0') {
            sub.find('div').last().html('<label style="color: red;">已售馨</label>');
            $('#pay').text('已售馨').attr('disabled', false);
        } else {
            $('#pay').text('立即订购').attr('disabled', true);
        }
        var a = $('#total').children().eq(EQ);
        if (parseInt(a.find('input').val()) == 0) {
            a.find('input').prev().find('button').click();
        }
    });

    $('#menu_specifications button').eq(0).click();


    $.ajax({
        url: '/wx/sdk',
        type: 'get',
        data:{
          url: encodeURIComponent(location.href.split('#')[0])
        } 
    }).done(function(msg) {

        var news = {
            title: '双十一大促销:买二赠一',
            desc: '双十一大促销:买二送一',
            link: 'www.e-cough.com/product/100001',
            imgUrl: 'http://www.ecough.cn/images/fangwumaichuangtie_share.jpeg'
        };

        wx.config({
          debug: false,
          appId: msg.appid,
          timestamp: msg.timestamp,
          nonceStr: msg.nonceStr,
          signature: msg.signature,
          jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone']
        });//wx/config end

        //wx.ready(function() {
            
            wx.onMenuShareTimeline({//分享朋友圈
                title: '我知道被了',
                link: 'www.e-cough.com/product/100001',
                imgUrl: 'http://www.ecough.cn/images/fangwumaichuangtie_share.jpeg',
                trigger: function(res) {

                },
                success: function(res) {
                    alert('??ready');
                },
                cancel: function(res) {

                },
                fail: function(res) {

                }
            });//分享朋友圈 end

            wx.onMenuShareAppMessage({//分享给朋友
                title: news.title,
                desc: news.desc,
                link: news.link,
                imgUrl: news.imgUrl,
                success: function() {
                    
                },
                cancel: function() {
                    
                }
            });//分享给朋友 end

            wx.onMenuShareQQ({//分享到QQ
                title: news.title,
                desc: news.desc,
                link: news.link,
                imgUrl: news.imgUrl,
                success: function() {
                    
                },
                cancel: function() {
                    
                }
            });//分享到QQ end

            wx.onMenuShareWeibo({//分享到腾讯微博
                title: news.title,
                desc: news.desc,
                link: news.link,
                imgUrl: news.imgUrl,
                success: function() {
                    
                },
                cancel: function() {
                    
                }
            });//分享到腾讯微博 end

            wx.onMenuShareQZone({//分享到QQ空间
                title: news.title,
                desc: news.desc,
                link: news.link,
                imgUrl: news.imgUrl,
                success: function() {
                    
                },
                cancel: function() {
                    
                }
            });//分享到QQ空间 end
       // });//ready end       
    });//ajax end
});
