/**
 * @require /BIMperformance/libsH5/js/bimView.js
 * @require /BIMperformance/libsH5/js/bimView.sidebar.js
 */
'use strict';
(function($) {
  bimView.model = {
    model: function(options, obj) {
      var self = this;
      var _opt = options;
      var viewer = new self.BIM(_opt);
        //debugger;
      new bimView.sidebar.init(_opt, obj);
      obj.on('loaded', function() {
        $('.modelSidebar').addClass('show');
        viewer.goToInitialView();
        viewer.zoomToBuilding(0, 1.15);
        $('[data-id="rotateMouse"]').click();
      });
      return viewer;
    },
    singleModel: function(options) {
      var self = this;
      var _opt = options;
      var modelBar = $('<div class="modelBar"></div>');
      //批注工具
      if (options.isComment) {
        self.singleBar.push({
          id: 'comment',
          icon: 'm-camera',
          title: App.Local.getTranslation('drawing-model.Screenshot')||'快照',
          fn: 'comment',
          keyCode: '',
          type: 'filter',
          group: '1'
        });
      }

      //简化工具
      //if (options.isSingle) {
      //  self.singleBar.push({
      //    id: 'comment',
      //    icon: 'm-camera',
      //    title: '快照',
      //    fn: 'comment',
      //    keyCode: '',
      //    type: 'filter',
      //    group: '1'
      //  }, {
      //    id: 'zoom',
      //    icon: 'm-zoom',
      //    title: '缩放(Z)',
      //    fn: 'zoom',
      //    keyCode: '',
      //    type: 'pattern',
      //    group: '3'
      //  });
      //}

      $.each(self.singleBar, function(i, item) {
        if (item.type == 'more') {
          tmpHtml = $('<div class="bar-item ' + item.icon + '" title="' + item.title + '" data-id="' + item.fn + '" data-type="' + item.type + '" data-group="' + item.group + '"></div>');
        } else {
          tmpHtml = $('<i class="bar-item ' + item.icon + '" title="' + item.title + '" data-id="' + item.fn + '" data-type="' + item.type + '" data-group="' + item.group + '"></i>');
        }
        bimView.comm.bindEvent.on(item.keyCode, tmpHtml);
        if (item.subBar && item.subBar.length > 0) {
          var subBar = $('<div class="subBar"></div>')
          $.each(item.subBar, function(index, barItem) {
            var subItem = $('<i class="bar-item ' + barItem.icon + '" title="' + barItem.title + '" data-id="' + barItem.fn + '" data-type="' + barItem.type + '" data-group="' + barItem.group + '"></i>');
            barItem.keyCode && bimView.comm.bindEvent.on(barItem.keyCode, subItem);
            subBar.append(subItem);
          });
          tmpHtml.append(subBar);
        }
        modelBar.append(tmpHtml);
      });
      _opt._dom.bimBox.append(_opt._dom.lockAxis,_opt._dom.isolation,modelBar);
      //_opt._dom.bimBox.append(modelBar);
      var viewer = new self.BIM(_opt);
      // viewer.disableLoD();
      return viewer;
    },
    familyModel: function(options) {
      var self = this;
      var _opt = options;
      bimView.comm.ajax({
        type: 'get',
        url: bimView.API.fetchFamilyType,
        etag: _opt.etag
      }, function(res) {
        var data = JSON.parse(res);
        var modelBar = $('<div class="modelBar"><div class="modelSelect"><span class="cur"></span></div></div>');
        var modelList = $('<ul class="modelList"></ul>');
        if (_opt.callback) _opt.callback(data.id);
        bimView.comm.filterData = [];
        $.each(data.types, function(i, item) {
          var itemHtml = $('<li class="modelItem" data-id="' + item.id + '" data-type="familyType">' + item.name + '</li>');
          modelList.append(itemHtml);
          bimView.comm.filterData.push(item.id);
        });
        modelBar.find('.modelSelect').append(modelList);
        _opt._dom.bimBox.append(modelBar,_opt._dom.isolation);
        modelBar.find(".modelItem:eq(0)").trigger('click');
      });
      var viewer = new self.BIM(_opt);
      //viewer.disableLoD();
      return viewer;
    },
    comment: function(element) {
      var self = this;
      var modelBar = $('<div class="commentBar"></div>');
      $.each(self.commentBar, function(i, item) {
        var tmpHtml;
        if (i == 0) {
          tmpHtml = $('<i class="bar-item ' + item.icon + ' selected" title="' + item.title + '" data-id="' + item.fn + '" data-type="' + item.type + '"></i>');
        }else if (item.type == 'more') {
          tmpHtml = $('<div class="bar-item ' + item.icon + '" title="' + item.title + '" data-id="' + item.fn + '" data-type="' + item.type+ '" data-color="' + item.icon + '" data-group="' + item.group + '"></div>');
        } else {
          tmpHtml = $('<i class="bar-item ' + item.icon + '" title="' + item.title + '" data-id="' + item.fn + '" data-type="' + item.type + '"></i>');
        }

        bimView.comm.bindEvent.on(item.keyCode, tmpHtml);
        if (item.subBar && item.subBar.length > 0) {
          var subBar = $('<div class="subBar"></div>')
          $.each(item.subBar, function(index, barItem) {
            var subItem = $('<i class="bar-item ' + barItem.icon + '" title="' + barItem.title + '" data-id="' + barItem.fn+ '" data-color="' + barItem.icon+ '" data-param="' + barItem.color + '" data-type="' + barItem.type + '" data-group="' + barItem.group + '"></i>');
            barItem.keyCode && bimView.comm.bindEvent.on(barItem.keyCode, subItem);
            subBar.append(subItem);
          });
          tmpHtml.append(subBar);
        }

        modelBar.append(tmpHtml);
      });
      element.append(modelBar);
    },
    BIM: function(options) {
        // debugger;
      var self = this;
      return self.init(options);
    },
    dwg: function(options) {

    },
    singleBar: [
    //  {
    //  id: 'zoom',
    //  icon: 'm-zoom',
    //  title: '缩放',
    //  fn: 'zoom',
    //  keyCode: '',
    //  type: 'pattern',
    //  group: '3'
    //},
      {
      id: 'fit',
      icon: 'm-fit',
      title: (App.Local.data['model-view'].Fw || "适应窗口"),
      fn: 'fit',
      keyCode: '',
      type: 'viewer'
    },{
      id: 'kuangsuo',
      icon: 'm-kuangsuo',
      title: (App.Local.data['model-view'].Zm || '框选缩放'),
      fn: 'setRectZoomMode',
      type: 'mode',
      group: '3'
    }, {
      id: 'rotate',
      icon: 'm-rotateMouse',
      title: App.Local.getTranslation('model-view.Dw')||'动态观察',
      fn: 'rotate',
      keyCode: '',
      type: 'more',
      group: '0',
      subBar: [{
        id: 'rotateMouse',
        icon: 'm-rotateMouse',
        title: (App.Local.data['model-view'].Re || '绕鼠标旋转'),
        fn: 'rotateMouse',
        keyCode: '',
        type: 'rotate',
        group: '3'
      }, {
        id: 'rotateCamera',
        icon: 'm-rotateCamera',
        title: (App.Local.data['model-view'].Ru || '绕观察者旋转'),
        fn: 'rotateCamera',
        keyCode: '',
        type: 'rotate',
        group: '3'
      }, {
        id: 'rotateObj',
        icon: 'm-rotateObj',
        title: (App.Local.data['model-view'].Rt || '绕构件旋转'),
        fn: 'rotateObj',
        keyCode: '',
        type: 'rotate',
        group: '3'
      }]
    },
    //  {
    //  id: 'isolation',
    //  icon: 'm-isolation',
    //  title: '隔离',
    //  fn: 'isolation',
    //  keyCode: '',
    //  type: 'more',
    //  group: '0',
    //  subBar: [ {
    //    id: 'xuanban',
    //    icon: 'm-xuanban',
    //    title: '选中构件半透明',
    //    fn: 'setTranslucentSelected',
    //    keyCode: '',
    //    type: 'view',
    //    group: '2'
    //  },{
    //    id: 'weixuanban',
    //    icon: 'm-weixuanban',
    //    title: '未选中构件半透明',
    //    fn: 'setTranslucentUnselected',
    //    keyCode: '',
    //    type: 'view',
    //    group: '3'
    //  }, {
    //    id: 'hideSelected',
    //    icon: 'm-hideSelected',
    //    title: '隐藏选中构件',
    //    fn: 'setHideSelected',
    //    type: 'view',
    //    group: '4'
    //  }, {
    //    id: 'hideNotSelected',
    //    icon: 'm-hideNotSelected',
    //    title: '隐藏未选中构件',
    //    fn: 'isolate',
    //    type: 'view',
    //    group: '4'
    //  }, {
    //    id: 'showAll',
    //    icon: 'm-showAll',
    //    title: '显示全部模型',
    //    fn: 'showAll',
    //    type: 'view',
    //    group: '4'
    //  }]
    //},
    //  {
    //  id: 'translucent',
    //  icon: 'm-translucent',
    //  title: '半透明',
    //  fn: 'translucent',
    //  keyCode: '',
    //  type: 'status',
    //  group: '0'
    //}, {
    //  id: 'hideObj',
    //  icon: 'm-hideObj',
    //  title: '隐藏构件',
    //  fn: 'isolate',
    //  keyCode: '',
    //  type: 'status',
    //  group: '0'
    //}
    //   {
    //    id: 'lockAxisZ',
    //    icon: 'm-lockAxisZ',
    //    title: 'z轴锁定',
    //    fn: 'lockAxisZ',
    //    keyCode: '',
    //    type: 'mode',
    //    group: '0'
    //  }
    ],
    modelBar: [{
      id: 'filter',
      icon: 'm-filter',
      title: (App.Local.data['drawing-model'].Options || "'选择器'"),
      fn: 'filter',
      keyCode: '',
      type: 'filter',
      group: '1'
    }, {
      id: 'comment',
      icon: 'm-camera',
      title: App.Local.getTranslation('drawing-model.Screenshot')||'快照',
      fn: 'comment',
      keyCode: '',
      type: 'filter',
      group: '1'
    }, {
      id: 'selected',
      icon: 'm-selected',
      title: (App.Local.data['drawing-model'].SEt || "已选构件"),
      fn: 'selected',
      keyCode: '',
      type: 'filter',
      group: '1'
    }, {
      id: 'view',
      icon: 'm-view',
      title: (App.Local.data['drawing-model'].SVw || '标准视图'),
      fn: 'view',
      keyCode: '',
      type: 'more',
      group: '0',
      subBar: [{
        id: 'home',
        icon: 'm-home',
        title: 'Home',
        fn: 'home',
        keyCode: '',
        type: 'view',
        group: '4'
      }, {
        id: 'southEast',
        icon: 'i-southEast',
        title: (App.Local.data['model-view'].SW || '西南方向'),
        fn: 'southWest',
        type: 'view',
        group: '4'
      }, {
        id: 'top',
        icon: 'i-top',
        title: (App.Local.data['model-view'].Tp || '上方'),
        fn: 'top',
        type: 'view',
        group: '4'
      }, {
        id: 'bottom',
        icon: 'i-bottom',
        title: (App.Local.data['model-view'].Bm || '下方'),
        fn: 'bottom',
        type: 'view',
        group: '4'
      }, {
        id: 'left',
        icon: 'i-left',
        title: (App.Local.data['model-view'].Lt || '左方'),
        fn: 'left',
        type: 'view',
        group: '4'
      }, {
        id: 'right',
        icon: 'i-right',
        title: (App.Local.data['model-view'].Rt1 || '右方'),
        fn: 'right',
        type: 'view',
        group: '4'
      }, {
        id: 'front',
        icon: 'i-front',
        title: (App.Local.data['model-view'].Ft || '前方'),
        fn: 'front',
        type: 'view',
        group: '4'
      }, {
        id: 'behind',
        icon: 'i-behind',
        title: (App.Local.data['model-view'].Bk || '后方'),
        fn: 'behind',
        type: 'view',
        group: '4'
      }]
    },
      //, {
      //  id: 'zooms',
      //  icon: 'm-zooms',
      //  title: '缩放集合',
      //  fn: 'zooms',
      //  keyCode: '',
      //  type: 'more',
      //  group: '0',
      //  subBar: [ {
      //    id: 'fit',
      //    icon: 'm-fit',
      //    title: '适应窗口',
      //    fn: 'fit',
      //    keyCode: '',
      //    type: 'viewer',
      //    group: '2'
      //  },{
      //    id: 'zoom',
      //    icon: 'm-zoom',
      //    title: '缩放',
      //    fn: 'zoom',
      //    keyCode: '',
      //    type: 'pattern',
      //    group: '3'
      //  }, {
      //    id: 'kuangsuo',
      //    icon: 'm-kuangsuo',
      //    title: '框选缩放',
      //    fn: 'setRectZoomMode',
      //    type: 'mode',
      //    group: '3'
      //  }]
      //}

      {
          id: 'fit',
          icon: 'm-fit',
          title:(App.Local.data['model-view'].Fw || "适应窗口"),
          fn: 'fit',
          keyCode: '',
          type: 'viewer',
          group: '2'
      },{
          id: 'kuangsuo',
          icon: 'm-kuangsuo',
          title: (App.Local.data['model-view'].Zm || '框选缩放'),
          fn: 'setRectZoomMode',
          type: 'mode',
          group: '3'
      }, {
      id: 'rotate',
      icon: 'm-rotateMouse',
      title: App.Local.getTranslation('model-view.Dw')||'动态观察',
      fn: 'rotate',
      keyCode: '',
      type: 'more',
      group: '0',
      subBar: [{
        id: 'rotateMouse',
        icon: 'm-rotateMouse',
        title: (App.Local.data['model-view'].Re || '绕鼠标旋转'),
        fn: 'rotateMouse',
        keyCode: '',
        type: 'rotate',
        group: '3'
      }, {
        id: 'rotateCamera',
        icon: 'm-rotateCamera',
        title: (App.Local.data['model-view'].Ru || '绕观察者旋转'),
        fn: 'rotateCamera',
        keyCode: '',
        type: 'rotate',
        group: '3'
      }, {
        id: 'rotateObj',
        icon: 'm-rotateObj',
        title: (App.Local.data['model-view'].Rt || '绕构件旋转'),
        fn: 'rotateObj',
        keyCode: '',
        type: 'rotate',
        group: '3'
      }]
    },{
          id: 'color',
          icon: 'm-color',
          title: App.Local.getTranslation('drawing-model.Color')|| '颜色',
          fn: 'color-1',
          keyCode: '',
          type: 'color',
          group: '1'
        }, {
        id: 'hideMap',
        icon: 'm-miniScreen',
        title: '',
        fn: 'fly',
        keyCode: '',
        type: 'change'
      }

      //, {
      //id: 'isolation',
      //icon: 'm-isolation',
      //title: '隔离',
      //fn: 'isolation',
      //keyCode: '',
      //type: 'more',
      //group: '0',
      //subBar: [ {
      //  id: 'xuanban',
      //  icon: 'm-xuanban',
      //  title: '选中构件半透明',
      //  fn: 'setTranslucentSelected',
      //  keyCode: '',
      //  type: 'view',
      //  group: '2'
      //},{
      //  id: 'weixuanban',
      //  icon: 'm-weixuanban',
      //  title: '未选中构件半透明',
      //  fn: 'setTranslucentUnselected',
      //  keyCode: '',
      //  type: 'view',
      //  group: '3'
      //}, {
      //  id: 'hideSelected',
      //  icon: 'm-hideSelected',
      //  title: '隐藏选中构件',
      //  fn: 'setHideSelected',
      //  type: 'view',
      //  group: '4'
      //}, {
      //  id: 'hideNotSelected',
      //  icon: 'm-hideNotSelected',
      //  title: '隐藏未选中构件',
      //  fn: 'isolate',
      //  type: 'view',
      //  group: '4'
      //}, {
      //  id: 'showAll',
      //  icon: 'm-showAll',
      //  title: '显示全部模型',
      //  fn: 'showAll',
      //  type: 'view',
      //  group: '4'
      //}]
    //},
    //  {
    //  id: 'more',
    //  icon: 'm-more',
    //  title: '更多',
    //  fn: 'more',
    //  keyCode: '',
    //  type: 'more',
    //  group: '0',
    //  subBar: [{
    //    id: 'color',
    //    icon: 'm-color',
    //    title: '颜色',
    //    fn: 'color-1',
    //    keyCode: '',
    //    type: 'color',
    //    group: '0'
    //  },{
    //    id: 'lockAxisZ',
    //    icon: 'm-lockAxisZ',
    //    title: 'z轴锁定',
    //    fn: 'lockAxisZ',
    //    keyCode: '',
    //    type: 'mode',
    //    group: '0'
    //  }]
    //  , {
    //  id: 'translucent',
    //  icon: 'm-translucent',
    //  title: '半透明',
    //  fn: 'translucent',
    //  keyCode: '',
    //  type: 'status',
    //  group: '0'
    //}, {
    //  id: 'hideObj',
    //  icon: 'm-hideObj',
    //  title: '隐藏构件',
    //  fn: 'isolate',
    //  keyCode: '',
    //  type: 'status',
    //  group: '0'
    //}
    //}, {
    //  id: 'hideMap',
    //  icon: 'm-miniScreen',
    //  title: '',
    //  fn: 'fly',
    //  keyCode: '',
    //  type: 'change'
    //}
    ],
    commentBar: [{
      id: 'arrow',
      icon: 'm-arrow',
      title: (App.Local.data['drawing-model'].Arrow || "箭头"),
      fn: '0',
      type: 'comment'
    }, {
      id: 'rect',
      icon: 'm-rect',
      title: (App.Local.data['drawing-model'].Rectangle || "矩形"),
      fn: '1',
      type: 'comment'
    }, {
      id: 'ellipse',
      icon: 'm-ellipse',
      title: (App.Local.data['drawing-model'].Circle || "圆形"),
      fn: '2',
      type: 'comment'
    }, {
      id: 'mark',
      icon: 'm-mark',
      title: (App.Local.data['drawing-model'].Mark || "标记"),
      fn: '3',
      type: 'comment'
    }, {
      id: 'cloud',
      icon: 'm-cloud',
      title: (App.Local.data['drawing-model'].Cloud || "云线"),
      fn: '4',
      type: 'comment'
    }, {
      id: 'text',
      icon: 'm-text',
      title: (App.Local.data['drawing-model'].Text || "文本"),
      fn: '5',
      type: 'comment'
    }, {
      id: 'more',
      icon: 'm-red',
      title: (App.Local.data['drawing-model'].More || "更多"),
      fn: '',
      keyCode: '',
      type: 'more',
      group: '0',
      subBar: [{
        id: '6',
        icon: 'm-red',
        color: '#DA0015',
        title: App.Local.data['drawing-model'].Color|| '颜色',
        fn: '6',
        keyCode: '',
        type: 'comment-color',
        group: '0'
      },{
        id: '6',
        icon: 'm-pink',
        color: '#F647AB',
        title: App.Local.getTranslation('drawing-model.Color')|| '颜色',
        fn: '6',
        keyCode: '',
        type: 'comment-color',
        group: '0'
      },{
        id: '6',
        icon: 'm-blue',
        color: '#0084EB',
        title: App.Local.getTranslation('drawing-model.Color')|| '颜色',
        fn: '6',
        keyCode: '',
        type: 'comment-color',
        group: '0'
      },{
        id: '6',
        icon: 'm-green',
        color: '#79D433',
        title: App.Local.getTranslation('drawing-model.Color')|| '颜色',
        fn: '6',
        keyCode: '',
        type: 'comment-color',
        group: '0'
      },{
        id: '6',
        icon: 'm-yellow',
        color: '#FFE730',
        title: App.Local.getTranslation('drawing-model.Color')|| '颜色',
        fn: '6',
        keyCode: '',
        type: 'comment-color',
        group: '0'
      },{
        id: '6',
        icon: 'm-golden',
        color: '#FF8826',
        title:App.Local.getTranslation('drawing-model.Color')||  '颜色',
        fn: '6',
        keyCode: '',
        type: 'comment-color',
        group: '0'
      },{
        id: '6',
        icon: 'm-white',
        color: '#ffffff',
        title:App.Local.getTranslation('drawing-model.Color')||  '颜色',
        fn: '6',
        keyCode: '',
        type: 'comment-color',
        group: '0'
      }]
    }],
    colorBar: [{
      id: 'color-1',
      icon: 'color-1',
      fn: 'color-1',
      type: 'color'
    }, {
      id: 'color-2',
      icon: 'color-2',
      fn: 'color-2',
      type: 'color'
    }, {
      id: 'color-3',
      icon: 'color-3',
      fn: 'color-3',
      type: 'color'
    }, {
      id: 'color-4',
      icon: 'color-4',
      fn: 'color-4',
      type: 'color'
    }, {
      id: 'color-5',
      icon: 'color-5',
      fn: 'color-5',
      type: 'color'
    }, {
      id: 'color-6',
      icon: 'color-6',
      fn: 'color-6',
      type: 'color'
    }]
  }
  bimView.model.BIM.prototype = {
    init: function(options) {
      var _opt = options;
      //var viewer = new CloudViewer();
      var viewer = new CLOUD.Viewer();
      var viewBox = $('<div class="view"></div>');
      _opt._dom.bimBox.append(viewBox);
      viewer.init(viewBox[0]);
      viewer.load(_opt.etag, bimView.API.baseUrl + bimView.API.fetchModel);
      //viewer.setRectPickMode();
      viewer.editorManager.enableTool(viewer, CLOUD.EditToolMode.PICK_BY_RECT);
      return viewer;
    }
  }
})($)