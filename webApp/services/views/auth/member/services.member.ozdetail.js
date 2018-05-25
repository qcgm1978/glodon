/*
 * @require  /services/views/auth/member/services.member.list.js
 * */
App.Services.MemberozDetail=Backbone.View.extend({

    tagName :'div',

    template:_.templateUrl("/services/tpls/auth/member/services.member.orgdetail.html"),
    events:{
        "click .ozName":"unfold"
    },

    render:function(){
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    },

    initialize:function(){
        this.listenTo(this.model,"change:active",this.sele);
        Backbone.on("serviceMemberOrgLoad",this.unfold,this);
        Backbone.on("serviceMemberSelectStatus",this.serviceMemberSelectStatus,this);

    },

    sele:function(){
        if(this.model.get("active")){
            this.$(".ozName").addClass("active");
            this.$(".ozName span").addClass("active");
        }
    },



    serviceMemberSelectStatus:function(){
        this.$(".ozName span").removeClass("active");//清除内部所有的激活的元素
        if(!this.model.get("hasChildren")){
            this.$(".ozName").removeClass("active");
        }
    },

    unfold:function(pram){
        if(pram == parseInt(this.$(".ozName").attr("data-id")) || typeof pram == "object"){//为右侧触发，参数为父级id
            var _this =  this,
                container = this.$el.siblings(".childOz");

            if(typeof pram == "object") {
                //如果是快速点击，属于误操作，跳过
                //if (!App.Services.queue.permit) {
                //    return;
                //}
                //if (App.Services.queue.que > 2) {
                //    return
                //}
            }
            //选择和加载状态
            if (this.$(".ozName span").hasClass("active")) {  //已选（必然已加载），收起
                if(container.html()){
                    this.$(".ozName").removeClass("active").find("span").removeClass("active");
                    App.Services.queue.certificates();
                    //清空右侧列表
                    Backbone.trigger("servicesMemberControlNoSelect");
                    container.hide();
                    return;
                }
            }else if (container.html()) {   //未选但已加载，选择，显示已加载项
                if (!container.is(":hidden")) {
                    container.find(".childOz").hide();
                    var preOrg = _.filter($(".ozName span"), function (item) {
                        return _this.model.get("orgId") == $(item).attr("data-id")
                    });
                    $(preOrg[0]).closest(".ozName").removeClass("active");
                    this.$(".ozName").removeClass("active");
                    container.find(".ozName").removeClass("active");
                    container.find(".ozName span").removeClass("active");
                    container.hide();
                    //return;
                }
                Backbone.trigger("serviceMemberTopSelectStatus");
                Backbone.trigger("serviceMemberSelectStatus");//清除内部所有的激活的元素
                this.$(".ozName").addClass("active").find("span").addClass("active");
                container.find(".childOz").hide();
                container.show();
            } else { //未加载 ，移除所有加载项再选择和显示
                Backbone.trigger("serviceMemberTopSelectStatus");
                Backbone.trigger("serviceMemberSelectStatus");
                this.$(".ozName").addClass("active").find("span").addClass("active");
                container.show();
            }
            //App.Services.queue.promise(_this.pull, _this);
            this.pull();
        }
    },

    //队列请求
    pull:function(){
        var _this = this;//this
        var _thisType = App.Services.MemberType;
        var _thisId = App.Services.memFatherId =  _this.$(".ozName").data("id") ;
        var collection = App.Services.Member[_thisType + "Collection"];
        //样式操作
        $("#blendList").empty();
        $(".serviceBody .content").addClass("services_loading");
        var cdata = {
            URLtype: "fetchServicesMemberList",
            type:"GET",
            data:{
                parentId:_thisId,
                outer:  !(_thisType == "inner"),
                includeUsers:true
            }
        };
        //此处为延迟
        App.Comm.ajax(cdata,function(response){
            var alreadyMenu = _this.$el.siblings(".childOz");//已加载菜单将不再加载
            $(".serviceBody .content").removeClass("services_loading");
            if(!response.data.org.length && !response.data.user.length ){
                Backbone.trigger("servicesMemberControlCancelSelectAll");
                return
            }
            //搜索状态，如果是搜索项则不刷新右侧列表（搜索的父项除外）
            App.Services.Member.memLoadingStatus = true;
            collection.reset();
            if(response.data.user && response.data.user.length){
                collection.add(response.data.user);
            }
            if (response.data.org && response.data.org.length) {
                collection.add(response.data.org);
                if(alreadyMenu.html()){return}//判断不再刷新菜单
                alreadyMenu.html(App.Services.tree(response));
            }

            if(App.Services.memSearchParentOz.id){
                Backbone.trigger("serviceMemberSearchSelect",App.Services.memSearchParentOz.id);
            }
            App.Services.Member.memLoadingStatus = false;
        }).done(function(){
            //删除执行完毕的 ，添加执行新的
            //App.Services.queue.next();
            //搜索队列
            //if(searchQueue.count && searchQueue.count != 1){
            //    if(_this.$(".ozName").attr("data-id") == searchQueue.arr[searchQueue.count].id){
            //        _this.$(".ozName").click();
            //    }
            //    searchQueue.count--;
            //}else{
            //    App.Services.memSearchParentOz.reset();
            //}
        });
    }
});