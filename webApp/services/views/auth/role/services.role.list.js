/*
 * @require  /services/views/auth/role/services.role.window.index.js
 */
App.Services.roleList=Backbone.View.extend({

    tagName:"div",
    className:"roleCtrl",

    events:{
        "click .newRole": "newRole"
    },
    template:_.templateUrl("/services/tpls/auth/role/services.role.list.html"),

    render:function(){
        this.$el.html(this.template);
        return this;
    },
    initialize:function(){
       this.listenTo(App.Services.role.collection,"add",this.addOne);
       this.listenTo(App.Services.role.collection,"remove",this.addAll);
    },
    //数据加载
    addOne:function(model){
        var newView = new App.Services.roleDetail({model:model});
        this.$("#roleList ul").append(newView.render().el);
        App.Comm.initScroll(this.$el.find(".roleScroll"),"y");
    },

    //添加
    addAll:function(){
        var _this = this;
        this.$("#roleList ul").empty();
        App.Services.role.collection.each(function(item){
            _this.addOne(item);
        });
    },

    //创建新角色
    newRole:function(){
        App.Services.roleModify = false;
        //框架
        var frame = new App.Services.roleWindowIndex().render().el;
        //初始化窗口
        App.Services.maskWindow = new App.Comm.modules.Dialog({
            title:"新建角色",
            width:600,
            height:500,
            isConfirm:false,
            isAlert:false,
            closeCallback:function(){},
            message:frame
        });
        $(".mod-dialog").css({"min-height": "545px"});
        $(".mod-dialog .wrapper .content").css({"min-height": "500px"});


        //角色信息
        App.Services.roleFun.loadData({},function(){});
    },
    //排序
    comparator:function(){

    }
});




