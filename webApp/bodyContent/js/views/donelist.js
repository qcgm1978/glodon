/*
 * @require /bodyContent/js/view/todos.js
 */
App.BodyContent.doneList = Backbone.View.extend({

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
        this.listenTo(App.BodyContent.control.doneCollection,"add",this.addOne);
        this.listenTo(App.BodyContent.control.doneCollection,"reset",function(){
            $("#dones tbody").empty();
            _this._items=0;
         });
        this.render();
    },
    //数据加载
    addOne:function(item){
        this._items++;
        if($('#layoutTodo').height()-70<this._items*30){
            return
        }
        var newView = new App.BodyContent.todosView({model : item});
        var el=newView.render().$el;
        if(this._items%2==1){
            el.addClass('odd');
        }
        $("#dones tbody").append(el);
    }
});