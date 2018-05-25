App.Notice = {
    defaults: {
        searchData: []
    },
    pageIndex: 1,
    init: function () {
        $("#pageLoading").hide();//隐藏加载
        $("#contains").html(new App.Notice.NoticeListView().render().$el);
        // App.Notice.loadData();//初始化之后获取列表数据
    },
    NoticeCollection: new (Backbone.Collection.extend({
        model: Backbone.Model.extend({
            defaults: function () {
                return {
                    title: ''
                }
            }
        }),
        urlType: "getServersNoticeList",
        parse: function (responese) {
            if (responese.message == "success") {
                return responese.data.items;
            }
        }
    })),
    loadData(parme) {//初始化之后获取列表数据
        var self = this;
        var defaultData = {
            title: '',
            status: 1,
            pageIndex: this.pageIndex,
            pageItemCount: 15,
        };
        const extendData = $.extend({}, defaultData, parme);
        //数据重置
        App.Notice.NoticeCollection.reset();
        App.Notice.NoticeCollection.fetch({
            data: extendData,
            success(collection, response, options) {
                $("#listDomBox").find(".noDataTd").parent().remove();
                //分页
                var $content = $(".noticeListContent"),
                    $el, pageCount = response.data.totalItemCount;
                // debugger;
                $el = $content.find(".commissionListPagination");
                let total = App.Local.getTotalStr(pageCount, 'announce.announcement');
                $content.find(".commissionBottom .sumDesc").html(total);
                $el.pagination(pageCount, {
                    items_per_page: response.data.pageItemCount,
                    current_page: response.data.pageIndex - 1,
                    num_edge_entries: 3, //边缘页数
                    num_display_entries: 5, //主体页数
                    link_to: 'javascript:void(0);',
                    itemCallback(pageIndex) {
                        //加载数据
                        self.pageIndex = ++pageIndex;
                        self.loadData();
                    },
                    prev_text: (App.Local.data['system-module'].Back || "上一页"),
                    next_text: (App.Local.data['source-model'].nt || "下一页")
                });
                $('.scrollBox').mCustomScrollbar({
                    set_height: "97%",
                    theme: 'minimal-dark',
                    axis: 'y',
                    keyboard: {
                        enable: true
                    },
                    scrollInertia: 0
                });
                if (pageCount == 0) {
                    Backbone.trigger('todoEmptyDataEvent');
                }
                return response.data;
            }
        })
        // App.Notice.NoticeCollection.reset();
        // App.Notice.NoticeCollection.fetch({
        // 	data:extendData,
        // 	success: function(collection, response, options) {
        // 		//隐藏加载
        // 		$("#pageLoading").hide();
        // self.defaults.searchData = response.data.data;
        // 	}
        // })
    }
}