/**
 * @require /bodyContent/js/views/monthStart.js
 */
App.BodyContent.monthStartList = Backbone.View.extend({

    tagName:'tbody',
    id:"monthStart",
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
        this.listenTo(App.BodyContent.control.monthStartCollection,"add",this.addOne);
         this.listenTo(App.BodyContent.control.monthStartCollection,"reset",function(){
            _this.$el.empty();
            _this._items=0;
        });
    },
    //数据加载
    addOne:function(item){
        this._items++;
        if($('#layoutMonth').height()-70<this._items*30){
            return
        }
        var newView = new App.BodyContent.monthStartView({model : item});
        var el=newView.render().$el;
        if(this._items%2==1){
            el.addClass('odd');
        }

        this.$el.append(el);
    }
});