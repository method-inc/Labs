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
				callback && callback();
			}
			window.onresize();
		}
	};
})();


;(function(cUtil) {
	
		function Box(w, h, a) {
			this.w = w;
			this.h = h;
			this.a = a;
			this.g = 1;
			this.st = 1;	// scale transform
		}
		Box.prototype.clear = function() {
			ctx.clearRect(-this.w * .5 - 3, -this.h * .5 - 3, this.w + 6, 6);
			ctx.clearRect(this.w * .5 - 3, -this.h * .5 - 3, 6, this.h + 6);
			ctx.clearRect(-this.w * .5 - 3, this.h * .5 - 3, this.w + 6, 6);
			ctx.clearRect(-this.w * .5 - 3, -this.h * .5 - 3, 6, this.h + 6);
		};
		Box.prototype.draw = function() {
			ctx.save();
				ctx.fillStyle = "#505";
				ctx.fillRect(-this.w * .5 - 2, -this.h * .5 - 2, this.w + 4, 4);
				ctx.fillRect(this.w * .5 - 2, -this.h * .5 - 2, 4, this.h + 4);
				ctx.fillRect(-this.w * .5 - 2, this.h * .5 - 2, this.w + 4, 4);
				ctx.fillRect(-this.w * .5 - 2, -this.h * .5 - 2, 4, this.h + 4);
			ctx.restore();
		};
	
		function Ball() {
			this.r = ~~(Math.random() * 7 + 7);			
			this.x = Math.random() * (box.w - this.r * 2) - box.w * .5 + this.r;
			this.y = Math.random() * (box.h - this.r * 2) - box.h * .5 + this.r;
			this.vx = 0;
			this.vy = 10;
			this.slickness = Math.random() * .3;
		}
		Ball.colors = [
			"rgba(255, 255, 255, .33)",
			"#fff"
		];
		Ball.prototype.clear = function() {
			ctx.save();
				if(state.integers === 1) {
					ctx.translate(~~this.x, ~~this.y);
				}	
				else {
					ctx.translate(this.x, this.y);
				}
				ctx.clearRect(-this.r - 1, -this.r - 1, this.r * 2 + 2, this.r * 2 + 2);			
			ctx.restore();
		};
		Ball.prototype.loss = function() {
			return Math.random() * .3 + .7;
		};
		Ball.prototype.update = function() {
			this.vx += box.g * Math.cos(box.a) + this.slickness;
			this.vy += box.g * Math.sin(box.a) + this.slickness;
			this.x += this.vx;
			this.y += this.vy;
			this.vx *= .993;
			this.vy *= .993;
			if (this.x > box.w * .5 - this.r) {
				this.x = box.w * .5 - this.r;
				this.vx = -Math.abs(this.vx) * this.loss();
			}
			else if(this.x < box.w * -.5 + this.r) {
				this.x = box.w * -.5 + this.r;
				this.vx = Math.abs(this.vx) * this.loss();
			}
			if (this.y > box.h * .5 - this.r) {
				this.y = box.h * .5 - this.r;
				this.vy = -Math.abs(this.vy) * this.loss();
			}
			else if (this.y < box.h * -.5 + this.r) {
				this.y = -box.h * .5 + this.r;
				this.vy = Math.abs(this.vy) * this.loss();
			}
		};
		Ball.prototype.draw = function() {
			ctx.save();
				if (state.integers === 1) {
					ctx.translate(~~this.x, ~~this.y);
				}
				else {
					ctx.translate(this.x, this.y);
				}
				//ctx.fillStyle = "#fff";
				ctx.fillStyle = Ball.colors[state.fillstyle];
				cUtil.circle(ctx, 0, 0, this.r);
				ctx.fill();
			ctx.restore();
		};
		
		function FPS() {
			this.el = $("#fps");
			this.last_tick = 0;
			this.last_fps_tick = 0;
			this.frames = 0;
			this.fps = 0;
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
				this.render();
			}
			return time_slice;
		};
		FPS.prototype.render = function() {
			this.el.html("fps: " + this.fps);
		};

		function BallFactory(n) {
			var b = [];
			while(n--) {
				b.push(new Ball());
			}
			return b;
		}

		
		
		var state = {
			clear: 0,
			bg: 0,
			ballcount: 50,
			integers: 0,
			scaling: 0,
			fillstyle: 0
		};
		
		
		var canvas = document.getElementById("demo");
		var ctx = canvas.getContext("2d");
		var fps = new FPS();
		
		var box = new Box(400, 400, 0);
		
		
		var balls = BallFactory(state.ballcount);


		$('#controls input:radio').change(function() {
			if ($(this).attr("checked")) {
				state[$(this).attr("name")] = parseInt($(this).val(), 10);
				if (console.log) {
					console.log("state." + $(this).attr("name") + " = " + $(this).val());
				}
				if ($(this).attr("name") === "bg") {
					if($(this).val() === "1") {
						$("#demo_container").addClass("flat");
					}
					else {
						$("#demo_container").removeClass("flat");
					}
				}
				else if ($(this).attr("name") === "ballcount") {
					canvas.width = canvas.width;
					balls = BallFactory(state.ballcount);
				}
				else if ($(this).attr("name") === "scaling") {
					if($(this).val() === "1") {
						canvas.width = canvas.width * .5;
						canvas.height = canvas.height * .5;
						$("#demo").addClass("stretched");
					}
					else {
						$("#demo").removeClass("stretched");
						$(window).resize();
					}
				}
			}
			else {
				console.log($(this).attr("checked"));
			}
		}).each(function() {
			$(this).change();
		});


		cUtil.fullscreen(canvas, function() {
			// Code for when window is resized
		});
		
		var mouse_x = .5, mouse_y = 1;
		$(canvas).mousemove(function(event) {
			mouse_x =  (event.pageX / canvas.width);
			mouse_y = (event.pageY / canvas.height);
		});
		
		fps.start();
		var i;
		window.setInterval(function() {
			
			fps.enter_frame();
			
			// Clear the scene

			if (state.clear === 0) {
				ctx.clearRect(0, 0, canvas.width, canvas.height);
			}
			else if (state.clear === 1) {			
				 canvas.width = canvas.width;
			}
			else if (state.clear === 2) {
				ctx.save();
					ctx.translate(canvas.width * .5, canvas.height * .5);
					if (state.scaletransform === 1) {
						ctx.scale(box.st, box.st);				
					}
					ctx.rotate(-box.a + Math.PI * .5);
					box.clear();	
					i = balls.length;
					while(i--) {
						balls[i].clear();
					}	
				ctx.restore();
			}
			
			if (state.chromefix === 1) {
				ctx.clearRect(0, 0, 1, 1);
				ctx.clearRect(canvas.width - 2, canvas.height - 2, 1, 1);
			}
						
			// Update the scene
			
			if (state.rotation === 0) {
				box.a -= Math.PI * .007;
			}
			else {
				box.a = mouse_x * Math.PI * -2;
			}
			if (state.scaletransform === 0) {
				box.st = 1;
			}
			else {
				box.st = 1 + 3 * (1 - mouse_y);
			}
			i = balls.length;
			while(i--) {
				balls[i].update();
			}
			
			// Draw the scene
			ctx.save();
				ctx.translate(canvas.width * .5, canvas.height * .5);
				if (state.scaletransform === 1) {
					ctx.scale(box.st, box.st);
				}
				ctx.rotate(-box.a + Math.PI * .5);
				box.draw();
				i = balls.length;
				while(i--) {
					balls[i].draw();
				}
			ctx.restore();

		}, 1000 / 77);

	
	})(cUtil);
	
