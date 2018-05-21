$(function () {

    layui.use('laydate', function () {
        var laydate = layui.laydate;

        //执行一个laydate实例
        laydate.render({
            elem: '#start' //指定元素
        });

        //执行一个laydate实例
        laydate.render({
            //elem: '#end' //指定元素
        });
    });



    //生成表格
    function buildTable(dictKey) {

        var reqParams = JSON.stringify({
            fItemKey:dictKey
        });//请求数据

        $(function () {
            $.ajax({
                url: "http://localhost:8080/dictItem/getByParam",
                method: "POST",
                data: reqParams,
                async: false,
                contentType: "application/json",
                dataType: "json",
                success: function (data) {
                   var txt = doT.template($("#type").text());
                   $("#tableBody").append(txt(data));
                },
                error: function (e) {
                    $("#tableBody").html('<tr><th colspan ="10"><center>查询无数据</center></th></tr>');
                }
            });
        });
    }

    //渲染完就执行
    $(function () {
        //生成底部分页栏
        buildTable(1);//默认空白查全部
        //身份类型下拉框
        //创建结算规则

    });


    function role() {
        var menuName = $.cookie("menuName");
        var staffId = $.cookie("staffId");
        $.ajax({
            url: "http://localhost:8080/jc/getByMenu",
            method: "post",
            async: false,
            cache: true,
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({menuName: menuName, staffId: staffId}),
            success: function (data) {
                if (data != null) {
                    var list = data.data;
                    for (var i = 0; i < list.length; i++) {
                        if (list[i].jurisdictionName == "改") {
                            isf = true;
                            return;
                        }
                    }
                }
            }
        })
    }
    var isf = false;

})