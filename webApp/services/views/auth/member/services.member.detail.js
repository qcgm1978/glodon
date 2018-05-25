/*
 * @require  /services/collections/auth/member/member.list.js
 * */
App.Services.memberDetail=Backbone.View.extend({
    tagName : 'li',
    className : 'choose',

    template:_.templateUrl("/services/tpls/auth/member/services.member.detail.html"),
    events:{
        "click .pers":"modify",
        "click .sele":"choose",
        "click .name":"loadMenu"
    },

    render:function(){
        this.$el.html(this.template(this.model.toJSON()));
        App.Services.exetor(this);
        return this;
    },

    initialize:function(){
        this.listenTo(this.model, 'change:role', this.render);
        Backbone.on("serviceMemberSearchSelect",this.serviceMemberSearchSelect,this);
    },
    cancelBubble:function(event){
        if(event.stopPropagation){
            event.stopPropagation();
        }else{
            window.cancelBubble = true;
        }
    },
    serviceMemberSearchSelect:function(id){
        this.model.set({"checked":false},{silent:true});//预设选择状态
        if(this.model.get("userId")){
            if(this.model.get("userId") == id){
                this.$(".sele").click();
            }
        }else if(this.model.get("orgId")){
            if(this.model.get("orgId") == id){
                this.$(".sele").click();
            }
        }
    },
    loadMenu:function(e){
        var _this = this;
        this.cancelBubble(e);
        if(App.Services.queue.que > 1 ){ return}
        if(this.model.get("userId")){return}//用户，可能需要另行处理
        //Backbone.trigger("serviceMemberOrgLoad" ,this.model.get("orgId"));
        var pre = _.filter($('.ozName'),function(item){
            return $(item).attr('data-id') == _this.model.get("orgId");
        });
        $(pre[0]).trigger('click');
    },

    //单个修改
    modify:function(e){
        this.cancelBubble(e);
        var  pre = $("#ozList span.active"), _this = this,frame,disable,selected;
        if(pre.closest(".inner").length || pre.closest(".outer").length){
            App.Services.memOz = "-";
        }else{
            App.Services.memOz = pre.html();
            App.Services.searchOrg(pre);     //获取所属组织列表
        }
        frame = new App.Services.MemberWindowIndex().render().el;//外框
        _this.window(frame);
        _this.chooseSelf();
        _this.save();
        $(App.Services.maskWindow.element[0]).addClass("services_loading");

        //获取所有列表，继承项设置不可修改
        App.Services.Member.loadData(App.Services.Member.SubRoleCollection,{},function(response){
            $(App.Services.maskWindow.element[0]).removeClass("services_loading");
            var role = _this.model.get("role");
            if(role && role.length) {
                selected  = _.filter(role,function(item){
                    return !item.inherit
                });
                _this.selected(selected);
                disable = _.filter(role,function(item){
                    return item.inherit
                });
                _this.disable(disable);
            }
            App.Services.maskWindow.find(".memRoleList h2 i").text(role.length);
        });
    },
    //不可选状态
    disable:function(arr){
        App.Services.Member.SubRoleCollection.each(function(item){
            for(var i = 0 ; i< arr.length ; i++){
                if(item.get("roleId") == arr[i]["roleId"]){
                    item.set({"inherit": true});
                }
            }
        });
    },
    //已选状态
    selected:function(arr){
        var n = 0;//统计
        App.Services.Member.SubRoleCollection.each(function(item){
            for(var i = 0 ; i< arr.length ; i++){
                if(item.get("roleId") == arr[i]["roleId"]){
                    if(arr[i]["inherit"]){
                        item.set("inherit", true);
                        return
                    }
                    item.set("checked", true);
                }
            }
        });
        return n;
    },
    //保存数据到全局变量
    save:function(){
        var type =  App.Services.MemberType || "inner",
            data =  App.Services.memberWindowData,
            userId = this.model.get("userId"),
            orgId  = this.model.get("orgId");
        if(userId){
            data[type].userId.push(userId);
        }else if(orgId){
            data[type].orgId.push(orgId);
        }
        App.Services.Member.saveMemData(data);
    },
    //已选部分，当弹窗加载时使用当前成员的角色列表，将弹窗的父角色内与当前成员角色重叠的部分设置为已选
    chooseSelf:function(){
        var type =  App.Services.MemberType || "inner";
        App.Services.Member.SubRoleCollection.each(function(item){
            item.set("checked",false);
        });
        App.Services.Member[type + "Collection"].each(function(item){
            item.set("checked",false);
        });
        $("#blendList li").removeClass("active");
        this.$el.addClass("active");
        this.model.set("checked",true);
    },
   //选择选项时作的操作。
    choose:function(){
        var boolean = this.model.get("checked");
        if(!boolean){
            this.$el.addClass("active");
        }else{
            this.$el.removeClass("active");
        }
        this.model.set({"checked": !boolean});
    },

    //初始化窗口
    window:function(frame){
        var _this =this;
        App.Services.maskWindow = new App.Comm.modules.Dialog({
            title:(App.Local.getTranslation('system-module.Authorize') || "角色授权"),
            width:600,
            height:500,
            isConfirm:false,
            isAlert:false,
            closeCallback:function(){
                App.Services.Member.resetMemData();
                $(".showAll").remove();
            },
            message:frame
        });
        $(".mod-dialog").css({"min-height": "545px"});
        $(".mod-dialog .wrapper .content").css({"min-height": "500px"});
        _this.model.set("namePath",App.Services.memOz);
        $(".seWinBody .aim ul").append(new App.Services.MemberWindowDetail({model:_this.model}).render().el);//当前用户
        $(".memRoleList").append(new App.Services.windowRoleList().render().el);//角色列表
    }
});
