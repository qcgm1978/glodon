/*
 * @require  /services/views/auth/member/services.member.ozDetail.js
 * */
App.Services.MappingRuleWindow = Backbone.View.extend({

    tagName :'div',
    className:"projectMappingRuleWindow",

    template:_.templateUrl("/services/tpls/project/projects.mappingrule.window.model.html"),

    events:{
        "click .windowSubmit":"sure"
    },

    render:function(){
        this.$el.html(this.template);
        return this;
    },

    initialize:function(){
        this.listenTo(App.Services.ProjectCollection.ProjectMappingRuleModelCollection,"add",this.addOne);
    },

    //数据加载
    addOne:function(model){
        var newView = new App.Services.MappingRuleWindowDetail({model:model});
        this.$(".projectMappingModelList ul").append(newView.render().el);
        App.Comm.initScroll(this.$el.find(".projectMappingRuleWindow"),"y");
    },


    //确定
    sure : function(){
        var _this = this,
            data,
            templateId  = $(".projectMappingModelList li.active .item").data("id"),
            name = $(".projectMappingModelList li.active .item").text();

        data = {
            URLtype:"modifyProjectMappingRule",
            data:{
                projectId:App.Services.ProjectMappingRuleId,
                templateId:templateId
            },
            type:"PUT"
        };

        App.Comm.ajax(data,function(response){
            console.log(response);
            if(response.code == 0){
                $(".mappingHeader .nameBox").text(name);
            }else{
            }
            App.Services.maskWindow.close();
        });

    },
        //取消
    cancel:function(){
        App.Services.maskWindow.close();
    },
    //关闭
    close:function(){
        App.Services.maskWindow.close();
    }
});

