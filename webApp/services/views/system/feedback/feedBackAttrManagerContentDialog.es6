App.Services.FeedBackAttrManagerContentDialog=Backbone.View.extend({
	tagName:'div',
	className:"feedBackDialog suggestView",
	events:{
		"click .listItem":"listItemDownLoad",
		"click #saveButton":"addFeedBack",
		"click .feedBackDl a":"deleteFeedBack"
	},
	render(){//渲染
		this.getFeedBackInfo(this.model);//获取建议反馈的信息
		return this;
	},
	listItemDownLoad(){//点击单个附件下载方法
		var target = $(event.target);
		var downloadid = target.data("downloadid");
		var downloadDataObj = {
			URLtype:"downloadsOneFeedBack",
			data: {
				attachmentId: downloadid,
			}
		}
		window.location.href = App.Comm.getUrlByType(downloadDataObj).url;
	},
	getFeedBackInfo(infoId){//获取建议反馈的信息
		var _this = this;
		App.Comm.ajax({
			URLtype:"getFeedBackInfo",
			data:JSON.stringify({
				id:infoId
			}),
			type:'POST',
			contentType:"application/json",
		}).done(function(res){
			if(res.code == 0){
				var dialogHtml = _.templateUrl("/services/tpls/system/feedback/feedBackAttrManagerDialog.html");
				_this.$el.html(dialogHtml(res.data.items[0]));
			}else{
				$.tip({message:res.message,type:'alarm'});
			}
		})
	},
	addFeedBack(event){//添加回复
		var target = $(event.target);
		var feedBackDesc = $("#feedBackDesc").val();
		var user= JSON.parse(localStorage.getItem("user"));
		if(feedBackDesc == ""){
			$.tip({message:'回复内容不能为空',type:'alarm'});
			return false
		}
		var addDataObj = {
			"adviceId": target.data("adviceid"),  
		    "content": feedBackDesc,
		    "replyId": user.userId,
		    "loginName":user.loginName,
		    "replyName": user.name
		}
		if(!target.hasClass("disabled")){
			App.Comm.ajax({
				URLtype:"addFeedBack",
				data:JSON.stringify(addDataObj),
				type:'POST',
				contentType:"application/json",
			}).done(function(res){
				if(res.code == 0){
					App.Services.SystemCollection.getFeedBackListHandle();
					App.Services.FeedBackDialog.close();
				}else{
					alert(res.message)
					$.tip({message:res.message,type:'alarm'});
				}
			})
		}
	},
	deleteFeedBack(event){//删除当前回复
		var target = $(event.target);
		var adviceId = target.data('adviceid');
		var replytId = target.data('id');
		App.Comm.ajax({
			URLtype: "deleteFeedBack",
			type: "DELETE",
			data:{
				adviceId:adviceId,
				replytId:replytId
			},
		}).done(function(res){
			if(res.code == 0){
				App.Services.FeedBackDialog.close();
				App.Services.SystemCollection.getFeedBackListHandle();
			}else{
				$.tip({message:res.message,type:'alarm'});
			}
		})
	}
});