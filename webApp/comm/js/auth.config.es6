//权限配置
App.Comm.AuthConfig = {
	//项目 
	Project: {
		//设计
		DesignTab: {
			tab: '<li data-type="design" class="item design" ><span-i data-i18n="data.drawing-model.Design">设计</span-i><i class="line"></i></li>',
			prop: ' <li data-type="poperties" class="item" data-i18n="data.model-view.Ps">属性</li>',
			collision: '<li data-type="collision" class="item selected">碰撞</li>',
			check: '<li data-type="verifi" class="item">设计检查</li>'
		},
		//计划
		PlanTab: {
			tab: '<li data-type="plan" class="item plan" data-i18n="[prepend]data.drawing-model.Plan">计划<i class="line"></i></li>',
			modularization: '<li data-type="model" class="item selected" data-i18n="data.drawing-model.Module">' +
            '模块化' +
            '</li>',
			simulation: '<li data-type="analog" class="item" data-i18n="data.drawing-model.Simulate>' +
             '模拟' +
            '</li>',
			follow: '<li data-type="publicity" class="item" data-i18n="data.drawing-model.FUp">关注</li>',
			proof: ' <li data-type="inspection" class="item" data-i18n="data.drawing-model.Check1">校验</li>',
			prop: '<li data-type="poperties" class="item" data-i18n="data.model-view.Ps">属性</li>'
		},
		//成本
		CostTab: {
			tab: '<li data-type="cost" class="item cost" data-i18n="[prepend]data.drawing-model.Cost"><i class="line"></i></li>',
			list: '<li data-type="reference" class="item selected">' +
            (App.Local.data['drawing-model'].Bill || '清单') +
            '</li>',
			change: '<li data-type="change" class="item">' +
            (App.Local.data['drawing-model'].Variation || '变更') +
            '</li>',
			proof: '<li data-type="verification" class="item" data-i18n="data.drawing-model.Check1">校验</li>',
			prop: '<li data-type="poperties" class="item" data-i18n="data.model-view.Ps">属性</li>'
		},
		//质量
		QualityTab: {
			tab: '<li data-type="quality" class="item quality" data-i18n="[prepend]data.system-module.Quality"><i class="line"></i></li>',
			material: '<li data-type="materialequipment" class="item selected">材料设备</li>',
			processAcceptanc: '<li data-type="processacceptance" class="item">' +
            (App.Local.data['drawing-model'].PAe1 || '过程验收') +
            '</li> ',
			openAcceptance: '<li data-type="openingacceptance" class="item">' +
            (App.Local.data['drawing-model'].PIe || '开业验收') +
            '</li>',
			latentDanger: '<li data-type="concerns" class="item">' +
            (App.Local.data['drawing-model'].Hazards || '隐患') +
            '</li>',
			prop: '<li data-type="poperties" class="item" data-i18n="data.model-view.Ps">属性</li>'
		}

	},

	//服务
	Service:{
		//项目
		project:{
			//项目基本信息
			baseInfo : {
				tab : '<li data-type="base" class="item ">'+ App.Local.data['system-module'].BIn +'<!--项目基本信息--></li>'
			},
			//项目映射规则
			mappingRule : {
				tab : '<li data-type="mappingRule" class="item">项目映射规则</li>'
			},
			//设计信息
			designInfo : {
				tab :  '<li data-type="floor" class="item">楼栋信息</li>'
							+'<li data-type="basehole" class="item">基坑</li>'
							+'<li data-type="section" class="item">剖面</li>'
							+'<li data-type="pile" class="item">桩</li>'
			}
		},
		//系统管理
		system : {
			//业务类别管理
			bizCategary : {
				tab : '<li data-type="category" class="item">'+ App.Local.data['system-module'].ACt +'<!--业务类别管理--></li>'
			},
			//业务流程管理
			workflow : {
				tab : '<li data-type="flow"     class="item ">'+ App.Local.data['system-module'].BPM +'<!--业务流程管理--></li>'

			},
			//扩展属性管理
			extendedAttribute : {
				tab : '<li data-type="extend"   class="item ">'+ App.Local.data['system-module'].EPt +'<!--扩展属性管理--></li>'

			},
			//公告属性管理
			announcementAttribute : {
				tab : '<li data-type="announcement"   class="item ">'+ App.Local.data['system-module'].AMt2 +'<!--公告管理--></li>'

			},
			//反馈属性管理
			feedbackAttribute : {
				tab : '<li data-type="feedback"   class="item ">'+ App.Local.data['system-module'].FMt +'<!--反馈管理--></li>'

			},
			//资源属性管理
			resourceAttribute : {
				tab : '<li data-type="resource"   class="item ">'+ App.Local.data['system-module'].RMt +'<!--资源管理--></li>'

			}
		}
	},

	//映射规则 模块化/质量标准  管理
	resource:{
		mappingRule:{
			module : '<li class="sele modularization">' +
            (App.Local.getTranslation('drawing-model.Module')||'模块化') +
            '</li>',
			quality : '<li class="sele quality">质量标准</li>',
			mappingRuleTemplateEdit:'<span class="edit">' +
            (App.Local.data['drawing-model'].Edit || "编辑") +
            '</span><span class="delete">删除</span>'
		}
	}

	 

};