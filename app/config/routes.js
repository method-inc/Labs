var home = require('../controllers/home'),
    labs = require('../controllers/labs');

exports = module.exports = function(server) {

  server.all('/demos/:section/:id', labs.section );
  server.all('/demos/:section', labs.index);
  server.all('/:section/:id', labs.section );
  server.all('/:section', labs.index);
  server.all('/', home.index);
};
