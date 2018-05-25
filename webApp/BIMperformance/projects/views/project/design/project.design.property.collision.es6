
//设计属性 碰撞
App.Project.DesignCollision=Backbone.View.extend({

	tagName:"div",

	className:"detailList",

	events: {
		"click .selectBox .currColl":"showSelectList",
		"click .newColl":"collPanel",
		"click .collItem":"getDetail"
	},

	template:_.templateUrl("/projects/tpls/project/design/project.design.property.collision.html",true),

	render:function(){
		this.$el.html(this.template);
		this.$el.find(".collBox").html(new App.Project.DesignCollisionDetail().render().el);
		this.$el.find(".selectBox").append(new App.Project.DesignCollisionTaskList().render().el);
		App.Project.DesignAttr.CollisionTaskDetail.add({message:"none"});
		return this;
	},

	showSelectList:function(event){
		// 显示碰撞任务列表
		var $el = $(event.target).closest(".inputBox");
		var that = this;
		var list = that.$el.find('.collSelect');
		list.show();
	//	$('.collHead').height('240');
		if(true || $el.next(".collSelect").find("ul").length==0){
			App.Project.DesignAttr.CollisionTaskList.projectId = App.Project.Settings.CurrentVersion.projectId;
			App.Project.DesignAttr.CollisionTaskList.projectVerionId = App.Project.Settings.CurrentVersion.id;
			App.Project.DesignAttr.CollisionTaskList.fetch();
		}
		$(document).on('click',that.hideSelectList);
	},
	//重新请求列表
	refreshSelectList:function(){
		// 显示碰撞任务列表
		App.Project.DesignAttr.CollisionTaskList.projectId = App.Project.Settings.CurrentVersion.projectId;
		App.Project.DesignAttr.CollisionTaskList.projectVerionId = App.Project.Settings.CurrentVersion.id;
		App.Project.DesignAttr.CollisionTaskList.fetch();
	},
	hideSelectList:function(event){
		// 隐藏碰撞任务列表
		var that = this;
		var target = $(event.target);
		var list = $(that).find('.collSelect');
		if(!target.is('.selectBox,.selectBox *')){
			list.hide();
			$('.collHead').height('auto');
			$(document).off('click',that.hideSelectList);
		}
	},

	collPanel:function(){
		var self = this;
		//判断是否重新发送碰撞检测
		if($(event.target).text()=="点此重新碰撞"){
			var $selected=$('.collItem.selected');
			if($selected.data('status')==3){
				$.ajax({
					url: "view/"+App.Project.Settings.projectId+"/"+App.Project.Settings.CurrentVersion.id+"/"+$selected.data('id')+"/setting",
					//headers: {
					//	"Content-Type": "application/json"
					//},
					type   : "PUT"
				}
				).done(function(data){
					if(data.code == 0){
						App.Project.DesignAttr.CollisionTaskDetail.add({message:"running"});
						self.refreshSelectList();
					}else if(data.code == 30009){
						$('.designCollision .collTips p').text("文件发生变更，无法重新碰撞，请新建碰撞");
					}else{
						App.Project.DesignAttr.CollisionTaskDetail.add({message:"failed"});
						alert(data.message);
					}

				});
				return
			}
		}
		var dialog = new App.Comm.modules.Dialog({
			width: 580,
			height:360,
			limitHeight: false,
			title: '碰撞检查设置',
			cssClass: 'task-create-dialog',
			message: "",
			cancelText:"取&nbsp;&nbsp;消",
			okText: (App.Local.data['model-view'].OK || '确&nbsp;&nbsp;认'),
			readyFn:function(){
				this.element.find(".content").html(new App.Project.ProjectDesignSetting().render().el);
			},
			okCallback:function(){
				var formData = {},
						taskName = $("#taskName").val(),
						treeA = $("#treeA"),
						treeB = $("#treeB");
				formData.name = taskName;
				formData.leftFiles = getSpecialty(treeA);
				formData.rightFiles = getSpecialty(treeB);
				formData.projectId = App.Project.Settings.projectId;
				formData.projectVersionId = App.Project.Settings.CurrentVersion.id;
				if(!formData.name){
					$("#taskName").addClass("error");
					return false;
				}
				if(formData.leftFiles.length==0 || formData.rightFiles.length==0){
					alert("请选择碰撞文件");
					return false;
				}
				var data = {
					type:'post',
					URLtype:"creatCollisionTask",
					contentType:"application/json",
					data:JSON.stringify(formData)
				  }
				  App.Comm.ajax(data,function(data){
					  if (data.message=="success") {
						App.Project.DesignAttr.CollisionTaskDetail.add({message:"running"});
					  }else{
						App.Project.DesignAttr.CollisionTaskDetail.add({message:"failed"});
						alert(data.message);
					  }
					  $('.detailList .collList').html('');
					  App.Project.DesignAttr.CollisionTaskList.isNew = true;
					  self.refreshSelectList();

				  });
			}
		})
		function getSpecialty(element){
			var data = [];
			element.find(".file").each(function(){
				var that = $(this),
						etag = that.children('.itemContent').data("etag"),
						categories = [];
				that.find(".inputCheckbox").each(function(){
					var _self = $(this),
							code = _self.data("id");
					if(_self.is(":checked")){
						categories.push(code);
					}
				});
				if(categories.length>0){
					data.push({
						"file":etag,
						"categories":categories
					});
				}
			});
			return data;
		}
	},

	getDetail:function(event){
		var list = this.$el.find('.collSelect'),
				that = $(event.target).closest(".collItem"),
				name = that.find('.collName').text(),
				collisionId = that.data('id'),
				status = that.data('status'),
				len = parseInt(($(".detailList").height() -65)/77),
				currentInput = list.prev().find("input");
		currentInput.val(name);
		that.addClass("selected").siblings().removeClass("selected");
		list.hide();
		$('.collHead').height('auto');
		App.Project.Settings.collisionId = collisionId;
		if(status == "2"){
			App.Project.DesignAttr.CollisionTaskDetail.projectId = App.Project.Settings.projectId;
			App.Project.DesignAttr.CollisionTaskDetail.projectVersionId = App.Project.Settings.CurrentVersion.id;
			App.Project.DesignAttr.CollisionTaskDetail.collisionId = collisionId;
			App.Project.DesignAttr.CollisionTaskDetail.pageNo = 1;
			App.Project.DesignAttr.CollisionTaskDetail.pageSize = len;
			App.Project.DesignAttr.CollisionTaskDetail.fetch();
		}else if(status =="3"){
			App.Project.DesignAttr.CollisionTaskDetail.add({message:"failed"})
		}else if(status == "0" || status=="1"){
			App.Project.DesignAttr.CollisionTaskDetail.add({message:"running"})
		}
	}

});


