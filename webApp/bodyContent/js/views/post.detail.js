App.BodyContent.postDetailView= Backbone.View.extend({

	className:'postContainer',

	template:_.templateUrl("/bodyContent/tpls/post.detail.html"),

    initialize : function(){
        this.listenTo(App.BodyContent.control.postDetailCollection,"reset",this.render);
    },
    //数据加载
    render:function(item){
    	var data=item.toJSON();
        this.$el.html(this.template(data[0]));
        $('#contains').append(this.$el);
    }
});