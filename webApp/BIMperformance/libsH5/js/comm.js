/**
 * @require /BIMperformance/libsH5/js/bimView.js
 */
'use strict'
    ; (function ($) {
        bimView.comm = {
            ajax: function (data, callback) {
                //封装ajax
                data = bimView.comm.getUrl(data);
                return $.ajax(data).done(function (data) {
                    if ($.isFunction(callback)) {
                        //回调
                        callback(data);
                    }
                });
            },
            getUrl: function (data) {
                // 根据API获取对应url
                var self = this;
                var result = data;
                //url 是否有参数
                var urlPars = data.url.match(/\{([\s\S]+?(\}?)+)\}/g);
                if (urlPars) {
                    for (var i = 0; i < urlPars.length; i++) {
                        var rex = urlPars[i],
                            par = rex.replace(/[{|}]/g, ""),
                            val = data[par];
                        result.url = result.url.replace(rex, val);
                    }
                }
                result.url = bimView.API.baseUrl + result.url
                return result;
            },
            removeById: function (arr, id) {
                var tmpArr = arr.concat();
                var index = tmpArr.indexOf(id);
                tmpArr.splice(index, 1);
                return tmpArr
            },
            getFilters: function (element, select) {
                var type = element.data('type'),
                    list = element.find('.itemNode').length == 0 ? element : element.find('.itemNode'),
                    result = {
                        type: type,
                        ids: []
                    };
                if (type == 'classCode') {
                    var regData = [],
                        classCodeData = bimView.sidebar.classCodeData;
                    $.each(list, function (i, item) {
                        var $item = $(item),
                            isChecked = $item.find('input').prop('checked'),
                            userData = $item.data('userData') ? $item.data('userData').toString() : '',
                            hasChild = $item.find('.tree').length;
                        if ((!hasChild && select == 'uncheck' && !isChecked) || (!hasChild && select == 'checked' && isChecked) || select == 'all') {
                            regData.push(userData);
                        }
                        if ((hasChild && select == 'uncheck' && !isChecked) || hasChild && select == 'checked' && isChecked) {
                            result.ids.push(userData);
                        }
                    });
                    var str = regData.toString().replace(/,/g, "|");
                    var reg = new RegExp("^(" + str + ")");
                    $.each(classCodeData, function (i, item) {
                        if (regData.length == 0) return
                        if (item.parentCode == -1) {
                            if (regData.indexOf("-1") != -1) {
                                result.ids.push(item.code);
                            }
                        }
                        if (reg.test(item.code)) {
                            result.ids.push(item.code);
                        }
                    });
                } else if (type == 'sceneId') {
                    result.total = [];
                    $.each(list, function (i, item) {
                        var $item = $(item),
                            isChecked = $item.find('input').prop('checked'),
                            userData = $item.data('userData') ? $item.data('userData').toString().split(",") : [];
                        if (select == 'uncheck' && !isChecked || select == 'checked' && isChecked || select == 'all') {
                            result.ids = result.ids.concat(userData);
                        }
                        result.total = result.total.concat(userData);
                    });
                    result.ids = result.ids.unique();
                    result.total = result.total.unique();
                    result.total = result.total.minus(result.ids);
                } else {
                    $.each(list, function (i, item) {
                        var $item = $(item),
                            isChecked = $item.find('input').prop('checked'),
                            userData = $item.data('userData') ? $item.data('userData').toString().split(",") : [];
                        if (select == 'uncheck' && !isChecked || select == 'checked' && isChecked || select == 'all') {
                            result.ids = result.ids.concat(userData);
                        }
                    });
                }
                return result;
            },
            bindEvent: {// 绑定事件
                sub: {},
                on: function (key, element) {
                    this.sub[key] ? this.sub[key].push(element) : (this.sub[key] = []) && this.sub[key].push(element);
                },
                pub: function (key) {
                    if (this.sub[key]) {
                        for (var i = 0, len = this.sub[key].length; i < len; i++) {
                            this.sub[key][i].click();
                        }
                    }
                },
                keyPress: function (e) {
                    var e = e || event,
                        currKey = e.keyCode || e.which || e.charCode;
                    bimView.comm.bindEvent.pub(currKey);
                },
                keyboardEvent: function () {
                    var self = this;
                    $(document).on('keypress', self.keyPress);
                },
                removeEvent: function () {
                    $(document).off('keypress', self.keyPress);
                },
                init: function () {
                    this.keyboardEvent();
                }
            },
            inputIndex: 0,
            viewTree: function (options) {
                var defualts = {
                    arr: [],
                    name: '',
                    code: '',
                    type: '',
                    dataType: 'arr',
                    children: '',
                    childrenName: '',
                    childrenType: 'arr',
                    data: '',
                    id: '',
                    isChecked: true,
                    isSelected: false
                },
                    _opt = $.extend({}, defualts, options);
                // debugger;
                this.inputIndex = 0;
                return renderTree.call(this, _opt.arr, _opt.name, _opt.dataType);

                function renderTree(arr, name, dataType, prefix, isleaf) {
                    // debugger;
                    if (arr.length == 0) return;
                    var tree;
                    if (isleaf == undefined)  /* modify by wuweiwei:class="tree root" 与 class="tree leaf" 中 root&leaf 是方便DOM操作 */ {
                        tree = $('<ul class="tree root"></ul>');
                    }
                    else if (isleaf == "isleaf") {
                        tree = $('<ul class="tree leaf"></ul>');
                    }
                    var _this = this;
                    $.each(arr, function (i, item) {
                        var type = _opt.type,
                            itemName, data, iconStatus, input, span, itemClassCodeNumber;
                        if (dataType == 'arr') {
                            itemName = item[name];
                            if (type == "classCode") {
                                itemClassCodeNumber = item["classCodeNumber"];
                            }
                            data = item[_opt.data] ? item[_opt.data].toString() : '';
                        } else {
                            itemName = item;
                            if (prefix != null) {
                                data = prefix + "_" + i;
                            } else {
                                data = i;
                            }
                        }
                        ;
                        if (item[_opt.children]) {
                            iconStatus = 'm-openTree';
                        } else {
                            iconStatus = 'noneSwitch';
                        }
                        // debugger;
                        if (_opt.isChecked && item.code != '10.01') {
                            input = '<input type="checkbox" checked="checked" data-index="' +
                                _this.inputIndex +
                                '" />'
                            _this.inputIndex++;
                        } else {
                            input = '<input type="checkbox" data-index="' +
                                _this.inputIndex +
                                '"/>'
                            _this.inputIndex++;
                        }
                        if (type == "classCode") {
                            if (_opt.isSelected) {
                                span = '<span class="treeText selected">' + itemName + '<span class="treeColor">(' + itemClassCodeNumber + ')</span></span>'
                            } else {
                                if (_opt.type == 'classCode') {
                                    span = '<span class="treeText" title="' + item['code'] + '">' + itemName + '<span class="treeColor">(' + itemClassCodeNumber + ')</span></span>'
                                } else if (_opt.name == "specialty") {
                                    span = '<span class="treeText" mcode="' + item['specialtyCode'] + '">' + itemName + '<span class="treeColor">(' + itemClassCodeNumber + ')</span></span>'
                                } else {
                                    span = '<span class="treeText">' + itemName + '<span class="treeColor">(' + itemClassCodeNumber + ')</span></span>'
                                }
                            }
                        } else {
                            if (_opt.isSelected) {
                                span = '<span class="treeText selected">' + itemName + '</span>'
                            } else {
                                if (_opt.type == 'classCode') {
                                    span = '<span class="treeText" title="' + item['code'] + '">' + itemName + '</span>'
                                } else if (_opt.name == "specialty") {
                                    // debugger;
                                    span = '<span class="treeText" mcode="' + item['specialtyCode'] + '">' + itemName + '</span>'
                                } else {
                                    span = '<span class="treeText">' + itemName + '</span>'
                                }
                            }
                        }
                        var tmpHtml;
                        if (isleaf == undefined)  /* modify by wuweiwei:class = m-lbl-root & m-lbl-leaf 是方便DOM操作 */ {
                            tmpHtml = $('<li class="itemNode" data-type="' + type + '">\
              <div class="itemContent">\
              <i class="' + iconStatus + '"></i>\
              <label class="treeCheckbox">' + input + '<span class="m-lbl m-lbl-root"><span class="tempStatus"></span></span></label>' + span + '\
            </div></li>');
                        }
                        else if (isleaf == "isleaf") {
                            tmpHtml = $('<li class="itemNode" data-type="' + type + '">\
              <div class="itemContent">\
              <i class="' + iconStatus + '"></i>\
              <label class="treeCheckbox">' + input + '<span class="m-lbl m-lbl-leaf"><span class="tempStatus"></span></span></label>' + span + '\
            </div></li>');
                        }
                        tmpHtml.data('userData', data);
                        if (item[_opt.children] && typeof item[_opt.children] == "object") {
                            var children = renderTree.call(_this, item[_opt.children], _opt.childrenName, _opt.childrenType, item[_opt.code], "isleaf");
                            tmpHtml.append(children);
                        }
                        tree.append(tmpHtml);
                    });
                    return tree;
                }
            },
            dialog: function (options) {
                var defaults = {
                    width: 560,
                    title: "系统提示",
                    content: "",
                    okText: (App.Local.data['model-view'].OK || "确定"),
                    callback: null
                };
                var _opt = $.extend({}, defaults, options);
                var dialog = $('<div class="modelDialog"><div class="dialogBody" style="width:' + _opt.width + 'px;"><div class="dialogHeader">' + _opt.title + '<span class="icon modelicon dialogClose">&#xe61f;</span></div><div class="dialogContent"></div><div class="dialogFooter"><input type="button" class="dialogOk dialogBtn" value="' + _opt.okText + '"/></div></div></div>');
                dialog.find(".dialogContent").append(_opt.content);
                dialog.find(".dialogFooter").prepend(_opt.footer);
                $('body').append(dialog);
                dialog.on('click', '.dialogClose', function () {
                    dialog.remove();
                }).on('click', '.dialogOk', function () {
                    if (_opt.callback && _opt.callback.call(this) !== false) {
                        dialog.remove();
                    }
                })
            },
            getModelBgColor: function () {
                if (window.localStorage) {
                    return localStorage.getItem('modelBgColor') || 'color-1';
                } else {
                    return 'color-1'
                }
            },
            setModelBgColor: function (color) {
                if (window.localStorage) {
                    localStorage.setItem('modelBgColor', color);
                }
            },
            renderSelected: function (data) {
                var fileData = bimView.sidebar.fileData;
                var rootDom = $('#selected .selectTree');
                var treeData = {};
                var treeHtml = $('<div class="tree"></div>');
                if (!data) {
                    rootDom.html('');
                    return
                }
                $.each(data, function (i, item) {
                    var name = fileData[item.modelId];
                    var parents = treeHtml.find('[data-type="' + name + '"]')
                    if (parents.length > 0) {
                        var child = parents.find('[data-type="' + item.cateName + '"]')
                        if (child.length > 0) {
                            child.find('.tree').append(createli(item.name, false));
                        } else {
                            parents.append(createUl(item.cateName, createUl(item.name, false)))
                        }
                    } else {
                        var child = createUl(item.cateName, createUl(item.name, false));
                        var parent = $(createli(name, true)).append(child);
                        treeHtml.append(parent);
                    }
                });
                rootDom.html(treeHtml);

                function createUl(parent, child) {
                    var ul = $('<ul class="tree"></ul>');
                    var li = $(createli(parent, child)).append(child);
                    return ul.append(li);
                }

                function createli(name, hasChild) {
                    var icon = hasChild ? 'm-openTree' : 'noneSwitch'
                    var dom = '<li class="itemNode" data-type="' + name + '">\
              <div class="itemContent">\
                <i class="' + icon + '"></i>\
                <span class="treeText">' + name + '</span>\
              </div>\
            </li>';
                    return dom;
                }
            }
        }
        Array.prototype.remove = function (item) {
            var _self = this;
            if ((typeof item) == 'object') {
                for (var i = 0, len = item.length; i < len; i++) {
                    remove(item[i]);
                }
            } else {
                remove(item);
            }

            function remove(x) {
                var index = _self.indexOf(x);
                if (index > -1) {
                    _self.splice(index, 1);
                }
            }
        }
        Array.prototype.indexOf = function (item) {
            for (var i = 0; i < this.length; i++) {
                if (this[i] == item) {
                    return i;
                }
            }
            return -1;
        }
        Array.prototype.intersect = function (x) {
            var arr = [];
            var that = this;
            var i = 0;
            var len = that.length;
            for (; i < len; i++) {
                if (x.indexOf(that[i]) > -1) {
                    arr.push(that[i]);
                }
            }
            return arr;
        }
        Array.prototype.unique = function () {
            var n = {}, r = [];
            for (var i = 0; i < this.length; i++) {
                if (!n[this[i]]) {
                    n[this[i]] = true;
                    r.push(this[i]);
                }
            }
            return r;
        }
        Array.prototype.minus = function (arr) {
            var result = [];
            var self = this;
            for (var i = 0, len = self.length; i < len; i++) {
                var flag = true;
                for (var j = 0, arrLen = arr.length; j < arrLen; j++) {
                    if (arr[j] == self[i]) {
                        flag = false;
                    }
                }
                if (flag) {
                    result.push(self[i]);
                }
            }
            return result;
        }
    })($);
