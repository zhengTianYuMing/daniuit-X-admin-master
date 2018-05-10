$(function () {

    layui.use('element', function () {
        var element = layui.element;

    });
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
    getAllRole();

    //获取全部角色
    function getAllRole() {
        $.ajax({
            url: "http://localhost:8080/role/getAll",
            method: "post",
            contentType: "application/json",
            dataType: "json",
            success: function (data) {
                var txt = doT.template($("#role-temp").text());
                $("#tableBody").html(txt(data));
                add();
                del()
                update();
                $("tr").click(function () {
                    var txt1 = $(this).find("td:eq(0)").attr("class");
                    roleMenu(txt1);
                })
            }
        })
    }

    //查询角色
    function role() {

        var staffId = $.cookie("staffId");
        $.ajax({
            url: "http://localhost:8080/jc/getByMenu",
            method: "post",
            async: false,
            cache: true,
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({menuName: "更改权限", staffId: staffId}),
            success: function (data) {
                if (data != null) {
                    var list = data.data;
                    for (var i = 0; i < list.length; i++) {
                        if (list[i].jurisdictionName == "改") {
                            isUpdate = true;
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

    var isInsert = false;

    //添加角色
    function add() {
        $(".insert").click(function () {
            role()
            if (!isInsert) {
                alert("权限不足");
                return
            } else {
                layer.open({
                    type: 2,
                    title: "添加",
                    area: ['400px', '200px'],
                    maxmin: true,
                    closeBtn: false,
                    fixed: false,
                    shadeClose: true,
                    shade: 0.4,
                    offset: ['50px ', '65px'],
                    content: "staff_addRole.html",
                    end: function () {
                        getAllRole()
                    }
                })
            }
        })
    }

    var isUpdate = false;

    //修改角色
    function update() {

        $(".update").click(function () {
            role()
            if (!isUpdate) {
                alert("权限不足");
                return
            } else {
                var roleid = $(this).parent().find("span").text();
                var rolename = $(this).parents("tr").find("td:eq(0)").text();
                $.cookie("roleid", roleid, {expires: 7})
                $.cookie("rolename", rolename, {expires: 7})

                layer.open({
                    type: 2,
                    title: "编辑",
                    area: ['400px', '200px'],
                    maxmin: true,
                    closeBtn: false,
                    fixed: false,
                    shadeClose: true,
                    shade: 0.4,
                    offset: ['50px ', '65px'],
                    content: "staff_editRole.html",
                    end: function () {
                        var idd = $.cookie("rolename1");
                        $("." + roleid).text(idd);
                    }
                })
            }
        })
    }

    var isDelete = false;

    //删除角色
    function del() {
        $(".del").click(function () {
            var roleid = $(this).parent().find("span").text();
            role()
            if (!isDelete) {
                alert("权限不足");
                return
            } else {
                layer.confirm('是否确定删除？', {
                    btn: ['确定', '关闭'] //按钮
                }, function () {
                    $(".tr" + roleid).remove();
                    //删除
                    del1(roleid);
                }, function () {

                });
            }
        })
    }

    function del1(id) {
        $.ajax({
            url: "http://localhost:8080/role/delRole",
            method: "post",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({id: id}),
            success: function (data) {
                if (data.code == 200) {
                    layer.alert(data.msg);
                } else {
                    layer.alert(data.msg);
                }
            }
        })
    }
    //获取权限可操作的表
    function roleMenu(id) {
        $.ajax({
            url: "http://localhost:8080/menuJuisd/getByRole",
            method: "post",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({id: id}),
            success: function (data) {
                var txt = doT.template($("#menu").text());
                $("#nav").html(txt(data));
                $('#nav li').click(function (event) {
                    if ($(this).children('.sub-menu').length) {
                        if ($(this).hasClass('open')) {
                            $(this).removeClass('open');
                            $(this).find('.nav_right').html('&#xe697;');
                            $(this).children('.sub-menu').stop().slideUp();
                            $(this).siblings().children('.sub-menu').slideUp();
                        } else {
                            $(this).addClass('open');
                            $(this).children('a').find('.nav_right').html('&#xe6a6;');
                            $(this).children('.sub-menu').stop().slideDown();
                            $(this).siblings().children('.sub-menu').stop().slideUp();
                            $(this).siblings().find('.nav_right').html('&#xe697;');
                            $(this).siblings().removeClass('open');
                        }
                    } else {


                        var index = $('#nav li').index($(this));

                        for (var i = 0; i < $('.x-iframe').length; i++) {
                            if ($('.x-iframe').eq(i).attr('tab-id') == index + 1) {
                                tab.tabChange(index + 1);
                                event.stopPropagation();
                                return;
                            }
                        }

                    }

                    event.stopPropagation();

                })
                $('#nav li .sub-menu dd').click(function () {
                    if ($(this).children('.sub-menu1').length) {
                        if ($(this).hasClass('open')) {
                            $(this).removeClass('open');
                            $(this).find('.nav_right').html('&#xe697;');
                            $(this).children('.sub-menu1').stop().slideUp();
                            $(this).siblings().children('.sub-menu1').slideUp();
                        } else {
                            $(this).addClass('open');
                            $(this).children('a').find('.nav_right').html('&#xe6a6;');
                            $(this).children('.sub-menu1').stop().slideDown();
                            $(this).siblings().children('.sub-menu1').stop().slideUp();
                            $(this).siblings().find('.nav_right').html('&#xe697;');
                            $(this).siblings().removeClass('open');
                        }
                    }
                    event.stopPropagation();
                })
                $(".roleZuo").click(function () {
                    var id1 =1;
                    if(id==1){
                        layer.alert("改员工为管理员，权限不能修改");
                        return;
                    }else {
                        roleZuo(id1, id);
                    }
                })
            }
        })
    }
    //权限操作
    function roleZuo(id1,id) {
        $.ajax({
            url: "http://localhost:8080/menuJuisd/getByRole",
            method: "post",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({id: id1}),
            success: function (data) {
                var txt = doT.template($("#menu1").text());
                $("#nav").html(txt(data));
                $('#nav li>a').click(function (event) {
                    if ($(this).parent().find('.sub-menu').length) {
                        if ($(this).hasClass('open')) {
                            $(this).removeClass('open');
                            $(this).find('.nav_right').html('&#xe697;');
                            $(this).parent().find('.sub-menu').stop().slideUp();
                            $(this).siblings().children('.sub-menu').slideUp();
                        } else {
                            $(this).addClass('open');
                            $(this).parent().find('a').find('.nav_right').html('&#xe6a6;');
                            $(this).parent().find('.sub-menu').stop().slideDown();
                            $(this).siblings().children('.sub-menu').stop().slideUp();
                            $(this).siblings().find('.nav_right').html('&#xe697;');
                            $(this).siblings().removeClass('open');
                        }
                    }
                    event.stopPropagation();

                });
                $('#nav li .sub-menu dd>a').click(function () {
                    if ($(this).parent().find('.sub-menu1').length) {
                        if ($(this).hasClass('open')) {
                            $(this).removeClass('open');
                            $(this).find('.nav_right').html('&#xe697;');
                            $(this).parent().find('.sub-menu1').stop().slideUp();
                            $(this).siblings().children('.sub-menu1').slideUp();
                        } else {
                            $(this).addClass('open');
                            $(this).parent().find('.sub-menu1').stop().slideDown();
                            $(this).siblings().children('.sub-menu1').stop().slideUp();
                            $(this).siblings().find('.nav_right').html('&#xe697;');
                            $(this).siblings().removeClass('open');
                        }
                    }
                    event.stopPropagation();
                });

                $.ajax({
                    url: "http://localhost:8080/menuJuisd/getByRole",
                    method: "post",
                    dataType: "json",
                    contentType: "application/json",
                    data: JSON.stringify({id: id}),
                    success: function (data1) {
                        for (var i =0;i<data.length;i++){
                            for (var j =0;j<data1.length;j++){
                                if(data1[j].menuId==data[i].menuId && data1[j].jurId==data[i].jurId){

                                   $("input[name="+data1[j].menuId+data1[j].jurId+"]").prop("checked", true)
                                }else{

                                }
                            }
                        }

                        //子集菜单选中父级也选中
                        $(".jur").click(function () {
                            if($('.jur').is(':checked')) {
                                $(this).parents("dd").find(".menuqw").attr("checked",true);
                            }
                            if($('.menuqw').is(':checked')) {
                                $(this).parents("li").find(".role").attr("checked",true);
                            }
                        })
                        $(".menuqw").click(function () {
                            if($('.menuqw').is(':checked')) {
                                $(this).parents("li").find(".role").attr("checked",true);
                            }
                        })
                        $(".update2").click(function () {
                            delStaffJm(id);
                            $('input[type=checkbox]:checked').each(function()
                            {
                                var menuId=$(this).parent().find(".menuId").text();
                                var jurId=$(this).parent().find(".jurId").text();
                                if(menuId!=null&&jurId!=null){

                                    insertStaffJm(id,menuId,jurId)
                                }
                            });
                            if(fun){
                                layer.alert("修改成功")
                                roleMenu(id)
                            }
                        })
                        $(".tui").click(function () {
                            roleMenu(id)
                        })
                    }
                })
            }
        })
    }
    //删除角色操作权限
    function delStaffJm(id) {
        $.ajax({
            url:"http://localhost:8080/staffJm/delStaffJm",
            method:"post",
            contentType:"application/json",
            dataType:"json",
            data:JSON.stringify({roleId:id}),
            success:function (data) {
                if(data.code==200){

                }
            }
        })
    }
    var fun= false;
    //添加角色操作权限
    function insertStaffJm(id,menuId,jurId) {
        $.ajax({
            url:"http://localhost:8080/staffJm/insertStaffJm",
            method:"post",
            contentType:"application/json",
            dataType:"json",
            data:JSON.stringify({roleId:id,menuId:menuId,jurId:jurId}),
            success:function (data) {
                if(data.code==200){
                    fun=true;
                }
            }
        })
    }
})