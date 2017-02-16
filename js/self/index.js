/**
 * Created by Administrator on 2016/12/14 0014.
 */
//首页 部分 begin
//主人家的数据请求
$(function(){
    function home_page(obj){
        for(var key in obj){
            this[key] = obj[key];
        }
        //    渲染页面
        this.host();
        //    绑定事件
        this.bind();
    }
    home_page.prototype = {
        constructor:home_page,
        host:function(){
//首页 主人家的渲染
            this.get_data(this.num,0,this.host_id,this.host_url,this.host_container);
//首页功能区的渲染
            this.get_data(this.num,0,this.function_id,this.function_url,this.function_container);
            this.get_width();
            this.get_data(this.num,0,this.price_id,this.price_url,this.price_container);
            this.get_data(this.num,0,this.img_id,this.img_url,this.img_container);
    //blog页面的数据加载
            this.get_data(3,0,this.blog_id,this.blog_url,this.blog_container);
    //portfolio上部分页面的数据加载
            this.get_data(this.num,0,this.square_id,this.square_url,this.square_container);
    //portfolio下部分页面的数据加载
            this.get_data(this.num,0,this.square_id,this.round_url,this.round_container);
            var divs = $(".wedding>div");
            divs.css("display","none");
            divs.eq(0).css("display","block");
        },
//封装数据请求
        /**
         *
         * @param num  表示每次加载的个数
         * @param startNum  表示每次加载时开始的位置
         * @param id  表示引擎模板
         * @param url 表示API入口
         * @param container  表示容器盒子
         */
        get_data:function(num,startNum,id,url,container){
            var container = $("."+container);
            $.ajax({
                type:"get",
                url:url,
                data:{},
                beforeSend:function(){
                    //给父盒子添加more属性  如果有more属性则不加载  如果没有more属性 则加载数据
                    if(container.hasClass("more")){
                        return false;
                    }else {
                    //  类名class--done用于判断点击后是否需要在向服务器申请  因为有些数据在点击一次后就加载完毕了 不需要第二次向服务器进行请求
                        container.addClass("more");
                    }
                  if(container.hasClass("done") ||  container.hasClass("over")){
                      return false;
                  }
                },
                success:function(result){
                    if(num === "total"){
                        var html = template(id,{items:result});
                    }else {
                        result = result.splice(startNum,num);
                        var html = template(id,{items:result});
                    }
                    if(result.length ==0){
                        container.addClass("over");
                    }
                    container.append(html).addClass("done").removeClass("more");
                },
                error:function(){
                    alert("连接超时");
                }
            })
        },
//动态获取首页 function的width值
        get_width:function(){
                setTimeout(function(){
                    var li = $(".function li");
                    var liWidth = li.width();
                    li.height(liWidth);
                },50)
        },
        bind:function(){
            //bind函数中的this指的是构造函数的实例
            var self = this;
//about us页面的toggle Style点击效果
            var toggle = $(".toggle h5");
            //事件委托的意思是 点击".toggle h5>a" 触发toggle
            var t_target = $(".toggle h5>a")
            toggle.on("click",t_target,function(){
                //事件委托的this 是指toggle
                var target = $(this).next();
                self.up_down(target);
            })
//about us页面中tab栏内容的切换
            var flexible = $(".first-page .tab-nav li");
            var f_target = $(".first-page .tab-content li");
            flexible.on("click",f_target,function(){
                //这里的this是指flexible  就是tab栏的li标签
                self.block_none(this,flexible,f_target);
            })
//blog页面 分类的显示与隐藏
            var categories = $(".categories span");
            categories.on("click",function(){
                var target = categories.parent().next()
                self.up_down(target);
                if(categories.css("backgroundPosition") == "0px 0px"){
                    categories.css("backgroundPosition","0 -22px")
                }else {
                    categories.css("backgroundPosition","0 0px")
                }
            });
//blog页面 博客日期信息的显示与隐藏
            var moreUl = $(".third-page .detail>ul");
            var right = $(".right");
            //事件委托 点解change 触发msg的事件
            moreUl.on("click",right,function(event){
                var target = $(event.target).parent().children(".msg");
                self.up_down(target);
            })
//blog页面 博客加载更多数据的点击事件
            var index = 3;
            var moreDetail = $(".moreDetail");
            moreDetail.on("click",function(){
                moreUl.removeClass("done");
                // 每点击一次 加载一条数据
                self.get_data(1,index,self.blog_id,self.blog_url,self.blog_container);
                index ++;
            })
//portfolio 页面 square的标题的显示与隐藏
            var s_span = $(".square-title>h4>span");
            var ul = $(".square-title>ul");
            s_span.on("click",function(){
                self.up_down(ul);
                self.backgroundChange("0px -22px","0px 0px",s_span)
            })
//点击portfolio 页面的图片显示大图片
            var imgDetail = $(".img-detail img")[0];
            var imgHome = $(".forth-home img");
            var forth_home = $(".forth-home");
            var target_next = $(".img-detail");
            var divs = $(".wedding>div");
            var wedding = $(".wedding");
            forth_home.on("click",imgHome,function(event){
                var imgSrc = event.target.src;
                if(typeof imgSrc == 'undefined'){
                   return;
               }
                imgDetail["src"] = imgSrc;
                //大图片的页面显示
                console.log(target_next);
                //小图片的页面隐藏
                wedding.css("display","none");
                target_next.css("display","block");
                $(".go-page-home").css("display","none");
            })
 //portfolio  黑色页面点击头部回到原页面
            var top = $(".img-detail .top");
            var img_detail = $(".img-detail");
            top.on("click",function(){
                img_detail.css("display","none");
                wedding.css("display","block");
                $(".go-page-home").css("display","block");
            });
 //点击首页的 进入每一个页面
            var homePageWidth = $(".home-page").width();
            var pageIndex;
            wedding.on("click",".home-function",function(){
                pageIndex = $(this).index()+1;
                var distance = -pageIndex*homePageWidth;
                divs.css("display","block");
                self.openTransition(wedding);
                self.openTransform(wedding,distance);
            })
    //设置wedding过渡完后 页面的顶部从上到下滑动
            var goHome =$(".go-page-home");
            var weddingWidth = wedding.css("transform");
            self.openTransitionEnd(wedding,function(){
                if(wedding.css("transform")== "matrix(1, 0, 0, 1, 0, 0)") {
                    self.closeTransition(wedding);
                    self.openTransformY(goHome,-58);
                }else {
                    self.openTransition(goHome);
                    self.openTransformY(goHome,0);
                }
                divs.css("display","none");
                divs.eq(pageIndex).css("display","block");
                divs.eq(0).css("display","block");
            })
 //点击返回主页按钮 返回主页
            var goPageHome = $(".go-page-home span:first-child");
            goPageHome.on("click",function(){
                goHome.css("webkitTransform", "translateY(-58px)");
                    self.openTransition(wedding);
                    self.openTransform(wedding,0);
                    $(".home-page").css("display","block").siblings().css("display","none");
            })
        },
    //    点击某个对象 如果是显示就隐藏  如果是隐藏就显示
        up_down:function(obj){
            //block_none 函数中的this指的是构造函数的实例
            if(!obj.hasClass("showing")){
                obj.addClass("showing");
                obj.slideDown(600);
            }else {
                obj.removeClass("showing");
                obj.slideUp(600);
            }
        },
    //    点击tab栏  相应的内容显示  其他tab栏的内容隐藏  输入三个参数  第一个是绑定了事件的对象 第二个参数是导航栏   第三个参数是内容
        block_none:function(obj,nav,content){
            //获取this的id名
            var Name = $(obj).attr("id");
            //通过Name 名获取了相应的标签
            var target =$(".flexible ."+Name);
            //导航栏全部li标签去掉active类名
            nav.removeClass("active");
            //点击的导航栏添加active类名
            $(obj).addClass("active");
            //内容全部li标签去掉active类名
            content.removeClass("active");
            //点击的内容添加active类名
            target.addClass("active");
        },
    //背景图片改变
        backgroundChange:function(before,later,obj){
            if(obj.css("backgroundPosition") == before){
                obj.css("backgroundPosition",later);
            }else {
                obj.css("backgroundPosition",before);
            }
        },
    //    过渡的函数
        openTransition:function(obj){
            console.log(123);
            obj.css("transition","all 0.5s");
            obj.css("webkitTransition","all 0.5s");
        },
    //    关闭过渡函数
        closeTransition:function(obj){
            obj.css("transition","none");
            obj.css("webkitTransition","none");
        },
    //    设置水平的偏移量
        openTransform:function(obj,distance){
            obj.css("transform","translateX("+distance+"px)");
            obj.css("webkitTransform","translateX("+distance+"px)");
        },
    //设置垂直的偏移量
        openTransformY:function(obj,distance){
            obj.css("transform","translateY("+distance+"px)");
            obj.css("webkitTransform","translateY("+distance+"px)");
        },
    //设置过渡结束
        openTransitionEnd:function(obj,callback){
            obj.on("transitionEnd",function(){
                callback && callback();
            })
            obj.on("webkitTransitionEnd",function(){
                callback && callback();
            })
        }
    }
    var obj = {
        host_container:"host",
        host_id:"host",
        host_url:"json/host.json",
        function_id:"function",
        function_url:"json/function.json",
        function_container:"function>ul",
        price_id:"price",
        price_url:"json/first-page-price.json",
        price_container:"price tbody",
        img_id:"img",
        img_url:"json/about-us.json",
        img_container:"img",
        toggle_click:".toggle",
        toggle_respond:".toggle h5 a",
        blog_url:"json/blog.json",
        blog_container:"third-page .detail>ul",
        blog_id:"detail",
        num:"total",
        square_url:"json/square.json",
        square_id:"portfolio",
        square_container:"square-content>ul",
        round_container:"round-content>ul",
        round_url:"json/round.json"
    }
    var wedding = new home_page(obj);
})