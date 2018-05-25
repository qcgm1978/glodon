App.Service = {
	init : function(arge){
		App.defaults.SearchHeightVar = undefined;
		App.resetScrollData();//重置滚动的数据
		this.initHandle();//初始化服务页面id="QuartetRegistration"
		App.topCloseBtn(); 
		App.getNewsNumHandle(function(data){//获取未读消息方法 
		    var noReadNumMyNews = $("#noReadNumMyNews");
		    var noReadNum = $("#noReadNum");
		    if(data !== 0){
		    	noReadNumMyNews.html(data).css("display","block");
		    	noReadNum.html(data).css("display","block");
		    }else{
		    	noReadNumMyNews.css("display","none");
		    	noReadNum.css("display","none");
		    }
		}); 
	},
	initHandle:function(){//初始化服务页面
		App.TitleBar.setTitle("万达筑云项目管理平台");//设置顶部标题
		App.TitleBar.hidePopMenuBtn();//隐藏顶部三个点按钮
		App.TitleBar.hideHomeBtn();//隐藏顶部返回首页
		App.TitleBar.showClose();// 显示顶部关闭按钮
		this.getQuartetRegistrationUrlHandle();//获取四方人力注册地址
		if(!$("#footerBox > div").eq(4).hasClass("footer-box-select")){//底部导航的定位
			$("#footerBox > div").eq(4).click();
		}
	},
	getQuartetRegistrationUrlHandle:function(){//获取四方人力注册地址
		App.Comm.ajax({
			url: App.Restful.urls.getQuartetRegistrationUrl,
			success:function(data){
				var resutl = $.parseJSON(data);
				if(resutl.code == 0){
					if(resutl.data.length>0){
						$("#QuartetRegistration").attr("href",resutl.data[0].url);
					}
				}else{
					alert(data.message);
				}
			}
		});
	}
}