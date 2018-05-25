var AppRoute = Backbone.Router.extend({
    initialize: function () {
        //App.Local.iniI18n(eval(sessionStorage.isEnglish));
        //this.bind("all", this.setI18n);
    },
    execute: function (callback, args, name) {
        // debugger;
        if ($('[title="首页"]').length && eval(App.Local.getCookie('isEnglish'))) {
            App.Local.iniI18n(eval(App.Local.getCookie('isEnglish')));
        }
        if (name !== 'logout') {
            App.Statistics.sendStatistics({
                type: 'pv',
                "lang": App.Local.getCurrentIsEn() ? "en" : 'cn'
            });
        }
        name === 'project' ? $('body').addClass('overflowY'):$('body').removeClass('overflowY');
        if (callback) callback.apply(this, args);
        App.Local.setI18n();
        App.Comm.updateCookies();
    },
    routes: {
        '': 'bodyContent',
        'todo': 'todo',
        'notice': 'notice',
        'inbox': 'inbox',
        'projects': 'projects',
        'projects/:id/:versionId': 'project',
        'projects/:id/:versionId/:viewPintId': 'projectViewPoint',
        'flow': 'flow',
        'flow/:pageName': 'flowDetail',
        // 'flow/:pageName': 'flowDetail',
        'resources': 'resources',
        'resources/:type': 'resource',
        'resources/:type/:optionType': 'resourceMapping',
        'resources/:type/:projectId/:versionId': 'resourceModel',
        'console': 'console',
        'console/:type/:step': 'console',
        'console1': 'console1',
        'console1/:type/:step': 'console1',
        'services': 'services',
        'services/:type': 'services',
        'services/system/notice/:noticeId': 'previewNotice',
        'services/:optionType/:projectModelId': 'servicesMappingRule',
        'list/:id': 'list',
        'bodyContent': 'bodyContent',
        'logout': 'logout',
        "post/detail/:id": 'postDetail',
        'suggest': 'suggest',
        'userAdmin': 'userAdmin',
        'backStage': 'backStage',
        'backStage/setPermissions': 'setPermissions',
        'BIMperformance': 'BIMperformances',
        /*BIM性能测试,非用户使用*/
        'BIMperformance/:id/:versionId': 'BIMperformance',
        /*BIM性能测试,非用户使用*/
        'meeting': 'meeting',
        'adminFeedBack': 'adminFeedBack' //建议反馈管理页面
    },
    //start 建议反馈管理页面
    adminFeedBack: function () {
        if (this.reset() == false) {
            return;
        }
        _.require('/static/dist/feedBackAdmin/feedBackAdmin.css');
        _.require('/static/dist/feedBackAdmin/feedBackAdmin.js');
        App.AdminFeedBack.init();
        $("#pageLoading").hide();
    },
    //end 建议反馈管理页面
    //start 后台管理页面的路由方法
    backStage: function () {
        if (this.reset() == false) {
            return;
        }
        _.require('/static/dist/backStage/backStage.css');
        _.require('/static/dist/backStage/backStage.js');
        App.backStage.init();
        $("#pageLoading").hide();
    },
    setPermissions: function () {
        if (this.reset() == false) {
            return;
        }
        _.require('/static/dist/backStage/backStage.css');
        _.require('/static/dist/backStage/backStage.js');
        App.backStage.setPermissionsInit();
        $("#pageLoading").hide();
    },
    //start 添加浏览用户的路由方法
    userAdmin: function () {
        if (this.reset() == false) {
            return;
        }
        _.require('/static/dist/userAdmin/userAdmin.css');
        _.require('/static/dist/userAdmin/userAdmin.js');
        App.userAdmin.init();
        $("#pageLoading").hide();
    },
    //end 添加浏览用户的路由方法
    //首页主体展示
    bodyContent: function () {
        if (App.Comm.getCookie("isDemoEnv") == "yes") {
            window.Global.DemoEnv();
            return;
        }
        if (this.reset() == false) {
            return;
        }
        var userType = App.Comm.getCookie("userType");
        if (userType != undefined) {
            if (userType == "innerNet") {
                $("#btn_modifyPassword").attr("href", "http://sso.wanda.cn/passwordupdate.aspx");
            } else {
                $("#btn_modifyPassword").attr("href", "https://vendor.wanda.cn/sso/ChangePassword.aspx");
            }
        }
        $("#topBar .navHeader").find(".item").removeClass("selected").end().find(".bodyConMenu").addClass('selected');
        _.require('/static/dist/bodyContent/bodyContent.css');
        _.require('/static/dist/bodyContent/bodyContent.js');
        App.BodyContent.control.init();
        $("#pageLoading").hide();
        getUrlVideoFun();
    },
    logout: function () {
        App.Comm.clearCookie();
        App.Comm.setCookie('IS_OWNER_LOGIN', '1');
        localStorage.removeItem("user");
        //ie
        App.Comm.dispatchIE('/?commType=loginOut');
        window.location.href = "/login.html?t=" + (+new Date());
    },
    //待办
    todo: function () {
        if (this.reset() == false) {
            return;
        }
        $("#topBar .navHeader").find(".item").removeClass("selected").end().find(".todo").addClass('selected');
        //加载css js
        _.require('/static/dist/todo/todo.css');
        _.require('/static/dist/todo/todo.js');
        App.Todo.init();
    },
    //公告
    notice: function () {
        if (this.reset() == false) {
            return;
        }
        //加载css js
        _.require('/static/dist/notice/notice.css');
        _.require('/static/dist/notice/notice.js');
        App.Notice.init();
    },
    //消息中心
    inbox: function () {
        if (this.reset() == false) {
            return;
        }
        //加载css js
        _.require('/static/dist/imbox/imbox.css');
        _.require('/static/dist/imbox/imbox.js');
        App.INBox.init();
        window.Global.DemoEnv();
    },
    suggest: function () {
        if (this.reset() == false) {
            return;
        }
        _.require('/static/dist/suggest/suggest.css');
        _.require('/static/dist/suggest/suggest.js');
        App.Suggest.init();
    },
    postDetail: function (id) {
        _.require('/static/dist/bodyContent/bodyContent.css');
        _.require('/static/dist/bodyContent/bodyContent.js');
        App.BodyContent.control.post(id);
    },
    //项目
    projects: function () {
        if (this.reset() == false) {
            return;
        }
        //销毁上传
        $("#topBar .navHeader").find(".item").removeClass("selected").end().find(".projects").addClass('selected');
        //加载css js
        _.require('/static/dist/projects/projects.css');
        _.require('/static/dist/projects/projects.js');
        App.Projects.init();
        window.Global.DemoEnv();
    },
    //单个项目
    project: function (id, versionId) {
        App.currentProject = App.currentProject || {};
        App.currentProject.projectId = id;
        App.currentProject.projectVersionId = versionId;
        if (this.reset() == false) {
            return;
        }
        $("#topBar .navHeader").find(".item").removeClass("selected").end().find(".projects").addClass('selected');
        _.require('/static/dist/projects/projects.css');
        _.require('/static/dist/projects/projects.js');
        App.Project.Settings = $.extend({}, App.Project.Defaults);
        App.Project.Settings.projectId = id;
        App.Project.Settings.versionId = versionId;
        App.Project.init();
        window.Global.DemoEnv("projectDocBtn");
    },
    //直接转到视点
    projectViewPoint: function (id, versionId, viewPintId) {
        App.currentProject = App.currentProject || {};
        App.currentProject.projectId = id;
        App.currentProject.projectVersionId = versionId;
        if (this.reset() == false) {
            return;
        }
        $("#topBar .navHeader").find(".item").removeClass("selected").end().find(".projects").addClass('selected');
        _.require('/static/dist/projects/projects.css');
        _.require('/static/dist/projects/projects.js');
        App.Project.Settings = $.extend({}, App.Project.Defaults);
        App.Project.Settings.projectId = id;
        App.Project.Settings.versionId = versionId;
        App.Project.Settings.viewPintId = viewPintId;
        App.Project.init();
    },
    //流程
    flow: function () {
        if (this.reset() == false) {
            return;
        }
        //业务流程的栏目 执行的js
        $("#topBar .navHeader").find(".item").removeClass("selected").end().find(".flow").addClass('selected');
        _.require('/static/dist/flow/flow.css');
        _.require('/static/dist/flow/flow.js');
        App.Flow.Controller.webcomeCtr();
    },
    flowDetail: function (pageName) {
        if (this.reset() == false) {
            return;
        }
        //业务流程的栏目 执行的js
        $("#topBar .navHeader").find(".item").removeClass("selected").end().find(".flow").addClass('selected');
        _.require('/static/dist/flow/flow.css');
        _.require('/static/dist/flow/flow.js');
        if (pageName == "bimPage") {
            App.Flow.Controller.type = "BIM总发包";
            App.Flow.Controller.init();
        } else if (pageName == "keyPage") {
            App.Flow.Controller.type = "总包交钥匙";
            App.Flow.Controller.keyPageInit();
        } else if (pageName == "renovationProject") {
            App.Flow.Controller.type = "改造项目";
            App.Flow.Controller.renovationProjectInit();
        } else {
            App.Flow.Controller.flowPageName(pageName);
        }
    },
    //资源库
    resources: function () {
        if (this.reset() == false) {
            return;
        }
        //如果用户已经是登录状态了 就执行下面的代码
        $("#topBar .navHeader").find(".item").removeClass("selected").end().find(".resources").addClass('selected');
        _.require('/static/dist/resources/resources.css');
        _.require('/static/dist/resources/resources.js');
        App.Resources.init();
        $("#pageLoading").hide();
        //$("#contains").html("resources");
        window.Global.DemoEnv();
    },
    //单个项目
    resource: function (type) {
        if (this.reset() == false) {
            return;
        }
        $("#topBar .navHeader").find(".item").removeClass("selected").end().find(".resources").addClass('selected');
        _.require('/static/dist/resources/resources.css');
        _.require('/static/dist/resources/resources.js');
        App.ResourcesNav.Settings.type = type;
        App.ResourcesNav.init();
        window.Global.DemoEnv();
    },
    //项目映射
    resourceMapping: function (type, optionType) {
        if (this.reset() == false) {
            return;
        }
        $("#topBar .navHeader").find(".item").removeClass("selected").end().find(".resources").addClass('selected');
        _.require('/static/dist/resources/resources.css');
        _.require('/static/dist/resources/resources.js');
        App.ResourcesNav.Settings.type = type;
        App.ResourcesNav.Settings.optionType = optionType;
        App.ResourceArtifacts.Status.type = 1;
        new App.ResourcesNav.App().render();
        App.ResourceArtifacts.resetPreRule();
        $("#pageLoading").hide();
        window.Global.DemoEnv();
    },
    resourceModel: function (type, projectId, versionId) {
        App.currentProject = App.currentProject || {};
        App.currentProject.projectId = projectId;
        App.currentProject.projectVersionId = versionId;
        if (this.reset() == false) {
            return;
        }
        $("#topBar .navHeader").find(".item").removeClass("selected").end().find(".resources").addClass('selected');
        _.require('/static/dist/resources/resources.css');
        _.require('/static/dist/resources/resources.js');
        App.ResourcesNav.Settings.type = App.ResourceModel.Settings.type = type;
        App.ResourceModel.Settings.CurrentVersion = {};
        App.ResourceModel.Settings.projectId = projectId;
        App.ResourceModel.Settings.versionId = versionId;
        App.ResourceModel.init();
        window.Global.DemoEnv();
    },
    //貌似改掉了
    console: function (type, step) {
        if (this.reset() == false) {
            return;
        }
        //销毁上传
        _.require('/static/dist/console/console.css');
        _.require('/static/dist/console/console.js');
        $("#topBar .navHeader").find(".item").removeClass("selected").end().find(".console").addClass('selected');
        App.Console.Settings.type = type;
        App.Console.Settings.step = step;
        App.Console.init();
        $("#pageLoading").hide();
    },
    //by zzx
    console1: function (type, step) {
        if (this.reset() == false) {
            return;
        }
        //销毁上传
        _.require('/static/dist/console1/console.css');
        _.require('/static/dist/console1/console.js');
        $("#topBar .navHeader").find(".item").removeClass("selected").end().find(".console").addClass('selected');
        App.Console.Settings.type = type;
        App.Console.Settings.step = step;
        App.Console.init();
        $("#pageLoading").hide();
    },
    //服务-项目管理-项目映射规则
    servicesMappingRule: function (type, optionType, projectModelId) {
        if (this.reset() == false) {
            return;
        }
        $("#topBar .navHeader").find(".item").removeClass("selected").end().find(".services").addClass('selected');
        _.require('/static/dist/resources/resources.css');
        _.require('/static/dist/resources/resources.js');
        App.ResourcesNav.Settings.type = type;
        App.ResourcesNav.Settings.optionType = optionType;
        App.ResourceArtifacts.Status.projectId = optionType;
        App.ResourceArtifacts.Status.type = 2;
        new App.ResourcesNav.App().render();
        App.ResourceArtifacts.resetPreRule();
        $("#pageLoading").hide();
    },
    services: function (type, tab) {
        if (this.reset() == false) {
            return;
        }
        $("#pageLoading").hide();
        $("#topBar .navHeader").find(".item").removeClass("selected").end().find(".services").addClass('selected');
        _.require('/static/dist/services/services.css');
        _.require('/static/dist/services/services.js');
        $("#bottomBar").hide(); //隐藏脚部
        if (type == 'rule') {
            App.Services.ruleInit();
        } else {
            App.Services.init(type, tab);
        }
        window.Global.DemoEnv();
    },
    previewNotice: function (noticeId) { //点击公告预览之后打开新页面
        if (this.reset() == false) {
            return;
        }
        $("#pageLoading").hide();
        $("#topBar .navHeader").find(".item").removeClass("selected").end().find(".services").addClass('selected');
        _.require('/static/dist/services/services.css');
        _.require('/static/dist/services/services.js');
        $("#bottomBar").hide(); //隐藏脚部
        App.Services.noticeInit(noticeId);
    },
    initAuth: function (user) {
        $('.linkNavItem').off('click').on('click', function () {
            if (user.outer) {
                alert('没有操作权限')
            } else {
                var url = $(this).attr('murl');
                window.open(url, '_blank');
            }
        })
        var isKeyUser = user.isKeyUser || false;
        var _AuthObj = App.AuthObj || {};
        var Auth = _AuthObj.service || {};
        if (!Auth.app) {
            $('#auth-app').remove();
        }
        if (!Auth.auth && !isKeyUser) {
            $('#auth-auth').remove();
        }
        if (!Auth.log) {
            $('#auth-log').remove();
        }
        if (!Auth.sys) {
            $('#auth-sys').remove();
        }
        if (!Auth.project) {
            $('#auth-project').remove();
        }
    },
    /*视频会议*/
    meeting: function () {
        if (location.host === '127.0.0.1') {
            return;
        }
        _.require('/static/dist/meeting/meeting.js');
        var viewer = new App.Meeting.Page();
        $(document.getElementsByTagName("body")[0]).html(viewer.render().el);
    },
    /*测试BIM性能 begin*/
    
    BIMperformances: function () {
        //销毁上传
        $("#topBar .navHeader").find(".item").removeClass("selected").end().find(".projects").addClass('selected');
        //加载css js
        _.require('/static/dist/BIMperformance/libsH5.js');
        _.require('/static/dist/BIMperformance/projects.css');
        _.require('/static/dist/BIMperformance/projects.js');
        App.Projects.init();
        document.title = "=BIM模型性能测试=";
    },
    BIMperformance: function (id, versionId) {
        if (this.reset() == false) {
            //return;
        }
        $("#topBar .navHeader").find(".item").removeClass("selected").end().find(".projects").addClass('selected');
        _.require('/static/dist/BIMperformance/libsH5.js');
        _.require('/static/dist/BIMperformance/projects.css');
        _.require('/static/dist/BIMperformance/projects.js');
        App.Project.Settings = $.extend({}, App.Project.Defaults);
        App.Project.Settings.projectId = id;
        App.Project.Settings.versionId = versionId;
        App.Project.init();
        document.title = "=BIM模型性能测试=";
    },
    /* end */
    
    
    
    //重置数据
    reset: function () {
        $("#commentDragBox").css("top", "80%");
        if (App.Comm.isIEModel()) {
            return false;
        } else {
            if (App.Project && App.Project.Settings && App.Project.Settings.Viewer) {
                App.Project.Settings.Viewer.destroy();
                App.Project.Settings.Viewer = null;
                if (App.ResourceModel && App.ResourceModel.Settings && App.ResourceModel.Settings.Viewer) {
                    App.ResourceModel.Settings.Viewer = null;
                }
            } else if (App.ResourceModel && App.ResourceModel.Settings && App.ResourceModel.Settings.Viewer) {
                App.ResourceModel.Settings.Viewer.destroy();
                App.ResourceModel.Settings.Viewer = null;
                if (App.Project && App.Project.Settings && App.Project.Settings.Viewer) {
                    App.Project.Settings.Viewer = null;
                }
            }
            // if (App.Project && App.Project.Settings && App.Project.Settings.Viewer) {
            // 	App.Project.Settings.Viewer.destroy();
            // 	App.Project.Settings.Viewer = null;
            // }
            // if (App.ResourceModel && App.ResourceModel.Settings && App.ResourceModel.Settings.Viewer) {
            // 	App.ResourceModel.Settings.Viewer.destroy();
            // 	App.ResourceModel.Settings.Viewer = null;
            // }
            //_.require('/static/dist/libs/libsH5.js');
            try {
                $("head").append('<script type="text/javascript" src="/static/dist/libs/libsH5.js"></script>');
            } catch (e) {
                alert(e.message)
            }
        }
        App.Comm.delCookie("token_cookie");
        App.Comm.delCookie("token_cookie_me");
        var user = localStorage.getItem("user");
        if (user) {
            //用户信息
            App.Global.User = JSON.parse(user);
        } else {
            if (location.href.indexOf("share=") != -1) {
                localStorage.setItem("shareUrl", location.href);
            }else if(location.href.indexOf("feedbackId=") != -1&&location.href.indexOf("replyId=") != -1){
                debugger;
                localStorage.setItem("feedbackUrl", location.href);
            }
            location.href = "/login.html?t=" + (+new Date());
            return false;
        }
        //别的系统重新登录过，刷新用户
        if (App.Global.User.userId != App.Comm.getCookie("userId")) {
            App.Comm.getUserInfo();
            user = localStorage.getItem("user");
        }
        $("#pageLoading").show();
        if (!$._data($(".user > span")[0], "events")) {
            //绑定用户信息
            App.TopNav.init();
        }
        //销毁上传
        // debugger;
        App.Comm.upload.destroy();
        App.Global.User && $("#topBar .userName .text").text(App.Global.User.name);
        // if (!App.Global.User || !App.Comm.getCookie('OUTSSO_AuthMAC')) {
        //     App.Comm.ajax({
        //         URLtype: "current"
        //     });
        //     return;
        //     //location.href="/login.html";
        // }
        var Autharr = App.Global.User && App.Global.User["function"],
            keys, len;
        App.AuthObj = {};
        //遍历权限
        $.each(Autharr, function (i, item) {
            keys = item.code.split('-');
            len = keys.length;
            if (len == 1) {
                App.AuthObj[keys[0]] = true;
            } else {
                App.AuthObj[keys[0]] = App.AuthObj[keys[0]] || {}
                if (len == 2) {
                    App.AuthObj[keys[0]][keys[1]] = true
                } else {
                    App.AuthObj[keys[0]][keys[1]] = App.AuthObj[keys[0]][keys[1]] || {}
                    App.AuthObj[keys[0]][keys[1]][keys[2]] = true;
                }
            }
        });
        App.Comm.loadMessageCount();
        $('#indexSuggestItem').on('click', function () {
            _.require('/static/dist/services/services.css');
            _.require('/static/dist/services/services.js');
            App.Services.SuggestView.init();
        })
        this.initAuth(App.Global.User);
    }
});
window.Global = {
    DemoEnv: function (type) {
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
        var $popMenu, popMenuLen, $a;
        if (App.Comm.getCookie("isDemoEnv") != "yes") {
            return;
        }
        if (window.location.href.indexOf("projects") == -1 && window.location.href.indexOf("inbox") == -1) {
            window.location.href = "#projects";
        }
        $("#topBar .navHeader .flow").hide();
        $("#topBar .navHeader .bodyConMenu").hide();
        $("#topBar .navHeader .resources").hide();
        $("#topBar .navHeader .services").hide();
        try {
            $("#downLoadModelProject")[0].className = "disable";
        } catch (e) {
            ;
        }
        try {
            $popMenu = $(".onlineNav ul li");
            $popMenu.each(function (index) {
                if (index != 0) {
                    this.style.display = "none";
                }
            });
        } catch (e) {
            ;
        }
        /*隐藏头像登录等信息*/
        var $topBar = $("#topBar");
        $topBar.find("img").css("display", "none");
        var $userinfo = $(".userinfo");
        $userinfo.find("img").css("display", "none");
        $userinfo.find(".info").css("width", "200px");
        $("#btn_modifyPassword").css("display", "none");
        $("#uiPosition").html("");
        $("#uiPartment").html("演示用户组");
        if (type == "projectDocBtn") {
            $("#contains .opBox span").each(function () {
                $(this).addClass("disable");
            });
        }
        if (type == "modelTab") {
            $("#contains ul.projectTab li").each(function () {
                if ($(this).data("type") != "design") {
                    $(this).css("display", "none");
                }
            });
        }
        if (type == "designLink") {
            $a = $("#contains .rightProperty .designProperties .attrClassBox a");
            $a.each(function (index) {
                $(this).removeAttr("href");
            });
        }
    }
};
App.Router = new AppRoute();
//开始监听
Backbone.history.start();
if (!("ActiveXObject" in window) && !window.ActiveXObject) {
    //轮训
    setInterval(function () {
        App.Comm.checkOnlyCloseWindow();
    }, 3000);
}