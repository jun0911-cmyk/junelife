var accessToken = localStorage.getItem('accessToken');
$(function() {
    $(document).on('click', '#login_btn', function() {
        $.ajax({
            url: '/',
            datatype: 'json',
            type: 'POST',
            success: function(result) {
            },
            error: function(request,status,error) { 
                console.log('서버 통신중 오류가 발생하였습니다.');
                console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
            },
        });
    });
});