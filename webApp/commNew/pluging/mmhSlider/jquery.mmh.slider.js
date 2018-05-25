(function($) {

	var tpl = "<li class='{class}' style='background-image:url({src})'><a href='#projects/{projectId}/{versionId}' style='width:100%;height:100%;display:inline-block;'></a></li>",
		toolTpl = "<label class='{class}'>&bull;</label>",
		timer=null;

	$.fn.mmhSlider = function(name, options) {
		var _setting = null;
		if(timer){
			clearInterval(timer)
		}
		if (typeof name === 'string') {
			return $(this);
		} else {
			options = name;
			_setting = $.extend({},
				$.fn.mmhSlider.defaults, options);
			$.fn.mmhSlider.methods['init']($(this), _setting);
		}
		return $(this);
	}
	$.fn.mmhSlider.methods = {
		init: function($dom, setting) {
			var _def=$.fn.mmhSlider.defaults;
			var delay = setting.delay,
				_pause=_def._pause;
			$.fn.mmhSlider.defaults._index=0;
			if(setting.noData){
				setting.noData();
				return ;
			}
			this.cacheArray(setting.data.length);
			$.fn.mmhSlider.methods.render($dom, setting, function(data) {
				//定时器任务
				timer=setInterval(function() {
					if(_pause){
						return 
					}
					$.fn.mmhSlider.methods.next($dom,setting,data);
				}, delay)
				
				$dom.find("li").hover(function() {
					_pause = true;
				}, function() {
					_pause = false
				})
			})

		},
		cacheArray:function(size){
			var a=[];
			for(var i=1;i<size;i++){
				a.push(i);
			}
			a.push(0);
			$.fn.mmhSlider.methods.caches=a;
		},
		cache:function(i){
			var a=$.fn.mmhSlider.methods.caches;
			return a[i];
		},
		
		next:function($dom,setting,data){
			var _this=this;
			var _index=$.fn.mmhSlider.defaults._index;
			var $current = $dom.find("li.selected"),
				$currentLabel = $dom.find("label.flag"),

				$nextItem = $dom.find("li").eq(_this.cache(_index)),
				$nextLable=$dom.find("label").eq(_this.cache(_index));
			
			$current.removeClass('selected').addClass('remove');
			$nextItem.removeClass('remove').addClass('selected');

			$currentLabel.toggleClass('flag');
			$nextLable.toggleClass('flag');

			$.fn.mmhSlider.defaults._index=_this.cache(_index);
			setting.onChange(data[_this.cache(_index)]);
		},
		
		random:function($dom,setting,data){
			var $current = $dom.find("li.selected"),
				_index=$.fn.mmhSlider.defaults._index;
			$current.removeClass('selected').addClass('remove');
			$dom.find("label").eq($current.index()).toggleClass('flag');
			$dom.find("label").eq(_index).toggleClass('flag');
			$dom.find("li").eq(_index).removeClass('remove').addClass('selected');
			setting.onChange(data[_index]);
			$dom.find(".slideTitle").html(data[_index].title||data[_index].name)
		},

		render: function($dom, setting, callback) {
			var data = setting.data || [],
				result = ["<ul>"],
				tools = ["<div class='toolbar'>"];
			for (var i = 0, size = data.length; i < size; i++) {
				var _ = tpl,
					__ = toolTpl;
				_ = _.replace('{class}', i == 0 ? 'selected' : 'remove');
				_ = _.replace('{projectId}', data[i].projectId);
				_ = _.replace('{versionId}', data[i].versionId);
				__ = __.replace('{class}', i == 0 ? 'nonFlag flag' : 'nonFlag');
				_ = _.replace('{src}', data[i].image);
				result.push(_);
				tools.push(__);
			}
			tools.push("</div>");
			result.push("</ul>");
			result = result.concat(tools);
			result.push('<div class="slideTitle">' + (data[0].title)+ '</div>');
			$dom.empty().prepend(result.join(""));
			
			setting.onChange(data[0]);
			
			callback(data);
			$dom.find("label").on("click",function(){
				$.fn.mmhSlider.defaults._index=$(this).index();
				$.fn.mmhSlider.defaults._pause=true;
				setTimeout(function(){
					$.fn.mmhSlider.defaults._pause=false;
				},5000)
				$.fn.mmhSlider.methods.random($dom,setting,data);
			})
		},
		
		change:function($dom,index){}
	}
	$.fn.mmhSlider.defaults = {
		delay: 1000,
		_index:0,
		_pause:false,
		onChange: function() {

		}
	}
}(jQuery))