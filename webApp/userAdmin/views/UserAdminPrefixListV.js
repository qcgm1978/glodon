App.userAdmin.UserAdminPrefixListV = Backbone.View.extend({
	tagName:'div',
	className:'userAdminListClass',
	default:{
		pageIndex:1
	},
	template:_.templateUrl("/userAdmin/tpls/userAdminPrefixListV.html"),
	events: {
 		"click .viewUserEdite": "editViewUserFun",
 		"click .viewUserDelete": "deleteViewUserFun",
 	},
	render:function(){
		this.$el.html("<div class='loading'>加载中，请稍后...</div>");
		this.getViewUserPrefixListFun();//第一次进入 获取用户前缀列表的方法
		return this;
	},
	initScroll:function(){
		$(".userAdminListClass").mCustomScrollbar({
             set_height: "100%",
             theme: 'minimal-dark',
             axis: 'y',
             keyboard: {
                 enable: true
             },
             scrollInertia: 0
         });
	},
	getViewUserPrefixListFun:function(){//获取浏览用户前缀列表的方法
		var _this = this;
	    var _data = {
	    	pageIndex:this.default.pageIndex,
	    	pageItemCount:App.Comm.Settings.pageItemCount
	    }
	    App.userAdmin.getPrefixsDataC.fetch({
			data: _data,
			success: function(collection, response, options) {
				if(response.code == 0){
					_this.$el.html(_this.template({state:response.data}));
					$(".loading").css("display","none");
					_this.initScroll();
				}
			}
		})
	},
	deleteViewUserFun:function(evt){//删除浏览用户前缀的列表的方法
		var _this =  this;
		var target = $(evt.target);
		var deleteId = target.data("prefixname");
		var deleteDialogEle = new App.userAdmin.DeleteUserAdminPrefixListDialogV;
		var deleteDialogEleDom = deleteDialogEle.render(deleteId).el;
		App.userAdmin.UserAdminPrefixListV.Dialog = new App.Comm.modules.Dialog({
		    title: "删除用户前缀",
		    width: 280,
		    height: 100,
		    isConfirm: false,
		    isAlert: false,
		    message: deleteDialogEleDom
		})
	},
	editViewUserFun:function(evt){//编辑用户前缀列表
		var target = $(evt.target);
		var EditDialogEle = new App.userAdmin.EditUserAdminPrefixListDialogV;
		var prefixName = target.data("prefixname");
		var EditDialogEleDom = EditDialogEle.render(prefixName).el;
		//初始化窗口
		App.userAdmin.UserAdminPrefixListV.EditDialog = new App.Comm.modules.Dialog({
		    title:"编辑用户前缀",
		    width: 380,
	    	height: 100,
		    isConfirm:false,
		    isAlert:false,
		    closeCallback:function(){},
		    message:EditDialogEleDom
		})
	}
})