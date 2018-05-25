/**
 * @require /bodyContent/js/view/monthEnd.js
 */
App.BodyContent.monthEndList = Backbone.View.extend({

    _items:0,

    tagName:'tbody',

    id:"monthEnd",
    events:{
    //无事件，预留
    },
    render:function(){
        this.$el.html(this.template);
        return this;
    },

    initialize : function(){
        var _this=this;
        this.listenTo(App.BodyContent.control.monthEndCollection,"add",this.addOne);
        this.listenTo(App.BodyContent.control.monthEndCollection,"reset",function(){
            _this.$el.empty();
            _this._items=0;
        });
    },
    //数据加载

    addOne:function(item){
        var newView = new App.BodyContent.monthEndView({model : item});
        this._items++;
        if($('#layoutMonth').height()-70<this._items*30){
            return
        }
        var el=newView.render().$el;
        if(this._items%2==1){
            el.addClass('odd');
        }

        this.$el.append(el);
    }
});