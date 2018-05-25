App.Resource = App.Resource || {};
App.Resource.List = {
	defaults:{
		arge:'',
		pageIndex:1,
		pageNum:10,
		listScroll:null,
		moreFlag:true,
	},
	init : function(arge){
		var _this = this;
		this.initHtmlHandle(arge);//初始化页面结构
		this.defaults.pageNum = 10;
		$(function(){
			_this.defaults.arge = arge;
			if(App.defaults.resourceObj){
				_this.defaults.pageIndex = App.defaults.resourceObj.pageIndex;
				_this.defaults.pageNum = App.defaults.resourceObj.pageIndex*10;
			}
			_this.loadResourceList();//获取资源列表的方法
			_this.initHandle();//初始化方法
		})
	},
	initHtmlHandle:function(arge){//初始化页面结构
		if(arge.type=="standard"){
			App.TitleBar.setTitle("标准模型库");
		}else if(arge.type=="family"){
			App.TitleBar.setTitle("族库");
		}
		App.TitleBar.hidePopMenuBtn();//隐藏顶部三个点按钮
		App.TitleBar.showHomeBtn() //显示home图片
		App.TitleBar.returnCallback("#/resource");
		App.hideMainMenu();//隐藏底部导航栏
		$("#mainContainer").css("padding-bottom",0);
		if(!$("#footerBox > div").eq(3).hasClass("footer-box-select")){
			$("#footerBox > div").eq(3).click();
		}
	},
	initHandle : function(){
		var _this = this;
		var resourceDom = $("#resourceDom");
		resourceDom.on("click",function(evt){
			var target = $(evt.target);
			var closestEle = target.closest('li');
			var openUrl = closestEle.data("href");
			location.href = openUrl;
			if(App.defaults.resourceObj){
				App.defaults.resourceObj.pageIndex = _this.defaults.pageIndex;
			}
			return false;
		})
	},
	initScrollHandle:function(){//初始化滚动条方法
		var _this = this;
		var loadMore = $(".loadMore");
		this.defaults.listScroll = new IScroll('#resourceBox', {
		    mouseWheel: true,//鼠标滚轮
		    probeType: 3,//像素级触发 执行回调
		    scrollbars: false,//滚轴是否显示默认是
		    truebounceTime: 600,//弹力动画持续的毫秒数
		    click:true,
		});
		if(App.defaults.resourceObj){
			this.defaults.listScroll.scrollTo(0, App.defaults.resourceObj.scrollPos, 10);
		}
		this.defaults.listScroll.on('scroll', function(){
		    if(this.directionY == 1){
		        if(this.y<this.maxScrollY){
		            loadMore.show();
		        }
		    }
		});
		this.defaults.listScroll.on('scrollEnd', function(){
			App.defaults.resourceObj = {
				scrollPos:this.y
			}
		    if(this.y==this.maxScrollY&&this.maxScrollY<0){
		    	if(!_this.defaults.moreFlag) return;
		    	_this.defaults.moreFlag = false;
		    	_this.getMoreDataHandle();//获取更多
		    }
		});
	},
	getMoreDataHandle:function(){//获取更多
		var _this =  this;
		var data = {
			type:App.Resource.List.defaults.arge.type=="standard"?1:2,//项目列表
			pageIndex:App.Resource.List.defaults.pageIndex+1,
			pageItemCount:10,
		}
		App.Comm.ajax({
			type:"get",
			url:App.Resource.List.defaults.arge.type=="standard"?App.Restful.urls.resourceList:App.Restful.urls.resourceList,
			param:data,
			dataType:"json",
			success:function(data){
				_this.defaults.moreFlag = true;
				if(data.code == 0){
					if(data.data.items.length>0){
						_this.defaults.pageIndex++;
						_this.appendHtmlHandle(data.data.items);//加载更多之后添加到页面上
					}else{
						$(".loadMore").html(App.defaults.loadMoreBottomText);
					}
					_this.defaults.listScroll.refresh();
				}else{
					alert(data.message);
				}
			}
		});
	},
	appendHtmlHandle:function(data){//加载更多之后添加到页面上
		var html = '',
			id = "",
			versionId = "",
			name = "",
			hrefStr = "",
			imgSrc = "",
			resourceDom = $("#resourceDom");
		for(var i=0,iLen = data.length;i<iLen;i++){
			id = data[i].id;
			versionId = data[i].version.id;
			name = data[i].name;
			if(App.Resource.List.defaults.arge.type=="standard"){
				hrefStr = "#/resourceModelLibraryList/"+id+"/"+versionId+"/"+name;
				imgSrc = "images/resource/model_icon.png";
			}else if(App.Resource.List.defaults.arge.type=="family"){
				hrefStr = "#/resourceFamilyLibraryList/"+id+"/"+versionId+"/"+name;
				imgSrc = "images/resource/family_icon.png";
			}
			html += '<li data-href="'+hrefStr+'">'+
						'<a href="javascript:;">'+
							'<i><img src="'+imgSrc+'"></i>'+
							'<div class="m_resource_type_list_component">'+name+'</div>'+
							'<span></span>'+
						'</a>'+
					'</li>';
		}
		resourceDom.append(html);
	},
	loadResourceList:function(){//获取资源列表的方法
		var th = this;
		var resourceDom = $("#resourceDom");
		resourceDom.html('');
		var data = {
			type:App.Resource.List.defaults.arge.type=="standard"?1:2,//项目列表
			pageIndex:1,
			pageItemCount:App.Resource.List.defaults.pageNum,
		}
		App.Comm.ajax({
			type:"get",
			url:App.Resource.List.defaults.arge.type=="standard"?App.Restful.urls.resourceList:App.Restful.urls.resourceList,
			param:data,
			dataType:"json",
			success:function(data){
				if(data.code == 0){
					th.defaults.pageCount = data.data.pageCount;
					if(data.data.items.length<10){
					    $(".loadMore").hide();
					}else{
						$(".loadMore").show();
					}
					if(data.data.items.length>0){
						if(th.defaults.listScroll){
							th.defaults.listScroll.destroy();
						}
						th.viewPage(data.data.items);
						th.initScrollHandle();//初始化滚动条方法
					}else{
						var nullData = $("<div class='nullData'><div class='nullDataImg'></div><p>暂时还没有任何内容哦～</p></div>")
						resourceDom.append(nullData);
						resourceDom.find(".loading").hide();
					}
				}else{
					alert(data.message);
				}
			}
		});
	},
	viewPage:function(data){
		var resourceDom = $("#resourceDom");
		var listComponent = '';
		if(App.Resource.List.defaults.arge.type=="standard"){
			listComponent = '<li data-href="#/resourceModelLibraryList/{{id}}/{{versionId}}/{{name}}" id="resourceListComponent" style="display: none;"><a href="javascript:;"><i><img src="images/resource/model_icon.png"></i><div class="m_resource_type_list_component">{{name}}</div><span></span></a></li>';
		}else if(App.Resource.List.defaults.arge.type=="family"){
			listComponent = '<li data-href="#/resourceFamilyLibraryList/{{id}}/{{versionId}}/{{name}}" id="resourceListComponent" style="display: none;"><a href="javascript:;"><i><img src="images/resource/family_icon.png"></i><div class="m_resource_type_list_component">{{name}}</div><span></span></a></li>';
		}
		resourceDom.html('');
		resourceDom.append(listComponent);
		template.repeat({
			repeatElement : $("#resourceListComponent")[0], /*页面的DOM元素*/
			data : data,
			process : function(itemObject){
				var key = itemObject.index;
				var item = itemObject.item;
				return {
					"id":item.id,
					"versionId":item.version.id,
					"name":item.name,
				}
			}
		});
	}
}