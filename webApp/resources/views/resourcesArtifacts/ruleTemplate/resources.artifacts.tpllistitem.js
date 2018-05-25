/**
 * @require /resources/collection/resource.nav.es6
 */
App.Resources.ArtifactsTplListItem = Backbone.View.extend({

    tagName:"li",

    template: _.templateUrl("/resources/tpls/resourcesArtifacts/ruleTemplate/resources.artifacts.tpllistitem.html"),

    events:{
        "click .item":"getTpl"
    },
    render:function() {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    },
    initialize:function(){
        this.listenTo(this.model,"change",this.render);
        this.listenTo(this.model,"remove",this.render);
        Backbone.on("resourcesChangeMappingRuleModelName",this.changeName,this);
    },
    //修改模板名称时修改名字
    changeName:function(){
        if(this.$(".item").attr("data-id") == App.ResourceArtifacts.Status.templateId){
            this.$(".item div").text(App.ResourceArtifacts.Status.templateName);
            this.model.set("name",App.ResourceArtifacts.Status.templateName)
        }
    },
    //取得模板
    getTpl:function(){
        var Auth = App.AuthObj.lib;
        if(App.ResourceArtifacts.modelEdit){
            alert("编辑状态不能切换模板");
            return;
        }
        var _this = this;
        App.ResourceArtifacts.Status.templateId = this.model.get("id");//保存id
        App.ResourceArtifacts.Status.templateName = this.model.get("name");//保存name

        this.toggleClass();
        //保存状态
        //if(!App.ResourceArtifacts.Status.saved){
        //    alert("您还有没保存的");
        //    return
        //}
        if(Auth.moduleMappingRule.view) {
            App.ResourceArtifacts.getPlan();
        }
        if(Auth.qualityMappingRule.view){
            App.ResourceArtifacts.getAllQuality(function(){
                App.ResourceArtifacts.departQuality(App.ResourceArtifacts.menu.$(".qualityMenuListGC"),App.ResourceArtifacts.allQualityGC,null,null);
                App.ResourceArtifacts.menu.$(".qualityMenuListGC").show();
                App.ResourceArtifacts.departQuality(App.ResourceArtifacts.menu.$(".qualityMenuListKY"),App.ResourceArtifacts.allQualityKY,null,null);
                App.ResourceArtifacts.tplFrame.$(".tplContent").removeClass("services_loading");
            });
        }
        if(Auth.moduleMappingRule.view || Auth.qualityMappingRule.view){
            Backbone.trigger("mappingRuleModelLoadContent",this.model.get("name"));
        }
    },
    //切换
    toggleClass:function(){
        $(".tplCon li").removeClass("active");
        this.$el.addClass("active");
    }
});