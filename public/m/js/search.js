$(function(){
    // 使用框架式编程 定义函数和调用函数
    addHistory();
    queryHistory();
    deleteHistory();
    clearHistory();
    initScroll();

    // 1.添加记录函数
    function addHistory(){
        /* 添加记录的思路
            1. 点击搜索添加记录 添加事件
            2. 获取当前输入内容 搜索的内容
            3. 判断如果没有输入内容 提示输入
            4. 把记录添加到本地存储中
            5. 因为连续添加记录应该把数据放到一个数组中 把数组整个加入到本地存储中
            6. 而且还得获取之前的数组之前有数组 使用之前的数组往这个里面添加 新的搜索的值
            7. 而且如果搜索内容重复还要对数组去重（把旧的删掉 在添加新的） 新的内容往数组最前面加
            8. 加完后把数组保存到本地存储中（转成json字符串）
            9. 只要在添加完成后调用查询函数 查询刷新数据了
            10. 添加完成后清空输入框 */
        // 1.点击搜索添加记录 添加事件
        $('.btn-search').on('tap',function(){
            // 2.获取当前输入内容 搜索的内容 把空格去掉 而且把首尾两端空格去掉
            var search = $('.input-search').val().trim();
            // 3. 判断如果没有输入内容 提示输入
            if(search == ''){
                // 提示请输入要搜索 商品 使用MUI的消息框 自动消失消息框
                mui.toast('请输入合法搜索内容!', {
                    duration: 'long',
                    type    : 'div'
                }); 
                return false;
            }
            // 4. 把记录添加到本地存储中
            var searchHistory = localStorage.getItem('searchHistory');
            // 5. 判断之前数组有没有值
            if(searchHistory){
                searchHistory = JSON.parse(searchHistory);
            }else{
                searchHistory = [];
            }
            // console.log(searchHistory);
            // 6. 在添加之前还要进行去除 把之前旧的重复的值删掉
            for(var i = 0;i < searchHistory.length; i ++){
                // 判断当前数组的中每个值的key是否和当前输入search一致
                if(searchHistory[i].key == search){
                    searchHistory.splice(i,1);
                    // 如果有多个重复的数据 删掉一个值数组长度少了一个 i--
                    i--;
                }
            }
            // 7. 往数组里面添加值 push 往后 unshift往前加
            searchHistory.unshift({
                key : search,
                time: new Date().getTime()
            })
            console.log(searchHistory);
            // 8. 把数组转成json字符串存储到本地存储中
            localStorage.setItem('searchHistory',JSON.stringify(searchHistory));
            // 9. 只要在添加完成后调用查询函数 查询刷新数据了
            queryHistory();
            // 10. 添加完成后清空输入框
            $('.input-search').val('')
        })
    }
    // 2.查询记录函数
    function queryHistory(){
        /* 查询思路
            1. 获取存储里面存的数据(把字符串转成数组)
            2. 创建模板 
            3. 调用模板把数据作为template的参数（对象 但是这里是数组 一定要包在一个对象的属性上）
            4. 把模板渲染到ul里面 */
        // 1. 获取存储里面存的数据(把字符串转成数组)
        var searchHistory = localStorage.getItem('searchHistory');
        // 2. 判断之前数组有没有值
        if (searchHistory) {
            // 得把之前的值 转成一个数组 把字符串转成数组JSON.parse()
            searchHistory = JSON.parse(searchHistory);
        } else {
            // 否则没有值就是空 使用空数组
            searchHistory = [];
        }
        console.log(searchHistory);
        // 3. 调用模板传人id 和数据 数据要求是对象把 searchHistory 放到对象的属性上
        var html = template('searchHistoryTpl', {
            list: searchHistory
        });
        // 4.  把生成html放到ul里面
        $('.search-history ul').html(html);

    }
    // 3.删除记录函数
    function deleteHistory(){
        
    }
    // 4.清空记录函数
    function clearHistory(){

    }
    // 5.滑动列表 初始化区域滑动的函数
    function initScroll(){

    }
})