App.Services.searchView = Backbone.View.extend({
  tagName: 'div',
  className: 'logSearch',
  events: {
    "click .btnSearch": "searchProject",
    "click .btnClear": "clearSearch",
    "change .txtSearch": "linkSearchWord",
    "keydown .txtInput": "enterSearch"
  },
  template: _.templateUrl("/services/tpls/log/log.search.html"),
  render: function() {
    var _this = this;
    this.$el.html(this.template());
    this.$(".pickProjectType").myDropDown({
      zIndex: 99,
      click: function($item) {
        $(this).find(".text").css("color","#666");
        App.Services.formData.moduleType = $item.attr('data-val');
      }
    });
    this.$(".typeItem").myDropDown({
      zIndex: 99,
      click: function($item) {
        App.Services.formData.entityType = $item.attr('data-val');
      }
    });
    setTimeout(function() {
      $(".calendar").click(function() {
        $(this).next().focus();
      });
    }, 3000);

    this.$('#dateStar').datetimepicker({
      language: App.Local.getTimeLang(),
      autoclose: true,
      format: 'yyyy-mm-dd',
      minView: 'month'
    }).on("changeDate", function(ev) {
      var _dateStr = new Date(ev.date.getTime() - 24 * 60 * 60 * 1000).format('yyyy-MM-dd');
      _this.$('#dateEnd').datetimepicker('setStartDate', _dateStr);
      _this.$('#dateEnd1').val('');
    });
    this.$('#dateEnd').datetimepicker({
      language: App.Local.getTimeLang(),
      autoclose: true,
      format: 'yyyy-mm-dd',
      minView: 'month'
    }).on("changeDate", function(ev) {

    });
    this.$('#dateStar').on('change', function() {
      App.Services.formData.opTimeStart = $(this).val();
    })
    this.$('#dateEnd').on('change', function() {
      App.Services.formData.opTimeEnd = $(this).val();
    })
    return this;
  },
  clearSearch: function() {
    App.Services.formData.moduleType = "";
    App.Services.formData.entityType = "";
    App.Services.formData.opTime = "";
    App.Services.formData.entityName = "";
    App.Services.formData.operator = "";
    App.Services.formData.opContent = "";
    App.Services.formData.opTimeStart = "";
    App.Services.formData.opTimeEnd = "";
    App.Services.formData.orderName = "";
    App.Services.formData.orderSort = "";
    this.$(".pickProjectType .text").css("color","#aaa").html('类别');
    this.$(".btnRadio").removeClass('selected');
    this.$('#dateStar').val('');
    this.$('#dateEnd').val('');
    this.$('.moreSeachText').val('');
    $(".header").find("i.sortI").removeClass("descClass")
    App.Services.Settings.pageIndex = 1;
    App.Services.loadData(App.Services.formData);
  },
  enterSearch: function(e) {
    if (e && e.keyCode == '13') {
      this.searchProject();
    }
  },
  //显示隐藏高级收缩
  seniorSearch: function() {
    var $advancedQueryConditions = this.$el.find(".advancedQueryConditions");
    if ($advancedQueryConditions.is(":hidden")) {
      this.$el.find(".quickSearch").hide();
      this.$el.find(".advancedQueryConditions").show();
      $("#projectModes").addClass("projectModesDown");
      //当前按钮添加事件
      this.$el.find(".seniorSearch").addClass('down');
    } else {
      this.$el.find(".quickSearch").show();
      this.$el.find(".advancedQueryConditions").hide();
      $("#projectModes").removeClass("projectModesDown");
      //当前按钮添加事件
      this.$el.find(".seniorSearch").removeClass('down');
    }
    this.$el.find(".seniorSearch i").toggleClass('icon-angle-down  icon-angle-up');
  },
  //搜索项目
  searchProject: function() {
    var name = $("#name").val().trim(),
      account = $("#account").val().trim(),
      opContent = $("#keyWord").val().trim();
    App.Services.formData.entityName = name;
    App.Services.formData.operator = account;
    App.Services.formData.opContent = opContent;
    App.Services.Settings.pageIndex = 1;
    App.Services.loadData(App.Services.formData);
  },
  linkSearchWord: function(e) {
    this.$('.moreSeachText').val($(e.currentTarget).val());
  }
});