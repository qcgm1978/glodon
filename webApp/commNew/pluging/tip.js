$.tip=function(options){
	var defaults={
		type:'success',
		message:'hello',
		timeout:2000
	}
	options=$.extend({},defaults,options);
	var tpl='<div class="mmhTip"><div class="content '+options.type+'"><i></i>'+options.message+'</div></div>';
	var _self=$(tpl).appendTo($('body'));
	_self.animate({
		top:'40px'
	},1000)
	setTimeout(function(){
		_self.remove();
	},options.timeout)
}