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

    var PAGESIZE = 10;
    $(function () {
        $.jqPaginator('#pagination1', {
            totalPages: 10,
            visiblePages: 9,
            currentPage: 1,
            onPageChange: function (num, type) {

            }
        });
    })

    //生成表格
    function buildTable(userName, pageNumber, pageSize) {

        var reqParams = JSON.stringify({
            'userName': userName,
            'pageIndex': pageNumber,
            'pageSize': pageSize
        });//请求数据
        var param = JSON.stringify({
            'userName': userName});
        count(param)
        $(function () {
            $.ajax({
                url: "http://localhost:8080/userFans/getById",
                method: "POST",
                data: reqParams,
                async: false,
                contentType: "application/json",
                dataType: "json",
                success: function (data) {
                    if (data != "") {
                        // options.totalPages = data.pages;
                        $(function () {
                            $.jqPaginator('#pagination1', {
                                totalPages: data.pages == 0 ? 1 : data.pages,
                                visiblePages: 3,
                                currentPage: 1,
                                onPageChange: function (num, type) {
                                    if (type != "init") {
                                        var userName = $("#end").val();

                                        buildTable(userName,num, PAGESIZE);
                                    }
                                }
                            });
                        })
                        var dataList = data.dataList;
                        $("#tableBody").empty();//清空表格内容
                        if (dataList.length > 0) {
                            $(dataList).each(function () {//重新生成
                                $("#tableBody").append('<tr>');
                                $("#tableBody").append('<td >' + this.userName + '</td>');
                                $("#tableBody").append('<td>' + this.fansName + '</td>');

                                $("#tableBody").append('<td>' + this.createTime + '</td>');
                                $("#tableBody").append('</tr>');
                            });

                        } else {
                            $("#tableBody").html('<tr><th colspan ="10"><center>查询无数据</center></th></tr>')
                        }
                    }
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
        buildTable("", 1, 10);//默认空白查全部
        //身份类型下拉框
        //创建结算规则
        $(".sou").bind("click", function () {
            var userName = $("#end").val();
            buildTable(userName, 1, PAGESIZE);

        });
    });

    function count(param) {
        $.ajax({
            url: "http://localhost:8080/userFans/count",
            method: "post",
            contentType: "application/json",
            dataType: "json",
            data: param,
            success: function (data) {
                $(".z_num").text(data);
            }
        })
    }
})