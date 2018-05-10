$(function () {
    var id = $.cookie("roleid");
    var roleName= $.cookie("rolename");
    $("#roleName").val(roleName);
    $(".qu").click(function () {
        parent.layer.closeAll()
    })

    $(".insert").click(function () {
        var ind=$("#roleName").val();
        $.ajax({
            url:"http://localhost:8080/role/updateRole",
            method:"post",
            dataType:"json",
            contentType:"application/json",
            data:JSON.stringify({id:id,roleName:ind}),
            success:function (data) {
                if(data.code==200){
                    $.cookie("rolename1",ind,{expires: 7})
                    layer.alert(data.msg)
                    setTimeout(function(){
                        parent.layer.closeAll()
                    },1500);

                }else {
                    layer.alert(data.msg);
                }
            }
        })
    })
})