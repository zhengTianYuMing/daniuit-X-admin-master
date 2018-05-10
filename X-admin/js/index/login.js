$(function () {

    $("#login").click(function () {
        var phone=$("input[name=phone]").val();
        var password= $("input[name=password]").val();
        $("#showMsg").html("正在校验用户名和密码。。。");
        $.ajax({
            url:"http://localhost:8080/staffInfo/login",
            method:"post",
            dataType:'json',
            contentType:"application/json",
            data:JSON.stringify({phone:phone,password:password}),
            success:function (data) {
                if(data!=null&&data!=""){
                    var date= new Date();
                    $.cookie("user",data.staffName,{expires:7});
                    $.cookie("phone",data.phone,{expires:7});
                    $.cookie("password",data.password,{expires:7});
                    $.cookie("staffId",data.id,{expires:7})
                    $("#showMsg").html("登录成功，页面跳转中。。。");
                    location.href="index.html"
                }
                else{
                    $("#showMsg").html("登录失败，请查询账号密码是否正确");
                }
            }
        })
    })
})