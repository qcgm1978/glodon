App.Services.ProjectCollection = {

	methods:{
		projectType(v){
			v=v||4;
			// var _m=['','综合体','文化旅游','境外','其他'];
			var _m=['--','全标','类标','非标'];
			return _m[Number(v)]
		},
		projectMode(v){
			v=v||0;
			var _m=['--', '创新模式', '直投', '开发','合作'];
			return _m[Number(v)]
		},
		keyValue(key,name,array){
			var result=array.filter(function(item){
				return item.id==key;
			})
			if(result.length){
				return result[0][name];
			}
			return '';
		},
		zIndex:(function(){
			var i=10;
			return function(){
				return i++;
			}
		}()),

		//直接监听.txtInput  change事件 根据class判断校验类型
		//已知类型：intInput floatInput rateInput
		dataVal(e){
			var _$dom=$(e.currentTarget),
				zeroReg=/^0{1,1}$/,
				intReg=/^[1-9]\d*$/,
				floatReg=/^[1-9]\d*\.\d*|0\.\d*[1-9]\d*$/,
				val=_$dom.val(),
				r=false;
			if(_$dom.hasClass('floatInput')){
				r=zeroReg.test(val)||intReg.test(val)||floatReg.test(val);
			}else if(_$dom.hasClass('intInput')){
				r=zeroReg.test(val)||intReg.test(val);
			}else if(_$dom.hasClass('rateInput')){
				if(Number(val)<=100 && Number(val)>=0){
					r=true;
				}else{
					r=false;
				}
			}else{
				return;
			}
			if(r){
				_$dom.removeClass('errorInput');
			}else{
				_$dom.addClass('errorInput');
			}
		}
	},

	
	datas:{
	
		intensity:['6度','7度','8度','9度'],//抗震设防烈度
		seiGrade:['一级','二级','三级','四级'],//抗震等级
		doorFireLevel:['A','B1'],//防火等级
		installType:['无','铝板幕墙','玻璃幕墙','涂料','GRC板','石材幕墙'],
		orgType:['剪力墙结构','钢结构','框架剪力墙结构','框架结构','劲性混凝土结构','框筒结构'],
		baseholeLv:['一级','二级','三级'],
		bracingType:['支护桩','锚索','土钉墙','其他'],
		pitData:[]
	
	},

	//分类列表
	ProjectSlideBarCollection: new(Backbone.Collection.extend({
		model: Backbone.Model.extend({
			defaults: function() {
				return {
					title: ""
				}
			}
		}),
		urlType: "fetchManageProjects",
		parse(response) {
			if (response.code == 0) {
                 return response.data;
            }
		}
	})),
	
	ProjectBaseInfoCollection: new(Backbone.Collection.extend({
		model: Backbone.Model.extend({
			defaults: function() {
				return {
					title: ""
				}
			}
		}),
		urlType: "fetchProjectBaseInfo",
		parse(response) {
			if (response.code == 0) {
				var data=response.data;
				data.logo=data.logoUrl ? data.logoUrl['middle']:"";
				data.logo=data.logo+'?t='+new Date().getTime();
                return data;
            }
		}
	})),

	//映射规则
	ProjectMappingRuleCollection: new(Backbone.Collection.extend({
		model: Backbone.Model.extend({
			defaults: function() {
				return {
					title: ""
				}
			}
		}),
		urlType: "fetchServicesProjectMappingRule",
		parse(response) {
			if (response.code == 0 && response.data) {
				return response.data;
			}
		}
	})),
	//映射规则模板
	ProjectMappingRuleModelCollection: new(Backbone.Collection.extend({
		model: Backbone.Model.extend({
			defaults: function() {
				return {
					title: ""
				}
			}
		}),
		urlType: "fetchArtifactsTemplate",
		parse(response) {
			if (response.code == 0 && response.data) {
				return response.data;
			}
		}
	})),

	
	ProjecMappingCollection: new(Backbone.Collection.extend({
		model: Backbone.Model.extend({
			defaults: function() {
				return {
					title: ""
				}
			}
		}),
		urlType: "projectCodeMapping",
		parse(response) {
			if (response.code == 0) {
				var data=response.data;
				data.logo=data.logoUrl ? data.logoUrl['middle']:"";
				data.logo=data.logo+'?t='+new Date().getTime();
                return data;
            }
		}
	})),
	
	ProjecDetailBaseHoleCollection: new(Backbone.Collection.extend({
		model: Backbone.Model.extend({
			defaults: function() {
				return {
					title: ""
				}
			}
		}),
		urlType: "fetchProjectDetailBaseholeList",
		parse(response) {
			if (response.code == 0) {
				return  response.data.pits;
            }
		}
	})),
	
	ProjecDetailFloorCollection: new(Backbone.Collection.extend({
		model: Backbone.Model.extend({
			defaults: function() {
				return {
					title: ""
				}
			}
		}),
		urlType: "fetchProjectDetailFloorList",
		parse(response) {
			if (response.code == 0) {
				return  response.data.buildings;
            }
		}
	})),
	
	ProjecDetailSectionCollection: new(Backbone.Collection.extend({
		model: Backbone.Model.extend({
			defaults: function() {
				return {
					title: ""
				}
			}
		}),
		urlType: "fetchProjectDetailSectionList",
		parse(response) {
			if (response.code == 0) {
				return  response.data.profiles;
            }
		}
	})),
	
	ProjecDetailPileCollection: new(Backbone.Collection.extend({
		model: Backbone.Model.extend({
			defaults: function() {
				return {
					title: ""
				}
			}
		}),
		urlType: "fetchProjectDetailPileList",
		parse(response) {
			if (response.code == 0) {
				this.data=response.data;
				this.data.isCreate=false;
				if(this.data.soilNails.length==0){
					this.data.isCreate=true;
					this.data.soilNails=[
				      {
				        "id": 829748817994080,
				        "projectId": 825572711509152,
				        "pileCode": "PILE-0001",
				        "pileName": "人工挖孔桩",
				        "pileNumber": 0
				      },
				      {
				        "id": 829748818280800,
				        "projectId": 825572711509152,
				        "pileCode": "PILE-0002",
				        "pileName": "钻孔灌注桩",
				        "pileNumber": 0
				      },
				      {
				        "id": 829748818534752,
				        "projectId": 825572711509152,
				        "pileCode": "PILE-0003",
				        "pileName": "钻孔灌注桩(后注浆)",
				        "pileNumber": 0
				      },
				      {
				        "id": 829748818796896,
				        "projectId": 825572711509152,
				        "pileCode": "PILE-0004",
				        "pileName": "管桩",
				        "pileNumber": 0
				      }
				    ]
				}
				return  response.data.soilNails ;
            }
		}
	}))
 

}