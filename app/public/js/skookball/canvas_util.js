;(function() {
	var full_circle = Math.PI * 2;
	
	window.cUtil = {
		circle: function(ctx, x, y, r) {
			ctx.beginPath();
			ctx.arc(x, y, r, 0, full_circle, true);
			ctx.closePath();
		}
		, fullscreen: function(canvas, callback) {
			window.onresize = function() {
				canvas.width = window.innerWidth || document.documentElement.clientWidth;
				canvas.height = document.documentElement.clientHeight;
				callback && callback(canvas.width, canvas.height);
			}
			window.onresize();
		}
	};
})();