(function($, win) {

  //默认设置
  win.App = {
    API: {
      Settings: {
        hostname: "/",
        debug: false
      },

      URL: {
        fetchQualityModelById: "sixD/{projectId}/{versionId}/quality/element",
        fetchDesignProperties: "sixD/{projectId}/{projectVersionId}/property", //设计属性 ?sceneId={sceneId}&elementId={elementId}
        fetchProjectVersionInfo: "platform/project/{projectId}/version/{projectVersionId}" //项目版本信息

      }
    }
  };

  //模态框模型选择器对象
  var ModelSelection = function(options) {

    //强制new
    if (!(this instanceof ModelSelection)) {
      return new ModelSelection(options);
    }

    var defaults = {
      btnText: '确&nbsp;&nbsp;定'
    }

    //合并参数
    this.Settings = $.extend(defaults, options);
    Project.Settings = this.Settings;
    this.init();
  }
  ModelSelection.prototype = {
    init: function() {
      var self = this,
        srciptUrl = '/static/dist/libs/libsH5_20160313.js',
        styleUrl = '/static/dist/libs/libsH5_20160313.css',
        $script = '<script src="' + srciptUrl + '"></script>',
        $css = '<link rel="stylesheet" href="' + styleUrl + '" />';
      $script2 = '<script src="/static/dist/comm/comm_20160313.js"></script>',
        $css2 = '<link rel="stylesheet" href="/static/dist//comm/comm_20160313.css" />';
      if (!ModelSelection.isLoad) {
        $('head').append($css, $script, $css2, $script2);
        ModelSelection.isLoad = true;
      }
      self.dialog();
      self.controll();
    },
    controll: function() {
      var self = this;
      self.$dialog.on('click', '.toolsBtn', function() {
        self.getSelected();
      }).on('click', '.dialogClose', function() {
        self.$dialog.remove();
        self.$dialog = null;
      }).on('click', '.dialogOk', function() {
        var setting = self.Settings;
        if (setting.callback && setting.callback.call(this) !== false) {
          self.$dialog.remove();
          self.$dialog = null;
          return self.viewData
        }
      }).on('click', '.rightBar .m-openTree,.rightBar .m-closeTree', function() {
        var $this = $(this),
          $li = $this.closest('.itemNode');
        $this.toggleClass('m-openTree m-closeTree');
        $li.toggleClass('open');
      })
    },
    dialog: function() {
      var self = this,
        Settings = this.Settings,
        $dialog;
      if (this.$dialog) {
        $dialog = self.$dialog;
      } else {


        $dialog = self.$dialog = $('<div class="modelSelectDialog"></div>');
        var $body = $('<div class="dialogBody"></div>'),
          $modelView = self.$modelView = $('<div id="modelView" class="model"></div>')

      }
      $dialog.append($body);
      //$("body").append($dialog);
      setTimeout(function() {
        self.renderModel();
        Project.getname();

      }, 10);
    },
    renderModel: function() {
      //设置onlymodel
      App.Global || (App.Global = {} );
      App.Comm.setOnlyModel();

      this.viewer = new bimView({
        type: 'model',
        element: $('.projectCotent'),
        sourceId: this.Settings.sourceId,
        etag: this.Settings.etag,
        projectId: this.Settings.projectId,
        projectVersionId: this.Settings.projectVersionId
      })
      Project.Viewer = this.viewer;
      $('.m-camera').addClass('disabled').attr('disabled','disabled');

      this.viewer.on("loaded", function() {

        Project.showInModel(query.acceptanceId,query.type);
      });

      this.viewer.on("click", function(model) {
        if (!model.intersect) {
          that.resetProperNull();
          return;
        }
        console.log(model);
        propertiesCollection.projectId = "1";
        propertiesCollection.projectVersionId = "784306105035931";
        var userSceneId = model.intersect.userId.split('.')[0];
        propertiesCollection.fetch({
          data: {
            elementId: model.intersect.userId,
            sceneId:  userSceneId
          }
        });
      });
    }
  }

  //Project模型操作方法
  var Project = {
    Settings: {},
    templateCache: [],
    //获取模板根据URL
    templateUrl: function(url, notCompile) {

      if (url.substr(0, 1) == ".") {
        url = "/static/dist/tpls" + url.substr(1);
      } else if (url.substr(0, 1) == "/") {
        url = "/static/dist/tpls" + url;
      }

      if (Project.templateCache[url]) {
        return Project.templateCache[url];
      }

      var result;
      $.ajax({
        url: url,
        type: 'GET',
        async: false
      }).done(function(tpl) {
        if (notCompile) {
          result = tpl;

        } else {
          result = _.template(tpl);
        }

      });

      Project.templateCache[url] = result;

      return result;
    },
    //获取url 参数
    GetRequest() {
      var url = location.search; //获取url中"?"符后的字串
      var theRequest = new Object();
      if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
          theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
      }
      return theRequest;
    },
    showInModel: function(id, type) {
      var _this = this;


      var data = {
        URLtype: "fetchQualityModelById",
        data: {
          type: type,
          projectId: query.projectId,
          versionId: query.projectVersionId,
          acceptanceId: id,
          position:{x:1,y:2,z:3}
        }
      };
      //获取构件ID type 0：开业验收 1：过程验收 2：隐患
      App.Comm.ajax(data, function(data) {

        if (data.code == 0) {

          if (data.data) {
            console.log(data)
            var location = data.data.location,
              _temp = JSON.parse(location);
            box = _this.formatBBox(_temp.bBox || _temp.boundingBox);
            ids = [_temp.userId];
            //$target.data("userId", ids);
            //$target.data("box", box);
            //$target.data("location", location);
            _this.zoomModel(ids, box);
            _this.showMarks(location);
          }
        }
      });
    },

    showMarks: function(marks) {
      if (!_.isArray(marks)) {
        marks = [marks];
      }
      Project.Viewer.loadMarkers(marks);
    },
    //通过userid 和 boundingbox 定位模型
    zoomModel: function(ids, box) {
      Project.Viewer.clearIsolate();
      Project.Viewer.clearFilterTranslucentOthersUserIDList();
      Project.Viewer.zoomToBox(box);
      Project.Viewer.setSelectedIds(ids);
      //CLOUD.FilterUtil.isolateSelections(CLOUD.EnumIsolateState.TRANSLUCENT_OTHERS, App.Project.Settings.Viewer.viewer);
      Project.Viewer.setTranslucentUnselected();
      Project.Viewer.clearSelection();
      //高亮
      Project.Viewer.highlight({
        type: 'userId',
        ids: ids
      });
    },
    //转换bounding box数据
    formatBBox: function(data) {
      if (!data) {
        return [];
      }
      var box = [],
        min = data.min,
        minArr = [min.x, min.y, min.z],
        max = data.max,
        maxArr = [max.x, max.y, max.z];
      box.push(minArr);
      box.push(maxArr);
      return box;
    },

    getname: function(){
      var data = {
        URLtype: "fetchProjectVersionInfo",
        data: {
          projectId: query.projectId,
          projectVersionId: query.projectVersionId
        }
      };
      //获取构件ID type 0：开业验收 1：过程验收 2：隐患
      App.Comm.ajax(data, function(data) {

        if (data.code == 0) {

          if (data.data) {
            $('.project .text').text(data.data.projectName);
            $('.projectVersion .text').text(data.data.name);
          }
        }
      });
    }

  }

  	// 属性 collection
  var propertiesCollection = new(Backbone.Collection.extend({

    model: Backbone.Model.extend({
      defaults: function() {
        return {
          title: ""
        }
      }
    }),

    urlType:"fetchDesignProperties",

    parse:function(response){
      if (response.code == 0) {
        return response;
      }
    }

  }));
  //过程检查
  var property = new (Backbone.View.extend({

    tagName:"div",

    className:"QualityProperties",

    initialize:function(){
      //this.listenTo(App.Project.QualityAttr.PropertiesCollection,"add",this.addOne);
      this.listenTo(propertiesCollection,"add",this.addOne);
      this.bindEvent();
    },

      //事件绑定
      bindEvent() {

        var that = this,
            $projectContainer = $("#projectContainer");

        //收起 暂开 属性内容
        $projectContainer.on("click", ".modleShowHide", function() {
          $(this).toggleClass("down");
          var $modleList = $(this).parent().siblings(".modleList");
          if(!$modleList.length){
            $modleList = $(this).parent().find(".modleList");
          }
          $modleList.slideToggle();

        });

        //收起 暂开 属性 右侧
        $projectContainer.on("click", ".rightProperty .slideBar", function() {

          App.Comm.navBarToggle($("#projectContainer .rightProperty"), $("#projectContainer .projectCotent"), "right", Project.Viewer);
        });
        //拖拽 属性内容 右侧
        $projectContainer.on("mousedown", ".rightProperty .dragSize", function(event) {
          App.Comm.dragSize(event, $("#projectContainer .rightProperty"), $("#projectContainer .projectCotent"), "right", Project.Viewer);
        });

        //tree toggle show  hide
        $projectContainer.on("click", ".nodeSwitch", function(event) {
          var $target = $(this);

          if ($target.hasClass("on")) {
            $target.closest("li").children("ul").hide();
            $target.removeClass("on");
          } else {
            $target.closest("li").children("ul").show();
            $target.addClass("on");
          }
          event.stopPropagation();
        })
      },

    events:{},


    //渲染
    render:function(){

      this.$el.html('<div class="nullTip">请选择构件</div>');

      return this;

    },

    template:Project.templateUrl("/projects/tpls/project/design/project.design.property.properties.html"),

    //获取数据后处理
    addOne:function(model){
      var data=model.toJSON().data;
      var temp=JSON.stringify(data);
      temp=JSON.parse(temp);
      this.$el.html(this.template(temp));
      $('.designProperties').html(this.$el);
    }


  }));


  win.ModelSelection = ModelSelection;
  win.project = Project;
})($, window)