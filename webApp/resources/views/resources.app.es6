/**
 * @require /resources/collection/index.es6
 */


App.Resources.App = Backbone.View.extend({

	el: $("#contains"),

	template: _.templateUrl("/resources/tpls/resources.app.html", true),

	render() {

		this.$el.html(this.template);
		this.getQualityLinkHandle();//获取质检标准链接地址的方法
		var $resoucesNav = $(".resoucesNavBox .resoucesNav");
		if (!App.AuthObj.lib) {
			//$resoucesNav.remove();
		} else {
			var Auth = App.AuthObj.lib;
			//族库
			if (!Auth.family && !App.Global.User.hasFamilies) {
				$resoucesNav.find(".famLibs").closest("li").remove();
			}
			//质量标准库
			// if (!Auth.quality) {
			// 	$resoucesNav.find(".zjbz_icon").closest("li").remove();
			// 	$resoucesNav.find(".qualityStandardLibs").closest("li").remove();
			// }
			//清单库
			if (!Auth.list) {
				$resoucesNav.find(".manifestLibs").closest("li").remove();
			}
			//标准模型库
			if (!Auth.model && !App.Global.User.hasModels) {
				$resoucesNav.find(".standardLibs").closest("li").remove();
			}
			//映射规则管理
			if (!Auth.mappingRuleTemplate) {
				$resoucesNav.find(".artifactsMapRule").closest("li").remove();
			}
		}


		return this;
	},
	getQualityLinkHandle(){//获取质检标准链接地址的方法
		var data = {
            URLtype: "getQualityLink",
        }
        App.Comm.ajax(data,function(response){
            if(response.code==0){
                var zjbz_link = $("#zjbz_link");//我的培训
                var data = response.data;
                for(var i=0,len=data.length;i<len;i++){
                    if(data[i].name =="质检标准"){
                        zjbz_link.attr("href",data[i].url);
                        continue;
                    }
                }
            }
        });
	}
});