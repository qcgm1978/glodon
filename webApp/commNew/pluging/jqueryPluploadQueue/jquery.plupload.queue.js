/**
 * jquery.plupload.queue.js
 *
 * Copyright 2009, Moxiecode Systems AB
 * Released under GPL License.
 *
 * License: http://www.plupload.com/license
 * Contributing: http://www.plupload.com/contributing
 */
// JSLint defined globals
/*global plupload:false, jQuery:false, alert:false */
/**
 * @require /libs/jquery-1.12.0.min.js
 */
;
(function ($) {
    var uploaders = {};
    var formatSize = function (size) {
        if (size === undefined || /\D/.test(size)) {
            return 'N/A';
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
    }
    
    function _(str) {
        return plupload.translate(str) || str;
    }
    
    function renderUI(id, target) {
        // Remove all existing non plupload items
        target.contents().each(function (i, node) {
            node = $(node);
            if (!node.is('.plupload')) {
                node.remove();
            }
        });
        target.prepend(
            '<div class="plupload_wrapper plupload_scroll">' +
            '   <div id="' + id + '_container" class="plupload_container">' +
            '      <div class="plupload">' +
            '           <div class="plupload_header">' +
            '               <div class="plupload_header_content">' +
            '                   <em class="plupload-icon-arrow-up"></em>' +
            '                   <div class="plupload_header_title"><span class="plupload_status_title">' + _('Start upload') + '</span><span class="plupload_status_text"></span></div>' +
            '               </div>' +
            '           </div>' +
            '           <div class="plupload_content">' +
            '               <div class="plupload_filelist_header">' +
            '                   <div class="pl-na">' + _('Filename') + '</div>' +
            '                   <div class="pl-ac">&nbsp;</div>' +
            '                   <div class="pl-st"><span>' + _('Status') + '</span></div>' +
            '                   <div class="pl-si">' + _('Size') + '</div>' +
            '                   <div class="plupload_clearer">&nbsp;</div>' +
            '               </div>' +
            '               <ul id="' + id + '_filelist" class="plupload_filelist"></ul>' +
            '               <div class="plupload_filelist_footer"></div>' +
            '           </div>' +
            '       </div>' +
            '   </div>' +
            '   <input type="hidden" id="' + id + '_count" name="' + id + '_count" value="0" />' +
            '</div>'
        );
    }
    
    $.fn.pluploadQueue = function (settings) {
        if (settings) {
            this.each(function () {
                var uploader, target, id;
                target = $(this);
                id = target.attr('id');
                if (!id) {
                    id = plupload.guid();
                    target.attr('id', id);
                }
                uploader = new plupload.Uploader($.extend({
                    dragdrop: true
                }, settings));
                uploaders[id] = uploader;
                
                function handleStatus(file) {
                    var actionClass;
                    if (file.status == plupload.DONE) {
                        actionClass = 'plupload_done';
                    } else if (file.percent == 100) {
                        actionClass = 'plupload_complete_handling';
                    } else {
                        if (file.status == plupload.FAILED) {
                            actionClass = 'plupload_failed';
                        }
                        if (file.status == plupload.QUEUED) {
                            actionClass = 'plupload_delete';
                        }
                        if (file.status == plupload.UPLOADING) {
                            actionClass = 'pl_up';
                        }
                    }
                    actionClass += ' clr';
                    var icon = $('#' + file.id).attr('class', actionClass).find('a');
                    if (file.hint) {
                        icon.attr('title', file.hint);
                    }
                }
                
                function changeStatus() {
                    var statusTitle,
                        statusText;
                    if (uploader.total.uploaded === uploader.files.length) {
                        statusTitle = _("Upload Complete");
                        statusText = '';
                        App.ids = [];
                        App.selectedid = $('.treeViewMar .selected').data('id');
                        $('.treeViewMar .on').each(function (i, item) {
                            App.ids.push($(this).siblings('span').data('id'));
                        });
                        if (App.ResourcesNav) {
                            if (App.ResourcesNav.Settings.type == "standardLibs") {
                                $('#resourceModelLeftNav').remove();
                                $("#contains").append(new App.ResourceModel.LeftNav().render().el);
                            } else if (App.ResourcesNav.Settings.type == "famLibs") {
                                $('#resourceFamlibsLeftNav').remove();
                                $("#contains").append(new App.ResourceFamLibs.leftNav().render().el);
                            }
                        } else if ($("#projectContainer").length > 0) {
                            $('#projectContainer .leftNav').remove();
                            $("#projectContainer").prepend(new App.Project.leftNav().render().el);
                            App.Project.fetchFileNav();
                        }
                        App.cb = function () {
                            $('span[data-id=' + App.selectedid + ']').addClass('selected');
                            $.each(App.ids, function (i, item) {
                                $('span[data-id=' + item + ']').siblings('.nodeSwitch').click();
                            })
                        }
                    } else {
                        statusTitle = _('Start upload');
                        if (uploader.files.length === 1) {
                            statusText = ' (' + uploader.total.percent + '%)';
                        } else {
                            statusText = _('Uploaded %d/%d files').replace(/%d\/%d/, uploader.total.uploaded + '/' + uploader.files.length) + ' (' + uploader.total.percent + '%)';
                        }
                    }
                    $('span.plupload_status_title', target).text(statusTitle);
                    $('span.plupload_status_text', target).text(statusText).show();
                }
                
                //exports for custom use
                uploader.reset = function () {
                    for (i = 0; i < uploader.files.length; i++) {
                        $('#' + uploader.files[i].id).remove();
                    }
                    uploader.splice();
                }
                
                function updateList(files) {
                    var fileList = $('ul.plupload_filelist', target);
                    var htmlStr = '';
                    $.each(files, function (i, file) {
                        htmlStr += '<li id="' + file.id + '" class="clr pl_up">' +
                            '<div class="pl-na">' + file.name + '</div>' +
                            '<div class="pl-ac"><a title="取消" href="javascript:;"></a></div>' +
                            '<div class="pl-st">0%</div>' +
                            '<div class="pl-si">' + formatSize(file.size) + '</div></li>';
                    });
                    fileList[0].innerHTML += htmlStr;
                    // scroll to end of file list
                    fileList[0].scrollTop = fileList[0].scrollHeight;
                    changeStatus();
                }
                
                function bindEvent() {
                    //delegate event
                    $('ul.plupload_filelist', target).delegate('.pl-ac a', 'click', function () {
                        var row = $(this).parent().parent();
                        if (row.is('.plupload_done') || row.is('.plupload_complete_handling')) {
                            return false;
                        }
                        var fileId = row.attr('id');
                        var file = uploader.getFile(fileId);
                        if (file.status === plupload.UPLOADING) {
                            uploader.stop();
                        }
                        if (file.status === plupload.FAILED) {
                            $('#' + fileId).remove();
                            uploader.removeFile(file);
                            file.id = new Date().getTime();
                            uploader.addFiles([uploader.getNativeFiles()[fileId]]);
                            return false;
                        }
                        $('#' + fileId).remove();
                        uploader.removeFile(file);
                        changeStatus();
                        return false;
                    });
                }
                
                uploader.bind("UploadFile", function (up, file) {
                    $('#' + file.id).addClass('plupload_current_file');
                });
                uploader.bind("UploadComplete", function (up, file) {
                    if (up.runtime === 'flash') {
                        up.trigger('Refresh');
                    }
                    $('span.plupload_status_title', target).text(_("Upload Complete"));
                });
                uploader.bind('Init', function (up, res) {
                    renderUI(id, target);
                    bindEvent();
                });
                uploader.init();
                uploader.bind("Error", function (up, err) {
                    var file = err.file,
                        message;
                    if (file) {
                        message = err.message;
                        if (err.details) {
                            message += " (" + err.details + ")";
                        }
                        if (err.code == plupload.FILE_SIZE_ERROR) {
                            if (file.size > up.settings.max_file_size) {
                                alert(_("Error: File too large: ") + file.name);
                            } else {
                                alert(_("Quota exceed error"));
                            }
                        }
                        if (err.code == plupload.FILE_EXTENSION_ERROR) {
                            alert(_("Error: Invalid file extension: ") + file.name);
                        }
                        file.hint = message;
                        $('#' + file.id).attr('class', 'plupload_failed clr').find('a').css('display', 'block').attr('title', message)
                            .end().find('.pl-st').text('0%');
                        file.percent = 0;
                    }
                });
                uploader.bind('StateChanged', function () {
                    if (uploader.state === plupload.STARTED) {
                        changeStatus();
                    }
                });
                uploader.bind('FilesAdded', function (up, files) {
                    //改参数在 com.upload.js 中
                    if (App.isUploading) {
                        var d = new Date();
                        updateList(files);
                    } else {
                        //删除最后一个
                        uploader.files.pop();
                    }
                });
                uploader.bind('FileUploaded', function (up, file) {
                    file.hint = _('Upload Success');
                    handleStatus(file);
                    debugger;
                });
                
                uploader.bind("UploadProgress", function (up, file) {
                    // Set file specific progress
                    $('#' + file.id + ' div.pl-st', target).text(file.percent + '%');
                    if (file.percent === 100) {
                        file.hint = _('Upload Complete Handling');
                    }
                    handleStatus(file);
                    changeStatus();
                });
                // Call setup function
                if (settings.setup) {
                    settings.setup(uploader);
                }
            });
            return this;
        } else {
            // Get uploader instance for specified element
            return uploaders[$(this[0]).attr('id')];
        }
    };
})(jQuery);