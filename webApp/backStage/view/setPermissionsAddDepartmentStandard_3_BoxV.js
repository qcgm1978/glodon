var App = App || {};
App.backStage.AddDepartmentStandard_3 = Backbone.View.extend({
  tagName: 'div',
  className: 'step3',
  template: _.templateUrl("/backStage/tpls/setPermissions/setPermissionsPublicDepartmentBox_3.html"),
  events: {
    "click  p": "changeStatus"
  },
  initialize: function() {
    this.listenTo(App.backStage.Step3, 'add', this.render)
  },
  render: function() {//准备Collection的MODELS
    var datas = {
      direction: App.backStage.Step3.toJSON() || [],
    };
    this.$el.html(this.template(datas));
    return this;
  },
  changeStatus: function(e) { //打开或关闭目录
    var $p, target, el = this.$el;
    if ($(e.target).hasClass('person') || $(e.target).hasClass('mulu')) {
      $p = $(e.target);
      target = 'p';

    } else {
      $p = $(e.target).parent();

      if ($(e.target).hasClass('isspan')) {
        target = 'span';
      } else {
        target = 'i';
      }
    }
    var $ul = $p.siblings('ul');

    var func = function(isstep3) {
      //是否需要加载子目录
      var canLoad = $p.attr('data-canLoad');

      var orgId = $p.attr('data-id');
      if (orgId) {
        if ($ul.hasClass('shut')) {

          $p.removeClass('shut').addClass('open');

          if (canLoad == 'true') {
            $ul.removeClass('shut').addClass('open');
            App.Comm.ajax({
              URLtype: 'fetchServicesMemberOuterList',
              data: {
                parentId: orgId,
                includeUsers: false
              }
            }, function(r) {

              if (r && !r.code && r.data) {
                var str = '';

                _.each(r.data.org, function(data) {
                  data.shut = true;
                  data.canLoad = true;
                  str += "<li>" +
                    "<p class='shut mulu" + "' data-id='" + data['orgId'] + "' data-outer='" + data['outer'] + "' data-name='" + data['name']  + "' data-canLoad='" + (data['hasChildren'] || data['hasUser'] ? true : false) + "'><i ></i><span class='isspan'>" + data['name'] + "</span></p>" +
                    "<ul class='shut'></ul>" +
                    "</li>";
                });
                $p.siblings('ul').html(str);


              }
            });
            $p.attr('data-canLoad', 'false')
          } else {
            $ul.removeClass('shut').addClass('open');
            $p.removeClass('shut').addClass('open');

          }

        } else {
          $ul.removeClass('open').addClass('shut');
          $p.removeClass('open').addClass('shut');

        }
      } else {
        //选定人员
        el.find('.toselected').removeClass('toselected');
        $p.parent().addClass('toselected');

      }
    };

    //点击的是文件夹ICON
    if (target == 'i') {
      func()
    } else {
      $('.leftWindow').find('.toselected').removeClass('toselected');
      $p.parent().addClass('toselected');
    }
  }
});