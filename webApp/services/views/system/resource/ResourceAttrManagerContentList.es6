//资源管理
App.Services.System.ResourceAttrManagerContentList=Backbone.View.extend({
	tagName:'tr',
	template:_.templateUrl("/services/tpls/system/resource/resourceContentList.html"),
	events:{
		"click .checkItem": "checkItemFun",
	},
	render(){//渲染
		this.model.createTime = this.changeTimeHandle(this.model.createTime);
		this.model.size = App.Comm.formatSize(this.model.size);
		this.$el.html(this.template(this.model));
		return this;
	},
	checkItemFun(){//点击列表的单个复选框的方法
		var allCheck = $(".allCheck");
		if (this.$el.parent().parent().find(".checkItem:not(:checked)").length>0) {
			allCheck.prop("checked",false);
		}else{
			allCheck.prop("checked",true);
		}
	},
	changeTimeHandle(time){//时间转换
		var timeStr = new Date(time);
		timeStr = timeStr.getFullYear() + "-" + (timeStr.getMonth() + 1) + "-" + timeStr.getDate() + " " + timeStr.getHours() + ":" + timeStr.getMinutes() + ":" + timeStr.getSeconds();
		return timeStr;
	},
});