//列表详情
App.Services.ApplicationListDetail = Backbone.View.extend({

	tagName: "li",

	className: "item",

	events: {
		"click  .reset": "resetKey",
		"click  .myIcon-update": "updateAppDialog",
		"click  .myIcon-del-blue": "delAppDialog",
		"click .switchStatus": "switchStatus",
		'mouseover .desc':'showTip',
		'mouseout .desc':'hideTip'
	},

	initialize() {
		//this.listenTo(this, "remove", this.removeModel);
		this.listenTo(this.model, "destroy", this.removeModel);
		this.listenTo(this.model, "change", this.render);
	},

	template: _.templateUrl('/services/tpls/application/app.list.detail.html'),

	render() {
		var data = this.model.toJSON();
		this.$el.html(this.template(data)).data("id", data.id);
		if (data.status != 1) {
			this.$el.addClass("disabled");
		}else{
			this.$el.removeClass("disabled");
		}
		return this;
	},

	//重新生成 appsecret
	resetKey(event) {

		var $item = $(event.target).closest(".item"),
			name = $item.find(".name").text(),
			id = $item.data("id"),
			msg = "确认重新生成“" + name + "”的appsecret？";

		App.Services.Dialog.alert(msg, (dialog) => {

			var data = {
				URLtype: "appResetSecret",
				type:"PUT",
				data: {
					id: id
				}
			}

			//重新生成
			App.Comm.ajax(data, function(data) {
				if (data.code == 0) {
					$item.find(".appSecret .text").text(data.data.appSecret);
					dialog.close();
				}
			});

		}, "生成中");
	},

	//更新 app、
	updateAppDialog(event) {

		var $item = $(event.target).closest(".item"),
			data = {
				isEdit: true,
				name: $item.find(".name").text().trim(),
				desc: $item.find(".desc").text().trim(),
				appKey: $item.find(".appKey").text().trim(),
				appSecret: $item.find(".appSecret .text").text().trim()
			},
			dialogHtml = _.templateUrl('/services/tpls/application/index.add.html')(data);

		var opts = {
			title: "编辑应用",
			width: 601,
			isConfirm: false,
			isAlert: true,
			cssClass: "addNewApp",
			message: dialogHtml,
			okCallback: () => {
				this.updateApp(dialog);
				return false;
			}

		}

		var dialog = new App.Comm.modules.Dialog(opts);
		dialog.id = $item.data("id");
	},

	//更新app
	updateApp(dialog) {

		var pars = {
				id: dialog.id,
				name: dialog.element.find(".txtAppTitle").val().trim(),
				desc: dialog.element.find(".txtAppDesc").val().trim()
			},
			that = this;


		if (!pars.name) {
			alert("请输入应用名称");
			return;
		}

		if (!pars.desc) {
			alert("请输入应用详情");
			return;
		}


		var data = {
				URLtype: "appUpdate",
				headers: {
					"Content-Type": "application/json"
				},
				type: "PUT",
				data: JSON.stringify(pars)
			}
			//更新

		App.Comm.ajax(data, function(data) {
			if (data.code == 0) {
				that.model.set(data.data);
				dialog.close();
			}
		});

	},

	//删除 app
	delAppDialog(event) {

		var $item = $(event.target).closest(".item"),
			name = $item.find(".name").text(),
			id = $item.data("id"),
			that = this,
			msg = "确认删除“" + name + "";

		App.Services.Dialog.alert(msg, function(dialog) {

			var data = {
				URLtype: "appDel",
				type: "DELETE",
				data: {
					id: id
				}
			}

			App.Comm.ajax(data, function(data) {
				if (data.code == 0) {
					that.model.destroy();
					dialog.close();
				}else{
					alert("删除报错啦:"+data.message);
				}
			});
		});
	},

	//移除
	removeModel() {
		//最后一条
		var $parent = this.$el.parent();
		if ($parent.find("li").length <= 1) {
			$parent.append('<li class="loading" data-i18n="data.drawing-model.Ndd">无数据</li>');
		}
		this.remove();
		$(".count").text($parent.find("li").length);
	},

	//修改状态
	switchStatus(event) {

		var $item = $(event.target).closest(".item"),
			data = {
				URLtype: "appSwitchStatus",
				type:"PUT", 
				data: {
					id: $item.data("id"),
					status: $item.hasClass("disabled")?1:2
				}
			}; 

		App.Comm.ajax(data, (data) => {
			if (data.code == 0) {
				this.model.set(data.data);
			}
		});

	},
	
	showTip(e){
		var $target=$(e.currentTarget),
			top=e.pageY,
			left=e.pageX;
		var $div=$('<div/>').css({
			position:'fixed',
			top:top+'px',
			left:left+'px',
			zIndex:9999,
			border:'1px solid #000',
			background:'#FFF',
			borderRadius:'5px',
		    padding: '3px',
		    maxWidth: '500px',
		    wordBreak: 'break-all',
		    wordWrap: 'break-word'
		    
		});
		this.currentTip=$div;
		
		$div.html($target.html()).appendTo($('body'));
	},
	
	hideTip(e){
		this.currentTip.remove();
	}

});