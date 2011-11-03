;(function($) {

	function FPS(el_selector) {
		this.el = $(el_selector);
		this.last_tick = 0;
		this.last_fps_tick = 0;
		this.frames = 0;
		this.fps = 0;
		this.slice = 0;
	}
	FPS.get_tick = function() {
		return new Date().getTime();
	};
	FPS.prototype.start = function() {
		this.last_tick = this.last_fps_tick = FPS.get_tick();
	};
	FPS.prototype.enter_frame = function() {
		this.frames += 1;
		
		var current_tick = FPS.get_tick();
		var time_slice = current_tick - this.last_tick;
		this.last_tick = current_tick;
		
		if (this.frames % 20 === 0) {
			this.fps = ~~(this.frames / ((current_tick - this.last_fps_tick) / 1000));
			this.frames = 0;
			this.last_fps_tick = current_tick;
			this.slice = time_slice;
			this.render();
		}
		return time_slice;
	};
	FPS.prototype.render = function() {
		this.el.html("fps: " + this.fps + ", slice: " + this.slice);
	};

	window.FPS = FPS;

})(jQuery);