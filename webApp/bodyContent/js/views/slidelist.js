/**
 * @require /bodyContent/js/view/slide.js
 */
App.BodyContent.slideList = Backbone.View.extend({


    tagName:"ul",

    id:"slide",

    events:{
    //无事件，预留
    },
    render:function(){
        this.$el.html(this.template);
        return this;
    },

    initialize : function(){
        this.listenTo(App.BodyContent.control.slideCollection,"add",this.addOne);
    },
    //数据加载
    addOne:function(item){
        var newView = new App.BodyContent.slideView({model : item});
        this.$el.append(newView.render().el);
    }
});