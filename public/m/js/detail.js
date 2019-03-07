$(function () {
    // 调用商品详情
    queryProductDetail();
    // 加入购物车
    addCart();


    // 1. 初始化轮播图
    function initSlide() {
        //获得slider插件对象
        var gallery = mui('.mui-slider');
        gallery.slider({
            interval: 1000  //自动轮播周期，若为0则不自动播放，默认为0；
        });
    }

    // 2. 查询商品详情
    function queryProductDetail() {
        /* 1. 根据当前商品id去请求数据 获取url中id参数的值
        2. 调用商品详情的API 传入当前的id参数
        3. 创建商品详情的模板
        4. 渲染到页面 */
        // 1. 根据当前商品id去请求数据 获取url中id参数的值
        var id = getQueryString('id');
        // console.log(id);
        // 2. 调用商品详情的API 传入当前的id参数
        $.ajax({
            url : '/product/queryProductDetail',
            data: {
                id: id
            },
            success: function (data) {
                // console.log(data);
                // 2.1 在调用模板之前把尺码转成数组 尺码返回字符串40-50 但是模板需要数组[40,41..50]
                // 2.2 把字符串按照-分割成 40  和 50  40就是最小值 50就是最大值
                var arr = data.size.split('-');
                // 2.3 定义一个真正的size尺码数组
                var size = [];
                // 2.4 定义一个循环 从最低开始 到最高结束  +arr[0]和arr[1]-0 → 这是两种把字符串转成数字类型的方法
                for (var i = +arr[0]; i < arr[1] - 0; i++) {
                    size.push(i)
                }
                // 2.5 把模板中的字符串40-50 替换成当前数组
                data.size = size;
                // 3. 调用模板 去生成html
                var html = template('detailTpl', data);
                // 4. 把所有详情的模板放到detail里面
                $('#detail').html(html)
                // 5. 等到轮播图渲染完成后再初始化调用初始化轮播图
                initSlide();
                // 6. 得等渲染后再初始化区域滚动
                mui('.mui-scroll-wrapper').scroll({
                    deceleration: 0.0005  //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
                });
                // 7. 数字框也是动态完成要手动初始化 注意这个选择器就是数字框的大容器
                mui('.mui-numbox').numbox();
                // 8. 初始化尺码点击
                $('.product-size button').on('tap', function () {
                    $(this).addClass('mui-btn-warning').siblings().removeClass('mui-btn-warning');
                });
            }
        })
    }

    // 3.加入购物车
    function addCart() {
        /* 1. 点击按钮要加入购物车
        2. 获取当前要加入购物车的商品信息  商品id 选择尺码 选择的数量
        3. 调用加入购物的API 把商品id 尺码 数量 作为参数传递
        4. 后台根据当前登录情况返回 加入购物车成功 或者失败
        5. 成功了 跳转到购物车让用户去查看
        6. 失败就表示当前 没有登录 跳转到登录页（并且要把当前页面的地址带过去 等登录成功后要继续添加） */
        // 1. 点击按钮要加入购物车
        $('.btn-add-cart').on('tap', function () {
            // 2. 获取当前要加入购物车的商品信息  商品id 选择尺码 选择的数量
            var productId   = getQueryString('id');
            var productSize = $('.mui-btn.mui-btn-warning').data('size');
            var productNum  = mui('.mui-numbox').numbox().getValue();
            // console.log(productId);
            // console.log(productSize);
            // console.log(productNum);
            // 3. 调用加入购物的API 把商品id 尺码 数量 作为参数传递
            $.ajax({
                url : '/cart/addCart',
                type: 'post',
                data: {
                    productId: productId,
                    num      : productNum,
                    size     : productSize
                },
                success: function (data) {
                    console.log(data);
                    // 6. 失败就表示当前 没有登录 跳转到登录页（并且要把当前页面的地址带过去 等登录成功后要继续添加）
                    if (data.error) {
                        // 7. 只要有error都表示失败 跳转到登录页面 同时把当前详情页面的地址作为一个参数传递给登录页面
                        location = 'login.html?returnurl=' + location.href;
                    } else {
                        // 8. 加入购物成功 
                        mui.confirm('<h4>加入成功 是否要去购物车查看!</h4>', '<h4>温馨提示</h4>', ['是', '否'], function (e) {
                            //判断如果用户点击否不跳转到购物车
                            if (e.index == 1) {
                                mui.toast('剁手党请继续剁手!', {
                                    duration: 'long',
                                    type    : 'div'
                                })
                            } else {
                                // 8.3 如果点击了是跳转到购物车页面
                                location = 'cart.html';
                            }
                        })
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
        if (arr != null) {
            return decodeURI(arr[0].split('=')[1]);
        }
        return "";
    }
})