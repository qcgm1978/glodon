/*
 * @require /bodyContent/js/app.js
 */
var App = App || {};
App.BodyContent.App.TipDialogV = Backbone.View.extend({
	className: 'divBox',
    template:_.templateUrl("/bodyContent/tpls/bodyContent.tipDialog.html",true),
    defaults:{

    },
    render:function(){
        this.$el.html(this.template);
        this.appendLoading();//添加加载中效果
        this.getTipDataHandle();//获取提示信息的方法
        this.initHandle();//初始化事件
        this.defaults.language = App.Local.currentIsEn?"en-US":"zh-CN";
        var yesKnow  = this.$el.find(".yesKnow ");
        var nowToComplete = this.$el.find(".nowToComplete");
        var yesKnowTxt = "我知道了";
        var nowToCompleteTxt = "立刻完成培训";
        if(this.defaults.language === "fr-FR"){
            nowToCompleteTxt = "立刻完成培训";
            yesKnowTxt = "我知道了";
        }else if(this.defaults.language === "en-US" || this.defaults.language === "en-GB"){
            nowToCompleteTxt = "Finish Now";
            yesKnowTxt = "Got it";
        }else if(this.defaults.language === "zh-CN"){
            nowToCompleteTxt = "立刻完成培训";
            yesKnowTxt = "我知道了";
        }
        nowToComplete.html(nowToCompleteTxt);
        yesKnow.html(yesKnowTxt);
        return this;
    },
    appendLoading:function(){//添加加载中效果
        var divDom = $('<div class="pageLoading"></div>');
        $("body").append(divDom);
    },
    initHandle:function(){//初始化事件
    	var _this = this;
    	this.$el.find("a.yesKnow").on("click",function(){
            _this.closeDialog();//关闭弹出框
            if(window.localStorage){
                var doMain=(/^(\d+\.?)+$/.test(location.host) ? window.location.host : (window.location.host.substring(window.location.host.indexOf("."))))
                document.cookie = "yesKnow=true;domain=" + App.Comm.doMain+";"
            }
        })
    },
    closeDialog:function(){//关闭弹出框
    	$("#tipDialogBgBox").hide().remove();
    	$("#tipDialogBox").hide().remove();
    },
    initLearnStatus:function(currentTime,learnStatus){//初始化学习状态的方法
        var html = "";
        var _this = this;
        var dialogMessage = this.$el.find("#dialogMessage");
        $(".pageLoading").remove();
        if(learnStatus){
            var obj = {
                beforestationstatus:learnStatus.beforestationstatus,//是否通过上岗培训
                bsexamless:learnStatus.bsexamless,//上岗考试未通过课程数
                bsexamtotal:learnStatus.bsexamtotal,
                bslessonless:learnStatus.bslessonless,//上岗未通过课程数
                bslessontotal:learnStatus.bslessontotal,
                enddate:learnStatus.enddate,//最晚结束日期
                endday:learnStatus.endday,
                message:learnStatus.message,
                mobileurl:learnStatus.mobileurl,
                onstationstatus:learnStatus.onstationstatus,//是否通过在岗培训
                osexamless:learnStatus.osexamless,//在岗考试未通过
                osexamtotal:learnStatus.osexamtotal,
                oslessonless:learnStatus.oslessonless,//在岗课程未通过数 
                oslessontotal:learnStatus.oslessontotal,
                pturl:learnStatus.pturl,
                status:learnStatus.status
            }
            var endDateObj = new Date(obj.enddate);
            var endDate = endDateObj.getTime();
            var getFullYear = endDateObj.getFullYear();
            var getMonth = (endDateObj.getMonth()+1)>=10?endDateObj.getMonth()+1:"0"+(endDateObj.getMonth()+1);
            var getDay = endDateObj.getDate()>=10?endDateObj.getDate():"0"+endDateObj.getDate();
            var endDateStr = getFullYear+"年"+getMonth+"月"+getDay+"日";
            if(this.defaults.language === "fr-FR"){
                endDateStr = getFullYear+"年"+getMonth+"月"+getDay+"日";
            }else if(this.defaults.language === "en-US" || this.defaults.language === "en-GB"){
                var enddateS = new Date(getFullYear,getMonth-1,getDay);
                endDateStr = enddateS.toDateString();
                endDateStr = endDateStr.substring(endDateStr.indexOf(" ")+1);
                var dataArr = endDateStr.split(" ");
                endDateStr = dataArr[0]+" "+dataArr[1]+", "+dataArr[2];
            }else if(this.defaults.language === "zh-CN"){
                endDateStr = getFullYear+"年"+getMonth+"月"+getDay+"日";
            }
            if(obj.status==0){
                if(obj.beforestationstatus == 0){
                    if(obj.bslessonless != 0 && obj.bsexamless!=0){//上岗培训课程跟考试均未完成提示：
                        html = '您的上岗培训还差<i>'+obj.bslessonless+'</i>门课程和上岗考试就可以完成啦！请您尽快完成剩余的学习任务哦！'
                        if(this.defaults.language === "fr-FR"){
                            html = '您的上岗培训还差<i>'+obj.bslessonless+'</i>门课程和上岗考试就可以完成啦！请您尽快完成剩余的学习任务哦！'
                        }else if(this.defaults.language === "en-US" || this.defaults.language === "en-GB"){
                            html = '<i>'+obj.bslessonless+'</i> courses and exams left to finish your induction training. Please finish your remaining tasks as soon as possible.'
                        }else if(this.defaults.language === "zh-CN"){
                           html = '您的上岗培训还差<i>'+obj.bslessonless+'</i>门课程和上岗考试就可以完成啦！请您尽快完成剩余的学习任务哦！'
                        }
                    }else if(obj.bslessonless != 0 && obj.bsexamless==0){//上岗培训只有课程未完成时提示
                        html = '您的上岗培训还差<i>'+obj.bslessonless+'</i>门课程就可以完成啦！请您尽快完成剩余的学习任务哦！'
                        if(this.defaults.language === "fr-FR"){
                            html = '您的上岗培训还差<i>'+obj.bslessonless+'</i>门课程就可以完成啦！请您尽快完成剩余的学习任务哦！'
                        }else if(this.defaults.language === "en-US" || this.defaults.language === "en-GB"){
                            html = '<i>'+obj.bslessonless+'</i> courses left to finish your induction training. Please finish your remaining tasks as soon as possible.'
                        }else if(this.defaults.language === "zh-CN"){
                           html = '您的上岗培训还差<i>'+obj.bslessonless+'</i>门课程就可以完成啦！请您尽快完成剩余的学习任务哦！'
                        }
                    }else if(obj.bslessonless == 0 && obj.bsexamless!=0){//上岗培训只有考试未完成时提示
                        html = '您的上岗培训还差上岗考试就可以完成啦！请您尽快完成剩余的学习任务哦！'
                        if(this.defaults.language === "fr-FR"){
                            html = '您的上岗培训还差上岗考试就可以完成啦！请您尽快完成剩余的学习任务哦！'
                        }else if(this.defaults.language === "en-US" || this.defaults.language === "en-GB"){
                            html = 'Please take exams to finish your induction training. Please finish your remaining tasks as soon as possible.'
                        }else if(this.defaults.language === "zh-CN"){
                           html = '您的上岗培训还差上岗考试就可以完成啦！请您尽快完成剩余的学习任务哦！'
                        }
                    }
                }else{
                    if(obj.oslessonless != 0 && obj.osexamless!=0){//在岗培训课程跟考试均未完成提示
                        html = '您的在岗培训还差<i>'+obj.oslessonless+'</i>门课程和在岗考试就可以完成啦！请最晚于<i id="endStr">'+endDateStr+'</i>之前完成剩余的学习任务，加油哦！';
                        if(this.defaults.language === "fr-FR"){
                            html = '您的在岗培训还差<i>'+obj.oslessonless+'</i>门课程和在岗考试就可以完成啦！请最晚于<i id="endStr">'+endDateStr+'</i>之前完成剩余的学习任务，加油哦！';
                        }else if(this.defaults.language === "en-US" || this.defaults.language === "en-GB"){
                            html = '<i>'+obj.oslessonless+'</i> ' +
                                (obj.oslessonless>1?'courses':'course') +
                                ' and ' +
                                (obj.oslessonless>1?'exams':'exam') +
                                ' left to finish your induction training. Please finish your remaining tasks before <i id="endStr">'+endDateStr+'</i>. Keep it up!'
                        }else if(this.defaults.language === "zh-CN"){
                           html = '您的在岗培训还差<i>'+obj.oslessonless+'</i>门课程和在岗考试就可以完成啦！请最晚于<i id="endStr">'+endDateStr+'</i>之前完成剩余的学习任务，加油哦！';
                        }
                    }else if(obj.oslessonless != 0 && obj.osexamless==0){//在岗培训只有课程未完成时提示
                        html = '您的在岗培训还差<i>'+obj.oslessonless+'</i>门课程就可以完成啦！请最晚于<i id="endStr">'+endDateStr+'</i>之前完成剩余的学习任务，加油哦！';
                        if(this.defaults.language === "fr-FR"){
                            html = '您的在岗培训还差<i>'+obj.oslessonless+'</i>门课程就可以完成啦！请最晚于<i id="endStr">'+endDateStr+'</i>之前完成剩余的学习任务，加油哦！';
                        }else if(this.defaults.language === "en-US" || this.defaults.language === "en-GB"){
                            html = '<i>'+obj.oslessonless+'</i> ' +
                                (obj.oslessonless>1?'courses':'course') +
                                ' left to finish your induction training. Please finish your remaining tasks before <i id="endStr">'+endDateStr+'</i>. Keep it up!'
                        }else if(this.defaults.language === "zh-CN"){
                           html = '您的在岗培训还差<i>'+obj.oslessonless+'</i>门课程就可以完成啦！请最晚于<i id="endStr">'+endDateStr+'</i>之前完成剩余的学习任务，加油哦！';
                        }
                    }else if(obj.oslessonless == 0 && obj.osexamless!=0){//在岗培训只有考试未完成时提示
                        html = '您的在岗培训还差在岗考试就可以完成啦！请最晚于<i id="endStr">'+endDateStr+'</i>之前完成剩余的学习任务，加油哦！';
                        if(this.defaults.language === "fr-FR"){
                            html = '您的在岗培训还差在岗考试就可以完成啦！请最晚于<i id="endStr">'+endDateStr+'</i>之前完成剩余的学习任务，加油哦！';
                        }else if(this.defaults.language === "en-US" || this.defaults.language === "en-GB"){
                            html = 'Please take exams to finish your induction training. Please finish your remaining tasks before <i id="endStr">'+endDateStr+'</i>. Keep it up!'
                        }else if(this.defaults.language === "zh-CN"){
                           html = '您的在岗培训还差在岗考试就可以完成啦！请最晚于<i id="endStr">'+endDateStr+'</i>之前完成剩余的学习任务，加油哦！';
                        }
                    }
                }
                dialogMessage.html(html);
                _this.$el.find("a.yesKnow").hide().removeClass("canLookBtn");
                _this.$el.find("a.nowToComplete").attr("href",obj.pturl);
               $("#tipDialogBox").show();
            }else if(obj.status==1){
                if(obj.onstationstatus == "0"){
                    if(localStorage.getItem("yesKnow")){
                        _this.closeDialog();
                        return;
                    }
                    if(obj.oslessonless != 0 && obj.osexamless!=0){//在岗培训课程跟考试均未完成提示
                        html = '您的在岗培训还差<i>'+obj.oslessonless+'</i>门课程和在岗考试就可以完成啦！请最晚于<i id="endStr">'+endDateStr+'</i>之前完成剩余的学习任务，加油哦！';
                        if(this.defaults.language === "fr-FR"){
                            html = '您的在岗培训还差<i>'+obj.oslessonless+'</i>门课程和在岗考试就可以完成啦！请最晚于<i id="endStr">'+endDateStr+'</i>之前完成剩余的学习任务，加油哦！';
                        }else if(this.defaults.language === "en-US" || this.defaults.language === "en-GB"){
                            html = '<i>'+obj.oslessonless+'</i> courses and exams left to finish your induction training. Please finish your remaining tasks before <i id="endStr">'+endDateStr+'</i>. Keep it up!'
                        }else if(this.defaults.language === "zh-CN"){
                           html = '您的在岗培训还差<i>'+obj.oslessonless+'</i>门课程和在岗考试就可以完成啦！请最晚于<i id="endStr">'+endDateStr+'</i>之前完成剩余的学习任务，加油哦！';
                        }
                    }else if(obj.oslessonless != 0 && obj.osexamless==0){//在岗培训只有课程未完成时提示
                        html = '您的在岗培训还差<i>'+obj.oslessonless+'</i>门课程就可以完成啦！请最晚于<i id="endStr">'+endDateStr+'</i>之前完成剩余的学习任务，加油哦！';
                        if(this.defaults.language === "fr-FR"){
                            html = '您的在岗培训还差<i>'+obj.oslessonless+'</i>门课程就可以完成啦！请最晚于<i id="endStr">'+endDateStr+'</i>之前完成剩余的学习任务，加油哦！';
                        }else if(this.defaults.language === "en-US" || this.defaults.language === "en-GB"){
                            html = '<i>'+obj.oslessonless+'</i> ' +
                                (obj.oslessonless>1?'courses':'course') +
                                ' left to finish your induction training. Please finish your remaining tasks before <i id="endStr">'+endDateStr+'</i>. Keep it up!'
                        }else if(this.defaults.language === "zh-CN"){
                           html = '您的在岗培训还差<i>'+obj.oslessonless+'</i>门课程就可以完成啦！请最晚于<i id="endStr">'+endDateStr+'</i>之前完成剩余的学习任务，加油哦！';
                        }
                    }else if(obj.oslessonless == 0 && obj.osexamless!=0){//在岗培训只有考试未完成时提示
                        html = '您的在岗培训还差在岗考试就可以完成啦！请最晚于<i id="endStr">'+endDateStr+'</i>之前完成剩余的学习任务，加油哦！';
                        if(this.defaults.language === "fr-FR"){
                            html = '您的在岗培训还差在岗考试就可以完成啦！请最晚于<i id="endStr">'+endDateStr+'</i>之前完成剩余的学习任务，加油哦！';
                        }else if(this.defaults.language === "en-US" || this.defaults.language === "en-GB"){
                            html = 'Please take exams to finish your induction training. Please finish your remaining tasks before <i id="endStr">'+endDateStr+'</i>. Keep it up!'
                        }else if(this.defaults.language === "zh-CN"){
                           html = '您的在岗培训还差在岗考试就可以完成啦！请最晚于<i id="endStr">'+endDateStr+'</i>之前完成剩余的学习任务，加油哦！';
                        }
                    }
                    dialogMessage.html(html);
                    _this.$el.find("a.nowToComplete").attr("href",obj.pturl);
                    $("#tipDialogBgBox").show();
                    $("#tipDialogBox").show();
                }else{
                    _this.closeDialog();
                }
            }else if(obj.status==2){
                var yesKnowTxt = "我知道了";
                html = '您已经被取消万达BIM项目的任职资格，不能操作平台！';
                if(this.defaults.language === "fr-FR"){
                    html = '您已经被取消万达BIM项目的任职资格，不能操作平台！';
                    yesKnowTxt = "我知道了";
                }else if(this.defaults.language === "en-US" || this.defaults.language === "en-GB"){
                    html = 'You are disqualified from Wanda BIM projects cannot use this platform.';
                    yesKnowTxt = "Got it";
                }else if(this.defaults.language === "zh-CN"){
                   html = '您已经被取消万达BIM项目的任职资格，不能操作平台！';
                   yesKnowTxt = "我知道了";
                }
                this.$el.find("a.yesKnow").hide().removeClass("canLookBtn");
                this.$el.find("a.nowToComplete").attr("target","_self").attr("href","#/logout").html(yesKnowTxt);
                dialogMessage.html(html);
                $("#tipDialogBgBox").show();
                $("#tipDialogBox").show();
            }else if(obj.status==3){
                _this.closeDialog();
            }
        }else{
            $("#tipDialogBgBox").hide().remove();
        }
    },
    getTipDataHandle:function(){
        var _this = this;
        $.ajax({
            url: '/platform/user/current'
        }).done(function(data) {
            if(data.code==0){
                _this.initLearnStatus(data.data.currentTime,data.data.learnStatus);//初始化学习状态的方法
            }else {
                // window.location.href="#/logout";
                // alert(data.message);
            }
        })
    }
});