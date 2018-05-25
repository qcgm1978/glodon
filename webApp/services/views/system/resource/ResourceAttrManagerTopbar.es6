//资源管理
App.Services.System.ResourceAttrManagerTopbar=Backbone.View.extend({
	default:{
		startTime:'',
		endTime:'',
		timeout:0,
		searchTimeOut:0,
		addDataObj:{},
		startTime:"",
		endTime:"",
		maxUploadSize:(50*1024*1000),
		zzsText:/^[0-9]*[0-9]*$/
	},
	tagName:'div',
	className:"resourceTopbar",
	events:{
		"click .btnSearch":"btnSearch",
		"click .btnFileUpload":"uploadFun",
		"click .btnFileDel":"deleteFun",
		"keydown #keyName":"enterSearch"
	},
	render(){//渲染
		var template = _.templateUrl('/services/tpls/system/resource/resourceTopbar.html');
		var startTime = new Date().setMonth(new Date().getMonth()-1);
		var sTimeStr = new Date(startTime);
		var eTimeStr = new Date();
		var startTimeStr = sTimeStr.getFullYear() + "-" + (sTimeStr.getMonth() + 1) + "-" + sTimeStr.getDate();
		var endTimeStr = eTimeStr.getFullYear() + "-" + (eTimeStr.getMonth() + 1) + "-" + eTimeStr.getDate();
		this.default.startTime = startTimeStr;
		this.default.endTime = endTimeStr;
		this.$el.html(template(this.default));
		this.bindTimeFun();
		return this;
	},
	uploadFun(){//点击上传的你方法
		var _self = this;
		var dialogHtml = _.templateUrl('/services/tpls/system/resource/resourceUploadDialog.html',true)();
		var uploadDialog = new App.Comm.modules.Dialog({
			title: "资源上传",
			width: 500,
			height: 290,
			isConfirm: false,
			isAlert: false,
			message: dialogHtml,
			readyFn:function(){
				var _this = this;
				var uploadLink = this.find('.upload');
				var inputSuggestFile = $('#inputSuggestFile');
				var saveButton = $("#saveButton");//确定按钮
				var resourceType = $("#resourceType");//资源类型
				var resourceNum = $("#resourceNum");//资源编码
				var uploadSuggestForm = $('#uploadSuggestForm');//form提交
				var uploadIframeSuggest = $('#uploadIframeSuggest');//提交之后打开ifrem保证不跳转页面 上传 
				uploadLink.on("click",function(){//点击上传按钮之后执行的方法
					inputSuggestFile.click();
				})
				uploadIframeSuggest.on("load",function(){//上传到ifrem 执行上传 并且执行了load放法
					var data = JSON.parse(this.contentDocument.body.innerText);//上传成功之后 返回的数据放到当前的ifrem里面
					_self.afterUpload(data,_this);
				})
				inputSuggestFile.on("change",function(){//当上传那妞有变化执行的方法
					if(this.files[0].size>_self.default.maxUploadSize){
						alert("文件大小超过50M，请重新选择！");
						return;
					}					
					var attachList = $(".attachList");
					attachList.append('<li class="loading">正在上传，请稍候……</li>');
					uploadSuggestForm.submit();
				})
				resourceType.keyup(function(event) {//资源类型搜索显示
					var target = $(event.target);
					var targetVal = target.val().trim();
			 		if(_self.default.timeout){
			 			clearTimeout(_self.default.timeout);
			 		}
				    _self.default.timeout = setTimeout(function(){
				    	_self.searchAjaxFun(targetVal);
				    },400);
				});
				
				saveButton.on("click",function(){//点击确定保存
					if(resourceType.val().trim() == ""){
						alert("资源类型不能为空");
						return;
					}
					if(resourceNum.val().trim() == ""){
						alert("排序编码不能为空");
						return;
					}else if(!_self.default.zzsText.test(resourceNum.val().trim())){
						alert("排序编码只能是正整数");
						return;
					}
					_self.default.addDataObj.type = resourceType.val().trim();
					_self.default.addDataObj.number = resourceNum.val().trim();
					if(_self.default.addDataObj.id){
						App.Comm.ajax({
							URLtype:"saveResource",
							data:JSON.stringify(_self.default.addDataObj),
							type:'POST',
							contentType:"application/json",
						}).done(function(res){
							if(res.code == 0){
								App.Services.SystemCollection.getResourceListHandle();
								uploadDialog.close();
							}
						})
					}else{
						alert("请上传一个资源");
						return;
					}
				})
			}
		});
	},
	afterUpload(res,self){//上传完成之后执行的方法
	    if(res.code==0){
	    	var attachList = self.find('.attachList');
	    	var addResourceData={
	    	    "id":res.data.resourceId,
	    	    "name":res.data.resourceName,
	    	    "type":"",
	    	    "number":"",
	    	    "size":res.data.resourceSize,
	    	    "storkey": res.data.storkey,
	    	    "digest": res.data.digest
	    	}
	    	this.default.addDataObj=addResourceData;
	    	attachList.html("");
	    	attachList.append('<li data-id="'+res.data.resourceId+'">'+res.data.resourceName+'</li>');
        }
	},
	searchAjaxFun(targetVal){//资源类型的搜索方法
		var ulBox = $("#ulBox");
		var resourceTypeBox = $(".resourceTypeBox");
		var resourceType = $("#resourceType");//资源类型
		var html = "";
		ulBox.html();
		if(targetVal == ""){
			ulBox.html("");
			setTimeout(function(){
				resourceTypeBox.css("display","none");
			},200)
			return;
		}
		App.Comm.ajax({
			URLtype:"searchResourceTypeList",
			data:{
				input:targetVal
			},
		}).done(function(res){
			if(res.code == 0){
				var data = res.data;
				resourceTypeBox.css("display","block");
				if(data.length>0){
					for(var i=0,len=data.length-1;i<=len;i++){
						html+="<li>"+data[i].type+"</li>";
					}
					ulBox.html(html);
					ulBox.on("click","li",function(event){//选择一个资源类型
						var target = $(event.target);
						var targetHtml = target.html();
						resourceType.val(targetHtml);
						resourceTypeBox.css("display","none");
					})
				}else{
					ulBox.html("<li>没有找到资源类型</li>");
					setTimeout(function(){
						resourceTypeBox.css("display","none");
					},1000)
				}
			}
		})
	},
	deleteFun(){//删除弹出层
		var flag = false;
		var resourceList = $(".resourceList");
		var checkItem = resourceList.find("input:checked");
		var deleteArr = [];
		if (checkItem.length <= 0) {
			alert("请选择要删除的资源");
			return;
		} else {
			_.each(checkItem, function(item, index) {
				deleteArr.push($(item).parent().data("resid"));
			});
			flag = true;
		}
		var dialogHtml = _.templateUrl('/services/tpls/system/resource/resourceDeleteDialog.html',true)();
		var dialog = new App.Comm.modules.Dialog({
			width: 300,
			height: 180,
			isConfirm: false,
			isAlert: false,
			message: dialogHtml,
			readyFn:function(){
				$("#saveButton").on("click",function(){
					if (flag) {
						App.Comm.ajax({
							URLtype: "deleteResource",
							type: "POST",
							contentType: "application/json",
							data:JSON.stringify(deleteArr),
						}).done(function(res){
							if(res.code == 0){
								App.Services.SystemCollection.getResourceListHandle();
								dialog.close();
								$(".allCheck").prop("checked", false);
							}
						})
					}
				})
			}
		})
	},
	bindTimeFun(){//绑定开始和结束时间的点击事件
		var _this = this;
		this.$('#dateStar').datetimepicker({
		  language: App.Local.getTimeLang(),
		  autoclose: true,
		  format: 'yyyy-mm-dd',
		  minView: 'month'
		});
		this.$('#dateEnd').datetimepicker({
		  language: App.Local.getTimeLang(),
		  autoclose: true,
		  format: 'yyyy-mm-dd',
		  minView: 'month'
		});
		this.$(".dateBox .iconCal").on("click",function() {
		    $(this).next().focus();
		});
		this.$('#dateStar').on('change',function(){
		  _this.default.startTime=$(this).val();
		})
		this.$('#dateEnd').on('change',function(){
		  _this.default.endTime=$(this).val();
		})
	},
	btnSearch(){
		var keyName = $("#keyName");
		var keyNameVal = keyName.val().trim();
		var searchData = {
			keyString:keyNameVal,
			start:this.default.startTime,
			end:this.default.endTime,
			pageIndex:1
		}
 		if(this.default.searchTimeOut){
 			clearTimeout(this.default.searchTimeOut);
 		}
	    this.default.searchTimeOut = setTimeout(function(){
	    	App.Services.SystemCollection.getResourceListHandle(searchData);
	    },400);
	},
	enterSearch:function(e){
		var keyName = $("#keyName");
		var keyNameVal = keyName.val().trim();
		var searchData = {
			keyString:keyNameVal,
			start:this.default.startTime,
			end:this.default.endTime
		}
		if(e && e.keyCode=='13'){
			App.Services.SystemCollection.getResourceListHandle(searchData);
		}
	},
});