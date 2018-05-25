window.Global = {
	DemoEnv : function(type){
	/*
	演示环境
	write by wuweiwei
	*/
		/*
		type = "hideMenu"
		type = "projectDocBtn"
		type = "designLink"
		被调用:
		E:\JavaProject\bim_static\webApp\projects\collections\Project.es6 - loaddata()
		bodyContent:function(){}
		*/
		var $popMenu , popMenuLen , $a;
		if(App.Comm.getCookie("isDemoEnv")!="yes")
		{
			return;
		}

		$("#topBar .navHeader .flow").hide();
		$("#topBar .navHeader .bodyConMenu").hide();
		$("#topBar .navHeader .resources").hide();
		$("#topBar .navHeader .services").hide();
		
		try
		{
			$("#downLoadModelProject")[0].className = "disable";
		}catch(e){;}
		
		try
		{
			$popMenu = $(".onlineNav ul li");
			$popMenu.each(function(index){
				if(index!=0)
				{
					this.style.display = "none";
				}
			});
		}catch(e){;}


		/*隐藏头像登录等信息*/
		var $topBar = $("#topBar");
		$topBar.find("img").css("display","none");
		var $userinfo = $(".userinfo");
		$userinfo.find("img").css("display","none");
		$userinfo.find(".info").css("width","200px");
		$("#btn_modifyPassword").css("display","none");
		$("#uiPosition").html("");
		$("#uiPartment").html("演示用户组");
		
		if(type=="projectDocBtn")
		{
			$("#contains .opBox span").each(function(){
				$(this).addClass("disable");
			});

		}
		if(type=="modelTab")
		{
			$("#contains ul.projectTab li").each(function(){
				if($(this).data("type")!="design")
				{
					$(this).css("display","none");
				}
			});
		}

		if(type=="designLink")
		{
			$a = $("#contains .rightProperty .designProperties .attrClassBox a");
			$a.each(function(index){
				$(this).removeAttr("href");
			});
		}
	}
};
