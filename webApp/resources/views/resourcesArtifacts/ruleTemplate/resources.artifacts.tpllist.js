/**
 * @require /resources/collection/resource.nav.es6
 */
App.Resources.ArtifactsTplList = Backbone.View.extend({

    tagName:"div",

    className: "artifactsList",

    events:{
        "click .newPlanRule":"newPlanRule"
    },

    template: _.templateUrl("/resources/tpls/resourcesArtifacts/ruleTemplate/resources.artifacts.tpllist.html"),
    render:function() {
        this.$el.html(this.template);
        return this;
    },
    initialize:function(){
        this.listenTo(App.ResourceArtifacts.TplCollection,"add",this.addOne);
    },
    addOne:function(model) {
        var newList = new App.Resources.ArtifactsTplListItem({model: model});
        this.$("ul").append(newList.render().el);
        App.Comm.initScroll($(".list"),"y");
    },
    //创建规则
    newPlanRule:function(){
        var _this = this;
        if(App.ResourceArtifacts.modelEdit){
            alert("编辑状态不能创建模板！");
            return;
        }

        if( !App.ResourceArtifacts.Status.saved){
            alert("您还有没保存的");
            //查找未保存的元素并高亮提示变红
            return
        }
        var frame = new App.Resources.ArtifactsWindowTpl().render().el; //新建模板
        this.window(frame);
    },
    //初始化窗口
    window:function(frame){
        App.Resources.ArtifactsMaskWindow = new App.Comm.modules.Dialog({
            title:"新建模板",
            width:600,
            height:500,
            isConfirm:false,
            isAlert:false,
            closeCallback:function(){
                App.Resources.ArtifactsMaskWindow.close();
            },
            message:frame
        });
    }
});