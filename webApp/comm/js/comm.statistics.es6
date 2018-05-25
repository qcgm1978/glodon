App.Statistics = {
    bindEvt() {
        const arr = [
            {
                type: 'video',
                selector: '#meetingOpen'
            },
            {
                type: 'todo',
                selector: '#todos a',
                data: (target) => {
                    let sys = $(target).data('stat');
                    return {
                        sys,
                        client: 'pc'
                    }
                }
            },
            {
                type: 'flow',
                selector: 'div.flowModal div.flowModalBbar > a,.flowListBox:nth-child(2) li span',
                data: (target) => {
                    return {
                        itemid: String($(target).data('id'))
                    }
                }
            },
            {
                type: 'modelview',
                selector: 'span.fileName > a',
                data: (target) => {
                    return {
                        modeltype: /\.(rvt|rfa|rte)$/.test($(target).text()) ? 'single' : 'cad',
                        projectid: App.currentProject.projectId
                    }
                }
            }
        ];
        arr.forEach(item => {
            $('body').on('click', item.selector,
                (evt, bool) => {
                    let json = item.data instanceof Function ? item.data(evt.target) : item.data;
                    let data = $.extend({
                        type: item.type,
                    }, json)
                    !bool && this.sendStatistics(data, evt.target);
                    if ($(evt.target).is(':not(a)')) {
                        return !!bool;
                    }
                });
        })
    },
    sendStatistics(info, target) {
        // debugger;
        let json = $.extend({}, info);
        delete json.type;
        let obj = $.isEmptyObject(json) ? {type: info.type} : {
            type: info.type,
            json: JSON.stringify(json)
        };
        const data = {
            URLtype: "statistics",
            data: obj,
            type: "post",
            //    todo need change post
            //     type:'get'
        };
        App.Comm.ajax(data, function (xhr) {
            if (xhr.code === 0 && xhr.data) {
                // console.log(info.target ? info.target : info, info.data)
                // debugger;
                $(target).trigger('click', [true]);
            }
        }, (xhr) => {
            // reject(xhr.statusText);
            $(target).trigger('click', [true]);
        });
    }
}
App.Statistics.bindEvt();