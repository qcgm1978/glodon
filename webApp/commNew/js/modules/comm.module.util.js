/**
 * author: baoym@grandsoft.com.cn
 * description: util module
 */
(function ($) {
    'use strict'

    var util = {

        postItems: function (params) {
            params.type = 'post'
            params.data = JSON.stringify(params.data)
            this.__excuteAction(params)
        },

        getItems: function (params) {
            params.type = 'get'
            this.__excuteAction(params)
        },

        deleteItems: function (params) {
            params.type = 'delete'
            params.data = JSON.stringify(params.data)
            this.__excuteAction(params)
        },

        updateItems: function (params) {
            params.type = 'put'
            params.data = JSON.stringify(params.data)
            this.__excuteAction(params)
        },

        __excuteAction: function (params) {
            $.ajax({
                type: params.type,
                url: params.url,
                data: params.data,
                dataType: 'json',
                contentType: 'application/json',
                global: typeof(params.global) === 'undefined' ? true : params.global,
                success: function (data) {
                    params.success && params.success(data)
                },
                error: function (event, xhr, err) {
                    params.error && params.error(event, xhr, err)
                }
            })
        },

        isEmail: function (v) {
            return /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/.test(v)
        },

        isMobile: function (v) {
            return /^\d{11}$/.test(v)
        },

        isGlodonAccount: function (v) {
            var self = this
            if (self.isEmail(v)) return true
            if (self.isMobile(v)) return true
            return false
        },

        __tip: null,

        __tipAnimationTimer: null,

        actionTip: function (text, tipClass, time) {
            var self = this
            if (!self.__tip) {
                self.__tip = $('#page-global-tip')
            }
            var tip = self.__tip.stop(true).removeClass('success info').addClass(tipClass)
            clearTimeout(self.__tipAnimationTimer)
            tip.text(text).animate({
                top: 0
            }, function () {
                self.__tipAnimationTimer = setTimeout(function () {
                    tip.animate({
                        top: -54
                    }, 200)
                }, time || 3000)
            })
        },

        showTip: function (text, tipClass) {
            var self = this
            if (!self.__tip) {
                self.__tip = $('#page-global-tip')
            }
            self.__tip.removeClass('success info').addClass(tipClass)
            var tip = self.__tip.animate({
                top: 0
            })
            text ? tip.text(text) : ''
        },

        hideTip: function (text, time) {
            var self = this
            text ? self.__tip.text(text) : ''
            clearTimeout(self.__tipAnimationTimer)
            self.__tipAnimationTimer = setTimeout(function () {
                self.__tip.animate({
                    top: -54
                }, 200)
            }, time || 700)
        },

        getLocaleDate: function (ms, shortDate, delimiter, onlyYearAndMonthAndDay, noSecond) {
            if (!ms) return
            var date = new Date(ms),
                y = date.getFullYear(),
                m = date.getMonth() + 1,
                d = date.getDate(),
                h = date.getHours(),
                mu = date.getMinutes(),
                s = date.getSeconds()

            function f(ff) {
                return ff < 10 ? '0' + ff : ff
            }

            m = f(m)
            h = f(h)
            d = f(d)
            mu = f(mu)
            s = f(s)
            if (shortDate) {
                return m + (delimiter || '月') + d
            } else if (onlyYearAndMonthAndDay) {
                return y + (delimiter || '年') + m + (delimiter || '月') + d
            } else if (noSecond) {
                return y + (delimiter || '年') + m + (delimiter || '月') + d + ' ' + h + ':' + mu
            } else {
                return y + (delimiter || '年') + m + (delimiter || '月') + d + ' ' + h + ':' + mu + ':' + s
            }
        },

        formatSize: function (size) {
            if (size === undefined || /\D/.test(size)) {
                return 'N/A'
            }
            if (size >= 1099511627776) {
                return parseInt((size / 1099511627776) * 100, 10) / 100 + 'TB'
            }
            if (size >= 1073741824) {
                return parseInt((size / 1073741824) * 100, 10) / 100 + 'GB'
            }
            if (size >= 1048576) {
                return parseInt((size / 1048576).toFixed(2) * 100, 10) / 100 + 'MB'
            } else if (size >= 6) {
                return parseInt((size / 1024).toFixed(2) * 100, 10) / 100 + 'KB'
            } else {
                return size + 'B'
            }
        },

        isOffice: function(extension){
            return !!{
                'doc': true,
                'docx': true,
                'dotx': true,
                'dot': true,
                'dotm': true,
                'xls': true,
                'xlsx': true,
                'xlsm': true,
                'xlm': true,
                'xlsb': true,
                'ppt': true,
                'pptx': true,
                'pps': true,
                'ppsx': true,
                'potx': true,
                'pot': true,
                'pptm': true,
                'potm': true,
                'ppsm': true
            }[extension]
        },

        setFileIcon: function (file) {
            var fileIcon
            var extension = (file.extension && file.extension.toLowerCase()) || ''
            if (file.folder) {
                // maybe appdata
                fileIcon = file.clientId === 'appdata' ? 'appdata' : 'folder'
            } else {
                var ext = extension.replace(/\d+$/g,'')
                switch (ext) {
                    /**********office document************/
                    case 'doc':
                    case 'docx':
                        fileIcon = 'word'
                        break
                    case 'ppt':
                    case 'pptx':
                        fileIcon = 'ppt'
                        break
                    case 'xls':
                    case 'xlsx':
                        fileIcon = 'excel'
                        break
                    case 'jpeg':
                        fileIcon = 'jpg'
                        break
                    case 'pdf':
                    case 'txt':
                    /**********视频图片************/
                    case 'jpg':
                    case 'png':
                    case 'gif':
                    case 'bmp':
                    case 'tga':
                    case 'psd':
                    /**********建筑图纸************/
                    case 'nwd':
                    case 'dxf':
                    case 'dgn':
                    case '3ds':
                    case 'dwf':
                    case 'skp':
                    case 'rvt':
                    /**********广联达计价************/
                    case 'gbq' :
                    case 'gbg' :
                    case 'gzb' :
                    case 'gtb' :
                    case 'gpb' :
                    case 'gpe' :
                    case 'ges' :
                    case 'gdzb' :
                    case 'gdtb' :
                    case 'gdys' :
                    case 'gdgs' :
                    case 'gbqcn' :
                    case 'gbgcn' :
                    case 'gzbcn' :
                    case 'gtbcn' :
                    case 'gpbcn' :
                    case 'gpecn' :
                    case 'gcazb' :
                    case 'gcatb' :
                    case 'gcays' :
                    case 'gcags' :
                    /**********广联达计量************/
                    case 'gbqpc' :
                    case 'gbgpc' :
                    case 'gzbpc' :
                    case 'gtbpc' :
                    case 'gpbpc' :
                    case 'gpepc' :
                    case 'gbqhc' :
                    case 'gbghc' :
                    case 'gzbhc' :
                    case 'gtbhc' :
                    case 'gpbhc' :
                    case 'gpehc' :
                    case 'gbqmt' :
                    case 'gbgmt' :
                    case 'gzbmt' :
                    case 'gtbmt' :
                    case 'gpbmt' :
                    case 'gpemt' :

                    case 'gwhzb' :
                    case 'gwhtb' :
                    case 'gwhys' :
                    case 'gwhgs' :
                    case 'glctb' :
                    case 'glczb' :
                    case 'glcys' :
                    case 'glcgs' :
                    /**********广联达设计BIM************/
                    case 'gcl' :
                    case 'gqi' :
                    case 'ggj' :
                    case 'gjgt' :
                    case 'gdq' :
                    case 'gma' :
                    case 'gst' :
                    case 'gsa' :
                    case 'gss' :
                    case 'gfy' :
                    case 'gbt' :
                    /**********行业工程文件************/
                    case 'dwg' :
                    case 'ifc' :
                    case 'gbv' :
                    case 'igms' :
                    case 'guc' :
                    case 'gfc' :
                    case 'gmsb' :
                    case 'abc' :
                    case 'gsm' :
                    /**********其他文件************/
                    case 'html' :
                    case 'xml' :
                    case 'rar' :
                    case 'zip' :
                    case '7zip' :
                    case 'jar' :
                        fileIcon = ext
                        break
                    case 'htm':
                        fileIcon = 'html'
                        break
                    default:
                        fileIcon = 'other'
                        break
                }
            }
            file.fileIcon = fileIcon
            return file
        },

        __localStoreKey: 'glodon_storage',

        getParaValue: function (param, str) {
            var hashs = (str ? str : location.hash.substr(2)).split('&')
            var findValue
            _.each(hashs, function (hash) {
                var h = hash.split('=')
                if (h[0] === param) {
                    findValue = h[1]
                    return false
                }
            })
            return findValue
        },

        getLocalStore: function (key) {
            var self = this
            var s = store.get(self.__localStoreKey) || {}
            var o = {}
            if (_.isObject(key)) {
                for (var p in key) {
                    o[p] = s[p] || key[p]
                    /*default value*/
                }
            } else {
                o = s[key]
            }
            return o
        },

        setLocalStore: function (key, value) {
            var self = this
            var s = store.get(self.__localStoreKey) || {}
            if (_.isObject(key)) {
                for (var p in key) {
                    s[p] = key[p]
                }
            } else {
                s[key] = value
            }
            store.set(self.__localStoreKey, s)
            return self
        },

        sortItems: function (items) {
            var self = this
            var sortType = self.getLocalStore('sortType') || 'updateTime'
            var sortOrder = self.getLocalStore('sortOrder') || 'descending'
            var descending = sortOrder === 'descending' ? true : false
            var folders = []
            var files = []
            var mergeItems
            for (var i = 0, l = items.length; i < l; i++) {
                if (items[i].folder) {
                    folders.push(items[i])
                } else {
                    files.push(items[i])
                }
            }
            var returnValue = function (v) {
                if (typeof(v) === 'number') {
                    return v
                }
                if (typeof(v) === 'string') {
                    return v.toLowerCase()
                }
            }
            var getValue = function (key, item) {
                key = key.split('.')
                var foundValue
                if (key.length === 1) {
                    foundValue = item[key]
                    return returnValue(foundValue)
                } else {
                    //e.g: owner.displayName
                    foundValue = item[key.shift()]
                    while (key.length) {
                        foundValue = foundValue[key.shift()]
                    }
                    return returnValue(foundValue)
                }
            }
            var sortFunc = function (itemA, itemB) {
                if (descending) {
                    return getValue(sortType, itemA) < getValue(sortType, itemB) ? 1 : -1
                } else {
                    return getValue(sortType, itemA) > getValue(sortType, itemB) ? 1 : -1
                }
            }
            folders.sort(sortFunc)
            files.sort(sortFunc)
            if (descending) {
                mergeItems = folders.concat(files)
            } else {
                mergeItems = files.concat(folders)
            }
            // because we use `prepend` method, so reverse it
            return mergeItems.reverse()
        }

    }

    // export public method

    App.Comm.modules.util = util;

})(jQuery)
