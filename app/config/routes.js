var home = require('../controllers/home'),
    labs = require('../controllers/labs');

exports = module.exports = function(server) {


  //canvas test
  server.all('/demos/canvastest', labs.canvastest.index);

  // barcamp physic presentation
  server.all('/demos/barcampclt_physics/:id', labs.barcampclt_physics.section );
  server.all('/demos/barcampclt_physics', labs.barcampclt_physics.index);

  // labs home
  server.all('/', home.index);
};
