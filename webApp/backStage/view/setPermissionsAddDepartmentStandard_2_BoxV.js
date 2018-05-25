var App = App || {};
App.backStage.AddDepartmentStandard_2 = Backbone.View.extend({
  tagName: 'div',
  className: 'step1',
  template: _.templateUrl("/backStage/tpls/setPermissions/setPermissionsPublicDepartmentBox_1.html"),
  events: {
    "click  p": "changeStatus"
  },
  initialize: function() {
    this.listenTo(App.backStage.Step1, 'add', this.render)
  },
  render: function(name) {
    var self = this;
    if (name && name == 'step3') {
      this.$el.addClass('step1in3');
    } else if (typeof name == 'string') {
      $.ajax({
        url: "platform//auth/user?name=" + name
      }).done(function(data) {
        if (data.code == 0) {
          var items = data.data,
            str = "";
          $.each(items, function(i, item) {
            if (item.name) {
              str += "<li>" +
                "<p class='person " + "' data-uid='" + item['userId'] + "'  ><i ></i><span class='isspan'>" + item['name'] + "</span><span class='namepath' title='" + item['orgNamePath'] + "'> (..." + (item['orgNamePath']).split(">").pop() + ")</span></p>" +
                "</li>";
            }
          });
          self.$el.html(str);
        }
      });
    } else {//准备Collection的MODELS
      var datas = {
        direction: App.backStage.Step1.toJSON() || []
      };
      this.$el.html(this.template(datas));
    }
    return this;
  },
  changeStatus: function(e) { //打开或关闭目录
    var $p,
        instep3,
        target,
        el = this.$el;
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
    //判断是否是step3里加载的step1
    instep3 = this.$el.hasClass('step1in3');
    var func = function(isstep3) {//是否需要加载子目录
      var canLoad = $p.attr('data-canLoad');
      var orgId = $p.attr('data-id');
      if (orgId) {
        if ($ul.hasClass('shut')) {
          $p.removeClass('shut').addClass('open');
          if (canLoad == 'true') {
            $ul.removeClass('shut').addClass('open');
            $('.leftWindow').addClass("services_loading");
            App.Comm.ajax({
              URLtype: 'fetchServicesMemberInnerList',
              data: {
                parentId: orgId,
                includeUsers: true
              }
            }, function(r) {
              $('.leftWindow').removeClass("services_loading");
              if (r && !r.code && r.data) {
                var str = '';
                if (isstep3 != "isstep3") {
                  _.each(r.data.user, function(data) {
                    data.canLoad = false;
                    str += "<li>" +
                      "<p class='person " + "' data-uid='" + data['userId'] + "' data-canLoad='true' ><i ></i><span class='isspan'>" + data['name'] + "</span></p>" +
                      "</li>";
                  });
                }
                _.each(r.data.org, function(data) {
                  data.shut = true;
                  data.canLoad = true;
                  //<%= data[i]['child'] && data[i]['child'][0]=='string'?'lastLayer':''%>
                  str += "<li>" +
                    "<p class='shut mulu" + "' data-id='" + data['orgId'] + "' data-name='" + data['name'] + "' data-outer='" + data['outer'] + "' data-canLoad='" + (data['hasChildren'] || data['hasUser'] ? true : false) + "'><i ></i><span class='isspan'>" + data['name'] + "</span></p>" +
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
    if (instep3) {
      //点击的是文件夹ICON
      if (target == 'i') {
        func('isstep3')
      } else {
        $('.leftWindow').find('.toselected').removeClass('toselected');
        $p.parent().addClass('toselected');
      }
    } else {
      func();
    }
  }
});