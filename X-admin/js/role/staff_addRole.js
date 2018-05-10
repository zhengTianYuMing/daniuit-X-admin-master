$(function () {

    $(".qu").click(function () {
        parent.layer.closeAll()
    })

    $(".insert").click(function () {
        var ind=$("#roleName").val();
        $.ajax({
            url:"http://localhost:8080/role/addRole",
            method:"post",
            dataType:"json",
            contentType:"application/json",
            data:JSON.stringify({roleName:ind}),
            success:function (data) {
                if(data.code==200){
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