/*
	write by wuweiwei
	note:
	用于封装webViewer.js
*/
(function(){
var BimView = window.BimView = function(options){
	var defaults = {
		type : 'model',  //文件类型
		element : null,  //模型渲染DOM节点
		container:null,  //模型容器DOM
		etag : '',       //模型ID
		sourceId : '',   
		projectId : ''   //模型关联的项目ID
	};
	this.restful = {
		// "filterData" : "/view/category/single/{etag}" /*etag is model id*/
		"filterData" : "/doc/category/single/{etag}" /*etag is model id*/
	};
	this.options = $.extend({},defaults,options);
	this.State = {};
	this.init();
	this.getFilterData();
	this.initMap({
		name: 'bigMap',
		enable: false,
		element:this.$viewBoxOptions.find(".miniMap")[0],
		callbackMoveOnAxisGrid: function(res) {

		}
	});
}

BimView.prototype = {
	init : function(){
		//初始化小地图
		if(this.viewer){
			this.destroyModel();
		}
		this.loadPage();
    	this.initModel();
	},
	initModel : function(){
		var viewer = new CLOUD.Viewer();
	    //var viewport = document.getElementById(this.options.showViewBoxId);
	    var viewport = this.options.element;
	    if(this.options.element==undefined&&this.options.container!=undefined)
	    {
	    	viewport = $(this.options.container).find("#viewBox")[0];
	    }
	    this.viewport = viewport;
	    this.$viewBoxOptions = $(this.options.container).find(".viewBoxOptions");
	    this.$boxBar = $(this.options.container).find(".viewBox-bar");
	    this.$boxBarMenu = $(this.options.container).find(".viewBox-bar-menu");

	    this.viewer = viewer;
	    var onSelectionChangned = function(evt){
	      console.log(evt.intersect);
	    }
	    var callbackProgress = function(evt){

	    }
	    var callbackFinished = function(evt){
	      setTimeout(function(){
	        viewer.zoomToBuilding(0,1.15);
	        viewer.render();
	      },1500)
	    }
	    var callbackStartLoading = function(evt){
	    	var total = evt.progress.total,
	    	loaded = evt.progress.loaded,
	    	progress = loaded / total * 100;
	    	
	    }
	    viewer.init(viewport);
	    //viewer.resize(screen.width,screen.height);
	    viewer.registerEventListener(CLOUD.EVENTS.ON_SELECTION_CHANGED,onSelectionChangned);
	    viewer.registerEventListener(CLOUD.EVENTS.ON_LOAD_CHANGED,callbackProgress);
	    viewer.registerEventListener(CLOUD.EVENTS.ON_LOAD_COMPLETE,callbackFinished);
	    viewer.registerEventListener(CLOUD.EVENTS.ON_LOAD_START,callbackStartLoading);
	    viewer.registerEventListener(CLOUD.EVENTS.ON_UPDATE_SELECTION_UI,function(evt){//ctrl+拖拽 执行的回调
	      console.log("Empty scene!");
	    });
	    this.bindEvent();
	    // viewer.load("569a781f6f4d8e151ca14be649fbb87f","http://bim-uat.wanda-dev.cn/model/");
	    console.log(this.options.etag)
	    this.setCanvas();
	    viewer.load(this.options.etag,"http://139.217.25.150/model/");
	},
	destroyModel:function(){
		this.viewer.destroy();
	},

	getAnnotationObject : function(viewer){
		var th = this;
		this.viewer = this.viewer||viewer;
		if (!this.annotationHelper3D)
		{
			this.annotationHelper3D = new CLOUD.Extensions.AnnotationHelper3D(this.viewer);
		}
		var renderCB = function(){
			th.annotationHelper3D.renderAnnotations();
		}
		this.viewer.addCallbacks("render", renderCB );
		var resizeCB = function(){
			th.annotationHelper3D.resizeAnnotations();
		}
		this.viewer.addCallbacks("render", resizeCB );
		return this.annotationHelper3D;
	},
	getMiniMapObject : function(viewer){
		var th = this;
		this.viewer = this.viewer||viewer;
		if (!this.MiniMapHelper)
		{
			this.MiniMapHelper = new CLOUD.Extensions.MiniMapHelper(this.viewer);
			var renderCB = function(){
				th.MiniMapHelper.renderMiniMap();
			}
			this.viewer.addCallbacks("render", renderCB );
		}
		return this.MiniMapHelper;
	},
	loadPage : function(){
		if(this.options.container==undefined)
		{
			return;
		}
		var page = $http.template("tpls/model/sideBar.html");
		this.options.container.innerHTML=(page);
	},
	showSubMenu : function(className){
		this.$boxBarMenu.find(className).css("display","block");
		this.$boxBarMenu.css("display","block");		
	},
	hideSubMenu : function(className){
		this.$boxBarMenu.find(className).css("display","none");
		this.$boxBarMenu.css("display","none");
	},
	// showMenu : function(className){
	// 	this.$boxBarMenu.find(className).css("display","block");
	// 	this.$boxBarMenu.css("display","block");		
	// },
	hideMenu : function(className){
		this.$boxBarMenu.css("display","none");
		this.$boxBarMenu.find(".comment").css("display","none");
		this.$boxBarMenu.find(".more").css("display","none");
		this.$viewBoxOptions.find(".filterDetail").css("display","none");
		this.$viewBoxOptions.find(".paperDetail").css("display","none");
		this.$viewBoxOptions.find(".info").css("display","none");
	},
	bindEvent : function(){
		var th = this;

		this.$boxBar.on("click","dt",function(e){
			var $curNode = $(this);
			var $filterDetail = $(th.viewport).find(".filterDetail");
			var $paperDetail = $(th.viewport).find(".paperDetail");
			var $info = $(th.viewport).find(".info");
			$filterDetail.css("display","none");
			$paperDetail.css("display","none");
			$info.css("display","none");
			
			if($curNode.data("type")=="angle")
			{
				th.hideMenu();
				th.setCanvas();
				th.home();
				return;
			}
			if($curNode.data("type")=="info")
			{
				th.hideMenu();
				th.setCanvas();
				$(th.viewport).find(".info").css("display","block");
				return;
			}

			th.setCanvas();

			if($curNode.data("type")=="comment")
			{
				th.$boxBarMenu.find(".more").css("display","none");
				var displayState = th.$boxBarMenu.find(".comment").css("display");
				if(displayState == "block")
				{
					th.hideSubMenu(".comment");
					th.hideMenu();
				}
				else
				{
					th.showSubMenu(".comment");
					th.comment();
				}
			}
			if($curNode.data("type")=="more")
			{
				th.$boxBarMenu.find(".comment").css("display","none");

				var displayState = th.$boxBarMenu.find(".more").css("display");
				if(displayState == "block")
				{
					th.hideSubMenu(".more");
					th.hideMenu();
				}
				else
				{
					th.showSubMenu(".more");
				}
			}
		});

		this.$boxBarMenu.on("click","dd",function(e){
			var $curNode = $(this);
			if($curNode.data("type")=="more-bgcolor")
			{
				th.setModelBgColor();
			}

			if($curNode.data("type")=="more-z")
			{
				var selected = $($curNode).is('.selected');
				$($curNode).toggleClass('selected');
				if(selected)
				{
					th.lockAxisZ(!selected);
				}
			}

			if($curNode.data("type")=="more-hide")
			{
				var filter = th.viewer.getFilter();
				CLOUD.FilterUtil.hideSelections(th.viewer);
				th.viewer.render();
				th.$viewBoxOptions.find(".showComponets").css("display","block");
			}

			if($curNode.data("type")=="more-grid")
			{
				App.UI.Dialog.showCommDialog({
					node : $("#model_gridDialog")[0],
					title : "输入X轴Y轴， 快速定位",
					onok : function(e){
						var x = $("#grid-x").val();
						var y = $("#grid-y").val();
						th.setAxisGrid(x,y);
					}
				});
			}

			if($curNode.data("type")=="more-filter")
			{
				var isShow = th.$viewBoxOptions.find(".filterDetail").css("display");
				if(isShow=="block")
				{
					th.$viewBoxOptions.find(".filterDetail").css("display","none");
				}
				else
				{
					th.$viewBoxOptions.find(".filterDetail").css("display","block");
				}
			}
		});

		/*显示所有模型*/
		th.$viewBoxOptions.find(".showComponets").on("click",function(){
			var filter = th.viewer.getFilter();
			filter.revertAll();
			th.viewer.render();
			this.style.display = "none";
		});
	},


	/*封装bimViewer.js功能*/
	home : function(){
		this.viewer.goToInitialView();
		this.zoomToBuilding(-560,1.0);
	},
	zoomToBuilding : function(margin, ratio){
		this.viewer.zoomToBuilding(margin, ratio);
		this.viewer.render();
	},
	setModelBgColor : function(color){
		if(this.State["setModelBgColor"]==undefined || this.State["setModelBgColor"]=="#FFF")
		{
			this.viewport.style.backgroundColor = "#000";
			this.State["setModelBgColor"] = "#000";
		}
		else
		{
			this.viewport.style.backgroundColor = "#FFF";
			this.State["setModelBgColor"] = "#FFF";
		}
		
	},
	lockAxisZ : function(isLock){
		this.viewer.lockAxisZ(isLock);
	},
	setCanvas : function(){
		var heightA=0,heightB=0;
		if(this.$boxBar.css("display")=="block")
		{
			heightB = this.$boxBar[0].offsetHeight;
		}
		if(this.$boxBarMenu.css("display")=="block")
		{
			//heightA = this.$boxBarMenu[0].offsetHeight;
		}
		var headerHeight = $("#mainHeader")[0].offsetHeight;
		this.viewer.resize(screen.width,screen.height - headerHeight - heightA - heightB);
	},
	comment : function(){
		this.getAnnotationObject().editAnnotationBegin();
		this.getAnnotationObject().setAnnotationBackgroundColor("#f00");

		this.getAnnotationObject().setAnnotationType("0");
	},
	initMap : function(options){
		var defaults = {
			element: '',
			name: 'defaultMap',
			axisGrid: '',
			enable: true,
			callbackCameraChanged: null,
			callbackMoveOnAxisGrid: null
		}
		var _opt = $.extend({}, defaults, options);
		var _css = {
			left: '0px',
			bottom: '0px',
			outline: 'none',
			position: 'relative'
		};
		if (_opt.axisGrid) this.getMiniMapObject().setAxisGridData(_opt.axisGrid);
		this.getMiniMapObject().createMiniMap(_opt.name, _opt.element, 110, 110, _css, _opt.callbackCameraChanged, _opt.callbackMoveOnAxisGrid);
		this.getMiniMapObject().enableAxisGridEvent(_opt.name, _opt.enable);
		this.getMiniMapObject().generateAxisGrid(_opt.name);
	},
	setAxisGrid : function(x,y){
		this.getMiniMapObject().flyBypAxisGridNumber('bigMap', x, y);
	},
	getFilterData : function(){
		var th = this;
		App.Comm.ajax({
			url : th.restful.filterData,
			param : {"etag":this.options.etag},
			type : "get",
			dataType : "json",
			success:function(data){
				if(data.code==0)
				{
					th.viewPageFilter(data.data);
				}
			}
		});
	},
	viewPageFilter : function(data){
		console.log(data);
		template.repeat({
			repeatElement:this.$viewBoxOptions.find(".filterDetail").find("li")[0],
			data:data
		});
	}
}



})(window);
