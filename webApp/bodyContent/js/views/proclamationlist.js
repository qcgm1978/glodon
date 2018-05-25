/**
 * @require /bodyContent/js/view/proclamation.js
 */
App.BodyContent.proclamationList = Backbone.View.extend({
    _items:0,
    events:{
    //无事件，预留
    },
    render:function(){
        this.$el.html(this.template);
        return this;
    },

    initialize : function(){
        var _this=this;
        this.listenTo(App.BodyContent.control.proCollection,"add",this.addOne);
        this.listenTo(App.BodyContent.control.proCollection,"reset",function(){
            $('#proclamation').empty();
            _this._items=0;
        });
    },
    //数据加载
    addOne:function(item){
        item = item.toJSON();
        this._items++;
        if($('#layoutPost').height()-70<this._items*30){
            return
        }
        var newView = new App.BodyContent.proclamationView({model : item});
        var el=newView.render().$el
        if(this._items%2==1){
            el.addClass('odd');
        }
        $('#proclamation').append(el);
    }
});