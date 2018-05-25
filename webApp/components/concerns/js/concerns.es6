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
        fetchProjectVersionInfo: "platform/project/{projectId}/version/{projectVersionId}", //项目版本信息
        fetchQualityConcerns: "sixD/{projectId}/{projectVersionId}/problem" ,//隐患,
        fetchInfoByprojectCode:"platform/api/project/{projectCode}/meta?token=123"

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
        $('.designProperties').html(new concerns().render().el);
        ConcernsCollection.reset();
        ConcernsCollection.projectId = query.projectId;
        ConcernsCollection.projectVersionId = query.projectVersionId;
        ConcernsCollection.fetch({
          data: {
            presetPointId:query.acceptanceId,
            category: "", //类别
            type: "", //类型
            status: "", //状态 1:待整改 2:已整改 3:已关闭
            level: "", //等级 1:一般 2:较大 3:重大 4:特大
            reporter: "", //填报人
            startTime: "", //查询时间范围：开始
            endTime: "", //查询时间范围：结束
            pageIndex: 1, //第几页，默认第一页
            pageItemCount: '' //页大小
          },
          success: function(data) {
            console.log(data);
          }
        });
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
        Project.zoomModel(Project.ids, Project.box);

        Project.showMarks(Project.locations);
      });

      //this.viewer.on("click", function(model) {
      //  if (!model.intersect) {
      //    that.resetProperNull();
      //    return;
      //  }
      //  console.log(model);
      //  propertiesCollection.projectId = "1";
      //  propertiesCollection.projectVersionId = "784306105035931";
      //  propertiesCollection.fetch({
      //    data: {
      //      elementId: model.intersect.userId,
      //      sceneId: model.intersect.object.getFileId()
      //    }
      //  });
      //});
    }
  }

  //Project模型操作方法
  var Project = {
    Settings: {projectVersionId:1111},
    templateCache: [],
    concernsData:{
      type:['随机','过程检查','开业验收','入伙验收'],
      report:['','质监','第三方','项目公司','监理单位'],
      classic:['','实测实量','防水工程','施工质量','安全文明','总包内业资料','材料设备'],
      specialty:{
        '1':'建筑',
        '2':'结构',
        '3':'设备',
        '4':'电气',
        '6':'内装',
        'def':'炼钢',
        'abc':'土建'
      }
    },

    //客户化数据映射字典
    mapData: {
      organizationTypeId: ['', '质监', '第三方', '项目公司', '监理单位'],
      status: ['', '待整改', '已整改', '已关闭'],
      statusColor: ['', '#FF2500', '#FFAD25', '#00A648']
    },
    //空页面
    NullPage: {
      designVerification: '<div class="nullPage concerns"><i class="bg"></i>暂无隐患</div>', //设计检查 质量 隐患
      planModel: '<div class="nullPage noPlan"><i class="bg"></i>暂无计划节点</div>', //计划 模块化 模拟
      planPublicity: '<div class="nullPage publicity"><i class="bg"></i>暂无内容</div>', //计划 关注
      costList: '<div class="nullPage costList"><i class="bg"></i>暂无清单项</div>', //成本 清单
      costChange: '<div class="nullPage costChange"><i class="bg"></i>暂无变更单</div>', //成本 变更
      planVerification: '<div class="nullPage planVerification"><i class="bg"></i> <div>您还没有关联校验</div>  <span>点此进行关联校验</span> </div>' //计划成本 关联校验
    },

    //获取模板根据URL
    templateUrl: function(url, notCompile) {

      if (url.substr(0, 1) == ".") {
        url = "/static/dist/tpls" + url.substr(1);
      } else if (url.substr(0, 1) == "/") {
        url = "/static/dist/tpls" + url;
      } else if (url.substr(0, 1) == "*"){
        url = "/static/dist" + url.substr(1);

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
    showInModel: function($target, type) {
      var _this = this,
      ids = $target.data('userId'),
        box = $target.data('box'),
        location = $target.data('location');
      if ($target.hasClass("selected")) {
        return
        //	$target.parent().find(".selected").removeClass("selected");
      } else {
        $target.parent().find(".selected").removeClass("selected");
        $target.addClass("selected");
      }

      if (ids && box) {
        _this.zoomModel(ids, box);
        _this.showMarks(location);
        return;
      }

      var data = {
        URLtype: "fetchQualityModelById",
        data: {
          type: type,
          projectId: Project.Settings.projectId,
          versionId: Project.Settings.projectVersionId,
          acceptanceId: $target.data("id")

        }
      };
      //获取构件ID type 0：开业验收 1：过程验收 2：隐患
      App.Comm.ajax(data, function(data) {

        if (data.code == 0) {

          if (data.data) {
            var location = data.data.location,
              _temp = JSON.parse(location);
            box = _this.formatBBox(_temp.bBox || _temp.boundingBox);
            console.log(location)

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
      try{
        Project.Viewer.loadMarkers(marks);

      }catch(e){
        console.log(marks)
      }
    },
    //通过userid 和 boundingbox 定位模型
    zoomModel: function(ids, box) {
      Project.Viewer.clearIsolate();
      Project.Viewer.clearFilterTranslucentOthersUserIDList();
      //定位
      Project.Viewer.zoomToBox(box);
      Project.Viewer.setSelectedIds(ids);

      //半透明
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
      console.log(data)
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
          projectVersionId: query.projectVersionId || 110
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

  //隐患
  var ConcernsCollection= new(Backbone.Collection.extend({

    model: Backbone.Model.extend({
      defaults: function() {
        return {
          title: ""
        }
      }
    }),

    urlType: "fetchQualityConcerns"



  }));
  //隐患
  var concerns=Backbone.View.extend({

          tagName:"div",

          className:"QualityConcerns",

          initialize:function(){
            this.listenTo(ConcernsCollection,"add",this.addOne);
            //this.listenTo(ConcernsCollection,"reset",this.loading);
          },


          events:{
            "click .searchToggle":"searchToggle",
            "click .tbConcernsBody tr": "showInModel",
            "click .clearSearch": "clearSearch"

          },


          //渲染
          render:function(options){

            //this.ConcernsOptions=options.Concerns;

            var tpl=Project.templateUrl("*/components/concerns/concerns.html");

            this.$el.html(tpl);

            this.bindEvent();

            return this;

          },



    //事件绑定
    bindEvent() {

      var that = this,
          $projectContainer = $("#projectContainer");


      //收起 暂开 属性 右侧
      $projectContainer.on("click", ".rightProperty .slideBar", function() {

        App.Comm.navBarToggle($("#projectContainer .rightProperty"), $("#projectContainer .projectCotent"), "right", Project.Viewer);
      });
      //拖拽 属性内容 右侧
      $projectContainer.on("mousedown", ".rightProperty .dragSize", function(event) {
        App.Comm.dragSize(event, $("#projectContainer .rightProperty"), $("#projectContainer .projectCotent"), "right", Project.Viewer);
      });

    },




          template:Project.templateUrl("*/components/concerns/concerns.body.html"),

          //获取数据后处理
          addOne:function(model){
            var data=model.toJSON(),
              items = data.data.items,
                first = items[0]['location'] ;
            first = JSON.parse(first);
            Project.locations=[];

            this.$(".tbConcernsBody tbody").html(this.template(data));
            for(var i = 0;i < items.length;i++){
              var location = items[i]['location'];

              items[i]['location']?Project.locations.push(location):null;

            }
            Project.box = Project.formatBBox(first['boundingBox']);

            Project.ids = [first['userId']];


            //this.bindScroll();
          },
          //绑定滚动条
          bindScroll() {

            var $materialequipmentListScroll = this.$(".materialequipmentListScroll");

            if ($materialequipmentListScroll.hasClass('mCustomScrollbar')) {
              return;
            }

            $materialequipmentListScroll.mCustomScrollbar({
              set_height: "100%",
              theme: 'minimal-dark',
              axis: 'y',
              keyboard: {
                enable: true
              },
              scrollInertia: 0
            });
          },
          //加载
          loading(){

            this.$(".tbConcernsBody tbody").html(App.Project.Settings.loadingTpl);
            this.searchup();

          },

          //在模型中显示
          showInModel(){
            Project.showInModel($(event.target).closest("tr"),2);
          }

        });

  win.ModelSelection = ModelSelection;
  win.project = Project;


})($, window)