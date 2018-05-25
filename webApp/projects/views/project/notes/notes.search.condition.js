

App.Project.NotesSearchCondition = Backbone.View.extend({
	tagName: "div",
	className: "searchConditionBox",
	template:_.templateUrl("/projects/tpls/project/notes/project.search.condition.html"),
	default:{
		versionIds:[],
		searchKeyText:'',
		searchVersionId:"",
		notesDateStar:'',
		notesDateEnd:''
	},
	events:{
		"click .clearStartTime":"clearStartTime",
		"click .clearEndTime":"clearEndTime",
	},
	render: function() { 
		this.getVersionIdHandle();//获取版本id列表
		this.initDateHandle();//初始化页面上的数据
		App.Project.NotesCollection.defaults.content = "";
		return this;
	},
	clearStartTime:function(){
		this.$('#notesDateStar').val('');
		App.Project.NotesCollection.defaults.opTimeStart = "";
	},
	clearEndTime:function(){
		this.$('#notesDateEnd').val('');
		App.Project.NotesCollection.defaults.opTimeEnd = "";
	},
	initDateHandle:function(){//初始化页面上的数据
		var _this = this;
		var startDate = new Date(),
			endDate = new Date(),
			formatEndDate = endDate.getFullYear()+'-'+(endDate.getMonth()+1>=10?endDate.getMonth()+1:"0"+(endDate.getMonth()+1))+'-'+(endDate.getDate()>=10?endDate.getDate():"0"+endDate.getDate()),
			y,m,d,formatStartDate;
		startDate.setMonth(startDate.getMonth()-1);
        y = startDate.getFullYear();
        m = startDate.getMonth()+1>=10?startDate.getMonth()+1:"0"+(startDate.getMonth()+1);
        d = startDate.getDate()>=10?startDate.getDate():"0"+startDate.getDate();
        formatStartDate = y+'-'+m+'-'+d;
        this.default.notesDateStar = formatStartDate;//渲染页面的开始时间
        this.default.notesDateEnd = formatEndDate;//渲染页面的结束时间
	},
	bindDateHandle:function(){//给时间输入框绑定事件插件
		var _this = this;
        this.$('#notesDateStar').datetimepicker({			
        	language: App.Local.getTimeLang(),
			autoclose: true,
			format: 'yyyy-mm-dd',
			minView: 'month',
			endDate:this.default.notesDateEnd
		}).on("changeDate",function(ev){
			var _dateStr=new Date(ev.date.getTime()).format('yyyy-MM-dd');
			_this.$('#notesDateEnd').datetimepicker('setStartDate',_dateStr);
			App.Project.NotesCollection.defaults.opTimeStart = _dateStr;
		});
		this.$('#notesDateEnd').datetimepicker({
			language: App.Local.getTimeLang(),
			autoclose: true,
			format: 'yyyy-mm-dd',
			minView: 'month',
			startDate:this.default.notesDateStar
		}).on("changeDate",function(ev){
			var _dateStr=new Date(ev.date.getTime()).format('yyyy-MM-dd');
			_this.$('#notesDateStar').datetimepicker('setEndDate',_dateStr);
			App.Project.NotesCollection.defaults.opTimeEnd = _dateStr;
		});
		this.$(".dateBox .iconCal").on("click",function() {
		    $(this).next().focus();
		});
	},
	getVersionIdHandle:function(){//获取版本id列表
		var _this = this;
		var _data = {
				URLtype: "fetchStandardVersion",
				data: {
					projectId: App.Project.Settings.projectId,
				}
			};
		App.Comm.ajax(_data, function(data) {
			if (data.code == 0) {
				_this.default.versionIds = data.data;
				_this.initHtmlHandle();//初始化页面结构
			} else {
				$.tip({
					message:data.message,
					type:'alarm'
				});
			}
		})
	},
	initHtmlHandle:function(){//初始化页面结构
		var _this = this;
		this.$el.html(this.template({default:this.default}));
		this.bindKeyHandle();//给关键词输入框绑定事件
		this.bindDateHandle();//给时间输入框绑定事件插件
		this.bindSearchBtnHandle();//给搜索按钮绑定点击事件
		this.$(".versionName").myDropDown({
		  zIndex: 99,
		  click: function($item) {
		    $(this).find(".text").attr("title",$item.text().replace(/\n/g,'').replace(/\s+/g,' ')).css("color","#666");
		    App.Project.NotesCollection.defaults.projectVersionId = $item.attr('data-versionId');
		  }
		});
	},
	bindKeyHandle:function(){//给关键词输入框绑定事件
		var _this = this;
		var keyDome = this.$(".keyTextInputBox input");
		keyDome.on("keyup",function(event){
			var target = $(event.target);
			var targetVal = target.val().trim();
			App.Project.NotesCollection.defaults.content = targetVal?targetVal:"";
		})
	},
	bindSearchBtnHandle:function(){//给搜索按钮绑定点击事件
		var _this = this;
		var searchBtn = this.$(".searchBoxS button");
		searchBtn.on("click",function(){
			_this.loadListHandle();//通过搜索获取批注列表的方法
		})
	},
	loadListHandle:function(){//通过搜索获取批注列表的方法
		App.Project.NotesCollection.defaults.pageIndexNotes = 1;
		App.Project.NotesCollection.resetUrlHandle();// 重置地址栏地址 单不刷新页面
		App.Project.NotesCollection.getNotesListHandle();//共用了获取批注列表的方法
	}
})