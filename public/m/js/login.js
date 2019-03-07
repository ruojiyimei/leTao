$(function () {
    login();
    // 1. 登录功能的函数
    function login() {
        /* 1. 点击登录按钮实现登录
        2. 获取当前用户输入的用户名和密码
        3. 进行非空验证
        4. 调用后台提供的登录接口 并且传人当前的用户名和密码
        5. 获取后台返回登录信息是成功还是失败  失败就提示用户重新输入 
        6. 如果成功获取当前url 跳转回到这个地址 */
        // 1. 点击登录按钮实现登录
        $('.btn-login').on('tap', function () {
            // 2. 获取当前用户输入的用户名和密码 去掉首尾空格
            var userName = $('.userName').val().trim();
            var password = $('.password').val().trim();
            // 3. 进行非空验证
            if (userName == '') {
                mui.toast('请输入用户名', {
                    duration: 'long',
                    type    : 'div'
                });
                return false;
            }
            if (password == '') {
                mui.toast('请输入密码', {
                    duration: 'long',
                    type    : 'div'
                });
                return false;
            }
            // 4. 调用后台提供的登录接口 并且传人当前的用户名和密码
            $.ajax({
                type: 'post',
                url : '/user/login',
                data: {
                    username: userName,
                    password: password
                },
                success:function(data){
                    console.log(data);
                    // 5. 获取后台返回登录信息是成功还是失败  失败就提示用户重新输入 
                    if(data.error){
                        mui.toast(data.message, {
                            duration: 'long',
                            type    : 'div'
                        });
                    }else{
                        // 6. 如果成功获取当前url 跳转回到这个地址
                        location = getQueryString('returnurl');
                    }
                }
            })
        })
    }
    // 后续需要根据当前 参数值 比如鞋 去搜索商品
    // 公共的 使用正则封装的一个获取url参数值的函数
    function getQueryString(name) {
        var reg = new RegExp("[^\?&]?" + encodeURI(name) + "=[^&]+");
        var arr = location.search.match(reg);
        console.log(arr);
        if (arr != null) {
            return decodeURI(arr[0].substr(arr[0].indexOf('=') + 1));
        }
        return "";
    }
})