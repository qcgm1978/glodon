/*
 * @require /bodyContent/js/model/model.js
 */
var App = App || {};
App.BodyContent.App=Backbone.View.extend({

    el:$("#contains"),

    template:_.templateUrl("/bodyContent/tpls/bodyContent.html",true),

    render:function(){
        var cookies = document.cookie;
        var cookieArr = cookies.split("; ");
        var cookieStr = "",
            cookiePos="",
            cookieName = "",
            cookieVal= "";
        for(let i=0,len=cookieArr.length;i<len;i++){
            cookieStr = cookieArr[i];
            cookiePos = cookieStr.indexOf('=');
            cookieName = cookieStr.substring(0,cookiePos);
            if(cookieName == "yesKnow"){
                cookieVal = cookieStr.substring(cookiePos+1);
            }
        }
        this.$el.html(this.template);
        if(cookieVal !== "true"){
            this.checkAuthorityHandle();//检查当前用户的权限方法
        }
        this.getMonthLinkDataFun();//获取本月更多链接的方法
        this.getFooterLinkDataFun();//获取公用底部链接的方法
        return this;
    },
    getFooterLinkDataFun:function(){//获取公用底部链接的方法
        var data = {
            URLtype: "getCommFooterLink",
        }
        App.Comm.ajax(data,function(response){
            if(response.code==0){
                var jhmkhId = $("#jhmkhId");
                var cbglxtId = $("#cbglxtId");
                var zlglxtId = $("#zlglxtId");
                var data = response.data;
                for(var i=0,len=data.length;i<len;i++){
                    if(data[i].name =="计划模块化"){
                        jhmkhId.attr("murl",data[i].url);
                        continue;
                    }else if(data[i].name =="成本管理系统"){
                        cbglxtId.attr("murl",data[i].url);
                        continue;
                    }else if(data[i].name =="质量管理系统"){
                        zlglxtId.attr("murl",data[i].url);
                        continue;
                    }
                }
            }else{
               // alert("获取公用底部链接"+data.message); /
            }
        });
    },
	getMonthLinkDataFun:function(){//获取本月更多链接的方法
		var _this = this;
		var pdata = {
            URLtype: "relLink",
            data:{
                type:4
            }
        };
        App.Comm.ajax(pdata,function(response){
        	if(response.code==0){
                $("#monthMore").attr("href",response.data[0].url+"&MonthType=2");
        		$("#monthMore").attr("data-morehref",response.data[0].url);
        	}else{
                // alert("获取本月更多链接"+data.message); 
            }
        });
	},
    checkAuthorityHandle:function(){//检查当前用户的权限方法
        var tipDialogBg = $('<div class="tipDialogBgBox" id="tipDialogBgBox"></div>');
        var tipDialogBox = $('<div class="tipDialogBox" id="tipDialogBox"></div>');
        var TipDialogV = new App.BodyContent.App.TipDialogV;
        $("body").append(tipDialogBg);
        $("body").append(tipDialogBox);
        $("#tipDialogBox").html(TipDialogV.render().el);
    }
});