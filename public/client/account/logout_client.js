$.ajax({
    url: '/user/logout',
    datatype: 'json',
    type: 'POST',
    data: {
        user: localStorage.getItem('accessUser')
    },   
    success: function(result) {
        var status = result.status;
        if (status == true) {
            location.href = '/';
            localStorage.clear();
        } else if (status == false) {
            location.href = '/user/login';
            localStorage.clear();
        }
    },
    error: function(request,status,error) { 
        console.log('서버 통신중 오류가 발생하였습니다.');
        console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
    }
});
