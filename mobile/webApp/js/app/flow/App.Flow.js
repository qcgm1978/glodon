App.Flow = {
	defaults:{
		searchName:'',//搜索的名字
		closeSearchBox:false,
		searchCan:true,//搜索是否进行中
		getDataType:1,//获取业务流程的数据的类型 默认是总包交钥匙
		pageIndex:1,
		pageCount:1,
		getMoreFlag:true,
		isBimControl:1,
		pageItemCount:10,
	},
	init : function(){
		var self = this;
		App.defaults.SearchHeightVar = undefined;
		App.defaults.searchName = "";
		this.initHtmlHandle();//初始化页面
		$(function(){
			self.initHandle();//初始化页面事件方法
			self.loadData();//获取业务流程的列表
		})
		App.topCloseBtn();
	},
	initHtmlHandle:function(){//初始化页面
		App.Flow.defaults.closeSearchBox = false;
		App.TitleBar.setTitle("万达筑云项目管理平台");//设置顶部标题
		App.TitleBar.hidePopMenuBtn();//隐藏顶部三个点按钮
		App.TitleBar.hideHomeBtn();//隐藏顶部返回首页
		App.TitleBar.showClose();//隐藏顶部返回首页
		App.resetScrollData();//重置滚动的数据
		if(!$("#footerBox > div").eq(2).hasClass("footer-box-select")){//底部导航的定位
			$("#footerBox > div").eq(2).click();
		}
	},
	initHandle:function(){//初始化页面事件方法
		this.initPage();//初始化页面
		this.searchInit();//搜索初始化方法
		if(location.href.substr(location.href.indexOf("isBimControl=")+13) == 0){
			$("#tabDom").find("li").eq(1).trigger("click");
		}
	},
	initPage:function(){//初始化页面
		var _this = this;
		$("#tabDom").on("click","li",function(event){
			var target = $(event.target).closest("li");
			var type = target.data("type");
			_this.resetHandle();
			if(!target.hasClass("selectLi")){
				target.addClass('selectLi').siblings().removeClass("selectLi");
				App.Flow.defaults.pageIndex=1;
				App.Flow.defaults.getDataType= type;
				if(type == 1){
					App.Flow.defaults.isBimControl=1;
					$(".flowDownListBox").show();
				}else if(type == 2){
					App.Flow.defaults.isBimControl=0;
					$(".flowDownListBox").hide();
				}
				$("#searchCommonBox").css("display","none");
				$("#clearSearchVal").css("display","none");
				$("#searchListBox").html("");
				App.Flow.defaults.searchName="";
				App.Flow.defaults.closeSearchBox = false;
				_this.loadData();//获取Bim管控的问题数据方法
			}
		})
		if(App.Flow.defaults.getDataType == 2){
			$("#tabDom").find("li").eq((App.Flow.defaults.getDataType-1)).click();
		}
	},
	resetHandle:function(){//重置当前页数
		$(".loadMore").html(App.defaults.loadMoreText).show();
		this.defaults.pageIndex = 1;
	},
	searchInit:function(){//搜索初始化方法
		var _this = this;
		$("#searchBtn").on("click",function(){
			var searchVal = $("#searchInput").val().trim();
			App.Flow.defaults.searchName = searchVal;
			_this.resetHandle();//重置当前页数
			if(App.Flow.defaults.searchCan){
				$("#searchCommonBox").css("display","block");
				_this.searchData();//公用搜索方法
			}
		})
		$("#searchInput").on("keyup",function(evt){
		 	var targetVal = $(evt.target).val().trim();
		 	if(targetVal.length>0){
		 		$("#clearSearchVal").css("display","block");
		 	}
		})
		$("#clearSearchVal").on("click",function(){
			App.Flow.defaults.searchName = "";
			$(this).hide();
			$("#searchInput").val("");
		})
		$("#clearSearchBtn").on("click",function(){
			$("#searchCommonBox").css("display","none");
			$("#clearSearchVal").css("display","none");
			$("#searchListBox").html("");
			$("#searchInput").val("");
			App.Flow.defaults.searchName="";
			App.Flow.defaults.closeSearchBox = false;
			_this.resetHandle();//重置当前页数
		})
	},
	searchData:function(){//公用搜索方法
		var _this = this;
		var searchListBox = $("#searchListBox");
		var searchScrollBox = $(".searchScrollBox");
		searchListBox.html('');
		searchScrollBox.css("transform","translate(0px,0px)");
		App.Flow.defaults.searchCan = false;
		var data = {
			name:App.Flow.defaults.searchName,
			pageIndex:App.Flow.defaults.pageIndex,
			pageItemCount:App.Flow.defaults.pageItemCount,
			isBimControl:App.Flow.defaults.isBimControl,
		}
		App.Comm.ajax({
			type:"get",
			url:App.Restful.urls.flowSearchData,
			data:data,
			dataType:"json",
			success:function(data){
				if(data.code == 0){
					App.Flow.defaults.searchCan = true;
					App.Flow.defaults.pageCount = data.data.pageCount;
					App.Flow.defaults.closeSearchBox = true;
					$("#resultNum").html(data.data.totalItemCount);
					if(data.data.items.length<10){
						$(".loadMore").hide();
					}else{
						$(".loadMore").show();
					}
					if(data.data.items.length>0){
						if(_this.defaults.listScroll){
							_this.defaults.listScroll.destroy();
						}
						var listComponent = '<li id="searchListComponent"><a href="#/flowDetailPage/{{topName}}/{{topId}}/{{folderName}}/{{openName}}?searchBool=true&isBimControl={{isBimControl}}"><h2>{{name}}</h2><p>{{pathName}}</p></a></li>';
						searchListBox.html(listComponent);
						_this.searchDataPage(data.data.items);//渲染搜索数据
						_this.bindScrollHandle();//绑定滚动条方法
					}else{
						var nullData = $("<div class='nullData'><div class='nullDataImg'></div><p>暂时还没有任何内容哦～</p></div>")
						searchListBox.append(nullData);
					}
				}else{
					alert(data.message);
				}
			}
		});
	},
	searchDataPage:function(data){//渲染搜索数据
		template.repeat({
			repeatElement : $("#searchListComponent")[0], /*页面的DOM元素*/
			data : data,
			process : function(itemObject){
				var key = itemObject.index;
				var item = itemObject.item;
				var nameStr = item.itemName;
				if(App.Flow.defaults.searchName.length>0){
					name = App.searchHighlightHandle(App.Flow.defaults.searchName,nameStr)+(item.isPlan?'<span class="mkhColor">【模块化】</span>':"");//搜索结果高亮效果的方法
				}else{
					name = item.itemName+(item.isPlan?'<span class="mkhColor">【模块化】</span>':"");
				}
				var pathNameStr = item.phaseName+' > '+item.categoryName;
				return {
					"name":name,
					"topName":item.phaseName,
					"topId":item.phaseId,
					"folderName":item.categoryName,
					"openName":item.itemName,
					"pathName":pathNameStr,
					"isBimControl":App.Flow.defaults.getDataType==1?1:0
				}
			}
		});
	},
	bindScrollHandle:function(){
		var _this = this;
		var loadMore = $(".loadMore");
		var scrollEle = "#searchCommentDown";
		this.defaults.listScroll = new IScroll(scrollEle, {
		    mouseWheel: true,//鼠标滚轮
		    probeType: 3,//像素级触发 执行回调
		    scrollbars: false,//滚轴是否显示默认是
		    truebounceTime: 600,//弹力动画持续的毫秒数
		    click:true,
		});
		this.defaults.listScroll.on('scroll', function(){
		    if(this.directionY == 1){
		        if(this.y<this.maxScrollY){
		            loadMore.show();
		        }
		    }
		});
		this.defaults.listScroll.on('scrollEnd', function(){
		    if(this.y==this.maxScrollY&&this.maxScrollY<0){
		    	if(!_this.defaults.getMoreFlag) return;
		    	_this.defaults.getMoreFlag = false;
		    	_this.defaults.pageIndex++;
		    	if(_this.defaults.pageIndex<=_this.defaults.pageCount){
		    	    _this.getMoreDataHandle();//获取更多
		    	}else{
		    		_this.defaults.getMoreFlag = true;
		    	    loadMore.html(App.defaults.loadMoreBottomText);
		    	}
		    }
		});
	},
	getMoreDataHandle:function(){//获取更多
		var self = this;
		var data = {
			name:App.Flow.defaults.searchName,
			pageIndex:App.Flow.defaults.pageIndex,
			pageItemCount:App.Flow.defaults.pageItemCount,
			isBimControl:App.Flow.defaults.isBimControl,
		}
		App.Comm.ajax({
			type:"get",
			url:App.Restful.urls.flowSearchData,
			data:data,
			dataType:"json",
			success:function(data){
				self.defaults.getMoreFlag = true;
				if(data.code == 0){
					self.loadMorePageHandle(data.data.items);//加载功能多添加到页面的方法
					self.defaults.listScroll.refresh();
				}else{
					alert(data.message);
				}
			}
		});
	},
	loadMorePageHandle:function(data){//加载功能多添加到页面的方法
		var html = '',
			name = '',
			nameStr = '',
			pathName = '',
			topName = '',
			topId = '',
			openName = '',
			isBimControl = '',
			searchListBox = $("#searchListBox");
		for(var i=0,iLen=data.length;i<iLen;i++){
			topName = data[i].phaseName;
			topId = data[i].phaseId;
			openName = data[i].itemName;
			folderName = data[i].categoryName;
			isBimControl = App.Flow.defaults.getDataType==1?1:0;
			if(App.Flow.defaults.searchName.length>0){
				name = App.searchHighlightHandle(App.Flow.defaults.searchName,data[i].itemName)+(data[i].isPlan?'<span class="mkhColor">【模块化】</span>':"");//搜索结果高亮效果的方法
			}else{
				name = data[i].itemName+(data[i].isPlan?'<span class="mkhColor">【模块化】</span>':"");
			}
			pathName = data[i].phaseName+' > '+data[i].categoryName;
			html += '<li>'+
						'<a href="#/flowDetailPage/'+topName+'/'+topId+'/'+folderName+'/'+openName+'?searchBool=trueisBimControl='+isBimControl+'">'+
							'<h2>'+name+'</h2>'+
							'<p>'+pathName+'</p>'+
						'</a>'+
					'</li>'
		}
		searchListBox.append(html);
	},
	loadData:function(){//获取业务流程的列表
		var _this = this;
		var flowTopListBox = $("#flowTopListBox");
		var lodingDom = $('<div class="loading">加载中...</div>');
		flowTopListBox.html('');
		flowTopListBox.append(lodingDom);
		App.Comm.ajax({
			type:"get",
			url:App.Flow.defaults.getDataType==1?App.Restful.urls.flowList:App.Restful.urls.getFlowKeyData,
			dataType:"json",
			success:function(data){
				flowTopListBox.find(".loading").hide();
				if(data.code == 0){
					if(data.data.length>0){
						var listComponent = '<li id="listComponent"><a href="#/flowList/{{itemName}}/{{id}}?isBimControl={{isBimControl}}"><div class="{{noBorder}}"><i class="iLogo">{{imgUrl}}</i><h2>{{name}}</h2><i class="iRightImg"></i></div></a></li>';
						flowTopListBox.html(listComponent);
						if(App.Flow.defaults.getDataType==1){
							_this.viewPage(data.data);
						}else if(App.Flow.defaults.getDataType==2){
							_this.viewKeyPage(data.data);
						}
					}else{
						var nullData = $("<div class='nullData'><div class='nullDataImg'></div><p>暂时还没有任何内容哦～</p></div>")
						flowTopListBox.append(nullData);
					}
				}else{
					alert(data.message);
				}
			}
		});
	},
	viewKeyPage:function(data){
		template.repeat({
			repeatElement : $("#listComponent")[0], /*页面的DOM元素*/
			data : data,
			process : function(itemObject){
				var key = itemObject.index;
				var item = itemObject.item;
				var name="",
					iconImg="";
				switch(item.phaseName){
					case "成本管理":
					iconImg="key_cost_img";
					name=item.phaseName;
					break;
					case "质量管理":
					iconImg="key_quality_img";
					name=item.phaseName;
					break;
					case "设计管理":
					iconImg="key_design_img";
					name=item.phaseName;
					break;
				}
				return {
					"id":item.phaseId,
					"name":name,
					"itemName":name,
					"imgUrl":'<img src="images/flow/'+iconImg+'.png">',
					"isBimControl":0,
					"noBorder":key==data.length-1?"border-no-color":"border-bottom-color"
				}
			}
		});
	},
	viewPage:function(data){
		template.repeat({
			repeatElement : $("#listComponent")[0], /*页面的DOM元素*/
			data : data,
			process : function(itemObject){
				var key = itemObject.index;
				var item = itemObject.item;
				var name="",
					iconImg="";
				switch(item.order){
					case 1:
					iconImg="lxgh_img";
					name="Ⅰ."+item.name;
					break;
					case 2:
					iconImg="sjbj_img";
					name="Ⅱ."+item.name;
					break;
					case 3:
					iconImg="gcjs_img";
					name="Ⅲ."+item.name;
					break;
					case 4:
					iconImg="yjyy_img";
					name="Ⅳ."+item.name;
					break;
					case 5:
					iconImg="key_cost_img";
					name="Ⅳ."+item.name;
					break;
					case 6:
					iconImg="key_quality_img";
					name="Ⅳ."+item.name;
					break;
				}
				return {
					"id":item.id,
					"name":name,
					"itemName":item.name,
					"isBimControl":1,
					"imgUrl":'<img src="images/flow/'+iconImg+'.png">',
					"noBorder":key==data.length-1?"border-no-color":"border-bottom-color"
				}
			}
		});
	}
}