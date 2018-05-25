/**
 * @require /resources/collection/resource.nav.es6
 */
App.Resources.ArtifactsTplFrame = Backbone.View.extend({

    tagName:"div",

    className: "artifactsTplFrame",

    template: _.templateUrl("/resources/tpls/resourcesArtifacts/ruleTemplate/resources.artifacts.tplframe.html"),

    render:function() {
        this.$el.html(this.template);
        return this;
    },

    initialize:function(){
        Backbone.on("mappingRuleModelLoadContent",this.loadContent,this);
        Backbone.on("mappingRuleResetModel",this.mappingRuleResetModel,this);
    },

    mappingRuleResetModel:function(){
        this.$(".tplContent>.default").show();
    },

    //写入模板包含的内容
    loadContent:function(name){
        var _this = this;
        this.$(".tplContent").addClass("services_loading");
        //重置右侧列表
        $("#artifacts").addClass("tpl");//此处为修正样式表现
        //修改内容
        this.$(".tplDetailTitle h2").text(name);
        this.$(".tplDetailTitle .tplName").val(name);
        this.$(".artifactsContent").addClass("explorer");
        this.$(".artifactsContent .default").show().siblings().hide();
        this.$(".artifactsNav li").eq(0).addClass("active").siblings("li").removeClass("active");

        //隐藏默认
        this.$(".tplContent>.default").hide();

        this.getTplRule();//获取规则模板列表
    },

    //获取模板规则列表
    getTplRule:function(){
        var _this = this;
        var pdata = {
            URLtype:"fetchArtifactsTemplateRule",
            data:{
                templateId : App.ResourceArtifacts.Status.templateId
            }
        };
        App.Comm.ajax(pdata,function(response){
            if(response.code == 0 && response.data){
                if(response.data.length){
                    App.ResourceArtifacts.TplCollectionRule.add(response.data);
                    _this.$(".artifactsContent .default").hide();
                    _this.$(".artifactsContent .plans").show();
                    _this.$(".artifactsContent .rules").show();
                }else{
                    //没有任何规则时候，显示创建规则按钮
                    _this.$(".artifactsContent .default").siblings().hide();
                }
                _this.$(".tplContent").removeClass("services_loading");
            }
        })
    }
});