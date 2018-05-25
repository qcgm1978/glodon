App.TopNav = {
    init() {
        App.Statistics.sendStatistics({
            type: 'uv',
            "lang": App.Local.getCurrentIsEn() ? "en" : 'cn'
        });
        //获取用户只
        var _userInfo = JSON.parse(localStorage.getItem("user"));
        App._userInfo=_userInfo;
        if (_userInfo) {
            $("#loginName").html(_userInfo.name);
            $("#loginName").attr("title", _userInfo.name);
            $("#uiAccount").html(_userInfo.loginName).attr('title',_userInfo.loginName);
            $("#uiPosition").html(_userInfo.position).attr('title',_userInfo.position);
            $("#labelPhone").html(_userInfo.mobile).attr('title',_userInfo.mobile);
            $("#uiPartment").html(_userInfo.org ? _userInfo.org[0].name : '').attr('title',_userInfo.org ? _userInfo.org[0].name : ''); //
            $("#uiLogo").attr('src', _userInfo.photoUrl);
            $('#topBar .user .userBg').attr("src", _userInfo.photoUrl);
            for (let i = 0, len = _userInfo.function.length; i < len; i++) {
                if (_userInfo.function[i].code === "service-feedback") {
                    $("#feed-back").show();
                    break;
                }
            }
        } else {
            return;
        }
        var $target = $(".user > span");
        //分享
        if (App.Project && App.Project.Settings.isShare) {
            $target = $("#topBar .login");
            $("#topBar .login").off();
        }
        $target.click(function (e) {
            $('.userinfo').hide();
            $('.onlineNav').hide();
            $('.userinfo').show();
            e.stopPropagation();
        })
        $(".user i").click(function (e) {
            $('.userinfo').hide();
            $('.onlineNav').hide();
            $('.userinfo').show();
            e.stopPropagation();
        })
        $('.navHeader .lang').click(e => {
            $('.popup.lang').show();
            $('.userinfo,.onlineNav.system').hide();
            e.stopPropagation();
        });
        $('.popup.lang').click(function (e) {
            var isEnglish = $(e.target).text() === 'English';
            App.Comm.delCookie('yesKnow');
            App.Comm.setCookie('isEnglish', isEnglish);
            if (App.Local.notTranslatePage()) {
                let $lang = $('.lang span:first');
                let $lang2 = $('.lang span:last');
                const text = $lang.text()
                $lang.text($lang2.text())
                $lang2.text(text)
                $(this).hide()
                return;
            }
            location.reload()
        });
        $('.menuNav').click(function (e) {
            $('.userinfo').hide();
            $('.onlineNav.system').show();
            e.stopPropagation();
        })
        $(document).on('click', function (e) {
            $('.onlineNav,.popup.lang,.userinfo').hide();
        })
        var indexAuthenticationItem = $("#indexAuthenticationItem");
        var indexTrainingItem = $("#indexTrainingItem");
        var myTrain = $("#myTrain");
        var indexTrainingAuthenItem = $("#indexTrainingAuthenItem");
        if (!App.Global.User.hasTrainOperation) {
            indexAuthenticationItem.hide();
            indexTrainingItem.hide();
            indexTrainingAuthenItem.hide();
        }
        this.getRightUpLinkHandle();
        myTrain.on("click", function (evt) {
            window.open($(this).attr("openUrl"), "_blank");
        })
        indexAuthenticationItem.on("click", function (evt) {
            window.open($(this).attr("openUrl"), "_blank");
        })
        indexTrainingItem.on("click", function (evt) {
            window.open($(this).attr("openUrl"), "_blank");
        })
    },
    getRightUpLinkHandle() {
        var data = {
            URLtype: "getRightUpLink",
        }
        App.Comm.ajax(data, function (response) {
            if (response.code == 0) {
                var myTrain = $("#myTrain"); //我的培训
                var indexAuthenticationItem = $("#indexAuthenticationItem"); //认证结果
                var indexTrainingItem = $("#indexTrainingItem"); //培训管理
                var data = response.data;
                for (var i = 0, len = data.length; i < len; i++) {
                    if (data[i].name == "我的培训") {
                        myTrain.attr("openUrl", data[i].url);
                        continue;
                    } else if (data[i].name == "认证结果") {
                        indexAuthenticationItem.attr("openUrl", data[i].url);
                        continue;
                    } else if (data[i].name == "培训管理") {
                        indexTrainingItem.attr("openUrl", data[i].url);
                        continue;
                    }
                }
            }
        });
    }
};