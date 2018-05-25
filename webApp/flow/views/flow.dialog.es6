App.Flow = App.Flow || {};

App.Flow.FlowDialog = Backbone.View.extend({

    className: "flowModal",

    template: _.templateUrl("/flow/tpls/flow.dialog.html"),

    events: {
        'click .dialogClose': 'close'
    },

    close(){
        this.$el.remove();
    },
    render(data,el){
        this.$el.html(this.template(data));
        $('#'+el).append(this.$el);
        return this;
    }

});
