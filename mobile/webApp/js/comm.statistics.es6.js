'use strict';
App.Statistics = {
    bindEvt: function bindEvt() {
        var _this = this;
        // debugger;
        var arr = [{
            type: 'todo',
            selector: '#todoBox,#todoComponent',
            data: function data(target, currentTarget) {
                var $div = $(target).closest("div.indexToDoListComponent");
                target = $div.length ? $div : currentTarget;
                var sys = $(target).data('stat');
                return {
                    sys: sys,
                    client: 'mobile'
                };
            }
        }, {
            type: 'mobileentry',
            selector: '.border-bottom-color>div>a[id]',
            data: function data(target, currentTarget) {
                return {
                    tosys: $(target).data('type')
                };
            }
        }, {
            type: 'modelview',
            selector: '#fileListComponent > a[href^="#/viewModel"],#fileListComponent > a[href^="#/paperModel"],#fileListComponent > a[href^="#/famLibsModel"]',
            data: function data(target, currentTarget) {
                var id = '';
                try {
                    id = App.Projects.ProjectFileList.defaults.projectId;
                } catch (e) {
                    if(App.Resource.FamLibs){
                        id = App.Resource.FamLibs.defaults.projectId;
                    }if(App.Resource.FamilyLibrary){
                        id = App.Resource.FamilyLibrary.defaults.familyId;
                    }else{
                        id = App.Resource.ModelLibrary.defaults.projectId;
                    }
                }
                return {
                    modeltype: /\.(rvt|rfa|rte)$/.test($(currentTarget).find('h2').text()) ? 'single' : 'cad',
                    projectid: id
                };
            }
        }];
        arr.forEach(function (item) {
            $('body').on('click', item.selector, function (evt, bool) {
                var json = item.data instanceof Function ? item.data(evt.target, evt.currentTarget) : item.data;
                var data = Object.assign({
                    type: item.type,
                }, json);
                !bool && _this.sendStatistics(data, evt.target);
                if ($(evt.target).is(':not(a)')) {
                    return !!bool;
                }
            });
        });
    },
    sendStatistics: function sendStatistics(info, target) {
        return new Promise(function (resolve, reject) {
            var json = Object.assign({}, info);
            delete json.type;
            var obj = $.isEmptyObject(json) ? {type: info.type} : {
                type: info.type,
                json: JSON.stringify(json)
            };
            var data = {
                // URLtype: "statistics",
                url: App.Restful.urls.statistics,
                data: obj,
                success: function (xhr) {
                    xhr = JSON.parse(xhr);
                    if (xhr.code === 0 && xhr.data) {
                        // console.log(info.target ? info.target : info, info.data);
                        resolve(xhr.data);
                        $(target).trigger('click', [true]);
                    }
                },
                error: function (xhr) {
                    reject(xhr.statusText);
                    $(target).trigger('click', [true]);
                },
                contentType: 'application/x-www-form-urlencoded',
                type: 'post',
                //todo need change to post
                // type: "get"
            };
            App.Comm.ajax(data);
        });
    }
};
App.Statistics.bindEvt();