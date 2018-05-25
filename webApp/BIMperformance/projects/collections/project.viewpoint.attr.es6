/**
 * @require /BIMperformance/projects/collections/Project.js
 */
App.Project.ViewpointAttr={
  ListCollection: new(Backbone.Collection.extend({
    model: Backbone.Model.extend(),
    urlType:"fetchModelViewpoint"
  }))
}
