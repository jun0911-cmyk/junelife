const faild_message = document.getElementById('faild_singup');
const singup_btn = document.getElementById('singup_btn');

$('#faild_singup').hide();

$(function() {
    $(document).on('click', '#singup_btn', function() {
        $.ajax({
            type: 'POST',
            url: '/user/singup',
            data: {
                user_id: $("#id").val(),
                username: $("#username").val(),
                email: $("#email").val(),
                password: $("#password").val(),
                repassword: $("#re_password").val(),
            },   
            datatype: 'json',
            success: function(result) {
                var status = result.status_code;
                var singup_message = result.msg;
                
                if (status == '01' || status == '10' || status == '11' || status == '00' || status == '-1') {
                    faild_message.innerText = singup_message;
                    singup_btn.disabled = true;
                    $('#faild_singup').show();
                    setTimeout(function() {
                        singup_btn.disabled = false;
                        $('#faild_singup').hide();
                    }, 2000);
                } else if (status == '0') {
                    location.href = '/user/login';
                }
            },
            error: function(request,status,error) { 
                console.log('서버 통신중 오류가 발생하였습니다.');
                console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
            }
        });
    });

    $(document).on('keydown', function(event) {
        if (event.key == 'Enter') {
            $.ajax({
                url: '/user/singup',
                datatype: 'json',
                type: 'POST',
                data: {
                    user_id: $("#id").val(),
                    username: $("#username").val(),
                    email: $("#email").val(),
                    password: $("#password").val(),
                    repassword: $("#re_password").val(),
                },   
                success: function(result) {
                    var status = result.status_code;
                    var singup_message = result.msg;
                    
                    if (status == '01' || status == '10' || status == '11' || status == '00' || status == '-1') {
                        faild_message.innerText = singup_message;
                        singup_btn.disabled = true;
                        $('#faild_singup').show();
                        setTimeout(function() {
                            singup_btn.disabled = false;
                            $('#faild_singup').hide();
                        }, 2000);
                    } else {
                        location.href = '/user/login';
                    }
                },
                error: function(request,status,error) { 
                    console.log('서버 통신중 오류가 발생하였습니다.');
                    console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
                }
            });
        }
    });
});