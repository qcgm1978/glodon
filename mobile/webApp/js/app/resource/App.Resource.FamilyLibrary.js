App.Resource = App.Resource || {};
App.Resource.FamilyLibrary = {
	defaults:{
		searchName:'',//搜索文件列表的名字
		familyName:'',//版本库的名字
		familyId:'',//版本库的Id
		familyVersionId:'',//版本库版本的id
		familyParentId:'',//版本库父级的id
		arge:'',//传过来的参数
		searchCan:true,//防止重复搜索点击
		pageIndex:1,//文件列表的页数
		crumbsData:'',//面包屑的参数
		searchBool:false,
	},
	init : function(arge){
		var _this = this;
		App.Resource.FamilyLibrary.defaults.searchName="";
		App.Resource.FamilyLibrary.defaults.arge=arge;
		App.Resource.FamilyLibrary.defaults.familyName=arge.name;
		App.Resource.FamilyLibrary.defaults.familyId=arge.id;
		App.Resource.FamilyLibrary.defaults.familyVersionId=arge.versionId;
		App.Resource.FamilyLibrary.defaults.familyParentId=arge.folderId?arge.folderId:"";
		App.Resource.FamilyLibrary.defaults.searchBool=false;
		this.initHtmlHandle();//初始化页面
		$(function(){
			_this.loadFileList();//获取族库列表的方法
			_this.crumbsDomHandle();//面包屑方法
			_this.initHandle();//初始化方法
			_this.searchInit();//初始化搜索方法
		})
	},
	initHtmlHandle:function(){//初始化页面
		App.TitleBar.hidePopMenuBtn();//隐藏顶部三个点按钮
		App.TitleBar.setTitle(App.Resource.FamilyLibrary.defaults.familyName);
		App.TitleBar.showHomeBtn() //显示home图片
		App.hideMainMenu();//隐藏底部导航栏
		$("#mainContainer").css("padding-bottom",0);
		if(!$("#footerBox > div").eq(3).hasClass("footer-box-select")){
			$("#footerBox > div").eq(3).click();
		}
	},
	searchInit:function(){//搜索初始化方法
		var _this = this;
		$("#searchBtn").on("click",function(){
			var searchVal = $("#searchInput").val().trim();
			App.Resource.FamilyLibrary.defaults.searchName = searchVal;
			if(App.Resource.FamilyLibrary.defaults.searchCan){
				$("#searchCommonBox").css("padding-top","2.506rem").css("display","block");
				App.Resource.FamilyLibrary.defaults.searchBool = true;
				_this.loadFileList();//执行搜索获取数据
			}
		})
		$("#searchInput").on("keyup",function(evt){
		 	var targetVal = $(evt.target).val().trim();
		 	if(targetVal.length>0){
		 		$("#clearSearchVal").css("display","block");
		 	}
		})
		$("#clearSearchVal").on("click",function(){
			App.Resource.FamilyLibrary.defaults.searchName = "";
			$(this).hide();
			$("#searchInput").val("");
		})
		$("#clearSearchBtn").on("click",function(){
			$("#searchCommonBox").css("display","none");
			$("#clearSearchVal").css("display","none");
			$("#searchListBox").html("");
			$("#searchInput").val("");
			App.Resource.FamilyLibrary.defaults.searchName="";
		})
	},
	initHandle : function(){
		$("#fileList").on("click","a",function(evt){
			var target = $(evt.target).closest("a");
			if(target.attr("href").indexOf("famLibsModel")!=-1 || target.attr("href").indexOf("viewModel")!=-1){
				localStorage.removeItem("viewPoint");
			}
		})
	},
	loadFileList:function(){//获取文件列表的方法
		if(!App.Resource.FamilyLibrary.defaults.searchCan){
			return;
		}
		App.Resource.FamilyLibrary.defaults.searchCan=false;
		var th = this;
		var fileList = $("#fileList");
		var searchListBox = $("#searchListBox");
		var lodingDom = $('<div class="loading">加载中...</div>');
		var listComponent=$('<li id="fileListComponent" style="display:none"><a class="{{noBorder}} {{noDisplay}}" href="{{href}}"><dl><dt>{{imgLogo}}</dt><dd><h2>{{name}}</h2><p>{{createTime}}<span>{{size}}</span></p></dd></dl><i></i></a></li>');
		var listSearchComponent=$('<li id="fileListSearchComponent" style="display:none"><a class="{{noBorder}} {{noDisplay}}" href="{{href}}"><dl><dt>{{imgLogo}}</dt><dd><h2>{{name}}</h2><p>{{createTime}}<span>{{size}}</span></p></dd></dl><i></i></a></li>');
		if(App.Resource.FamilyLibrary.defaults.searchBool){
			searchListBox.html("");
			searchListBox.append(lodingDom);
			searchListBox.append(listSearchComponent);
		}else{
			fileList.html('');
			fileList.append(lodingDom);
			fileList.append(listComponent);
		}
		var folderData = {//获取文件列表的参数
			projectId:App.Resource.FamilyLibrary.defaults.familyId,//项目id
			projectVersionId:App.Resource.FamilyLibrary.defaults.familyVersionId,//项目版本id
			parentId:App.Resource.FamilyLibrary.defaults.familyParentId,// 文件夹父级id
			pageIndex:App.Resource.FamilyLibrary.defaults.pageIndex,//列表的页数
			pageItemCount:"100",
		}
		if(App.Resource.FamilyLibrary.defaults.searchName.length>0){//搜索的文件名字
			folderData.folderName=App.Resource.FamilyLibrary.defaults.searchName
		}
		App.Comm.ajax({
			type:"get",
			url:App.Resource.FamilyLibrary.defaults.searchName.length>0?App.Restful.urls.projectSearchFolderList:App.Restful.urls.projectFolderList,
			param:folderData,
			dataType:"json",
			success:function(data){
				if(data.code==0){
					App.Resource.FamilyLibrary.defaults.searchCan=true;
					if(App.Resource.FamilyLibrary.defaults.searchBool){
						searchListBox.find(".loading").remove();
					}else{
						fileList.find(".loading").remove();
					}
					if(data.data.length == 0){
						var nullData = $("<div class='nullData'><div class='nullDataImg'></div><p>暂时还没有任何内容哦～</p></div>")
						if(App.Resource.FamilyLibrary.defaults.searchBool){
							$("#resultNum").html(data.data.length);
							searchListBox.append(nullData);
							return;
						}
						fileList.append(nullData);
					}else{
						if(App.Resource.FamilyLibrary.defaults.searchBool){
							$("#resultNum").html(data.data.length);
							th.viewSearchProjectsPage(data.data);//搜索渲染的页面
							return;
						}
						th.viewResourcefloderPage(data.data);
					}
				}else{
					alert(data.message)
				}
			}
		});
	},
	viewSearchProjectsPage:function(data){//搜索渲染的页面
		/*渲染数据*/
		template.repeat({
			repeatElement : $("#fileListSearchComponent")[0], /*页面的DOM元素*/
			data : data,
			process : function(itemObject){
				var item = itemObject.item;
				var key = itemObject.index;
				var projectId = App.Resource.FamilyLibrary.defaults.familyId;
				var projectVersionId = App.Resource.FamilyLibrary.defaults.familyVersionId;
				var projectName = App.Resource.FamilyLibrary.defaults.familyName;
				var familyParentId = App.Resource.FamilyLibrary.defaults.familyParentId;
				var zhengze = / /g;
				var imgHtml=""
					href="javascript:;",
					nameStrs="",
					nameStr=item.name,
					name = nameStr.replace(zhengze,"*");
				var changeName = App.replaceKongGeHandle(item.name);
				if(App.Resource.FamilyLibrary.defaults.searchName == "."){
					App.Resource.FamilyLibrary.defaults.searchName = "\\"+App.Resource.FamilyLibrary.defaults.searchName;
				}
				var nameStrs = App.searchHighlightHandle(App.Resource.FamilyLibrary.defaults.searchName,nameStr);//搜索结果高亮效果的方法
				if(item.folder){
					imgHtml = '<img src="images/comm/file_icon.png">';
					href = "#/resourceFamilyLibraryList/"+projectId+"/"+projectVersionId+"/"+projectName+"/"+item.id;
				}else{
					if(item.suffix == "rte"){
						imgHtml = '<img src="images/comm/rte_icon.png">';
						href = "#/viewModel/"+projectId+"/"+projectVersionId+"/"+projectName+"/"+familyParentId+"/"+changeName+"/"+item.modelId+"/resourceFamilyLibraryList?t=123456&fileId="+item.id+"&fileVersionId="+item.fileVersionId+"&noComment=yes";
					}else if(item.suffix == "rfa"){
						imgHtml = '<img src="images/comm/rfa_icon.png">';
						href = "#/famLibsModel/"+projectId+"/"+projectVersionId+"/"+projectName+"/"+familyParentId+"/"+changeName+"/"+item.modelId+"/resourceFamilyLibraryList?t=123456&fileId="+item.id+"&fileVersionId="+item.fileVersionId;
					}
				}
				return {
					"href":href,
					"name":nameStrs,
					"size":Assister.Size.formatSize(item.length),
					"imgLogo":imgHtml,
					"createTime":Assister.Date.getDateFromHMLong(item.createTime),
					"noBorder":key==data.length-1?"border-no-color":"border-bottom-color",
					"noDisplay":!item.folder?"noDisplay":"",
				}
			}
		});
	},
	viewResourcefloderPage : function(data){
		/*渲染数据*/
		template.repeat({
			repeatElement : $("#fileListComponent")[0], /*页面的DOM元素*/
			data : data,
			process : function(itemObject){
				var item = itemObject.item;
				var key = itemObject.index;
				var projectId = App.Resource.FamilyLibrary.defaults.familyId;
				var projectVersionId = App.Resource.FamilyLibrary.defaults.familyVersionId;
				var projectName = App.Resource.FamilyLibrary.defaults.familyName;
				var familyParentId = App.Resource.FamilyLibrary.defaults.familyParentId;
				var zhengze = / /g;
				var imgHtml=""
					href="javascript:;",
					nameStr = item.name,
					name = nameStr.replace(zhengze,"*");
				var changeName = App.replaceKongGeHandle(item.name);
				if(item.folder){
					imgHtml = '<img src="images/comm/file_icon.png">';
					href = "#/resourceFamilyLibraryList/"+projectId+"/"+projectVersionId+"/"+projectName+"/"+item.id;
				}else{
					if(item.suffix == "rte"){
						imgHtml = '<img src="images/comm/rte_icon.png">';
						href = "#/viewModel/"+projectId+"/"+projectVersionId+"/"+projectName+"/"+familyParentId+"/"+changeName+"/"+item.modelId+"/resourceFamilyLibraryList?t=123456&fileId="+item.id+"&fileVersionId="+item.fileVersionId+"&noComment=yes";
					}else if(item.suffix == "rfa"){
						imgHtml = '<img src="images/comm/rfa_icon.png">';
						href = "#/famLibsModel/"+projectId+"/"+projectVersionId+"/"+projectName+"/"+familyParentId+"/"+changeName+"/"+item.modelId+"/resourceFamilyLibraryList?t=123456&fileId="+item.id+"&fileVersionId="+item.fileVersionId;
					}else{
						imgHtml = '<img src="images/comm/default_icon.png">';
					}
				}
				return {
					"href":href,
					"name":item.name,
					"size":Assister.Size.formatSize(item.length),
					"imgLogo":imgHtml,
					"createTime":Assister.Date.getDateFromHMLong(item.createTime),
					"noBorder":key==data.length-1?"border-no-color":"border-bottom-color",
					"noDisplay":!item.folder?"noDisplay":"",
				}
			}
		});
	},
	loadVersionName:function(){//加载最新版本的方法
		var data = {
			projectId:App.Resource.FamilyLibrary.defaults.familyId,
			projectVersionId:App.Resource.FamilyLibrary.defaults.familyVersionId,
		}
		App.Comm.ajax({
			type:"get",
			url:App.Restful.urls.versionName,
			param:data,
			dataType:"json",
			success:function(data){
				if(data.code == 0){
					var name = data.data.name;
					App.Resource.FamilyLibrary.defaults.versionName = data.data.name;
					$("#versionText").html(name);
				}else{
					alert(data);
				}
			}
		});
	},
	crumbsDomHandle:function(){//获取面包屑的方法
		var _this = this;
		var data = {
			projectId:App.Resource.FamilyLibrary.defaults.familyId,
			projectVersionId:App.Resource.FamilyLibrary.defaults.familyVersionId,
			parentId:App.Resource.FamilyLibrary.defaults.familyParentId,
		}
		App.Comm.ajax({
			type:"get",
			url:App.Restful.urls.projectCrumbsList,
			param:data,
			dataType:"json",
			success:function(data){
				if(data.code==0){
					App.Resource.FamilyLibrary.defaults.crumbsData = data.data;
					_this.crumbsHandle(data.data);
				}else{
					alert(data.message)
				}
			}
		});
	},
	divWidth:function(){
		var touchDom = $("#touchDom");
		var aDom = touchDom.find("a");
		var maxWidth=0;
		for(var i=0,len=aDom.length;i<len;i++){
			maxWidth += $(aDom[i]).width();
		}
		touchDom.width(maxWidth);
	},
	crumbsHandle:function(data){//渲染面包屑页面的方法
		var html = '';
		var crumbsBox = $(".m_common_crumbs_scroll_box");
		var familyId = App.Resource.FamilyLibrary.defaults.familyId;
		var familyVersionId = App.Resource.FamilyLibrary.defaults.familyVersionId;
		var familyName = App.Resource.FamilyLibrary.defaults.familyName;
		if(data.length>0){
			html += '<a href="#/resourceFamilyLibraryList/'+familyId+'/'+familyVersionId+'/'+familyName+'">族库</a><i class="nextChild"></i>';
			for(var i=0,len=data.length;i<len;i++){
				if(i == data.length-1){
					html+='<a href="javascript:;">'+data[i].name+'</a>';
				}else{
					html+='<a href="#/resourceFamilyLibraryList/'+familyId+'/'+familyVersionId+'/'+familyName+'/'+data[i].id+'">'+data[i].name+'</a>';
				}
			}
		}else{
			html += '<a href="javascript:;">族库</a>';
		}
		crumbsBox.html(html);
		this.divWidth();
		this.setReturn();
	},
	setReturn:function(){//设置返回按钮点击
		var backUrl = ""
			returnId = "";
		var data = App.Resource.FamilyLibrary.defaults.crumbsData;
		var familyId = App.Resource.FamilyLibrary.defaults.familyId;
		var familyVersionId = App.Resource.FamilyLibrary.defaults.familyVersionId;
		var familyName = App.Resource.FamilyLibrary.defaults.familyName;
		if(data.length>1){
			returnId = data[data.length-2].id;
			backUrl = "#/resourceFamilyLibraryList/"+familyId+"/"+familyVersionId+"/"+familyName+"/"+returnId
		}else if(data.length>0){
			backUrl = "#/resourceFamilyLibraryList/"+familyId+"/"+familyVersionId+"/"+familyName;
		}else{
			backUrl = "#/resourceComList/family";
		}
		App.TitleBar.returnCallback(backUrl);
	},
}