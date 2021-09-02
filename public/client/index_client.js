$('#search_recode_result').hide();
$('#search_live_result').hide();
$(function() {
    $.ajax({
        type: 'GET',
        url: '/',
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Content-type","application/json");
            xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('accessToken'));
            xhr.setRequestHeader("User", localStorage.getItem('accessUser'));
        },
        datatype: 'json',
        success: function(result) {
            var err = result.err;
            var status = result.status;
            var accessToken = result.newAccessToken;
            if (status == false || err) {
                location.href = '/user/login';
            } else if (status == true) {
                if (accessToken) {
                    localStorage.setItem('accessToken', accessToken);
                }
                Vue.component('account-component', {
                    template: `
                        <div class="dropdown">
                            <a href="javascript:void(0)" class="singup">
                                <i class="fas fa-user-circle" style="font-size: 27px; margin-top: 10px"></i>
                            </a>
                            <div class="dropdown-content">
                                <a href="/student/check/class">나의 단계</a>
                                <a href="#">내 정보</a>
                                <a href="#">정보 변경</a>
                                <a href="/user/logout">로그아웃<i class="fas fa-sign-out-alt"></i></a>
                            </div>
                        </div>
                    `
                });

                Vue.component('bell-component', {
                    template: `
                        <i class="fas fa-bell" style="font-size: 27px; margin-left: 30px;"></i>
                    `
                });

                new Vue({
                    el: '#account'
                });
            }
        },
        error: function(request,status,error) { 
            console.log('서버 통신중 오류가 발생하였습니다.');
            console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
        },
    });
});