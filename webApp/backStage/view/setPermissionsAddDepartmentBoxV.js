App.backStage.AddDepartmentV = Backbone.View.extend({
	tagName: "div",
	className: "moduleWindow",
	template: _.templateUrl("/backStage/tpls/setPermissions/setPermissionsPublicDepartmentBox.html"),
	selectTree: null,
	selectedTree: null,
	events: {
		"click a[name='selectBtn']": "addOption",
		"mouseover .ztree li a": "showDelete",
		"mouseout .ztree li a": "hideDelete",
		'click #grandBtn':'grand',
		"click .searchBtn":"search",
		"click .closeicon":"clearSearch",
		"keyup #searchContent":"searchCli"
	},
	default:{
		type:2,
		ajaxArr:[]
	},
	isSearch : false,
	render: function(type) {
		this.default.type=type;
		this.default.ajaxArr=[];
		this.$el.append(this.template());
		return this;
	},
	//初始化部门成员数据、基于ztree树插件
	initView: function(data) {
		//缓存当前View实例对象
		var _view = this;
		//树插件初始化配置
		_view.loadChildren(_view,false,null);
		if(data !== "clearSearch"){
			this.selectedTree = $.fn.zTree.init($("#selectedTree"), {
				data:{
					key:{
						title:"tip"
					}
				},
				edit:{
					enable:true,
					showRemoveBtn:true,
					showRenameBtn:false
				},
				view: {
					selectedMulti: false,
					showLine: false,
					showTitle:true,
					nameIsHTML:true
				}
			}, []);
		}
	},
	//搜索模块
	search:function(e){
		var _this = this, 
			url,
			content = $("#searchContent").val();
		if(!content){return}
		var uid=App.Comm.user('userId');
		var treeNode = null,
			setting = {
				data:{
					key:{
						title:"tip"
					}
				},
				callback: {
					beforeDblClick:function(){
						return true;
					},
					onDblClick: function(event, treeId, treeNode) {
						if(!treeNode.userId && !treeNode.isParent){
							_this.loadChildren(_this,treeNode.outer,treeNode.orgId,treeNode);
						}else if(treeNode.userId){
							_this.addOption();
						}
					}
				},
				view: {
					selectedMulti: true,
					nameIsHTML:true,
					showLine: false,
					showTitle:false
				}
			};

		url=App.API.URL.searchUrl +"?name=" + content;  // 头像不对
		$.ajax({
			url:url,
			type:"GET",
			data:{},
			success:function(res){
				if(res.message==="success"){
					var zNodes= res.data || [];
					zNodes.forEach(function(i){
						i.iconSkin='business';
						i.name=i.name+'<i style="color:#999999;">（'+i.parentname+'）</i>';
						i.nameN = i.name;
						if(i.type == 1){
							i.userId = i.id
						}else{
							i.orgId  = i.id
						}
					});
					if(!treeNode){
						_this.selectTree = $.fn.zTree.init($("#selectTree"), setting, zNodes);
					}else{
						_this.selectTree.addNodes(treeNode,zNodes);
					}
				}
				clearMask();
			}
		});
	},
	//显示删除按钮
	showDelete: function(e) {
		$(e.currentTarget).find(".showDelete").show();
	},
	//隐藏删除按钮
	hideDelete: function(e) {
		$(e.currentTarget).find(".showDelete").hide();
	},
	//重置
	clearSearch:function(e){
		var ele = $(e.target);
		ele.siblings("input").val("");
		this.initView('clearSearch');
	},
	searchCli:function(e){
		if(e.keyCode == 13){
			this.search();
		}
	},
	loadChildren:function(_this,outer,parentId,treeNode){
		_this.$(".scrollWrap").mmhMask();
		var url="fetchServicesMemberInnerList",
			_getData={
				uid:App.Comm.user('userId')
			},
			setting = {
				data:{
					key:{
						title:"tip"
					}
				},
				callback: {
					beforeDblClick:function(){
						return true;
					},
					onClick: function(event, treeId, treeNode) {
						if(!treeNode.userId && !treeNode.isParent){
							_this.loadChildren(_this,treeNode.outer,treeNode.orgId,treeNode);
						}else if(treeNode.userId){
							//_this.addOption();
						}
					}
				},
				view: {
					selectedMulti: true,
					nameIsHTML:true,
					showLine: false,
					showTitle:true
				}
			};
		if(parentId){
			_getData={
				outer:outer,
				includeUsers:true,
				parentId:parentId
			}
			url='fetchServicesMemberInnerList';
		}
		App.Comm.ajax({
			URLtype:url,
			type:"get",
			data:_getData
		},function(res){
			if(res.message==="success"){
				_this.loadChildren2(_this,outer,parentId,treeNode,res.data.org);
			}
			clearMask();
		}).fail(function(){
			//失败回调
			clearMask();
		})
	},
	loadChildren2:function(_this,outer,parentId,treeNode,innerArr){
		_this.$(".scrollWrap").mmhMask();
		var url="fetchServicesMemberOuterList",
			_getData={
				uid:App.Comm.user('userId')
			},
			setting = {
				data:{
					key:{
						title:"tip"
					}
				},
				callback: {
					beforeDblClick:function(){
						return true;
					},
					onClick: function(event, treeId, treeNode) {
						if(!treeNode.userId && !treeNode.isParent){
							_this.loadChildren(_this,treeNode.outer,treeNode.orgId,treeNode);
						}else if(treeNode.userId){
							//_this.addOption();
						}
					}
				},
				view: {
					selectedMulti: true,
					nameIsHTML:true,
					showLine: false,
					showTitle:true
				}
			};
		if(parentId){
			_getData={
				outer:outer,
				includeUsers:true,
				parentId:parentId
			}
			url='fetchServicesMemberOuterList';
		}
		App.Comm.ajax({
			URLtype:url,
			type:"get",
			data:_getData
		},function(res){
			if(res.message==="success"){
				var zNodes=[],
					 _org=innerArr.concat(res.data.org)||innerArr.concat([]),
					_user=res.data.user||[],
					_newOrg=[];
				if(url=='fetchServicesMemberOuterList'){
					_org.forEach(function(i){
						i.iconSkin='business';
						i.tip= i.name+"("+i.namePath+")";
						i.name=i.name+'<i style="color:#999999;">（'+i.namePath+'）</i>';
					});
					zNodes=_org.concat(_user);
				}else{
					_org.forEach(function(i){
						i.iconSkin='business';
						i.tip= i.name;
						_newOrg.push(i);
					});
					zNodes=_newOrg.concat(_user);
				}
				zNodes.forEach(function(i){
					i.tip= i.tip|| i.name;
				})
				if(!treeNode){
					_this.selectTree = $.fn.zTree.init($("#selectTree"), setting, zNodes);
				}else{
					_this.selectTree.addNodes(treeNode,zNodes);
				}
			}
			clearMask();
		}).fail(function(){
			//失败回调
			clearMask();
		})
	},
	filterAddOption:function(addedOptions,toBeAddOptions){//防止重复添加和添加成员和部门
		var addArrs = [];
		if(addedOptions.length>0){
			for(var i=0,toBeAddOptionsLen=toBeAddOptions.length-1;i<=toBeAddOptionsLen;i++){
				var flag=true;
				for(var j=0,addedOptionsLen=addedOptions.length-1;j<=addedOptionsLen;j++){
					if(addedOptions[j].tip == toBeAddOptions[i].tip){
						flag=false;
						break;
					}
				}
				if(flag){
					addArrs.push(toBeAddOptions[i]);
				}
			}
			return addArrs;
		}else{
			return toBeAddOptions;
		}
	},
	addOption: function() {//选择节点
		var _this = this,
			newNodesGet = _this.selectedTree.getNodes(),
			nodes = _this.selectTree.getSelectedNodes();
		if(nodes.length<=0) return;
		_.each(nodes,function(n){
			n.children=[];
		})
		// var filterAddArrs = this.filterAddOption(newNodesGet,nodes);
		// console.log(filterAddArrs);
		_this.selectedTree.addNodes(null,nodes);
	},
	/**
	 * 添加项目成员
	 */
	grand:function(){//选好成员之后点击确定执行的方法
		var self = this;
		var nodes=this.selectedTree.getNodes();
		self.default.ajaxArr=[];
		for(var i=0,len=nodes.length-1;i<=len;i++){
			var moveObj={};
			moveObj.orgid=nodes[i].orgId;
			moveObj.orgname=nodes[i].name||nodes[i].nameN;
			moveObj.type=self.default.type;
			moveObj.outersite=nodes[i].outer?1:0;
			self.default.ajaxArr.push(moveObj);
		}
		if(this.default.ajaxArr.length == 0){
			alert("请选择一个部门")
			return;
		}

		var dataObj = {
			"URLtype": "addWorkforgcon",
			"type": "POST",
			"contentType": "application/json",
			"data": JSON.stringify(this.default.ajaxArr)
		};

		App.Comm.ajax(dataObj, function(data) {
			if (data.code == 0) {
				self.getListHandle();
				App.backStage.maskWindow.close();
			}
		});
	},
	getListHandle: function() { //获取当前tab下的列表的方法
		var _self = this;
		var data = {
			type: _self.default.type,
			pageIndex: 1,
			pageItemCount: 30
		}
		var datas = {
			URLtype: "getWorkforgconList",
			data: data,
			type: "get",
			contentType: "application/json",
		}
		$("div#tbodyDom").html("");
		var PublicListBoxV = "";
		App.Comm.ajax(datas, function(result) {
			if (result.code == 0) {
				var items = result.data.items;
				PublicListBoxV = new App.backStage.SetPermissionsIndexV.PublicListBoxV();
				$("div#tbodyDom").html(PublicListBoxV.render(items).el);
			}
		})
	},
})