var home = require('../controllers/home'),
    labs = require('../controllers/labs');

exports = module.exports = function(server) {

  // skookball (with old routes)
  server.all('/demos/skookball', labs.skookball.index);
  server.all('/demos/barcampclt_physics/complex/skookball', labs.skookball.index);
  server.all('/demos/barcampclt_physics/complex/skookball/index.html', labs.skookball.index);

  //canvas test (with old routes)
  server.all('/demos/canvastest', labs.canvastest.index);
  server.all('/demos/barcampclt_physics/complex/canvastest', labs.canvastest.index);
  server.all('/demos/barcampclt_physics/complex/canvastest/index.html', labs.canvastest.index);

  // barcamp physic presentation
  server.all('/demos/barcampclt_physics/:section/:id', labs.barcampclt_physics.section );
  server.all('/demos/barcampclt_physics', labs.barcampclt_physics.index);

  // knockoutjs todo list
  server.all('/demos/knockout_todos', labs.knockout_todos.index);

  // labs home
  server.all('/', home.index);
};


// server.all('/labs/:section/:id', labs.section );
//   server.all('/labs', labs.index);