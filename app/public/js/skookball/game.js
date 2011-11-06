
(function(cUtil) {
  
  var turn_speed = (moveable()) ? 0.005 : 0.015 ;

  // Constructor functions & prototypes
      
  function Player(id, name, x, y, a) {
    this.id = id;
    this.name = name;
    this.x = x;
    this.y = y;
    this.a = a;   // angle of rotation, in radians
    this.vx = 0;
    this.vy = 0;
    this.old_vx = 0;
    this.old_vy = 0;
    this.turn_right = false;
    this.turn_left = false;
    this.thrust = false;
    this.impulse = false;
    this.last_impulse = 0;
    this.impulse_power = 7;
    this.impulse_delay = 1000;
    this.r  = 16;
    this.gravity = 1;
    this.last_stun = 0;
    this.stun_time = 500;
    this.hold_strength = 10;
    this.kick_strength = 4;
    this.ball = null;
  }
  Player.prototype._lose_ball = function() {
    var b = this.ball;
    this.ball.drop();   
    this.last_stun = fps.last_tick + this.stun_time;          
    return b;
  };
  Player.prototype.blast = function() {
    
    if (this.ball === null) {
      if (this.last_impulse > fps.last_tick)
        return;
      this.impulse = true;
      this.last_impulse = fps.last_tick + this.impulse_delay;
      new Boom(this.x, this.y, this.r, 5, "255, 255, 0", 15); 
    }
    else {
      var ball = this._lose_ball();
      ball.vx = this.kick_strength * Math.cos(this.a);
      ball.vy = this.kick_strength * Math.sin(this.a);
      if (ball.vx / this.vx > 0) {
        ball.vx += this.vx;
      }
      if (ball.vy / this.vy > 0) {
        ball.vy += this.vy;
      }
    }
  };
  Player.prototype.draw = function() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.a);
    ctx.fillStyle = "#888";
    if (this.last_impulse < fps.last_tick) {
      ctx.strokeStyle = "#ff0";
      ctx.strokeWidth = 5;
    }
    cUtil.circle(ctx, 0, 0, this.r);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#ff0";
    ctx.fillRect(this.r * 0.1, -this.r * 0.2, this.r * 1, this.r * 0.4); 
    ctx.rotate(-this.a + view.a + Math.PI * 0.5);
    ctx.translate(0, this.r + 20);      
    ctx.scale(1/view.z, 1/view.z);
    ctx.textAlign = "center";
    ctx.fillStyle = "#999";
    ctx.fillText(this.name, 0, 0, this.r * 2 + 20);
    ctx.restore();
  };
  Player.prototype.clear = function() {
    ctx.save();
    ctx.translate(this.x, this.y);
    //ctx.rotate(this.a);
    ctx.fillStyle = "#000";
    ctx.rotate(view.a + Math.PI * 0.5);          
    ctx.fillRect(-this.r - 3, -this.r - 3, this.r * 2 + 6, this.r * 2 + 6);
    ctx.translate(0, this.r + 20);      
    ctx.scale(1/view.z, 1/view.z);
    ctx.fillRect(-this.r - 12, -12, this.r * 2 + 24, 16);
    ctx.restore();
  };
  Player.prototype._check_bounds = function() {
    // Check boundaries
    if (this.x > level.width * 0.5) {
      this.x = level.width * 0.5;
      this.vx = -Math.abs(this.vx) * level.wall_bounce;
    }
    else if (this.x < level.width * -0.5) {
      this.x = level.width * -0.5;
      this.vx = Math.abs(this.vx) * level.wall_bounce;
    }
    if (this.y > level.height * 0.5) {
      this.y = level.height * 0.5;
      this.vy = -Math.abs(this.vy) * level.wall_bounce;
    }
    else if (this.y < level.height * -0.5) {
      this.y = level.height * -0.5;
      this.vy = Math.abs(this.vy) * level.wall_bounce;
    }   
  };
  Player.prototype.update = function(slice) {
    if (this.turn_right) {
      this.a += Math.PI * turn_speed * slice;
    }
    if (this.turn_left) {
      this.a -= Math.PI * turn_speed * slice;
    }
    if (this.impulse) {
      this.vx += this.impulse_power * Math.cos(this.a);
      this.vy += this.impulse_power * Math.sin(this.a);
      this.impulse = false;
    }     
    else if (this.thrust) {
      this.vx += 0.2 * Math.cos(this.a) * slice;
      this.vy += 0.2 * Math.sin(this.a) * slice;
    }
    else if (this.brake) {
      this.vx -= 0.07 * Math.cos(this.a) * slice;
      this.vy -= 0.07 * Math.sin(this.a) * slice;
    }
    this.x += this.vx;
    this.y += this.vy;
    
    // Friction / drag
    this.vx *= (1 - (0.01 * slice));
    this.vy *= (1 - (0.01 * slice));
    
    this._check_bounds();
          
    // Interact with ball 
    var i = game.balls.length;
    while(i--) {
      var ball = game.balls[i];
      var ax = this.vx - this.old_vx,
        ay = this.vy - this.old_vy,
        acceleration = Math.sqrt(ax * ax + ay * ay) / slice;
      if (acceleration > this.hold_strength && this.ball !== null) {
        this._lose_ball();
      }
      if (this.ball === null) {
        var bx = this.x - ball.x, by = this.y - ball.y,
          bd = Math.sqrt(bx * bx + by * by);
        if (this.last_stun < fps.last_tick) {
          ball.add_candidate(this, bd);
        }     
      }
    }
    
    
          
    this.old_vx = this.vx;
    this.old_vy = this.vy;
  };
  
  function LocalPlayer(player) {
    this.player = player;
    $(document).keydown(function (event) {
      switch(event.which) {
        case 37:  // Left
          player.turn_left = true;
        break;
        case 38:  // Up
          player.thrust = true;
        break;
        case 39:  // Right
          player.turn_right = true;
        break;
        case 40:  // Down
          player.brake = true;
        break;
        case 32:  // Space
          player.blast();
        break;
      }
      });
      $(document).keyup(function (event) {
        switch(event.which) {
          case 37:
            player.turn_left = false;
          break;
          case 38:
            player.thrust = false;
          break;
          case 39:
            player.turn_right = false;
          break;
          case 40:
            player.brake = false;
          break;
        }
      });

    $("#arena").click(function() {
      player.blast();
    });

    if (moveable) {
      window.addEventListener("devicemotion", function(e) {
        
        var xsensitivity = 0.75;
        var ysensitivity = 0.5;
         
        var accel= e.accelerationIncludingGravity,
            x = accel.x,
            y = accel.y;
        if (x < -xsensitivity) player.turn_left = true;
        else if (x > xsensitivity) player.turn_right = true;
        else {
          player.turn_left = false;
          player.turn_right = false;
        }
        if (y < -ysensitivity) player.brake = true;
        else if (y > ysensitivity) player.thrust = true;
        else {
          player.brake = false;
          player.thrust = false;
        }

      }, true);
    }
  }
  
  function Game() {
    this.teams = [];
    this.players = [];
    this.balls = [];
    this.fx = [];
    this.game_state = GS.WAITING;
    this.target_fps = 77;
  }
  Game.prototype.add_player = function(player) {
    this.players.push(player);
  };
  Game.prototype.add_ball = function(ball) {
    this.balls.push(ball);
  };
  Game.prototype.update = function(slice) {
    var i;
    
    level.update(slice);
    
    i = this.fx.length;
    while(i--) {
      this.fx[i].update(slice);
    }
    
    i = this.players.length;
    while(i--) {            
      this.players[i].update(slice);
    }
    
    i = this.balls.length;
    while(i--) {
      this.balls[i].update(slice);  // "I don't like balls and slice in the same line of code." - fansipans
    }
  };
  
  function View(k, ox, oy, target, tight, viewport) {
    this.target = target; // target = {x, y, a}
    this.k = k;
    this.ox = ox;
    this.oy = oy;
    this.x = target.x;
    this.y = target.y;
    this.a = target.a;
    this.tight_constant = tight;
    this.model_viewport = viewport;
    this.update_size(viewport);
  }
  View.prototype.hard_clear = function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };
  View.prototype.update_size = function(size) {
    var max_zoom = this.tight_constant * (size / this.model_viewport);
    this.tight_z = this.z = max_zoom;
    this.wide_z = this.tight_z * 0.4;
  };
  View.prototype._push_matrix = function() {
    ctx.save();
    ctx.translate(canvas.width * this.ox, canvas.height * this.oy);
    ctx.scale(this.z, this.z);
    ctx.rotate(-this.a + Math.PI * 1.5);
    ctx.translate(-this.x, -this.y);    

    // idea: calculate the overlay shape of the camera on top of the arena
    // then use canvas' isPointInPath on each object to see if that point falls within
    // the camera's view area. If it doesn't, then don't draw OR CLEAR it
    
    /*
    var ul = {
      x: this.x - ((canvas.width * .5) / ,
      y:0
    };
    ctx.beginPath();
    ctx.moveTo()
    */
    
  };
  View.prototype.clear = function() {
    //canvas.width = canvas.width;    // For debugging quickly
    //return;
    
    var i, Player;
          
    this._push_matrix();            
    
    i = game.fx.length;
    while(i--) {
      game.fx[i].clear();
    }

    i = game.players.length;
    while(i--) {
      Player = game.players[i];
      Player.clear();
    }
    
    i = game.balls.length;
    while(i--) {
      game.balls[i].clear();
    }

    level.clear();      // After lots of experimenting, it turns out that whatever draw
                    // operations are put high in this function get really slow in webkit. no idea why.
    
    ctx.restore();    
  };
  View.prototype.update = function(slice) {
    var t = this.target;
    this.x += (t.x - this.x) * this.k * 0.75 * slice;
    this.y += (t.y - this.y) * this.k * 0.75 * slice;
    this.a += (t.a - this.a) * this.k * slice;
    var normalized_speed = Math.sqrt(t.vx * t.vx + t.vy * t.vy) / (20);
    var target_z = Math.max(this.wide_z, this.tight_z - normalized_speed);
    this.z += (target_z - this.z) * this.k * slice;
  };
  View.prototype.render = function() {
    var i, Player;
  
    this._push_matrix();
  
    level.draw();
    
    i = game.fx.length;
    while(i--) {
      game.fx[i].draw();
    }
    
    i = game.players.length;
    while(i--) {
      Player = game.players[i];
      Player.draw();
    }
    
    i = game.balls.length;
    while(i--) {
      game.balls[i].draw();
    }
    
    ctx.restore();
  };
  
  function Level(w, h) {
    this.width = w;
    this.height = h;
    this.points = [];
    this.wall_bounce = 0.2;
    this.marker_size = 5;     
    this._build_points();
  }
  Level.prototype._build_points = function() {
    this._drawLine(-this.width * 0.5, -this.height * 0.5, this.width * 0.5, -this.height * 0.5, 5, 16);
    this._drawLine(-this.width * 0.5, -this.height * 0.5, -this.width * 0.5, this.height * 0.5, 5, 8);
    this._drawLine(-this.width * 0.5, this.height * 0.5, this.width * 0.5, this.height * 0.5, 5, 16);
    this._drawLine(this.width * 0.5, -this.height * 0.5, this.width * 0.5, this.height * 0.5, 5, 8);      
    this._drawLine(-this.width * 0.4, 0, this.width * 0.4, 0, 5, 16);         
  };
  Level.prototype._drawLine = function(x1, y1, x2, y2, size, count) {
    var x = x1, y = y1,
      dx = (x2 - x1) / count,
      dy = (y2 - y1) / count;
    count++;
    while (count--) {
      this.points.push({x:x, y:y, fill:"#fff", stroke:"#f00"});
      x += dx;
      y += dy;
    }
  };
  Level.prototype.draw = function() {
    var i = this.points.length, p, wh = this.marker_size * 2, s = -this.marker_size;
    while(i--) {
      p = this.points[i];     
      ctx.save();
        ctx.fillStyle = p.fill;
        ctx.strokeStyle = p.stroke;
        ctx.lineWidth = 3;
        ctx.translate(p.x, p.y);          
        ctx.beginPath();
          ctx.rect(s, s, wh, wh);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      ctx.restore();
    }
  };
  Level.prototype.update = function() {
  
  };
  Level.prototype.clear = function() {
    var i = this.points.length, p, padding = 4, wh = this.marker_size * 2 + padding * 2, s = -this.marker_size - padding;
    while(i--) {
      p = this.points[i];     
      ctx.save();
        ctx.fillStyle = "#000";
        ctx.translate(p.x, p.y);          
        ctx.beginPath();
          ctx.rect(s, s, wh, wh);
        ctx.closePath();
        ctx.fill();
      ctx.restore();
    }
  };
  
  function Ball(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;   // radius
    this.vx = 0;
    this.vy = 0;
    this.drag = 0.005;
    this.cutoff = this.r * 10;  // cutoff distance for player gravity fields
    this.owner = null;
    this.candidates = [];
    this.last_ripple = 0;
  }
  Ball.prototype.drop = function() {
    this.owner.ball = null;
    this.owner = null;
  };
  Ball.prototype.draw = function() {
    ctx.save();
      ctx.translate(this.x, this.y);
      ctx.fillStyle = "#fff";
      //ctx.strokeStyle = "#fff";
      //ctx.lineWidth = 2;
      cUtil.circle(ctx, 0, 0, this.r);
      ctx.fill();
      ctx.stroke();
    ctx.restore();
  };
  Ball.prototype.clear = function() {
    ctx.save();
      ctx.translate(this.x, this.y);
      ctx.clearRect(-this.r - 1, -this.r - 1, this.r * 2 + 2, this.r * 2 + 2);
    ctx.restore();
  };
  Ball.prototype._check_bounds = function() {
    // Check boundaries
    if (this.x > level.width * 0.5) {
      this.x = level.width * 0.5;
      this.vx = -Math.abs(this.vx) * 0.75;
    }
    else if (this.x < level.width * -0.5) {
      this.x = level.width * -0.5;
      this.vx = Math.abs(this.vx) * 0.75;
    }
    if (this.y > level.height * 0.5) {
      this.y = level.height * 0.5;
      this.vy = -Math.abs(this.vy) * 0.75;
    }
    else if (this.y < level.height * -0.5) {
      this.y = level.height * -0.5;
      this.vy = Math.abs(this.vy) * 0.75;
    }   
  };
  Ball.prototype.add_candidate = function(Player, distance) {
    this.candidates.push({d: distance, Player: Player});
  };
  Ball.prototype.pickup = function(new_owner) {
    if (new_owner.ball === null) {
      this.owner = new_owner;
      new_owner.ball = this;
      new_owner.vx += this.vx * 0.3;
      new_owner.vy += this.vy * 0.3;   
    }
  };
  Ball.prototype.update = function(slice) {
    if (this.owner !== null) {
      this.x = this.owner.x;
      this.y = this.owner.y;
    }
    else {
      this.x += this.vx * slice;
      this.y += this.vy * slice;
      this.vx *= (1 - (this.drag * slice));
      this.vy *= (1 - (this.drag * slice));
      this._check_bounds();
      var i = this.candidates.length, best = {d: 1000, Player: null}, c;
      while(i--) {
        c = this.candidates[i];
        if (c.d < best.d) {
          best = c;
        }
      }
      if (best.Player !== null) {
        if (best.d < (this.r + best.Player.r)) {
          this.pickup(best.Player);
        }
        else if (best.d < this.cutoff) {
          this.vx = this.vx * 0.99 + (best.Player.x - this.x) * best.Player.gravity * 0.01;
          this.vy = this.vy * 0.99 + (best.Player.y - this.y) * best.Player.gravity * 0.01;
        }               
      }
      var speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
      if (speed > 10 * slice && this.last_ripple < fps.last_tick) {
        new Boom(this.x, this.y, speed * 0.5, 0.5, "255, 255, 255", 100); 
        this.last_ripple = fps.last_tick + 75;
      }
    }
    if (this.candidates.length > 0) {
      this.candidates = [];
    }
  };
  
  function Goal(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
  }
  Goal.prototype.clear = function() {
  
  };
  Goal.prototype.draw = function() {
  
  };
  Goal.prototype.update = function() {
  
  };
  
  function Boom(x, y, r, speed, color, duration) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.speed = speed;
    this.color = color;
    this.duration = duration;
    this.lifetime = 0;
    game.fx.push(this);
  }
  Boom.prototype.draw = function() {
    ctx.save();
      ctx.translate(this.x, this.y);
      ctx.strokeStyle = "rgba(" + this.color + "," + (1 - this.lifetime / this.duration) + ")";
      ctx.lineWidth = 2;
      cUtil.circle(ctx, 0, 0, this.r);
      ctx.stroke();
    ctx.restore();
  };
  Boom.prototype.update = function(slice) {
    this.r += this.speed * slice;
    this.lifetime += slice;
    if (this.lifetime > this.duration) {
      game.fx.splice(game.fx.indexOf(this), 1);
    }
  };
  Boom.prototype.clear = function() {
    var padding = 2;
    ctx.save();
      ctx.translate(this.x, this.y);
      ctx.clearRect(-this.r - padding, -this.r - padding, (this.r + padding) * 2, (this.r + padding) * 2);
    ctx.restore();
  };
  
  
  // Enums

  var GS = {      // Game State
    WAITING: 0
  };
      
  // /Enums


  // Action

  var canvas = document.getElementById("arena");
  var ctx = canvas.getContext("2d");
  
  canvas.width = 640;
  canvas.height = 480;
  
  var fps = new FPS("#fps");
  
  var game = new Game();
  
  var level = new Level(3000, 1500);
  
  var player = new Player(0, "Hunter", 0, 100, Math.PI * 1.5);

  var view = new View(0.1, 0.5, 0.75, player, 1.75, 800);
  var user = new LocalPlayer(player);
  
  var ball = new Ball(0, 0, 10);
  var otherball = new Ball(0, -50, 10);

  cUtil.fullscreen(canvas, function(w, h) {
    // Code for when window is resized
    var smallest = (w < h) ? w : h;
    view.update_size(smallest);
    view.hard_clear();
  });

  
  game.add_player(player);
      
  game.add_ball(ball);
  game.add_ball(otherball);
  
  game.add_player(new Player(1, "OtherPlayer", 100, 100, Math.PI * 1.5));
  game.add_player(new Player(1, "OtherPlayer", -100, 100, Math.PI * 1.5));
  game.add_player(new Player(1, "OtherPlayer", -100, -100, Math.PI * 1.5));   
  game.add_player(new Player(1, "OtherPlayer", 100, -100, Math.PI * 1.5));    

  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  var slice, ms_per_frame = (1000 / game.target_fps), max_slice = ms_per_frame * 4;
  window.setInterval(function() {
    slice = fps.enter_frame();
    slice = Math.min(max_slice, slice / ms_per_frame);  // So all the functions can behave as if it's constantly running at ideal framerates      

    view.clear();
    game.update(slice);
    view.update(slice);
    view.render();
    
  }, ms_per_frame);

})(window.cUtil);