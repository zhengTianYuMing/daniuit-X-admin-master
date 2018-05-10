$(function () {

    //查询下拉框角色信息
    $.ajax({
        url:"http://localhost:8080/role/getAll",
        method:"post",
        contentType:"application/json",
        dataType:"json",
        success:function (data) {
            var txt = doT.template($("#role_temp").text());
            $("#role").html(txt(data));
        }
    })
    //退出
    $(".qu").click(function () {
        parent.layer.closeAll();
    })

    //查询数据库是否存在该账号
    $("input[id=phone]").blur(function () {
        var phone=$("input[id=phone]").val();
        $.ajax({
            url:"http://localhost:8080/staffInfo/getByPhone",
            method:"post",
            contentType:"application/json",
            dataType:"json",
            data:JSON.stringify({phone:phone}),
            success:function (data) {
                if(data!=null&&data!=""){
                    layer.alert("该账号已存在");
                    $("input[id=phone]").val("");
                }
            }
        })
    })
    //判断工资是否是数字
    $("input[id=wages]").blur(function () {
        var wages=$("input[id=wages]").val();
        if(isNaN(wages)){
            layer.alert("请填写数字");
            $("input[id=wages]").val("");
        }
    })
    //正则表达式判断是否是正确的身份证号
    $("input[id=idCord]").blur(function () {
        var idCord=$("input[id=idCord]").val();
        var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        if(reg.test(idCord) == false)
        {
            layer.alert("身份证输入不合法");
            $("input[id=idCord]").val("")
        }
    })
    //正则表达式判断联系方式是否是正确手机号
    $("input[id=contact]").blur(function () {
        var contact=$("input[id=contact]").val();
        if(!(/^1[3|4|5|8][0-9]\d{4,8}$/.test(contact))){
            layer.alert("请填写正确的手机号");
            $("input[id=contact]").val("");
        }
    })
    //查询信息储存在数据库中
    $(".insert").click(function () {
        var staffName=$("input[id=staffName]").val();
        var phone=$("input[id=phone]").val();
        var password=$("input[id=password]").val();
        var wages=$("input[id=wages]").val();
        var idCord=$("input[id=idCord]").val();
        var contact=$("input[id=contact]").val();
        var role=$("select option:selected").val();
        var sex=$('input[name=identity]:checked').val();
        //判断信息填写是否完整
        if(staffName==null || staffName==""||
            phone==null || phone==""||
            password==null || password==""||
            wages==null || wages==""||
            idCord==null || idCord==""||
            contact==null || contact==""||
            role==""){
            layer.alert("请填写完整信息");
            return;
            }else{
            var time=Date.now();
            var d= JSON.stringify
            ({staffName:staffName,phone:phone,password:password,wages:wages,idCard:idCord,
                contact:contact,roleId:role,time:time,sex:sex});
            $.ajax({
                url:"http://localhost:8080/staffInfo/insert",
                method:"post",
                dataType:"json",
                contentType:"application/json",
                data:d,
                success:function (data) {
                    if(data.code==200){
                        window.parent.location.reload("#tableBody");
                        layer.alert("添加成功");
                        parent.layer.closeAll();

                    }
                }

            })
        }


    })

})