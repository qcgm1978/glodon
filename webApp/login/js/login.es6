var Login = {
    // doMain: window.location.host.substring(window.location.host.indexOf(".")),
    doMain: (/^(\d+\.?)+$/.test(location.host) ? window.location.host : (window.location.host.substring(window.location.host.indexOf(".")))),
    isIp: function () {
        //判断URL是否是IP地址,是IP地址返回IP地址,否则返回空字符串
        var ip = "";
        var host = location.host;
        var reg = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/;
        if (reg.test(host)) {
            ip = host;
        } else {
            ip = "";
        }
        return ip;
    },
    isTip: "",
    setTimeId: "",
    setCookie(name, value) {//登录的时候设置cookie的过期时间
        var ip = Login.isIp();
        var Days = 1, //0.02
            exp = new Date();
        const time = exp.getTime() + Days * 24 * 60 * 60 * 1000;
        exp.setTime(time);
        // exp.setTime(exp.getTime() + 5 * 60 * 1000);
        if (ip != "") {
            Login.doMain = ip;
        }
        if (location.host == "bim-demo.wanda.cn" || name == "AuthUser_AuthToken1") {
            exp.setTime(exp.getTime() + 365 * 24 * 60 * 60 * 1000);
        }
        document.cookie = name + "=" + value + ";expires=" + exp.toGMTString() + ";domain=" + Login.doMain + ";path=/";
    },
    getCookie: function (key, cookis) {//获取cookie,然后判断是否自动登录
        var cooks = cookis || document.cookie,
            items = cooks.split("; "),
            result,
            len = items.length,
            str, pos;
        for (var i = 0; i < len; i++) {
            str = items[i];
            pos = str.indexOf('=');
            name = str.substring(0, pos);
            if (name == key) {
                result = str.substring(pos + 1);
                break;
            }
        }
        return result;
    },
    //删除cookie
    delCookie: function (name) {
        var exp = new Date();
        exp.setTime(exp.getTime() - 31 * 24 * 60 * 60 * 1000);
        var cval = this.getCookie(name);
        if (cval != null)
            document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString() + ";domain=" + Login.doMain + ";path=/";
    },
    //删除cookie
    delCook: function (name) {
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval = this.getCookie(name);
        if (cval != null)
            document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString() + ";domain=" + Login.doMain + ";path=/";
    },
    //cookie名称
    cookieNames: function (cookies) {
        var items = cookies.split("; ");
        var names = [],
            len = items.length,
            str, pos;
        for (var i = 0; i < len; i++) {
            str = items[i];
            pos = str.indexOf('=');
            names.push(str.substring(0, pos));
        }
        return names;
    },
    bindEvent() {//事件绑定
        var $remeber = $("#mainBox .remember");
        $("#btnLogin").on("click", function () {//登录按钮绑定事件
            Login.signIn();
        });
        $("#userName,#userPwd").keyup(function (e) {//当输入框输入的时候隐藏警告
            if (e.keyCode == 13) {
                Login.signIn();
            }
            var $errorMSG = $("#mainBox .errorMSG");
            if ($errorMSG.hasClass('show')) {
                if ($(this).val().trim()) {
                    $errorMSG.removeClass('show');
                }
                ;
            }
            ;
        });
        $remeber.on("click", function () {//一周内自动登陆绑定事件
            $(this).toggleClass("selected");
        });
        if (Login.getCookie("isAutoLogin") == 'true') {//判断是否自动登入//获取cookie,然后判断是否自动登录,记住密码是否选中的方法
            $remeber.click();
        }
    },
    //登录
    signIn() {
        var _this = this;
        var $btnLogin = $("#btnLogin");
        if ($btnLogin.data("islogin")) {
            return;
        }
        var userName = $("#userName").val().trim(),
            userPwd = $("#userPwd").val().trim(),
            isRemember = false;
        localStorage.setItem("userName", userName);
        localStorage.setItem("userPwd", userPwd);
        var language = navigator.language || navigator.userLanguage;
        // if(localStorage.getItem("isEnglish")=="true"){
        //  language = "en-US";
        // }else if(localStorage.getItem("isEnglish")=="false"){
        //  language = "zh-CN";
        // }
        var tipUNameText = "请输入用户名";
        var tipPwdText = "请输入密码";
        var nowLogin = "登录";
        var loginTxt = "登录中";
        var tipErrorText = "登录失败:用户名密码错误";
        var tipNoUserText = "登录失败:没有此用户!";
        if (language === "fr-FR") {
            tipUNameText = "Please enter the user name";
        } else if (language === "en-US" || language === "en-GB") {
            tipUNameText = "Please enter the user name";
            tipPwdText = "Please enter the password";
            nowLogin = "Log In";
            loginTxt = "Loginning";
            tipErrorText = "User name or password error";
            tipNoUserText = "Landing failure: no user";
        } else if (language === "zh-CN" || language === "zh") {
            tipUNameText = "请输入用户名";
            tipPwdText = "请输入密码";
            nowLogin = "登录";
            loginTxt = "登录中";
            tipErrorText = "登录失败:用户名密码错误";
            tipNoUserText = "登录失败:没有此用户!";
        }
        if (!userName) {
            $("#mainBox .errorMSG").addClass('show').find(".tip").text(tipUNameText);
            return false;
        }
        if (!userPwd) {
            $("#mainBox .errorMSG").addClass('show').find(".tip").text(tipPwdText);
            return false;
        }
        ;
        $("#btnLogin").val(loginTxt).data("islogin", true);
        $.ajax({
            url: '/platform/login',
            type: 'post',
            data: {
                userid: userName,
                password: userPwd
            }
        }).done(function (data) {
            if (data.code == 0) {
                Login.delCookie("token_cookie");
                if (data.cookie && typeof data.cookie === 'object') {
                    for (var p in data.cookie) {
                        Login.setCookie(p, data.cookie[p]);
                    }
                    let Days = 1;
                    //todo temp set 1.5 hours for test
                    // Days=0.06;
                    const time = new Date().getTime() + Days * 24 * 60 * 60 * 1000;
                    Login.setCookie('expires', time)
                    var isUrlReturn = _this.isUrlReturn();
                    if (isUrlReturn && isUrlReturn.length > 0) {//是否是四方过来的登录地址
                        location.href = isUrlReturn;
                        return;
                    } else {
                        Login.isDemoUser(data); //判断是否演示用户
                    }
                }
                //获取用户信息
                Login.getUserInfo();
            } else if (data.code == "1") {
                $("#mainBox .errorMSG").addClass('show').find(".tip").text(tipNoUserText);
                $("#btnLogin").val(nowLogin).data("islogin", false);
            } else {
                if (data.ssoChangePwdUrl) {
                    window.location.href = data.ssoChangePwdUrl;
                } else {
                    $("#mainBox .errorMSG").addClass('show').find(".tip").text(tipErrorText);
                    $("#btnLogin").val(nowLogin).data("islogin", false);
                }
            }
        })
    },
    isUrlReturn() {//是否是四方过来的登录地址
        var urlStr = window.location.search.substr(1);
        var searchArr = urlStr.split("&");
        var resultVal = "";
        for (let i = 0, iLen = searchArr.length; i < iLen; i++) {
            let item = searchArr[i].split("=");
            if (item[0] === "return") {
                resultVal = decodeURIComponent(item[1]);
                break;
            }
        }
        return resultVal;
    },
    //判断是否演示用户(即demo用户)
    isDemoUser: function (data) {
        for (var p in data.cookie) {
            if (data.cookie[p] == 1 || data.cookie[p] == "1") {
                Login.setCookie("isDemoEnv", "yes");
                return;
            }
        }
    },
    //发布ie的消息
    dispatchIE(url) {
        if (navigator.userAgent.indexOf("QtWebEngine/5.7.0") > -1/*||/127.0.0.1/.test(location.href)*/) {
            //alert(url)
            window.open(url);
        }
    },
    //获取用户信息
    getUserInfo() {
        var self = this;
        $.ajax({
            url: '/platform/user/current?t=' + (+new Date())
        }).done(function (data) {
            // var r = document.URL.split('ReturnUrl=').pop();
            //获取referer returnurl 进行重定向
            var r = "";
            if (localStorage.getItem("shareUrl")) {
                r = localStorage.getItem("shareUrl");
            } else if (localStorage.getItem("feedbackUrl")) {
                r = localStorage.getItem("feedbackUrl");
            }
            //失败
            if (data.code != 0) {
                var language = navigator.language || navigator.userLanguage;
                // if(localStorage.getItem("isEnglish")=="true"){
                //  language = "en-US";
                // }else if(localStorage.getItem("isEnglish")=="false"){
                //  language = "zh-CN";
                // }
                var userInfo = "获取用户信息失败";
                if (language === "fr-FR") {
                    nowLogin = "Log In";
                    userInfo = "Failed to obtain user information";
                } else if (language === "en-US" || language === "en-GB") {
                    userInfo = "Failed to obtain user information";
                    nowLogin = "Log In";
                } else if (language === "zh-CN" || language === "zh") {
                    userInfo = "获取用户信息失败";
                    nowLogin = "登录";
                }
                $("#mainBox .errorMSG").addClass('show').find(".tip").text(userInfo);
                $("#btnLogin").val(nowLogin).data("islogin", false);
                return;
            }
            //ie
            Login.dispatchIE('/?commType=loginIn');
            localStorage.setItem("user", JSON.stringify(data.data));
            Login.setCookie('OUTSSO_LoginId', data.data.userId);
            Login.setCookie('userId', data.data.userId);
            Login.setCookie('isOuter', data.data.outer);
            //判断用户是外网用户还是内网用户
            if (data.data.outer) {
                Login.setCookie("userType", "outerNet");
            } else {
                Login.setCookie("userType", "innerNet");
            }
            //记住我
            if ($(".loginDialog .remember").hasClass("selected")) {
                Login.rememberMe();
            } else {
                Login.setCookie("isAutoLogin", false);
            }
            //是否主动退出标记 2 默认状态 1 为主动退出
            Login.setCookie('IS_OWNER_LOGIN', '2');
            // self.hideTipHandle($("#tipBox"));//关闭温馨提示
            if (r && r != document.URL) {
                // window.location = decodeURIComponent(r);
                if (localStorage.getItem("shareUrl")) {
                    localStorage.removeItem("shareUrl");
                } else if (localStorage.getItem("feedbackUrl")) {
                    localStorage.removeItem("feedbackUrl");
                }
                window.location = r;
            } else {
                //alert('getUserInfo')
                //alert(window.ieUrl)
                window.location.href = '/index.html?t=' + (+new Date());
            }
        });
    },
    //一周内记住我
    rememberMe() {
        var userName = $("#userName").val().trim(),
            userPwd = $("#userPwd").val().trim();
        //用户信息
        Login.setCookie('userName', userName);
        Login.setCookie('userPwd', userPwd);
        //自动登录信息
        Login.setCookie("isAutoLogin", true);
        Login.setCookie("autoDate", +new Date());
    },
    init() {//登录页面初始化
        Login.bindEvent();//事件绑定
        if (Login.isSSO(document.cookies)) {//老数据
            // Login.checkSSO();
        } else {
            //是否自动登录
            Login.isAutoLogin();
        }
        /*if (Login.isSSO(document.cookie)) {
            Login.checkSSO();
        }*/
        /*/*if (Login.isSSO(document.cookies)) {//老数据
            //Login.checkSSO();
        } else {
            //是否自动登录
            Login.isAutoLogin();
        }*/
        //谷歌下验证登录
        //if (navigator.userAgent.indexOf("QtWebEngine/5.7.0") <= -1) {
        //  //验证登录
        //  this.checkLogin();
        //}*/
    },
    getForgetPwdHandle: function () {//获取忘记密码的方法
        var url = "/platform/login/forgetPassword/url";
        $.ajax({
            url: url,
            success: function (data) {
                if (data.code == 0) {
                    var urlS = data.data[0].url;
                    var forgetPassword = $("#forgetPassword");
                    forgetPassword.attr("href", urlS);
                } else {
                    alert("获取修改密码地址错误:" + dataObj.message);
                }
            }
        });
    },
    enHandle: function () {//英文处理方法
        var mainBox = $("#mainBox");
        var messageTitle = $("#messageTitle");
        var messageList_1 = $("#messageList_1");
        var messageList_2 = $("#messageList_2");
        var messageList_3 = $("#messageList_3");
        var userLogin = $("#userLogin");
        var errorTip = $("#errorTip");
        var userName = $("#userName");
        var userPwd = $("#userPwd");
        var forgetPassword = $("#forgetPassword");
        var btnLogin = $("#btnLogin");
        var logBox = $("#logBox");
        var login_demo = $("#login_demo");
        var footer_1 = $("#footer_1");
        var footer_2 = $("#footer_2");
        var footer_3 = $("#footer_3");
        var footer_4 = $("#footer_4");
        var footer_1_desc = $("#footer_1_desc");
        var footer_2_desc = $("#footer_2_desc");
        var footer_3_desc = $("#footer_3_desc");
        var footer_4_desc = $("#footer_4_desc");
        var footer_text = $("#footer_text");
        var title = $("title");
        var footerPadding = $(".footer");
        var enCn = {
            loginTitle: "WBIM Project Management Platform",
            loginPriorManagement: "Prior management",
            loginSynchronizedCoordination: "synchronized coordination",
            loginUnifiedModes: "unified modes",
            loginUserLogin: "Log In",
            loginErrorTip: "Incorrect user name or password.",
            loginUserNameInput: "User name",
            loginUserPassWordInput: "Password",
            logBox: "Log",
            loginForgetPassword: "Forget Password",
            loginLoginBtn: "Log In",
            loginDemoSystem: "Log in Demo System",
            loginPlanDesign: "Plan & Design",
            loginPlanDesignDesc: "Improve the efficiency of plan and design by viewing and running collision detection of integrated models for multiple disciplines",
            loginPlanManagement: "Plan Management",
            loginPlanManagementDesc: "Realize visual schedule management by reflecting schedules with BIM models",
            loginCostManagement: "Cost Management",
            loginCostManagementDesc: "Achieve effective cost control by showing quantities and cost data in BIM models",
            loginQualityManagement: "Quality Management",
            loginQualityManagementDesc: "Facilitate quality management by placing checking points beforehand in BIM models",
            banQuanShengMing: "Copyright © 2016 Dalian WANDA COMMERCIAL PROPERTIES CO.,LTD,All Rights Reserved"
        }
        mainBox.addClass('enMainBox');
        messageTitle.html(enCn.loginTitle);
        title.html(enCn.loginTitle);
        messageList_1.html(enCn.loginPriorManagement);
        messageList_2.html(enCn.loginSynchronizedCoordination);
        messageList_3.html(enCn.loginUnifiedModes);
        userLogin.html(enCn.loginUserLogin);
        errorTip.html(enCn.loginErrorTip);
        userName.attr("placeholder", enCn.loginUserNameInput);
        userPwd.attr("placeholder", enCn.loginUserPassWordInput);
        logBox.html(enCn.logBox);
        forgetPassword.html(enCn.loginForgetPassword);
        login_demo.find("a").html(enCn.loginDemoSystem);
        btnLogin.val(enCn.loginLoginBtn);
        footer_1.html(enCn.loginPlanDesign);
        footer_1_desc.html(enCn.loginPlanDesignDesc);
        footer_2.html(enCn.loginPlanManagement);
        footer_2_desc.html(enCn.loginPlanManagementDesc);
        footer_3.html(enCn.loginCostManagement);
        footer_3_desc.html(enCn.loginCostManagementDesc);
        footer_4.html(enCn.loginQualityManagement);
        footer_4_desc.html(enCn.loginQualityManagementDesc);
        footerPadding.css("padding-top", "12px");
        footer_text.html(enCn.banQuanShengMing);
    },
    loginMoreMessage: function () {//登录页面处理多语言方法
        var host = document.location.host;
        var login_demo = $("#login_demo");
        var openDemoPage = $("#openDemoPage");
        var openEnDemoPage = $("#openEnDemoPage");
        var bodyBgDialog = $("#bodyBgDialog");
        var dialogAlertBox = "";
        var language = navigator.language || navigator.userLanguage;
        if (language === "fr-FR") {
        } else if (language === "en-US" || language === "en-GB") {
            dialogAlertBox = $("#dialogAlertEnBox");
            this.enHandle()//英文处理方法
            $("#closeEnDialog").on("click", function () {
                bodyBgDialog.hide();
                dialogAlertBox.hide();
            })
        } else if (language === "zh-CN" || language === "zh") {
            dialogAlertBox = $("#dialogAlertZnBox");
            $("#closeZhDialog").on("click", function () {
                bodyBgDialog.hide();
                dialogAlertBox.hide();
            })
        }
        $('#downLoad').on('click', function () {
            var id = $(this).data('id');
            window.open(id, '_blank');
        })
        $('#downEnLoad').on('click', function () {
            var id = $(this).data('id');
            window.open(id, '_blank');
        })
        if (host.indexOf("demo") > 0) {
            login_demo.hide();
            return;
        }
        login_demo.on("click", "a", function () {
            bodyBgDialog.show();
            dialogAlertBox.show();
        })
        openDemoPage.on("click", function () {
            window.open("http://bim-demo.wanda.cn");
        })
        openEnDemoPage.on("click", function () {
            window.open("http://bim-demo.wanda.cn");
        })
    },
    isSSO: function (cooks) {
        // Login.checkSSO(cooks);
        // return true;
        var bool;
        var AuthUser_AuthNum = Login.getCookie("AuthUser_AuthNum", cooks);
        var AuthUser_AuthToken = Login.getCookie("AuthUser_AuthToken", cooks);
        var AuthUser_AuthMAC = Login.getCookie("AuthUser_AuthMAC", cooks);
        var AuthUser_Signature = Login.getCookie("AuthUser_Signature", cooks);
        try {
            bool = AuthUser_AuthNum.length > 5 && AuthUser_AuthToken.length > 5 && AuthUser_AuthMAC.length > 5 && AuthUser_Signature.length > 5;
            if (AuthUser_AuthToken == undefined) {
                return false;
            }
            if (AuthUser_Signature == undefined) {
                return false;
            }
            if (bool) {
                Login.checkSSO(cooks);
                return true;
            } else {
                return false;
            }
        } catch (e) {
            return false;
        }
    },
    getSSO: function (cooks) {
        var AuthUser_AuthNum = Login.getCookie("AuthUser_AuthNum", cooks);
        var AuthUser_AuthToken = Login.getCookie("AuthUser_AuthToken", cooks);
        var AuthUser_AuthMAC = Login.getCookie("AuthUser_AuthMAC", cooks);
        return {
            "AuthUser_AuthNum": AuthUser_AuthNum,
            "AuthUser_AuthToken": AuthUser_AuthToken,
            "AuthUser_AuthMAC": AuthUser_AuthMAC
        };
    },
    //万达系统登陆后,然后在本项目中自动登录
    //万达用户跳转到总发包系统的登录条件：
    //OUTSSO_AuthNum为空; AuthUser_AuthNum,AuthUser_AuthToken,AuthUser_AuthMAC有值; wd_sso_user不为空
    checkSSO: function (cooks) {
        debugger;
        // alert(arguments.callee.name)
        var url = "/platform/login/inner";
        var SSO = Login.getSSO(cooks);
        $.ajax({
            url: url,
            type: "post",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(SSO),
            success: function (data) {
                // try {
                //     debugger;
                //     // alert(parent.console.log)
                // } catch (e) {
                //     alert('no parent')
                // }
                // parent.console.log(JSON.stringify(data))
                var obj, p, i;
                if (data.code == 0) {
                    obj = data.data;
                    for (var p in obj) {
                        Login.setCookie(p, obj[p]);
                    }
                    Login.getUserInfo();
                }
            },
            error(msg) {
                alert('error ' + msg)
            }
        });
    },
    clearCookie() {
        var keys = Login.cookieNames(document.cookie);
        if (keys) {
            for (var i = keys.length; i--;) {
                Login.delCookie(keys[i]);
            }
        }
    },
    loginDragOpenHandle() {//登录页面右下区域运维点击打开模块功能
        var rightDragBox = $("#rightDragBox");
        var operationId = $("#operationId");
        var tplNum = $("#tplNum");
        var qqNum = $("#qqNum");
        var operationId_i = operationId.find("i");
        var language = navigator.language || navigator.userLanguage;
        if (language === "fr-FR") {
        } else if (language === "en-US" || language === "en-GB") {
            operationId.find("span").html('Contact us');
            tplNum.html("Tel：010-85588326");
            qqNum.html("QQ：2272679460");
        } else if (language === "zh-CN" || language === "zh") {
            operationId.find("span").html('联系运维');
            tplNum.html("电话：010-85588326");
            qqNum.html("运维QQ：2272679460");
        }
        rightDragBox.on("click", function () {
            return false;
        })
        operationId_i.on('click', function () {
            if (!rightDragBox.hasClass('showPhoneBox')) {
                rightDragBox.addClass('showPhoneBox');
                rightDragBox.find("dd").fadeIn();
            } else {
                rightDragBox.find("dd").css("display", "none");
                rightDragBox.removeClass('showPhoneBox');
            }
            return false;
        })
        $(document).on("click", function () {
            if (rightDragBox.hasClass('showPhoneBox')) {
                rightDragBox.find("dd").css("display", "none");
                rightDragBox.removeClass('showPhoneBox');
            }
        })
    },
    loginDragHandle() {//登录页面右下区域运维点击打开模块功能
        var rightDragBox = $("#rightDragBox");
        var posX = 0,
            posY = 0,
            boxHeight = rightDragBox.outerHeight() + 60;
        rightDragBox.mousedown(function (evt) {
            if (rightDragBox.hasClass('showPhoneBox') || evt.target.nodeName == "I") return;
            var divPosX = rightDragBox.offset().left;
            var divPosY = rightDragBox.offset().top;
            var startX = evt.clientX;
            var startY = evt.clientY;
            posY = startY - divPosY;
            $(document).mousemove(function (evt) {
                var moveX = evt.clientX;
                var moveY = evt.clientY;
                if (moveY - posY <= 0) {
                    rightDragBox.css("right", 0).css("top", 0);
                } else if (moveY - posY >= $(window).height() - boxHeight) {
                    rightDragBox.css("right", 0).css("top", $(window).height() - boxHeight);
                } else {
                    rightDragBox.css("right", 0).css("top", moveY - posY);
                }
                return false;
            })
            return false;
        })
        $(document).mouseup(function (evt) {
            if (rightDragBox.hasClass('showPhoneBox')) return;
            $(this).off('mousemove');
            return false;
        })
    },
    loginTipHandle() {//登录页面温馨提示模块功能
        var self = this;
        var tipId = $("#tipId");
        var tipBox = $("#tipBox");
        var language = navigator.language || navigator.userLanguage;
        if (location.host == "bim-demo.wanda.cn") {
            clearTimeout(self.setTimeIds);
            clearTimeout(self.setTimeId);
            clearTimeout(self.autoHideTimeId);
            tipBox.css("display", "none");//显示温馨提示
        }
        if (language === "fr-FR") {
        } else if (language === "en-US" || language === "en-GB") {
            tipId.html("Tips");
            tipBox.find("dt").html("To make your experience more friendly:");
            tipBox.find("dd:eq(0)").html("1. Platform recommended Google or IE11 browser;");
            tipBox.find("dd:eq(1)").html("2. Please check the personal information; if not correct, please the person in charge of the unit to Tender & Procurement Platform update personnel information.");
        } else if (language === "zh-CN" || language === "zh") {
            tipId.html("温馨提示");
            tipBox.find("dt").html("为了您的体验更加友好：");
            tipBox.find("dd:eq(0)").html("1.筑云平台推荐使用谷歌或IE11浏览器；");
            tipBox.find("dd:eq(1)").html("2.请核验个人信息；如不正确，请单位负责人到招采平台更新人员备案信息。");
        }
        tipId.off("click");
        tipId.on("click", function () {
            return false;
        })
        tipId.hover(function () {
            clearTimeout(self.setTimeIds);
            clearTimeout(self.setTimeId);
            clearTimeout(self.autoHideTimeId);
            if (!$(this).hasClass("hoverClass")) {
                tipId.addClass("hoverClass");
                self.showTipHandle(tipBox);//显示温馨提示
            }
        }, function () {
            self.setTimeId = setTimeout(function () {
                tipId.removeClass("hoverClass");
                self.hideTipHandle(tipBox);//关闭温馨提示
            }, 400)
        })
        tipBox.hover(function () {
            clearTimeout(self.setTimeIds);
            clearTimeout(self.setTimeId);
            clearTimeout(self.autoHideTimeId);
        }, function () {
            self.setTimeIds = setTimeout(function () {
                tipId.removeClass("hoverClass");
                self.hideTipHandle(tipBox);//关闭温馨提示
            }, 400)
        })
        this.autoHideTimeId = setTimeout(function () {
            tipId.removeClass("hoverClass");
            self.hideTipHandle(tipBox);//关闭温馨提示
        }, 5000);
    },
    showTipHandle(tipBox) {//显示温馨提示
        tipBox.fadeIn();
    },
    hideTipHandle(tipBox) {//关闭温馨提示
        tipBox.fadeOut();
    },
    checkLoginBefore: function (cookies) {
        Login.clearCookie();
        if (cookies) {
            var keys = Login.cookieNames(cookies),
                val;
            for (var i = 0; i < keys.length; i++) {
                val = Login.getCookie(keys[i], cookies);
                val && Login.setCookie(keys[i], val);
            }
        }
        return document.cookie;
    },
    //验证登录
    checkLogin: function () {//已经废弃
        $.ajax({
            url: '/platform/user/current?t=' + (+new Date())
        }).done(function (data) {
            if (typeof(data) == "string") {
                data = JSON.parse(data);
            }
            if (data.code == 0) {
                localStorage.setItem("user", JSON.stringify(data.data))
                Login.setCookie('userId', data.data.userId);
                Login.setCookie('isOuter', data.data.outer);
                window.location.href = '/index.html?t=' + (+new Date());
            }
        });
        return "comm";
    },
    isAutoLogin() {//是否自动登录已废弃
        if (Login.getCookie("isAutoLogin") == "true") {
            var setDate = Login.getCookie("autoDate"),
                diffMillisecond = 7 * 24 * 60 * 60 * 1000;//7天自动登录
            if ((new Date() - setDate) <= diffMillisecond && Login.getCookie('IS_OWNER_LOGIN') == '2') {//7 天内
                //获取用户名
                $("#userName").val(Login.getCookie("userName"));
                $("#userPwd").val(Login.getCookie("userPwd"));
                $(".loginDialog .remember").addClass("selected");
                Login.signIn();
            }
        }
    }
}
var App = {
    Comm: {
        //獲取cook 和 localstore
        getCookAndStore: function () {
            return JSON.stringify({
                cookie: document.cookie,
                user: localStorage.getItem("user")
            });
        }
    }
}
/** trim() method for String */
String.prototype.trim = function () {
    return this.replace(/(^\s*)|(\s*$)/g, '');
};