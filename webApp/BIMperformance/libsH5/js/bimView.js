'use strict'
;(function($){
  var bimView = window.bimView = function(options){
    var self = this,
        defaults = {
          type:'model',//文件类型 singleModel:单文件模型,model:多文件模型,带小地图,familyModel:族文件,dwg:dwg文件,预留
          element:'', //模型渲染DOM节点
          etag:'',//模型ID
          sourceId:'',
          projectId:'',//模型关联项目ID
        },
        serverUrl = bimView.API.baseUrl;//模型后端接口服务地址
    self.subscribers = {};// 私有订阅对象
    var _opt = $.extend({},defaults,options);
    if((typeof _opt.element) == 'string'){
      _opt.element = $(_opt.element);
    }
    if(!_opt.element){
      console.error('element is not found!')
      return false;
    }
    _opt._dom = self._dom = {
      lockAxis : $('<div id="lockAxisZ"><i class="m-lockAxisZ" data-id=""></i><span >' +
          (App.Local.data['model-view'].Us || 'Z轴未锁') +
          '</span></div>'),
      isolation : $('<div id="isolation"><i class="bar-item m-xuanban" title="' +
          (App.Local.data['drawing-model'].MSe || '选中构件半透明') +
          '" data-id="setTranslucentSelected" data-type="view" data-group="2"></i><i class="bar-item m-weixuanban" title="' +
          (App.Local.data['drawing-model'].MSe1 || '未选中构件半透明') +
          '" data-id="setTranslucentUnselected" data-type="view" data-group="3"></i><i class="bar-item m-hideSelected" title="' +
          (App.Local.data['drawing-model'].HSs || '隐藏选中构件') +
          '" data-id="setHideSelected" data-type="view" data-group="4"></i><i class="bar-item m-hideNotSelected" title="' +
          (App.Local.data['drawing-model'].HUs || '隐藏未选中构件') +
          '" data-id="isolate" data-type="view" data-group="4"></i><i class="bar-item m-showAll" title="' +
          (App.Local.data['drawing-model'].SAs || '显示全部模型') +
          '" data-id="showAll" data-type="view" data-group="4"></i></div>'),
      bimBox:$('<div class="bim"></div>'),
      loading:$('<div class="loading"></div>'),
      progress:$('<div class="progress"></div>'),
      modelLoading:$('<div class="modelLoading"></div>')
    };
    self.init(_opt);
  }
})($);
