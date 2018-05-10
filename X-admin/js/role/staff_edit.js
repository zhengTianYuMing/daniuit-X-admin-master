$(function () {

    var idd= $.cookie("idd");
    //按id查询员工信息
    $.ajax({
        url:"http://localhost:8080/staffUrRole/getById",
        method:"post",
        data:JSON.stringify({id:idd}),
        contentType:"application/json",
        dataType:"json",
        success:function (data) {
            //把查询内容在前台显示
            $("#staffName").val(data.staffName);
            $("#wages").val(data.wages);
            $("#contact").val(data.contact);
            $("#role").val(data.roleName);
        }
    })

    $.ajax({
        url:"http://localhost:8080/role/getAll",
        method:"post",
        contentType:"application/json",
        dataType:"json",
        success:function (data) {
            var txt = doT.template($("#role_temp").text());
            $("#itemlist").html(txt(data));
            cli();
        }
    })
    //退出
    $(".qu").click(function () {
        parent.layer.closeAll()
    })
    //点击更改
    function cli() {
        $(".update").click(function () {
            var staffName = $("#staffName").val();
            var wages = $("#wages").val();
            var contact = $("#contact").val();
            var roleName = $("#role").val();
            $.cookie("staffName2", staffName, {expires: 7});
            $.cookie("wages2", wages, {expires: 7});
            $.cookie("contact2", contact, {expires: 7});
            $.cookie("roleName2", roleName, {expires: 7});
            $.ajax({
                url:"http://localhost:8080/role/getByName",
                method:"post",
                contentType:"application/json",
                dataType:"json",
                data:JSON.stringify({roleName:roleName}),
                success:function (data) {
                    if(data!=null){
                        var param = JSON.stringify
                        ({staffName:staffName,wages:wages,contact:contact,roleId:data.id,id:idd});
                        layer.confirm('是否确定修改？', {
                            btn: ['确定', '关闭'] //按钮
                        }, function () {
                            //修改
                            update(param)
                        }, function () {

                        });
                    }
                }
            })



        });
    }
    //更改员工信息
    function update(param) {
        $.ajax({
            url:"http://localhost:8080/staffUrRole/updateSr",
            method:"post",
            contentType:"application/json",
            dataType:"json",
            data:param,
            success:function (data) {
                if(data.code==200){
                    if(layer.alert(data.msg)){
                        setTimeout(function(){
                            parent.layer.closeAll()
                        },1500);
                    }
                }else{
                    layer.alert(data.msg);
                }
            }
        })
    }
})