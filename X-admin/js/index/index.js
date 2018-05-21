$(function () {

    function getCurrentTime(){
        var show_day=new Array('星期日','星期一','星期二','星期三','星期四','星期五','星期六');
        var str = "";
        var d=new Date();
        str +=d.getFullYear()+'年'; //获取当前年份
        str +=d.getMonth()+1+'月'; //获取当前月份（0——11）
        str +=d.getDate()+'日 ';
        str +=d.getHours()+'时';
        str +=d.getMinutes()+'分';
        str +=d.getSeconds() + "秒";
        return str + "  " + show_day[d.getDay()];

    }
    var ds=getCurrentTime()
    $(".time").text(ds)
    setInterval(function(){
        $(".time").html(getCurrentTime());
    },1000);


    function left() {
        var tab = {
            tabAdd: function(title,url,id){
                //新增一个Tab项
                element.tabAdd('xbs_tab', {
                    title: title
                    ,content: '<iframe tab-id="'+id+'" frameborder="0" src="'+url+'" scrolling="yes" class="x-iframe"></iframe>'
                    ,id: id
                })
            }
            ,tabDelete: function(othis){
                //删除指定Tab项
                element.tabDelete('xbs_tab', '44'); //删除：“商品管理”


                othis.addClass('layui-btn-disabled');
            }
            ,tabChange: function(id){
                //切换到指定Tab项
                element.tabChange('xbs_tab', id); //切换到：用户管理
            }
        };


        $('.left-nav #side-nav #nav li').click(function (event) {

            if($(this).children('.sub-menu').length){
                if($(this).hasClass('open')){
                    $(this).removeClass('open');
                    $(this).find('.nav_right').html('&#xe697;');
                    $(this).children('.sub-menu').stop().slideUp();
                    $(this).siblings().children('.sub-menu').slideUp();
                }else{
                    $(this).addClass('open');
                    $(this).children('a').find('.nav_right').html('&#xe6a6;');
                    $(this).children('.sub-menu').stop().slideDown();
                    $(this).siblings().children('.sub-menu').stop().slideUp();
                    $(this).siblings().find('.nav_right').html('&#xe697;');
                    $(this).siblings().removeClass('open');
                }
            }else{

                var url = $(this).children('a').attr('_href');
                var title = $(this).find('cite').html();
                var index  = $('.left-nav #nav li').index($(this));

                for (var i = 0; i <$('.x-iframe').length; i++) {
                    if($('.x-iframe').eq(i).attr('tab-id')==index+1){
                        tab.tabChange(index+1);
                        event.stopPropagation();
                        return;
                    }
                };

                tab.tabAdd(title,url,index+1);
                tab.tabChange(index+1);
            }

            event.stopPropagation();

        })
    }

    var name = $.cookie("user")
    var phone = $.cookie("phone")
    var password = $.cookie("password")
    role(phone,password)
    if(name==null){
        return;
    }else{
        $(".user").text(name)
    }


    function role(phone,password) {
        var param = JSON.stringify({phone:phone,password:password,jurId:4})
        $.ajax({
            url:"http://localhost:8080/jc/getById",
            method:"post",
            data:param,
            contentType:"application/json",
            dataType:"json",
            success:function (data) {
                var txt = doT.template($("#menu-temp").text());
                $(".left-nav #side-nav #nav").html(txt(data));
                left()
                $(".sub-menu li").click(function () {
                    var menuName=$(this).find("cite").text();
                    $.cookie("menuName",menuName,{expires:7});
                })

            }
        })
    }

    $(".mima").click(function () {

        layer.open({
            type:2,
            title:"修改密码",
            area: ['750px', '500px'],
            maxmin: true,
            closeBtn: false,
            fixed: false,
            shadeClose: true,
            shade: 0.4,
            content: "updPass.html",
            end: function () {


            }
        });
    })



})