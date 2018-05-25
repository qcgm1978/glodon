/**
 * @require /BIMperformance/libsH5/js/bimView.js
 */
'use strict';
(function ($) {
    bimView.prototype = {
        getAnnotationObject: function (viewer) {
            var self = this;
            self.viewer = self.viewer || viewer;
            if (!self.annotationHelper3D) {
                self.annotationHelper3D = new CLOUD.Extensions.AnnotationHelper3D(self.viewer);
                // render 回调
                var renderCB = function () {
                    //helper.renderAnnotations();
                    self.annotationHelper3D.renderAnnotations();
                }
                self.viewer.addCallbacks("render", renderCB);
                // resize 回调
                var resizeCB = function () {
                    //helper.resizeAnnotations();
                    self.annotationHelper3D.resizeAnnotations();
                }
                self.viewer.addCallbacks("render", resizeCB);
                /*
                var win = window.open();
                var snapshot = function(dataUrl){
                  if (dataUrl) {
                      win.document.write('<!DOCTYPE html><html lang="en">');
                      win.document.write('<head><meta charset="utf-8"><title>Cloud Viewer - Screen Shot</title>');
                      win.document.write('<div class="viewport"><div><img src="' + dataUrl + '" /> </div>');
                      win.document.write('</html>');
                      win.document.close();
                  }
                }
                self.annotationHelper3D.captureAnnotationsScreenSnapshot(undefined, snapshot);
                */
            }
            return self.annotationHelper3D;
        },
        getMakerObject: function (viewer) {
            var self = this;
            self.viewer = self.viewer || viewer;
            if (!self.MarkerHelper) {
                self.MarkerHelper = new CLOUD.Extensions.MarkerHelper(self.viewer);
                // render 回调
                var renderCB = function () {
                    self.MarkerHelper.renderMarkers();
                }
                self.viewer.addCallbacks("render", renderCB);
                // resize 回调
                var resizeCB = function () {
                    self.MarkerHelper.resizeMarkers();
                }
                self.viewer.addCallbacks("render", resizeCB);
            }
            return self.MarkerHelper;
        },
        getMiniMapObject: function (viewer) {
            var self = this;
            self.viewer = self.viewer || viewer;
            if (!self.MiniMapHelper) {
                self.MiniMapHelper = new CLOUD.Extensions.MiniMapHelper(self.viewer);
                var renderCB = function () {
                    self.MiniMapHelper.renderMiniMap();
                }
                self.viewer.addCallbacks("render", renderCB);
            }
            return self.MiniMapHelper;
        },
        on: function (event, fn) { //订阅
            this.subscribers[event] ? this.subscribers[event].push(fn) : (this.subscribers[event] = []) && this.subscribers[event].push(fn);
            return '{"event":"' + event + '","fn":"' + (this.subscribers[event].length - 1) + '"}';
        },
        pub: function (event, args) { //发布
            if (this.subscribers[event]) {
                for (var i = 0, len = this.subscribers[event].length; i < len; i++) {
                    if (typeof (this.subscribers[event][i]) === 'function') {
                        this.subscribers[event][i](args);
                    }
                }
            }
        },
        off: function (subId) { //取消订阅
            try {
                var id = JSON.parse(subId);
                this.subscribers[id.event][id.fn] = null;
                delete this.subscribers[id.event][id.fn];
            } catch (err) {
                console.log(err);
            }
        },
        init: function (options) {
            var self = this;
            var _opt = options;
            _opt.element.html(_opt._dom.bimBox);
            var url,
                host = (/^(\d+\.?)+$/.test(location.host) ? window.location.host : (window.location.host.substring(window.location.host.indexOf("."))));
            if (host == "bim.wanda-dev.cn" || host == "bim-uat.wanda-dev.cn" || host == "bim.wanda.cn") {
                url = "/static/dist/js/mpkWorker2.min.js";
            } else {
                url = "http://bim.wanda.cn/static/dist/js/mpkWorker2.min.js";
            }
            // //外部引用
            // if (window.location.href.indexOf("wanda.") < 0 ) {
            //   url = "http://bim.wanda.cn/static/dist/js/mpkWorker.min.js";
            // } else {
            //   url = "/static/dist/js/mpkWorker.min.js";
            // }
            $.ajax({
                xhrField: {
                    withCredentials: true
                },
                url: url,
                async: false
            }).done(function (data) {
                var workerJSBlob = new Blob([data], {
                    type: "text/javascript"
                });
                //CLOUD.GlobalData.MpkWorkerUrl = window.URL.createObjectURL(workerJSBlob);
                CLOUD.GlobalData.MpkWorkerUrl = url;
            }).fail(function () {
                console.log("get error " + url);
            });
            CLOUD.GlobalData.SelectionColor = {color: 0x0000FF, opacity: 1, side: THREE.DoubleSide, transparent: false};
            CLOUD.GlobalData.EnableDemolishByDClick = true;
            switch (_opt.type) { // 判断类型
                case "model":
                    self.viewer = bimView.model.model(_opt, self);
                    self.annotationHelper3D = new CLOUD.Extensions.AnnotationHelper3D(self.viewer);
                    break;
                case 'singleModel':
                    self.viewer = bimView.model.singleModel(_opt);
                    break;
                case 'familyModel':
                    self.viewer = bimView.model.familyModel(_opt);
                    break;
                case 'dwg':
                    self.viewer = bimView.model.dwg(_opt);
                    break;
                default:
                    self.viewer = bimView.model.model(_opt);
                    break;
            }
            self.regesiterEvent(_opt);
            self.controll();
            bimView.comm.bindEvent.init();
            CLOUD.GlobalData.Hover = false;
            self.pub("start");
        },
        destroy: function () {
            this.viewer.destroy();
        },
        regesiterEvent: function (options) {
            var self = this;
            var _opt = options;
            var loadEvent = {
                start: function (res) {
                    _opt._dom.loading.append(_opt._dom.progress);
                    _opt._dom.bimBox.append(_opt._dom.loading);
                    _opt._dom.bimBox.append(_opt._dom.modelLoading.text('0%'));
                },
                loading: function (res) {
                    var total = res.progress.total,
                        loaded = res.progress.loaded,
                        progress = loaded / total * 100;
                    _opt._dom.progress.width(progress + '%');
                    _opt._dom.modelLoading.text(parseInt(progress) + '%');
                    if (progress == 100) {
                        _opt._dom.loading.remove();
                        _opt._dom.modelLoading.remove();
                    }
                    self.pub('loading', res);
                },
                loaded: function (res) {
                    self.viewer.setLightIntensityFactor(1.2);
                    self.viewer.render();
                    self.viewer.setTransitionAnimationState(false);
                    
                    if ($('.modelMap').length) {
                        bimView.sidebar.loadMap();
                    }

                    var sunLight = self.viewer.getScene().sunLight;
                    if (sunLight) {
                        sunLight.intensity = 0.55;
                    }

                    var ambientLight = self.viewer.getScene().ambientLight;
                    if (ambientLight) {
                        ambientLight.intensity = 0.45;
                    }

                    self.viewer.goToInitialView();

                    var categories = ['LR_-2000170', 'LR_-2000151', 'LR_-2000032', 'LR_-2000014', 'LR_-2003400', 'LR_-2000038'
                                       ,'CW&LI_-2000011','CW&LI_-2000023','CW&LI_-2000170','CW&LI_-2003400','CW&LI_-2000151'];    //
                    self.viewer.resizePool(50000);          // change to small pool size, only outdoor 'wall' is visible.
                    self.viewer.setCategoriesToHighPriority(categories, 1);
                    var timer = setTimeout(function () {
                        clearTimeout(timer);
                        self.viewer.zoomToBuilding(0, 1.15);
                    }, 50);

                    self.pub('loaded', res);
                },
                click: function (res) {
                    var intersect = res.intersectInfo;
                    if (intersect == null) {
                        if (res.doubleClick) {
                            $("#isolation").show();
                        }
                        else {
                            $("#isolation").hide();
                        }
                        
                    }
                    if (!intersect || (intersect && (false === intersect.selectable))) {
                        self.viewer.showPickedInformation(null);
                        var selectionUI=$('<div class="selection"></div>');
                        selectionUI.remove();
                        bimView.comm.renderSelected();
                        $('.designProperties,.QualityProperties,.planProperties,.CostProperties,.attrContent').html('<div class="nullTip">' +
                            (App.Local.getTranslation('drawing-model.SEt1') || '请选择构件') +
                            '</div>');
                        return;
                    }
                    // 如果需要显示轴网信息，则获得轴网信息
                    var helper = self.getMiniMapObject();
                    helper.getAxisGridInfoByIntersect(intersect);
                    // 是否允许显示信息
                    if (intersect.innnerDebugging) {
                        res.canvasPos = new THREE.Vector2(res.event.clientX, res.event.clientY);
                        self.viewer.showPickedInformation(res);
                    } else {
                        self.viewer.showPickedInformation(null);
                        $('.designProperties').html('<div class="nullTip">' +
                            (App.Local.getTranslation('drawing-model.SEt1') || '请选择构件') +
                            '</div>');
                    }
                    res.intersect = res.intersectInfo;    //兼容原数据格式
                    res.intersect.userId = res.intersect.selectedObjectId; //兼容原数据格式
                    self.pub('click', res);
                    //self.setSelectedIds([res.intersect.userId]);
                },
                empty: function (res) {
                    //非 0  不用处理
                    if (res.target.triangleCount > 0) {
                        return;
                    }
                    _opt._dom.bimBox.html('<div class="tips"><i class="icon"></i><span>无法三维预览，请下载查看</span></div>');
                    self.pub('empty', res);
                }
            }
            self.on('start', loadEvent.start);
            self.viewer.registerEventListener(CLOUD.EVENTS.ON_CLICK_PICK, loadEvent.click);
            //self.viewer.registerEventListener(CLOUD.EVENTS.ON_SELECTION_CHANGED, loadEvent.click);
            self.viewer.registerEventListener(CLOUD.EVENTS.ON_LOAD_PROGRESS, loadEvent.loading);
            self.viewer.registerEventListener(CLOUD.EVENTS.ON_LOAD_COMPLETE, loadEvent.loaded);
            self.viewer.registerEventListener(CLOUD.EVENTS.ON_LOAD_EMPTYSCENE, loadEvent.empty);
            self.viewer.registerEventListener(CLOUD.EVENTS.ON_EDITOR_UPDATEUI, function (evt) {
                var selectionUI;
                if (!self.selectionStatue) {
                    selectionUI = $('<div class="selection"></div>');
                    self._dom.bimBox.append(selectionUI);
                    self.selectionStatue = true;
                } else {
                    selectionUI = self._dom.bimBox.find('.selection');
                }
                if (evt.data.visible) {
                    var data = evt.data;
                    selectionUI.css({
                        left: data.left,
                        top: data.top,
                        width: data.width,
                        height: data.height,
                        opacity: data.dit ? .5 : .1
                    });
                } else {
                    self.selectionStatue = false;
                    selectionUI.remove();
                    //bimView.comm.renderSelected();
                    // if(self.viewer.getSelection().length > 0){
                    //     self.on('click', function () {
                    //     if (!$("#selected").is(":hidden")) {
                    //         self.getSelected(viewer);
                    //         }
                    //     });    
                    // }
                }
            });
            self.viewer.registerEventListener(CLOUD.EVENTS.ON_LOAD_EMPTY_SCENE, function (evt) {
                setTimeout(function() {
                    // 这里处理空场景的逻辑
                    if (App.Index && App.Index.Settings && App.Index.Settings.comparisonName !== undefined) {
                        self.pub('emptyScene', evt);
                    }else{
                        alert(App.Local.data['drawing-model'].ViewFile || "此文件不支持在线预览！");
                    }       
                }, 500)
            });
            self.viewer.registerEventListener(CLOUD.EVENTS.ON_LOAD_INVALID_SCENE, function (evt) {
                _opt._dom.loading.remove();
                _opt._dom.modelLoading.remove();
                // 这里处理空场景的逻辑
                var arr = Object.keys(this.models);
                var len = arr.length;
                //处理模型比较中没有修改或删除模型的情况，次情况不弹出提示
                if (len < 2) {
                    alert(App.Local.data['drawing-model'].ViewFile || "此文件不支持在线预览！");
                    $('.modelBar').hide();
                }
            });
        },
        setClasscodeInput: function () {
            $.each(window.classCodeIds, (i, n) => {
                $('[title="' +
                    n +
                    '"]').prev().find('input').prop('checked', false);
            });
        },
        controll: function () {
            var self = this;
            $('#lockAxisZ').click(function () {
                var selected = $(this).is('.selected');
                $(this).toggleClass('selected');
                if (selected) {
                    $(this).find('span').text((App.Local.data['model-view'].Us || 'Z轴未锁'))
                } else {
                    $(this).find('span').text(App.Local.getTranslation('model-view.LZs') || 'Z轴已锁')
                }
                self.lockAxisZ(!selected);
            });
            self._dom.bimBox.on('click', '.bar-item', function () {
                // 工具条对应功能
                var $this = $(this),
                    fn = $this.data('id'),
                    group = $this.data('group'),
                    isSelected = $this.is('.selected'),
                    type = $this.data('type');
                switch (type) {
                    case "viewer":
                        self[fn]();
                        break;
                    case "view":
                        self[fn]();
                        if ($this.is('[data-id="showAll"]')) {
                            $("#isolation").hide();
                            $('.designProperties').html('<div class="nullTip">' +
                                (App.Local.getTranslation('drawing-model.SEt1') || '请选择构件') +
                                '</div>');
                        }
                        break;
                    case "pattern":
                        $this.toggleClass('selected');
                        if ($this.closest('.toolsBar').length > 0) {
                            $this.closest('.toolsBar').find('[data-group=' + group + ']').not($this).removeClass('selected');
                        } else {
                            $this.siblings().removeClass('selected');
                        }
                        if (isSelected) {
                            self.rotateMouse();
                        } else {
                            self[fn]();
                        }
                        break;
                    case "mode":
                        $this.toggleClass('selected');
                        if ($this.closest('.toolsBar').length > 0) {
                            $this.closest('.toolsBar').find('[data-group=' + group + ']').not($this).removeClass('selected');
                        } else {
                            $this.siblings().removeClass('selected');
                        }
                        if (isSelected) {
                            fn == 'setRectZoomMode' ? self.rotateMouse() : self[fn](false);
                        } else {
                            self[fn](true);
                        }
                        break;
                    case "rotate":
                        var className = $this.attr('class'),
                            $parent = $this.parent().parent();
                        $parent.attr('class', className);
                        $this.closest('.toolsBar').find('[data-group=' + group + ']').not($this).removeClass('selected');
                        self[fn]();
                        break;
                    case "status":
                        $this.toggleClass('selected');
                        self[fn](!isSelected);
                        break;
                    case "selected":
                        $this.toggleClass('selected').siblings('[data-group=' + group + ']').removeClass('selected');
                        if (fn) self[fn]();
                        break;
                    case "filter":
                        if (!$this.data("noclick") && !$this.is('.disabled')) {
                            $this.toggleClass('selected').siblings('[data-group=' + group + ']').removeClass('selected');
                            bimView.sidebar[fn](!isSelected, self, true);
                        }
                        break;
                    case "more":
                        $this.toggleClass('selected').siblings('[data-group=' + group + ']').removeClass('selected');
                        if (fn == "")//恢复快照颜色值
                        {
                            var firstColorNode = $this.find(".subBar").find("i")[0];
                            firstColorNode.className = "bar-item m-red";
                            $(firstColorNode).attr("data-color", "m-red");
                            $(firstColorNode).attr("data-param", "#DA0015");
                        }
                        if (fn == 'more') {
                            var flag = self.getTranslucentStatus();
                            $this.find('.m-translucent').toggleClass('selected', flag);
                            bimView.sidebar[fn](self);
                        }
                        break;
                    case "change":
                        $this.toggleClass('m-miniScreen m-fullScreen')
                        $(bimView.sidebar.el._dom.sidebar).toggleClass("hideMap");
                        break;
                    case "comment":
                        $this.addClass('selected').siblings().removeClass('selected');
                        self.setCommentType(fn);
                        break;
                    case "comment-color":
                        $this.addClass('selected').siblings().removeClass('selected');
                        var parent = $this.parents('.bar-item');
                        var precolor = parent.data('color'),
                            colors = $this.data('color'),
                            param = $this.data('param');
                        parent.attr('data-color', colors);
                        self.commentColorString = colors; //add by wuweiwei store comment color
                        self.setCommentStyle({'stroke-color': param, 'fill-color': param});
                        break;
                    case "color":
                        var bar = bimView.model.colorBar;
                        var content = $('<div class="colorBar"></div>')
                        $.each(bar, function (i, item) {
                            var tmpHtml = $('<i class="bar-item ' + item.icon + '"data-id="' + item.fn + '" data-type="' + item.type + '" data-group="' + item.group + '"></i>');
                            if (fn && fn == item.fn || !fn && i == 0) {
                                tmpHtml.addClass('selected')
                            }
                            content.append(tmpHtml);
                        });
                        var type;
                        content.on('click', '.bar-item', function () {
                            var $this = $(this),
                                fn = $this.data('id');
                            type = fn;
                            $this.addClass('selected').siblings().removeClass('selected');
                        })
                        bimView.comm.dialog({
                            title: (App.Local.data['drawing-model'].SBr || "设置背景色"),
                            content: content,
                            callback: function () {
                                $this.attr('class', 'bar-item m-color ' + type).data('id', type);
                                bimView.comm.setModelBgColor(type);
                                self._dom.bimBox.attr('class', 'bim ' + type);
                            }
                        })
                        break;
                }
            }).on('click', '.modelSelect .cur', function () {
                // 点击下拉
                var $this = $(this);
                $this.toggleClass('open');
            }).on('click', '.modelItem', function (event, flag) {
                // 点击下拉框选择
                var filterData = bimView.comm.filterData;
                var $this = $(this),
                    $list = $this.parent(),
                    data = $this.data(),
                    text = $this.text(),
                    $cur = $list.prev('.cur');
                $cur.removeClass('open').text(text);
                if (data.type == 'familyType') {
                    self.filter({
                        type: 'typeId',
                        ids: bimView.comm.removeById(filterData, data.id)
                    })
                } else {
                    self.curFloor = text;
                    const $axisGrid = $('.axisGrid');
                    $axisGrid
                        .text(function (ind, val) {
                            const text = val.replace('undefined', self.curFloor);
                            $(this).attr('title', text);
                            return text
                        });
                    self.curFloorData = data;
                    self.setFloorMap(data, "miniMap", !flag);
                }
            }).on('click', '.m-openTree,.m-closeTree', function () {
                // 展开关闭树
                var $this = $(this),
                    data = bimView.sidebar.classCodeData,
                    $li = $this.closest('.itemNode'),
                    type = $li.data('type'),
                    isChecked = $this.next().find('input').prop('checked'),
                    isSelected = $this.siblings('.treeText').is('.selected');
                $this.toggleClass('m-closeTree m-openTree')
                $li.toggleClass('open');
                if (type == 'classCode' && $li.has(".tree").length == 0) {
                    var parent = $li.data();
                    if (!parent.userData) parent.userData = null;
                    var tmpArr = [];
                    $.each(data, function (i, item) {
                        if (item.parentCode == parent.userData) {
                            tmpArr.push(item);
                        }
                    });
                    var children = bimView.comm.viewTree({
                        arr: tmpArr,
                        type: 'classCode',
                        name: 'name',
                        data: 'code',
                        children: 'isChild',
                        isChecked: isChecked,
                        isSelected: isSelected
                    });
                    $li.append(children);
                    self.setClasscodeInput();
                }
            }).on('change', 'input', function (e) {
                //filter变化
                //   debugger;
                var $this = $(this),
                    $li = $this.closest('.itemNode'),
                    type = $li.data('type'),
                    parents = $this.parents('.itemNode'),
                    flag = $this.prop('checked'),
                    filter;
                var $input = $li.find("input");
                $input.prop("checked", flag);
                !flag && $li.find('.m-lbl-2').removeClass('m-lbl-2');
                if (type == "sceneId") {
                    var filter = bimView.comm.getFilters($("#floors,#specialty"), 'uncheck');
                    self.fileFilter(filter);
                } else {
                    filter = bimView.comm.getFilters(parents, 'uncheck');
                    self.filter(filter);
                }
                /*add by wuweiwei set filter checkbox state*/
                //console.log($(e.target).next()[0]);
                //console.log(document.defaultView.getComputedStyle($(e.target).next()[0] , "after").content);
                bimView.sidebar.scanFilterTreeCheckState($(e.target).next()[0]);
            }).on('click', '#filter .treeText', function () {
                // 选中高亮
                var $this = $(this),
                    $li = $this.closest('.itemNode'),
                    flag = $this.is('.selected'),
                    data = $li.data();
                $li.find('.treeText').toggleClass('selected', !flag);
                var filter = bimView.comm.getFilters($li, 'all');
                flag ? self.downplay(filter) : self.highlight(filter);
            }).on('click', '.axisGrid', function () {
                if (!self.bigMap) {
                    self.bigMap = $('<div id="map"></div>');
                }
                if (!self.footer) {
                    self.footer = $('<label class="dialogLabel">X：<input type="text" class="dialogInput" id="axisGridX" /></label><label class="dialogLabel">Y：<input type="text" class="dialogInput" id="axisGridY" /></label>');
                }
                var data = self.curFloorData;
                bimView.comm.dialog({
                    width: 800,
                    title: (App.Local.data['drawing-model'].SAd || '选择轴网'),
                    content: self.bigMap,
                    footer: self.footer,
                    callback: function () {
                        var x = self.footer.find('#axisGridX').val(),
                            y = self.footer.find('#axisGridY').val();
                        self.setAxisGrid('bigMap', y, x);
                    }
                });
                //alert(location.href)
                if (/static\/dist\/components\/inspectSelectionNew\/model/.test(location.href)) {
                    //  alert($('#divTableData').height())
                    $('.dialogBody #map').height(280);
                }
                self.initMap({
                    name: 'bigMap',
                    element: self.bigMap,
                    enable: false,
                    callbackMoveOnAxisGrid: function (res) {
                        self.footer.find('#axisGridX').val(res.numeralName);
                        self.footer.find('#axisGridY').val(res.abcName);
                    }
                });
                self.showAxisGrid('bigMap');
                self.setFloorMap(data, "bigMap");
            });
            $(window).on('resize', function () {
                self.resize();
            });
            $(document).on('click', function (event) {
                var $this = $(event.target);
                if (!$this.is('.bar-item[data-type=more]')) {
                    $('.bar-item[data-type=more]').removeClass('selected');
                }
            });
            self.on('changeGrid', function (res) {
                var floors = self.curFloor;
                var infoX = res.axis.infoX ? res.axis.infoX + "," : "";
                var infoY = res.axis.infoY ? res.axis.infoY + "," : "";
                var infoZ = 'Z(' + floors + ',' + res.axis.offsetZ + ')';
                bimView.sidebar.el._dom.mapBar.find(".axisGrid").text(infoX + infoY + infoZ)
            });
        },
        // 以下是对模型操作
        resize: function (width, height) {
            // 缩放画板大小
            var self = this,
                _viewBox = self._dom.bimBox,
                _width = width || _viewBox.width(),
                _height = height || _viewBox.height();
            if (!$("#projectContainer .modelContainer").is(":hidden")) {
                self.viewer.renderer ? self.viewer.resize(_width, _height) : null;
            }
        },
        fit: function () {

            // 缩放到选择构件
            //  debugger;
            var self = this;
            //self.setTranslucentSelected();
            //return;
            self.pub('fit');
            if(self.viewer.getSelection().length > 0)
            {
                self.viewer.zoomToSelection();
            }
            else
            {
                self.viewer.zoomAll();
            }
            self.viewer.render();
        },
        // 模型操作模式
        zoom: function () {
            // 缩放模式
            var self = this;
            self._dom.bimBox.find(".view").attr('class', 'view zoom');
            self.pub('zoom');
            self.viewer.setZoomMode();
        },
        // 模型操作模式
        lockAxisZ: function (isLock) {
            // Z轴锁定模式
            var self = this;
            self.pub('lockAxisZ');
            CLOUD.EditorConfig.LockAxisZ = isLock;
            //self.viewer.lockAxisZ(isLock);
        },
        // 模型操作模式
        setRectZoomMode: function (isLock) {
            // 框选缩放
            var self = this;
            self._dom.bimBox.find(".view").attr('class', 'view');
            self.pub('setRectZoomMode');
            //self.viewer.setRectZoomMode();
            self.viewer.editorManager.enableTool(self.viewer, CLOUD.EditToolMode.ZOOM_BY_RECT);
        },
        zoomToBox: function (box, margin, ratio) {
            // 缩放到指定位置
            var self = this;
            var viewer = self.viewer;
            viewer.zoomToBBox(CLOUD.Utils.computeBBox(box), margin || 0.05, ratio || 1.2);
            viewer.render();
        },
        zoomToBBoxWithOuterBox: function (box, outerBox, margin, ratio) {
            var viewer = this.viewer;

            var bbox = [];  
            for (var i = 0, len = box[0].length; i < len; i++) {
                bbox.push(box[0][i]);
            }
            for (var i = 0, len = box[1].length; i < len; i++) {
                bbox.push(box[1][i]);
            }

            viewer.zoomToBBoxWithOuterBox(CLOUD.Utils.box3FromArray(bbox),
                CLOUD.Utils.mergeBBox(outerBox), margin, ratio);
        },
        setTopView: function (box, isMeger, margin, ratio) {
            var viewer = this.viewer;
            if (isMeger) {
                viewer.setTopView(CLOUD.Utils.mergeBBox(box));
            } else {
                viewer.setTopView(CLOUD.Utils.computeBBox(box), margin || 1.0, ratio || 1);
            }
        },
        setAllView: function (box, margin, ratio) {
            var viewer = this.viewer;
            viewer.setTopView(CLOUD.Utils.mergeBBox(box), margin || 1.0, ratio || 1);
        },
        zoomToBuilding: function (margin, ratio) {
            // 缩放到指定位置
            var self = this;
            var viewer = self.viewer;
            viewer.zoomToBuilding(margin, ratio);
            viewer.render();
        },
        zoomToSelection: function (box) {
            // 缩放到当前选中构件
            var self = this;
            var viewer = self.viewer;
            viewer.zoomToSelection();
            viewer.render();
        },
        rotateCamera: function () {
            // 漫游模式
            var self = this;
            self._dom.bimBox.find(".view").attr('class', 'view');
            self.pub('fly');
            
            //self.viewer.setRectPickMode();
            self.viewer.editorManager.disableTool(CLOUD.EditToolMode.ZOOM_BY_RECT);
            self.viewer.editorManager.enableTool(self.viewer, CLOUD.EditToolMode.PICK_BY_RECT);
            self.viewer.setPointRotateMode(CLOUD.RotatePivotMode.CAMERA);
        },
        rotateMouse: function () {
            // 普通模式
            var self = this;
            self._dom.bimBox.find(".view").attr('class', 'view');
            self.pub('rotateMouse');

            //self.viewer.setRectPickMode();
            self.viewer.editorManager.disableTool(CLOUD.EditToolMode.ZOOM_BY_RECT);
            self.viewer.editorManager.enableTool(self.viewer, CLOUD.EditToolMode.PICK_BY_RECT);

            self.viewer.setPointRotateMode(CLOUD.RotatePivotMode.MOUSEPOINT);
        },
        rotateObj: function () {
            // 普通模式
            var self = this;
            self._dom.bimBox.find(".view").attr('class', 'view');
            self.pub('rotateMouse');
            
            //self.viewer.setRectPickMode(true);
            self.viewer.editorManager.disableTool(CLOUD.EditToolMode.ZOOM_BY_RECT);
            self.viewer.editorManager.enableTool(self.viewer, CLOUD.EditToolMode.PICK_BY_RECT);
            
            self.viewer.setPointRotateMode(CLOUD.RotatePivotMode.SELECTION);
        },
        home: function () {
            // 普通模式
            var self = this;
            self.pub('home');
            // self.viewer.setStandardView(CLOUD.EnumStandardView.ISO);
            self.viewer.goToInitialView();

            //var categories = ['-2000151']; // promote 'wall' priority
            //self.viewer.resizePool(1000);          // change to small pool size, only outdoor 'wall' is visible.
            //self.viewer.setCategoriesToHighPriority(categories, 1);
   
            self.zoomToBuilding();
        },
        front: function () {
            var self = this,
                viewer = self.viewer;
            self.pub('front');
            viewer.setStandardView(CLOUD.EnumStandardView.Front);
        },
        behind: function () {
            var self = this,
                viewer = self.viewer;
            self.pub('behind');
            viewer.setStandardView(CLOUD.EnumStandardView.Back);
        },
        left: function () {
            var self = this,
                viewer = self.viewer;
            self.pub('left');
            viewer.setStandardView(CLOUD.EnumStandardView.Left);
        },
        right: function () {
            var self = this,
                viewer = self.viewer;
            self.pub('right');
            viewer.setStandardView(CLOUD.EnumStandardView.Right);
        },
        top: function () {
            var self = this,
                viewer = self.viewer;
            self.pub('top');
            viewer.setStandardView(CLOUD.EnumStandardView.Top);
        },
        bottom: function () {
            var self = this,
                viewer = self.viewer;
            self.pub('bottom');
            viewer.setStandardView(CLOUD.EnumStandardView.Bottom);
        },
        southEast: function () {
            var self = this,
                viewer = self.viewer;
            self.pub('southEast');
            viewer.setStandardView(CLOUD.EnumStandardView.SouthEast);
        },
        southWest: function () {
            var self = this,
                viewer = self.viewer;
            self.pub('southWest');
            viewer.setStandardView(CLOUD.EnumStandardView.SouthWest);
        },
        northEast: function () {
            var self = this,
                viewer = self.viewer;
            self.pub('northEast');
            viewer.setStandardView(CLOUD.EnumStandardView.NorthEast);
        },
        northWest: function () {
            var self = this,
                viewer = self.viewer;
            self.pub('northWest');
            viewer.setStandardView(CLOUD.EnumStandardView.NorthWest);
        },
        // 模型检查点
        markers: function () {
            // 进入添加检查点模式
            var self = this;
            var viewer = self.viewer;
            viewer.editMarkerBegin();
        },
        markerEnd: function () {
            // 退出检查点模式
            var self = this;
            var viewer = self.viewer;
            viewer.editMarkerEnd();
            self.rotateMouse();
        },
        saveMarkers: function () {
            // 保存检查点
            var self = this;
            var viewer = self.viewer;
            var list = self.getMakerObject().getMarkerInfoList();
            var newList = [];
            $.each(list, function (i, item) {
                newList.push(JSON.stringify(item));
            });
            return newList;
        },
        loadMarkers: function (list) {
            // debugger;
            // 加载检查点
            var self = this;
            var viewer = self.viewer;
            var newList = [];
            $.each(list, function (i, item) {
                newList.push(JSON.parse(item));
            });
            self.getMakerObject().loadMarkers(newList);
        },
        // 批注
        comment: function (data) {
            // 进入批注模式
            console.log("批注：", data);
            var self = this;
            var viewer = self.viewer;
            var modelBgColor = self._dom.bimBox.css('background-color');
            //收起属性页
            $('.slideBar .icon-caret-right').click();
            //还原颜色
            self._dom.bimBox.addClass('comment');
            //self.setCommentStyle({'stroke-color': 'red','fil-color':'red' });
            self.getAnnotationObject().editAnnotationBegin();
            self.getAnnotationObject().setAnnotationBackgroundColor(modelBgColor);
            if (data) {
                var newList = [];
                $.each(data.list, function (i, item) {
                    newList.push(JSON.parse(window.atob(item)));
                });
                self.getAnnotationObject().loadAnnotations(newList);
            }
            self.getAnnotationObject().setAnnotationType("0");
            bimView.model.comment(self._dom.bimBox);
            if (self.commentColorString != undefined) {
                self._dom.bimBox.find(".commentBar").find(".m-red").attr("data-color", self.commentColorString);
            }
        },
        commentEnd: function () {
            // 退出批注模式
            var self = this;
            var viewer = self.viewer;
            self._dom.bimBox.removeClass('comment');
            self._dom.bimBox.find('.commentBar').remove();
            self.getAnnotationObject().editAnnotationEnd();
            self.rotateMouse();
        },
        setCommentType: function (type) {
            var self = this;
            // var viewer = self.viewer;
            self.getAnnotationObject().setAnnotationType(type);
        },
        setCommentStyle: function (style) {
            var self = this;
            // var viewer = self.viewer;
            self.getAnnotationObject().setAnnotationStyle(style);
        },
        getInput($ele) {
            return $.makeArray($ele.find('input').not(':checked')).reduce((arr, item) => {
                    arr.push($(item).data('index'));
                    return arr;
                }, []
            )
        },
        saveComment: function (callback) {
            // 保存批注
            var self = this;
            var viewer = self.viewer;
            var list = self.getAnnotationObject().getAnnotationInfoList();
            var newList = [];
            $.each(list, function (i, item) {
                newList.push(window.btoa(JSON.stringify(item)));
            });
            console.log(newList);
            var files = bimView.comm.getFilters($("#floors,#specialty"), 'uncheck');
            var category = bimView.comm.getFilters($("#category"), 'uncheck');
            var classCode = bimView.comm.getFilters($("#classCode"), 'uncheck');
            self.getAnnotationObject().captureAnnotationsScreenSnapshot(null, function (data) {
                var varObj = {
                    camera: self.getCamera(),
                    list: newList,
                    image: data.substr(22), //modify by wuweiwei new interface
                    filter: {
                        files: files,
                        category: category,
                        classCode: classCode,
                        index: $.makeArray($('#filter>.tree').children('li:lt(3)')).reduce((arr, item) => {
                            arr.push(self.getInput($(item)));
                            return arr;
                        }, [])
                    }
                }
                callback && callback(varObj);
            })
        },
        setInputChecked(arr, ids) {
            debugger;
            $.each(arr, (i, n) => {
                $.each(n, (index, item) => {
                    // debugger;
                    let $li = $('#filter>.tree').children('li').eq(i);
                    let $input = i ? $li.find('input[data-index=' +
                        item +
                        ']') : $li.find('.leaf input[data-index=' +
                        item +
                        ']');
                    $input.is(':checked') && $input.click();
                })
            })
        },
        loadComment: function (data) {
            // 加载批注
            var self = this;
            var viewer = self.viewer;
            var newList = [];
            $.each(data.list, function (i, item) {
                newList.push(JSON.parse(window.atob(item)));
            });
            if ($.isEmptyObject(data.filter)) {
                debugger;
                return;
            }
            self.fileFilter(data.filter.files);
            self.filter(data.filter.category);
            self.filter(data.filter.classCode, function () {
            });
            // debugger;
            //set filter state when from comments page check model
            window.classCodeIds = data.filter.classCode.ids;
            $('#filter>.tree').children('li:lt(3)').find('input').prop('checked', true);
            self.setClasscodeInput();
            self.setInputChecked(data.filter.undefined);
            self.getAnnotationObject().loadAnnotations(newList);
        },
        exitComment: function () {
            var self = this;
            var viewer = self.viewer;
            self.getAnnotationObject().uninitAnnotation();
        },
        // 模型过滤器
        filter: function (obj, callback, bRender) {
            // obj{type:"categoryId",ids:[id,id,id]},type为自定义属性,包括categoryId,classCode,sceneId
            var self = this;
            var viewer = self.viewer;
            var filter = viewer.getFilter();
            //filter.removeFromUserList(CLOUD.EnumUserType.HIDDEN_DATA, obj.type);
            self.clearFilterTranslucentOthersUserIDList();
            var fileIds = new Array();
            $.each(obj.ids, function (i, id) {
                fileIds.push(id);
            });
            filter.setUserList(CLOUD.EnumUserType.HIDDEN_DATA,obj.type,  fileIds, false);

            if ((bRender===undefined) || (bRender ===true)) {
                viewer.render();
            }
            
            callback && callback();
        },
        // 模型过滤器
        filterByUserIds: function (ids, callback) {
            // ids:[id,id,id]
            var self = this;
            var viewer = self.viewer;
            var filter = viewer.getFilter();

            if(ids){
                filter.addToIdList(CLOUD.EnumIdBasedType.VISIBLE, ids);
            }
            else{
                filter.clearIdList(CLOUD.EnumIdBasedType.VISIBLE);
            }

            viewer.render();
            callback && callback();
        },
        fileFilter: function (obj, bRender) {
            var self = this;                                                     
            var viewer = self.viewer;
            var filter = viewer.getFilter();
            self.clearFilterTranslucentOthersUserIDList();
            var fileIds = new Array();
            $.each(obj.ids, function (i, id) {
                fileIds.push(id);
            });
            filter.setIdList(CLOUD.EnumIdBasedType.FILE_HIDDEN, fileIds);

            if ((bRender===undefined) || (bRender ===true)) {
                viewer.render();
            }
        },
        highlight: function (obj) {
            // 高亮
            var self = this;
            var viewer = self.viewer;
            var filter = viewer.getFilter();      

            if(obj === undefined)
            {
                filter.clearOverrideList('highlight');
                return;
            }

            if (obj.type == "userId") {
                filter.setOverrideList('highlight', obj.ids, "highlight");          //liuw-d   由于高亮构件在优先显示是存在材质数据丢失问题采用此方式修改,否则采用下面的调用方式
                //filter.setOverrideListByColor('highlight', obj.ids,  {color: 0x1377C0, opacity: 1.0, side: THREE.DoubleSide});
           } else {
                if (obj.ids == undefined) {
                    filter.setOverrideList(obj.type, undefined);
                } else {
                    $.each(obj.ids, function (i, id) {
                        filter.setOverrideList(obj.type, id, "lightBlue");
                    });
                }
            }
            viewer.render();
        },
        ignoreTranparent: function (obj) {
            // 高亮
            var self = this;
            var viewer = self.viewer;
            var filter = viewer.getFilter();
            if (obj.type == "userId") {
                filter.setOverrideList('highlight', obj.ids, 'highlight');
            } else {
                if (obj.ids == undefined) {
                    filter.setOverrideList(obj.type, undefined);
                } else {
                    $.each(obj.ids, function (i, id) {
                        filter.setOverrideList(obj.type, id, null);
                    });
                }
            }
            viewer.render();
        },
        downplay: function (obj) {
            var self = this;
            var viewer = self.viewer;
            var filter = viewer.getFilter();
            if (obj.type == "userId") {
                filter.setOverrideList('highlight', [],'highlight');
            } else {
                $.each(obj.ids, function (i, id) {
                    filter.removeFromOverrideList(obj.type, id);
                });
            }
            viewer.render();
        },
        setSelectedIds: function (ids, bRender) {
            var self = this;
            var viewer = self.viewer; 
            viewer.setSelection(ids);
            if ((bRender===undefined) || (bRender ===true)) {
                viewer.render();
                viewer.render();
            }
        },
        getSelectedIds: function () {
            var self = this;
            var viewer = self.viewer;
            //var filters = viewer.getFilter();
            var selectedItems = viewer.getSelection();
            var ids = {};
            for(var i = 0;i < selectedItems.length; i++) {
                ids[selectedItems[i]] = true;
            }
            return ids;
        },
        collision: function (idA, idB) {
            // 碰撞
            var self = this;
            var viewer = self.viewer;
            var filter = viewer.getFilter();
            filter.setOverrideList('collisionA', [idA], 'darkRed');
            filter.setOverrideList('collisionB', [idB], 'lightBlue');
            viewer.render();
        },
        setOverrider: function (name, ids) {
            var self = this;
            var viewer = self.viewer;
            var filter = viewer.getFilter();
            filter.setOverrideList(name, ids, name);
            viewer.render();
        },
        translucent: function (flag) {
            // 半透明
            var self = this;
            var viewer = self.viewer;
            var filter = viewer.getFilter();
            if(flag)
            {   
                filter.makeSceneTranslucent();
            }
            else
            {
                filter.cancelSceneTranslucent();
            }

            //viewer.render();
        },
        getTranslucentStatus: function () {
            // 获取半透明状态
            var self = this;
            var viewer = self.viewer;
            var filter = viewer.getFilter();
            return (filter._filterImpl.getSceneState() === CLOUD.EnumSceneState.TRANSLUCENT)
        },
        isolate: function () {
            var self = this;
            var viewer = self.viewer;
            //var filter = viewer.getFilter();
            ////filter.setHideUnselected(!filter.isHideUnselected());
            //filter.hideUnselections();
            CLOUD.FilterUtil.hideUnselections(viewer);
            viewer.render();
        },
        clearSelection: function (bRender) {
            // 获取半透明状态
            var self = this;
            var viewer = self.viewer;
            viewer.clearSelection();
            if (bRender === true) {
                viewer.render();
            }
            return  ;
        },
        clearIsolate: function (bRender) {
            var self = this;
            var viewer = self.viewer;
            var filter = viewer.getFilter();
            var isIsolateState = filter.isIsolate();
            if (isIsolateState === true){ 
            
                filter.clearAllIsolateList();
                filter.clearAllIsolateConditions();
                if (bRender === true) {
                    viewer.render();
                } 
            }
            
        },
        clearFilterTranslucentOthersUserIDList: function () {
            var self = this;
            var viewer = self.viewer;
            var filter = viewer.getFilter();
            filter.clearIdList(CLOUD.EnumIdBasedType.TRANSLUCENT_OTHERS);
        }, 
        showAll: function () {
            //恢复
            var self = this;
            var viewer = self.viewer;
            viewer.clearSelection();
            var filter = viewer.getFilter();
            self.clearIsolate();
            if (App.Project) {
                if (App.Project.ProjectContainer) {
                    var ProjectContainer = new App.Project.ProjectContainer;
                    ProjectContainer.resetProperNull();
                } else {
                    if (App.Project.resetModelNull) {
                        App.Project.resetModelNull();
                    }
                }
                // if(App.Project.ProjectContainer){
                //   var ProjectContainer = new App.Project.ProjectContainer;
                //   ProjectContainer.resetProperNull();
                // }else{
                //   var ProjectContainer = new App.Project.ProjectContainer;
                //   ProjectContainer.resetProperNull();
                // }
            }
            if (App.Index) {
                App.Index.setAttrNull && App.Index.setAttrNull();
            }
            if (App.ResourceModel) {
                var ListNav = new App.ResourceModel.ListNav;
                ListNav.resetProperNull();
            }
            //filter.clear();
            self.clearFilterTranslucentOthersUserIDList();
            filter.clearOverrideList('highlight');
            filter.cancelSceneTranslucent();
            filter.cancelTranslucent();
            filter.clearIdList(CLOUD.EnumIdBasedType.HIDDEN);
            filter.clearIdList(CLOUD.EnumIdBasedType.VISIBLE);
            if (App.Project) {
                if (App.Project.ProjectContainer) {
                    self.filter({
                        ids: ['10.01'],
                        type: "classCode"
                    }, function(){}, false)

                } else {
                    let modelBar = $('.modelBar'), txt = $('.cur').text();
                    modelBar.find(`.modelItem:contains(${txt})`).trigger('click');
                }
            }
            var specialty = bimView.comm.getFilters($("#specialty,#floors"), 'uncheck');
            var category = bimView.comm.getFilters($("#category"), 'uncheck');
            var classCode = bimView.comm.getFilters($("#classCode"), 'uncheck'); 
                    
            self.fileFilter(specialty, false);
            self.filter(category, false);
            self.filter(classCode);
            viewer.render();
        },
        setHideSelected: function () {
            //隐藏选中构件
            var self = this;
            var viewer = self.viewer;
            CLOUD.FilterUtil.hideSelections(viewer);
            //var filter = viewer.getFilter();
            ////filter.setHideSelected(!filter.isHideSelected());
            //filter.hideSelections();
            self.clearSelection();
            viewer.render();
        },
        setTranslucentSelected: function () {
            //半透明选中构件
            var self = this;
            var viewer = self.viewer;
            var filter = viewer.getFilter();
            var selection = viewer.getSelection();
            //filter.makeTranslucentByIds(selection);
            //filter.setTranslucentSelected();
            ////filter.makeSelectedTranslucent();
            CLOUD.FilterUtil.makeSelectedTranslucent(viewer);
            var selection = viewer.getSelection();
            self.clearSelection();
            viewer.render();
            //viewer.setSelection(selection);
        },
        addToIsolateList: function (ids, bRender) {
            //指定构件之外的构件半透明
            var self = this;
            var viewer = self.viewer;
            var filter = viewer.getFilter();
            var sceneState = filter.getSceneState();
            if (sceneState === CLOUD.EnumSceneState.TRANSLUCENT) {
                filter.cancelSceneTranslucent();
            }
            filter.clearAllIsolateList();
            filter.addToIsolateList(3, ids);
            if (bRender === true) {
                viewer.render();
            }
        },
        setTranslucentUnselected: function () {
            //半透明未选中构件
            var self = this;
            var viewer = self.viewer;
            var filter = viewer.getFilter();
            var selection = viewer.getSelection();
            //filter.clearAllIsolateList();
            //filter.addToIsolateList(3, selection);
            //filter.setTranslucentUnselected();
            ////filter.makeSelectedOthersTranslucent(true);
            //filter.makeSceneTranslucent();
            ////CLOUD.FilterUtil.makeSelectedOthersTranslucent(CLOUD.EnumFilterType.ISOLATE_TRANSLUCENT_OTHERS, viewer);
            CLOUD.FilterUtil.makeSelectedOthersTranslucent(viewer);
            viewer.render();
            //viewer.render();
        },
        initMap: function (options) {
            var defaults = {
                    element: '',
                    name: 'defaultMap',
                    axisGrid: '',
                    enable: true,
                    callbackCameraChanged: null,
                    callbackMoveOnAxisGrid: null
                },
                _opt = $.extend({}, defaults, options);
            // 初始化小地图
            var self = this,
                viewer = self.viewer,
                _el = _opt.element,
                _width = _el.width(),
                _height = _el.height(),
                _css = {
                    left: '0px',
                    bottom: '0px',
                    outline: 'none',
                    position: 'relative'
                };
            if (_opt.axisGrid) {
                // debugger;
                self.getMiniMapObject().setAxisGridData(_opt.axisGrid)
            }
            //viewer.createMiniMap(_opt.name, _el[0], _width, _height, _css, _opt.callbackCameraChanged, _opt.callbackMoveOnAxisGrid);
            self.getMiniMapObject().createMiniMap(_opt.name, _el[0], _width, _height, _css, _opt.callbackCameraChanged, _opt.callbackMoveOnAxisGrid, _opt.callbackMapClick);
            self.getMiniMapObject().enableAxisGridEvent(_opt.name, _opt.enable);
            self.getMiniMapObject().generateAxisGrid(_opt.name);

        },
        setAxisGrid: function (name, x, y) {
            var viewer = this.viewer;
            //viewer.flyBypAxisGridNumber(name, x, y); note by wuweiwei old version
            this.getMiniMapObject().flyBypAxisGridNumber(name, x, y);
        },
        setFloorMap: function (obj, name, flag) {
            // 设置小地图
            var viewer = this.viewer;
            this.getMiniMapObject().setFloorPlaneData(obj);
            this.getMiniMapObject().generateFloorPlane(name, flag);
        },
        showAxisGrid: function (name) {
            var viewer = this.viewer;
            //viewer.showAxisGrid(name, true); note by wuweiwei old version
            this.getMiniMapObject().showAxisGrid(name, true);
        },
        load: function (etag) {
            // 加载场景
            var viewer = this.viewer;
            var client = viewer.load(etag, bimView.API.baseUrl + bimView.API.fetchModel);
            viewer.render();
            return client;
        },
        showScene: function (client, flag) {
            // 显示隐藏场景
            var viewer = this.viewer;
            if (viewer && viewer.showScene) {
                viewer.showScene(client, flag);
                viewer.render();
            }
        },
        getCamera: function () {
            var viewer = this.viewer;
            return window.btoa(viewer.getCamera());
        },
        setCamera: function (json) {
            var viewer = this.viewer;
            viewer.setCamera(window.atob(json));
        },
        commentInit: function () {
            console.log($('#comment'))
        },
        isIsolate: function(){
            var viewer = this.viewer;
            var selectedIds = this.getSelectedIds();
            var isIsolateState = viewer.getFilter().isIsolate();
            if((Object.keys(selectedIds).length >= 1)|| isIsolateState === true){
                return true;
            }
            return false;
        }
    }
})($);