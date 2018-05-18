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
    function buildTable(userName, itemName, pageNumber, pageSize) {
        if (itemName == "请选择") {
            itemName = "";
        }
        var reqParams = JSON.stringify({
            'userPhone': userName,
            'itemName': itemName,
            'pageIndex': pageNumber,
            'pageSize': pageSize
        });//请求数据
        var param = JSON.stringify({'userPhone': userName, 'itemName': itemName})
        count(param)
        $(function () {
            $.ajax({
                url: "http://localhost:8080/userInfo/sel",
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
                                        var itemName = $("#position").val();
                                        if (itemName == "请选择") {
                                            itemName = "";
                                        }
                                        buildTable(userName, itemName, num, PAGESIZE);
                                    }
                                }
                            });
                        })
                        var dataList = data.dataList;
                        $("#tableBody").empty();//清空表格内容
                        if (dataList.length > 0) {
                            var i = 1
                            $(dataList).each(function () {//重新生成
                                $("#tableBody").append('<tr>');
                                $("#tableBody").append('<td >' + this.id + '</td>');
                                $("#tableBody").append('<td>' + this.userCode + '</td>');
                                $("#tableBody").append('<td>' + '<img style="width: 50px;height: 50.4px" ' +
                                    'src="http://localhost:8080/imgs/' + this.portrait + '">' + '</td>');
                                $("#tableBody").append('<td>' + this.userName + '</td>');
                                $("#tableBody").append('<td>' + this.userPhone + '</td>');
                                $("#tableBody").append('<td>' + this.itemName + '</td>');
                                $("#tableBody").append('<td>' + this.qq + '</td>');
                                $("#tableBody").append('<td>' + this.sina + '</td>');
                                if (this.isUse == 1) {

                                    $("#tableBody").append('<td style="text-align: center">'
                                        + "<span class='use' style='display:none'>" + this.isUse + "</span>"
                                        + "<span class='id' style='display:none'>" + this.id + "</span>"
                                        + "<span class=\"isUse layui-btn layui-btn-normal\">已启用</span>"
                                        + '</td>');
                                } else {
                                    $("#tableBody").append('<td style="text-align: center">'
                                        + "<span class='use' style='display:none'>" + this.isUse + "</span>"
                                        + "<span class='id' style='display:none'>" + this.id + "</span>" +
                                        "<span class=\"isUse layui-btn layui-btn-danger\">已停用</span>"
                                        + '</td>');
                                }
                                $("#tableBody").append('<td class="z_pr">'
                                    + "<span class='fid' style='display:none'>" + this.id + "</span>"
                                    + "<span class='name' style='display:none'>" + this.userName + "</span>"
                                    + "<span class='fisUse' style='display:none'>" + this.itemKey + "</span>"
                                    + "<span class='portrait' style='display:none'>" + this.portrait + "</span>"
                                    + "查看详情" + '</td>');
                                $("#tableBody").append('</tr>');
                                i++;
                            });
                            cli();
                            $(".z_pr").hover(function () {
                                $(this).css("color", "red")
                            }, function () {
                                $(this).css("color", "#333")
                            })
                            $(".z_pr").click(function () {
                                var id = $(this).find(".fid").text();
                                var isUse = $(this).find(".fisUse").text();
                                var name = $(this).find(".name").text();
                                var portrait = $(this).find(".portrait").text();
                                $.cookie("name", name, {expires: 7});
                                $.cookie("id", id, {expires: 7});
                                $.cookie("isUse", isUse, {expires: 7});
                                $.cookie("portrait", portrait, {expires: 7})
                                layer.open({
                                    type: 2,
                                    area: ['800px', '600px'],
                                    maxmin: true,
                                    closeBtn: false,
                                    fixed: false,
                                    shadeClose: true,
                                    shade: 0.4,
                                    btn:[ '关闭'],
                                    content: "user/user_edit.html"
                                });

                            })
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
        type();
        //生成底部分页栏
        buildTable("", "", 1, 10);//默认空白查全部
        //身份类型下拉框
        //创建结算规则
        $(".sou").bind("click", function () {
            var userName = $("#end").val();
            var itemName = $("#position").val();
            buildTable(userName, itemName, 1, PAGESIZE);
        });
    });

    /**
     * 获取查询页码
     * @param param
     */
    function count(param) {
        $.ajax({
            url: "http://localhost:8080/userInfo/count",
            method: "post",
            contentType: "application/json",
            dataType: "json",
            data: param,
            success: function (data) {
                $(".z_num").text(data);
            }
        })
    }

    /**
     * 获取用户身份类型
     * @param param
     */
    function type() {
        $.ajax({
            url: "http://localhost:8080/dictItem/getByParam",
            method: "post",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({dictKey: "1"}),
            success: function (data) {
                var txt = doT.template($("#position-temp").text());
                $("#position").html(txt(data));
            }
        })
    }

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
    /**
     * 更改用户状态
     * @param id
     * @param isUse
     */
    function updateUser(id, isUse) {
        var param = JSON.stringify({id: id, isUse: isUse});
        $.ajax({
            url: "http://localhost:8080/userInfo/upd",
            method: "post",
            dataType: "json",
            async: true,
            cache: false,
            timeout: '30000',
            contentType: "application/json",
            data: param,
            success: function (data) {
                if (data.code == 200) {
                    layer.alert(data.msg);
                }
            }
        })
    }

    function cli() {
        $(".isUse").click(function () {
            role()
            if (!isf) {
                alert("权限不足");
                return
            }else {
                var id = $(this).parent().find(".id").text();
                var isUse = $(this).parent().find(".use").text();
                if (isUse == 1) {
                    if (confirm("确定停用此用户吗？")) {
                        isUse = 2;
                        $(this).parent().find(".use").text(isUse);
                        updateUser(id, isUse);
                        $(this).text("已停用").css("background-color", "#FF5722")
                        return
                    } else {
                        return
                    }
                }
                else if (isUse == 2) {
                    if (confirm("确定启用此用户吗？")) {
                        isUse = 1;
                        $(this).parent().find(".use").text(isUse);
                        updateUser(id, isUse);
                        $(this).text("已启用").css("background-color", "#1E9FFF")
                        return
                    } else {
                        return
                    }
                }
            }
        })
    }

})