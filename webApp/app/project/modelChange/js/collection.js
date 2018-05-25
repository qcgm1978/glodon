/**
 * @require /app/project/modelChange/js/comm.js
 */

App.Project = {};
App.Project.Collection = {
  changeList: new(Backbone.Collection.extend({
    model: Backbone.Model.extend({
      defaults: function() {
        return {
          title: ""
        }
      }
    }),

    urlType: "modelStd"

  })),
  changeInfo: new(Backbone.Collection.extend({
    model: Backbone.Model.extend({
      defaults: function() {
        return {
          title: ""
        }
      }
    }),
    urlType: "fetchDesignChangeInfo"
  }))
};