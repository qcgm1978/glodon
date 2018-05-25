//@ sourceURL=App.ServiceFeedback.js
App.ServiceFeedback = {
    defaults: {
        pageIndex: 1,
        pageNum: 10,
        hrefstr: '',
        listScroll: '',
        moreFlag: true,
    },
    init: function(arge) {
        var _this = this;
        this.initHtml();
        $(function() {
            if(App.defaults.feedbackObj){
                _this.defaults.pageIndex = App.defaults.feedbackObj.pageIndex;
                _this.defaults.pageNum = App.defaults.feedbackObj.pageIndex*10;
            }
            _this.initHandle(); //初始化页面的方法
            if (!App.defaults.userData) {
                App.Comm.ajax({
                    url: App.Restful.urls.current,
                    success: function(data) {
                        var jsonData = $.parseJSON(data);
                        if (jsonData.code == 0) {
                            App.defaults.userData = jsonData.data;
                            _this.loadData(); //获取建议反馈列表的方法
                        } else {
                            alert(data.message);
                        }
                    }
                });
            } else {
                _this.loadData(); //获取建议反馈列表的方法
            }
        })
    },
    initScrollHandle: function() { //初始化滚动条的方法
        var _this = this;
        var listFeedbackBoxBox = $("#listFeedbackBoxBox");
        var loadMore = $(".loadMore");
        this.defaults.listScroll = new IScroll('#listFeedbackBoxBox', {
            mouseWheel: true, //鼠标滚轮
            probeType: 3, //像素级触发 执行回调
            scrollbars: false, //滚轴是否显示默认是
            truebounceTime: 600, //弹力动画持续的毫秒数
            click: true,
        });
        if(App.defaults.feedbackObj){
            this.defaults.listScroll.scrollTo(0, App.defaults.feedbackObj.scrollPos, 10);
        }
        this.defaults.listScroll.on('scroll', function() {
            if (this.directionY == 1) {
                if (this.y < this.maxScrollY) {
                    loadMore.show();
                }
            }
        });
        this.defaults.listScroll.on('scrollEnd', function() {
            App.defaults.feedbackObj = {
                scrollPos:this.y
            }
            if (this.y == this.maxScrollY && this.maxScrollY < 0) {
                if (!_this.defaults.moreFlag) return;
                _this.defaults.moreFlag = false;
                _this.getMoreDataHandle(); //获取更多
            }
        });
    },
    getMoreDataHandle: function() { //获取更多的数据方法
        var _this = this;
        var data = {
            query: 'all',
            title: '',
            createId: App.defaults.userData.userId,
            content: '',
            createName: '',
            opTimeStart: '',
            opTimeEnd: '',
            haveReply: "",
            pageIndex: App.ServiceFeedback.defaults.pageIndex+1,
            pageItemCount:10,
        };
        App.Comm.ajax({
            type: "post",
            url: App.Restful.urls.getFeebackData,
            data: JSON.stringify(data),
            dataType: "json",
            contentType: "application/json",
            success: function(data) {
                _this.defaults.moreFlag = true;
                if (data.code == 0) {
                   if(data.data.items.length>0){
                        _this.defaults.pageIndex++;
                        _this.appendHtmlHandle(data.data.items); //加载更多之后添加到页面上
                   }else{
                        $(".loadMore").html(App.defaults.loadMoreBottomText);
                   }
                   _this.defaults.listScroll.refresh();
                } else {
                    alert(data.message);
                }
            }
        })
    },
    appendHtmlHandle: function(data) { //加载更多之后添加到页面上
        var _this = this;
        var html = '',
            downSrc = "",
            attachmentname = "";
        for (var i = 0, iLen = data.length; i < iLen; i++) {
            html += '<dl>' +
                        '<dt><img src="/platform/user/' + data[i].createId + '/photo"></dt>' +
                        '<dd>' +
                        '<em>' + Assister.Date.getDateFromHMLong(data[i].createTime) + '</em>' +
                        '<h2><b>' + _this.getAdviceType(data[i].adviceType) + '</b>' + data[i].title + '</h2>';
                        if (data[i].content.length > 0) {
                            html += '<p>' + data[i].content + '</p>';
                        } else {
                            html += '<p class="noContent"></p>';
                        }
                        if (data[i].havaAttachment) {
                            html += '<div class="uploadImgBox showUploadTrue">';
                        } else {
                            html += '<div class="uploadImgBox">';
                        }
                        html += '<ul class="border-bottom-color">';
                        if (data[i].havaAttachment && data[i].attachmentList.length > 0) {
                            for (var j = 0, jlen = data[i].attachmentList.length; j < jlen; j++) {
                                var attachmentName = data[i].attachmentList[j].attachmentName;
                                var type = attachmentName.substr(attachmentName.lastIndexOf("."));
                                var typeStr = type.toLowerCase();
                                var imgSrc = '/platform/advice/feedback/downloads?attachmentIds=' + data[i].attachmentList[j].id;
                                switch (typeStr) {
                                    case ".jpg":
                                        html += '<li><img data-imgtype="true" src=' + imgSrc + '></li>';
                                        break;
                                    case ".gif":
                                        html += '<li><img data-imgtype="true" src=' + imgSrc + '></li>';
                                        break;
                                    case ".png":
                                        html += '<li><img data-imgtype="true" src=' + imgSrc + '></li>';
                                        break;
                                }
                            }
                        } else {
                            html += "";
                        }
            html += '</ul>' +
                '</div>';
            if (data[i].havaAttachment) {
                html += '<div class="uploadAttachmentBox showUploadTrue">';
            } else {
                html += '<div class="uploadAttachmentBox">';
            }
            html += '<ul class="serviceRelatedListBox" id="listBox">';
            if (data[i].havaAttachment && data[i].attachmentList.length > 0) {
                downSrc = "";
                attachmentname = "";
                for (var x = 0, xlen = data[i].attachmentList.length; x < xlen; x++) {
                    var attachmentName = data[i].attachmentList[x].attachmentName;
                    var attachmentSize = Assister.Size.formatSize(data[i].attachmentList[x].attachmentSize);
                    var type = attachmentName.substr(attachmentName.lastIndexOf("."));
                    var typeStr = type.toLowerCase();
                    downSrc = '/platform/advice/feedback/downloads?attachmentIds=' + data[i].attachmentList[x].id;
                    attachmentname = encodeURIComponent(data[i].attachmentList[x].attachmentName);
                    switch (typeStr) {
                        case ".doc":
                            html += '<li><a href="javascript:;" data-hrefstr="' + downSrc + '" data-attachmentname="' + attachmentname + '" data-typestr="' + typeStr + '" data-download="true"><i><img src=images/comm/word.png></i><h2>' + attachmentName + '</h2><p><span class="fl service_date">' + Assister.Date.getDateFromHMLong(data[i].createTime) + '</span><span class="fr service_size">' + attachmentSize + '</span></p></a></li>';
                            break;
                        case ".docx":
                            html += '<li><a href="javascript:;" data-hrefstr="' + downSrc + '" data-attachmentname="' + attachmentname + '" data-typestr="' + typeStr + '" data-download="true"><i><img src=images/comm/word.png></i><h2>' + attachmentName + '</h2><p><span class="fl service_date">' + Assister.Date.getDateFromHMLong(data[i].createTime) + '</span><span class="fr service_size">' + attachmentSize + '</span></p></a></li>';
                            break;
                        case ".ppt":
                            html += '<li><a href="javascript:;" data-hrefstr="' + downSrc + '" data-attachmentname="' + attachmentname + '" data-typestr="' + typeStr + '" data-download="true"><i><img src=images/comm/ppt.png></i><h2>' + attachmentName + '</h2><p><span class="fl service_date">' + Assister.Date.getDateFromHMLong(data[i].createTime) + '</span><span class="fr service_size">' + attachmentSize + '</span></p></a></li>';
                            break;
                        case ".pptx":
                            html += '<li><a href="javascript:;" data-hrefstr="' + downSrc + '" data-attachmentname="' + attachmentname + '" data-typestr="' + typeStr + '" data-download="true"><i><img src=images/comm/ppt.png></i><h2>' + attachmentName + '</h2><p><span class="fl service_date">' + Assister.Date.getDateFromHMLong(data[i].createTime) + '</span><span class="fr service_size">' + attachmentSize + '</span></p></a></li>';
                            break;
                        case ".xls":
                            html += '<li><a href="javascript:;" data-hrefstr="' + downSrc + '" data-attachmentname="' + attachmentname + '" data-typestr="' + typeStr + '" data-download="true"><i><img src=images/comm/excel.png></i><h2>' + attachmentName + '</h2><p><span class="fl service_date">' + Assister.Date.getDateFromHMLong(data[i].createTime) + '</span><span class="fr service_size">' + attachmentSize + '</span></p></a></li>';
                            break;
                        case ".xlsx":
                            html += '<li><a href="javascript:;" data-hrefstr="' + downSrc + '" data-attachmentname="' + attachmentname + '" data-typestr="' + typeStr + '" data-download="true"><i><img src=images/comm/excel.png></i><h2>' + attachmentName + '</h2><p><span class="fl service_date">' + Assister.Date.getDateFromHMLong(data[i].createTime) + '</span><span class="fr service_size">' + attachmentSize + '</span></p></a></li>';
                            break;
                        case ".pdf":
                            html += '<li><a href="javascript:;" data-hrefstr="' + downSrc + '" data-attachmentname="' + attachmentname + '" data-typestr="' + typeStr + '" data-download="true"><i><img src=images/comm/pdf.png></i><h2>' + attachmentName + '</h2><p><span class="fl service_date">' + Assister.Date.getDateFromHMLong(data[i].createTime) + '</span><span class="fr service_size">' + attachmentSize + '</span></p></a></li>';
                            break;
                        case ".dwg":
                            html += '<li><a href="javascript:;" data-hrefstr="' + downSrc + '" data-attachmentname="' + attachmentname + '" data-typestr="' + typeStr + '" data-download="true"><i><img src=images/comm/dwg_icon.png></i><h2>' + attachmentName + '</h2><p><span class="fl service_date">' + Assister.Date.getDateFromHMLong(data[i].createTime) + '</span><span class="fr service_size">' + attachmentSize + '</span></p></a></li>';
                            break;
                        case ".rvt":
                            html += '<li><a href="javascript:;" data-hrefstr="' + downSrc + '" data-attachmentname="' + attachmentname + '" data-typestr="' + typeStr + '" data-download="true"><i><img src=images/comm/rvt_icon.png></i><h2>' + attachmentName + '</h2><p><span class="fl service_date">' + Assister.Date.getDateFromHMLong(data[i].createTime) + '</span><span class="fr service_size">' + attachmentSize + '</span></p></a></li>';
                            break;
                    }
                }
            } else {
                html += "";
            }
            html += '</ul>' +
                '</div>';
            if (data[i].haveReply) {
                html += '<div class="replyBox haveReplyTrue">';
            } else {
                html += '<div class="replyBox">';
            }
            var replayLen = data[i].adviceReplys.length;
            $.each(data[i].adviceReplys, function(i, n) {
                html += '<em>' + n.replyName + ' ' + n.replyTimeStr.split(' ')[0] + '</em>' +
                    '<br>';
                if (i + 1 === replayLen) {
                    html += '<span>' + n.content + '</span>';
                } else {
                    html += '<span class="reply-content">' + n.content + '</span>';
                }
                html += '<br>';
            })
            html += '</div>' +
                '</dd>' +
                '<dd class="listComponent-del J_listComponent-del" data-id="' + data[i].id + '">删除</dd>' +
                '</dl>';
        }
        $("#listContentBox").append(html);
    },
    initHtml: function() {
        App.TitleBar.setTitle("建议反馈"); //设置顶部标题
        App.TitleBar.hidePopMenuBtn(); //隐藏顶部三个点按钮
        App.hideMainMenu(); //隐藏底部导航栏
        $("#mainContainer").css("padding-bottom", 0);
    },
    initHandle: function() { //初始化页面的方法
        var self = this;
        var listContentBox = $("#listContentBox");
        var osStr = navigator.userAgent;
        var isAndroid = osStr.indexOf('Android') > -1 || osStr.indexOf('Adr') > -1; //android终端
        var isiOS = !!osStr.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        var href = "#/addFeedback";
        $("#addFeedBackBtn").on("click",function(){
            location.href = href;
            return false;
        });
        App.TitleBar.returnCallback(function() {
            if (!isAndroid && isiOS) { //如果是苹果系统
                cordova.exec(function() {}, function() {}, "WDNaviPlugin", "hiddenNavi", ["1"]);
            }
            location.href = "#/service";
        });
        listContentBox.on("click", function(evt) {
            var target = $(evt.target);
            var deleteId = target.data("id");
            var closestEle = "",
                hrefstr = "",
                type = "",
                name = "";
            if(deleteId){
                setTimeout(function(){
                    var Dlg = App.UI.Dialog.showMsgDialog({
                        title: '提示',
                        text: '是否删除反馈',
                        titleColor: "#FF1717",
                        css: {
                            "line-height": "0.5333rem",
                            "font-size": "0.3733rem",
                            "text-align": "center"
                        },
                        onok: function() {
                            if(App.defaults.feedbackObj){
                                self.defaults.pageNum = self.defaults.pageIndex*10;
                                // App.defaults.feedbackObj.pageIndex = self.defaults.pageIndex;
                            }
                            self.feedbackDel(deleteId);
                        },
                        oncancel: function() {}
                    })
                    $(Dlg.dialog).find(".commDialogContainer").css("padding-top", "0");
                    $(Dlg.dialog).find(".commDialogCancel").css("display", "block");
                    $(Dlg.dialog).find(".wMobileDialog-titleBar").css("display", "block");
                    $(Dlg.dialog).find(".commDialogOk").css("width", "50%");
                },340)
            }else{
                closestEle = target.closest("a");
                hrefstr = closestEle.data("hrefstr");
                if(hrefstr){
                    type = closestEle.data('typestr');
                    name = App.trimHandle(decodeURIComponent(closestEle.data("attachmentname")));
                    self.defaults.hrefstr = closestEle.data("hrefstr");
                    if (!isAndroid && isiOS) {
                        if (type == ".mp4" || type == ".amr" || type == ".mp3" || type == ".flv" || type == ".wav" || type == ".m4v") {
                            var Dlg = App.UI.Dialog.showMsgDialog({
                                title: "提示",
                                text: "暂不支持该文件格式,无法打开",
                                okText: "确定",
                                onok: function() {

                                },
                            });
                            $(Dlg.dialog).find(".commDialogCancel").css("display", "none");
                            $(Dlg.dialog).find(".commDialogOk").css("width", "100%");
                        } else {
                            cordova.exec(self.onSuccessMoreUplaod, self.onFail, "WDWebViewOpenTypePlugin", "canOpenFile", [type]);
                        }
                    } else {
                        self.downloadImgHandle(location.origin + self.defaults.hrefstr, name);
                    }
                }
            }
            return false;
        });
        App.UI.ImgDialog.showImgDialog($("#listContentBox"));
    },
    downloadImgHandle: function(downUrl, name) { //批注查看大图下载图片方法
        var tipText = "下载完成，请到手机系统OA_downLoad里查看";
        var fileTransfer = new FileTransfer();
        var uri = downUrl;
        fileTransfer.download(uri, name, function(entry) {
            var Dlg = App.UI.Dialog.showMsgDialog({
                title: "提示",
                text: tipText,
                okText: "确定",
                onok: function() {

                },
            });
            $(Dlg.dialog).find(".commDialogCancel").css("display", "none");
            $(Dlg.dialog).find(".commDialogOk").css("width", "100%");
        }, function(error) {
            alert("下载错误:::" + error.source);
            alert("下载错误:::" + error.target);
            alert("下载错误:::" + error.code);
        }, false, {
            headers: {

            },
            fileName: name
        })
    },
    onSuccessMoreUplaod: function(evt) {
        if (evt == "您提供的文件类型不能被打开") {
            var Dlg = App.UI.Dialog.showMsgDialog({
                title: "提示",
                text: "暂不支持该文件格式,无法打开",
                okText: "确定",
                onok: function() {

                },
            });
            $(Dlg.dialog).find(".commDialogCancel").css("display", "none");
            $(Dlg.dialog).find(".commDialogOk").css("width", "100%");
        } else {
            cordova.exec(function() {}, function() {}, "WDNaviPlugin", "hiddenNavi", ["0"]);
            location.href = App.ServiceFeedback.defaults.hrefstr;
        }
    },
    onFail: function(evt) {},
    feedbackDel: function(feedbackDel) {
        var _this = this;
        App.Comm.ajax({
            type: "delete",
            url: App.Restful.urls.deleteFeedbackList,
            param: {
                id: feedbackDel
            },
            dataType: "json",
            success: function success(response) {
                if(response.code == 0){
                    _this.loadData();  
                }else{
                  alert(response.message);
                }
            },
            error: function() {
                alert('删除失败')
            }
        });
    },
    resetHandle: function() {
        $(".loadMore").html(App.defaults.loadMoreText).show();
        this.defaults.pageIndex = 1;
    },
    loadData: function() {
        var _this = this;
        var loadMore = $(".loadMore");
        var data = {
            query: 'all',
            title: '',
            createId: App.defaults.userData.userId,
            content: '',
            createName: '',
            opTimeStart: '',
            opTimeEnd: '',
            haveReply: "",
            pageIndex: 1,
            pageItemCount: App.ServiceFeedback.defaults.pageNum,
        };
        var listContentBox = $("#listContentBox");
        var feedbackScroll = $(".feedbackScroll");
        var nullData = $("<div class='nullData'><div class='nullDataImg'></div><p>暂时还没有任何内容哦～</p></div>");
        var dlComponent =   '<dl id="listComponent" style="display: none;">'+
                                '<dt>{{userLogo}}</dt>'+
                                '<dd>'+
                                    '<em>{{createTime}}</em>'+
                                    '<h2><b>{{adviceType}}</b>{{title}}</h2>'+
                                    '<p class="{{contentBool}}">{{content}}</p>'+
                                    '<div class="uploadImgBox {{showUpload}}">'+
                                        '<ul class="border-bottom-color J_thumbnail">{{imgComponent}}</ul>'+
                                    '</div>'+
                                    '<div class="uploadAttachmentBox {{showUpload}}">'+
                                        '<ul class="serviceRelatedListBox" id="listBox">{{attachmentComponent}}</ul>'+
                                    '</div>'+
                                    '<div class="replyBox {{showReply}}">{{reply}}</div>'+
                                '</dd>'+
                                '<dd class="listComponent-del J_listComponent-del" data-id="{{id}}">删除</dd>'+
                            '</dl>';
        feedbackScroll.css("transform", "translate(0px,0px)");
        listContentBox.html(dlComponent);
        App.Comm.ajax({
            type: "post",
            url: App.Restful.urls.getFeebackData,
            data: JSON.stringify(data),
            dataType: "json",
            cache:false,
            contentType: "application/json",
            success: function(data) {
                if (data.code == 0) {
                    if (data.data.items.length < 10) {
                        loadMore.hide();
                    } else {
                        loadMore.show();
                    }
                    if (data.data.items.length > 0) {
                        _this.viewPage(data.data.items);
                    } else {
                        listContentBox.html(nullData);
                    }
                    _this.initScrollHandle(); //初始化滚动条的方法
                } else {
                    alert(data.message);
                }
            }
        })
    },
    getAdviceType: function(type) {
        if (type === null) {
            return ''
        }
        var arr = ['设计', '计划', '成本', '质监', '系统'];
        return '[' + arr[type - 1] + ']';
    },
    /**
     * Returns a random integer between min (inclusive) and max (inclusive)
     * Using Math.round() will give you a non-uniform distribution!
     */
    getRandomInt: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    viewPage: function(data) {
        // debugger;
        var _this = this;
        /*渲染数据*/
        template.repeat({
            repeatElement: $("#listComponent")[0],
            /*页面的DOM元素*/
            data: data,
            process: function(itemObject) {
                var item = itemObject.item;
                var key = itemObject.index;
                var userLogo = '<img src="/platform/user/' + item.createId + '/photo">';
                var imgHtml = "",
                    attachmentHtml = "",
                    $reply;
                if (item.havaAttachment && item.attachmentList.length > 0) {
                    for (var i = 0, len = item.attachmentList.length; i < len; i++) {
                        var attachmentName = item.attachmentList[i].attachmentName;
                        var attachmentSize = Assister.Size.formatSize(item.attachmentList[i].attachmentSize);
                        var type = attachmentName.substr(attachmentName.lastIndexOf("."));
                        var typeStr = type.toLowerCase();
                        var imgSrc = '/platform/advice/feedback/downloads?attachmentIds=' + item.attachmentList[i].id;
                        switch (typeStr) {
                            case ".jpg":
                                imgHtml += `<li><img data-imgtype="true" src='${imgSrc}' data-index="${i}"></li>`;
                                break;
                            case ".gif":
                                imgHtml += `<li><img data-imgtype="true" src='${imgSrc}' data-index="${i}"></li>`;
                                break;
                            case ".png":
                                imgHtml += `<li><img data-imgtype="true" src='${imgSrc}' data-index="${i}"></li>`;
                                break;
                            case ".doc":
                                attachmentHtml += '<li><a href="javascript:;" data-hrefstr="' + imgSrc + '" data-attachmentname="' + encodeURIComponent(item.attachmentList[i].attachmentName) + '" data-typestr="' + typeStr + '" data-download="true"><i><img src=images/comm/word.png></i><h2>' + attachmentName + '</h2><p><span class="fl service_date">{{createTime}}</span><span class="fr service_size">' + attachmentSize + '</span></p></a></li>';
                                break;
                            case ".docx":
                                attachmentHtml += '<li><a href="javascript:;" data-hrefstr="' + imgSrc + '" data-attachmentname="' + encodeURIComponent(item.attachmentList[i].attachmentName) + '" data-typestr="' + typeStr + '" data-download="true"><i><img src=images/comm/word.png></i><h2>' + attachmentName + '</h2><p><span class="fl service_date">{{createTime}}</span><span class="fr service_size">' + attachmentSize + '</span></p></a></li>';
                                break;
                            case ".ppt":
                                attachmentHtml += '<li><a href="javascript:;" data-hrefstr="' + imgSrc + '" data-attachmentname="' + encodeURIComponent(item.attachmentList[i].attachmentName) + '" data-typestr="' + typeStr + '" data-download="true"><i><img src=images/comm/ppt.png></i><h2>' + attachmentName + '</h2><p><span class="fl service_date">{{createTime}}</span><span class="fr service_size">' + attachmentSize + '</span></p></a></li>';
                                break;
                            case ".pptx":
                                attachmentHtml += '<li><a href="javascript:;" data-hrefstr="' + imgSrc + '" data-attachmentname="' + encodeURIComponent(item.attachmentList[i].attachmentName) + '" data-typestr="' + typeStr + '" data-download="true"><i><img src=images/comm/ppt.png></i><h2>' + attachmentName + '</h2><p><span class="fl service_date">{{createTime}}</span><span class="fr service_size">' + attachmentSize + '</span></p></a></li>';
                                break;
                            case ".xls":
                                attachmentHtml += '<li><a href="javascript:;" data-hrefstr="' + imgSrc + '" data-attachmentname="' + encodeURIComponent(item.attachmentList[i].attachmentName) + '" data-typestr="' + typeStr + '" data-download="true"><i><img src=images/comm/excel.png></i><h2>' + attachmentName + '</h2><p><span class="fl service_date">{{createTime}}</span><span class="fr service_size">' + attachmentSize + '</span></p></a></li>';
                                break;
                            case ".xlsx":
                                attachmentHtml += '<li><a href="javascript:;" data-hrefstr="' + imgSrc + '" data-attachmentname="' + encodeURIComponent(item.attachmentList[i].attachmentName) + '" data-typestr="' + typeStr + '" data-download="true"><i><img src=images/comm/excel.png></i><h2>' + attachmentName + '</h2><p><span class="fl service_date">{{createTime}}</span><span class="fr service_size">' + attachmentSize + '</span></p></a></li>';
                                break;
                            case ".pdf":
                                attachmentHtml += '<li><a href="javascript:;" data-hrefstr="' + imgSrc + '" data-attachmentname="' + encodeURIComponent(item.attachmentList[i].attachmentName) + '" data-typestr="' + typeStr + '" data-download="true"><i><img src=images/comm/pdf.png></i><h2>' + attachmentName + '</h2><p><span class="fl service_date">{{createTime}}</span><span class="fr service_size">' + attachmentSize + '</span></p></a></li>';
                                break;
                            case ".dwg":
                                attachmentHtml += '<li><a href="javascript:;" data-hrefstr="' + imgSrc + '" data-attachmentname="' + encodeURIComponent(item.attachmentList[i].attachmentName) + '" data-typestr="' + typeStr + '" data-download="true"><i><img src=images/comm/dwg_icon.png></i><h2>' + attachmentName + '</h2><p><span class="fl service_date">{{createTime}}</span><span class="fr service_size">' + attachmentSize + '</span></p></a></li>';
                                break;
                            case ".rvt":
                                attachmentHtml += '<li><a href="javascript:;" data-hrefstr="' + imgSrc + '" data-attachmentname="' + encodeURIComponent(item.attachmentList[i].attachmentName) + '" data-typestr="' + typeStr + '" data-download="true"><i><img src=images/comm/rvt_icon.png></i><h2>' + attachmentName + '</h2><p><span class="fl service_date">{{createTime}}</span><span class="fr service_size">' + attachmentSize + '</span></p></a></li>';
                                break;
                            default:
                                attachmentHtml += '<li><a href="javascript:;" data-hrefstr="' + imgSrc + '" data-attachmentname="' + encodeURIComponent(item.attachmentList[i].attachmentName) + '" data-typestr="' + typeStr + '" data-download="true"><i><img src=images/comm/default_icon.png></i><h2>' + attachmentName + '</h2><p><span class="fl service_date">{{createTime}}</span><span class="fr service_size">' + attachmentSize + '</span></p></a></li>';
                                break;
                        }
                    }
                }
                if (item.haveReply) {
                    $reply = $('<div>');
                    var len = item.adviceReplys.length;
                    $.each(item.adviceReplys, function(i, n) {
                        $('<em>', {
                            text: n.replyName + ' ' + n.replyTimeStr.split(' ')[0]
                        }).appendTo($reply)
                        $reply.append('<br>').append($('<span>', {
                            text: n.content,
                            class: i + 1 === len ? '' : 'reply-content'
                        })).append('<br>');
                    })
                }
                return {
                    "title": item.title,
                    "userLogo": userLogo,
                    "content": item.content.length > 0 ? item.content : "",
                    "contentBool": item.content.length > 0 ? "" : "noContent",
                    "imgComponent": imgHtml,
                    "typeStr": typeStr,
                    "attachmentComponent": attachmentHtml,
                    "reply": $reply ? $reply.html() : '',
                    "adviceType": _this.getAdviceType(item.adviceType),
                    "showReply": item.haveReply ? "haveReplyTrue" : "",
                    "showUpload": item.havaAttachment ? "showUploadTrue" : "",
                    "createTime": Assister.Date.getDateFromHMLong(item.createTime),
                    "noBorder": key == data.length - 1 ? "border-no-color" : "border-bottom-color"
                }
            }
        });
    }
}