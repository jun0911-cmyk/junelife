$('#isLogin').hide();

var accessToken = localStorage.getItem('accessToken');
var accessUser = localStorage.getItem('accessUser');

$(function() {
    $.ajax({
        type: 'GET',
        url: '/:id',
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Content-type","application/json");
            xhr.setRequestHeader("Authorization", "Bearer " + accessToken);
            xhr.setRequestHeader("User", accessUser);
        },
        datatype: 'json',
        success: function(result) {
            var err = result.err;
            var status = result.status;
            var accessToken = result.newAccessToken;
            if (status == false || err) {
                location.href = '/user/login';
            } else if (status == true) {
                $('#isLogin').show();
                $('#isNotLogin').hide();
                if (accessToken) {
                    localStorage.setItem('accessToken', accessToken);
                }
            }
        },
        error: function(request,status,error) { 
            console.log('서버 통신중 오류가 발생하였습니다.');
            console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
        },
    });
});