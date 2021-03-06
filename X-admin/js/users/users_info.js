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
    function buildTable(isExamine, pageNumber, pageSize) {

        var reqParams = JSON.stringify({
            'isExamine': isExamine,
            'pageIndex': pageNumber,
            'pageSize': pageSize
        });//请求数据
        var param = JSON.stringify({'isExamine': isExamine})
        count(param)
        $(function () {
            $.ajax({
                url: "http://localhost:8080/usersInfo/getAll",
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

                                        buildTable(1, num, PAGESIZE);
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
                                $("#tableBody").append('<td class="'+this.id+'">' + this.usersFamily + '</td>');
                                $("#tableBody").append('<td class="'+this.id+'">' + '<img style="width: 50px;height: 50.4px" ' +
                                    'src="http://localhost:8080/imgs/' + this.usersFamilyImg + '">' + '</td>');
                                $("#tableBody").append('<td class="'+this.id+'">' + this.usersGoods + '</td>');
                                $("#tableBody").append('<td class="'+this.id+'">' + this.describe + '</td>');
                                $("#tableBody").append
                                ('<td id='+this.usersId+' class="'+this.id+'" style="text-align: center">' +
                                    '<a class="z_pr environment" style="margin-right: 10px">寄养环境</a>' +
                                    '<a class="z_pr experience" style="margin-right: 10px">寄养经验</a>' +
                                     '</td>');
                                $("#tableBody").append
                                ('<td id='+this.usersId+' class='+this.id+' style="text-align: center">' +
                                    '<button class="success btn btn-primary" style="margin-right: 30px">通过</button>'
                                    +'<button id="'+this.userId+'" class="sersion btn btn-danger">未通过 </button>'+ '</td></tr>');

                            });
                            $(".z_pr").hover(function () {
                                $(this).css("color", "red")
                            }, function () {
                                $(this).css("color", "#333")
                            })
                            //查看环境
                            $(".environment").click(function () {
                                var id = $(this).parent().attr("class");
                                $.cookie("users_id",id,{expires: 7})
                                $.cookie("isEnvironment",1,{expires: 7})
                                layer.open({
                                    type: 2,
                                    area: ['800px', '600px'],
                                    maxmin: true,
                                    closeBtn: false,
                                    fixed: false,
                                    shadeClose: true,
                                    shade: 0.4,
                                    btn:[ '关闭'],
                                    content: "users_environment.html"
                                });
                            })
                            //查看寄养经验
                            $(".experience").click(function () {
                                $.cookie("isExperience",1,{expires: 7})
                                var id = $(this).parent().attr("class");
                                $.cookie("users_id",id,{expires: 7})
                                layer.open({
                                    type: 2,
                                    area: ['800px', '600px'],
                                    maxmin: true,
                                    closeBtn: false,
                                    fixed: false,
                                    shadeClose: true,
                                    shade: 0.4,
                                    btn:[ '关闭'],
                                    content: "users_experience.html"
                                });
                            })

                            //认证成功执行
                            $(".success").click(function () {
                                var id = $(this).parent().attr("class");
                                succe12(id);
                            })
                            //认证失败执行
                            $(".sersion").click(function () {
                                var userId=($(this).attr("id"));
                                var id = $(this).parent().attr("class");
                                alert(userId);
                                $.cookie("User_userId1", userId, {expires: 7});
                                layer.open({
                                    type: 2,
                                    title:"原因",
                                    area: ['500px', '500px'],
                                    maxmin: true,
                                    closeBtn: false,
                                    fixed: false,
                                    shadeClose: true,
                                    shade: 0.4,
                                    content: "users_examine.html",
                                    end: function () {
                                        succe(id)
                                    }
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
        //生成底部分页栏
        buildTable(1, 1, 10);//默认空白查全部
        //身份类型下拉框
        //创建结算规则

    });

    /**
     * 获取查询页码
     * @param param
     */
    function count(param) {
        $.ajax({
            url: "http://localhost:8080/usersInfo/count",
            method: "post",
            contentType: "application/json",
            dataType: "json",
            data: param,
            success: function (data) {
                $(".z_num").text(data);
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


    //认证成功
    function succe12(id) {
        $.ajax({
            url:"http://localhost:8080/usersInfo/updUsersInfo",
            method:"post",
            contentType:"application/json",
            dataType:"json",
            data:JSON.stringify({id:id,'isExamine': 2}),
            success:function (data) {
                if(data.code==200){
                    layer.alert(data.msg);
                    $("."+id).remove();
                }
            }
        })
        $.ajax({
            url:"http://localhost:8080/usersEnvironment/updUsersEnvironment",
            method:"post",
            contentType:"application/json",
            dataType:"json",
            data:JSON.stringify({usersId:id,'isEnvironment': 2}),
            success:function (data) {

            }
        })
        $.ajax({
            url:"http://localhost:8080/usersExperience/updUsersExperience",
            method:"post",
            contentType:"application/json",
            dataType:"json",
            data:JSON.stringify({usersId:id,'isExperience': 2}),
            success:function (data) {

            }
        })
    }

    //认证失败
    function succe(id) {
        $.ajax({
            url:"http://localhost:8080/usersInfo/updUsersInfo",
            method:"post",
            contentType:"application/json",
            dataType:"json",
            data:JSON.stringify({id:id,'isExamine': 4}),
            success:function (data) {
                if(data.code==200){
                    $("."+id).remove();
                }
            }
        })
    }

})