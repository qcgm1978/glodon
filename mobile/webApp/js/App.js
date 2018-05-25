/*
write by wuweiwei
*/
var App = {
    version: "1.0.0",
    stateObject: {},
    defaults: {
        outer: undefined,
        yesKnow: false,
        atName: "",
        atNameList: null,
        atUserListData: [],//at用户提交时的数据
        atUserZanCunData: [],//at用户暂时存储的数据
        loadMoreText: "加载中...",
        loadMoreBottomText: "已经到底了",
    },

    resetScrollData: function () {
        if (localStorage.getItem('noticeObj')) {
            localStorage.removeItem('noticeObj');
        }
        if (localStorage.getItem('todoObj')) {
            localStorage.removeItem('todoObj');
        }
        // if(App.defaults.noticeObj){//如果是公告列表就取消滚动位置绑定
        //     App.defaults.noticeObj = undefined;
        // }
        if (App.defaults.resourceObj) {//如果是标准模型列表和族库列表就取消滚动位置绑定
            App.defaults.resourceObj = undefined;
        }
        if (App.defaults.projectObj) {//如果是项目列表就取消滚动位置绑定
            App.defaults.projectObj = undefined;
        }
        if (App.defaults.notesObj) {//批注列表取消滚动定位问题
            App.defaults.notesObj = undefined;
        }
        if (App.defaults.notesDetailsObj) {//批注详情页面评论功能列表取消定位问题
            App.defaults.notesDetailsObj = undefined;
        }
        if (App.defaults.maxCommentNumber) {//批注详情页面评论功能列表取消定位问题
            App.defaults.maxCommentNumber = undefined;
        }
        if (App.defaults.feedbackObj) {//建议反馈列表取消滚动定位问题
            App.defaults.feedbackObj = undefined;
        }
    },
    trimHandle: function (str) {//去掉所有空格
        return str.replace(/\s+/g, "");
    },
    hideNativeTitleBar: function (bool) {
        if (/127.0.0.1:81/.test(location.href)) {
            bool = false;
        }

        function myDeviceReadyListener() {
            cordova.exec(function () {
            }, function () {
            }, "WDNaviPlugin", "hiddenNavi", ["1"]);
            $("#mainHeader").css("display", "block");
        }

        if (bool) {
            document.addEventListener("deviceready", myDeviceReadyListener, false);
        } else {
            $("#mainHeader").show();
        }
    },
    hideMainMenu: function () {
        //隐藏主菜单(页面底部)
        var footer = document.getElementsByTagName("footer")[0];
        footer.style.display = "none";
    },
    getNewsNumHandle: function (callback) {//获取未读消息的条数
        var data = {
            status: 0,//未读条数
        }
        App.Comm.ajax({
            type: "get",
            url: App.Restful.urls.getMyNewsNumUrl,
            param: data,
            dataType: "json",
            success: function (data) {
                if (data.code == 0) {
                    callback(data.data);
                } else {
                    alert(data.message);
                }
            }
        })
    },
    showMainMenu: function () {
        //显示主菜单(页面底部)
        var footer = document.getElementsByTagName("footer")[0];
        footer.style.display = "block";
    },
    Switch: {
        useLocalJson: false,
        /*使用本地JSON文件*/
        useNoCache: true,
        /*动态加载js不缓存*/
        publishObject: "publish_config"
    },
    setTemplateSymbol: function () {
        template.startSymbol("{{");
        template.endSymbol("}}");
    },
    setViewBox: function (node) {
        var body = document.getElementsByTagName("body")[0];
        node.style.width = window.screen.width + "px";
        node.style.height = window.screen.height + "px";
    },
    setModelStyle: function () {
        //未使用
        $("footer").css("display", "none");
        $("#mainContainer").css("margin-bottom", "0");
        $("#mainContainer").css("bottom", "0");
    },
    resetFrameStyle: function () {
        $("footer").css("display", "block");
        $("#mainContainer").css("overflow", "auto");
        $("#mainContainer").css("padding-bottom", "1.656rem");
    },
    getRootElement: function () {
        this.rootDom = {};
        this.rootDom.$mainHeader = $("#mainHeader");
        this.rootDom.$mainContainer = $("#mainContainer");
        this.rootDom.$footer = $("footer");
    },
    footerNav: function () {
        $("#footerBox").on("click", "div.footer-box", function (evt) {
            var target = $(evt.target).closest("div.footer-box");
            target.addClass("footer-box-select").siblings().removeClass("footer-box-select");
        })
    },
    topCloseBtn: function () {
        $("#closeBtn").off("click");
        $("#closeBtn").on("click", function () {
            cordova.exec(null, null, "WDNaviPlugin", "backAction", ["1"]);
        })
    },
    init: function () {
        this.getOS();
        this.setTemplateSymbol();
        this.getRootElement();
        this.footerNav();
    },
    getOS: function () {
        var ua = window.navigator.userAgent;
        var mainContainer = $("#mainContainer");
        if (ua.indexOf("Android") > 0) {
            $("#mainHeader").find(".mobileBar").css("display", "none");
            var mainHeader = $("#mainHeader");
            var mainHeaderH = mainHeader.height();
            mainContainer.css("padding-top", mainHeaderH + "px");
        } else {
            var mainHeader = $("#mainHeader");
            var mainHeaderH = mainHeader.height();
            mainContainer.css("padding-top", mainHeaderH + "px");
        }
    },
    getUserInfo: function () { //获取用户id
    },
    searchHighlightHandle: function (regexpStr, str) {
        var regexpStrr = regexpStr;
        if (regexpStrr == "") {
            return str;
        } else {
            if (regexpStr == "(" || regexpStr == ")" || regexpStr == "[" || regexpStr == "]" || regexpStr == "{" || regexpStr == "}") {
                regexpStrr = "\\" + regexpStr;
            }
            var newRegExp = new RegExp(regexpStrr, "gi");
            var name = str.replace(newRegExp, function (i) {
                return '<span>' + i + '</span>'
            })
            return name;
        }
    },
    replaceKongGeHandle: function (str) {
        var newRegExp = /\s/g;
        var name = str.replace(newRegExp, '*');
        return name;
    },
    replaceXingHaoHandle: function (str) {
        var newRegExp = /\*/g;
        var name = str.replace(newRegExp, ' ');
        return name;
    },
    overflowHideHandle: function (str, len, bool) {//超出隐藏 是否省略号 ，str字符串，len截取长度，bool是否省略号
        var strLen = 0,
            returnStr = str,
            ellipsisStr = "...";
        if (!bool) {
            ellipsisStr = "";
        }
        for (var i = 0, iLen = str.length; i < iLen; i++) {
            if (str.charCodeAt(i) > 19968 && str.charCodeAt(i) < 40869) {
                strLen += 2;
            } else {
                strLen += 1;
            }
        }
        if (strLen > len) {
            returnStr = str.substring(0, len) + ellipsisStr;
        }
        return returnStr;
    }
};
App.init();
/**程序启动**/

