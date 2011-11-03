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
  server.all('/demos/barcampclt_physics/:id', labs.barcampclt_physics.section );
  server.all('/demos/barcampclt_physics', labs.barcampclt_physics.index);

  // labs home
  server.all('/', home.index);
};
