/**
 * @require /resources/collection/resource.nav.es6
 */
App.Resources.ArtifactsQualityList = Backbone.View.extend({

    tagName:"div",

    className: "qualityCon",

    template: _.templateUrl("/resources/tpls/resourcesArtifacts/mappingRule/resources.artifacts.quality.html"),

    events:{
        "click .present": "present",
        "click .pro": "choose"
    },

    render:function() {
        this.$el.html(this.template);
        return this;
    },

    initialize:function(){

    },

    //当前选项
    present:function(){
        var active = this.$(".qualityProcess");
        if( active.hasClass("active") ){
            active.removeClass("active") ;
            return
        }
        active.addClass("active");
    },

    //切换，一次加载，仅切换不同对话框
    choose:function(){
        var _this = this;
        this.toggle();
        App.ResourceArtifacts.departQuality();
    },
    //切换过程
    toggle:function(){
        var extendData,extendText;
        this.$(".qualityProcess").removeClass("active");
        var newData = this.$(".pro").data("type") , newText =  this.$(".pro").text();
        var oldData = this.$(".present").data("type") , oldText = this.$(".present").text();
        extendData = oldData;
        extendText = oldText;
        this.$(".present").data("type",newData);
        this.$(".present").text(newText);
        this.$(".pro").data("type",extendData);
        this.$(".pro").text(extendText);
        App.ResourceArtifacts.Status.qualityStandardType = newData;
        if(newData == "GC"){
            this.$(".qualityMenuListGC").show().siblings(".qualityMenuListKY").hide();
        }else{
            this.$(".qualityMenuListKY").show().siblings(".qualityMenuListGC").hide();
        }
    }
});