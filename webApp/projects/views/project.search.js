App.Projects.searchView = Backbone.View.extend({

	tagName: 'div',

	className: 'projectSearch',

	formData:{
		 name:"",
		 projectType:"",
		 estateType: "",
         province: "",
         region: "",
         management: "",
         complete: "",
         open: "",
         openTimeStart: "", 
         openTimEnd: "",
         isBimControl: "",

	},
	events: {
		"click .seniorSearch": "seniorSearch",
		"click .btnSearch": "searchProject",
		"click .btnClear": "clearSearch",
		"keyup .txtSearch":"linkSearchWord",
		"keyup .moreSeachText":"linkSearchWord",
		"keydown .txtInput":"enterSearch"
	},

	template: _.templateUrl("/projects/tpls/project.search.html"),
	render: function() {
		var _this=this;
		this.$el.html(this.template());
		this.getProvinceSelectFun();//获取省市筛选的省列表
		//type=="my-backbone-fast" && this.$el.find(".fast").addClass('selected')|| this.$el.find(".msg").addClass('selected');
		this.formData={
			 name:"",
			 projectType:"",
			 estateType: "",
	         province: "",
	         region: "",
	         complete: "",
	         open: "",
	         openTimeStart: "", 
	         openTimEnd: ""
		};
		this.$(".pickProjectType").myDropDown({
			zIndex:99,
			click:function($item){
				_this.formData.subType=$item.attr('data-val');
			}
		});
		this.$(".pickCategory").myDropDown({
			zIndex:98,
			click:function($item){
				_this.formData.estateType=$item.attr('data-val');
			}
		});
		this.$(".projectStatus").myDropDown({
			zIndex:98,
			click:function($item){
				_this.formData.projectType=$item.attr('data-val');
			}
		});
		this.$(".pickManager").myDropDown({
			zIndex:97,
			click:function($item){
				_this.formData.region=encodeURI($item.attr('data-val'));
			}
		});
		this.$(".management").myDropDown({
			zIndex:97,
			click:function($item){
				_this.formData.isBimControl=encodeURI($item.attr('data-val'));
			}
		});
		this.$(".pickProvince").myDropDown({
			zIndex:96,
			click:function($item){
				_this.formData.province=encodeURI($item.attr('data-val'));
			}
		});
		this.$(".pickOpening").myDropDown({
			zIndex:95,
			click:function($item){
				if($item.html()=="是"){
					$("#showDateBox").css("display","inline-block");
				}else{
					$("#dateStar").val("");
					$("#dateEnd").val("");
					_this.formData.openTimeStart="";
					_this.formData.openTimEnd="";
					$('#dateStar').datetimepicker('setEndDate', "");
					$('#dateEnd').datetimepicker('setStartDate', "");
					$("#showDateBox").css("display","none");
				}
				_this.formData.open=$item.attr('data-val');
			}
		});

		this.$('.btnRadio').on('click',function(){
			_this.formData.complete=$(this).attr('data-val');
		})

		this.$('#dateStar').on('change',function(){
			_this.formData.openTimeStart=$(this).val();
			$('#dateEnd').datetimepicker('setStartDate', $(this).val());
		})
		this.$('#dateEnd').on('change',function(){
			_this.formData.openTimEnd=$(this).val();
			$('#dateStar').datetimepicker('setEndDate', $(this).val());
		})

		return this;
	},
	getProvinceSelectFun:function(){//获取省市筛选的省列表
		var pickProvince = this.$("#pickProvince");
		var language = App.Local.currentIsEn?"en-US":"zh-CN";
		var html = '<li class="myItem" data-val="">全部</li>';
		if(language === "fr-FR"){
			html = '<li class="myItem" data-val="">全部</li>';
		}else if(language === "en-US" || language === "en-GB"){
		   	html = '<li class="myItem" data-val="">All</li>';
		}else if(language === "zh-CN"){
		   	html = '<li class="myItem" data-val="">全部</li>';
		}
		
		pickProvince.html('');
		$.ajax({
		    type:"GET",
		    url:"platform/project/province",
		    success:function(response){
		       if(response.code == 0){
		       		if(response.data.length>0){
		       			for(var i=0,len=response.data.length-1;i<=len;i++){
		       				html+='<li class="myItem" data-val="'+response.data[i].province+'">'+response.data[i].province+'</li>'
		       			}
		       			pickProvince.append(html);
		       		}
	       		}
		    }
		});
	},
	clearSearch:function(){
		this.formData={
			 name:"",
			 projectType:"",
			 estateType: "",
	         province: "",
	         region: "",
	         complete: "",
	         open: "",
	         openTimeStart: "", 
	         openTimEnd: ""
		};
        var select = (App.Local.data['drawing-model'].Pst || '请选择');
        this.$(".pickProjectType .text").html(select);
		this.$(".pickCategory .text").html(select);
		this.$(".pickManager .text").html(select);
		this.$(".management .text").html(select);
		this.$(".pickProvince .text").html(select);
		this.$(".pickOpening .text").html(select);
		this.$(".projectStatus .text").html(select);

		this.$(".btnRadio").removeClass('selected');
		this.$('#dateStar').val('');
		this.$('#dateEnd').val('');
		this.$(".quickSearch .txtSearch").val('');
		this.$('.moreSeachText').val('');
		App.Projects.Settings.pageIndex=1;
		App.Projects.loadData(this.formData); 
	},

	enterSearch:function(e){
		if(e && e.keyCode=='13'){
			this.searchProject();
		}
	},

	//显示隐藏高级收缩
	seniorSearch: function() {

		var $advancedQueryConditions = this.$el.find(".advancedQueryConditions");
		if ($advancedQueryConditions.is(":hidden")) {
			this.$el.find(".quickSearch").hide();
			this.$el.find(".advancedQueryConditions").show();
			$("#projectModes").addClass("projectModesDown");
			//当前按钮添加事件
			this.$el.find(".seniorSearch").addClass('down');
		} else {
			this.$el.find(".quickSearch").show();
			this.$el.find(".advancedQueryConditions").hide();
			$("#projectModes").removeClass("projectModesDown");
			//当前按钮添加事件
			this.$el.find(".seniorSearch").removeClass('down');
		}
		this.$el.find(".seniorSearch i").toggleClass('icon-angle-down  icon-angle-up');

	},
	//搜索项目
	searchProject: function() {
		var seniorSearch = $(".seniorSearch"),

			searhcValue = "";
		if(!seniorSearch.hasClass("down")){
			searhcValue = $(".quickSearch input.txtSearch").val().trim();
		}else{
			searhcValue = $(".advancedQueryConditions input.moreSeachText").val().trim();
		}
		this.formData.name = encodeURI(searhcValue) || "";
		App.Projects.Settings.pageIndex=1;
		App.Projects.loadData(this.formData);
	},

	linkSearchWord:function(e){
		var target = $(e.target),
			txtSearch = $(".quickSearch input.txtSearch"),
			moreSeachText = $(".advancedQueryConditions input.moreSeachText");
		if(target.hasClass("txtSearch")){
			moreSeachText.val(target.val().trim());
		}else if(target.hasClass("moreSeachText")){
			txtSearch.val(target.val().trim());
		}
	}
});