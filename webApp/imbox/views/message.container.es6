App.INBox = App.INBox || {}
App.INBox.imboxContainerView = Backbone.View.extend({
    tagName: 'div',
    className: 'contentBox',
    template: _.templateUrl('./imbox/tpls/container.html', true),
    events: {
        'click .title a': 'popup'
    },
    popup(evt) {
        const data = $(evt.target).data()
        App.INBox.read(data.id, evt.currentTarget, data.projectid, data.version, data.shareid,data.isdeleted)
        //0:批注,1:建议反馈,2:远端模型
        if (data.type===2) {
            let url = $(evt.target).data('url');
            let path = url.startsWith('/#') ? url : (url.replace('/', '/#'));
            window.open(location.protocol + '//' + location.host + path)
        } else {
            // App.INBox.read(data.id, data.projectid, data.version, data.shareid);
        }
    },
    initialize: function () {
        this.listenTo(App.INBox.messageCollection, "reset", this.renderData);
        this.listenTo(App.INBox.messageAllCollection, "reset", this.renderAllData);
    },
    render() {
        this.$el.html(this.template);
        return this;
    },
    //滚动条
    bindTreeScroll() {
        var $modelTree = $(".scrollBoxUl");
        if (!$modelTree.hasClass('mCustomScrollbar')) {
            $modelTree.mCustomScrollbar({
                set_height: "100%",
                set_width: "100%",
                theme: 'minimal-dark',
                axis: 'y',
                keyboard: {
                    enable: true
                },
                scrollInertia: 0
            });
        }
    },
    //滚动条
    bindTreeScrollS() {
        var $modelTree = $(".scrollBoxUlS");
        if (!$modelTree.hasClass('mCustomScrollbar')) {
            $modelTree.mCustomScrollbar({
                set_height: "100%",
                set_width: "100%",
                theme: 'minimal-dark',
                axis: 'y',
                keyboard: {
                    enable: true
                },
                scrollInertia: 0
            });
        }
    },
    overflowHideHandle(str,len,bool){//超出隐藏 是否省略号 ，str字符串，len截取长度，bool是否省略号
        var strLen = 0,
            returnStr = str,
            ellipsisStr = "...";
        if(!bool){
            ellipsisStr = "";
        }
        for(var i=0,iLen=str.length;i<iLen;i++){
            if(str.charCodeAt(i)>19968&&str.charCodeAt(i)<40869){
                strLen+=2;
            }else{
                strLen+=1;
            }
        }
        if(strLen>len){
            returnStr = str.substring(0,len)+ellipsisStr;
        }
        return returnStr;
    },
    renderData(item) {
        var self = this;
        var _data = item.toJSON()[0];
        var _html = _.templateUrl('./imbox/tpls/list.html');
        if (!_data.items.length) {
            this.$('.commissionLists').html('<span class="noData"><i class="tip"></i>' +
                (App.Local.data.system.Nme || '没有消息') +
                '</span>');
            return
        }
        _data.items.map(function(item,index) {
            var itemContentStr = item.content;
            var firstIndex = itemContentStr.indexOf("<");
            var lastIndex = itemContentStr.lastIndexOf(">");
            var firstStrs = itemContentStr.substring(0,firstIndex+1);
            var contentStrs = itemContentStr.substring(firstIndex+1,lastIndex);
            var lastStrs = itemContentStr.substring(lastIndex);
            item.ellipsisStr = firstStrs+self.overflowHideHandle(contentStrs,20,true)+lastStrs;
            return item;
        })
        this.$('.commissionLists').html(_html({
            data: _data.items
        }));
        this.$(".commissionListPagination").empty().pagination(_data.totalItemCount, {
            items_per_page: _data.pageItemCount,
            current_page: _data.pageIndex - 1,
            num_edge_entries: 3, //边缘页数
            num_display_entries: 5, //主体页数
            link_to: 'javascript:void(0);',
            itemCallback: function (pageIndex) {
                App.INBox.loadData('un', pageIndex + 1);
            },
            prev_text: (App.Local.data['system-module'].Back || "上一页"),
            next_text: (App.Local.data['source-model'].nt || "下一页")
        });
        this.bindTreeScroll();
    },
    renderAllData(item) {
        var self = this;
        var _data = item.toJSON()[0];
        var _html = _.templateUrl('./imbox/tpls/list.html');
        if (!_data.items.length) {
            this.$('.alreadyLists').html('<span class="noData"><i class="tip"></i>' +
                (App.Local.data.system.Nme || '没有消息') +
                '</span>');
            return
        }
        _data.items.map(function(item,index) {
            var itemContentStr = item.content;
            var firstIndex = itemContentStr.indexOf("<");
            var lastIndex = itemContentStr.lastIndexOf(">");
            var firstStrs = itemContentStr.substring(0,firstIndex+1);
            var contentStrs = itemContentStr.substring(firstIndex+1,lastIndex);
            var lastStrs = itemContentStr.substring(lastIndex);
            item.ellipsisStr = firstStrs+self.overflowHideHandle(contentStrs,20,true)+lastStrs;
            return item;
        })
        this.$('.alreadyLists').html(_html({
            data: _data.items
        }));
        this.$(".alreadyListPagination").empty().pagination(_data.totalItemCount, {
            items_per_page: _data.pageItemCount,
            current_page: _data.pageIndex - 1,
            num_edge_entries: 3, //边缘页数
            num_display_entries: 5, //主体页数
            link_to: 'javascript:void(0);',
            itemCallback: function (pageIndex) {
                App.INBox.loadData('all', pageIndex + 1);
            },
            prev_text: (App.Local.data['system-module'].Back || "上一页"),
            next_text: (App.Local.data['source-model'].nt || "下一页")
        });
        this.bindTreeScrollS();
    }
})