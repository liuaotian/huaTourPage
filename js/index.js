//获取url中的参数
function getUrlParam(name){
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
	var r = window.location.search.substr(1).match(reg);  //匹配目标参数
	if (r != null) return unescape(r[2]); return null; //返回参数值
}

$(function(){
	win_w=$(window).width(); //浏览器当前窗口可视区域宽度
	win_h=$(window).height(); //浏览器当前窗口可视区域高度
		/*滚动整屏效果开始*/
		var $scrollElem = $('html, body'),
		isIE6 = !-[1,] && !window.XMLHttpRequest,
		isMac = window.navigator.platform.toLowerCase().indexOf('mac') > -1;

		var PageCtrl = function(options) {
			this.init.call(this, options);
		};
		PageCtrl.prototype = {
			init: function(options) {
				this.curIndex = 0;
				this.wrapper = options.wrapper;
				this.pages = this.wrapper.children('.event');
				this.pageCount = this.pages.length;
				this.scrollTop = 0;
				this.isScroll = false;
				this._bindEvent();
			},

			_bindEvent: function(){
				var self = this;
				if (window.addEventListener) {
					window.addEventListener('DOMMouseScroll', function(event) {self.scroll.call(self, event)}, false);
					window.addEventListener('mousewheel', function(event) {
						self.scroll.call(self, event);
					}, false);
					window.addEventListener('MozMousePixelScroll', function(event) {
						event.preventDefault();
					}, false);
				} else {
					document.onmousewheel = function() {
						self.scroll.call(self);
					};
				}

				//change.page事件
				var topDelta = 50,
					animateName = isMac ? 'mac' : 'pc';
				var animateFn = {
					mac: function(scrollTop) {
						$scrollElem.animate({
							scrollTop: scrollTop
						}, 1000, function() {
							setTimeout(function() {
								self.isScroll = false;
							}, 500);
						});
					},
					pc: function(scrollTop) {
						$scrollElem.animate({
							scrollTop: scrollTop
						}, function() {
							self.isScroll = false;
						});
					}
				};
				this.wrapper.on('changepage', function(event, data){
					var $nextPage = self.pages.eq(data.nextIndex);
					self.pages.eq(data.prevIndex).trigger('exit');
					$nextPage.trigger('enter');
					self.scrollTop = data.nextIndex === 0 ? 0 : $nextPage.offset().top;
					self.scrollTop -= topDelta;
					animateFn[animateName](self.scrollTop);
				});


				// pages 进入/退出事件
				// self.pages.on('enter', function() {
				// 	var $this = $(this);
				// 	self.onEnter($this);
				// });
				// self.pages.on('exit', function() {
				// 	var $this = $(this);
				// 	self.onExit($this);
				// });

				//导航
				$("#nav li").click(function(){
					var i=$(this).index();
					$("#nav li").eq(i).addClass("active").siblings("#nav li").removeClass("active");
					self.setIndex(i);
				})

			},
			scroll: function(event) {
				var oEvent = event || window.event;
				if (oEvent.preventDefault) {
					oEvent.preventDefault();
				} else {
					oEvent.returnValue = false;
				}
				if (this.isScroll){
					return;
				}
				this.isScroll = true;
				var self = this,
					delta = oEvent.wheelDelta ? oEvent.wheelDelta : -oEvent.detail;
				var curIndex = 0;

				if (delta < 0) {
					curIndex = Math.min((self.curIndex + 1), self.pageCount - 1);
				} else {
					curIndex = Math.max((self.curIndex - 1), 0);
				}

				$("#nav li").eq(curIndex).addClass("active").siblings("#nav li").removeClass("active");
				self.setIndex(curIndex);
			},


			onEnter: function($dom) {
				$dom.addClass('animate-enter').removeClass('animate-exit');
			},


			onExit: function($dom) {
				$dom.removeClass('animate-enter').addClass('animate-exit');
			},

			setIndex: function(index) {
				var prevIndex = this.curIndex;
				this.curIndex = index;
				this.wrapper.trigger('changepage', {
					prevIndex: prevIndex,
					nextIndex: index
				});
			}
		};

		var pageCtrl = new PageCtrl({
			wrapper: $('#index')
		});
		/*滚动整屏效果结束*/
	var top=0;
	var top_index = getUrlParam('top');
	if(top_index!=''){
		top = $(".event").eq(top_index).offset().top-50;
		$("html,body").stop().animate({scrollTop: top},1000,"swing");
		$("#nav li").eq(top_index).addClass("active").siblings("#nav li").removeClass("active");
	}

})
//滚动函数
var Marquee = function(ul){
	//每次移动的个数
	var moveNum = $(ul).attr('moveNum') || 1;
	//单个元素移动的长度
	var w = $(ul).find('li').outerWidth(true);
	var changeLi = function(dir){
		for(var i=0;i<moveNum;i++){
			if(dir == 'r'){
				$(ul).find('li:first').appendTo($(ul));
			}else{
				$(ul).find('li:last').prependTo($(ul));
			}
		}
	}
	var move = function(dir){
		var _left = 0;
		if(dir == 'r'){
			_left = - moveNum * w ;
		}else{
			changeLi(dir);
			_left = moveNum * w ;
			$(ul).css('left',-_left);
			_left = 	0;
		}
		$(ul).animate({left:_left},500,function(){
			if(dir == 'r'){
				changeLi(dir);
			}
			$(ul).css('left','0');
		});
	}
	var picTimer_s;
	return {
		//自动滚动
		autoRun : function(){
			picTimer_s = setInterval(function() {
				move('r');
			},3000);
		},
		next : function(){
			this.stopRun();
			move('r');
			this.autoRun();
		},
		pre : function(){
			this.stopRun();
			move('l');
			this.autoRun();
		},
		stopRun : function(){
			clearInterval(picTimer_s);
		}
	}

};
//新闻资讯
var marquee_list3 = new Marquee($('#news-con ul'));
$("#prevarr3").click(function(){
	marquee_list3.pre();
})
$("#nextarr3").click(function(){
	marquee_list3.next();
});
