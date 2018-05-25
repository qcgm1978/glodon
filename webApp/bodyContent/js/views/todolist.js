/*
 * @require /bodyContent/js/view/todos.js
 */
App.BodyContent.todosList = Backbone.View.extend({

    _items:0,

    events:{
    },
    render:function(){
        this.$el.html(this.template);
        return this;
    },
    initialize : function(){
        var _this=this;
        this.listenTo(App.BodyContent.control.todoCollection,"add",this.addOne);
        this.listenTo(App.BodyContent.control.todoCollection,"reset",function(){
            $("#todos tbody").empty();
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
        $("#todos tbody").append(el);
        $('.loading1').hide();
    }
});