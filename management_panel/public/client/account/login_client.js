const login_btn = document.getElementById('login_btn');

$('#faild_login').hide();

$(function() {
    $(document).on('click', '#login_btn', function() {
        $.ajax({
            url: '/user/login',
            datatype: 'json',
            type: 'POST',
            data: {
                user_id: $("#id").val(),
                password: $("#password").val(),
            },   
            success: function(result) {
                var err = result.err;
                var auth = result.auth;
                if (err) {
                    console.log(err);
                } else if (!err) {
                    if (auth == 1) {
                        login_btn.disabled = true;
                        $('#faild_login').show();
                        setTimeout(function() {
                            login_btn.disabled = false;
                            $('#faild_login').hide();
                        }, 2000);
                    } else if (auth == 0) {
                        location.href = '/';
                    }
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
                url: '/user/login',
                datatype: 'json',
                type: 'POST',
                data: {
                    user_id: $("#id").val(),
                    password: $("#password").val(),
                },   
                success: function(result) {
                    var err = result.err;
                    var auth = result.auth;
                    if (err) {
                        console.log(err);
                    } else if (!err) {
                        if (auth == 1) {
                            login_btn.disabled = true;
                            $('#faild_login').show();
                            setTimeout(function() {
                                login_btn.disabled = false;
                                $('#faild_login').hide();
                            }, 2000);
                        } else if (auth == 0) {
                            location.href = '/';
                        }
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