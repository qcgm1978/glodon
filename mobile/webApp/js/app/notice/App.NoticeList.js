App.NoticeList = {
	defaults:{
		title:'',//搜索的关键字的字段
		status:1,//状态(1:发布，2:撤销,3:未发布)
		pageIndex:1,//开始页数是1
		pageNum:10,//总共的页数1
        flag:true,
		searchBool:false,//是否是搜索状态
	},
	init : function(arge){
		var _this = this;
		App.NoticeList.defaults = {
			title:'',
			status:1,
			pageIndex:1,
			pageNum:10,
			flag:true,
			searchBool:false,
		}
		this.initHtml();//初始化页面
		$(function(){
			if(!App.NoticeList.defaults.searchBool){
				if(localStorage.getItem('noticeObj')){
					_this.defaults.pageIndex = JSON.parse(localStorage.getItem('noticeObj')).pageIndex;
					_this.defaults.pageNum = JSON.parse(localStorage.getItem('noticeObj')).pageIndex*10;
				}
			}
			_this.loadNoticeData();//获取公告的列表
			_this.initHandle();//初始化方法
			_this.searchInit();//初始化搜索方法
		})
	},
	initHtml:function(){
		App.TitleBar.setTitle("公告");
		App.TitleBar.hidePopMenuBtn();//隐藏顶部三个点按钮
		App.TitleBar.returnCallback("#/index");
		App.hideMainMenu();//隐藏底部导航栏
		$("#mainContainer").css("padding-bottom",0);
	},
	initHandle:function(){//初始化方法
		var _this = this;
		$("#noticeList").on("click","li",function(evt){
			var target = $(evt.target).closest("li");
			var noticeId = target.data("noticeid");
			var readBool = target.data("readbol");
			var targetA = target.find('a').data("shownav");
			var targetHref = target.find('a').data("href");
			if(!readBool){
				var promise = new Promise(function(resolve, reject){//做一些异步操作
				    var data = {
				    	id:noticeId,
				    }
				    App.Comm.ajax({
				    	type:"get",
				    	url:App.Restful.urls.noticeRead,
				    	param:data,
				    	dataType:"json",
				    	success:function(data){
				    		if(data.code == 0) {
				    			resolve(data);
				    		}else{
				    			reject(data);
				    		}
				    	}
				    });
				});
				promise.then(function(data){
					if(data.code==0){
						target.find("i").addClass('noRead');
					}
					return true;
				}).then(function(data){
					if(data == true){
						if(targetA){
							cordova.exec(function () {}, function () {}, "WDNaviPlugin", "hiddenNavi",  ["0"]);
							location.href = targetHref;
						}else{
							location.href=targetHref;
						}
					}
				}).catch(function (reason) {
				    alert(reason.message);
				});
			}else{
				if(targetA){
					cordova.exec(function () {}, function () {}, "WDNaviPlugin", "hiddenNavi",  ["0"]);
					location.href = targetHref;
				}else{
					location.href=targetHref;
				}
			}
			if(!App.NoticeList.defaults.searchBool){
				if(localStorage.getItem('noticeObj')){
					var objStr = JSON.parse(localStorage.getItem('noticeObj'));
					objStr.pageIndex = _this.defaults.pageIndex;
					localStorage.setItem('noticeObj',JSON.stringify(objStr));
				}
				/*if(App.defaults.noticeObj){
					App.defaults.noticeObj.pageIndex = _this.defaults.pageIndex;
				}*/
			}
			return false;
		})
		$("#searchListBox").on("click","li",function(evt){
			var target = $(evt.target).closest("li");
			var noticeId = target.data("noticeid");
			var readBool = target.data("readbol");
			var targetA = target.find('a').data("shownav");
			var targetHref = target.find('a').data("href");
			if(!readBool){
				var promise = new Promise(function(resolve, reject){//做一些异步操作
				    var data = {
				    	id:noticeId,
				    }
				    App.Comm.ajax({
				    	type:"get",
				    	url:App.Restful.urls.noticeRead,
				    	param:data,
				    	dataType:"json",
				    	success:function(data){
				    		if(data.code == 0) {
				    			resolve(data);
				    		}else{
				    			reject(data);
				    		}
				    	}
				    });
				});
				promise.then(function(data){
					if(data.code==0){
						target.find("i").addClass('noRead');
					}
					return true;
				}).then(function(data){
					if(data == true){
						if(targetA){
							cordova.exec(function () {}, function () {}, "WDNaviPlugin", "hiddenNavi",  ["0"]);
							location.href = targetHref;
						}else{
							location.href=targetHref;
						}
					}
				}).catch(function (reason) {
				    alert(reason.message);
				});
			}else{
				if(targetA){
					cordova.exec(function () {}, function () {}, "WDNaviPlugin", "hiddenNavi",  ["0"]);
					location.href = targetHref;
				}else{
					location.href=targetHref;
				}
			}
			if(localStorage.getItem('noticeObj')){
				localStorage.removeItem('noticeObj')
			}
			/*if(App.defaults.noticeObj){
				App.defaults.noticeObj = undefined;
			}*/
			return false;
		})
	},
	initScrollHandle:function(){//初始化滚动条功能方法
		var _this = this;
		var loadMore = $(".loadMore");
		var scrollEle = !App.NoticeList.defaults.searchBool?"#noticeContentBox":"#searchCommentDown";
		this.defaults.listScroll = new IScroll(scrollEle, {
		    mouseWheel: true,//鼠标滚轮
		    probeType: 3,//像素级触发 执行回调
		    scrollbars: false,//滚轴是否显示默认是
		    truebounceTime: 600,//弹力动画持续的毫秒数
		    click:true,
		});
		if(!App.NoticeList.defaults.searchBool){
			if(localStorage.getItem('noticeObj')){
				this.defaults.listScroll.scrollTo(0, JSON.parse(localStorage.getItem('noticeObj')).scrollPos, 10);
			}
		}
		this.defaults.listScroll.on('scroll', function(){
		    if(this.directionY == 1){
		        if(this.y<this.maxScrollY){
		            loadMore.show();
		        }
		    }
		});
		this.defaults.listScroll.on('scrollEnd', function(){
			if(!App.NoticeList.defaults.searchBool){
				var noticeObj = {
					scrollPos:this.y
				}
				localStorage.setItem('noticeObj',JSON.stringify(noticeObj));
			}
		    if(this.y==this.maxScrollY&&this.maxScrollY<0){
		    	if(!_this.defaults.flag) return;
		    	_this.defaults.flag = false;
		    	_this.loadMoreDataHandle();//获取更多
		    }
		});
	},
	loadMoreDataHandle:function(){//滚动加载 更多数据的方法
		var self = this;
		var data = {
			title:this.defaults.title,
			status:this.defaults.status,//获取公告的方法 
			pageIndex:this.defaults.pageIndex+1,
			pageItemCount:10,
		}
		App.Comm.ajax({
			type:"get",
			url:App.Restful.urls.notice,
			param:data,
			dataType:"json",
			cache:false,
			success:function(data){
				self.defaults.flag = true;
				if(data.code==0){
					if(data.data.items.length>0){
						self.defaults.pageIndex++;
						self.appendDomHandle(data.data.items);//添加页面元素的方法
					}else{
						$(".loadMore").html(App.defaults.loadMoreBottomText);
					}
					self.defaults.listScroll.refresh();
				}else{
					alert(data.message);
				}
			}
		});
	},
	appendDomHandle:function(data){//添加页面元素的方法
		var html = '',
			name = '',
			planStartDate = '',
			shownav = '',
			isRead = '',
			id = '',
			hrefStr = '',
			noRead = '';
		var noticeList = !App.NoticeList.defaults.searchBool?$("#noticeList"):$("#searchListBox");
		for(var i=0,iLen=data.length;i<iLen;i++){
			shownav = data[i].type==1?true:false;
			isRead = data[i].read;
			id = data[i].id;
			hrefStr = data[i].type==1?data[i].href:"#/noticeDetail/"+id+"/noticeList";
			noRead = data[i].read==true?"noRead":"";
			name = App.searchHighlightHandle(decodeURIComponent(App.NoticeList.defaults.title),data[i].title);//搜索结果高亮效果的方法
			planStartDate = Assister.Date.getDateCommon(data[i].publishTime)
			html += '<li id="noticeComponent" data-noticeid="'+id+'" data-readbol="'+isRead+'">'+
						'<a href="javascript:;" data-href="'+hrefStr+'" data-shownav='+shownav+'>'+
							'<i class="'+noRead+'">&nbsp;</i>'+
							'<p>'+name+'</p>'+
							'<div class="info">'+
								'<span class="fl">'+planStartDate+'</span>'+
							'</div>'+
						'</a>'+
					'</li>'
		}
		noticeList.append(html);
	},
	searchInit:function(){//搜索初始化方法
		var _this = this;
		$("#searchBtn").on("click",function(){
			var searchVal = $("#searchInput").val().trim();
			App.NoticeList.defaults.title = encodeURIComponent(searchVal);
			App.NoticeList.defaults.searchBool = true;
			App.NoticeList.defaults.pageIndex = 1;
			$(".loadMore").html(App.defaults.loadMoreText);
			$("#searchCommonBox").css("padding-top","1.706rem").css("display","block");
			if(localStorage.getItem('noticeObj')){
				localStorage.removeItem('noticeObj')
			}
			_this.loadNoticeData();//执行搜索获取数据
		})
		$("#searchInput").on("keyup",function(evt){
		 	var targetVal = $(evt.target).val().trim();
		 	if(targetVal.length>0){
		 		$("#clearSearchVal").css("display","block");
		 	}
		})
		$("#clearSearchVal").on("click",function(){//清空输入框的文字
			App.NoticeList.defaults.title = "";
			$(this).hide();
			$("#searchInput").val("");
		})
		$("#clearSearchBtn").on("click",function(){//点击清空搜索的文字
			$("#searchCommonBox").css("display","none");
			$("#clearSearchVal").css("display","none");
			$("#searchListBox").html("");
			$("#searchInput").val("");
			$(".loadMore").html(App.defaults.loadMoreText);
			App.NoticeList.defaults.title="";
			App.NoticeList.defaults.searchBool = false;
			App.NoticeList.defaults.pageIndex = 1;
			_this.loadNoticeData();//执行搜索获取数据
		})
	},
	loadNoticeData:function(){//获取公告的方法
		var th = this;
		var data = {
			title:App.NoticeList.defaults.title,
			status:App.NoticeList.defaults.status,//获取公告的方法 
			pageIndex:1,
			pageItemCount:App.NoticeList.defaults.pageNum,
		}
		var noticeList = $("ul#noticeList");
		var searchListBox = $("ul#searchListBox");
		var noticeScrollContentBox = $(".noticeScrollContentBox");
		var searchScrollBox = $(".searchScrollBox");
		var listComponent = $('<li id="noticeComponent" data-noticeid="{{id}}" data-readbol="{{readbol}}" style="display:none"><a href="javascript:;" data-href="{{href}}" data-shownav={{showNav}}><i class="{{noRead}}">&nbsp;</i><p>{{title}}</p><div class="info"><span class="fl">{{planStartDate}}</span></div></a></li>');
		var listSearchComponent = $('<li id="noticeSearchComponent" data-noticeid="{{id}}" data-readbol="{{readbol}}" style="display:none"><a href="javascript:;" data-href="{{href}}" data-shownav={{showNav}}><i class="{{noRead}}">&nbsp;</i><p>{{name}}</p><div class="info"><span class="fl">{{planStartDate}}</span></div></a></li>');
		if(App.NoticeList.defaults.searchBool){
			searchScrollBox.css("transform","translate(0px,0px)");
			searchListBox.html("");
			searchListBox.append(listSearchComponent);
		}else{
			noticeScrollContentBox.css("transform","translate(0px,0px)");
			noticeList.html("");
			noticeList.append(listComponent);
		}
		App.Comm.ajax({
			type:"get",
			url:App.Restful.urls.notice,
			param:data,
			dataType:"json",
			cache:false,
			success:function(data){
				if(data.code==0){
					$("#resultNum").html(data.data.totalItemCount);
					if(data.data.items.length<10){
						$(".loadMore").hide();
					}else{
						$(".loadMore").show();
					}
					if(data.data.items.length==0){
						var nullData = $("<div class='nullData'><div class='nullDataImg'></div><p>暂时还没有任何内容哦～</p></div>")
						if(App.NoticeList.defaults.searchBool){
							searchListBox.append(nullData);
							return;
						}
						noticeList.html(nullData);
					}else{
						if(th.defaults.listScroll){
							th.defaults.listScroll.destroy();
						}
						if(App.NoticeList.defaults.searchBool){
							th.viewSearchProjectsPage(data.data.items);//搜索渲染的页面
							th.initScrollHandle();//初始化滚动条功能方法
							return;
						}
						th.viewNotice(data.data.items);
						th.initScrollHandle();//初始化滚动条功能方法
					}
				}
			}
		});
	},
	viewSearchProjectsPage : function(data){
		/*渲染数据*/
		template.repeat({
			repeatElement : $("#noticeSearchComponent")[0], /*页面的DOM元素*/
			data : data,
			process : function(itemObject){
				var item = itemObject.item;
				var key = itemObject.index;
				var nameStr = item.title;
				var name = App.searchHighlightHandle(decodeURIComponent(App.NoticeList.defaults.title),nameStr);//搜索结果高亮效果的方法
				if(item.type==1){
					return {
						"id":item.id,
						"readbol":item.read,
						"name":name,
						"href":item.href,
						"showNav":'true',
						"planStartDate" : Assister.Date.getDateCommon(item.publishTime),
						"noRead":item.read==true?"noRead":""
					}
				}else if(item.type==2){
					return {
						"id":item.id,
						"readbol":item.read,
						"name":name,
						"showNav":'false',
						"href":'#/noticeDetail/{{id}}/noticeList',
						"planStartDate" : Assister.Date.getDateCommon(item.publishTime),
						"noRead":item.read==true?"noRead":""
					}
				}
			}
		});
	},
	viewNotice : function(data){
		/*渲染数据*/
		template.repeat({
			repeatElement : $("#noticeComponent")[0], /*页面的DOM元素*/
			data : data,
			process : function(itemObject){
				var item = itemObject.item;
				var key = itemObject.index;
				if(item.type==1){
					return {
						"id":item.id,
						"readbol":item.read,
						"href":item.href,
						"showNav":'true',
						"planStartDate" : Assister.Date.getDateCommon(item.publishTime),
						"noRead":item.read==true?"noRead":""
					}
				}else if(item.type==2){
					return {
						"id":item.id,
						"readbol":item.read,
						"href":'#/noticeDetail/{{id}}/noticeList',
						"showNav":'false',
						"planStartDate" : Assister.Date.getDateCommon(item.publishTime),
						"noRead":item.read==true?"noRead":""
					}
				}
			}
		});
	}
};
