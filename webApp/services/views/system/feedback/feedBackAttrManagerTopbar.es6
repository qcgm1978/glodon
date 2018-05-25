/**
 * @require /services/views/system/feedback/feedback.es6
 */
App.Services.FeedBackAttrManagerTopbar=Backbone.View.extend({
	tagName:'div',
	className:"feedBackTopbarSearchBox",
	template:_.templateUrl("/services/tpls/system/feedback/feedBackAttrManagerTopbar.html"),
	default:{
		startTime:'',
		endTime:''
	},
	events:{
		"click .btnSearch":"btnSearchHandle"
	},
	render(){
		var startTime = new Date().setMonth(new Date().getMonth()-1);
		var sTimeStr = new Date(startTime);
		var eTimeStr = new Date();
		var startTimeStr = sTimeStr.getFullYear() + "-" + (sTimeStr.getMonth() + 1) + "-" + sTimeStr.getDate();
		var endTimeStr = eTimeStr.getFullYear() + "-" + (eTimeStr.getMonth() + 1) + "-" + eTimeStr.getDate();
		this.default.startTime = startTimeStr;
		this.default.endTime = endTimeStr;
		this.$el.html(this.template(this.default));
		this.bindTimeFun();
		return this;
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
	btnSearchHandle(){//点击搜索功能
		var keyName = $("#keyName");
		var feedBackPeople = $("#feedBackPeople");
		var keyNameVal = keyName.val().trim();
		var feedBackPeopleVal = feedBackPeople.val().trim();
		var feedBackState =  $('#feedBackState option:selected').data('feedbackstate');
		var searchData = {
			title:keyNameVal,
			createName:feedBackPeopleVal,
			opTimeStart:this.default.startTime,
			opTimeEnd:this.default.endTime,
			haveReply:feedBackState,
			pageIndex:1
		}
	    App.Services.SystemCollection.getFeedBackListHandle(searchData);
	}
})