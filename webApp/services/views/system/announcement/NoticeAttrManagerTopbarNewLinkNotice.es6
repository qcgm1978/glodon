App.Services.NoticeAttrManagerTopbarNewLinkNotice = Backbone.View.extend({
	tagName:'div',
	className:"newLinkNoticeDialog",
	template:_.templateUrl("/services/tpls/system/notice/newLinkNotice.html"),
	events:{
		"click #publishLinkBtn":"publicAjaxHandle",
		"click #saveLinkBtn":"publicAjaxHandle",
		"click #cancelLinkBtn":"cancelBtn",
	},
	default:{
		flag:true,
		edit:false
	},
	render(parmers){
		var defaultData = {
			title:null,
			href:null,
			publishTime:null,
			id:null,
			department:null,
			type:null,
			content:null
		};
		var data = $.extend({},defaultData,parmers);
		if(parmers){
			this.default.edit=true;
		}else{
			this.default.edit=false;
		}
		this.$el.html(this.template(data));
		this.$('#noticeTime').datetimepicker({
		  language: App.Local.getTimeLang(),
		  autoclose: true,
		  format: 'yyyy-mm-dd',
		  minView: 'month'
		});
		this.$(".dateBox .iconCal").on("click",function() {
		    $(this).next().focus();
		});
		return this;
	},
	cancelBtn(){//取消按钮的方法
		App.Services.SystemCollection.addLinkNoticeDialog.close();
	},
	publicAjaxHandle(event){//公用的提交方法
		var _this = this;
		var target = $(event.target);
		var saveOrPublish = target.attr("id");
		var noticeTitleVal = $("#noticeTitle").val();
		var noticeLinkVal = $("#noticeLink").val();
		var noticeTimeVal = $("#noticeTime").val();
		var match = /^((https|http|ftp|rtsp|mms)?:\/\/)?([\w\-]+(\.[\w\-]+)*\/)*[\w\-]+(\.[\w\-]+)*\/?(\?([\w\-\.,@?^=%&:\/~\+#]*)+)?/;
		var dataObj = {},
			linkUrl="",
			status=(saveOrPublish=="publishLinkBtn")?1:3;
		if(noticeTitleVal==""){
			alert("公告标题不能为空！");
			return;
		}
		if(noticeLinkVal==""){
			alert("公告链接地址不能为空！");
			return;
		}else{
			if(!match.test(noticeLinkVal)){
				alert("公告链接地址不合法！");
				return;
			}
		}
		if(noticeTimeVal==""){
			alert("发布时间不能为空！");
			return;
		}
		dataObj.title = noticeTitleVal;
		dataObj.href = noticeLinkVal;
		dataObj.publishTime = noticeTimeVal;
		dataObj.status = status;
		if(this.default.edit){
			var hideVal = $("#hideVal");
			dataObj.content =hideVal.attr("data-editcontent");
			dataObj.department =hideVal.attr("data-editdepartment");
			dataObj.type = hideVal.attr("data-edittype");
			dataObj.id = hideVal.attr("data-editid");
			dataObj.orderType = 0;
		}else{
			dataObj.content = "";
			dataObj.department = "";
			dataObj.type = 1;
		}
		var linkUrl = this.default.edit?"editNotice":"addLinkNotice";
		if(!target.hasClass("disable")){
			if(this.default.flag){
				this.default.flag=false;
				App.Comm.ajax({
					URLtype:linkUrl,
					data:JSON.stringify(dataObj),
					type:this.default.edit?"PUT":"POST",
					contentType:"application/json",
				}).done(function(res){
					if(res.code==0){
						App.Services.SystemCollection.addLinkNoticeDialog.close();
						App.Services.SystemCollection.getListHandle();
						_this.default.flag=true;
						$(".buttonBox > button:gt(1)").addClass("disable");
					}else{
						alert(res.message)
					}
				})
			}
		}
	}
})