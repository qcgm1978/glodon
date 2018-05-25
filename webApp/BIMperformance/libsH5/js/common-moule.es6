App.CommonModule = {
    getRemoteModel(settings) {
        return new Promise((resolve, reject) => {
            const data = {
                URLtype: "fetchRemoteModel",
                data: {
                    projectId: settings.projectId,
                    versionId: settings.versionId,
                }
            };
            App.Comm.ajax(data).done(function (data) {
                if (data.code == 0 && data.data.exceptionCount) {
                    resolve(data.data);
                } else {
                    reject(data)
                }
            }).fail((jqXHR, textStatus, errorThrown) => {
                reject({jqXHR, textStatus, errorThrown})
            });
        })
    },
    promptRemoteModelDialog(data) {
        const filesStr = data.exceptionFileList.reduce((str, val, index) => {
            let semicolon = (index === data.exceptionFileList.length - 1) ? '' : ';';
            return `${str}<p style="font-size: inherit; line-height: inherit;">${val}${semicolon}</p>`;
        }, '')
        let ChinaStr = `当前版本共上传${data.totalCount}个模型文件，已转换完的${data.successCount}个文件中，有以下${data.exceptionCount}个文件存在远端多余构件，如不更改会影响模型正常浏览：`;
        let message = App.Local.data['source-model'].remoteME, success=data.successCount>1?'s':'',exception=data.exceptionCount>1?'s':'';
        let engStr = message ? message.replace(`{total}`, `${data.totalCount}`).replace('{success}', `${data.successCount}`).replace('{err}', `${(data.exceptionCount>1?"are ":"is ")+data.exceptionCount}`) : '';
        engStr=engStr.replace('{totals}',data.totalCount>1?'s have':' has').replace('{successes}',success).replace(/{errs}/g,exception)
        new App.Comm.modules.Dialog({
            isAlert: true,
            width: 580,
            height: 168,
            limitHeight: false,
            title: App.Local.data.system.notice2 || '提示',
            cssClass: 'deleteFileDialog',
            okClass: "delFile",
            okText: App.Local.data.system.Ikw || '知道了',
            okCallback: function okCallback() {
            },
            message: `${engStr || ChinaStr}${filesStr}`
        });
        $('.mod-dialog .wrapper .content').css('overflow-y', 'auto')
    },
}