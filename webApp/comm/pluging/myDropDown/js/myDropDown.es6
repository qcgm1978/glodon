;(function($){

 

 $.fn.myDropDown=function(opts){

 		var settings={
 			click:null, //点击事件
 			zIndex:9
 		}
 	 
 		this.settings=$.extend(settings,opts);

 		//z-index
 		$(this).css("z-index",this.settings.zIndex); 
 	 

 		this.init=function(){
 			this.bindEvent();
 		}

 		this.bindEvent=function(){
 			var $that=$(this),that=this;
 			$that.on("click",".myDropText",function(){
 				//禁用
 			 	if ($(this).hasClass("disabled")) {
 			 		return;
 			 	}
 			 	
 			 	//点击箭头切换方向
 			 	if($that.find('.down').length >0){
 			 		$that.find(".myDropList").hide();
 			 	}else{
 			 		$that.find(".myDropList").show();
 			 	}
 			 	$that.find('.myDropArrorw').toggleClass('down');
 			});


 			$that.on("click",".myDropList .myItem",function(){
 			 	$(this).parents(".myDropDown").find(".myDropText .text").text($(this).text());
 			 	$(this).parents(".myDropList").hide();
 			 	/*$(this).closest(".myDropDown").find(".myDropText .text").text($(this).text());

 			 	$(this).closest(".myDropList").hide();*/

 			 	if ($.isFunction(that.settings.click)) {
 			 		that.settings.click.call(that,$(this));
 			 	}   
 			 	//更改箭头方向
 			 	$that.find('.myDropArrorw').toggleClass('down');
 			 	
 			 	return false;
 				 //$(document).trigger('click.myDropDown');
 			});


 			$(document).on("click.myDropDown",function(event){
 				 
 				var $target=$(event.target);
 				if ($target.closest($that).length<=0) {
 					$that.find(".myDropList").hide().end().find(".myDropArrorw").removeClass('down');
 				}
 			});

 		}

 		this.init();
 }


})(jQuery);