App.AdminFeedBack.FeedBackContainerV = Backbone.View.extend({
	tagName:'div',
	className:'feedBackContainerBox',
	template:_.templateUrl("/feedBackAdmin/tpls/feedBackContainerV.html"),
	default:{
		startTime:'',
		endTime:'',
		feedBackState:'',
	},
	events:{
		"change #checkboxAll":"checkboxAllHandle",
		"change .checkboxCls":"checkboxOnlyHandle",
		"click .btnSearch":"btnSearchHandle",
		"click .feedBackContainerOutPut a":"btnOutPutHandle",
		"mouseenter .userInfoBox":"clearTimeoutHandle",
		"mouseleave .userInfoBox":"hideUserInfoHandle",
	},
	initialize() {//初始化
		this.listenTo(App.AdminFeedBack.FeedBackCollection, "add", this.addOne);
		this.listenTo(App.AdminFeedBack.FeedBackCollection, "reset", this.resetList);
	},
	render:function(){
		this.initHandle();//初始化页面
		this.getFeedBackDataHandle();//获取建议反馈数据
		return this;
	},
	clearTimeoutHandle(){
		clearTimeout(App.AdminFeedBack.default.outLive);
	},
	hideUserInfoHandle(){
		App.AdminFeedBack.default.outLive = setTimeout(function(){
			$("#userInfoBox").fadeOut();
			clearTimeout(App.AdminFeedBack.default.hovers);
		},200)
	},
	checkboxAllHandle(evt){//全选效果
		var target = $(evt.target);
		var addArr = [],
			flag = false,
			isAddDownLoad= false;
		var modelS = App.AdminFeedBack.default.models;//页面缓存存储的数据
		var modelC = App.AdminFeedBack.default.currentData;//当前页面缓存存储的数据
		var idsArr = App.AdminFeedBack.default.ids;//需要导出的数组
		if(target.prop("checked")){
			App.AdminFeedBack.default.checkedLen = modelC.length;
			for(let j=0,jLen=modelC.length;j<jLen;j++){
				addArr.push({
					id:modelC[j].id,
				})
			}
			for(let i=0,iLen=modelS.length;i<iLen;i++){
				if(modelS[i].pageIndex == App.AdminFeedBack.default.pageIndexFeedBack){
					flag = true;
					modelS[i].modelsArr = addArr;
					break;
				}
			}
			if(!flag){
				modelS.push({
					pageIndex:App.AdminFeedBack.default.pageIndexFeedBack,
					modelsArr:addArr
				})
			}
			for(let x=0,xLen=addArr.length;x<xLen;x++){//去掉重复的
				for(let y=0,yLen=idsArr.length;y<yLen;y++){
					if(addArr[x].id == idsArr[y]){
						idsArr.splice(y,1);
					}
				}
			}
			for(let x=0,xLen=addArr.length;x<xLen;x++){//添加最新的
				idsArr.push(addArr[x].id);
			}
		}else{
			App.AdminFeedBack.default.checkedLen = 0;
			for(let i=0,len=modelS.length;i<len;i++){
				if(modelS[i].pageIndex == App.AdminFeedBack.default.pageIndexFeedBack){
					for(let x=0,xLen=modelS[i].modelsArr.length;x<xLen;x++){
						for(let y=0,yLen=idsArr.length;y<yLen;y++){
							if(modelS[i].modelsArr[x].id == idsArr[y]){
								idsArr.splice(y,1);
							}
						}
					}
					modelS.splice(i,1);
					break;
				}
			}
		}
		$(".feedBackList").find("tr").each(function(arg,element){
			$(this).find("input:checkbox").prop("checked",target.prop("checked"));
		})
	},
	checkboxOnlyHandle(evt){//点击单个复选框的方法
		var target = $(evt.target);
		var modelSC = App.AdminFeedBack.default.currentData;//当前页存储的数据
		var modelS = App.AdminFeedBack.default.models;//页面缓存存储的数据
		var flag = false,
			addFlag=false,
			addIds = false;
		var idsArr = App.AdminFeedBack.default.ids;//需要导出的数组
		if(target.prop("checked")){
			App.AdminFeedBack.default.checkedLen++;
			for(let i=0,iLen=modelS.length;i<iLen;i++){
				if(modelS[i].pageIndex && modelS[i].pageIndex == App.AdminFeedBack.default.pageIndexFeedBack){
					addFlag = true;
					for(let j=0,jLen=modelS[i].modelsArr.length;j<jLen;j++){
						if(modelS[i].modelsArr[j].id == target.data("id")){
							flag = true;
							break;
						}
					}
					if(!flag){
						modelS[i].modelsArr.push({
							id:target.data("id")
						})
					}
					break;
				}
			}
			if(!addFlag){
				modelS.push({
					pageIndex:App.AdminFeedBack.default.pageIndexFeedBack,
					modelsArr:[{
						id:target.data("id")
					}]
				})
			}
			if(idsArr.length>0){
				for(let x=0,xLen=idsArr.length;x<xLen;x++){
					if(idsArr[x] == target.data("id")){
						addIds = true;
						break;
					}
				}
				if(!addIds){
					idsArr.push(target.data("id"));
				}
			}else{
				idsArr.push(target.data("id"));
			}
		}else{
			App.AdminFeedBack.default.checkedLen--;
			if(idsArr.length>0){
				for(let x=0,xLen=idsArr.length;x<xLen;x++){
					if(idsArr[x] == target.data("id")){
						idsArr.splice(x,1);
						break;
					}
				}
			}
			if(App.AdminFeedBack.default.checkedLen == 0){
				for(let i=0,len=modelS.length;i<len;i++){
					if(modelS[i].pageIndex == App.AdminFeedBack.default.pageIndexFeedBack){
						modelS.splice(i,1);
						break;
					}
				}
				return;
			}
			for(let i=0,iLen=modelS.length;i<iLen;i++){
				if(modelS[i].pageIndex && modelS[i].pageIndex == App.AdminFeedBack.default.pageIndexFeedBack){
					for(let j=0,jLen=modelS[i].modelsArr.length;j<jLen;j++){
						if(modelS[i].modelsArr[j].id == target.data("id")){
							modelS[i].modelsArr.splice(j,1);
							break;
						}
					}
				}
			}
		}
		if(modelSC.length == App.AdminFeedBack.default.checkedLen){
			$("#checkboxAll").prop("checked",true);
		}else{
			$("#checkboxAll").prop("checked",false);
		}
	},
	initHandle:function(){//初始化页面
		var _this = this;
		var startTime = new Date().setMonth(new Date().getMonth()-1);
		var sTimeStr = new Date(startTime);
		var eTimeStr = new Date();
		var startTimeStr = sTimeStr.getFullYear() + "-" + (sTimeStr.getMonth() + 1) + "-" + sTimeStr.getDate();
		var endTimeStr = eTimeStr.getFullYear() + "-" + (eTimeStr.getMonth() + 1) + "-" + eTimeStr.getDate();
		this.default.startTime = startTimeStr;
		this.default.endTime = endTimeStr;
		this.$el.html(this.template(this.default));
		this.view2 = new App.Profile();
        this.$('.insert-view-here').append(this.view2.render().el);
		this.$(".pickProjectType").myDropDown({
		  zIndex: 99,
		  click: function($item) {
		    $(this).find(".text").css("color","#666");
		    _this.default.moduleType = $item.attr('data-val')||"";
		  }
		});
		this.$(".feedBackState").myDropDown({
		  zIndex: 99,
		  click: function($item) {
		    $(this).find(".text").css("color","#666");
		    if($item.attr('data-val') == "all"){
		    	_this.default.feedBackState = "";
		    	return;
		    }
		    _this.default.feedBackState = $item.attr('data-val')=="true"?true:false;
		  }
		});
		this.bindTimeFun();//绑定开始和结束时间的点击事件
	},
	bindTimeFun:function(){//绑定开始和结束时间的点击事件
		var _this = this;
		this.$('#dateStar').datetimepicker({
		  language: App.Local.getTimeLang(),
		  autoclose: true,
		  format: 'yyyy-mm-dd',
		  minView: 'month'
		}).on("changeDate",function(ev){
			var _dateStr=new Date(ev.date.getTime()).format('yyyy-MM-dd');
			_this.$('#dateEnd').datetimepicker('setStartDate',_dateStr);
		});
		this.$('#dateEnd').datetimepicker({
		  language: App.Local.getTimeLang(),
		  autoclose: true,
		  format: 'yyyy-mm-dd',
		  minView: 'month'
		}).on("changeDate",function(ev){
			var _dateStr=new Date(ev.date.getTime()).format('yyyy-MM-dd');
			_this.$('#dateStar').datetimepicker('setEndDate',_dateStr);
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
	getFeedBackDataHandle:function(){//获取建议反馈数据
		App.AdminFeedBack.getFeedBackDataHandle();//获取数据
	},
	addOne(model){//每一条数据 进行处理
		var data = model.toJSON();
		var ListDomV = new App.AdminFeedBack.FeedBackContainerListDomV({model:data});
		this.$(".feedBackList").append(ListDomV.render().el);
		this.bindScroll();
	},
	resetList(){//重置加载
		this.$(".feedBackList").html('<span class="loading">' +
            (App.Local.data['system']['l-g'] || '正在加载，请稍候……') +
        '</span>');
	},
	bindScroll:function(){//绑定滚动条
		this.$el.find("div.scrollBox").mCustomScrollbar({
			theme: 'minimal-dark',
			axis: 'y',
			keyboard: {
				enable: true
			},
			scrollInertia: 0
		}); 
	},
	btnSearchHandle(){//点击搜索功能
		var keyName = $("#keyName");
		var feedBackPeople = $("#feedBackPeople");
		var keyNameVal = keyName.val().trim();
		var feedBackPeopleVal = feedBackPeople.val().trim();
		var feedBackState =  this.default.feedBackState;
		var feedBackType = this.default.moduleType;
		var searchData = {
			title:keyNameVal,
			adviceType:feedBackType,
			createName:feedBackPeopleVal,
			opTimeStart:this.default.startTime,
			opTimeEnd:this.default.endTime,
			haveReply:feedBackState,
			pageIndex:1
		}
		App.AdminFeedBack.default.models = [];
		App.AdminFeedBack.default.ids = [];
		App.AdminFeedBack.default.isSearch = true;
		App.AdminFeedBack.getFeedBackDataHandle(searchData);//获取数据
	},
	btnOutPutHandle(){//导出接口方法
		var keyName = $("#keyName");
		var feedBackPeople = $("#feedBackPeople");
		var keyNameVal = keyName.val().trim();
		var feedBackPeopleVal = feedBackPeople.val().trim();
		var feedBackState =  this.default.feedBackState;
		var feedBackType = this.default.moduleType;
		var outPutData = {
			ids:App.AdminFeedBack.default.ids||"",
			title:App.AdminFeedBack.default.isSearch?keyNameVal||"":"",
			adviceType:App.AdminFeedBack.default.isSearch?feedBackType||"":"",
			createName:App.AdminFeedBack.default.isSearch?feedBackPeopleVal||"":"",
			opTimeStart:App.AdminFeedBack.default.isSearch?this.default.startTime||"":"",
			opTimeEnd:App.AdminFeedBack.default.isSearch?this.default.endTime||"":"",
			haveReply:App.AdminFeedBack.default.isSearch?feedBackState:"",
		}
		outPutData.ids = App.AdminFeedBack.default.ids.join(',');
		App.Comm.Settings.downloadDatas = outPutData;
		if(App.AdminFeedBack.default.ids&&App.AdminFeedBack.default.ids.length==0){
			$.confirm('是否导出全部建议反馈？', function() {
				App.Comm.initFormHandle();
			});
		}else{
			App.Comm.initFormHandle();
		}
	},
})