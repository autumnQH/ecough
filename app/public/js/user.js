    $(function() {
    var i = -1;
    var num = 60;
    var clock = '';
    var phone = $('.telphone').text();
    var code = '';
    function doLoop() {
        num--;
        if(num > 0){
            $('#sendAgin').text(num +'秒');
            $('#SendCode').text(num +'秒');
        }else{
            clearInterval(clock);
            $('#sendAgin').removeAttr('disabled');
            $('#sendAgin').text('重新发送');
            $('#SendCode').removeAttr('disabled');
            $('#SendCode').text('下一步');
            num = 10;
        }
    }
    function PhoneCode() {
        let data = {
           phone: $('#uclogin_mobile').val() 
        };
        //ajax
        $.ajax({
            url: '/sms/send',
            data: data,
            method: 'post'
        }).done(function(msg) {
            console.log(msg);
            if(msg.code =='1'){
                code = msg.msg;
            }else{
                alert(msg.msg);
            }
        }).fail(function(jqXHR, textStatus) {

        });
        //end ajax        
    }
    function isPhoneNo(phone) { 
     var pattern = /^1[34578]\d{9}$/; 
     return pattern.test(phone); 
    };        
    
    //是否绑定手机
    if(phone.length<10){
        $('.poupVerifyBox').removeClass('hide');
        $('.firstStep').removeClass('hide');
    }

    //监听手机正确   
    $('#uclogin_mobile').keyup(function(){
      var phone = $('#uclogin_mobile').val();
      var flag = isPhoneNo(phone);
      if(flag){
        if($('#SendCode').text() === '下一步'){
            $('#SendCode').removeAttr('disabled');
        }else{
            return false;
        }
        $('#phoneHolder').text(phone);
      }else{
        $('#SendCode').attr('disabled','');
      }            
    });

    //发送验证吗
    $('#SendCode').on('click',function() {
        PhoneCode();

        $('.secStep').removeClass('hide');
        $('.firstStep').addClass('hide');
        //$('.inputBox div').eq(0).removeClass('border1px');

        $('#sendAgin').attr('disabled','');
        $('#sendAgin').text(num+ '秒');
        $('#SendCode').attr('disabled','');
        $('#SendCode').text(num+ '秒 ');
        clock = setInterval(doLoop, 1000);
    });  

    //返回输入手机号
    $('.goBack').on('click', function() {
        $('.secStep').addClass('hide');
        $('.firstStep').removeClass('hide');
    });

    //重新发送验证码
    $('#sendAgin').on('click', function() {
        PhoneCode();
        $('#sendAgin').attr('disabled','');
        $('#sendAgin').text(num+ '秒');
        $('#SendCode').attr('disabled','');
        $('#SendCode').text(num+ '秒');
        clock = setInterval(doLoop, 1000);
        
    });

    //输入验证吗
    $('#hiddenInput').on('keyup', function() {
        var str  = $(this).val();
        var txt = str.substr(str.length-1,1);
        if(str.length == 0){
            $('.inputBox div').eq(0).text('');  
        }
        $('.inputBox div').addClass('border1px');
        var next = str.length;
        if(next != 0){
            $('.inputBox div').eq(next-1).text(txt).nextAll().text('');                
        }

        //$('.inputBox div').eq(next).removeClass('border1px');

        if(next === 4){
            $('#submit').removeAttr('disabled'); 
        }else{
            $('#submit').attr('disabled','');
        }
    }); 

    function addphone() {
        let data = {
            openid: $('#openid').text(),
            phone: $('#uclogin_mobile').val()
        };
        $.ajax({
            url: '/user/setphone',
            method: 'post',
            data: data
        }).done(function(msg){
            console.log(msg);
        }).fail(function(jqXHR, textStatus){

        });
    }
    //确定验证码
    $('#submit').on('click', function() {
        var code2 = $('#hiddenInput').val();;
        if(code2 === code){
            addphone();
            $('.secStep').addClass('hide');
            $('.lastStep').removeClass('hide');
            $('#hasBindPhonetel').text($('#uclogin_mobile').val());
            $('.telphone').text($('#uclogin_mobile').val());
            setTimeout(function() {
                $('.closeImg').click();
            }, 3000);                       
        }else{
            alert('验证码错误');
        }

    });  
    //关闭窗口
    $('.closeImg').on('click', function() {
        $('.lastStep').addClass('hide');
        $('.poupVerifyBox').addClass('hide');
    });   
    });