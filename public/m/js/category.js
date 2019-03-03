$(function () {
    /* 1. 完成分类左侧列表动态渲染
        1. 使用ajax请求数据
        2. 使用模板引擎渲染列表 */
    // 1. 使用ajax请求数据
    $.ajax({
        // 因为已经在localhost:3000域名下打开页面
        url    : '/category/queryTopCategory',
        success: function (data) {
            // data是后台返回给我们的数据 返回就已经是对象 因为模板引擎要求 后台直接返回模板引擎需要的格式
            // data是这个对象 遍历的是data对象的rows数组
            // console.log(data);
            // 2. 使用模板函数调用 template函数 第一个参数模板id categoryLeftTpl 第二个是数据对象
            // 我们现在后台返回data已经是数据对象了 可以直接使用
            var html = template('categoryLeftTpl', data);
            // 3. 把生成模板渲染到ul里面
            $('.category-left ul').html(html);
        }
    });
    // 存储上次点击id
    var oldId = 0;

    /* 2. 完成分类左侧点击切换分类右侧
        1. 让左边能过点击 
        2. 切换active
        3. 根据左边点击的菜单 请求对应的右边的品牌数据
        4. 把右边的品牌数据使用模板渲染到页面
    */
    // 页面刚刚加载也需要执行 请求右边 默认请求id为1的 由于封装了函数 传人id为1即可
    querySecondCategory(1);
    // 1. 给左侧分类li添加tap事件 tap是一个解决了点击事件延迟的事件
    // 由于li是通过ajax动态添加的元素 页面一开始是没有一开始添加事件不成功
    // 1. 放到ajax完成渲染后再添加事件 也可以使用事件委托(给父元素加事件 通过父元素捕获里面真正触发的子元素)
    $('.category-left ul').on('tap', 'li', function () {
        // 2. 给当前点击li添加active其他的兄弟删除
        $(this).addClass('active').siblings().removeClass('active');
        // 3. 根据当前点击li请求右侧数据 根据li的id 通过li的自定义属性的data-id获取里面值
        // 原生js获取自定义属性的值 通过dataset对象
        // var id = this.dataset['id'];
        // console.log(id);
        // zepto获取自定义属性的值  通过data函数 除了取值还会做类型转换
        var id = $(this).data('id');
        // 如果点击id没有发生变化就不执行请求
        if(id == oldId){
            return false;
        }

        console.log(id);
        // 4. 根据点击的id请求分类右侧的数据 调用封装函数 传人当前点击li的id
        querySecondCategory(id);
        // 请求完成把id赋值给oldId
        oldId = id;
    });


    // 封装一个请求右侧分类的函数 由于id不是固定 通过参数传递
    function querySecondCategory(id) {
        $.ajax({
            url: '/category/querySecondCategory',
            // 由于这个API需要传参 传人id参数 值也是id变量
            data: {
                id: id
            },
            success: function (data) {
                // console.log(data);
                //   5. 调用模板
                var html = template('categoryRightTpl', data);
                //   6. 渲染到右侧分类
                $('.category-right .mui-row').html(html);
            }
        })
    }


    // 3. 初始化区域滚动实现分类左侧滚动
    mui('.mui-scroll-wrapper').scroll({     
        indicators  : false,    //是否显示滚动条 如果不想要滚动条把这个参数的值改成false
        deceleration: 0.0006,   //阻尼系数,系数越小滑动越灵敏        
    });
})