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

    var isUpdata = false;
    var isInsert = false;
    var isDelete = false;
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
            'phone': userName,
            'sex': itemName,
            'pageIndex': pageNumber,
            'pageSize': pageSize
        });//请求数据
        var param = JSON.stringify({'userPhone': userName, 'itemName': itemName})
        $(function () {
            $.ajax({
                url: "http://localhost:8080/staffUrRole/getListByParam ",
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
                            $(dataList).each(function () {//重新生成
                                $("#tableBody").append('<tr class="tr' + this.id + '">');
                                $("#tableBody").append('<td class="tr' + this.id + '" >' + this.id + '</td>');
                                $("#tableBody").append('<td class="tr' + this.id + ' name' + this.id + '">' + this.staffName + '</td>');
                                $("#tableBody").append('<td class="tr' + this.id + '">' + this.phone + '</td>');
                                $("#tableBody").append('<td class="tr' + this.id + '">' + this.sex + '</td>');
                                $("#tableBody").append('<td class="tr' + this.id + ' wages' + this.id + '">' + this.wages + '</td>');
                                $("#tableBody").append('<td class="tr' + this.id + '">' + this.idCard + '</td>');
                                $("#tableBody").append('<td class="tr' + this.id + ' contact' + this.id + '">' + this.contact + '</td>');
                                $("#tableBody").append('<td class=" tr' + this.id + '">' + this.time + '</td>');
                                $("#tableBody").append('<td class="tr' + this.id + ' roleName' + this.id + '">' + this.roleName + '</td>');
                                $("#tableBody").append('<td class="tr' + this.id + '">' +
                                    '<span class="id" style="display: none">' + this.id + '</span>' +
                                    '  <a class="bian" ' +
                                    'href="javascript:;">\n' +
                                    '   <i class="layui-icon">&#xe642;</i>\n' +
                                    '   </a>\n' +
                                    '  <a title="删除" class="del" href="javascript:;">\n' +
                                    '   <i class="layui-icon">&#xe640;</i>\n' +
                                    '    </a>'
                                    + '</td>');
                                $("#tableBody").append('</tr>');
                            });
                            $("#tableBody").append('<tr class="insert">' +
                                '<th colspan ="11"><center>添加员工</center></th></tr>');
                            cli();
                            insertStaff();
                            delStaff();
                        } else {
                            $("#tableBody").html('<tr><th colspan ="11"><center>查询无数据</center></th></tr>')
                        }
                    }
                },
                error: function (e) {
                    $("#tableBody").html('<tr><th colspan ="11"><center>查询无数据</center></th></tr>');
                }
            });
        });
    }

    //渲染完就执行
    $(function () {

        //生成底部分页栏
        buildTable("", "", 1, 10);//默认空白查全部
        //创建结算规则
        $(".sou").bind("click", function () {
            var userName = $("#end").val();
            var itemName = $("#position").val();
            buildTable(userName, itemName, 1, PAGESIZE);
        });
    });

    //查询权限是否可更改
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
                            isUpdata = true;

                        }
                        if (list[i].jurisdictionName == "增") {
                            isInsert = true;
                        }
                        if (list[i].jurisdictionName == "删") {
                            isDelete = true;
                        }

                    }
                }
            }
        })
    }

    //修改员工
    function cli() {

        $(".bian").click(function () {
            role()
            if (!isUpdata) {
                alert("权限不足");
                return
            } else {
                var idd = $(this).parent().find(".id").text();
                if (idd == 1) {
                    layer.alert("改员工为管理员，权限不能修改");
                    return;
                }
                else {
                    $.cookie("idd", idd, {expires: 7});
                    layer.open({
                        type: 2,
                        area: ['750px', '500px'],
                        maxmin: true,
                        closeBtn: false,
                        fixed: false,
                        shadeClose: true,
                        shade: 0.4,
                        content: "staff_edit.html",
                        end: function () {
                            var df = $.cookie("staffName2");
                            var dd = $.cookie("wages2");
                            var ds = $.cookie("contact2");
                            var da = $.cookie("roleName2");
                            $(".name" + idd).html(df);
                            $(".wages" + idd).html(dd);
                            $(".contact" + idd).html(ds);
                            $(".roleName" + idd).html(da);
                        }
                    });
                }
            }
        })

    }

    //添加员工
    function insertStaff() {
        $(".insert").click(function () {
            role()
            if (!isInsert) {
                alert("权限不足");
                return
            } else {
                layer.open({
                    type: 2,
                    area: ['750px', '600px'],
                    maxmin: true,
                    closeBtn: false,
                    fixed: false,
                    title: "添加",
                    shadeClose: true,
                    shade: 0.4,
                    content: "staff_insert.html",
                    end: function () {
                        var dt = $.cookie("dt")
                        $(".insert").before(dt);
                    }
                });
            }
        })
    }

    function delStaff() {
        $(".del").click(function () {
            role()
            if (!isDelete) {
                alert("权限不足");
                return
            } else {
                var id = $(this).parent().find(".id").text();
                if (id == 1) {
                    layer.alert("改员工为管理员，权限不能修改");
                    return;
                } else {
                    layer.confirm('是否确定删除？', {
                        btn: ['确定', '关闭'] //按钮
                    }, function () {
                        $(".tr" + id).remove();
                        //删除
                        del(id);
                    }, function () {

                    });
                }
            }
        })
    }

    //删除员工
    function del(id) {
        var param = JSON.stringify({id: id});
        $.ajax({
            url: "http://localhost:8080/staffInfo/del",
            method: "post",
            contentType: "application/json",
            dataType: "json",
            data: param,
            success: function (data) {
                if (data.code == 200) {
                    layer.confirm(data.msg);
                }
            }
        })
    }
})