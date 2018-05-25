/*
 * @require  /services/views/auth/member/services.member.ozList.js
 */

App.Services.MemberNav=Backbone.View.extend({

    tagName :'div',
    defaults:{
        setTimeoutId:''
    },
    template:_.templateUrl("/services/tpls/auth/member/services.member.nav.html"),
    events:{
        "click #outer":'outer',
        "click #inner":'inner',
        "keyup .searchContent":"search",
        "focus .searchContent":"searchStart",
        "blur .searchContent":"searchEnd",
        "click .search_result":"chooseOrg"
    },
    render:function(){
        this.$el.html(this.template);
        return this;
    },
    initialize:function(){
        //默认根据角色权限加载  adm用户加载全部，keyMem用户只显示项目管理.
        Backbone.on("serviceMemberTopSelectStatus",this.serviceMemberTopSelectStatus,this);
        Backbone.on("serviceMemberResetSearchContent",this.serviceMemberResetSearchContent,this);
        Backbone.on("hideSearchMenu",this.hideSearchMenu,this)

    },
    //清除搜索内容
    serviceMemberResetSearchContent:function(){

    },
    hideSearchMenu:function(){
        this.$(".memberSearch ul").hide();
    },
    //
    serviceMemberTopSelectStatus:function(){
        this.$(".inner span").removeClass("active");
        this.$(".outer span").removeClass("active");
    },
    //外部用户
    outer:function(){
        App.Services.MemberType = "outer";
        this.nav();
    },
    //内部用户
    inner:function(){
        App.Services.MemberType = "inner";
        this.nav();
    },
    //菜单切换
    nav:function(){
        if(App.Services.queue.que > 2 ){ return}
        var _this =this,$tab = $("#" + App.Services.MemberType),already = $tab.siblings(".childOz").html();
        $("#ozList div").removeClass("active");
        $("#ozList span").removeClass("active");
        if(already){
            if($tab.hasClass("active")){
                $tab.removeClass("active").find("span").removeClass("active").end().siblings(".childOz").hide();
            }else if(!$tab.hasClass("active")){
                $(".childOz").hide();
                $tab.siblings(".childOz").show();
            }
        }
        $tab.addClass("active").find("span").addClass("active");
        $(".serviceBody .content").addClass("services_loading");
        App.Services.queue.promise(_this.pull,_this);
    },
    //加载子组织，刷新右侧组织和员工列表
    pull:function(){
        var _thisType = App.Services.MemberType,
            cdata,
            _this = App.Services.queue.present[0],
            collection = App.Services.Member[_thisType + "Collection"];
        $(".childOz").hide();

        $("#blendList").empty();

        cdata = {
            URLtype: "fetchServicesMemberList",
            type:"GET",
            data:{
                outer:  !(_thisType == "inner"),
                includeUsers:true
            }
        };

        App.Comm.ajax(cdata,function(response){
            var already = $("#" + App.Services.MemberType).siblings(".childOz").html();

            $(".serviceBody .content").removeClass("services_loading");
            if(!response.data.org.length && !response.data.user.length ){
                Backbone.trigger("servicesMemberControlCancelSelectAll");
                return
            }
            App.Services.Member.memLoadingStatus = true;
            collection.reset();
            if(response.data.user && response.data.user.length){
                collection.add(response.data.user);
            }
            if (response.data.org && response.data.org.length) {
                collection.add(response.data.org);
                //外部和内部单选
                $("#" + _thisType +"+ .childOz").show();
                if(already){return}
                //菜单渲染
                $("#" + _thisType +"+ .childOz").html(App.Services.tree(response));
            }
            App.Services.Member.memLoadingStatus = false;
        }).done(function(){
            App.Services.queue.next();
        });
    },
    //搜索模块
    search:function(e){
        var ele = e.target || e.srcElement;
        //为回车键加以条件判断是否是选择
        var pre = this.$(".memberSearch li");
        var active  =_.filter(pre,function(item){
            return $(item).hasClass("active");
        });
        // if( (e.keyCode > 47 && e.keyCode  < 58) || e.keyCode == 8 || e.keyCode == 32 || e.keyCode == 13 || (e.keyCode  < 112 && e.keyCode >95)){ //退格 空格 回车 小键盘  (e.keyCode > 57&& e.keyCode  < 91) || 字母
        //     var content = $(ele).val();
        //     if(!content){
        //         return
        //     }
        //     //
        //     if(active.length && e.keyCode == 13){
        //         $(active[0]).click();
        //     }
        //     if(this.defaults.setTimeoutId) clearTimeout(this.defaults.setTimeoutId);
        //     this.defaults.setTimeoutId = setTimeout(function(){
        //         $.ajax({
        //             url:App.API.URL.searchServicesMember  + content,   //App.API.URL.searchServicesMember + content
        //             type:'GET',
        //             data:'',
        //             success:function(res){
        //                 $(ele).siblings("ul").show();
        //                 if(res.data && res.data.length){
        //                     $(ele).siblings("ul").html(App.Services.memSearchResult(res.data));
        //                 }else{
        //                     //显示无搜索结果
        //                     $(ele).siblings("ul").html('<li class="search_result" data-code="">无结果</li>');
        //                 }
        //             }
        //         });
        //     },400)
            
        // }else 
        if(e.keyCode == 38 || e.keyCode == 40){  //38向上  40向下
            //查询当前是否有选中，未选中，设置为0，选中  38设置为减一，40设置为加一，注意头尾的处理
            //光标上下选择
            var index = $(active[0]).index();

            if(e.keyCode == 38){
                if(active.length){
                    if(index == 0){
                        pre.each(function(item){$(this).removeClass("active")});
                    }else{
                        pre.eq(index).removeClass("active").prev().addClass("active");
                    }
                }else{
                    pre.eq(pre.length - 1).addClass("active");
                }
            }else if(e.keyCode == 40){
                if(!active.length){
                    pre.eq(0).addClass("active");
                }else {
                    if(index == pre.length - 1){
                        pre.each(function(item){$(this).removeClass("active")});
                    }else{
                        pre.eq(index).removeClass("active").next().addClass("active");
                    }
                }
            }
        }else{
            var content = $(ele).val();
            if(!content){
                return
            }
            if(active.length && e.keyCode == 13){
                $(active[0]).click();
            }
            if(this.defaults.setTimeoutId) clearTimeout(this.defaults.setTimeoutId);
            this.defaults.setTimeoutId = setTimeout(function(){
                $.ajax({
                    url:App.API.URL.searchServicesMember  + content,   //App.API.URL.searchServicesMember + content
                    type:'GET',
                    data:'',
                    success:function(res){
                        $(ele).siblings("ul").show();
                        if(res.data && res.data.length){
                            $(ele).siblings("ul").html(App.Services.memSearchResult(res.data));
                        }else{
                            //显示无搜索结果
                            $(ele).siblings("ul").html('<li class="search_result" data-code="">无结果</li>');
                        }
                    }
                });
            },400)
        }
    },
    //选择搜索
    chooseOrg:function(e){
        var _this = this;
        var ele = e.target || e.srcElement;
        $(ele).closest("ul").hide();

        //添加状态
        var chosenOz = $(ele).attr("data-code");
        $("#ozList").addClass("services_loading");
        if(chosenOz){
            var pre = JSON.parse(chosenOz);
            App.Services.memSearchParentOz.id = pre.id;
            var type = pre.type;
            var orgId = pre.orgid;
            var searchName = pre.name;
            var searchContent = $(".searchContent");
            searchContent.val(searchName);
            App.Services.MemberType = !pre.outer ? "inner" : "outer";//切换外部/内部状态
            var parentCode = {
                outer:pre.outer,
            };
            $.ajax({
                url: App.API.URL.searchServicesMemberResult+"id="+pre.id+"&type=" + type+"&orgid=" + orgId,  //  App.API.URL.searchServicesMemberResult
                type:'GET',
                data : parentCode,
                success:function(res){
                    if(res.data && res.data.length){
                        //获取直接父项列表，用于右侧展示 //先获取再点击左侧
                        //获取其他层级
                        if(res.data.length != 1){ //当存在父项组织时
                            App.Services.memSearchParentOz.init(res.data);
                            App.Services.memSearchParentOz.trigger(res.data,false);
                        }
                    }else{
                        //无结果
                        alert("没有所属组织，无法定位到相关信息！");
                        $("#ozList").removeClass("services_loading");
                    }
                },
                error:function(e){
                }
            })
        }
    }
});
