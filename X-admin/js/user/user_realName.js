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
        var param =  JSON.stringify({
            'userName': userName});
        count(param)
        $(function () {
            $.ajax({
                url: "http://localhost:8080/userOccupation/getAll",
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
                                        count(JSON.stringify({userName:userName}))
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
                                $("#tableBody").append('<td class="'+this.id+' userName '+this.id+'" style="text-align: center">' + this.userName + '</td>');
                                $("#tableBody").append('<td class="'+this.id+'name '+this.id+'" style="text-align: center">' + this.name + '</td>');
                                $("#tableBody").append('<td class="'+this.id+'idCard '+this.id+'" style="text-align: center">' + this.idCard + '</td>');
                                $("#tableBody").append('<td class="'+this.id+' img" style="text-align: center">' + '<img style="width: 50px;height: 50.4px" ' +
                                    'src="http://localhost:8080/imgs/' + this.idCardImg + '">' + '</td>');
                                $("#tableBody").append('<td id='+this.userId+' class='+this.id+' style="text-align: center">' + '<button class="success btn btn-primary" style="margin-right: 30px">通过</button>'
                                    +'<button class="sersion btn btn-danger">未通过 </button>'+ '</td></tr>');
                                $("#tableBody").append('');
                            });
                            $(".img").click(function () {
                                var ii=  "<img src='" + $(this).find("img").attr("src") + "' />";
                                layer.open({
                                    type: 1,
                                    shade: false,
                                    title: "照片", //不显示标题
                                    //area:['600px','500px'],
                                    area: ['450px','350px'],
                                    content: ii //捕获的元素，注意：最好该指定的元素要存放在body最外层，否则可能被其它的相对元素所影响

                                });
                            })
                            $(".success").click(function () {
                                var id=($(this).parent().attr("class"));
                                var userId=($(this).parent().attr("id"));
                                var relName=($(this).parent().parent().find("."+id+"name").text());
                                var occupation=($(this).parent().parent().find("."+id+"idCard").text());
                                var occupationId=3
                                var param=JSON.stringify({id:userId,relName:relName,occupation:occupation,occupationId:occupationId});
                                updUserD(param);
                                delOcc(id);
                                if(idf){
                                    layer.alert("认证成功")
                                }
                            })
                            $(".sersion").click(function () {
                                var userId=($(this).parent().attr("id"));
                                var id=($(this).parent().attr("class"));
                                $.cookie("User_userId", userId, {expires: 7});
                                layer.open({
                                    type: 2,
                                    title:"原因",
                                    area: ['500px', '500px'],
                                    maxmin: true,
                                    closeBtn: false,
                                    fixed: false,
                                    shadeClose: true,
                                    shade: 0.4,
                                    content: "user_examine.html",
                                    end: function () {
                                        var param=JSON.stringify({id:userId,occupationId:4});
                                        updUserD(param);
                                        delOcc(id)
                                        count( )
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
        buildTable("", 1, 10);//默认空白查全部
        //身份类型下拉框
        //创建结算规则
        $(".sou").bind("click", function () {
            var userName = $("#end").val();
            buildTable(userName, 1, PAGESIZE);
            count(JSON.stringify({userName:userName}))
        });
    });


    function count() {
        $.ajax({
            url: "http://localhost:8080/userOccupation/count",
            method: "post",
            contentType: "application/json",
            dataType: "json",
            success: function (data) {
                $(".z_num").text(data);
            }
        })
    }

    //认证成功删除认证信息
    function delOcc(id) {
        $.ajax({
            url:"http://localhost:8080/userOccupation/delUserOcc",
            method:"post",
            contentType:"application/json",
            dataType:"json",
            data:JSON.stringify({id:id}),
            success:function (data) {
                $("."+id).remove();
            }
        })

    }
    var idf= false;
    //认证成功更改用户信息
    function updUserD(param) {
        $.ajax({
            url:"http://localhost:8080/userInfoDetails/update",
            method:"post",
            contentType:"application/json",
            dataType:"json",
            data:param,
            success:function (data) {
                if (data.code==200){
                    idf= true
                }
            }
        })
    }
})