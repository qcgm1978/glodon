/*
 * @require /bodyContent/js/model/model.js
 */

App.BodyContent.todosView = Backbone .View.extend({

    className : "",//预留
    events:{
    	"click .noReadTodo": "todoHandle",
    },
    tagName :  "tr",

    template:_.templateUrl("/bodyContent/tpls/todos.html"),

    render : function(){
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    },
    todoHandle:function(evt){
      var target = $(evt.target).closest("a");
      var todoId = target.data('todoid');
      var openUrl = target.data('href');
      $.ajax({
        type:"PUT",
        url: 'platform/todo/'+todoId+'/read',
        success:function(data){
          if(data.code == 0 && data.message == "success"){

          }else{
            alert(data.message);
          }
        }
      });
      window.open(openUrl,"_blank");
      return false;
    },
});