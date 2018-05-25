App.Flow = App.Flow || {};

App.Flow.Controller = {
  default: {
    tabType: ''
  },
  icon: {
    '成本管理': 'm-chengbenguanli',
    '商管工程': 'm-shangguangongcheng',
    '发展管理': 'm-fazhanguanli',
    '计划管理': 'm-jihuaguanli',
    '设计管理': 'm-shejiguanli',
    '招商管理': 'm-zhaoshangguanli',
    '质量管理': 'm-zhiliangguanli',
    '合同确定': 'htqd_icon',
    '合同结算': 'htjs_icon',
    '合同过程管理': 'htgc_icon',
    '通用': 'ty_icon',
    '管理流程': 'ty_icon',
    '地下四大块': 'dxsdk_icon',
    '非计划任务': 'fjhrw_icon',
    '设计': 'icon_sj',
    '招商': 'icon_zs',
    '工程': 'icon_gc',
    '招标': 'icon_zb',
    '成本': 'icon_cb',
    '验收': 'icon_ys',
    '开业': 'icon_ky',
    '移交': 'icon_yj',
  },

  toIcon: function (key) {
    return this.icon[key] || 'm-moren';
  },


  init: function () {
    //实例化
    $('#contains').html(new App.Flow.View().render().$el);
    if (this.default.NavView) {
      this.default.NavView.remove();
    }
    if (this.default.ContentView) {
      this.default.ContentView.remove();
    }
    if (this.default.ProjectNavView) {
      this.default.ProjectNavView.remove();
    }
    if (this.default.ProjectContentView) {
      this.default.ProjectContentView.remove();
    }
    this.default.NavView = new App.Flow.NavView();
    this.default.ContentView = new App.Flow.ContentView();

    this.flowNavCollection.fetch({
      reset: true,
      data: {
        isBimControl: 1,
      },
    })

    $("#pageLoading").hide();

  },
  keyPageInit: function () { //总包交钥匙的页面
    $('#contains').html(new App.Flow.KeyView().render().$el);
    $("#pageLoading").hide();
  },

  renovationProjectInit: function () { //改造项目
    $('#contains').html(new App.Flow.RenovationProject().render().$el);
    if (this.default.NavView) {
      this.default.NavView.remove();
    }
    if (this.default.ContentView) {
      this.default.ContentView.remove();
    }
    if (this.default.ProjectNavView) {
      this.default.ProjectNavView.remove();
    }
    if (this.default.ProjectContentView) {
      this.default.ProjectContentView.remove();
    }
    this.default.ProjectNavView = new App.Flow.ProjectNavView();
    this.default.ProjectContentView = new App.Flow.ProjectContentView();
    this.flowNavCollection.fetch({
      reset: true,
      data: {
        isBimControl: 2,
      },
    })
    $("#pageLoading").hide();
  },
  flowPageName: function (pageName) {
    var ContentAdminBasiPageView = new App.Flow.ContentAdminBasiPageView().render(pageName).el;
    $('#contains').empty("");
    $('#contains').html(ContentAdminBasiPageView);
    $("#pageLoading").hide();
    if (pageName === 'non-standard') {
      $('#downLoad').on('click', function (evt) {
        var id = $(this).data('id');
        App.Comm.previewFile({
          URLtype: 'catalogMap',
        }/* , $(evt.target) */);
        // window.open(id, '_blank');
      })
    }
  },
  webcomeCtr: function () {
    var WelcomeView = new App.Flow.WelcomeView().render().el;
    $('#contains').empty("");
    $('#contains').html(WelcomeView);
    $("#pageLoading").hide();
  },
  flowCollection: new (Backbone.Collection.extend({
    model: Backbone.Model.extend({
      defaults: function () {
        return {
          url: ''
        }
      }
    }),
    urlType: "fetchFlow",
    parse: function (response) {
      if (response.message == "success") {
        return response;
      }
    }

  })),

  flowNavCollection: new (Backbone.Collection.extend({
    model: Backbone.Model.extend({
      defaults: function () {
        return {
          id: "",
          isBimControl: null,
          name: "方案签批",
          order: 1,
          planLink: ""
        }
      }
    }),
    urlType: "fetchNavFlow",
    parse: function (response) {
      if (response.message == "success") {
        return response;
      }
    }

  })),
  flowKeyCollection: new (Backbone.Collection.extend({
    model: Backbone.Model.extend({
      defaults: function () {
        return {
          url: ''
        }
      }
    }),
    urlType: "fetchKeyFlow",
    parse: function (response) {
      if (response.message == "success") {
        return response.data;
      }
    }

  })),
  flowNavFlowCollection: new (Backbone.Collection.extend({
    model: Backbone.Model.extend({
      defaults: function () {
        return {
          url: ''
        }
      }
    }),
    urlType: "getCommFooterLink",
    parse: function (response) {
      if (response.message == "success") {
        return response.data;
      }
    }

  })),
}