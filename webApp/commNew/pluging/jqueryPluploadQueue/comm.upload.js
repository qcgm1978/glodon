/**
 * author: baoym@grandsoft.com.cn
 * description: general upload module
 * dependency:
 */
(function($) {

    var isUploading = false;

    var userAgent = navigator.userAgent.toLowerCase()

    var isSafari = /webkit/.test(userAgent) && !/chrome/.test(userAgent)

    var supportDirectory = function() {
        var input = document.createElement('input')
            // todo: now is chrome only
        return ('webkitdirectory' in input)
    }

    var supportDragdrop = function() {
        var div = document.createElement('div')
        return ('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)
    }

    //默认配置
    var defaultOptions = {
        // plupload options
        url: '/document/id/file/?upload&returnFirst',
        runtimes: 'html5, flash',
        unique_names: true,
        flash_swf_url: '/libs/plupload/plupload.flash.swf',
        multipart: true,
        dragdrop: false,
        browse_button: 'file-upload-btn',
        // custom options
        directory: true,
        draggable: true,
        dragAndDropUpload: true,
        skipCheckSize: 78643200000000 // files below 7.5M not check size(get uploaded bytes) while upload
    }

    var upload = {
        init: function(container, options) {

            if (!container) return
            upload.container = container
            upload.options = options || {}
            upload.__initPlUpload($.extend({}, defaultOptions, upload.options))
        },

        //设置最大下载尺寸
        setMaxSize: function(size) {
            if (!upload.container) return false
            upload.container.pluploadQueue().settings.max_file_size = size
        },

        //初始化
        __initPlUpload: function(options) {

            var self = upload
            options.init = {
                FilesAdded: function(up, files) {

                    if(options.beforeAdd!=undefined&&!options.beforeAdd(files))/*返回false,终止上传;返回true,继续上传 add by wuweiwei 2017-2-9*/
                    {
                        return;
                    }

                    if (!options.canUploadFile()) {
                        //jquery.plupload.quere.js b绑定了 FilesAdded 这个时候文件已经存在了，所以 要删除
                        App.isUploading = false;
                        alert("请选择要上传的文件夹");
                        debugger;
                        return;
                    } else {
                        App.isUploading = true;
                    }
                    // quota info in the right bottom corner
                    if (options.getQuotaInfo) {
                        self.container.find('.quota-tip-info').text(options.getQuotaInfo())
                    }
                    self.__showUploadModal()
                    self.container.removeClass('uploaded-completed')
                    var parentId = options.getParentId() || ''
                    if (isSafari) {
                        //safari 5.1.7's File API not support slice method, so can not upload part of the file - 2012.11.28
                        $.each(files, function(idx, file) {
                            file.uploadedBytes = 0
                            file.parentId = parentId
                        })
                    } else {
                        $.each(files, function(idx, file) {
                            file.parentId = parentId
                        })
                    }
                    up.start();
                },
                BeforeUpload: function(up, file) {

                    if (options.getUploadedBytesUrl && (file.size > options.skipCheckSize && typeof file.uploadedBytes === 'undefined')) {
                        up.stop()
                        $.getJSON(options.getUploadedBytesUrl(file.parentId), {
                            name: file.name,
                            size: file.size
                        }, function(data) {
                            file.uploadedBytes = 0
                            up.start()
                        })
                    } else {
                      
                        var fn =file.fullPath || file.name;
                        up.settings.multipart_params = {
                            fileId: file.parentId,
                            fileName: fn,
                            size: file.size
                                // position: file.uploadedBytes || 0
                        }
                        up.settings.uploaded_bytes = file.uploadedBytes || 0
                        if (options.getUploadUrl) {
                            up.settings.url = options.getUploadUrl(file)
                        }
                    }
                },
                UploadFile: function(up, file) {

                    isUploading = true;
                    /*self.maskTree.createMask();*/
                },
                FileUploaded: function(up, file, response) {
                    /*[基础资源]-->[上传文件]完成后*/
                    try {
                        options.fileUploaded(response, file)
                    } catch (e) {
                        //todo
                    }
                },
                UploadComplete: function(up, file) {
                    isUploading = false;
                    App.isUploading = false;
                    self.container.addClass('uploaded-completed')
                    if (options.fileUploadCompleted) {
                        options.fileUploadCompleted(up)
                    }
                },
                FilesRemoved: function(up, files) {
                    if (up.files.length === 0) {
                        isUploading = false
                        self.container.addClass('uploaded-completed')
                    }
                },
                Error: function(up, file) {

                    if (file.code === -500) {
                        //upload initialize error, todo
                        return
                    }
                    if (file.code === 4 || file.code === -200) {
                        options.uploadError && options.uploadError(file)
                    }
                },
                Init: function(up) {

                    if (options.draggable && !isSafari && up.features.dragdrop) {
                        //add dragdrop tip
                        var tip = '可以把文件直接拖到浏览器中进行上传'
                        self.container.append($('<div>', {
                            'class': 'plupload dragdrop-tip',
                            title: tip,
                            text: tip
                        }))
                    }
                    if (up.runtime === 'flash') {
                        up.settings.url += '&result=String'
                    }
                }
            }

            //是否可以上传文件夹
            if (supportDirectory() && options.directory && options.runtimes !== 'flash') {
                var buttonsIds = self.__initDirectoryUpload(options)
                options.directoryUpload = true
                options.browse_button = buttonsIds.browseButtonId
                options.browse_dir_button = buttonsIds.browseDirButtonId
            }

            self.container.pluploadQueue(options)
                //关闭弹出层
            self.container.append($('<div>', {
                'class': 'plupload plupload-icon-remove',
                title: '关闭',
                click: function(e) {
                    e.stopPropagation()
                    self.__hideUploadModal()
                    if (options.onHideUploadModal) {
                        options.onHideUploadModal()
                    }
                    return false
                }
            }))

            //最小化弹出层
            self.container.append($('<div>', {
                'class': 'plupload plupload-icon-minus',
                title: '最小化窗口',
                click: function(e) {
                    self.__toggleUploadModal()
                    return false
                }
            }))

            // 存在 容量
            if (options.getQuotaInfo) {
                self.container.append($('<div>', {
                    'class': 'plupload quota-tip-info'
                }))
            }

            //拖拽移动上传的弹出层
            if (options.draggable && self.container.draggable) {
                self.container.draggable({
                    axis: 'x',
                    containment: 'window',
                    handle: '.plupload_header'
                });

            }

            //双击头部收起展开
            self.container.find('.plupload_header').dblclick(function() {
                self.__toggleUploadModal()
            })


            // drag and drop upload 是否可以拖拽上传 仅仅 H5
            if (options.dragAndDropUpload && supportDragdrop) {
                $(document.body).append(drapAndDropPH)
                var dragArea = $(document.body)
                dragArea.bind('drop.upload', function(e) {
                    dragArea.removeClass('dragupload-drag-over')
                    if (!options.canUploadFile()) {
                        alert("请选择要上传的文件夹");
                        debugger;
                        return false;
                    }
                    App.isUploading = true;
                   
                    if (!e.originalEvent.dataTransfer) return
                    var files = e.originalEvent.dataTransfer.files,
                        items = e.originalEvent.dataTransfer.items
                    if (items) {
                        var allFiles = [],
                            onlyFile=0;
                        for (var i = 0; i < items.length; i++) {
                            if (items[i].kind !== 'file') continue
                            self.__showUploadModal()
                            var entry = items[i].webkitGetAsEntry()
                            if (entry.isFile) {
                                self.__readFile(entry, function(file) {
                                    allFiles.push(file)
                                })
                                onlyFile++;
                            } else if (entry.isDirectory) {
                                self.__showUploadModal()
                                var a = 1
                                self.__traverseDirectory(entry, function(file) {
                                    allFiles.push(file)
                                })
                            }
                        }
                        var time = 500
                        var fileNum = 0
                        var fileTimer = setTimeout(function() {
                            if (allFiles.length > fileNum) {
                                fileNum = allFiles.length
                                fileTimer = setTimeout(arguments.callee, time)
                            } else {
                                clearTimeout(fileTimer)
                                self.__addFiles(allFiles)
                            }
                        }, time)
                    } else {
                        if (files.length > 0) {
                            self.__showUploadModal()
                            self.__addFiles(files)
                        }
                    }
                    return false
                })
                dragArea.bind('dragenter.upload dragover.upload', function(e) {

                    if (dragArea.find(e.target).length === 1) { //&& options.canUploadFile()
                        dragArea.addClass('dragupload-drag-over')
                        return false
                    }


                })
                dragArea.bind('dragleave.upload', function(e) {
                    dragArea.removeClass('dragupload-drag-over')
                })
                $(window).on('beforeunload.upload', function() {
                    if (isUploading) {
                        return '有文件还未上传完成，确定要离开吗？'
                    }
                })
            }
        },

        //显示上传谈层
        __showUploadModal: function() {
            upload.container.css({
                bottom: 0
            }).show()
            $(".plupload-icon-minus").css({
                "background-position-x": -14
            }).attr({
                "title": "最小化窗口"
            })
        },

        //隐藏上传弹出层
        __hideUploadModal: function() {
            upload.container.animate({
                bottom: -382
            }, function() {
                $(this).hide()
                upload.container.pluploadQueue().reset()
            })
        },

        // 切换 最大化 最小化
        __toggleUploadModal: function() {
            //设置top bottom 无效
            upload.container.css("top","auto");
            if (upload.container.css('bottom') === '-382px') {
                upload.container.animate({
                    bottom: 0
                })
                $(".plupload-icon-minus").css({
                    "background-position-x": -14
                }).attr({
                    "title": "最小化窗口"
                })
            } else {
                upload.container.animate({
                    bottom: -382
                })
                $(".plupload-icon-minus").css({
                    "background-position": 0
                }).attr({
                    "title": "最大化窗口"
                })
            }
        },

        //遍历文件夹目录
        __traverseDirectory: function(entry, callback) {
            if (entry.isFile) {
                upload.__readFile(entry, callback)
            } else if (entry.isDirectory) {
                var dirReader = entry.createReader()
                dirReader.readEntries(function(entries) {
                    var el = entries.length
                    while (el--) {
                        upload.__traverseDirectory(entries[el], callback)
                    }
                })
            }
        },

        //读取文件
        __readFile: function(fileEntry, callback) {
            
            fileEntry.file(function(file) {
                file.fullPath = fileEntry.fullPath
                callback && callback(file)
            })
        },

        //将文件添加到队列
        __addFiles: function(files) {

            upload.container.pluploadQueue().addFiles(files)
        },

        //初始化文件夹上传
        __initDirectoryUpload: function(options) {
            var uploadButton = $('#' + options.browse_button)
            var uploadButtons = $('<div class="upload-dropdown-buttons">' +
                '<ul>' +
                '   <li class="upload-file-btn" id="html5-uploadfile-btn"><em class="sicon-file"></em>&nbsp;&nbsp;文件</li>' +
                '   <li class="upload-dir-btn" id="html5-uploaddir-btn"><em class="sicon-sfolder"></em>&nbsp;&nbsp;文件夹</li>' +
                '</ul></div>')
            options.browse_button = 'html5-uploadfile-btn'
            options.browse_dir_button = 'html5-uploaddir-btn'
            $(uploadButtons).appendTo(document.body)
            uploadButton.click(function(e) {
                //灰色按钮点击无效
                if($(e.currentTarget).is('.disable')){
                    return
                }
                var p = $(this).offset()
                uploadButtons.css({
                    top: p.top + $(this).height() + 18,
                    left: p.left
                }).show()
                $(document).one('click.hideuploaddropdown', function() {
                    uploadButtons.hide()
                })
                return false
            })
            return {
                browseButtonId: 'html5-uploadfile-btn',
                browseDirButtonId: 'html5-uploaddir-btn'
            }
        }
        ,
        maskTree : {
            /*
            write by wuweiwei
            在上传文件夹时，给左侧树生成mask,防止用户点击文件夹
            */
            createMask : function(){
                this.mask = document.createElement("div");
                this.mask.style.position = "absolute";
                this.mask.style.top = "0";
                this.mask.style.left = "0";
                this.mask.style.right = "0";
                this.mask.style.bottom = "0";
                this.mask.style.backgroundColor="#FFF";
                try
                {
                    this.mask.style.filter = "alpha(opacity=0)";
                }
                catch(e){;}
                try
                {
                    this.mask.style.opacity = "0";
                }
                catch(e){;}
                try
                {
                    var resourceFamlibsLeftNav = $(".projectNavFileContainer")[0];
                    $(resourceFamlibsLeftNav).css("position","relative");
                    resourceFamlibsLeftNav.appendChild(this.mask);
                }catch(e){;}
            }
        }
    }

    //拖拽定义
    var drapAndDropPH = '' +
        '<div class="drag-helper-view-top"></div>' +
        '<div class="drag-helper-view-right"></div>' +
        '<div class="drag-helper-view-bottom"></div>' +
        '<div class="drag-helper-view-left"></div>'

    // export public method
    App.Comm.upload = {
        init: upload.init,
        setMaxSize: upload.setMaxSize,
        //获取上传实例
        getUploadInstance: function() {
            if (!upload.container) return {}
            return upload.container.pluploadQueue()
        },
        //设置配置信息 右下角
        setQuotaInfo: function(text) {
            if (!upload.container) return null
            upload.container.find('.quota-tip-info').text(text)
        },
        //销毁
        destroy: function() {

            if (!upload.container) return null;
            upload.container.pluploadQueue().trigger('Destroy');
            $(".mod-plupload,.plupload,.upload-dropdown-buttons,.drag-helper-view-top,.drag-helper-view-right,.drag-helper-view-bottom,.drag-helper-view-left").remove();
            $(document.body).unbind(".upload");
            upload.container = undefined;
        }
    }

})(jQuery);