App.Storage = {
    setData: function (key, value) {
        window.localStorage[key] = value;
    },
    getData: function (key) {
        return window.localStorage[key];
    }
}
App.UI = {
    Dialog: {
        initCommDialog: function () {
            this.commDlg = new wMobileDialog({
                className: "wMobileDialog",
                isClickClose: false,
                opacity: 0.3,
                maskColor: "#000",
                titleBar: {
                    caption: ""
                }
            });
        },
        showCommDialog: function (options) {
            var th = this;
            this.options = options;
            this.commDlg.show({
                container: $(".common_commDialog")[0],
                mask: true,
                title: options.title
            });
            if (options.hideTitleBar != undefined && options.hideTitleBar) {
                $(this.commDlg.dialog).find(".wMobileDialog-titleBar").hide();
            } else {
                $(this.commDlg.dialog).find(".wMobileDialog-titleBar").show();
            }
            options.element && (options.element.style.display = "block");
            this.commDlg.dialog.style.marginTop = "0";
            var parentNode = this.parentNode = options.element.parentNode;
            console.log(parentNode);
            if (options.titleColor != undefined) {
                $(this.commDlg.dialog).find(".wMobileDialog-title").css("color", options.titleColor);
            } else {
                $(this.commDlg.dialog).find(".wMobileDialog-title").css("color", "#000");
            }
            $(".common_commDialog .commDialogContainer").html("");
            $(".common_commDialog .commDialogContainer")[0].appendChild(options.element);
            if (options.cancelText != undefined) {
                $(this.commDlg.dialog).find(".commDialogCancel").html(options.cancelText);
            } else {
                $(this.commDlg.dialog).find(".commDialogCancel").html("取消");
            }
            if (options.okText != undefined) {
                $(this.commDlg.dialog).find(".commDialogOk").html(options.okText);
            } else {
                $(this.commDlg.dialog).find(".commDialogOk").html("确定");
            }
            $(this.commDlg.dialog).add(this.commDlg.dialog).show()
            $(".common_commDialog .commDialogButtons .commDialogCancel")[0].onclick = function (e) {
                if (options.oncancel != undefined) {
                    var r = options.oncancel(e);
                    if (r != undefined && !r) {
                        return;
                    }
                    parentNode && parentNode.appendChild(options.element);
                    th.commDlg.hide();
                } else {
                    parentNode && parentNode.appendChild(options.element);
                    th.commDlg.hide();
                }
            };
            $(".common_commDialog .commDialogButtons .commDialogOk")[0].onclick = function (e) {
                if (options.onok != undefined) {
                    var r = options.onok(e);
                    if (r != undefined && !r) {
                        return;
                    }
                    parentNode && parentNode.appendChild(options.element);
                    th.commDlg.hide();
                } else {
                    parentNode.appendChild(options.element);
                    th.commDlg.hide();
                }
            };
            $(this.commDlg.dialog).find(".commDialogCancel").css("width", "50%").show();
            $(this.commDlg.dialog).find(".commDialogOk").css("width", "50%").css("display", "block");
            return this.commDlg;
        },
        hideCommDialog: function () {
            this.parentNode.appendChild(this.options.element);
            this.commDlg.hide();
        },
        showMsgDialog: function (options) {
            var th = this;
            this.options = options;
            this.commDlg.show({
                container: $(".common_commDialog")[0],
                mask: true,
                title: options.title
            });
            $(this.commDlg.dialog).find(".wMobileDialog-titleBar").show();
            $(".common_commDialog .commDialogContainer").html(options.text);
            if (options.titleColor != undefined) {
                $(this.commDlg.dialog).find(".wMobileDialog-title").css("color", options.titleColor);
            } else {
                $(this.commDlg.dialog).find(".wMobileDialog-title").css("color", "#000");
            }
            if (options.css != undefined) {
                var v;
                for (v in options.css) {
                    $(".common_commDialog .commDialogContainer").css(v, options.css[v]);
                }
            }
            if (options.cancelText != undefined) {
                $(this.commDlg.dialog).find(".commDialogCancel").html(options.cancelText);
            } else {
                $(this.commDlg.dialog).find(".commDialogCancel").html("取消");
            }
            if (options.okText != undefined) {
                $(this.commDlg.dialog).find(".commDialogOk").html(options.okText);
            } else {
                $(this.commDlg.dialog).find(".commDialogOk").html("确定");
            }
            $(".common_commDialog .commDialogButtons .commDialogCancel")[0].onclick = function (e) {
                if (options.oncancel != undefined) {
                    var r = options.oncancel(e);
                    if (r != undefined && !r) {
                        return;
                    }
                }
                th.commDlg.hide();
            };
            $(".common_commDialog .commDialogButtons .commDialogOk")[0].onclick = function (e) {
                if (options.onok != undefined) {
                    var r = options.onok(e);
                    if (r != undefined && !r) {
                        return;
                    }
                }
                th.commDlg.hide();
            };
            $(this.commDlg.dialog).find(".commDialogCancel").css("width", "50%").show();
            $(this.commDlg.dialog).find(".commDialogOk").css("display", "block");
            return this.commDlg;
        },
        showTip: function (options) {
            /*
            options.text
            options.timeout
            */
            var node, body;
            node = document.getElementById("commonTip");
            if (node == null) {
                node = document.createElement("div");
                node.id = "commonTip";
                node.innerHTML = options.text;
                body = document.getElementsByTagName("body")[0];
                body.appendChild(node);
            } else {
                node.innerHTML = options.text;
                node.style.display = "block";
            }
            setTimeout(function () {
                node.style.display = "none";
            }, options.timeout || 2000);
        }
    },
    ImgDialog: {
        generateCarouselEle: function (imgHtmls, imgCommContent, imgBg) {
            imgHtmls = `<!-- Root element of PhotoSwipe. Must have class pswp. -->
<div class="pswp" tabindex="-1" role="dialog" aria-hidden="true">

    <!-- Background of PhotoSwipe.
         It's a separate element as animating opacity is faster than rgba(). -->
    <div class="pswp__bg"></div>

    <!-- Slides wrapper with overflow:hidden. -->
    <div class="pswp__scroll-wrap">

        <!-- Container that holds slides.
            PhotoSwipe keeps only 3 of them in the DOM to save memory.
            Don't modify these 3 pswp__item elements, data is added later on. -->
        <div class="pswp__container">
            <div class="pswp__item"></div>
            <div class="pswp__item"></div>
            <div class="pswp__item"></div>
        </div>

        <!-- Default (PhotoSwipeUI_Default) interface on top of sliding area. Can be changed. -->
        <div class="pswp__ui pswp__ui--hidden">
<!-- Preloader demo http://codepen.io/dimsemenov/pen/yyBWoR -->
                <!-- element will get class pswp__preloader--active when preloader is running -->
                <div class="pswp__preloader">
                    <div class="pswp__preloader__icn">
                      <div class="pswp__preloader__cut">
                        <div class="pswp__preloader__donut"></div>
                      </div>
                    </div>
                </div>
            <div class="pswp__top-bar">

                <!--  Controls are self-explanatory. Order can be changed. -->

                <div class="pswp__counter"></div>

                <!--<button class="pswp__button pswp__button&#45;&#45;close" title="Close (Esc)"></button>-->

                <!--<button class="pswp__button pswp__button&#45;&#45;share" title="Share"></button>-->

                <!--<button class="pswp__button pswp__button&#45;&#45;fs" title="Toggle fullscreen"></button>-->

                <!--<button class="pswp__button pswp__button&#45;&#45;zoom" title="Zoom in/out"></button>-->

                
            </div>

            <div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">
                <div class="pswp__share-tooltip"></div>
            </div>

            <!--<button class="pswp__button pswp__button&#45;&#45;arrow&#45;&#45;left" title="Previous (arrow left)">-->
            <!--</button>-->

            <!--<button class="pswp__button pswp__button&#45;&#45;arrow&#45;&#45;right" title="Next (arrow right)">-->
            <!--</button>-->

            <div class="pswp__caption">
                <div class="pswp__caption__center"></div>
            </div>

        </div>

    </div>

</div>`
            imgCommContent.find(".imgCommShowBox").html(imgHtmls);
            $("body").append(imgBg);
            $("body").append(imgCommContent);
            return imgHtmls;
        },
        showImgDialog: function (ele, showEle, callback) { //点击图片 弹出弹出层的方法
            var _this = this;
            var imgBg = $('<div class="imgCommBg"></div>');
            var imgCommContent = $('<div class="imgCommContentBg"><div class="imgCommContent"><div class="imgCommShowBox" id="imgCommShowBox"></div><div class="imgCommDeleteBtn">删除</div></div></div>');
            var key = "",
                target = "",
                targetName = "",
                targetParent = "",
                imgType = "",
                imgHtmls = "",
                showImgUrl = "";
            var osStr = navigator.userAgent;
            var isAndroid = osStr.indexOf('Android') > -1 || osStr.indexOf('Adr') > -1; //android终端
            var isiOS = !!osStr.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
            if (showEle) { //如果是添加图片的功能
                ele.on("click", "li", function (evt) {
                    evt.stopPropagation();
                    key = $(this).index();
                    target = $(evt.target);
                    targetName = target[0].tagName;
                    if (targetName == "IMG") {
                        showImgUrl = target.parent("li").attr("data-picurl");
                    }
                    if (key == 0) return;
                    imgHtmls = '<span><img id="imgScaleZoom" src="/' + showImgUrl + '"></span>';
                    imgCommContent.find(".imgCommShowBox").html(imgHtmls);
                    $("body").append(imgBg);
                    $("body").append(imgCommContent);
                    $(".imgCommDeleteBtn").show();
                    setTimeout(function () {
                        _this.bindDeleteBtnHandle("imgCommDeleteBtn", callback, key - 1); //删除按钮执行的方法
                        _this.imgDialogBindEvent("imgCommBg", "imgCommContentBg"); //绑定事件
                    }, 300)
                    if (isAndroid && !isiOS) {
                        cordova.exec(_this.suc, _this.fail, "WDClosePicturePlugin", "closePicture", [{ "isClose": "true" }]);//注册返回键事件
                    }
                    return false;
                })
            } else {
                ele.on("click", function (evt) {
                    evt.stopPropagation();
                    target = $(evt.target);
                    targetName = target[0].tagName;
                    targetParent = target.parent("p");
                    imgType = target.data("imgtype");
                    if (targetParent.length > 0 && !imgType) {
                        if (targetName == "IMG") {
                            showImgUrl = target.attr("src");
                        }
                        if (showImgUrl === '') {
                            return;
                        }
                        imgHtmls = '<span><img id="imgScaleZoom" src="' + showImgUrl + '"></span>';
                        imgCommContent.find(".imgCommShowBox").html(imgHtmls);
                        $("body").append(imgBg);
                        $("body").append(imgCommContent);
                        $(".imgCommDeleteBtn").hide();
                        setTimeout(function () {
                            _this.bindDeleteBtnHandle("imgCommDeleteBtn"); //删除按钮执行的方法
                            _this.imgDialogBindEvent("imgCommBg", "imgCommContentBg"); //绑定事件
                        }, 300)
                    } else {
                        if (!imgType) return;
                        if (targetName == "IMG") {
                            showImgUrl = target.attr("src");
                        }
                        imgHtmls = '<span><img id="imgScaleZoom" src="' + showImgUrl + '"></span>';
                        imgCommContent.find(".imgCommShowBox").html(imgHtmls);
                        $("body").append(imgBg);
                        $("body").append(imgCommContent);
                        $("#imgScaleZoom").on("load", function () {
                            var bodyH = $(".imgCommBg").height();
                            var imgH = $("#imgScaleZoom").height();
                            if (imgH > bodyH) {
                                $("#imgScaleZoom").height(bodyH);
                            }
                        })
                        $(".imgCommDeleteBtn").hide();
                        setTimeout(function () {
                            _this.bindDeleteBtnHandle("imgCommDeleteBtn"); //删除按钮执行的方法
                            _this.imgDialogBindEvent("imgCommBg", "imgCommContentBg"); //绑定事件
                        }, 300)
                    }
                    if (isAndroid && !isiOS) {
                        cordova.exec(_this.suc, _this.fail, "WDClosePicturePlugin", "closePicture", [{ "isClose": "true" }]);//注册返回键事件
                    }
                    _this.bindScaleZoom(); //缩放方法
                    return false;
                })
            }
        },
        //generate carousel. Invoke this method instead of showImgDialog
        showImgDialogCarousel: function (ele, showEle, callback) { //点击图片 弹出弹出层的方法
            var _this = this;
            var imgBg = $('<div class="imgCommBg"></div>');
            var imgCommContent = $('<div class="imgCommContentBg"><div class="imgCommContent"><div class="imgCommShowBox" id="imgCommShowBox"></div><div class="imgCommDeleteBtn">删除</div></div></div>');
            var key = "",
                target = "",
                targetName = "",
                targetParent = "",
                imgType = "",
                imgHtmls = "",
                showImgUrl = "";
            var osStr = navigator.userAgent;
            var isAndroid = osStr.indexOf('Android') > -1 || osStr.indexOf('Adr') > -1; //android终端
            var isiOS = !!osStr.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
            if (showEle) { //如果是添加图片的功能
                ele.on("click", "li", function (evt) {
                    evt.stopPropagation();
                    key = $(this).index();
                    target = $(evt.target);
                    targetName = target[0].tagName;
                    if (targetName == "IMG") {
                        showImgUrl = target.parent("li").attr("data-picurl");
                    } else {
                        var Dlg1 = App.UI.Dialog.showMsgDialog({
                            title: "提示",
                            text: "此文件正在上传"
                        });
                        $(Dlg1.dialog).find(".commDialogCancel").css("display", "none");
                        $(Dlg1.dialog).find(".commDialogOk").css("width", "100%");
                        return;
                    }
                    if (key == 0) return;
                    imgHtmls = _this.generateCarouselEle(imgHtmls, imgCommContent, imgBg);
                    $(".imgCommDeleteBtn").show();
                    setTimeout(function () {
                        _this.bindDeleteBtnHandle("imgCommDeleteBtn", callback, key - 1); //删除按钮执行的方法
                        _this.imgDialogBindEvent("imgCommBg", "imgCommContentBg"); //绑定事件
                        _this.renderCarousel(target);
                    }, 300)
                    if (isAndroid && !isiOS) {
                        cordova.exec(_this.suc, _this.fail, "WDClosePicturePlugin", "closePicture", [{ "isClose": "true" }]);//注册返回键事件
                    }
                    return false;
                })
            } else {
                ele.on("click", function (evt) {
                    evt.stopPropagation();
                    target = $(evt.target);
                    targetName = target[0].tagName;
                    targetParent = target.parent("p");
                    imgType = target.data("imgtype");
                    if (targetParent.length > 0 && !imgType) {
                        if (targetName == "IMG") {
                            showImgUrl = target.attr("src");
                        }
                        if (showImgUrl === '') {
                            return;
                        }
                        imgHtmls = '<span><img class="imgScaleZoom" src="' + showImgUrl + '"></span>';
                        imgCommContent.find(".imgCommShowBox").html(imgHtmls);
                        $("body").append(imgBg);
                        $("body").append(imgCommContent);
                        $(".imgCommDeleteBtn").hide();
                        setTimeout(function () {
                            _this.bindDeleteBtnHandle("imgCommDeleteBtn"); //删除按钮执行的方法
                            _this.imgDialogBindEvent("imgCommBg", "imgCommContentBg"); //绑定事件
                        }, 300)
                    } else {
                        if (!imgType) return;
                        imgHtmls = _this.generateCarouselEle(imgHtmls, imgCommContent, imgBg);
                        $(".imgCommDeleteBtn").hide();
                        setTimeout(function () {
                            _this.bindDeleteBtnHandle("imgCommDeleteBtn"); //删除按钮执行的方法
                            _this.imgDialogBindEvent("imgCommBg", "imgCommContentBg"); //绑定事件
                            _this.renderCarousel(target);
                            // $.each($('.imgScaleZoom'), function (i, n) {
                            //     _this.bindScaleZoom(n); //缩放方法
                            // })
                        }, 300)
                    }
                    if (isAndroid && !isiOS) {
                        cordova.exec(_this.suc, _this.fail, "WDClosePicturePlugin", "closePicture", [{ "isClose": "true" }]);//注册返回键事件
                    }
                    return false;
                })
            }
        },
        arrSrc: [],
        renderCarousel: function ($target) {
            // alert($target.attr('src'))
            var _this = this;
            var promise = new Promise(function (resolve, reject) {
                let $imgs = $target.parents('.J_thumbnail').find('img');
                let imgLength = $imgs.length;
                $.each($imgs, function (i, n) {
                    let isAddBtn = /add.png$/.test($(n).attr("src"));
                    if (isAddBtn) {
                        imgLength -= 1;
                        return;
                    }
                    var imgSrc = $(n).attr("src");
                    let picUrl = $(n).parent().data('picurl');
                    var src = picUrl === undefined ? imgSrc : ('/' + picUrl);
                    _this.arrSrc.push({
                        w: $(n).data('width') /*|| screen.width*/ || 40, h: $(n).data('height')/*||screen.height*2/3*/ || 40, src: src,
                        name: $(n).parent().attr('name')
                    });
                    // _this.getImgMetrics(src, i, imgLength, resolve);
                });
                resolve(_this.arrSrc)
                _this.arrSrc = []
            });
            promise.then(function (data) {
                // alert(data.length)
                // alert(data[0].src)
                var options = {
                    // optionName: 'option value'
                    // for example:
                    loop: false,
                    history: false,
                    pinchToClose: false,
                    closeOnVerticalDrag: false,
                    // showHideOpacity:true,
                    // getThumbBoundsFn:false,
                    index: $target.data('index')
                };
                // data.sort(function (a, b) {
                //     return (a.index > b.index) ? 1 : ((b.index > a.index) ? -1 : 0);
                // });
                _this.iniSwipe(document.querySelectorAll('.pswp')[0], data, options);
            })
        },
        iniSwipe: function (pswpElement, items, options) {
            // Initializes and opens PhotoSwipe
            var _this = this;
            this.gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options), _this = this;
            // this.gallery.listen('beforeChange', function () {
            //     debugger;
            // });
            this.gallery.listen('gettingData', function (index, item) {
                if (/*item.html === undefined &&*/ item.onloading === undefined && (item.w <= 40 || item.h <= 40)) { // unknown size
                    var img = new Image();
                    img.onload = function () { // will get size after load
                        item.w = this.width; // set image width
                        item.h = this.height; // set image height
                        _this.gallery.invalidateCurrItems(); // reinit Items
                        _this.gallery.updateSize(true); // reinit Items
                    }
                    img.src = item.src; // let's download image
                    item.onloading = true;
                }
            });
            this.gallery.init();
            this.gallery.framework.bind(this.gallery.scrollWrap /* bind on any element of gallery */, 'pswpTap', function (e) {
                // debugger;
                _this.gallery.close();
                $(".imgCommContentBg,.imgCommBg").remove();
                console.log('tap', e, e.detail);
                // e.detail.origEvent  // original event that finished tap (e.g. mouseup or touchend)
                // e.detail.target // e.target of original event
                // e.detail.releasePoint // object with x/y coordinates of tap
                // e.detail.pointerType // mouse, touch, or pen
            });
        },
        suc: function () {//注册返回键事件
            $(".imgCommBg").remove()
            $(".imgCommContentBg").remove();
            cordova.exec(this.suc, this.fail, "WDClosePicturePlugin", "closePicture", [{ "isClose": "false" }]);//注册返回键事件
        },
        fail: function () {
        },
        bindScaleZoom: function (ele) { //图片缩放功能方法
            ele = ele || document.getElementById("imgScaleZoom");
            var hammerBox = new Hammer(ele);
            var pinchscale = 1.0,
                pinchstartscale = 1.0,
                maxX = 0,
                maxY = 0,
                startPosX = 0,
                startPosY = 0,
                PosX = 0,
                PosY = 0,
                baseScale = 1,
                minScale = 0.5,
                maxScale = 10,
                movePosX = 0,
                movePosY = 0;
            var imgScaleZoom = $(ele);
            hammerBox.get('pinch').set({
                enable: true
            });
            hammerBox.get('pan').set({
                direction: Hammer.DIRECTION_ALL
            })
            hammerBox.on("pinchstart", function (ev) {
                imgScaleZoom.css("max-width", "auto");
                imgScaleZoom.css("max-height", "auto");
                imgScaleZoom.css("left", "auto");
                imgScaleZoom.css("top", "auto");
                pinchstartscale = pinchscale;
            });
            hammerBox.on("pinchmove", function (ev) {
                if (pinchstartscale * ev.scale >= minScale && pinchstartscale * ev.scale <= maxScale) {
                    imgScaleZoom.css("transform", "scale(" + pinchstartscale * ev.scale, pinchstartscale * ev.scale + ")");
                }
            });
            hammerBox.on("pinchend", function (ev) {
                if (pinchstartscale * ev.scale < baseScale) {
                    imgScaleZoom.css("transform", "scale(" + baseScale + "," + baseScale + ")");
                    pinchscale = baseScale;
                } else if (pinchstartscale * ev.scale > maxScale) {
                    pinchscale = maxScale;
                } else if (pinchstartscale * ev.scale >= baseScale && pinchstartscale * ev.scale <= maxScale) {
                    pinchscale = pinchstartscale * ev.scale;
                }
                maxX = imgScaleZoom.offset().left;
                maxY = imgScaleZoom.offset().top;
                PosX = 0;
                PosY = 0;
            });
            hammerBox.on("panstart", function (ev) {
                if (pinchscale > 1) {
                    movePosX = PosX;
                    movePosY = PosY;
                }
            })
            hammerBox.on("panmove", function (ev) {
                if (pinchscale > 1) {
                    if (maxX < 0) {
                        if ((movePosX + ev.deltaX) <= maxX) {
                            PosX = maxX;
                        } else if ((movePosX + ev.deltaX) >= Math.abs(maxX)) {
                            PosX = -maxX;
                        } else {
                            PosX = movePosX + ev.deltaX;
                        }
                    }
                    if (maxY < 0) {
                        if ((movePosY + ev.deltaY) <= maxY) {
                            PosY = maxY;
                        } else if ((movePosY + ev.deltaY) >= Math.abs(maxY)) {
                            PosY = -maxY;
                        } else {
                            PosY = movePosY + ev.deltaY;
                        }
                    }
                    imgScaleZoom.css("left", PosX + "px").css("top", PosY + "px");
                }
            })
            hammerBox.on("panend", function (ev) {
                if (maxX < 0) {
                    if ((movePosX + ev.deltaX) <= maxX) {
                        PosX = maxX;
                    } else if ((movePosX + ev.deltaX) >= Math.abs(maxX)) {
                        PosX = -maxX;
                    } else {
                        PosX = movePosX + ev.deltaX;
                    }
                }
                if (maxY < 0) {
                    if ((movePosY + ev.deltaY) <= maxY) {
                        PosY = maxY;
                    } else if ((movePosY + ev.deltaY) >= Math.abs(maxY)) {
                        PosY = -maxY;
                    } else {
                        PosY = movePosY + ev.deltaY;
                    }
                }
            })
        },
        bindDeleteBtnHandle: function (ele, callback, index) { //删除按钮执行的方法
            var $ele = $("." + ele);
            $ele.on("click", function (evt) {
                callback(index);
            })
        },
        imgDialogBindEvent: function (ele1, ele2) { //绑定事件
            var $ele1 = $("." + ele1);
            var $ele2 = $("." + ele2);
            var osStr = navigator.userAgent;
            var isAndroid = osStr.indexOf('Android') > -1 || osStr.indexOf('Adr') > -1; //android终端
            var isiOS = !!osStr.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
            $ele1.on("click", function () {
                $(this).remove()
                $(".imgCommContentBg").remove();
                if (isAndroid && !isiOS) {
                    cordova.exec(this.suc, this.fail, "WDClosePicturePlugin", "closePicture", [{ "isClose": "false" }]);//注册返回键事件
                }
            })
            $ele2.on("click", function (evt) {
                $(this).remove()
                $(".imgCommBg").remove();
                $('#addImgBtn').show();
                if (isAndroid && !isiOS) {
                    cordova.exec(this.suc, this.fail, "WDClosePicturePlugin", "closePicture", [{ "isClose": "false" }]);//注册返回键事件
                }
            })
        }
    }
};
App.UI.Dialog.initCommDialog();
App.TitleBar = {
    PopMenu: {
        /*所有弹出式菜单*/
        callback: undefined,
        menuList: {
            model: [{
                name: "commentList",
                value: "批注列表"
            }, {
                name: "gotoHome",
                value: "返回首页"
            }],
            modelNotesImg: [{
                name: "downloadImg",
                value: "下载图片"
            }, {
                name: "lookModel",
                value: "查看模型"
            }, {
                name: "gotoHome",
                value: "返回首页"
            }],
        },
        createMenu: function (menuName, f) {
            var htmltpl = '<div class="popMenuItem" name={name}>{caption}</div>';
            var html, htmls = "";
            var i;
            var menuList = this.menuList[menuName];
            for (i = 0; i < menuList.length; i++) {
                html = htmltpl;
                html = html.replace("{name}", menuList[i].name);
                html = html.replace("{caption}", menuList[i].value);
                htmls += html;
            }
            var $menuContainer = $("#headerPopMenu .popMenuContent");
            $menuContainer.html(htmls);
            this.callback = f;
            $(document).on("click", function () {
                var $headerPopMenu = $("#headerPopMenu");
                if ($headerPopMenu.css("display") == "block") {
                    $headerPopMenu.css("display", "none");
                }
            })
            $("#mainHeader .header-popMenu")[0].onclick = function (e) {
                e.stopPropagation();
                var $headerPopMenu = $("#headerPopMenu");
                if ($headerPopMenu.css("display") == "block") {
                    $headerPopMenu.css("display", "none");
                } else {
                    $headerPopMenu.css("display", "block");
                }
            }
        },
        bindEvent: function () {
            var th = this;
            var $menuContainer = $("#headerPopMenu .popMenuContent");
            $menuContainer.on("click", ".popMenuItem", function (e) {
                if (th.callback != undefined) {
                    th.callback.call(this, e);
                    $("#headerPopMenu").css("display", "none");
                }
            });
        }
    },
    setTitle: function (title) {
        if (title == undefined) {
            $("#mainHeaderTitle").html("万达筑云项目管理平台");
        } else {
            $("#mainHeaderTitle").html(title);
        }
    },
    returnCallback: function (f, callback) {
        /*
        f=function(){}
        f="#/abc/def"
        */
        var $headerReturn = App.rootDom.$mainHeader.find("header").find(".header-return");
        if (typeof (f) == "string") {
            $headerReturn[0].onclick = null;
            $headerReturn.find("a").attr("href", f);
        } else {
            $headerReturn.find("a").attr("href", "javaScript:;");
            $headerReturn[0].onclick = function () {
                f();
                setTimeout(function () {
                    callback && callback();
                }, 1000);
            }
        }
    },
    hideAllPopMenu: function () {
        document.addEventListener("click", function (e) {
            var target = e.target || e.srcElement;
            if (target.className == "headerPopMenu" || target.contains()) {
            }
        }, false);
    },
    initPopMenu: function (menuName) {
        // var popMenu = this.PopMenu[menuName];
        // var i,menuItemTpl,menuItem;
        // menuItemTpl = '<div class="popMenuItem"><i class="{icon}"></i>{caption}</div>';
        // for(i=0;i<popMenu.length;i++)
        // {
        // 	menuItem = menuItemTpl.replace("{icon}",popMenu[i].icon).replace("{caption}",popMenu[i].caption);
        // 	$("#headerPopMenu .popMenuContent").append(menuItem);
        // }
    },
    showClose: function () {
        $("#mainHeader .header-return").hide();
        $("#mainHeader .header-close").show();
    },
    showReturn: function () {
        $("#mainHeader .header-close").hide();
        $("#mainHeader .header-return").show();
    },
    showPopMenuBtn: function (menuName, f) {
        $("#mainHeader .header-popMenu").show();
        $("#mainHeader .header-popMenu-home").hide();
        if (arguments.length != 0) {
            this.PopMenu.createMenu(menuName, f);
        }
    },
    hidePopMenuBtn: function () {
        $("#mainHeader .header-popMenu").hide();
    },
    showHomeBtn: function () {
        $("#mainHeader .header-popMenu").hide();
        $("#mainHeader .header-popMenu-home").show();
    },
    hideHomeBtn: function () {
        $("#mainHeader .header-popMenu").hide();
        $("#mainHeader .header-popMenu-home").hide();
    }
};
App.TitleBar.PopMenu.bindEvent();
App.Comm = {
    requireCache: [],
    /*缓存js文件路径,用于判断js文件是否加载*/
    ajax: function (options) {
        /*
        options 与$.ajax()相同
        增加的参数：
        options.param = {key:value} ; 匹配URL(options.url)里的参数
        */
        var th = this;
        var url = options.url;
        var v;
        for (v in options.param) {
            url = url.replace("{" + v + "}", options.param[v]);
        }
        $.ajax({
            url: url,
            type: options.type || "get",
            dataType: options.dataType || "html",
            data: options.data || {},
            cache: options.cache || false,
            contentType: options.contentType || "text/html",
            success: function (data) {
                var _data;
                _data = th.ajaxHandle(data);
                if (options.success != undefined) {
                    options.success.call(th, _data);
                }
            },
            error: function (e) {
                if (options.error != undefined) {
                    options.error.call(th, e);
                }
            },
            complete: function () {
                options.failCallback && options.failCallback()
            }
        });
    },
    ajaxHandle: function (data) {
        return data;
    },
    require: function (url) {
        var index = url.lastIndexOf(".");
        var type = url.substring(index + 1);
        var time = "";
        var i, isFail = false;
        /*isFail*/
        // if (App.Switch.useNoCache) {
        //     time = "?time=" + (new Date()).getTime();
        // }
        // if (App.Switch.publishObject != undefined) {
        //     var publishObject = eval(App.Switch.publishObject);
        //     var urls = publishObject.pkg[url];
        //     if (publishObject.pkg[url] != undefined) {
        //         for (i = 0; i < urls.length; i++) {
        //             if (App.Comm.requireCache.indexOf(urls[i]) == -1) /*加载过不再加载*/ {
        //                 App.Comm.requireCache.push(urls[i]);
        //             } else {
        //                 continue;
        //             }
        //             if (type == "js") {
        //                 $("head").append('<script type="text/javascript" src="' + urls[i] + time + '"></script>');
        //             } else if (type = "css") {
        //                 $("head").append('<link rel="styleSheet" href="' + urls[i] + time + '" />');
        //             }
        //         }
        //     } else {
        //         isFail = true;
        //     }
        // }
        /*end if config*/
        //加载过不再加载,加载实际路径
        // if (isFail && App.Comm.requireCache.indexOf(url) == -1) {
        //     App.Comm.requireCache.push(url);
        // } else {
        //     return;
        // }
        if (type == "js") {
            $("head").append('<script type="text/javascript" src="' + url + time + '"></script>');
        } else if (type = "css") {
            $("head").append('<link rel="styleSheet" href="' + url + time + '" />');
        }
    },
    preLoadImages: function (arr) { /*arr is url list*/
        var i, img;
        img = new Image();
        img.onload = function (e) {
            console.log("image:", e);
        }
        for (i = 0; i < arr.length; i++) {
            img.src = arr[i];
        }
    },
    getUserInfoHandle: function (userInfoBox, userId) {//获取数据用户信息方法
        // new wMobileDialog().createPublic();
        $('#wMobile_mask').show();
        userInfoBox.show().find("dl,.loading").toggle()
        App.Comm.require("css/profile.css");
        App.Comm.ajax({
            url: App.Restful.urls.getUserInfo,
            data: {
                userid: userId,
            },
            success: function (data) {
                data = JSON.parse(data)
                if (data.code == 0) {
                    var dataObj = {
                        loginid: data.data.loginid,
                        orgPath: data.data.orgPath,
                        mobile: data.data.mobile,
                        photo: data.data.photo,
                        duty: data.data.duty,
                        username: data.data.username,
                        outersite: data.data.outersite
                    }
                    var isOuterSite = Number(dataObj.outersite);
                    var depart = ''
                    try {
                        depart = isOuterSite ? dataObj.orgPath.split('-').slice(-1)[0] : dataObj.orgPath;
                    } catch (e) {
                        console.log('illegal department txt')
                    }
                    var department = isOuterSite ? '公司' : ('部门');
                    userInfoBox.find("dt").find("img").attr("src", '/' + dataObj.photo);
                    userInfoBox.find(".userName").find("span").html(dataObj.username).attr("title", dataObj.username);
                    userInfoBox.find(".accountNumber").find("span").html(dataObj.loginid).attr("title", dataObj.loginid);
                    userInfoBox.find(".cellphone").find("span").html(dataObj.mobile).attr("title", dataObj.mobile);
                    userInfoBox.find(".department_info").find("span").html(depart).attr("title", depart).end().find('label').text(department + '：');
                    userInfoBox.find(".duties").find("span").html(dataObj.duty).attr("title", dataObj.duty);
                    userInfoBox.find(".loading").hide();
                    userInfoBox.find("dl").show();
                } else {
                    alert(data.message)
                }
            }
        })
    },
    disableOpen: function ($ele) {
        const arr = ['dwg', 'rvt', 'rfa', 'rte'];
        let text = $ele.text();
        let disableFile = /All|AXIS/i.test(text) || $ele.data('modelstatus') === '' || $ele.data('modelstatus') === 1;
        return !$ele.data('isfolder') && disableFile;
    },
    isConverting: function ($target) {
        return $target.data('modelstatus') === 1
    },
};