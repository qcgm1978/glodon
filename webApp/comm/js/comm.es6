App.Comm = {
    Settings: {
        v: 20160313,
        loginType: "user", // 登录状态 user token
        pageItemCount: 15, //Math.floor(($("body").height() + 60) / 70) > 10 && Math.floor(($("body").height() + 60) / 70) || 10
        pageSize: 9999,
        isReload: false,
        downloadDatas: ""
    },
    //批注类型  0: 模型；1：rvt单文件；2：dwg图纸文件
    hostType: {
        0: "m-single-model",
        1: "m-single-rvt",
        2: "m-single-dwg"
    },
    //是否登录
    isLogin: function (async) {

        //默认 同步
        if (async) {
            async = true;
        } else {
            async = false;
        }
        var isLogin = false;
        $.ajax({
            url: '/platform/user/current?t=' + (+new Date()),
            async: async
        }).done(function (data) {
            if (typeof (data) == "string") {
                data = JSON.parse(data);
            }
            if (data.code == 0) {
                isLogin = true;
            } else {
                isLogin = false;
            }
        });
        return isLogin;
    },
    //ie预览模型
    isIEModel: function () {
        if ("ActiveXObject" in window || window.ActiveXObject) {
            window.location.href = '/ie.html?path=' + window.location.href;
            return true;
        }
    },
    //项目版本状态
    versionStatus: status => {
        //debugger;
        return ({
            "1": "待上传",
            "2": "上传中",
            "3": App.Local.getTranslation('drawing-model.NAd') || "待审核",
            "4": App.Local.data['drawing-model'].Approving || "审核中",
            "5": App.Local.data['drawing-model'].Approved || "审核通过",
            "6": App.Local.data['drawing-model'].RejectedBack || "审核退回",
            "7": App.Local.data['drawing-model'].NTd || "待移交",
            "8": App.Local.data['drawing-model'].Returned || "移交退回",
            "9": App.Local.getTranslation('drawing-model.Transferred') || "已移交",
            "10": App.Local.getTranslation('drawing-model.NAd') || "待审核",
            "11": App.Local.data['drawing-model'].Approved || "审核通过",
            "12": App.Local.data['drawing-model'].RejectedBack || "审核退回",
            "13": App.Local.data['drawing-model'].NTd || "待移交",
            "14": App.Local.data['drawing-model'].Returned || "移交退回",
            "15": App.Local.data['drawing-model'].Applying || "申请中"
        }[status])
    },
    //族库和标准模型状态
    modelStatus: {
        "1": "待上传",
        "2": "上传中",
        "3": (App.Local.data['drawing-model'].NAd || "待审核"),
        "4": App.Local.data['drawing-model'].Approving || "审核中",
        "5": App.Local.data['drawing-model'].Approved || "审核通过",
        "6": App.Local.data['drawing-model'].RejectedBack || "审核退回",
        "7": App.Local.data['drawing-model'].NotReleased || "待发布",
        "8": App.Local.data['drawing-model'].ReleasedBack || "发布退回",
        "9": App.Local.data['source-data'].rd || "已发布",
        "10": "待审核",
        "11": App.Local.data['drawing-model'].Approved || "审核通过",
        "12": App.Local.data['drawing-model'].RejectedBack || "审核退回",
        "13": App.Local.data['drawing-model'].NTd || "待移交",
        "14": App.Local.data['drawing-model'].Returned || "移交退回",
        "15": App.Local.data['drawing-model'].Applying || "申请中"
    },
    checkProjectAuthHandle(options) {//检查当前用户对于当前项目是否有数据权限
        var promiseObj = this.checkProjectAuth({
            projectid: options.projectid,
            type: options.type,
        })
        return promiseObj.then(function (data) {
            if ($.isFunction(options.callbackHandle)) {
                options.callbackHandle(data);
            }
        }).catch(function (data) {
            $.tip({
                type: 'alarm',
                message: '操作失败:' + data.message
            })
        })
    },
    checkProjectAuth(options) {//检查当前用户对于当前项目是否有数据权限
        var promiseObj = new Promise(function (resolve, reject) {
            let data = {
                URLtype: "checkProjectAuth",
                data: {
                    projectid: options.projectid,
                    type: options.type,
                }
            };
            App.Comm.ajax(data, data => {
                if (data.code == 0) {
                    resolve(data.data);
                } else {
                    reject(data);
                }
            })
        })
        return promiseObj;
    },
    isAuth: function (type, s) {
        if (!App.AuthObj) {
            return false;
        }
        var _subType, _auth, _status, _setting, isChange = false,
            _temp = '4,7,9';
        if (s == 'family') {
            _auth = App.AuthObj.lib && App.AuthObj.lib.family || {};
            _setting = App.ResourceModel.Settings || {};
        } else if (s == 'model') {
            _setting = App.ResourceModel.Settings || {};
            _auth = App.AuthObj.lib && App.AuthObj.lib.model || {};
        } else {
            _setting = App.Project.Settings || {};
            _auth = App.AuthObj.project && App.AuthObj.project.prjfile || {};
        }
        _subType = _setting.CurrentVersion.subType;
        _status = _setting.CurrentVersion.status;
        isChange = _setting.CurrentVersion.name == "初始版本" ? false : true;
        //如果状态等于4,7,9直接禁用
        if (_temp.indexOf(_status) != -1) {
            return false;
        }
        if (s == 'family' || s == 'model') {
            if (type == "down") {
                if (_auth.download) {
                    return true;
                } else {
                    return false;
                }
            } else {
                if (_auth.edit) {
                    return true;
                } else {
                    return false;
                }
            }
        }
        if (type == 'create' || type == "rename" || type == "delete") {//非标、用户权限、不是变更版本才有（创建、重命名、删除）
            //变更版本不能创建、删除、重命名
            if (_subType == 3 && _auth.edit && !isChange) {
                return true;
            }
        } else if (type == "upload") {
            if (_auth.edit && !isChange) {
                return true;
            } else if (_auth.edit && isChange && App.Comm.user("userId") == App.Project.Settings.ProjectCreatorId) {
                return true;
            }
        } else if (type == "down") {
            if (App.AuthObj.project && App.AuthObj.project.prjfile && App.AuthObj.project.prjfile.download) {
                return true;
            }
        }
        return false;
    },
    //格式化 状态  type 1  project  2 resource
    formatStatus: function (status, type, createId, locked) {
        // debugger;
        //项目  非初始 锁定
        if (type == 1 && App.Project.Settings.CurrentVersion.name != '初始版本' && locked) {
            if (App.Global.User.userId != createId && createId) {
                return App.Local.data['drawing-model'].Lock || '锁定';
            }
        }
        if (type == 1) {
            return App.Comm.versionStatus(status) || '';
        } else if (type == 2) {
            return App.Comm.modelStatus[status] || '';
        }
        return '';
    },
    user: function (key) {
        if (!App.Global.User) {
            window.location.href = "/login.html?t=" + (+new Date());
        } else {
            return App.Global.User[key];
        }
    },
    //封装ajax
    ajax: function (datas, callback, fail = () => {
    }, complete = () => {
    }) {
        var dataObj = datas;
        if (!dataObj) {
            return;
        }
        dataObj = App.Comm.getUrlByType(dataObj);
        if (dataObj.headers) {
            dataObj.headers.ReturnUrl = location.href;
        } else {//登录时要用
            dataObj.headers = {
                ReturnUrl: location.href
            }
        }
        return $.ajax(dataObj)
            .done(function (data) {//cookie延长30分钟
                if (_.isString(data)) {// to json
                    if (JSON && JSON.parse) {
                        try {

                            data = JSON.parse(data);
                        } catch (e) {
                            return fail()
                        }
                    } else {
                        data = $.parseJSON(data);
                    }
                }
                if (data.code == 20016 || data.code == 20017 || data.code == 20019 || data.code == 20018) {//未登录
                    window.location.href = "#/logout";
                }
                if ($.isFunction(callback)) {//回调
                    callback(data);
                }
            })
            .fail((jqXHR, textStatus, errorThrown) => {
                let str = `${textStatus}: ${errorThrown}, the url is ${dataObj.url}`;
                console.log(str);
                fail(jqXHR, textStatus, errorThrown);
                if (location.host === '127.0.0.1') {
                    $.tip({
                        message: str,
                        timeout: 5000,
                        type: "alarm"
                    });
                }
            })
            .complete(complete);
    },
    addDataUserAjax: function (datas, callback) {
        var dataObj = datas;
        if (!dataObj) {
            return;
        }
        dataObj = App.Comm.getUrlByTypeAddDataUser(dataObj);
        if (dataObj.headers) {
            dataObj.headers.ReturnUrl = location.href;
        } else {//登录时要用
            dataObj.headers = {
                ReturnUrl: location.href
            }
        }
        return $.ajax(dataObj).done(function (data) {//cookie延长30分钟
            if (_.isString(data)) {// to json
                if (JSON && JSON.parse) {
                    data = JSON.parse(data);
                } else {
                    data = $.parseJSON(data);
                }
            }
            if (data.code == 20016 || data.code == 20017 || data.code == 20019 || data.code == 20018) {//未登录
                window.location.href = "#/logout";
            }
            if ($.isFunction(callback)) {//回调
                callback(data);
            }
        });
    },
    getUrlByTypeAddDataUser: function (data) {
        if (data.url) {
        } else {//是否调试
            if (App.API.Settings.debug) {
                data.url = App.API.DEBUGURL[data.URLtype];
            } else {
                data.url = App.API.Settings.hostname + App.API.URL[data.URLtype];
            }
            if (!data.url) {//没有调试接口
                data.url = App.API.Settings.hostname + App.API.URL[data.URLtype];
            }
        }
        //url 是否有参数
        var urlPars = data.url.match(/\{([\s\S]+?(\}?)+)\}/g);
        var temp = data.data;
        if ((typeof temp) == 'string') {
            temp = JSON.parse(temp);
        }
        if (urlPars) {
            for (var i = 0; i < urlPars.length; i++) {
                var rex = urlPars[i],
                    par = rex.replace(/[{|}]/g, ""),
                    val = temp[par];
                data.url = data.url.replace(rex, val);
            }
        }
        //删除
        if ((data.type && data.type.toLowerCase() == "delete" || (data.type && data.type.toLowerCase() == "put")) && data.data) {
            if (data.url.indexOf("?") == -1) {
                data.url += "?1=1";
            }
            for (var p in data.data) {
                if (data.url.indexOf("?") !== -1) {
                    data.url += "&" + p + "=" + encodeURIComponent(data.data[p]);
                } else {
                    data.url += "&" + p + "=" + data.data[p];
                }
            }
        }
        // if ((data.URLtype.indexOf("delete") > -1 || data.URLtype.indexOf("put") > -1) && data.data) {
        //     if (data.url.indexOf("?") == -1) {
        //         data.url += "?1=1";
        //     }
        //     for (var p in data.data) {
        //         if (data.url.indexOf("?") !== -1) {
        //             data.url += "&" + p + "=" + encodeURIComponent(data.data[p]);
        //         } else {
        //             data.url += "&" + p + "=" + data.data[p];
        //         }
        //     }
        // }
        if (data.url.indexOf("?") > -1) {
            data.url += "&t=" + (+new Date);
        } else {
            data.url += '?t=' + (+new Date);
        }
        return data;
    },
    getUrlByType: function (data) {
        if (data.url) {
        } else {//是否调试
            if (App.API.Settings.debug) {
                data.url = App.API.DEBUGURL[data.URLtype];
            } else {
                data.url = App.API.Settings.hostname + App.API.URL[data.URLtype];
            }
            if (!data.url) {//没有调试接口
                data.url = App.API.Settings.hostname + App.API.URL[data.URLtype];
            }
        }
        //url 是否有参数
        var urlPars = data.url.match(/\{([\s\S]+?(\}?)+)\}/g);
        var temp = data.data;
        if ((typeof temp) == 'string') {
            temp = JSON.parse(temp);
        }
        if (urlPars) {
            for (var i = 0; i < urlPars.length; i++) {
                var rex = urlPars[i],
                    par = rex.replace(/[{|}]/g, ""),
                    val = temp[par];
                data.url = data.url.replace(rex, val);
            }
        }
        //删除
        // if ((data.type&&data.type.toLowerCase() == "delete" || (data.type&&data.type.toLowerCase() == "put")) && data.data) {
        //     if (data.url.indexOf("?") == -1) {
        //         data.url += "?1=1";
        //     }
        //     for (var p in data.data) {
        //         if (data.url.indexOf("?") !== -1) {
        //             data.url += "&" + p + "=" + encodeURIComponent(data.data[p]);
        //         } else {
        //             data.url += "&" + p + "=" + data.data[p];
        //         }
        //     }
        // }
        if ((data.URLtype.indexOf("delete") > -1 || data.URLtype.indexOf("put") > -1) && data.data) {
            if (data.url.indexOf("?") == -1) {
                data.url += "?1=1";
            }
            for (var p in data.data) {
                if (data.url.indexOf("?") !== -1) {
                    data.url += "&" + p + "=" + encodeURIComponent(data.data[p]);
                } else {
                    data.url += "&" + p + "=" + data.data[p];
                }
            }
        }
        if (data.url.indexOf("?") > -1) {
            data.url += "&t=" + (+new Date);
        } else {
            data.url += '?t=' + (+new Date);
        }
        return data;
    },
    //JS操作cookies方法!
    // doMain: window.location.host.substring(window.location.host.indexOf(".")),
    doMain: (/^(\d+\.?)+$/.test(location.host) ? window.location.host : (window.location.host.substring(window.location.host.indexOf(".")))),
    setCookie(name, value, expires) {
        var Days = 0.02,
            exp = new Date();
        const time = expires ? expires : exp.getTime() + Days * 24 * 60 * 60 * 1000;
        exp.setTime(time);
        document.cookie = name + "=" + value + ";expires=" + exp.toGMTString() + ";domain=" + App.Comm.doMain + ";path=/";
    },
    /*method for test, App.Comm.setExpires(-60*8) 设置过期时间为当前过期时间的8小时前.ie: myWebView.runScript('App.Comm.setExpires(20)', function (data) {
console.log(data)
            });*/
    setExpires(minutes) {
        // let baseTime = Number(this.getCookie('expires'));
        const baseTime = new Date().getTime();
        // console.log(baseTime)
        const time = baseTime + minutes * 1000 * 60;
        this.setCookie('expires', time);
        const newVar = {
            expires: time,
            expiresTime: new Date(time)
        };
        return newVar;
    },
    setNewCookies: function (data) {
        const current = new Date().getTime();
        let hours = 3;
        //todo set 1 hour increasing when to expire
        // hours = 1;
        // alert(data)
        const expires = current + 1000 * 60 * 60 * hours;
        for (const p in data) {
            this.setCookie(p, data[p], expires);
        }
        // Login.dispatchIE('/?commType=loginIn');
        if (navigator.userAgent.indexOf("QtWebEngine/5.7.0") > -1/*||/127.0.0.1/.test(location.href)*/) {
            window.open(`/update-cookies?${expires}`, '_blank');
            //alert(url)
            // window.open(location.href);
        }
    },
    //check cookies and update it if few time left that called when router change and files uploaded
    updateCookies() {
        const expires = this.getCookie('expires'), current = new Date().getTime();
        if (expires === undefined) {
            return;
        }
        if (expires - current < 1000 * 60 * 60 /*|| true*/) {
            const data = {
                URLtype: "fetchNewCookies",
            };
            Promise.resolve(App.Comm.ajax(data)).then(data => {
                // alert(data)
                this.setNewCookies(data.data);
            }).catch((err) => {
                window.location.href = "login.html" + window.location.search;
                // fetch('dataJson/services/delayCookieTime.json').then(response => {
                //     return response.json();
                // }).then(data => {
                //     this.setNewCookies(data.data);
                // })
            })
        }
    },
    //获取cookie
    getCookie: function (key, cookis) {
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
        // debugger;
        var exp = new Date();
        exp.setTime(exp.getTime() - 31 * 24 * 60 * 60 * 1000);
        var cval = this.getCookie(name);
        if (cval != null)
            document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString() + ";domain=" + App.Comm.doMain + ";path=/";
    },
    clearCookie() {
        // debugger;
        var keys = this.cookieNames(document.cookie); //  document.cookie.match(/[^ =;]+(?=\=)/g);
        if (keys) {
            for (var i = keys.length; i--;)
                document.cookie = keys[i] + "=0;expires=" + new Date(0).toUTCString() + ";domain=" + App.Comm.doMain + ";path=/";
        }
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
    //设置cookie 时间
    setCookieTime(min) {
        var exp = new Date(),
            keys = this.cookieNames(document.cookie);
        exp.setTime(exp.getTime() + min * 60 * 1000);
        if (keys) {
            for (var i = keys.length; i--;)
                document.cookie = keys[i] + "=" + this.getCookie(keys[i]) + ";expires=" + exp.toGMTString() + ";domain=" + App.Comm.doMain + ";path=/";
        }
        App.Comm.dispatchIE('?commType=setCookieTime');
    },
    //校验cookie
    checkCookie(cookies) {

        //用户重新登录了
        if (App.Comm.getCookie("userId") != App.Comm.getCookie("userId", cookies)) {
            App.Comm.clearCookie();
            if (cookies) {
                var keys = App.Comm.cookieNames(cookies),
                    val;
                for (var i = 0; i < keys.length; i++) {
                    val = App.Comm.getCookie(keys[i], cookies);
                    val && App.Comm.setCookie(keys[i], val);
                }
            }
            App.Comm.getUserInfo();
            if (navigator.userAgent.indexOf("QtWebEngine/5.7.0") === -1) {
                window.location.reload();
            }
        }
    },
    //格式化 文件大小
    formatSize: function (size) {
        if (size === undefined || /\D/.test(size)) {
            return '';
        }
        if (size >= 1073741824) {
            return (size / 1073741824).toFixed(2) + 'GB';
        }
        if (size >= 1048576) {
            return (size / 1048576).toFixed(2) + 'MB';
        } else if (size >= 6) {
            return (size / 1024).toFixed(2) + 'KB';
        } else {
            return size + 'b';
        }
    },
    changeTimeHandle(time) {//时间转换
        var timeStr = new Date(time);
        timeStr = timeStr.getFullYear() + "-" + (timeStr.getMonth() + 1) + "-" + timeStr.getDate();
        return timeStr;
    },
    //收起和暂开
    navBarToggle: function ($el, $content, dirc, Viewer) {
        var dircWidth, mDirc;
        if ($el.is(":animated")) return;
        if (dirc == "left") {
            mDirc = "margin-left";
        } else {
            mDirc = "margin-right";
        }
        dircWidth = parseInt($el.css(mDirc));
        if (dircWidth >= 0) {
            var width = $el.width(),
                ani = {};
            ani[mDirc] = -width;
            $el.animate(ani, 500, function () {
                $el.find(".dragSize").hide().end().find(".slideBar i").toggleClass('icon-caret-left icon-caret-right');
                //$content.css(mDirc, 0);
                if (Viewer) {
                    //Viewer.resize();
                }
            });
        } else {
            var ani = {}
            ani[mDirc] = "0px";
            $el.animate(ani, 500, function () {
                $el.find(".dragSize").show().end().find(".slideBar i").toggleClass('icon-caret-left icon-caret-right');
                //$content.css(mDirc, $el.width());
                if (Viewer) {
                    //Viewer.resize();
                }
            });
        }
    },
    //拖拽改变尺寸
    dragSize: function (event, $el, $content, dirc, Viewer) {
        var initX = event.pageX,
            isLeft = dirc == "left" ? true : false,
            initWidth = $el.width();
        var $target = $(event.target);
        $(document).on("mousemove.dragSize", function (event) {
            var newWidth;
            if (isLeft) {
                newWidth = initWidth + event.pageX - initX;
            } else {
                newWidth = initWidth + initX - event.pageX;
            }
            $el.width(newWidth);
        });
        $(document).on("mouseup.dragSize", function () {
            $(document).off("mouseup.dragSize");
            $(document).off("mousemove.dragSize");
            var contentWidth = $content.width(),
                leftNavWidth = $el.width(),
                gap = leftNavWidth - initWidth;
            var mPos = "margin-right";
            if (isLeft) {
                mPos = "margin-left";
            }
            if (contentWidth - gap < 10) {
                var maxWidth = initWidth + contentWidth - 10;
                $el.width(maxWidth);
                //$content.css(mPos, maxWidth);
            } else {
                //$content.css(mPos, leftNavWidth);
            }
            if (Viewer) {
                Viewer.resize();
            }
        });
        return false;
    },
    managePoint: function (data) {
        App.Comm.viewpointView(data);
    },
    //下载
    checkDownLoad: function (projectId, projectVersionId, fileVersionId) {

        // if (!App.Comm.getCookie("OUTSSO_AuthToken")) {
        // 	// $.tip({
        // 	// 	message: "登录后下载",
        // 	// 	type: "alarm"
        // 	// });
        // 	window.location.href = "/login.html";
        // 	return;
        // }
        var checkData = {
            URLtype: "checkDownLoad",
            data: {
                projectId: projectId,
                versionId: projectVersionId,
                fileVersionId: fileVersionId
            }
        };
        App.Comm.ajax(checkData, function (data) {
            if (data.code == 0) {
                // //请求数据
                var data = {
                    URLtype: "downLoad",
                    data: {
                        projectId: projectId,
                        projectVersionId: projectVersionId
                    }
                };
                var data = App.Comm.getUrlByType(data);
                var url = data.url + "&fileVersionId=" + fileVersionId;
                window.location.href = url;
            } else {
                alert(data.message);
            }
        })
    },
    //文件后缀
    fileSuffix(type) {
        if (type == "rvt" || type == "dwg" || type == "folder" || type == 'rfa') {
            return type;
        } else {
            return "other";
        }
    },
    //初始化滚动条
    initScroll($target, axis) {

        //绑定过
        if (!$target || $target.hasClass("mCustomScrollbar")) {
            return;
        }
        var opts = {
            theme: 'minimal-dark',
            axis: axis,
            keyboard: {
                enable: true
            },
            scrollInertia: 0
        };
        if (axis.indexOf("x") > -1) {
            opts["set_width"] = "100%";
        }
        if (axis.indexOf("y") > -1) {
            opts["set_height"] = "100%";
        }
        $target.mCustomScrollbar(opts);
    },
    //获取url 参数
    GetRequest() {
        var url = location.search || location.href.substr(location.href.indexOf('?')); //获取url中"?"符后的字串
        var theRequest = new Object();
        if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            strs = str.split("&");
            for (var i = 0; i < strs.length; i++) {
                theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
            }
        }
        return theRequest;
    },
    //tip组件，使用示例
    // new App.Comm.Tip({message:'',type:'success',timeout:3000}).render().show();
    // 参数说明:message 显示的内容
    // 		 type 样式，三种可选success,common,alarm
    //		 timeout 自动关闭时间 默认2000,选填
    Tip: Backbone.View.extend({
        tagName: 'div',
        className: 'mmhTip',
        template: '<div class="content <%=type%>"><i></i><%=message%></div>',
        initialize: function (data) {
            this._userData = data;
        },
        render: function () {
            var _tpl = _.template(this.template);
            this.$el.html(_tpl(this._userData));
            return this;
        },
        show: function () {
            var _this = this;
            $('body').append(this.$el);
            this.$el.animate({
                top: '40px',
            }, 1000);
            setTimeout(function () {
                _this.$el.remove();
            }, _this._userData.timeout || 2000)
        }
    }),
    loadMessageCount: function (param) {
        if (param != undefined) {
            var _ = $('.messageCounter');
            var _c = Number(_.text()) + param;
            _.text(_c);
            if (_c <= 0) {
                _.first().hide();
            } else {
                _.first().show();
            }
            return
        }
        App.Comm.ajax({
            URLtype: 'fetchIMBoxList',
            data: {
                status: 0
            }
        }, function (res) {
            if (res.code == 0) {
                $('.messageCounter').html(res.data.totalItemCount);
                if (res.data.totalItemCount == 0) {
                    $('.messageCounter').first().hide();
                } else {
                    $('.messageCounter').first().show();
                }
            } else {
                $.tip({
                    message: res.message,
                    type: 'alarm'
                });
            }
        })
    },
    //检查是否是唯一的 模型
    setOnlyModel: function () {
        var onlyCount = App.Comm.getCookie("onlyCount");
        if (!onlyCount) {
            App.Comm.setCookie("onlyCount", 1);
            App.Global.onlyCount = 1;
        } else {
            onlyCount++;
            App.Comm.setCookie("onlyCount", onlyCount);
            App.Global.onlyCount = onlyCount;
        }
    },
    //关闭窗口
    checkOnlyCloseWindow: function () {
        var onlyCount = App.Comm.getCookie("onlyCount");
        //没加载过模型
        if (!onlyCount || !App.Global.onlyCount) {
            return;
        }
        if (onlyCount != App.Global.onlyCount) {
            if (navigator.userAgent.indexOf("Firefox") != -1 || navigator.userAgent.indexOf("Chrome") != -1) {
                // debugger;
                window.location.href = "about:blank";
                //window.close();
            } else {
                window.opener = null;
                window.open("", "_self");
                window.close();
            }
        }
        //重置 一直累加会溢出
        if (onlyCount == App.Global.onlyCount && App.Global.onlyCount > 100) {
            App.Comm.setCookie("onlyCount", 1);
            App.Global.onlyCount = 1;
        }
    },
    //獲取cook 和 localstore
    getCookAndStore: function () {
        return JSON.stringify({
            cookie: document.cookie,
            user: localStorage.getItem("user")
        });
    },
    //发布ie的消息
    dispatchIE(url, callback) {
        if (navigator.userAgent.indexOf("QtWebEngine/5.7.0") > -1) {
            if (url) {
                window.open(url);
            }
            if ($.isFunction(callback)) {
                callback();
            }
        }
    },
    //获取用户信息
    getUserInfo() {
        $.ajax({
            url: '/platform/user/current?t=' + (+new Date()),
            async: false,
        }).done(function (data) {
            //失败
            if (data.code != 0) {
                return;
            }
            //ie
            App.Comm.dispatchIE('/?commType=loginIn');
            localStorage.setItem("user", JSON.stringify(data.data));
        });
    },
    commentDragHandle() {//右侧拖拽按钮事件
        var commentDragBoxs = $("#commentDragBox");
        var divX,
            divY,
            commentDragBoxsHeight = commentDragBoxs.outerHeight() + 60;
        var commnentDragDiv = $("#commnentDragDiv");
        commentDragBoxs.on("mousedown", function (evt) {
            var evt = evt || event;
            console.log(evt.target.nodeName);
            if (evt.target.nodeName !== "SPAN") {
                if (commentDragBoxs.css("cursor") !== "move") return;
                commnentDragDiv.show();
                var startX = evt.pageX - $(this).offset().left;
                var startY = evt.pageY - $(this).offset().top;
                commnentDragDiv.on("mousemove", function (evt) {
                    var moveX = evt.pageX;
                    var moveY = evt.pageY;
                    if (moveY - startY <= 0) {
                        commentDragBoxs.css("right", 0).css("top", 0);
                    } else if (moveY - startY >= $(window).height() - commentDragBoxsHeight) {
                        commentDragBoxs.css("right", 0).css("top", $(window).height() - commentDragBoxsHeight);
                    } else {
                        commentDragBoxs.css("right", 0).css("top", moveY - startY);
                    }
                    return false;
                })
                commentDragBoxs.on("mousemove", function (evt) {
                    var moveX = evt.pageX;
                    var moveY = evt.pageY;
                    if (moveY - startY <= 0) {
                        commentDragBoxs.css("right", 0).css("top", 0);
                    } else if (moveY - startY >= $(window).height() - commentDragBoxsHeight) {
                        commentDragBoxs.css("right", 0).css("top", $(window).height() - commentDragBoxsHeight);
                    } else {
                        commentDragBoxs.css("right", 0).css("top", moveY - startY);
                    }
                    return false;
                })
                return false;
            }
        })
        commentDragBoxs.on("mouseup", function () {
            if (commentDragBoxs.css("cursor") !== "move") return;
            commnentDragDiv.hide().off('mousemove');
            commentDragBoxs.off('mousemove');
        })
        commnentDragDiv.on("mouseup", function () {
            if (commentDragBoxs.css("cursor") !== "move") return;
            $(this).hide().off('mousemove');
            commentDragBoxs.off('mousemove');
            return false;
        })
    },
    commentDragRenderHandle() {//初始化页面需要dom
        var tipDialogBox = $("#tipDialogBox");
        var dragDiv = $('<div class="commnentDragDiv" id="commnentDragDiv"></div>')
        var commentDragBox = $('<div class="commentDragBox" id="commentDragBox"><ul><li class="feedbackBox" id="feedbackBox"><span></span><em>' +
            (App.Local.data['online-service'].Fk || "建议反馈") +
            '</em></li><li></li><li class="contactOperationBox" id="contactOperationBox"><dl><dt><span></span>' +
            (App.Local.data['online-service'].Cus || '联系运维') +
            '</dt><dd>' +
            (App.Local.currentIsEn ? ' Tel：' : '电话：') +
            '010-85588326</dd><dd>' +
            (App.Local.currentIsEn ? '' : '运维') +
            'QQ：2272679460</dd></dl></li></ul></div>');
        if (tipDialogBox) {
            tipDialogBox.remove();
        }
        $("body").append(dragDiv);
        $("body").append(commentDragBox);
        this.commentDragOpenHandle();//右侧拖拽按钮点击事件
        this.commentDragHandle();//右侧拖拽按钮事件
    },
    commentDragOpenHandle() {//右侧拖拽按钮点击事件
        var commentDragBox = $("#commentDragBox");
        var feedbackBox = $("#feedbackBox");
        var feedbackBoxIcon = feedbackBox.find("span");
        var feedbackBoxText = feedbackBox.find("em");
        var contactOperationIcon = $("#contactOperationBox").find("span");
        var _this = this;
        feedbackBoxText.on("click", function () {
            App.Comm.feedbackDialogHandle();//建议反馈弹出层方法
            _this.hideFeedBackBox(false);
            return false;
        })
        // commentDragBox.on("click",function(){
        // 	return false;
        // })
        feedbackBoxIcon.on("click", function () {//建议反馈的图标点击事件
            _this.hideContactOperationBox(false);//隐藏运维方法liBox
            _this.hideFeedBackBox(true);//隐藏建议反馈方法liBox
            return false;
        })
        contactOperationIcon.on("click", function () {
            _this.hideFeedBackBox(false);
            _this.hideContactOperationBox(true);
            return false;
        })
        $(document).on("click", function () {
            _this.hideFeedBackBox(false);
            _this.hideContactOperationBox(false);
            commentDragBox.css("cursor", "move");
        })
    },
    hideFeedBackBox(isClose) {//隐藏建议反馈方法liBox
        var commentDragBox = $("#commentDragBox");
        var feedbackBox = $("#feedbackBox");
        var feedbackBoxText = feedbackBox.find("em");
        if (isClose) {
            if (!feedbackBox.hasClass('feedbackShowBox')) {
                feedbackBox.css({
                    position: "absolute",
                    background: "#005BAC",
                    right: 0,
                    top: 0,
                })
                feedbackBox.addClass('feedbackShowBox');
                feedbackBoxText.css("display", "block");
                feedbackBox.next("li").show();
                commentDragBox.css("cursor", "default");
            } else {
                feedbackBox.removeClass('feedbackShowBox');
                setTimeout(function () {
                    feedbackBox.css({
                        position: "relative",
                        background: "none",
                        right: 0,
                        top: 0,
                    })
                    feedbackBox.next("li").hide();
                    feedbackBoxText.css("display", "none");
                    commentDragBox.css("cursor", "move");
                }, 300)
            }
        } else {
            if (feedbackBox.hasClass('feedbackShowBox')) {
                feedbackBox.removeClass('feedbackShowBox');
                feedbackBoxText.css("display", "none");
                setTimeout(function () {
                    feedbackBox.css({
                        position: "relative",
                        background: "none",
                        right: 0,
                        top: 0,
                    })
                    feedbackBox.next("li").hide();
                }, 300)
            }
        }
    },
    hideContactOperationBox(isClose) {//隐藏运维人员liBox
        var commentDragBox = $("#commentDragBox");
        var contactOperationBox = $("#contactOperationBox");
        var contactOperationDd = contactOperationBox.find("dd");
        if (isClose) {
            if (!contactOperationBox.hasClass('contactOperationShowBox')) {
                contactOperationBox.css({
                    position: "absolute",
                    background: "#005BAC",
                    right: 0,
                    top: "40px",
                    "box-shadow": "0 2px 4px 0 rgba(0,0,0,0.43)",
                    "border-radius": "2px 0 0 2px"
                })
                contactOperationBox.addClass('contactOperationShowBox');
                commentDragBox.css("cursor", "default");
                contactOperationDd.fadeIn();
            } else {
                contactOperationBox.removeClass('contactOperationShowBox');
                setTimeout(function () {
                    contactOperationBox.css({
                        position: "relative",
                        background: "none",
                        right: 0,
                        top: 0,
                        "box-shadow": "none",
                        "border-radius": "none"
                    })
                    contactOperationDd.fadeOut();
                    commentDragBox.css("cursor", "move");
                }, 300)
            }
        } else {
            if (contactOperationBox.hasClass('contactOperationShowBox')) {
                contactOperationBox.removeClass('contactOperationShowBox');
                setTimeout(function () {
                    contactOperationBox.css({
                        position: "relative",
                        background: "none",
                        right: 0,
                        top: 0,
                        "box-shadow": "none",
                        "border-radius": "none"
                    })
                    contactOperationDd.fadeOut();
                }, 300)
            }
        }
    },
    feedbackRepalyDialogHandle(options) {//回复建议反馈的方法
        App.Comm.Settings.isReload = false;
        var tpl = _.templateUrl("/comm/tpl/commReplayFeedBack.html")();
        var self = this;
        var replayDialog = new App.Comm.modules.Dialog({
            title: (App.Local.data['online-service'].Fk || "建议反馈"),
            width: 600,
            isConfirm: false,
            isAlert: true,
            message: tpl,
            cssClass: "replayFeedbackDialog",
            okCallback: function () {
                self.addFeedBackHandle(this, options);//给当前反馈添加回复
                return false;
            },
            closeCallback: function () {
                if ($.isFunction(options.callbackHandle)) {
                    options.callbackHandle(App.Comm.Settings.isReload);
                }
            },
            readyFn() {
                this.find(".replayListBox").on("click", function (evt) {//删除回复
                    var evt = evt || event;
                    if (evt.target.nodeName == "I") {
                        var feedbackId = options.replayId;
                        ;
                        var deleteId = $(evt.target).data("deleteid");
                        self.deleteReplayHandle(feedbackId, deleteId, evt.target);
                    }
                })
                this.find(".attachMentBox").on("click", function (evt) {// 下载回复附件
                    var evt = evt || event;
                    if (evt.target.nodeName == "DT") {
                        var downloadid = $(evt.target).data('downloadid');
                        self.downloadAttchMentHandle(downloadid, $(evt.target));
                    }
                })
                if (options.fromMessage) {
                    this.find('.replayBox,.footer').hide();
                    this.find('.content').css("overflow", "hidden");
                    this.find('.replayFeedbackBox').css("padding-bottom", 10).css("max-height", 326);
                    this.find('.scrollBox').css("max-height", 316);
                    this.find('.replayListBox').addClass("lastNoBorder");
                }
                self.getFeedBackInfoHandle(this, options);//通过反馈id获取反馈的信息
            }
        })
    },
    addFeedBackHandle(_self, options) {//给当前反馈添加回复
        var _this = this;
        var user = JSON.parse(localStorage.getItem("user"));
        var flag = false;
        var feedBackDesc = _self.find("textarea").val();
        if (feedBackDesc == "") {
            $.tip({ message: '回复内容不能为空', type: 'alarm' });
            return false;
        }
        if (flag) return;
        flag = true;
        var addDataObj = {
            "adviceId": options.replayId,
            "content": feedBackDesc,
            "replyId": user.userId,
            "loginName": user.loginName,
            "replyName": user.name
        }
        App.Comm.ajax({
            URLtype: "addFeedBack",
            data: JSON.stringify(addDataObj),
            type: 'POST',
            contentType: "application/json",
        }).done(function (res) {
            var html = "";
            if (res.code == 0) {
                flag = false;
                var data = res.data;
                html += '<li>' +
                    '<label>' + data.content + '</label>' +
                    '<span class="replayName">' +
                    '<i class="deleteReplay" data-deleteid="' + data.id + '"></i>' +
                    '<span class="replayNameBox" title="' + data.replyName + '">' + data.replyName + '</span>' +
                    '<em>' + App.Comm.changeTimeHandle(data.replyTime) + '</em>' +
                    '</span>' +
                    '</li>'
                _self.find(".replayListBox").append(html);
                if (_self.find(".replayListBox").find("li").length > 0) {
                    _self.find(".replayListBox").find('.nullReplay').remove();
                }
                _self.find("textarea").val("");
                App.Comm.Settings.isReload = true;
            } else {
                $.tip({ message: res.message, type: 'alarm' });
            }
        })
    },
    getFeedBackInfoHandle(_self, options) {//通过反馈id获取反馈的信息
        var _this = this;
        var user = JSON.parse(localStorage.getItem("user"));
        App.Comm.ajax({
            URLtype: "getFeedBackInfo",
            data: JSON.stringify({
                id: options.replayId
            }),
            type: 'POST',
            contentType: "application/json",
        }).done(function (res) {
            if (res.code == 0) {
                var item = res.data.items[0];
                var html = "",
                    replayHtml = "";
                for (let i = 0, len = item.attachmentList.length; i < len; i++) {
                    html += '<dl>' +
                        '<dt class="isAttachMent" data-downloadid="' + item.attachmentList[i].id + '"></dt>' +
                        '<dd>' + item.attachmentList[i].attachmentName + '</dd>' +
                        '</dl>'
                }
                for (let i = 0, len = item.adviceReplys.length; i < len; i++) {
                    replayHtml += '<li>' +
                        '<label>' + item.adviceReplys[i].content + '</label>';
                    replayHtml += '<span class="replayName">';
                    if (user.userId == item.adviceReplys[i].replyId) {
                        if (!options.fromMessage) {
                            replayHtml += '<i class="deleteReplay" data-deleteid="' + item.adviceReplys[i].id + '"></i>';
                        }
                    }
                    replayHtml += '<span class="replayNameBox" title="' + item.adviceReplys[i].replyName + '">' + item.adviceReplys[i].replyName + '</span>' +
                        '<em>' + App.Comm.changeTimeHandle(item.adviceReplys[i].replyTime) + '</em>' +
                        '</span>' +
                        '</li>'
                }
                _self.find(".infoAdviceType span").html(App.AdminFeedBack.default.adviceTypeArr[item.adviceType]);
                _self.find(".infoTitle span").html(item.title);
                _self.find(".infoContent span").html(item.content);
                _self.find(".infoAttachMent").html(html);
                if (item.adviceReplys.length > 0) {
                    _self.find(".replayListBox").html(replayHtml);
                } else {
                    replayHtml += '<li class="nullReplay">暂无回复</li>'
                    _self.find(".replayListBox").html(replayHtml);
                }
            } else {
                $.tip({ message: res.message, type: 'alarm' });
            }
        })
    },
    deleteReplayHandle(feedbackId, deleteId, target) {//删除回复
        var parentTarget = $(target).parent().parent();
        var parentsTarget = $(target).parent().parent().parent();
        App.Comm.ajax({
            URLtype: "deleteFeedBack",
            type: "DELETE",
            data: {
                adviceId: feedbackId,
                replytId: deleteId
            },
        }).done(function (res) {
            if (res.code == 0) {
                parentTarget.remove();
                if (parentsTarget.find("li").length == 0) {
                    parentsTarget.append('<li class="nullReplay">暂无回复</li>');
                }
                App.Comm.Settings.isReload = true;
            } else {
                $.tip({ message: res.message, type: 'alarm' });
            }
        })
    },
    downloadAttchMentHandle(downloadid, $target) {// 下载回复附件
        var downloadDataObj = {
            URLtype: "downloadsOneFeedBack",
            data: {
                attachmentId: downloadid,
            }
        }
        App.Comm.previewFile({
            URLtype: 'attachPreview',

            attachmentId: downloadid,
            link: App.Comm.getUrlByType(downloadDataObj).url,
            // fail: () => {
            //     debugger;
            // }
        }, $target.next());
        // window.location.href = App.Comm.getUrlByType(downloadDataObj).url;
    },
    feedbackDialogHandle(options) {//建议反馈弹出层效果
        var _this = this;
        var tpl = _.templateUrl('/comm/tpl/commCreateFeedBack.html', true)();
        var user = JSON.parse(localStorage.getItem("user"));
        var commitData = {
            "title": "",//标题
            "adviceType": "",//类别
            "content": "",//内容
            "createId": user.userId,//上传人用户id
            "createName": user.name,//上传人姓名
            "loginName": user.loginName,//上传人姓名
            "attachmentList": []//附件列表
        }
        var objs = {
            title: (App.Local.data['online-service'].Fk || "建议反馈"),
            width: 600,
            isConfirm: false,
            isAlert: true,
            message: tpl,
            okCallback: function () {
                var self = this;
                commitData.title = self.find('#sugTitle').val().trim();
                commitData.content = self.find('#sugDescr').val().trim();
                var attachList = self.find('.attachList a.listItem');
                if (commitData.adviceType.length <= 0) {
                    $.tip({ message: (App.Local.data["online-service"].Ttbk || "类别不能为空"), type: 'alarm' });
                    return false;
                }
                if (commitData.title.length <= 0) {
                    $.tip({ message: (App.Local.data["online-service"].Stbk || '标题不能为空'), type: 'alarm' });
                    return false;
                }
                attachList.each(function () {
                    commitData.attachmentList.push({
                        id: $(this).data('id')
                    })
                })
                _this.submitFeedBackHandle(commitData, feedbackDialog);//提交建议反馈
            },
            readyFn: function () {
                var self = this;
                self.find(".selectCategroy").myDropDown({
                    zIndex: 95,
                    click: function ($item) {
                        commitData.adviceType = $item.data("val");
                    }
                });
                self.find('.upload').on("click", function () {
                    $('#inputSuggestFile').click();
                })
                self.find('#uploadIframeSuggest').on('load', function () {
                    var data = JSON.parse(this.contentDocument.body.innerText);
                    _this.afterUpload(data, self);
                })
                self.find('#inputSuggestFile').on('change', function () {
                    var maxSize = 1024 * 1024 * 50;
                    if (this.files[0].size <= maxSize) {
                        self.find('#uploadSuggestForm').submit();
                    } else {
                        $.tip({ message: "附件最大支持50M", type: 'alarm' });
                    }
                })
                self.find('.footer').prepend('<a style="float:left;cursor:pointer;color: #408cdf;" href="/#suggest" target="_blank" data-i18n="data.online.h-f">历史反馈</a>');
            }
        }
        var objs = $.extend({}, objs, options);
        var feedbackDialog = new App.Comm.modules.Dialog(objs);
    },
    submitFeedBackHandle(submitData, feedbackDialog) {//提交建议反馈
        App.Comm.ajax({
            URLtype: "serviceCommitSuggest",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(submitData)
        }, function (data) {
            $.tip({ message: (App.Local.data.system.Success || '操作成功') });
            feedbackDialog.close();
            setTimeout(function () {
                var locationHref = location.href;
                if (locationHref.indexOf('adminFeedBack') != -1) {
                    window.location.reload();//刷新当前页面
                }
            }, 2000)
        })
        return false
    },
    deleteFile: function (_this) {//删除上传的
        var target = $(_this);
        var replytId = $(_this).data('id');
        App.Comm.ajax({
            URLtype: "deleteFeedBackQT",
            type: "DELETE",
            data: {
                replytId: replytId
            },
        }).done(function (res) {
            if (res.code == 0) {
                target.parent().remove();
            } else {
                alert(res.message)
            }
        })
    },
    afterUpload: function (res, _this) {//上传之后
        if (res.code == 0) {
            _this.find('.attachList').append('<div><a title="' + res.data.attachmentName + '" data-id="' + res.data.attachmentId + '" href="javascript:;" onclick="App.Comm.download(this);" class="alink listItem">' + res.data.attachmentName + '</a>&nbsp;&nbsp;<a href="javascript:;" data-id="' + res.data.attachmentId + '" onclick="App.Comm.deleteFile(this)" >' +
                (App.Local.data['drawing-model'].Delete || '删除') +
                '</a></div>');
        }
    },
    download: function (_this) {//下载
        var id = $(_this).data('id');
        window.open('/platform/advice/feedback/download/' + id, '_blank');
    },
    initFormHandle() {
        var option = App.Comm.Settings.downloadDatas;
        var submitForm = $("#submitForm");
        var submitIfrem = $("#submitIfrem");
        if (submitForm) {
            submitForm.remove();
        }
        if (submitIfrem) {
            submitIfrem.remove();
        }
        var formIfrem = $('<iframe id="submitIfrem"></iframe>');
        var formEle = $('<form name="afdb" enctype="multipart/form-data" encoding="multipart/form-data" action="/platform/advice/feedback/export" id="submitForm">' +
            '<input type="hidden" name="title" value="' + option.title + '"/>' +
            '<input type="hidden" name="adviceType" value="' + option.adviceType + '"/>' +
            '<input type="hidden" name="createName" value="' + option.createName + '"/>' +
            '<input type="hidden" name="opTimeStart" value="' + option.opTimeStart + '"/>' +
            '<input type="hidden" name="opTimeEnd" value="' + option.opTimeEnd + '"/>' +
            '<input type="hidden" name="haveReply" value="' + option.haveReply + '"/>' +
            '<input type="hidden" name="ids" value="' + option.ids + '"/>' +
            '</form>');
        formIfrem.attr("name", "outputIfrem");
        formIfrem.css("display", "none");
        $("body").append(formIfrem);
        formEle.attr("method", "POST");
        formEle.attr("target", "outputIfrem");
        formEle.css('position', 'absolute');
        formEle.css('top', '-1200px');
        formEle.css('left', '-1200px');
        $("body").append(formEle);
        $("#submitForm").submit();
    },
    getDownloadDatas() {
        return JSON.stringify({
            downloadDatas: App.Comm.Settings.downloadDatas
        });
    },
    getUserInfoHandle(userInfoBox, userId) {//获取数据用户信息方法
        App.Comm.ajax({
            URLtype: "getUserInfo",
            data: {
                userid: userId,
            }
        }, function (data) {
            if (data.code == 0) {
                var dataObj = {
                    loginid: data.data.loginid,
                    orgPath: data.data.orgPath,
                    mobile: data.data.mobile,
                    photo: data.data.photo,
                    duty: data.data.duty,
                    username: data.data.username,
                    outersite: data.data.outersite
                };
                //todo test code
                // dataObj.outersite='0';
                let isOuterSite = Number(dataObj.outersite);
                const outersite = isOuterSite ? `(合作方)` : '';
                userInfoBox.find("dt").find("img").attr("src", dataObj.photo);
                userInfoBox.find(".userName").find("span").html(dataObj.username + outersite);
                userInfoBox.find(".accountNumber").find("span").html(dataObj.loginid);
                userInfoBox.find(".cellphone").find("span").html(dataObj.mobile);
                let $department = userInfoBox.find(".department_info");
                let depart = ''
                try {
                    depart = isOuterSite ? dataObj.orgPath.split('-').slice(-1)[0] : dataObj.orgPath;
                } catch (e) {
                    console.log('illegal department txt')
                }
                $department.find("span").html(depart);
                const department = isOuterSite ? '公司' : (App.Local.data.system.departments || '部门')
                $department.find('label').text(department + '：');
                userInfoBox.find(".duties").find("span").html(dataObj.duty);
                userInfoBox.find(".loading").hide();
                userInfoBox.find("dl").show();
            } else {
                alert(data.message)
            }
        })
    },
    notOpenDoc(data) {
        return data.fail || (() => {
            data.link && (location.href = data.link);
        })
    },
    isSpecialFileType(fileName) {
        if (typeof fileName === 'undefined') {
            return false;
        }
        const exclude = ['db', 'rvt', 'rfa', 'rte', 'dwg'];
        return exclude.includes(fileName.split('.').splice(-1)[0].trim());
    },
    disablePreview($target) {
        if (typeof $target === 'undefined') {
            return false;
        }
        const excludeType = [8, 9];

        const fileName = $target.data('name') || $target.text() || $target.attr('alt');
        return $target && this.isSpecialFileType(fileName) || excludeType.includes(Number($target.data('type')));
    },
    previewFile(data, $target) {
        const URLtype = data.URLtype ? { URLtype: data.URLtype } : { URLtype: "previewFile" }, notification = (App.Local.data.system.uen || `未知错误，请重试。`), notificationToOpen = (App.Local.data.system.opw || `正在打开，请稍候`);
        const fail = this.notOpenDoc(data)
        if (this.disablePreview($target)) {
            fail()
            return;
        }
        let dataRequest = isNaN(data) ? Object.assign({}, { data }) : {
            data: {

                projectId: App.Project.Settings.projectId,
                projectVersionId: App.Project.Settings.CurrentVersion.id,
                fileVersionId: data,
            },
        };
        dataRequest = Object.assign(dataRequest, URLtype)
        delete dataRequest.data.fail;
        $.tip({
            message: notificationToOpen,
            timeout: 5000,
            type: "alarm"
        });
        App.Comm.ajax(dataRequest, function (data) {
            if (data.message == "success") {
                if (data.data) {
                    window.open(data.data)
                } else {
                    // $target.prop("href", "javascript:void(0);");
                    // alert((App.Local.data["drawing-model"].TfCg || "模型转换中"));
                }
            } else if (data.code === 10000) {
                $.tip({
                    message: notification,
                    timeout: 5000,
                    type: "alarm"
                });
                // alert(notification)
            }
            else if (data.code === 1) {
                fail()
            }
            else {
                $.tip({
                    message: data.message,
                    timeout: 5000,
                    type: "alarm"
                });
                // alert(data.message);
            }
        }, fail);
    },
};
//模块
App.Comm.modules = {};
//跨路由调用数据
App.Comm.publicData = {
    services: {
        project: {
            projectId: "",
            projectName: ""
        }
    }
};






